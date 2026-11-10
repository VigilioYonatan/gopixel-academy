package lab

import (
	"errors"
	"sync"
)

type Inventory struct {
	mu    sync.Mutex
	stock int
}

func NewInventory(n int) (*Inventory, error) {
	if n < 0 {
		return nil, errors.New("negative stock")
	}
	return &Inventory{stock: n}, nil
}
func (i *Inventory) Reserve(n int) bool {
	if n <= 0 {
		return false
	}
	i.mu.Lock()
	defer i.mu.Unlock()
	if n > i.stock {
		return false
	}
	i.stock -= n
	return true
}
func (i *Inventory) Available() int { i.mu.Lock(); defer i.mu.Unlock(); return i.stock }
