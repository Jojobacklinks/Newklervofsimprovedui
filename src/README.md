# Klervo Dashboard

A comprehensive field service management dashboard built with React, TypeScript, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
klervo-dashboard/
├── App.tsx                 # Main app component
├── routes.ts              # Route configuration
├── index.html             # HTML entry point
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite config
├── styles/
│   └── globals.css        # Global styles & design tokens
├── pages/                 # Page components
│   ├── DashboardPage.tsx
│   ├── AllJobsPage.tsx
│   ├── TeamPage.tsx
│   ├── TeamProfilePage.tsx
│   └── ... (all other pages)
├── components/            # Reusable components
│   ├── Sidebar.tsx
│   ├── RootLayout.tsx
│   ├── DateRangePicker.tsx
│   └── ... (all other components)
├── contexts/              # React contexts
│   ├── JobsContext.tsx
│   └── PromotionsContext.tsx
└── data/
    └── jobsData.ts        # Mock data

```

## 🎨 Design System

- **Primary Color:** #9473ff
- **Text Color:** #051046
- **Border Color:** #e2e8f0 / #e8e8e8
- **Border Radius (Cards):** 20px
- **Border Radius (Buttons):** 32px
- **Border Radius (Inputs):** 15px
- **Font Family:** Poppins (Google Fonts)

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **Recharts** - Charts & graphs

## 📄 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 License

Proprietary - All rights reserved

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.
