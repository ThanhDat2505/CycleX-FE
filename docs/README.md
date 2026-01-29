# 📚 Testing Documentation

This directory contains all testing documentation for the CycleX Frontend project.

## 📂 Contents

### Test Cases
- **[TEST_CASES_REGISTER.csv](./testing/TEST_CASES_REGISTER.csv)** - Complete test cases for register flow (37 cases)
- **[TEST_DATA_REGISTER.csv](./testing/TEST_DATA_REGISTER.csv)** - Test data reference with valid/invalid examples

### Guides
- **[TESTING_README.md](./testing/TESTING_README.md)** - Testing workflow and best practices
- **[TEST_EXECUTION_TRACKER.md](./testing/TEST_EXECUTION_TRACKER.md)** - Test execution tracking template

### Mock Mode
- **[MOCK_MODE_GUIDE.md](../MOCK_MODE_GUIDE.md)** - Complete guide for testing with mock mode

---

## 🚀 Quick Start

### 1. Setup Test Environment

```bash
# Enable mock mode in .env.local
NEXT_PUBLIC_MOCK_API=true

# Start dev server
pnpm run dev
```

### 2. Run Tests

1. Open `testing/TEST_CASES_REGISTER.csv` in Excel
2. Follow test steps for each case
3. Update Status column (Passed/Failed)
4. Document results in Actual Result column

### 3. Priority Testing

**P0 (Critical) - Must Pass:**
- TC-REG-001: Valid Registration
- TC-REG-014: Duplicate Email
- TC-REG-016: Route Protection
- TC-VER-001: Valid OTP Verification
- TC-FLOW-001: Complete Happy Path

---

## 📊 Test Coverage

| Feature | Test Cases | Priority |
|---------|-----------|----------|
| Form Validation | 13 | P0: 3, P1: 10 |
| Duplicate Detection | 2 | P0: 1, P1: 1 |
| Route Protection | 2 | P0: 1, P1: 1 |
| OTP Verification | 5 | P0: 2, P1: 3 |
| Resend OTP | 4 | P0: 1, P1: 2, P2: 1 |
| UI/UX | 5 | P2: 5 |
| Integration Flow | 3 | P0: 2, P1: 1 |
| Mock Mode | 3 | P2: 3 |
| **Total** | **37** | **P0: 10, P1: 16, P2: 11** |

---

## 📝 Documentation Structure

```
docs/
├── README.md                           ← You are here
└── testing/
    ├── TEST_CASES_REGISTER.csv         ← Test cases (Excel)
    ├── TEST_DATA_REGISTER.csv          ← Test data
    ├── TESTING_README.md               ← Testing guide
    └── TEST_EXECUTION_TRACKER.md       ← Progress tracker
```

---

## 🎯 Testing Workflow

1. **Preparation**
   - Read [TESTING_README.md](./testing/TESTING_README.md)
   - Setup mock mode (see [MOCK_MODE_GUIDE.md](../MOCK_MODE_GUIDE.md))
   - Open test cases in Excel

2. **Execution**
   - Run P0 tests first
   - Then P1, then P2
   - Update status in CSV

3. **Reporting**
   - Use [TEST_EXECUTION_TRACKER.md](./testing/TEST_EXECUTION_TRACKER.md)
   - Document bugs found
   - Calculate pass rate

4. **Sign-off**
   - All P0 tests must pass
   - ≥90% P1 tests pass
   - ≥80% P2 tests pass

---

## 🐛 Bug Reporting

When you find a bug:
1. Document in TEST_EXECUTION_TRACKER.md
2. Create GitHub issue
3. Link test case ID
4. Assign to developer

---

## 📞 Support

- **Questions?** Check [TESTING_README.md](./testing/TESTING_README.md)
- **Mock mode issues?** See [MOCK_MODE_GUIDE.md](../MOCK_MODE_GUIDE.md)
- **Need help?** Ask team lead

---

**Last Updated:** 2026-01-26  
**Maintained by:** Frontend Team
