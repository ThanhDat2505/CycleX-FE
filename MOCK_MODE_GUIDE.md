# Mock Mode - Testing Guide

## 📋 Overview

Mock mode allows you to test the entire authentication flow without a backend server. This is useful for:
- Frontend development and testing
- UI/UX validation
- Demo purposes
- Development when backend is not ready

---

## 🚀 How to Enable Mock Mode

### 1. Edit `.env.local`

```bash
# Set this to 'true' to enable mock mode
NEXT_PUBLIC_MOCK_API=true
```

### 2. Restart Dev Server

```bash
pnpm run dev
```

---

## 👥 Mock Users Database

### Pre-registered Users (for Login Testing)

| Email | Password | Role | Status | Verified |
|-------|----------|------|--------|----------|
| `test@example.com` | `password123` | BUYER | ACTIVE | ✅ Yes |
| `buyer@example.com` | `buyer123` | BUYER | ACTIVE | ✅ Yes |
| `seller@example.com` | `seller123` | SELLER | ACTIVE | ✅ Yes |
| `unverified@example.com` | `unverified123` | BUYER | ACTIVE | ❌ No |

---

## 🧪 Testing Scenarios

### ✅ **Scenario 1: Complete Register Flow (New User)**

1. **Go to Register Page**
   - URL: `http://localhost:3000/register`

2. **Fill Form with NEW email** (not in mock database)
   ```
   Email: newuser@example.com
   Password: password123
   Confirm Password: password123
   CCCD: 123456789012
   Phone: 0999888777 (optional)
   ```

3. **Click Register**
   - ✅ Success → Redirect to Verify Email
   - 📧 Check browser console for OTP code
   - Example: `📧 Mock OTP for newuser@example.com : 123456`

4. **Enter OTP from console**
   - Copy the 6-digit OTP from console
   - Paste into verify email form
   - Click "Verify Email"

5. **Success**
   - ✅ Redirect to Login page
   - User is now verified and can login

---

### ❌ **Scenario 2: Duplicate Email (Error Testing)**

1. **Go to Register Page**

2. **Fill Form with EXISTING email**
   ```
   Email: test@example.com (already exists)
   Password: anything
   Confirm Password: anything
   CCCD: 123456789012
   ```

3. **Click Register**
   - ❌ Error: "Email already exists"

---

### ❌ **Scenario 3: Duplicate Phone (Error Testing)**

1. **Go to Register Page**

2. **Fill Form with EXISTING phone**
   ```
   Email: newuser2@example.com
   Password: password123
   Confirm Password: password123
   CCCD: 123456789012
   Phone: 0123456789 (already exists)
   ```

3. **Click Register**
   - ❌ Error: "Phone number already exists"

---

### ✅ **Scenario 4: Login with Verified User**

1. **Go to Login Page**
   - URL: `http://localhost:3000/login`

2. **Enter Credentials**
   ```
   Email: test@example.com
   Password: password123
   ```

3. **Click Login**
   - ✅ Success → Redirect to Home
   - Token saved to localStorage

---

### ❌ **Scenario 5: Login with Unverified User**

1. **Go to Login Page**

2. **Enter Credentials**
   ```
   Email: unverified@example.com
   Password: unverified123
   ```

3. **Click Login**
   - ❌ Error: "Please verify your email before logging in"

---

### ❌ **Scenario 6: Login with Wrong Password**

1. **Go to Login Page**

2. **Enter Wrong Credentials**
   ```
   Email: test@example.com
   Password: wrongpassword
   ```

3. **Click Login**
   - ❌ Error: "Email or password is incorrect"

---

### ✅ **Scenario 7: OTP Verification**

1. **Register a new user** (see Scenario 1)

2. **On Verify Email Page**
   - Check console for OTP: `📧 Mock OTP for ... : 123456`
   - Enter the OTP
   - Click "Verify Email"
   - ✅ Success → Redirect to Login

---

### ✅ **Scenario 8: Resend OTP**

1. **On Verify Email Page**

2. **Click "Resend OTP"**
   - ✅ New OTP generated (check console)
   - ⏰ Cooldown timer: 60 seconds
   - ⏰ Expiration timer reset to 5:00

3. **Wait for cooldown**
   - Button disabled during cooldown
   - Shows "Resend (59s)", "Resend (58s)", etc.

4. **After cooldown**
   - Button enabled again
   - Can resend OTP

---

### ❌ **Scenario 9: Expired OTP**

1. **Register a new user**

2. **On Verify Email Page**
   - Wait for 5 minutes (or modify `expiresIn` in mockData.ts)
   - Timer shows "0:00"
   - Verify button disabled

3. **Try to verify**
   - ❌ Button disabled
   - Message: "OTP has expired. Please request a new one."

4. **Click Resend OTP**
   - ✅ New OTP generated
   - Timer reset

---

### ❌ **Scenario 10: Invalid OTP**

1. **On Verify Email Page**

2. **Enter wrong OTP**
   ```
   OTP: 999999 (wrong code)
   ```

3. **Click Verify**
   - ❌ Error: "Invalid or expired OTP code"

---

## 🔍 How to Check OTP in Mock Mode

### Method 1: Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for messages like:
   ```
   📧 Mock OTP for newuser@example.com : 123456
   ⏰ Expires at: 7:15:30 PM
   ```

### Method 2: Check Mock Data File

1. Open `app/services/mockData.ts`
2. Add console.log in `storeMockOtp` function
3. OTP is logged when:
   - User registers
   - User clicks "Resend OTP"

---

## 🛠️ Customization

### Add More Mock Users

Edit `app/services/mockData.ts`:

```typescript
export const mockUsers: Record<string, User & { password: string }> = {
    'youruser@example.com': {
        id: 'mock-user-5',
        email: 'youruser@example.com',
        name: 'Your Name',
        password: 'yourpassword',
        role: 'BUYER',
        status: 'ACTIVE',
        is_verified: true,
    },
    // ... add more users
};
```

### Change OTP Expiration Time

Edit `app/services/mockData.ts`:

```typescript
export const storeMockOtp = (email: string): string => {
    const otp = generateMockOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // Change to 10 minutes
    // ...
};
```

### Change Resend Cooldown

Edit `app/verify-email/VerifyEmailForm.tsx`:

```typescript
setResendCooldown(120); // Change to 120 seconds (2 minutes)
```

---

## 🔄 Disable Mock Mode

When backend is ready:

### 1. Edit `.env.local`

```bash
# Set to 'false' or remove the line
NEXT_PUBLIC_MOCK_API=false
```

### 2. Restart Dev Server

```bash
pnpm run dev
```

Now all API calls will go to the real backend at `NEXT_PUBLIC_API_URL`.

---

## 📊 Mock vs Real API

| Feature | Mock Mode | Real API |
|---------|-----------|----------|
| Network calls | ❌ No | ✅ Yes |
| Backend required | ❌ No | ✅ Yes |
| OTP via email | ❌ Console only | ✅ Real email |
| Data persistence | ❌ In-memory only | ✅ Database |
| User verification | ✅ Simulated | ✅ Real |
| Error simulation | ✅ Yes | ✅ Real errors |

---

## 🐛 Troubleshooting

### Mock mode not working?

1. **Check `.env.local`**
   - Make sure `NEXT_PUBLIC_MOCK_API=true`
   - No typos

2. **Restart dev server**
   - Environment variables only load on startup
   - Stop and run `pnpm run dev` again

3. **Check browser console**
   - Look for OTP messages
   - Check for errors

### Can't find OTP?

1. **Open browser console** (F12)
2. Look for `📧 Mock OTP for ...`
3. If not found, check `app/services/mockData.ts`

### Login not working?

1. **Check credentials**
   - Use pre-registered users from table above
   - Or register a new user first

2. **Check verification status**
   - User must be verified to login
   - Unverified users will get error

---

## ✅ Summary

Mock mode provides a complete testing environment for:
- ✅ User registration
- ✅ Email verification (OTP)
- ✅ OTP resend
- ✅ OTP expiration
- ✅ User login
- ✅ Error handling
- ✅ Duplicate detection
- ✅ Verification status check

**Perfect for frontend development without backend dependency!** 🚀
