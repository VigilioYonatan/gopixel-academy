package lab

import (
	"errors"
	"testing"
)

type fakeRepo struct {
	id  string
	err error
}

func (f *fakeRepo) Save(id string) error { f.id = id; return f.err }
func TestCreate(t *testing.T) {
	r := &fakeRepo{}
	if e := (Service{Repo: r}).Create("o-1"); e != nil || r.id != "o-1" {
		t.Fatal(e, r.id)
	}
	if e := (Service{Repo: r}).Create(""); e == nil {
		t.Fatal("expected error")
	}
	sentinel := errors.New("storage failure")
	r.err = sentinel
	if !errors.Is((Service{Repo: r}).Create("o-2"), sentinel) {
		t.Fatal("wrapped error lost")
	}
}
