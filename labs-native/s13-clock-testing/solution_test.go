package lab

import (
	"testing"
	"time"
)

type fixedClock struct{ at time.Time }

func (c fixedClock) Now() time.Time { return c.at }
func TestExpiry(t *testing.T) {
	at := time.Date(2030, 1, 1, 0, 0, 0, 0, time.UTC)
	tok := ExpiringToken{Expiry: at.Add(time.Minute)}
	if !tok.Valid(fixedClock{at}) || tok.Valid(fixedClock{at.Add(time.Minute)}) || tok.Valid(nil) {
		t.Fatal("expiry logic")
	}
}
