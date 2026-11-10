package lab

import (
	"context"
	"errors"
	"sync"
)

// Process bounds worker concurrency and terminates when ctx is cancelled.
func Process(ctx context.Context, jobs []int, workers int, fn func(context.Context, int) error) error {
	if workers < 1 || fn == nil {
		return errors.New("invalid configuration")
	}
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()
	input := make(chan int)
	var wg sync.WaitGroup
	var mu sync.Mutex
	var first error
	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				select {
				case <-ctx.Done():
					return
				case job, ok := <-input:
					if !ok {
						return
					}
					if e := fn(ctx, job); e != nil {
						mu.Lock()
						if first == nil {
							first = e
							cancel()
						}
						mu.Unlock()
						return
					}
				}
			}
		}()
	}
send:
	for _, job := range jobs {
		select {
		case <-ctx.Done():
			break send
		case input <- job:
		}
	}
	close(input)
	wg.Wait()
	if first != nil {
		return first
	}
	return ctx.Err()
}
