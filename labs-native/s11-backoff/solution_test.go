package lab

import (
	"context"
	"errors"
	"testing"
	"time"
)

func TestRetry(t *testing.T) {
	n := 0
	var waits []time.Duration
	err := Retry(context.Background(), 4, func() error {
		n++
		if n < 3 {
			return errors.New("transient")
		}
		return nil
	}, func(d time.Duration) error { waits = append(waits, d); return nil })
	if err != nil || n != 3 || len(waits) != 2 || waits[1] != 2*time.Millisecond {
		t.Fatalf("%v %d %v", err, n, waits)
	}
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if !errors.Is(Retry(ctx, 2, func() error { return nil }, func(time.Duration) error { return nil }), context.Canceled) {
		t.Fatal("cancel ignored")
	}
}
