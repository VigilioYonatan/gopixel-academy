package lab

// Detach creates a new backing array instead of retaining a large input buffer.
func Detach(input []byte, first int) []byte {
	if first < 0 || first > len(input) {
		return nil
	}
	out := make([]byte, first)
	copy(out, input[:first])
	return out
}
