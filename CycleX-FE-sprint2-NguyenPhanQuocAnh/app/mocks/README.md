# Mock Data

This folder contains all mock data used for frontend development when backend is not available.

## Usage

Set `NEXT_PUBLIC_MOCK_API=true` in `.env.local` to enable mock mode.

## Files

### `homeBikes.ts`
Mock data for Home page "Xe Đạp Đang Hot" section.
- **Function:** `generateMockHomeBikes()`
- **Returns:** 6 `HomeBike` objects
- **Used by:** `FeaturedBikesSection.tsx`

### `listings.ts`
Mock data for full bike listings (pagination, search, etc.)
- **Function:** `generateMockListings(count)`
- **Constant:** `MOCK_LISTINGS` (24 pre-generated items)
- **Used by:** `listingService.ts`

### `index.ts`
Central export point for all mock data.

## Adding New Mock Data

1. Create a new file in this folder (e.g., `categories.ts`)
2. Define your mock data generator function
3. Export it from `index.ts`
4. Import from `../mocks` in your component/service

Example:
```typescript
// In your component
import { generateMockCategories } from '../mocks';
```
