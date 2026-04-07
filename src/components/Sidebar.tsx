import { Link, useLocation, useNavigate } from 'react-router';
import { Plus, ChevronDown, LayoutDashboard, Users, Calendar, Briefcase, ClipboardList, FolderOpen, PackageOpen, MessageSquare, HelpCircle, Menu, X, Settings, ChevronLeft, ChevronRight, Zap, HardHat, Sparkles, ChartColumn, BadgeCheck } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import logoImage from 'figma:asset/1ae61582544012097caca5e917fba8d62808de49.png';
import miniLogoImage from 'figma:asset/a10641975f87935929f7be17d5afb0a4ee77140a.png';

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Calendar, label: 'Schedule', path: '/admin/schedule' },
  { icon: Zap, label: 'Leads', path: '/admin/leads' },
  { icon: BadgeCheck, label: 'Service Plans', path: '/admin/service-plans' },
  { 
    icon: Briefcase, 
    label: 'Jobs', 
    path: '/admin/jobs',
    subItems: [
      { label: 'All Jobs', path: '/admin/jobs/all-jobs' },
      { label: 'Estimates', path: '/admin/jobs/estimates' },
      { label: 'Invoices', path: '/admin/jobs/invoices' }
    ]
  },
  { icon: Users, label: 'Clients', path: '/admin/clients' },
  { icon: ChartColumn, label: 'Reports', path: '/admin/reports' },
  { icon: PackageOpen, label: 'Inventory', path: '/admin/inventory' },
  { icon: HardHat, label: 'Team', path: '/admin/team' },
  { icon: Sparkles, label: 'Klervo AI', path: '/admin/klervo-ai' },
];

const staffMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/staff' },
  { icon: Calendar, label: 'Schedule', path: '/staff/schedule' },
  { 
    icon: Briefcase, 
    label: 'Jobs', 
    path: '/staff/jobs',
    subItems: [
      { label: 'All Jobs', path: '/staff/jobs/all-jobs' },
      { label: 'Estimates', path: '/staff/jobs/estimates' },
      { label: 'Invoices', path: '/staff/jobs/invoices' }
    ]
  },
  { icon: Users, label: 'Clients', path: '/staff/clients' },
  { icon: Sparkles, label: 'Klervo AI', path: '/staff/klervo-ai' },
];

const addNewActions = [
  { label: '+ Add Job', action: 'add-job' },
  { label: '+ Add Lead', action: 'add-lead' },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggleCollapse, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const addNewRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const handleAddNewAction = (action: string) => {
    setIsAddNewOpen(false);
    
    // Close mobile menu if open
    if (onMobileClose) {
      onMobileClose();
    }
    
    // Handle different actions
    if (action === 'add-job') {
      // Navigate to All Jobs page with action parameter
      navigate('/admin/jobs/all-jobs?action=add-job');
    } else if (action === 'add-lead') {
      // Navigate to Leads page with action parameter
      navigate('/admin/leads?action=add-lead');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isAddNewOpen) return; // Only add listener when dropdown is open
    
    const handleClickOutside = (event: MouseEvent) => {
      if (addNewRef.current && !addNewRef.current.contains(event.target as Node)) {
        setIsAddNewOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAddNewOpen]);

  const handleLinkClick = () => {
    // Close mobile menu when a link is clicked
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          ${isCollapsed ? 'w-20' : 'w-64'} 
          bg-white border-r border-gray-200 flex flex-col transition-all duration-300
          fixed lg:static inset-y-0 left-0 z-50
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo and Close Button */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <Link to={location.pathname.startsWith('/staff') ? '/staff' : '/admin'} className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-1'}`} onClick={handleLinkClick}>
            <img 
              src={isCollapsed ? miniLogoImage : logoImage} 
              alt="KLERVO" 
              className={`${isCollapsed ? 'h-8' : 'h-8'} object-contain`}
            />
          </Link>
          {/* Mobile Close Button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4 overflow-auto">
          <ul className="space-y-1 px-3">
            {/* Add New Dropdown - Only show for admin */}
            {location.pathname.startsWith('/admin') && (
              <li>
                <div ref={addNewRef} className="relative">
                  <button
                    onClick={() => setIsAddNewOpen(!isAddNewOpen)}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg transition-colors ${
                      isAddNewOpen
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    title={isCollapsed ? 'Add New' : ''}
                  >
                    <Plus className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm font-medium">Add New</span>}
                  </button>
                  {isAddNewOpen && (
                    <ul 
                      className={`absolute ${isCollapsed ? 'left-full ml-2' : 'left-0'} top-full mt-2 ${isCollapsed ? 'w-48' : 'w-full'} bg-white rounded-[20px] border border-[#e2e8f0] overflow-hidden z-50`}
                      style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
                    >
                      {addNewActions.map((action, index) => (
                        <li key={index}>
                          <button
                            onClick={() => handleAddNewAction(action.action)}
                            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            {action.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )}

            {location.pathname.startsWith('/admin') ? adminMenuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const isExpanded = expandedItems.includes(item.label);
              const hasActiveSubItem = item.subItems?.some(subItem => location.pathname === subItem.path);
              
              return (
                <li key={index}>
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => toggleExpand(item.label)}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg transition-colors ${
                          hasActiveSubItem
                            ? 'bg-purple-50 text-purple-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        title={isCollapsed ? item.label : ''}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </>
                        )}
                      </button>
                      {isExpanded && !isCollapsed && (
                        <ul className="mt-1 ml-8 space-y-1">
                          {item.subItems.map((subItem, subIndex) => {
                            const isSubActive = location.pathname === subItem.path;
                            return (
                              <li key={subIndex}>
                                <Link
                                  to={subItem.path}
                                  onClick={handleLinkClick}
                                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                    isSubActive
                                      ? 'bg-purple-50 text-purple-600 font-medium'
                                      : 'text-gray-600 hover:bg-gray-50'
                                  }`}
                                >
                                  {subItem.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-purple-50 text-purple-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      title={isCollapsed ? item.label : ''}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="text-sm font-medium flex-1 text-left">{item.label}</span>}
                    </Link>
                  )}
                </li>
              );
            }) : staffMenuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const isExpanded = expandedItems.includes(item.label);
              const hasActiveSubItem = item.subItems?.some(subItem => location.pathname === subItem.path);
              
              return (
                <li key={index}>
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => toggleExpand(item.label)}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg transition-colors ${
                          hasActiveSubItem
                            ? 'bg-purple-50 text-purple-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        title={isCollapsed ? item.label : ''}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </>
                        )}
                      </button>
                      {isExpanded && !isCollapsed && (
                        <ul className="mt-1 ml-8 space-y-1">
                          {item.subItems.map((subItem, subIndex) => {
                            const isSubActive = location.pathname === subItem.path;
                            return (
                              <li key={subIndex}>
                                <Link
                                  to={subItem.path}
                                  onClick={handleLinkClick}
                                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                    isSubActive
                                      ? 'bg-purple-50 text-purple-600 font-medium'
                                      : 'text-gray-600 hover:bg-gray-50'
                                  }`}
                                >
                                  {subItem.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-purple-50 text-purple-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      title={isCollapsed ? item.label : ''}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="text-sm font-medium flex-1 text-left">{item.label}</span>}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Menu */}
        <div className="border-t border-gray-200 p-3">
          <Link
            to={location.pathname.startsWith('/staff') ? '/staff/settings' : '/admin/settings'}
            onClick={handleLinkClick}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg transition-colors ${
              location.pathname === (location.pathname.startsWith('/staff') ? '/staff/settings' : '/admin/settings')
                ? 'bg-purple-50 text-purple-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            title={isCollapsed ? 'Settings' : ''}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
          </Link>
          <a
            href="https://klervo.gitbook.io/klervo"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg transition-colors text-gray-700 hover:bg-gray-50`}
            title={isCollapsed ? 'Help' : ''}
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Help</span>}
          </a>

          {/* Desktop Collapse Toggle Button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex w-full items-center justify-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 mt-2"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronLeft className={`w-5 h-5 flex-shrink-0 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
              {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}