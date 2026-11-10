package lab

import (
	"sync"
	"sync/atomic"
	"testing"
)

func TestConcurrentInventory(t *testing.T) {
	i, _ := NewInventory(7)
	var wg sync.WaitGroup
	var sold atomic.Int32
	for n := 0; n < 100; n++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if i.Reserve(1) {
				sold.Add(1)
			}
		}()
	}
	wg.Wait()
	if sold.Load() != 7 || i.Available() != 0 {
		t.Fatalf("sold %d, stock %d", sold.Load(), i.Available())
	}
	if i.Reserve(0) {
		t.Fatal("zero reservation")
	}
}
