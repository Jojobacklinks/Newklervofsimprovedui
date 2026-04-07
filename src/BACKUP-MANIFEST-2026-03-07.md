# Klervo Dashboard - Full Backup Manifest
## Date: March 7, 2026

This manifest documents all page files in the Klervo application as of March 7, 2026.
All files listed below represent the current working state of the application.

## Critical Pages - Recently Modified

### ServicePlansPage.tsx
- **Last Modified**: March 7, 2026
- **Recent Changes**: Updated status label colors (Active: #b9df10, Pending: #28bdf2, Canceled: #f16a6a)
- **Status**: ✅ Working

### Reports.tsx  
- **Last Modified**: March 7, 2026
- **Recent Changes**: Moved Total display to Payment Type dropdown area
- **Status**: ✅ Working

### DashboardPage.tsx
- **Last Modified**: March 7, 2026  
- **Recent Changes**: Fixed View All navigation using React Router Link components
- **Status**: ✅ Working

### AllJobsPage.tsx
- **Last Modified**: Recent
- **Recent Changes**: Updated View All buttons with dynamic routing
- **Status**: ✅ Working

### LeadsPage.tsx
- **Last Modified**: Recent
- **Recent Changes**: Fixed navigation to use React Router Link
- **Status**: ✅ Working

## Admin Pages (Complete List)

1. **AllJobsPage.tsx** - Job management and listing
2. **ClientProfilePage.tsx** - Individual client profile views
3. **ClientsPage.tsx** - Client management and listing
4. **DashboardPage.tsx** - Main admin dashboard
5. **EstimatesPage.tsx** - Estimates management
6. **HelpPage.tsx** - Help and support
7. **InventoryPage.tsx** - Inventory management
8. **InvoicesPage.tsx** - Invoice management
9. **JobDetailsPageV2.tsx** - Job details page (v2)
10. **JoinPage.tsx** - Join/signup page
11. **KlervoAIPage.tsx** - AI features page
12. **LeadsPage.tsx** - Leads management
13. **ReportPage.tsx** - Individual report page
14. **Reports.tsx** - Reports dashboard
15. **SchedulePage.tsx** - Schedule management
16. **ServicePlansPage.tsx** - Service plans/subscriptions
17. **SettingsPage.tsx** - Application settings
18. **SignupLoginPage.tsx** - Authentication
19. **TeamPage.tsx** - Team management
20. **TechnicianIndicatorDemo.tsx** - Technician indicator demo
21. **UIKitPage.tsx** - UI kit/components showcase
22. **UserRoleViewsPage.tsx** - User role views demo

## Customer Portal

1. **CustomerPortalPage.tsx** - Main customer portal interface

## Existing Backup Files (DO NOT OVERWRITE)

- CustomerPortalPage.backup.tsx
- DashboardPage.backup.tsx  
- LeadsPage.backup.tsx
- LeadsPage.v1.backup.tsx

## Global Styling Rules (Applied Across All Pages)

### Card & Popup Styling
- Border radius: 20px
- Border color: #e2e8f0
- Soft shadows: `rgba(226, 232, 240, 0.5) 0px 2px 16px 2px`

### Typography
- Font family: Poppins (globally applied)
- Text color: #051046 (all text and headings)

### Form Fields
- Border width: 1px
- Border color: #e8e8e8  
- Border radius: 15px

### Buttons
- Primary background: #9473ff
- Primary hover: #7f5fd9
- Border radius: 32px

### Page Structure
- **CRITICAL**: Page headers removed from page bodies
- Headers only display in top navigation bar
- Never add page title/description sections to page components

## Recent Feature Implementations

1. ✅ Convert to Job functionality
2. ✅ Job status dropdowns updated
3. ✅ JobDetailsPageV2.tsx updates
4. ✅ AI Assistant disclaimer
5. ✅ Fixed Recharts duplicate key errors
6. ✅ Promotions management system
7. ✅ Payment method update feature (Subscriptions)
8. ✅ Unified Sales Report card
9. ✅ Client name autocomplete (Service Plans)
10. ✅ Searchable service dropdown (Service Plans)
11. ✅ Clickable Estimate/Invoice widgets
12. ✅ Dynamic routing for View All buttons
13. ✅ React Router Link navigation fixes
14. ✅ Sales Report Total display repositioning
15. ✅ Service Plans status label color updates

## Notes

- All pages use React Router for navigation
- Staff view available for select pages (DashboardPage, AllJobsPage, etc.)
- Customer portal is separate from admin/staff interfaces
- No Supabase connection currently configured (user previously dismissed)

## Recovery Instructions

To restore from this backup point:
1. This manifest represents the state as of March 7, 2026
2. All files listed above are in working condition
3. Refer to "Recent Feature Implementations" for latest changes
4. Check Git history or file timestamps for specific versions

---
**Backup Created**: March 7, 2026
**Application**: Klervo Field Service Management Dashboard  
**Environment**: Figma Make
