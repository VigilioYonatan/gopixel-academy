package lab

import (
	"context"
	"errors"
	"testing"
)

func TestShutdown(t *testing.T) {
	s := NewShutdown()
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if !errors.Is(s.Wait(ctx), context.Canceled) {
		t.Fatal("expected cancelled")
	}
	s.Stop()
	s.Stop()
	if err := s.Wait(context.Background()); err != nil {
		t.Fatal(err)
	}
}
