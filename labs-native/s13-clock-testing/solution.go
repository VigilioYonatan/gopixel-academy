package lab

import "time"

type Clock interface{ Now() time.Time }
type ExpiringToken struct{ Expiry time.Time }

func (t ExpiringToken) Valid(clock Clock) bool { return clock != nil && clock.Now().Before(t.Expiry) }
