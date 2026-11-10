package lab

import (
	"context"
	"sync"
)

type Shutdown struct {
	once sync.Once
	done chan struct{}
}

func NewShutdown() *Shutdown { return &Shutdown{done: make(chan struct{})} }
func (s *Shutdown) Stop()    { s.once.Do(func() { close(s.done) }) }
func (s *Shutdown) Wait(ctx context.Context) error {
	select {
	case <-s.done:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}
