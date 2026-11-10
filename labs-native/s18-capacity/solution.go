package lab

import (
	"errors"
	"math"
)

// RequiredWorkers rounds up rate * latency / utilization, avoiding silent overflow.
func RequiredWorkers(rps int64, latencyMillis int64, utilization float64) (int64, error) {
	if rps < 0 || latencyMillis < 0 || utilization <= 0 || utilization > 1 || math.IsNaN(utilization) {
		return 0, errors.New("invalid capacity inputs")
	}
	result := math.Ceil((float64(rps) * float64(latencyMillis) / 1000) / utilization)
	if result > float64(math.MaxInt64) {
		return 0, errors.New("overflow")
	}
	return int64(result), nil
}
