# CycleX-FE Project Context & Rules
- **Project**: SWP391 - CycleX Frontend
- **Role**: Frontend Developer Assistant (Strict Compliance)
- **Language**: Vietnamese (Tiếng Việt)
- **Priorities**: System Safety > SWP391 Documents > Business Flow > Correctness > UI

## 🛠 Tech Stack Implementation (STRICT MODE)
1. **Styling**:
   - **Tailwind CSS v3.4** ONLY.
   - ❌ NO Bootstrap, MUI, or arbitrary values (e.g., `w-[123px]`) unless unavoidable.
   - Use semantic class grouping.

2. **Data Fetching (Native)**:
   - Use **`fetch` + `useEffect`**.
   - **MANDATORY**: Always implement `AbortController` to cleanup requests in `useEffect`.
   - **MANDATORY**: Always wrap `fetch` in `try-catch-finally` to handle Loading/Error states.
   - ❌ NO React Query / Axios / SWR.

3. **State Management**:
   - **`useState` / `useContext`** only.
   - ❌ NO Redux / Zustand.

4. **Forms (Manual)**:
   - **Controlled Components**: Use `useState` for each input.
   - **Validation**: Write explicit regex/logic checks before API calls.
   - **UI Feedback**: Must explicitly show error text below inputs when invalid.
   - ❌ NO Form libraries (React Hook Form/Formik).

## 🛑 Critical Hard Constraints
1. **Scope Lock**:
   - Follow **BP1–BP7** docs strictly.
   - Frontend ONLY reflects backend state. DO NOT invent business rules.
2. **File Safety**:
   - **NEVER EDIT**: `next.config.ts`, `tsconfig.json`, `pnpm-lock.yaml`.
   - **NEVER DELETE**: Files without explicit permission.
3. **Logic Boundary**:
   - Validate ALL API responses (Check `null`, `undefined`, data types).
   - Do not trust Backend data blindly.

## 📋 Business Logic: Listing Status Rules
| Status | Edit Allowed? | Note |
| :--- | :--- | :--- |
| `DRAFT` | ✅ YES | |
| `NEED_MORE_INFO` | ✅ YES | |
| `PENDING` | ❌ NO | Locked for review |
| `REVIEWING` | ❌ NO | Under review |
| `APPROVED` | ❌ NO | Live on site |
| `REJECTED` | ❌ NO | End state |
| `HELD` | ❌ NO | Transaction in progress |
| `SOLD` | ❌ NO | Final state |

## 🛡️ Security & Performance Checklist
**Before marking task as DONE, verify:**
- [ ] **Cleanup**: Did `useEffect` return a cleanup function?
- [ ] **Security**: No `dangerouslySetInnerHTML`, no `eval()`.
- [ ] **Memory**: `addEventListener` removed? Timers cleared?
- [ ] **Performance**: `useCallback` for props passed to children?
- [ ] **Inputs**: All form inputs have `value` and `onChange`.

## 📝 Clean Code & Workflow
1. **Analyze**: Check existing `app/components` or `app/utils` for reusability.
2. **Refactor**: If a component exceeds 200 lines, suggest extracting logic to a Custom Hook (e.g., `useLoginForm`).
3. **Naming**: Variables must be explicit (e.g., `isSubmitting`, `errorMessage`, `handleNameChange`).
4. **DRY**: Do not duplicate validation logic; move to `utils/validation.ts`.

## ⚠️ Error Handling Pattern (Must Follow)
```javascript
useEffect(() => {
  const controller = new AbortController();
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/...', { signal: controller.signal });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      // VALIDATE DATA HERE BEFORE SETTING STATE
      setData(data);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
  return () => controller.abort(); // CLEANUP IS MANDATORY
}, []);