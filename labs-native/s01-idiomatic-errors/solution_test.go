package lab

import "testing"

func TestParseQuantity(t *testing.T) {
	for _, tt := range []struct {
		in   string
		want int
		fail bool
	}{{" 12 ", 12, false}, {"oops", 0, true}, {"0", 0, true}, {"-1", 0, true}} {
		got, e := ParseQuantity(tt.in)
		if (e != nil) != tt.fail || (!tt.fail && got != tt.want) {
			t.Fatalf("%q => %d %v", tt.in, got, e)
		}
	}
}
