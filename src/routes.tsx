import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { SchedulePage } from "./pages/SchedulePage";
import { LeadsPage } from "./pages/LeadsPage";
import { ServicePlansPage } from "./pages/ServicePlansPage";
import { AllJobsPage } from "./pages/AllJobsPage";
import { JobDetailsPageV2 } from "./pages/JobDetailsPageV2";
import { EstimatesPage } from "./pages/EstimatesPage";
import { InvoicesPage } from "./pages/InvoicesPage";
import { ClientsPage } from "./pages/ClientsPage";
import { ClientProfilePage } from "./pages/ClientProfilePage";
import { ReportPage } from "./pages/ReportPage";
import { Reports } from "./pages/Reports";
import { InventoryPage } from "./pages/InventoryPage";
import { TeamPage } from "./pages/TeamPage";
import { TeamProfilePage } from "./pages/TeamProfilePage";
import { KlervoAIPage } from "./pages/KlervoAIPage";
import { SettingsPage } from "./pages/SettingsPage";
import { HelpPage } from "./pages/HelpPage";
import { UserRoleViewsPage } from "./pages/UserRoleViewsPage";
import { UIKitPage } from "./pages/UIKitPage";
import CustomerPortalPage from "./pages/CustomerPortalPage";
import TechnicianIndicatorDemo from "./pages/TechnicianIndicatorDemo";
import { SignupLoginPage } from "./pages/SignupLoginPage";
import { JoinPage } from "./pages/JoinPage";

function NotFoundPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4" style={{ color: '#051046' }}>Page Not Found</h1>
      <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
      <a href="/" className="text-purple-600 hover:text-purple-700 font-medium">
        Go to Home →
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: UserRoleViewsPage,
  },
  {
    path: "/customer",
    Component: CustomerPortalPage,
  },
  {
    path: "/demo",
    Component: TechnicianIndicatorDemo,
  },
  {
    path: "/signup-login",
    Component: SignupLoginPage,
  },
  {
    path: "/join",
    Component: JoinPage,
  },
  {
    path: "/ui-kit",
    Component: UIKitPage,
  },
  {
    path: "/admin",
    Component: RootLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "schedule", Component: SchedulePage },
      { path: "leads", Component: LeadsPage },
      { path: "service-plans", Component: ServicePlansPage },
      { path: "jobs/all-jobs", Component: AllJobsPage },
      { path: "jobs/details/:jobId", Component: JobDetailsPageV2 },
      { path: "jobs/estimates", Component: EstimatesPage },
      { path: "jobs/invoices", Component: InvoicesPage },
      { path: "clients", Component: ClientsPage },
      { path: "clients/:clientId", Component: ClientProfilePage },
      { path: "report", Component: ReportPage },
      { path: "reports", Component: Reports },
      { path: "inventory", Component: InventoryPage },
      { path: "team", Component: TeamPage },
      { path: "team/:memberId", Component: TeamProfilePage },
      { path: "klervo-ai", Component: KlervoAIPage },
      { path: "settings", Component: SettingsPage },
      { path: "help", Component: HelpPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
  {
    path: "/staff",
    Component: RootLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "schedule", Component: SchedulePage },
      { path: "service-plans", Component: ServicePlansPage },
      { path: "jobs/all-jobs", Component: AllJobsPage },
      { path: "jobs/details/:jobId", Component: JobDetailsPageV2 },
      { path: "jobs/estimates", Component: EstimatesPage },
      { path: "jobs/invoices", Component: InvoicesPage },
      { path: "clients", Component: ClientsPage },
      { path: "clients/:clientId", Component: ClientProfilePage },
      { path: "klervo-ai", Component: KlervoAIPage },
      { path: "settings", Component: SettingsPage },
      { path: "help", Component: HelpPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
 ]);