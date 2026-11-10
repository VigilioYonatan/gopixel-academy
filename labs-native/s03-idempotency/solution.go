package lab

import (
	"errors"
	"sync"
)

type receipt struct {
	amount        int64
	originalTotal int64
}

type PaymentStore struct {
	mu    sync.Mutex
	seen  map[string]receipt
	total int64
}

func (p *PaymentStore) Charge(key string, cents int64) (int64, error) {
	if key == "" || cents <= 0 {
		return 0, errors.New("invalid payment")
	}
	p.mu.Lock()
	defer p.mu.Unlock()
	if p.seen == nil {
		p.seen = make(map[string]receipt)
	}
	if saved, ok := p.seen[key]; ok {
		if saved.amount != cents {
			return p.total, errors.New("idempotency conflict")
		}
		return saved.originalTotal, nil
	}
	p.total += cents
	p.seen[key] = receipt{amount: cents, originalTotal: p.total}
	return p.total, nil
}
