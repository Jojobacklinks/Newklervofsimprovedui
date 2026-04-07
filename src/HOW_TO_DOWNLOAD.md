# 📥 How to Download Klervo Dashboard Code

Since there's no export button, follow these steps to get all your code:

## Step 1: Create Project Folder on Your Computer

```bash
mkdir klervo-dashboard
cd klervo-dashboard
```

## Step 2: Copy These Files (in order)

### **Configuration Files** (Copy these first)
1. ✅ `package.json` - Dependencies list
2. ✅ `tsconfig.json` - TypeScript config
3. ✅ `tsconfig.node.json` - Node TypeScript config
4. ✅ `vite.config.ts` - Vite bundler config
5. ✅ `index.html` - HTML entry point
6. ✅ `.gitignore` - Git ignore rules
7. ✅ `README.md` - Documentation

### **Core Application Files**
8. ✅ `App.tsx` - Main app component
9. ✅ `routes.ts` - Route configuration

### **Styles**
10. ✅ `styles/globals.css` - Global styles

### **Contexts** (Create `contexts/` folder)
11. ✅ `contexts/JobsContext.tsx`
12. ✅ `contexts/PromotionsContext.tsx`

### **Data** (Create `data/` folder)
13. ✅ `data/jobsData.ts`

### **Components** (Create `components/` folder) - 70+ files
Copy all files from `/components/` directory:
- `ActivityTimelineView.tsx`
- `AddClientModal.tsx`
- `AddCustomValueModal.tsx`
- `AddLeadModal.tsx`
- `AddServicePlanModal.tsx`
- `DateRangePicker.tsx`
- `DeleteConfirmationPopup.tsx`
- `DeveloperNotesPopup.tsx`
- `EditAppointmentModal.tsx`
- `EditTaskModal.tsx`
- `ErrorBoundary.tsx`
- `EstimatePanel.tsx`
- `LeadCard.tsx`
- `LeadDetailModal.tsx`
- `NewJobModal.tsx`
- `NotesPanel.tsx`
- `RootLayout.tsx`
- `Sidebar.tsx`
- `StatusLabel.tsx`
- `SuccessPopup.tsx`
- `UsageHistoryView.tsx`
- And ALL files in `components/ui/` subfolder
- And ALL files in `components/figma/` subfolder

### **Pages** (Create `pages/` folder) - 24 files
Copy all files from `/pages/` directory:
- `AllJobsPage.tsx`
- `ClientProfilePage.tsx`
- `ClientsPage.tsx`
- `CustomerPortalPage.tsx`
- `DashboardPage.tsx`
- `EstimatesPage.tsx`
- `HelpPage.tsx`
- `InventoryPage.tsx`
- `InvoicesPage.tsx`
- `JobDetailsPageV2.tsx`
- `JoinPage.tsx`
- `KlervoAIPage.tsx`
- `LeadsPage.tsx`
- `ReportPage.tsx`
- `Reports.tsx`
- `SchedulePage.tsx`
- `ServicePlansPage.tsx`
- `SettingsPage.tsx`
- `SignupLoginPage.tsx`
- `TeamPage.tsx`
- `TeamProfilePage.tsx`
- `UIKitPage.tsx`
- `UserRoleViewsPage.tsx`
- (Skip backup files like `.backup.tsx`)

### **Imports** (Create `imports/` folder)
14. ✅ `imports/LeadMain.tsx`
15. ✅ `imports/svg-na8b6s0e6e.ts`

---

## Step 3: How to Copy Each File

**In Figma Make:**
1. Click on a file in the left sidebar
2. Select all code (Ctrl+A / Cmd+A)
3. Copy (Ctrl+C / Cmd+C)

**On Your Computer:**
4. Create the file with same name and path
5. Paste the code
6. Save

---

## Step 4: Install & Run

Once all files are copied:

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Your app will open at `http://localhost:5173`

---

## Step 5: Push to GitHub

```bash
# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Klervo Dashboard"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/klervo-dashboard.git

# Push to GitHub
git push -u origin main
```

---

## 📊 File Count Summary

- **Total Files:** ~120
- **Core Files:** 9
- **Components:** 70+
- **Pages:** 24
- **Contexts:** 2
- **Data:** 1
- **Other:** Various utilities and configs

---

## ⚠️ Important Notes

- Skip any `.backup` files (they're not needed)
- Skip documentation files like `DEVELOPER_NOTES_DOCUMENTATION.md` (optional)
- The `components/figma/ImageWithFallback.tsx` is protected - copy as-is
- Make sure folder structure matches exactly

---

## 🆘 Need Help?

If you get stuck, you can ask me to:
- Show you the contents of any specific file
- Explain what a file does
- Help troubleshoot errors after setup

Good luck! 🚀
