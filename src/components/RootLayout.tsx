import { Outlet, useLocation, useNavigate } from 'react-router';
import { Bell, MessageCircle, Settings, LogOut, Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useState, useRef, useEffect } from 'react';

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isDropdownOpen && !isNotificationOpen) return; // Only add listener when needed
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isNotificationOpen]);
  
  // Map routes to page titles and descriptions
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/' || path === '/staff' || path === '/staff/') return 'Dashboard';
    if (path === '/admin/schedule' || path === '/staff/schedule') return 'Schedule';
    if (path === '/admin/leads') return 'Leads';
    if (path === '/admin/service-plans') return 'Service Plans';
    if (path === '/admin/jobs/all-jobs' || path === '/staff/jobs/all-jobs') return 'All Jobs';
    if (path.startsWith('/admin/jobs/details/') || path.startsWith('/staff/jobs/details/')) return 'Job Details';
    if (path === '/admin/jobs/estimates' || path === '/staff/jobs/estimates') return 'Estimates';
    if (path === '/admin/jobs/invoices' || path === '/staff/jobs/invoices') return 'Invoices';
    if (path === '/admin/clients' || path === '/staff/clients') return 'Clients';
    if (path.startsWith('/admin/clients/') || path.startsWith('/staff/clients/')) return 'Client Profile';
    if (path === '/admin/report') return 'Reports';
    if (path === '/admin/reports') return 'Reports';
    if (path === '/admin/inventory') return 'Inventory';
    if (path === '/admin/team') return 'Team';
    if (path === '/admin/klervo-ai' || path === '/staff/klervo-ai') return 'Klervo AI';
    if (path === '/admin/settings' || path === '/staff/settings') return 'Settings';
    if (path === '/admin/help' || path === '/staff/help') return 'Help & Support';
    return 'Dashboard';
  };

  const getPageDescription = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/' || path === '/staff' || path === '/staff/') return 'Overview of your business performance and daily operations';
    if (path === '/admin/schedule' || path === '/staff/schedule') return 'Manage jobs, appointments, and tasks in your calendar';
    if (path === '/admin/leads') return 'Track and manage your sales pipeline from initial contact to conversion';
    if (path === '/admin/service-plans') return 'Manage recurring service subscriptions and billing for your clients';
    if (path === '/admin/jobs/all-jobs' || path === '/staff/jobs/all-jobs') return 'View and manage all scheduled jobs across your organization';
    if (path.startsWith('/admin/jobs/details/') || path.startsWith('/staff/jobs/details/')) return 'View and manage job details, timeline, and documentation';
    if (path === '/admin/jobs/estimates' || path === '/staff/jobs/estimates') return 'Create, track, and manage project estimates for your clients';
    if (path === '/admin/jobs/invoices' || path === '/staff/jobs/invoices') return 'Track and manage invoices, payments, and client billing';
    if (path === '/admin/clients' || path === '/staff/clients') return 'Manage client information, service plans, and relationships';
    if (path.startsWith('/admin/clients/') || path.startsWith('/staff/clients/')) return 'View and manage client profile, jobs, and service history';
    if (path === '/admin/report') return 'View detailed analytics and insights about your business performance';
    if (path === '/admin/reports') return 'View detailed analytics and insights about your business performance';
    if (path === '/admin/inventory') return 'Manage parts, services, and stock across multiple locations';
    if (path === '/admin/team') return 'Manage your team members, roles, and permissions';
    if (path === '/admin/klervo-ai' || path === '/staff/klervo-ai') return 'Your intelligent assistant for managing business operations';
    if (path === '/admin/settings' || path === '/staff/settings') return 'Configure your application preferences and account settings';
    if (path === '/admin/help' || path === '/staff/help') return 'Find answers to common questions and get assistance';
    return '';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            <div>
              <p className="text-sm text-purple-600 mb-1">Hello, John Tom</p>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>
              <p className="text-sm text-gray-600 mt-1 hidden sm:block">{getPageDescription()}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationRef}>
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg relative"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {/* Notification Badge */}
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* Notification Menu */}
              {isNotificationOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-[#e2e8f0] rounded-[20px] shadow-[rgba(226,232,240,0.5)_0px_2px_16px_2px] py-3 z-50">
                  <div className="px-4 py-2 border-b border-[#e2e8f0]">
                    <h3 className="font-semibold text-[#051046]">Notifications</h3>
                  </div>
                  
                  <div className="py-2">
                    {/* New Lead Notification */}
                    <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                      <p className="text-[#051046] text-sm">
                        New Lead: <a href="/leads" className="text-purple-600 hover:underline font-medium">5</a>
                      </p>
                    </div>
                    
                    {/* Estimate Accepted Notification */}
                    <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                      <p className="text-[#051046] text-sm">
                        Estimate Accepted: <a href="/jobs/estimates" className="text-purple-600 hover:underline font-medium">2</a>
                      </p>
                    </div>
                    
                    {/* Estimate Declined Notification */}
                    <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                      <p className="text-[#051046] text-sm">
                        Estimate Declined: <a href="/jobs/estimates" className="text-purple-600 hover:underline font-medium">3</a>
                      </p>
                    </div>
                    
                    {/* New Negative Feedback Notification */}
                    <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                      <p className="text-[#051046] text-sm">
                        New Negative Feedback: <a href="/report" className="text-purple-600 hover:underline font-medium">1</a>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="relative" ref={dropdownRef}>
              <div 
                className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img 
                  src="https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYWxlJTIwaGVhZHNob3R8ZW58MXx8fHwxNzcwNDk4MjY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="User profile"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-[#e2e8f0] rounded-[20px] shadow-[rgba(226,232,240,0.5)_0px_2px_16px_2px] py-2 z-50">
                  <button
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-[#051046] hover:bg-gray-50 transition-colors text-left"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      // Navigate to settings page
                      navigate(location.pathname.startsWith('/staff') ? '/staff/settings' : '/admin/settings');
                    }}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </button>
                  <button
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-[#051046] hover:bg-gray-50 transition-colors text-left"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      // Redirect to the public GitHub Pages URL on logout
                      window.location.href = 'https://jojobacklinks.github.io/Newklervofsimprovedui/';
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <Outlet />
      </main>

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-cyan-400 rounded-full shadow-lg flex items-center justify-center hover:bg-cyan-500 transition-colors">
        <MessageCircle className="w-6 h-6 text-white" fill="white" />
      </button>
    </div>
  );
}