package lab

import "testing"

func TestDecodeUser(t *testing.T) {
	for _, data := range []string{`{"id":"u1","name":"Old"}`, `{"id":"u1","display_name":"Old"}`} {
		u, e := DecodeUser([]byte(data))
		if e != nil || u.DisplayName != "Old" {
			t.Fatal(u, e)
		}
	}
	if _, err := DecodeUser([]byte(`{"name":"missing"}`)); err == nil {
		t.Fatal("accepted missing id")
	}
}
