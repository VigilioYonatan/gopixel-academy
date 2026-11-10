package orders

import (
	"context"
	"errors"
	"math"
	"sync"
	"sync/atomic"
	"testing"
	"time"
)

func store(t *testing.T, count int64) *Store {
	t.Helper()
	s, err := NewStore(map[string][2]int64{"book": {count, 1250}}, func() time.Time { return time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC) })
	if err != nil {
		t.Fatal(err)
	}
	return s
}
func TestIdempotencySameReceiptAndConflict(t *testing.T) {
	s := store(t, 5)
	r := Request{Key: "request-1", Product: "book", Quantity: 2}
	first, err := s.Submit(context.Background(), r)
	if err != nil {
		t.Fatal(err)
	}
	if first.TotalCents != 2500 || first.Remaining != 3 {
		t.Fatal(first)
	}
	_, err = s.Submit(context.Background(), Request{Key: "request-2", Product: "book", Quantity: 1})
	if err != nil {
		t.Fatal(err)
	}
	again, err := s.Submit(context.Background(), r)
	if err != nil || again != first {
		t.Fatalf("idempotency lost: %+v %+v", again, err)
	}
	_, err = s.Submit(context.Background(), Request{Key: "request-1", Product: "book", Quantity: 1})
	if !errors.Is(err, ErrConflict) {
		t.Fatalf("want conflict, got %v", err)
	}
	if stock, _ := s.Stock("book"); stock != 2 {
		t.Fatal("oversold/double-charge", stock)
	}
}
func TestAtomicInventoryUnderLoad(t *testing.T) {
	s := store(t, 17)
	var wg sync.WaitGroup
	var approved atomic.Int64
	for i := 0; i < 200; i++ {
		i := i
		wg.Add(1)
		go func() {
			defer wg.Done()
			_, err := s.Submit(context.Background(), Request{Key: "order-" + stringKey(i), Product: "book", Quantity: 1})
			if err == nil {
				approved.Add(1)
			} else if !errors.Is(err, ErrUnavailable) {
				t.Errorf("unexpected error %v", err)
			}
		}()
	}
	wg.Wait()
	if approved.Load() != 17 {
		t.Fatalf("approved %d", approved.Load())
	}
	if stock, _ := s.Stock("book"); stock != 0 {
		t.Fatalf("stock %d", stock)
	}
	if len(s.PendingEvents()) != 17 {
		t.Fatal("outbox count")
	}
}
func stringKey(n int) string {
	if n == 0 {
		return "0"
	}
	digits := ""
	for n > 0 {
		digits = string(rune('0'+n%10)) + digits
		n /= 10
	}
	return digits
}
func TestOutboxCopyAndAck(t *testing.T) {
	s := store(t, 2)
	_, _ = s.Submit(context.Background(), Request{Key: "k", Product: "book", Quantity: 1})
	p := s.PendingEvents()
	if len(p) != 1 {
		t.Fatal(p)
	}
	p[0].Type = "forged"
	if s.PendingEvents()[0].Type != "order.accepted" {
		t.Fatal("mutable alias")
	}
	if err := s.AckEvent(1); err != nil {
		t.Fatal(err)
	}
	if err := s.AckEvent(1); err != nil {
		t.Fatal("ack not idempotent")
	}
	if len(s.PendingEvents()) != 0 {
		t.Fatal("ack failed")
	}
	if !errors.Is(s.AckEvent(10), ErrUnknownEvent) {
		t.Fatal("unknown event accepted")
	}
}
func TestValidationAndCancellation(t *testing.T) {
	if _, err := NewStore(map[string][2]int64{"x": {-1, 1}}, time.Now); err == nil {
		t.Fatal("invalid inventory")
	}
	if _, err := NewStore(nil, nil); err == nil {
		t.Fatal("nil clock")
	}
	s := store(t, 5)
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if _, err := s.Submit(ctx, Request{Key: "k", Product: "book", Quantity: 1}); !errors.Is(err, context.Canceled) {
		t.Fatal(err)
	}
	for _, r := range []Request{{}, {Key: "k", Product: "book", Quantity: 0}, {Key: "k", Product: "unknown", Quantity: 1}} {
		_, err := s.Submit(context.Background(), r)
		if err == nil {
			t.Fatal("invalid accepted", r)
		}
	}
	max, _ := NewStore(map[string][2]int64{"x": {2, math.MaxInt64}}, time.Now)
	if _, err := max.Submit(context.Background(), Request{Key: "k", Product: "x", Quantity: 2}); !errors.Is(err, ErrInvalid) {
		t.Fatalf("overflow: %v", err)
	}
}
func FuzzIdempotentReceipt(f *testing.F) {
	f.Add(uint8(1))
	f.Add(uint8(10))
	f.Fuzz(func(t *testing.T, q uint8) {
		amount := int64(q%20 + 1)
		s := store(t, 40)
		r := Request{Key: "id", Product: "book", Quantity: amount}
		a, e := s.Submit(context.Background(), r)
		if e != nil {
			t.Fatal(e)
		}
		b, e := s.Submit(context.Background(), r)
		if e != nil || a != b {
			t.Fatalf("different response %v", e)
		}
	})
}
func BenchmarkSubmit(b *testing.B) {
	s, _ := NewStore(map[string][2]int64{"book": {math.MaxInt64, 1}}, time.Now)
	b.ReportAllocs()
	for i := 0; i < b.N; i++ {
		_, err := s.Submit(context.Background(), Request{Key: stringKey(i), Product: "book", Quantity: 1})
		if err != nil {
			b.Fatal(err)
		}
	}
}
