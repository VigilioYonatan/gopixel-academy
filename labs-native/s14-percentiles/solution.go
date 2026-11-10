package lab

import (
	"errors"
	"math"
	"slices"
	"time"
)

// Percentile returns a nearest-rank percentile; it never mutates the input.
func Percentile(samples []time.Duration, p float64) (time.Duration, error) {
	if len(samples) == 0 || p <= 0 || p > 100 || math.IsNaN(p) {
		return 0, errors.New("invalid percentile")
	}
	copyOf := slices.Clone(samples)
	slices.Sort(copyOf)
	idx := int(math.Ceil(p/100*float64(len(copyOf)))) - 1
	return copyOf[idx], nil
}
