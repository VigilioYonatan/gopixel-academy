// Local demonstration HTTP process. Run only on a trusted development machine.
package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"example.com/gopixel/senior-labs/capstone/httpapi"
	"example.com/gopixel/senior-labs/capstone/orders"
)

func main() {
	token := os.Getenv("GOPIXEL_DEMO_TOKEN")
	if len(token) < 16 {
		slog.Error("set GOPIXEL_DEMO_TOKEN with a development-only token of at least 16 characters")
		os.Exit(1)
	}
	store, err := orders.NewStore(map[string][2]int64{"book": {50, 1250}}, time.Now)
	if err != nil {
		slog.Error("store", "error", err)
		os.Exit(1)
	}
	handler, err := httpapi.New(store, token)
	if err != nil {
		slog.Error("handler", "error", err)
		os.Exit(1)
	}
	server := &http.Server{Addr: "127.0.0.1:8080", Handler: handler, ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 10 * time.Second, WriteTimeout: 10 * time.Second, IdleTimeout: 30 * time.Second, MaxHeaderBytes: 4096}
	signals, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	done := make(chan error, 1)
	go func() { done <- server.ListenAndServe() }()
	select {
	case err := <-done:
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("listen failed", "error", err)
			os.Exit(1)
		}
	case <-signals.Done():
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := server.Shutdown(ctx); err != nil {
			slog.Error("shutdown incomplete", "error", err)
			_ = server.Close()
		}
		if err := <-done; err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("server error", "error", err)
		}
	}
}
