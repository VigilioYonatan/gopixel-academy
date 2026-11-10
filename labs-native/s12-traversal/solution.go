package lab

import (
	"errors"
	"path/filepath"
	"strings"
)

func SafePath(root, userPath string) (string, error) {
	if root == "" || userPath == "" || filepath.IsAbs(userPath) {
		return "", errors.New("invalid path")
	}
	clean := filepath.Clean(userPath)
	if clean == ".." || strings.HasPrefix(clean, ".."+string(filepath.Separator)) {
		return "", errors.New("path traversal")
	}
	return filepath.Join(root, clean), nil
}
