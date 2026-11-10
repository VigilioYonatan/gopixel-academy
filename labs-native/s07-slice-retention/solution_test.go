package lab

import "testing"

func TestDetach(t *testing.T) {
	source := make([]byte, 1000000)
	source[0] = 7
	part := Detach(source, 1)
	source[0] = 9
	if len(part) != 1 || part[0] != 7 || cap(part) != 1 {
		t.Fatal("backing array retained or wrong result")
	}
	if Detach(source, -1) != nil {
		t.Fatal("bad bound")
	}
}
