package lab

import (
	"context"
	"errors"
	"time"
)

func Retry(ctx context.Context, attempts int, step func() error, wait func(time.Duration) error) error {
	if attempts < 1 || step == nil || wait == nil {
		return errors.New("invalid retry")
	}
	var last error
	for i := 0; i < attempts; i++ {
		if err := ctx.Err(); err != nil {
			return err
		}
		last = step()
		if last == nil {
			return nil
		}
		if i+1 < attempts {
			d := time.Duration(1<<min(i, 8)) * time.Millisecond
			if err := wait(d); err != nil {
				return err
			}
		}
	}
	return last
}
