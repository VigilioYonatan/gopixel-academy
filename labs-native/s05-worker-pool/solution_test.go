package lab

import (
	"context"
	"errors"
	"sync/atomic"
	"testing"
)

func TestWorkerPool(t *testing.T) {
	var active, max atomic.Int32
	fn := func(_ context.Context, _ int) error {
		n := active.Add(1)
		for {
			m := max.Load()
			if n <= m || max.CompareAndSwap(m, n) {
				break
			}
		}
		active.Add(-1)
		return nil
	}
	if e := Process(context.Background(), []int{1, 2, 3, 4, 5}, 2, fn); e != nil {
		t.Fatal(e)
	}
	if max.Load() > 2 {
		t.Fatal("unbounded concurrency")
	}
	sentinel := errors.New("bad task")
	if !errors.Is(Process(context.Background(), []int{1, 2}, 1, func(context.Context, int) error { return sentinel }), sentinel) {
		t.Fatal("job error lost")
	}
	if e := Process(context.Background(), nil, 0, fn); e == nil {
		t.Fatal("invalid workers accepted")
	}
}
