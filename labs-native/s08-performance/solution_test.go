package lab

import "testing"

func TestRenderIDs(t *testing.T) {
	if got := RenderIDs([]int{2, 10, -1}); got != "2,10,-1" {
		t.Fatal(got)
	}
}
func BenchmarkRenderIDs(b *testing.B) {
	data := make([]int, 1000)
	for i := range data {
		data[i] = i
	}
	b.ReportAllocs()
	for i := 0; i < b.N; i++ {
		_ = RenderIDs(data)
	}
}
