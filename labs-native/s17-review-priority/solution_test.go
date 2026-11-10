package lab

import "testing"

func TestRank(t *testing.T) {
	in := []Finding{{"low", 1, 1}, {"critical", 5, 5}}
	got, err := RankFindings(in)
	if err != nil || got[0].ID != "critical" || in[0].ID != "low" {
		t.Fatal(got, err)
	}
	if _, err := RankFindings([]Finding{{"bad", 0, 1}}); err == nil {
		t.Fatal("bad score")
	}
}
