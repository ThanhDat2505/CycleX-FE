# 🧪 LOGIN FLOW - TEST GUIDE (S-02 Compliance)

## 📋 Test Scenarios

### ✅ **Test Case 1: ACTIVE + Verified User (Happy Path)**

**Credentials:**
```
Email: test@example.com
Password: password123
```

**Expected Behavior:**
1. ✅ Login successful
2. ✅ Token saved to localStorage
3. ✅ Redirect to `/` (Home)
4. ✅ No error messages

**Business Rules:** BR-L02, BR-L03, BR-L05, BR-L08

---

### ❌ **Test Case 2: Unverified User (isVerify = false)**

**Credentials:**
```
Email: unverified@example.com
Password: unverified123
```

**Expected Behavior:**
1. ❌ Login blocked
2. ✅ Error message: "Please verify your email first"
3. ✅ Redirect to `/verify-email?email=unverified@example.com`
4. ❌ No token saved

**Business Rules:** BR-L07

---

### ❌ **Test Case 3: INACTIVE User**

**Credentials:**
```
Email: inactive@example.com
Password: inactive123
```

**Expected Behavior:**
1. ❌ Login blocked
2. ✅ Error message: "Account inactive. Please verify your email"
3. ✅ Redirect to `/verify-email?email=inactive@example.com`
4. ❌ No token saved

**Business Rules:** BR-L05, BR-L06

---

### ❌ **Test Case 4: SUSPENDED User**

**Credentials:**
```
Email: suspended@example.com
Password: suspended123
```

**Expected Behavior:**
1. ❌ Login blocked
2. ✅ Error message: "Your account has been suspended. Please contact Admin or Inspector for assistance."
3. ❌ No redirect (stays on login page)
4. ❌ No token saved

**Business Rules:** BR-L05, BR-L06

---

### ❌ **Test Case 5: Wrong Password**

**Credentials:**
```
Email: test@example.com
Password: wrongpassword
```

**Expected Behavior:**
1. ❌ Login failed
2. ✅ Error message: "Email or password is incorrect"
3. ❌ No redirect
4. ❌ No token saved

**Business Rules:** BR-L11

---

### ❌ **Test Case 6: Non-existent User**

**Credentials:**
```
Email: notexist@example.com
Password: anything
```

**Expected Behavior:**
1. ❌ Login failed
2. ✅ Error message: "Account not found" or "Email or password is incorrect"
3. ❌ No redirect
4. ❌ No token saved

**Business Rules:** BR-L11

---

### ✅ **Test Case 7: Password Validation**

**Test 7a: Too Short**
```
Email: test@example.com
Password: pass (4 chars)
```
**Expected:** ❌ Error: "Password must be at least 6 characters long"

**Test 7b: Valid Length**
```
Email: test@example.com
Password: password (8 chars)
```
**Expected:** ✅ Proceed to API call

**Business Rules:** BR-L09

---

### ✅ **Test Case 8: Email Validation**

**Test 8a: Invalid Format**
```
Email: notanemail
Password: password123
```
**Expected:** ❌ Error: "Email is invalid"

**Test 8b: Valid Format**
```
Email: test@example.com
Password: password123
```
**Expected:** ✅ Proceed to API call

**Business Rules:** BR-L10

---

## 🎯 **State Transition Testing**

### **State L1: ACTIVE + Verified → Login Allowed**
```
User: test@example.com
Status: ACTIVE
isVerify: true
Result: ✅ Login successful → Home
```

### **State L2: INACTIVE + Unverified → Login Forbidden**
```
User: inactive@example.com
Status: INACTIVE
isVerify: false
Result: ❌ Redirect to verify email
```

### **State L3: SUSPENDED → Login Forbidden**
```
User: suspended@example.com
Status: SUSPENDED
isVerify: true
Result: ❌ Error message, no login
```

---

## 📊 **Test Coverage Matrix**

| Business Rule | Test Case | Status |
|---------------|-----------|--------|
| BR-L01: Actor hợp lệ | All | ✅ |
| BR-L02: Login API | TC-1 | ✅ |
| BR-L03: Set auth state | TC-1 | ✅ |
| BR-L04: Status types | TC-1,3,4 | ✅ |
| BR-L05: Status handling | TC-1,3,4 | ✅ |
| BR-L06: Status != ACTIVE | TC-3,4 | ✅ |
| BR-L07: isVerify = false | TC-2,3 | ✅ |
| BR-L08: Redirect Home | TC-1 | ✅ |
| BR-L09: Password rule | TC-7 | ✅ |
| BR-L10: Email rule | TC-8 | ✅ |
| BR-L11: Error handling | TC-5,6 | ✅ |

**Coverage: 11/11 = 100%** ✅

---

## 🚀 **How to Test**

### **Setup:**
1. Enable mock mode:
   ```bash
   # .env.local
   NEXT_PUBLIC_MOCK_API=true
   ```

2. Start dev server:
   ```bash
   pnpm run dev
   ```

3. Navigate to: `http://localhost:3000/login`

### **Test Execution:**
1. Run each test case above
2. Verify expected behavior
3. Check browser console for:
   - Token save messages
   - OTP messages (for verify email)
   - Error logs

### **Verification Checklist:**
- [ ] TC-1: ACTIVE user can login
- [ ] TC-2: Unverified user redirected
- [ ] TC-3: INACTIVE user redirected
- [ ] TC-4: SUSPENDED user blocked
- [ ] TC-5: Wrong password error
- [ ] TC-6: Non-existent user error
- [ ] TC-7: Password validation
- [ ] TC-8: Email validation

---

## 📝 **Test Users Summary**

| Email | Password | Status | isVerify | Expected Result |
|-------|----------|--------|----------|-----------------|
| test@example.com | password123 | ACTIVE | ✅ | ✅ Login success |
| buyer@example.com | buyer123 | ACTIVE | ✅ | ✅ Login success |
| seller@example.com | seller123 | ACTIVE | ✅ | ✅ Login success |
| unverified@example.com | unverified123 | ACTIVE | ❌ | ❌ Redirect verify |
| inactive@example.com | inactive123 | INACTIVE | ❌ | ❌ Redirect verify |
| suspended@example.com | suspended123 | SUSPENDED | ✅ | ❌ Error message |

---

## ✅ **Success Criteria**

All test cases must pass:
- ✅ ACTIVE + verified users can login
- ✅ Unverified users redirected to verify email
- ✅ INACTIVE users redirected to verify email
- ✅ SUSPENDED users see error message
- ✅ Wrong credentials show error
- ✅ Validation works correctly
- ✅ No TypeScript errors
- ✅ 100% S-02 compliance
