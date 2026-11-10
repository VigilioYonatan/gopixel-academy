package lab

import (
	"sync"
	"testing"
)

func TestIdempotency(t *testing.T) {
	var p PaymentStore
	var wg sync.WaitGroup
	for i := 0; i < 50; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if _, err := p.Charge("req-1", 250); err != nil {
				t.Error(err)
			}
		}()
	}
	wg.Wait()
	if p.total != 250 {
		t.Fatalf("duplicated: %d", p.total)
	}
	if _, err := p.Charge("req-2", 100); err != nil {
		t.Fatal(err)
	}
	if original, err := p.Charge("req-1", 250); err != nil || original != 250 {
		t.Fatal("replayed response changed", original, err)
	}
	if _, err := p.Charge("req-1", 300); err == nil {
		t.Fatal("key conflict accepted")
	}
}
