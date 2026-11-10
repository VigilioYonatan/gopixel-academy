package lab

import (
	"path/filepath"
	"testing"
)

func TestSafePath(t *testing.T) {
	for _, s := range []string{"../secret", "../../a", "/etc/passwd", ""} {
		if _, err := SafePath("/tmp/safe", s); err == nil {
			t.Fatalf("accepted %q", s)
		}
	}
	p, err := SafePath("/tmp/safe", "docs/readme.txt")
	if err != nil || p != filepath.Join("/tmp/safe", "docs/readme.txt") {
		t.Fatal(p, err)
	}
}
