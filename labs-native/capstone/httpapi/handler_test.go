package httpapi

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"example.com/gopixel/senior-labs/capstone/orders"
)

const testToken = "test-token-that-is-long-enough"

func newTestHandler(t *testing.T) http.Handler {
	t.Helper()
	s, e := orders.NewStore(map[string][2]int64{"book": {2, 1500}}, time.Now)
	if e != nil {
		t.Fatal(e)
	}
	h, e := New(s, testToken)
	if e != nil {
		t.Fatal(e)
	}
	return h
}
func call(h http.Handler, token, ctype, payload string) *httptest.ResponseRecorder {
	request := httptest.NewRequest(http.MethodPost, "/orders", strings.NewReader(payload))
	if token != "" {
		request.Header.Set("Authorization", token)
	}
	if ctype != "" {
		request.Header.Set("Content-Type", ctype)
	}
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, request)
	return rec
}
func TestInvalidSetupAndHealth(t *testing.T) {
	if _, err := New(nil, testToken); err == nil {
		t.Fatal("nil store accepted")
	}
	s, _ := orders.NewStore(nil, time.Now)
	if _, err := New(s, "short"); err == nil {
		t.Fatal("short token accepted")
	}
	h := newTestHandler(t)
	req := httptest.NewRequest("GET", "/health", nil)
	w := httptest.NewRecorder()
	h.ServeHTTP(w, req)
	if w.Code != 200 || w.Header().Get("X-Content-Type-Options") != "nosniff" {
		t.Fatal(w.Code, w.Header())
	}
}
func TestAuthenticationAndStrictPayload(t *testing.T) {
	h := newTestHandler(t)
	jsonOK := `{"Key":"a","Product":"book","Quantity":1}`
	table := []struct {
		name, token, ct, payload string
		status                   int
	}{
		{"missing", "", "application/json", jsonOK, 401},
		{"bad token", "Bearer wrong", "application/json", jsonOK, 401},
		{"wrong type", "Bearer " + testToken, "text/plain", jsonOK, 415},
		{"unknown field", "Bearer " + testToken, "application/json", `{"Key":"a","Product":"book","Quantity":1,"Admin":true}`, 400},
		{"multiple objects", "Bearer " + testToken, "application/json", jsonOK + jsonOK, 400},
		{"invalid JSON", "Bearer " + testToken, "application/json", `{"Key":`, 400},
		{"oversized", "Bearer " + testToken, "application/json", strings.Repeat("x", 5000), 400},
	}
	for _, c := range table {
		t.Run(c.name, func(t *testing.T) {
			w := call(h, c.token, c.ct, c.payload)
			if w.Code != c.status {
				t.Fatalf("want %d got %d: %s", c.status, w.Code, w.Body.String())
			}
		})
	}
}
func TestIdempotentHTTPAndConflict(t *testing.T) {
	h := newTestHandler(t)
	first := call(h, "Bearer "+testToken, "application/json", `{"Key":"x","Product":"book","Quantity":1}`)
	second := call(h, "Bearer "+testToken, "application/json", `{"Key":"x","Product":"book","Quantity":1}`)
	if first.Code != 200 || second.Code != 200 || first.Body.String() != second.Body.String() {
		t.Fatalf("responses differ: %s %s", first.Body, second.Body)
	}
	var r orders.Receipt
	if e := json.Unmarshal(first.Body.Bytes(), &r); e != nil || r.TotalCents != 1500 {
		t.Fatal(e, r)
	}
	conflict := call(h, "Bearer "+testToken, "application/json", `{"Key":"x","Product":"book","Quantity":2}`)
	if conflict.Code != 409 {
		t.Fatal(conflict.Code)
	}
}
