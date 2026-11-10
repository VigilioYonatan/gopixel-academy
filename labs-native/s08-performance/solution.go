package lab

import (
	"strconv"
	"strings"
)

func RenderIDs(ids []int) string {
	var b strings.Builder
	b.Grow(len(ids) * 5)
	for i, id := range ids {
		if i > 0 {
			b.WriteByte(',')
		}
		b.WriteString(strconv.Itoa(id))
	}
	return b.String()
}
