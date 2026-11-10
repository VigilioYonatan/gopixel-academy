package lab

import "sync/atomic"

type Counter struct{ value atomic.Int64 }

func (c *Counter) Increment() int64 { return c.value.Add(1) }
func (c *Counter) Load() int64      { return c.value.Load() }
