package lab

import (
	"testing"
	"time"
)

func TestPercentile(t *testing.T) {
	s := []time.Duration{5, 1, 9, 3}
	got, err := Percentile(s, 95)
	if err != nil || got != 9 || s[0] != 5 {
		t.Fatal(got, err)
	}
	if _, err := Percentile(nil, 99); err == nil {
		t.Fatal("empty allowed")
	}
}
