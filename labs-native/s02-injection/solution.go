package lab

import (
	"errors"
	"fmt"
)

type Repository interface{ Save(id string) error }
type Service struct{ Repo Repository }

func (s Service) Create(id string) error {
	if id == "" {
		return errors.New("empty ID")
	}
	if s.Repo == nil {
		return errors.New("repository missing")
	}
	if err := s.Repo.Save(id); err != nil {
		return fmt.Errorf("save: %w", err)
	}
	return nil
}
