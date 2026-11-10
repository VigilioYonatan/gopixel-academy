package lab

import "testing"

func TestCapacity(t *testing.T) {
	v, err := RequiredWorkers(100, 200, 0.5)
	if err != nil || v != 40 {
		t.Fatal(v, err)
	}
	if _, err := RequiredWorkers(100, 200, 0); err == nil {
		t.Fatal("zero util accepted")
	}
}
