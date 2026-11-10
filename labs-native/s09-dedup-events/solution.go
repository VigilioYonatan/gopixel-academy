package lab

import "sync"

type Inbox struct {
	mu   sync.Mutex
	seen map[string]struct{}
}

func (i *Inbox) Accept(eventID string) bool {
	if eventID == "" {
		return false
	}
	i.mu.Lock()
	defer i.mu.Unlock()
	if i.seen == nil {
		i.seen = make(map[string]struct{})
	}
	if _, exists := i.seen[eventID]; exists {
		return false
	}
	i.seen[eventID] = struct{}{}
	return true
}
