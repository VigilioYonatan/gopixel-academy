package lab

import (
	"fmt"
	"strconv"
	"strings"
)

// ParseQuantity rejects malformed or nonpositive quantities without hiding errors.
func ParseQuantity(raw string) (int, error) {
	n, err := strconv.Atoi(strings.TrimSpace(raw))
	if err != nil {
		return 0, fmt.Errorf("quantity: %w", err)
	}
	if n <= 0 {
		return 0, fmt.Errorf("quantity must be positive")
	}
	return n, nil
}
