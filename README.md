# 🚴 CycleX - Specialized Bicycle Marketplace

CycleX is a comprehensive platform for buying and selling specialized bicycles, featuring inspection verification, secure transactions, and delivery tracking.

## 🚀 Overview

This is the Frontend repository for CycleX, built with **Next.js** and designed to support a multi-role ecosystem including Buyers, Sellers, Inspectors, Shippers, and Admins.

---

## 🛠️ Technology Stack

- **Core:** [Next.js 15+](https://nextjs.org), [React 19](https://react.dev)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Icons:** [Lucide React](https://lucide.dev)
- **Design:** Modern UI with focus on performance and accessibility.

---

## 📦 Core Business Processes (BP)

The platform strictly follows the documented business flows:

1.  **BP1: Listing Management** – Sellers create and manage bicycle listings.
2.  **BP2: Listing Review** – Inspectors verify listings before they go public.
3.  **BP3: Search & Discovery** – Buyers search and filter for verified bicycles.
4.  **BP4: Inspection Comms** – Direct Q&A between Inspectors and Sellers.
5.  **BP5: Purchase & Deposits** – Secure transaction requests and payment flow.
6.  **BP6: Delivery Tracking** – Shippers manage and confirm physical delivery.
7.  **BP7: Dispute Resolution** – Standardized handling of transaction issues.

---

## 🚦 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- `pnpm` (Recommended) or `npm`

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
pnpm install
```

### Development

```bash
pnpm dev
# or 
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## ⚙️ Configuration

### API Toggle (Mock vs Real)

The project includes an auto-switch mechanism for API endpoints. Configure this in `.env.local`:

```env
# Set to 'true' to use local JSON mock data
# Set to 'false' to connect to the actual Backend API
NEXT_PUBLIC_MOCK_API=true
```

---

## 📁 Project Structure

```text
app/
├── (auth)/             # Authentication routes (login, register)
├── admin/              # Admin dashboard and management
├── components/         # Reusable UI components
├── constants/          # App-wide constants and enums
├── docs/               # Detailed technical documentation
├── hooks/              # Custom React hooks
├── inspector/          # Inspector role screens
├── listings/           # Public listing search and details
├── services/           # API service layers
├── shipper/            # Shipper role screens
├── types/              # TypeScript interfaces and types
└── ...
```

---

## 📖 Documentation Index

For deep-dives into specific areas, please refer to our internal documentation:

👉 **[Complete Documentation Index](./docs/INDEX.md)**

- [Screen Flow Overview](./docs/ScreenFlow.md)
- [API Integration Guide](./docs/API_INTEGRATION_GUIDE.md)
- [Clean Code Guidelines](./docs/CLEAN_CODE_GUIDELINES.md)
- [Dashboad Analysis](./docs/DASHBOARD_DETAILED_ANALYSIS.md)

---

## 🎨 Design Resources

- **Figma Mockup:** [CycleX Figma](https://mock-branch-01543539.figma.site)

---

**Last Updated:** March 14, 2026
