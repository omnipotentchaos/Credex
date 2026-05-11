# TESTS.md — Test Documentation

## Test Framework

- **Runner**: Vitest 4.x
- **Environment**: jsdom
- **Location**: `src/lib/__tests__/audit-engine.test.ts`

## How to Run

```bash
# Run all tests
npx vitest run

# Run in watch mode
npx vitest

# Run with coverage
npx vitest run --coverage
```

## Test Coverage — Audit Engine (13 tests)

### 1. Savings Tier Classification (4 tests)
- `getSavingsTier` returns "high" for savings ≥ $500
- `getSavingsTier` returns "medium" for savings $100–$499
- `getSavingsTier` returns "low" for savings $1–$99
- `getSavingsTier` returns "optimal" for $0 savings

### 2. Empty Input (1 test)
- Empty tools array returns $0 savings and no results

### 3. Plan-Fit Detection (1 test)
- Detects when a team plan (Cursor Business, $40/seat) is used by 1 person and recommends downgrade

### 4. Overpay Detection (1 test)
- Flags when actual spend ($50) exceeds retail price ($10) for GitHub Copilot Pro

### 5. Seat Right-Sizing (1 test)
- Detects 10 seats for a team of 3, recommends removing 7 excess seats ($140/mo savings)

### 6. Cross-Tool Alternatives (1 test)
- Suggests cheaper IDE alternative when on expensive Cursor Business plan

### 7. Credex Credit Opportunity (1 test)
- Shows 15% Credex credit savings for Claude Max ($500/mo spend)

### 8. Optimal Configuration (1 test)
- Free plan returns 0 savings and "optimal" tier

### 9. Annual Calculation (1 test)
- Verifies annual savings = monthly × 12

### 10. Multi-Tool Aggregation (1 test)
- Correctly sums spend across Cursor Pro + Claude Pro

## CI Integration

Tests run automatically on every push to `main` via GitHub Actions (`.github/workflows/ci.yml`):
- Lint → Test → Type Check → Build
