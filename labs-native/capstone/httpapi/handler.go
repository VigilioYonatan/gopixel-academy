// Package httpapi is a local-only HTTP teaching adapter for the orders capstone.
// The bearer token is illustrative, not a complete production authentication system.
package httpapi

import (
	"crypto/subtle"
	"encoding/json"
	"errors"
	"io"
	"mime"
	"net/http"
	"strings"

	"example.com/gopixel/senior-labs/capstone/orders"
)

type Handler struct {
	store *orders.Store
	token string
}

// New constructs a minimal HTTP API with strict JSON, bounded bodies and auth.
// Prefer a real OIDC/OAuth solution and per-tenant authorization in production.
func New(store *orders.Store, token string) (http.Handler, error) {
	if store == nil || len(token) < 16 || len(token) > 512 {
		return nil, errors.New("invalid HTTP adapter configuration")
	}
	h := &Handler{store: store, token: token}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	})
	mux.HandleFunc("POST /orders", h.submit)
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Cache-Control", "no-store")
		mux.ServeHTTP(w, r)
	}), nil
}
func (h *Handler) submit(w http.ResponseWriter, r *http.Request) {
	auth := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	if !strings.HasPrefix(r.Header.Get("Authorization"), "Bearer ") || len(auth) != len(h.token) || subtle.ConstantTimeCompare([]byte(auth), []byte(h.token)) != 1 {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	mediaType, _, err := mime.ParseMediaType(r.Header.Get("Content-Type"))
	if err != nil || mediaType != "application/json" {
		http.Error(w, "application/json required", http.StatusUnsupportedMediaType)
		return
	}
	r.Body = http.MaxBytesReader(w, r.Body, 4096)
	defer r.Body.Close()
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	var in orders.Request
	if err := decoder.Decode(&in); err != nil {
		http.Error(w, "invalid JSON payload", http.StatusBadRequest)
		return
	}
	var extra any
	if err := decoder.Decode(&extra); err != io.EOF {
		http.Error(w, "multiple JSON values", http.StatusBadRequest)
		return
	}
	receipt, err := h.store.Submit(r.Context(), in)
	if err != nil {
		switch {
		case errors.Is(err, orders.ErrInvalid):
			http.Error(w, "invalid order", http.StatusBadRequest)
		case errors.Is(err, orders.ErrUnavailable):
			http.Error(w, "out of stock", http.StatusConflict)
		case errors.Is(err, orders.ErrConflict):
			http.Error(w, "idempotency conflict", http.StatusConflict)
		default:
			http.Error(w, "order not processed", http.StatusServiceUnavailable)
		}
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	// A retry may return an earlier receipt; HTTP 200 represents an idempotent outcome.
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(receipt)
}
