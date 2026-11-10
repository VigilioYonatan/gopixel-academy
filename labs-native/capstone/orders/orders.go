// Package orders demonstrates a bounded, in-process transactional domain model.
// It is a teaching lab: a mutex is NOT a distributed transaction or durable outbox.
package orders

import (
	"context"
	"errors"
	"fmt"
	"math"
	"sort"
	"sync"
	"time"
)

var (
	ErrInvalid      = errors.New("invalid order")
	ErrUnavailable  = errors.New("insufficient stock")
	ErrConflict     = errors.New("idempotency key conflict")
	ErrUnknownEvent = errors.New("unknown event")
)

type Request struct {
	Key      string // Stable idempotency key scoped to the current store.
	Product  string `json:"product"`
	Quantity int64  `json:"quantity"`
}
type Receipt struct {
	OrderID    uint64
	Product    string
	Quantity   int64
	TotalCents int64
	Remaining  int64
	CreatedAt  time.Time
}
type Event struct {
	ID         uint64
	OrderID    uint64
	Type       string
	Product    string
	TotalCents int64
}
type item struct{ quantity, priceCents int64 }
type savedOrder struct {
	request Request
	receipt Receipt
}
type Store struct {
	mu      sync.Mutex
	stock   map[string]item
	saved   map[string]savedOrder
	pending map[uint64]Event
	next    uint64
	now     func() time.Time
}

// NewStore validates all inventory, copies the input and injects time for deterministic tests.
func NewStore(stock map[string][2]int64, now func() time.Time) (*Store, error) {
	if now == nil {
		return nil, fmt.Errorf("%w: nil clock", ErrInvalid)
	}
	inv := make(map[string]item, len(stock))
	for key, v := range stock {
		if key == "" || v[0] < 0 || v[1] <= 0 {
			return nil, fmt.Errorf("%w: invalid stock entry", ErrInvalid)
		}
		inv[key] = item{quantity: v[0], priceCents: v[1]}
	}
	return &Store{stock: inv, saved: make(map[string]savedOrder), pending: make(map[uint64]Event), now: now}, nil
}

// Submit atomically checks stock and records a result and in-memory outbox event.
// A conflicting key is rejected; a repeated identical request returns its ORIGINAL receipt.
// ctx cancellation is checked before the irreversible operation, not while holding the mutex.
func (s *Store) Submit(ctx context.Context, r Request) (Receipt, error) {
	if s == nil || ctx == nil {
		return Receipt{}, fmt.Errorf("%w: store/context", ErrInvalid)
	}
	if r.Key == "" || len(r.Key) > 128 || r.Product == "" || len(r.Product) > 128 || r.Quantity <= 0 {
		return Receipt{}, ErrInvalid
	}
	if err := ctx.Err(); err != nil {
		return Receipt{}, err
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	if saved, exists := s.saved[r.Key]; exists {
		if saved.request != r {
			return Receipt{}, ErrConflict
		}
		return saved.receipt, nil
	}
	if err := ctx.Err(); err != nil {
		return Receipt{}, err
	}
	current, found := s.stock[r.Product]
	if !found || r.Quantity > current.quantity {
		return Receipt{}, ErrUnavailable
	}
	if current.priceCents > math.MaxInt64/r.Quantity {
		return Receipt{}, fmt.Errorf("%w: amount overflow", ErrInvalid)
	}
	if s.next == math.MaxUint64 {
		return Receipt{}, fmt.Errorf("%w: sequence exhausted", ErrInvalid)
	}
	s.next++
	current.quantity -= r.Quantity
	s.stock[r.Product] = current
	receipt := Receipt{OrderID: s.next, Product: r.Product, Quantity: r.Quantity, TotalCents: r.Quantity * current.priceCents, Remaining: current.quantity, CreatedAt: s.now().UTC()}
	s.saved[r.Key] = savedOrder{request: r, receipt: receipt}
	s.pending[receipt.OrderID] = Event{ID: receipt.OrderID, OrderID: receipt.OrderID, Type: "order.accepted", Product: r.Product, TotalCents: receipt.TotalCents}
	return receipt, nil
}

// Stock returns a concurrency-safe snapshot of the requested product.
func (s *Store) Stock(product string) (int64, bool) {
	if s == nil {
		return 0, false
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	it, ok := s.stock[product]
	return it.quantity, ok
}

// PendingEvents returns a sorted snapshot so callers cannot mutate internal state.
func (s *Store) PendingEvents() []Event {
	if s == nil {
		return nil
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	events := make([]Event, 0, len(s.pending))
	for _, e := range s.pending {
		events = append(events, e)
	}
	// Stable result order, independent of map iteration.
	sort.Slice(events, func(i, j int) bool { return events[i].ID < events[j].ID })
	return events
}

// AckEvent marks an event sent; a repeated ACK is deliberately idempotent.
func (s *Store) AckEvent(id uint64) error {
	if s == nil {
		return ErrInvalid
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	if id == 0 || id > s.next {
		return ErrUnknownEvent
	}
	delete(s.pending, id)
	return nil
}
