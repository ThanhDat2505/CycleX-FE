# 🦅 CycleX Clean Code Guidelines

*(Adopted from SWP391 Refactoring S-10 & S-11)*

## 1. Separation of Concerns (SoC) - ⛔ No Logic in UI
- **Components (`app/components`):** Purely for display. Receive data via props or hooks.
- **Pages (`app/*/page.tsx`):** Container only. Delegate logic to Hooks.
- **Hooks (`app/hooks`):** Manage state (`useState`), effects (`useEffect`), and business logic.
- **Services (`app/services`):** Handle API calls and raw data validation.

**❌ BAD:**
```tsx
// Inside Page Component
const [data, setData] = useState([]);
useEffect(() => { fetch('/api').then(...) }, []);
```

**✅ GOOD:**
```tsx
// Inside Page Component
const { data, loading, error } = useDataHook();
```

---

## 2. No Hardcoding - 🔢 Use Constants
- **Magic Numbers:** Extract to `app/constants/index.ts`.
- **Mock Data:** Remove immediately after API integration.
- **Strings:** Use Enums or Constants for status values (e.g., `ListingStatus`).

**❌ BAD:**
```tsx
if (status === 'ACTIVE') ...
const limit = 10;
```

**✅ GOOD:**
```tsx
import { LISTING_STATUS, ITEMS_PER_PAGE } from '@/app/constants';
if (status === LISTING_STATUS.ACTIVE) ...
const limit = ITEMS_PER_PAGE;
```

---

## 3. DRY (Don't Repeat Yourself) - 🧰 Use Utilities
- **Validation:** Use `app/utils/apiValidation.ts`.
- **Formatting:** Use `formatPrice` from `app/utils/format.ts`.
- **Components:** Extract repetitive UI into `components/` (e.g., `<ErrorBanner />`, `<MetricCard />`).

---

## 4. Robust Error Handling - 🛡️ Fail Gracefully
- **Loading States:** Always show spinners/skeletons while fetching.
- **Error States:** Display user-friendly error messages (not just `console.error`).
- **Retry Mechanism:** Provide a way for users to recover (e.g., "Try Again" button).

---

## 5. Type Safety (TypeScript) - 🔒 No `any`
- **Interfaces:** Define DTOs (Data Transfer Objects) in Service files.
- **Strict Typing:** Avoid `any`. Use `interface` or `type` for all props and responses.
- **Validation:** Validate API responses against expected types at the Service layer.

---

## 6. Project Structure Standard
```
app/
├── components/   # Reusable UI (MetricCard, ErrorBanner)
├── hooks/        # State & Logic (useDashboard, useMyListings)
├── services/     # API Calls & DTOs
├── utils/        # helpers (format, validation)
└── constants/    # Config values
```
