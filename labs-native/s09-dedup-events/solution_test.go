package lab

import (
	"sync"
	"sync/atomic"
	"testing"
)

func TestDedup(t *testing.T) {
	var i Inbox
	var accepted atomic.Int32
	var wg sync.WaitGroup
	for n := 0; n < 100; n++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if i.Accept("e-42") {
				accepted.Add(1)
			}
		}()
	}
	wg.Wait()
	if accepted.Load() != 1 || i.Accept("") {
		t.Fatal("duplicate event accepted")
	}
}
