# 📋 REGISTER FLOW - TEST DOCUMENTATION

## 📂 Files Overview

| File | Description |
|------|-------------|
| `TEST_CASES_REGISTER.csv` | Complete test cases (37 cases) |
| `TEST_DATA_REGISTER.csv` | Test data reference |
| `MOCK_MODE_GUIDE.md` | Mock mode usage guide |

---

## 📊 Test Summary

### Total Test Cases: **37**

| Category | Count | Priority |
|----------|-------|----------|
| Form Validation | 13 | P0: 3, P1: 10 |
| Duplicate Detection | 2 | P0: 1, P1: 1 |
| Route Protection | 2 | P0: 1, P1: 1 |
| OTP Verification | 5 | P0: 2, P1: 3 |
| Resend OTP | 4 | P0: 1, P1: 2, P2: 1 |
| UI/UX | 5 | P2: 5 |
| Integration Flow | 3 | P0: 2, P1: 1 |
| Mock Mode | 3 | P2: 3 |

### Priority Breakdown:
- **P0 (Critical):** 10 test cases
- **P1 (High):** 16 test cases
- **P2 (Medium):** 11 test cases

---

## 🚀 How to Use Test Files

### 1. Open in Excel

**Option A: Double-click**
- Simply double-click `TEST_CASES_REGISTER.csv`
- Excel will open automatically

**Option B: Import**
1. Open Excel
2. File → Open
3. Select `TEST_CASES_REGISTER.csv`
4. Choose "Delimited" → "Comma"

### 2. Test Case Columns

| Column | Description |
|--------|-------------|
| Test Case ID | Unique identifier (TC-REG-001, etc.) |
| Category | Test category grouping |
| Priority | P0 (Critical), P1 (High), P2 (Medium) |
| Test Case Name | Descriptive test name |
| Precondition | Required state before test |
| Test Steps | Step-by-step instructions |
| Test Data | Input data to use |
| Expected Result | What should happen |
| Business Rule | Related BR from S-03 |
| Status | Not Tested / Passed / Failed |
| Actual Result | What actually happened |
| Notes | Additional comments |

### 3. Tracking Progress

**Update Status column:**
- `Not Tested` → Initial state
- `Passed` → Test successful
- `Failed` → Test failed
- `Blocked` → Cannot test (dependency)
- `Skip` → Not applicable

**Fill Actual Result:**
- If Passed: "✅ As expected"
- If Failed: Describe what went wrong

---

## 🧪 Testing Workflow

### Step 1: Setup Environment

```bash
# Enable mock mode
# Edit .env.local
NEXT_PUBLIC_MOCK_API=true

# Start dev server
pnpm run dev
```

### Step 2: Run Priority Tests First

**P0 Tests (Must Pass):**
1. TC-REG-001: Valid Registration
2. TC-REG-006: Password Too Short
3. TC-REG-007: Password Too Long
4. TC-REG-010: Invalid CCCD
5. TC-REG-014: Duplicate Email
6. TC-REG-016: Route Protection
7. TC-VER-001: Valid OTP
8. TC-VER-002: Invalid OTP
9. TC-RESEND-001: Resend OTP
10. TC-FLOW-001: Complete Happy Path
11. TC-FLOW-002: Register → Verify → Login

### Step 3: Run P1 Tests

Test all P1 priority cases after P0 passes.

### Step 4: Run P2 Tests

Test UI/UX and edge cases.

---

## 📝 Test Data Reference

### Valid Test Data

```
Email: newuser@example.com
Password: password123
Confirm Password: password123
CCCD: 123456789012
Phone: 0987654321 (or leave empty)
```

### Mock Users (Pre-registered)

| Email | Password | Role | Verified |
|-------|----------|------|----------|
| test@example.com | password123 | BUYER | ✅ Yes |
| buyer@example.com | buyer123 | BUYER | ✅ Yes |
| seller@example.com | seller123 | SELLER | ✅ Yes |
| unverified@example.com | unverified123 | BUYER | ❌ No |

### How to Get OTP (Mock Mode)

1. Register a new user
2. Open Browser Console (F12)
3. Look for: `📧 Mock OTP for newuser@example.com : 123456`
4. Copy the 6-digit code
5. Use it in verify email page

---

## 🐛 Bug Reporting Template

When you find a bug, document it:

```
Bug ID: BUG-REG-001
Test Case: TC-REG-001
Severity: High / Medium / Low
Status: Open / Fixed / Closed

Steps to Reproduce:
1. ...
2. ...
3. ...

Expected Result:
...

Actual Result:
...

Screenshots:
(attach if applicable)

Environment:
- Browser: Chrome 120
- OS: Windows 11
- Mock Mode: Enabled/Disabled
```

---

## 📊 Test Execution Report Template

### Test Session Information
- **Date:** 2026-01-26
- **Tester:** Your Name
- **Environment:** Mock Mode / Real Backend
- **Browser:** Chrome / Firefox / Safari
- **OS:** Windows / Mac / Linux

### Test Results Summary

| Priority | Total | Passed | Failed | Blocked | Pass Rate |
|----------|-------|--------|--------|---------|-----------|
| P0 | 10 | - | - | - | -% |
| P1 | 16 | - | - | - | -% |
| P2 | 11 | - | - | - | -% |
| **Total** | **37** | - | - | - | -% |

### Failed Test Cases

| Test Case ID | Category | Issue Description | Severity |
|--------------|----------|-------------------|----------|
| TC-REG-XXX | ... | ... | High/Medium/Low |

### Bugs Found

| Bug ID | Test Case | Description | Status |
|--------|-----------|-------------|--------|
| BUG-REG-001 | TC-REG-XXX | ... | Open |

---

## ✅ Acceptance Criteria

### Minimum Pass Rate:
- **P0 Tests:** 100% must pass
- **P1 Tests:** ≥ 90% must pass
- **P2 Tests:** ≥ 80% must pass

### Critical Flows Must Work:
1. ✅ Complete registration flow
2. ✅ OTP verification
3. ✅ Resend OTP
4. ✅ Route protection
5. ✅ Duplicate detection

---

## 🔄 Regression Testing

When to run regression tests:
- ✅ After any code change in register flow
- ✅ Before merging to main branch
- ✅ Before production deployment
- ✅ After backend API changes

**Quick Regression Suite (5 mins):**
- TC-REG-001: Valid Registration
- TC-VER-001: Valid OTP
- TC-FLOW-001: Complete Happy Path
- TC-REG-014: Duplicate Email
- TC-REG-016: Route Protection

---

## 📞 Support

**Questions about testing?**
- Check `MOCK_MODE_GUIDE.md` for mock mode help
- Review business rules in S-03 documentation
- Ask team lead for clarification

**Found issues with test cases?**
- Update the CSV file
- Document changes in Notes column
- Notify team

---

## 📅 Test Schedule (Example)

| Phase | Duration | Tests | Responsible |
|-------|----------|-------|-------------|
| Unit Testing | 1 day | P0 tests | Developer |
| Integration Testing | 1 day | P0 + P1 tests | QA Team |
| Full Testing | 2 days | All tests | QA Team |
| Regression | 0.5 day | Quick suite | QA Team |

---

## 🎯 Success Metrics

### Definition of Done:
- ✅ All P0 tests passed
- ✅ ≥ 90% P1 tests passed
- ✅ No critical bugs
- ✅ All high-priority bugs fixed
- ✅ Test report completed
- ✅ Code reviewed and approved

---

## 📚 Additional Resources

- **Business Rules:** See S-03 documentation
- **Mock Mode Guide:** `MOCK_MODE_GUIDE.md`
- **API Documentation:** (when available)
- **Design Specs:** (if applicable)

---

**Last Updated:** 2026-01-26  
**Version:** 1.0  
**Status:** Ready for Testing ✅
