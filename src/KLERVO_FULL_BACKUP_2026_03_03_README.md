# KLERVO FULL SYSTEM BACKUP
# Backup Date: March 3, 2026
# Backup Name: KLERVO_FULL_BACKUP_2026_03_03

## BACKUP SUMMARY
This backup contains all critical files for the Klervo Field Service Management Dashboard.
All dashboards (Admin, Staff, Customer) and features are included.

## ROUTING & CONFIGURATION
✅ App.tsx - Main application entry point with ErrorBoundary and JobsContext
✅ routes.ts - Complete routing for Admin, Staff, and Customer portals
✅ styles/globals.css - Global design system (Poppins font, colors, borders)

## CORE COMPONENTS
✅ components/RootLayout.tsx - Main layout with header, sidebar, notifications
✅ components/Sidebar.tsx - Navigation sidebar with role-based menus
✅ components/DeveloperNotesPopup.tsx - Developer notes system
✅ components/StatusLabel.tsx - Reusable status label component
✅ components/ErrorBoundary.tsx - Error handling wrapper

## MODAL COMPONENTS
✅ components/AddLeadModal.tsx - Add new lead modal
✅ components/AddClientModal.tsx - Add new client modal
✅ components/AddServicePlanModal.tsx - Add service plan modal
✅ components/NewJobModal.tsx - Create new job modal
✅ components/LeadDetailModal.tsx - Lead details modal
✅ components/AddCustomValueModal.tsx - Custom value modal

## CARD & DISPLAY COMPONENTS
✅ components/LeadCard.tsx - Lead card component
✅ components/EstimatePanel.tsx - Estimate panel
✅ components/NotesPanel.tsx - Notes panel
✅ components/ActivityTimelineView.tsx - Activity timeline
✅ components/UsageHistoryView.tsx - Usage history view
✅ components/DateRangePicker.tsx - Date range picker

## ADMIN & STAFF PAGES (Shared)
✅ pages/DashboardPage.tsx - Main dashboard with stats and metrics
✅ pages/SchedulePage.tsx - Calendar view with jobs
✅ pages/AllJobsPage.tsx - All jobs list view
✅ pages/JobDetailsPageV2.tsx - Detailed job view with timeline
✅ pages/EstimatesPage.tsx - Estimates management
✅ pages/InvoicesPage.tsx - Invoices management
✅ pages/ClientsPage.tsx - Clients list view
✅ pages/ClientProfilePage.tsx - Individual client profile with tabs
✅ pages/KlervoAIPage.tsx - AI Chat assistant (System, Help, General ChatGPT)
✅ pages/SettingsPage.tsx - Settings page
✅ pages/HelpPage.tsx - Help & support page

## ADMIN-ONLY PAGES
✅ pages/LeadsPage.tsx - Lead management with pipeline view
✅ pages/ServicePlansPage.tsx - Service plans & subscriptions
✅ pages/ReportPage.tsx - Payment reports
✅ pages/Reports.tsx - Comprehensive analytics & reports
✅ pages/InventoryPage.tsx - Inventory management
✅ pages/TeamPage.tsx - Team management with roles

## CUSTOMER PORTAL
✅ pages/CustomerPortalPage.tsx - Complete customer portal dashboard

## SPECIAL PAGES
✅ pages/UserRoleViewsPage.tsx - Role selection landing page (/, root)
✅ pages/UIKitPage.tsx - Complete UI design system showcase
✅ pages/TechnicianIndicatorDemo.tsx - Technician indicator demo

## CONTEXTS & DATA
✅ contexts/JobsContext.tsx - Jobs state management
✅ data/jobsData.ts - Jobs mock data

## DESIGN SYSTEM COMPONENTS (components/ui/)
All Shadcn UI components are included:
- accordion, alert-dialog, alert, aspect-ratio, avatar, badge
- breadcrumb, button, calendar, card, carousel, chart, checkbox
- collapsible, command, context-menu, dialog, drawer, dropdown-menu
- form, hover-card, input-otp, input, label, menubar, navigation-menu
- pagination, popover, progress, radio-group, resizable, scroll-area
- select, separator, sheet, sidebar, skeleton, slider, sonner
- switch, table, tabs, textarea, toggle-group, toggle, tooltip
- use-mobile.ts, utils.ts

## FIGMA IMPORTS
✅ imports/LeadMain.tsx - Figma imported component
✅ imports/svg-na8b6s0e6e.ts - SVG assets

## DOCUMENTATION
✅ STYLE_GUIDE.md - Complete design system rules
✅ DEVELOPER_NOTES_DOCUMENTATION.md - Developer notes system guide
✅ Attributions.md - Third-party attributions
✅ guidelines/Guidelines.md - Project guidelines

## DESIGN SYSTEM RULES
- Border Radius: 20px (cards/popups), 15px (form fields), 32px (buttons)
- Border Color: #e2e8f0 (cards), #e8e8e8 (inputs)
- Text Color: #051046 (all text and headings)
- Primary Button: #9473ff background, #7f5fd9 hover
- Font: Poppins (global, all elements)
- Shadows: Soft shadows throughout (rgba(226, 232, 240, 0.5) 0px 2px 16px 2px)
- Page Headers: Only in top nav bar, NEVER in page bodies

## USER ROLES & ROUTING
### Admin Dashboard (/admin)
- Full access to all features
- Lead Management, Service Plans, Team, Inventory, Reports
- Route: /admin/* (17 routes)

### Staff Dashboard (/staff)
- Limited access
- Schedule, Jobs, Clients, Klervo AI, Settings, Help
- Route: /staff/* (10 routes)

### Customer Portal (/customer)
- Customer-facing dashboard
- Jobs, Invoices, Service Plans, Support
- Route: /customer

## STATUS LABEL COLORS (Consistent across all pages)
### Lead Stages
- New: #399DEB
- Contacted: #28BDF2
- Price Shared: #B9DF10
- Follow-Up: #F0A041
- Won: #9473ff
- Lost: #f16a6a

### Job Statuses
- Scheduled: #399DEB
- In Progress: #28BDF2
- Completed: #10B981
- Cancelled: #f16a6a

## KLERVO AI CAPABILITIES
1. **System Questions**: Jobs, invoices, leads, revenue, clients
2. **Help & Navigation**: How-to guides, feature locations
3. **Business Advice**: HVAC explanations, pricing, hiring, retention, inventory

## FEATURES IMPLEMENTED
✅ Lead management with pipeline visualization
✅ Job scheduling with calendar view
✅ Service plans & subscriptions (Stripe-compatible)
✅ Team management with roles
✅ Client profiles with tabs (Info, Jobs, Invoices, Service Plans, Leads)
✅ Inventory management
✅ Reports & analytics
✅ Developer notes popup system
✅ Status labels (reusable component)
✅ Multi-role dashboards (Admin, Staff, Customer)
✅ Responsive design
✅ UI Kit documentation page
✅ Comprehensive AI chat assistant

## BACKUP RESTORATION
To restore from this backup:
1. All main application files are prefixed with: KLERVO_FULL_BACKUP_2026_03_03
2. Critical files backed up: App.tsx, routes.ts, RootLayout.tsx, Sidebar.tsx
3. All page files exist in /pages/ directory
4. All component files exist in /components/ directory
5. Design system is in /styles/globals.css
6. Documentation is in root-level .md files

## CURRENT STATE (As of March 3, 2026)
✅ All styling rules consistently applied
✅ Status labels using shared StatusLabel component
✅ Client Profile page Leads tab colors matching Leads page
✅ DollarSign icon removed from LeadDetailModal
✅ Comprehensive AI chat assistant implemented
✅ All dashboards functional and styled
✅ Developer notes system operational
✅ UI Kit page complete with all design elements

## NOTES
- No page has duplicate headers (all headers only in top nav)
- All forms use consistent border styling
- All buttons use consistent primary color
- Poppins font applied globally
- All cards have 20px border radius
- All text uses #051046 color
- Soft shadows used throughout

---
END OF BACKUP DOCUMENTATION
Backup Name: KLERVO_FULL_BACKUP_2026_03_03
Date: March 3, 2026
