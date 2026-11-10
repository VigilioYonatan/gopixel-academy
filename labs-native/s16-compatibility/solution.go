package lab

import (
	"encoding/json"
	"errors"
)

type User struct {
	ID          string
	DisplayName string
}

func DecodeUser(data []byte) (User, error) {
	var raw struct {
		ID          string `json:"id"`
		Name        string `json:"name"`
		DisplayName string `json:"display_name"`
	}
	if err := json.Unmarshal(data, &raw); err != nil {
		return User{}, err
	}
	if raw.ID == "" {
		return User{}, errors.New("missing ID")
	}
	name := raw.DisplayName
	if name == "" {
		name = raw.Name
	}
	return User{ID: raw.ID, DisplayName: name}, nil
}
