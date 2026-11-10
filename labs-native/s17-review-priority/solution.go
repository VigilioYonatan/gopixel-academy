package lab

import (
	"errors"
	"slices"
)

type Finding struct {
	ID         string
	Impact     int
	Likelihood int
}

func RankFindings(in []Finding) ([]Finding, error) {
	out := slices.Clone(in)
	for _, f := range out {
		if f.ID == "" || f.Impact < 1 || f.Impact > 5 || f.Likelihood < 1 || f.Likelihood > 5 {
			return nil, errors.New("invalid finding")
		}
	}
	slices.SortStableFunc(out, func(a, b Finding) int {
		x := a.Impact * a.Likelihood
		y := b.Impact * b.Likelihood
		if x > y {
			return -1
		}
		if x < y {
			return 1
		}
		return 0
	})
	return out, nil
}
