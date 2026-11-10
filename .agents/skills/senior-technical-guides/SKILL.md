---
name: senior-technical-guides
description: Build and audit the eighteen Go senior engineering study guides with real native Go source and tests.
---

# Implementation rules
1. Each guide belongs to a single S01–S18 module and lives in `src/content/senior/guides.json`.
2. `src/features/senior/SeniorGuide.tsx` is a presentation component; never put grading logic into it.
3. Keep reference code synchronized with `labs-native/*/solution.go` and `solution_test.go`.
4. Every chapter explains domain context, invariants, validation, failure mode and ADR. Avoid repeated boilerplate.
5. Go code runs **only on the learner's computer**, not in the browser. Mark runtime limitations honestly.
6. Localize every label and disclose Spanish-only study copy while full translation is pending.
7. Run `node --test tests/senior-guides.test.mjs` and `cd labs-native && go test ./... && go test -race ./...`.
