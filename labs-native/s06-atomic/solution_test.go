package lab

import (
	"sync"
	"testing"
)

func TestCounter(t *testing.T) {
	var c Counter
	var wg sync.WaitGroup
	for i := 0; i < 20; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for j := 0; j < 100; j++ {
				c.Increment()
			}
		}()
	}
	wg.Wait()
	if c.Load() != 2000 {
		t.Fatal(c.Load())
	}
}
