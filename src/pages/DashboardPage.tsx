import { Calendar, Phone, Users, Package, TrendingUp, Briefcase, DollarSign, Truck, Trash2, Zap, CheckSquare, Clock, Award, BarChart3, PieChart as PieChartIcon, MapPin, Star, ClipboardCopy, SquareArrowUp, Sparkles, Info, Tag, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { NotesPanel } from '../components/NotesPanel';
import { EstimatePanel } from '../components/EstimatePanel';
import { DeleteConfirmationPopup } from '../components/DeleteConfirmationPopup';
import { EditTaskModal } from '../components/EditTaskModal';
import { EditAppointmentModal } from '../components/EditAppointmentModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import mapImage from 'figma:asset/b92f14060424d7dd310ddff0d675b2ca2de9f75c.png';
import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { usePromotions } from '../contexts/PromotionsContext';

export function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isStaffView = location.pathname.startsWith('/staff');
  const { promotions } = usePromotions();
  
  // State for Most Sold Service filter
  const [mostSoldServiceFilter, setMostSoldServiceFilter] = useState('Current Month');
  
  // State for Payment Type Insights filter
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('Current Month');
  
  // State for Monthly Sales filter
  const [monthlySalesFilter, setMonthlySalesFilter] = useState('Current Month');
  
  // State for Top Sources filter
  const [topSourcesFilter, setTopSourcesFilter] = useState('Current Month');

  // State for delete confirmation popup
  const [deletePopup, setDeletePopup] = useState<{
    isOpen: boolean;
    type: 'appointment' | 'task' | null;
    id: number | null;
    title: string;
  }>({
    isOpen: false,
    type: null,
    id: null,
    title: ''
  });

  // State for edit task modal
  const [editTaskModal, setEditTaskModal] = useState<{
    isOpen: boolean;
    task: { id: number; title: string; dueDate: string } | null;
  }>({
    isOpen: false,
    task: null
  });

  // State for edit appointment modal
  const [editAppointmentModal, setEditAppointmentModal] = useState<{
    isOpen: boolean;
    appointment: { id: number; title: string; subject: string; date: string } | null;
  }>({
    isOpen: false,
    appointment: null
  });

  // State for promotions
  const [expandedPromotion, setExpandedPromotion] = useState<number | null>(null);
  const [copiedPromoCode, setCopiedPromoCode] = useState<number | null>(null);

  // Sample data for charts
  const monthlySalesData = [
    { month: 'Jan', sales: 2.5 },
    { month: 'Feb', sales: 3.2 },
    { month: 'Mar', sales: 2.8 },
    { month: 'Apr', sales: 4.1 },
    { month: 'May', sales: 3.5 },
    { month: 'Jun', sales: 4.8 },
    { month: 'Jul', sales: 5.2 },
    { month: 'Aug', sales: 4.6 },
    { month: 'Sep', sales: 5.8 },
    { month: 'Oct', sales: 6.2 },
    { month: 'Nov', sales: 5.5 },
    { month: 'Dec', sales: 6.8 },
  ];

  const paymentTypeData = [
    { name: 'Cash', value: 35, color: '#28bdf2' },
    { name: 'Credit Card', value: 45, color: '#c555e1' },
    { name: 'Check', value: 20, color: '#b9df10' },
  ];

  const todaysProgressData = [
    { name: 'Scheduled', value: 20, color: '#c555e1' },
    { name: 'Deposit Collected', value: 15, color: '#f0a041' },
    { name: 'In Progress', value: 35, color: '#28bdf2' },
    { name: 'Canceled', value: 10, color: '#f16a6a' },
    { name: 'Done', value: 20, color: '#b9df10' },
  ];

  const mostSoldServiceData = [
    { service: 'Painting', value: 45 },
    { service: 'Plumbing', value: 32 },
    { service: 'Electrical', value: 28 },
    { service: 'HVAC', value: 22 },
  ];

  const materialInventoryData = [
    { name: 'Cement', value: 85 },
    { name: 'Paint', value: 65 },
    { name: 'Wood', value: 45 },
  ];

  const lowInventoryItems = [
    { name: 'Filter', quantity: '4 pcs' },
    { name: 'Pipe', quantity: '2 pcs' },
    { name: 'Faucet', quantity: '1 pcs' },
  ];

  const mostUsedInventory = [
    { name: 'Connector' },
    { name: 'Filter' },
    { name: 'Fan' },
  ];

  const topEmployees = [
    { name: 'John Smith' },
    { name: 'Tommy García' },
    { name: 'Mike Thompson' },
  ];

  const todaysLeads = [
    { id: 'L-101', name: 'Michael Roberts', source: 'Referral', phone: '123-456-7890', time: '10 minutes ago' },
    { id: 'L-102', name: 'Sarah Martinez', source: 'Online Ad', phone: '987-654-3210', time: '25 minutes ago' },
    { id: 'L-103', name: 'David Chen', source: 'Trade Show', phone: '555-123-4567', time: '1 hour ago' },
  ];

  const pastJobs = [
    { id: 1, jobId: 'J-101', customer: 'Jeff Lopez', address: '623 W Front St, Hutto, TX 78634, USA', time: '5 minutes ago', isLate: false },
    { id: 2, jobId: 'J-102', customer: 'Sarah Martinez', address: '845 Oak Ave, Round Rock, TX 78681, USA', time: '45 minutes ago', isLate: true },
    { id: 3, jobId: 'J-103', customer: 'Robert Chen', address: '1234 Elm Street, Austin, TX 78701, USA', time: '2 hours ago', isLate: false },
    { id: 4, jobId: 'J-104', customer: 'Lisa Anderson', address: '567 Pine Road, Georgetown, TX 78626, USA', time: '3 hours ago', isLate: true },
    { id: 5, jobId: 'J-105', customer: 'Mike Thompson', address: '890 Maple Drive, Cedar Park, TX 78613, USA', time: '5 hours ago', isLate: false },
  ];

  const todaysJobs = [
    { id: 1, jobId: 'J-106', customer: 'Jeff Lopez', address: '623 W Front St, Hutto, TX 78634, USA', startDate: 'Today', time: '9:00 am', inProgress: true },
    { id: 2, jobId: 'J-107', customer: 'Amanda White', address: '456 Cedar Lane, Pflugerville, TX 78660, USA', startDate: 'Today', time: '2:30 pm', inProgress: true },
  ];

  const futureJobs = [
    { id: 1, jobId: 'J-108', customer: 'Maria Mcknolen', address: '623 W Front St, Hutto, TX 78634, USA', startDate: 'Tomorrow', time: '3:00 pm' },
    { id: 2, jobId: 'J-109', customer: 'David Thompson', address: '845 Oak Ave, Round Rock, TX 78681, USA', startDate: 'Tomorrow', time: '5:30 pm' },
    { id: 3, jobId: 'J-110', customer: 'Jennifer Wilson', address: '234 Willow Creek Dr, Austin, TX 78704, USA', startDate: 'Tomorrow', time: '7:00 pm' },
  ];

  const topSources = [
    { name: 'Facebook', value: 128, color: '#28bdf2', revenue: 45600 },
    { name: 'Yelp', value: 81, color: '#f16a6a', revenue: 28900 },
    { name: 'Google', value: 71, color: '#c555e1', revenue: 25300 },
    { name: 'Instagram', value: 57, color: '#f0a041', revenue: 20350 },
    { name: 'Referral', value: 52, color: '#b9df10', revenue: 18500 },
    { name: 'Reddit', value: 3, color: '#6b7280', revenue: 1100 },
  ];

  const [appointments, setAppointments] = useState([
    { id: 1, title: 'Our social media ads budget', subject: 'Marketing meeting', date: 'Feb 12, 2026, 3:00 pm' },
    { id: 2, title: 'Client consultation call', subject: 'New project discussion', date: 'Feb 12, 2026, 10:30 am' },
    { id: 3, title: 'Team standup meeting', subject: 'Daily sync', date: 'Feb 12, 2026, 9:00 am' },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Find the keys for George', dueDate: 'Feb 12, 2026, 2:13 pm' },
    { id: 2, title: 'Follow up with new leads', dueDate: 'Feb 12, 2026, 4:00 pm' },
    { id: 3, title: 'Update inventory report', dueDate: 'Feb 12, 2026, 5:30 pm' },
  ]);

  // Handle delete confirmation
  const handleDeleteClick = (type: 'appointment' | 'task', id: number, title: string) => {
    setDeletePopup({
      isOpen: true,
      type,
      id,
      title
    });
  };

  const handleDeleteConfirm = () => {
    if (deletePopup.type === 'appointment' && deletePopup.id !== null) {
      setAppointments(appointments.filter(apt => apt.id !== deletePopup.id));
    } else if (deletePopup.type === 'task' && deletePopup.id !== null) {
      setTasks(tasks.filter(task => task.id !== deletePopup.id));
    }
  };

  const handleDeleteCancel = () => {
    setDeletePopup({
      isOpen: false,
      type: null,
      id: null,
      title: ''
    });
  };

  // Handle promotions
  const handleCopyPromoCode = (id: number, code: string) => {
    // Try to use clipboard API, fallback to creating a temporary textarea
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedPromoCode(id);
        setTimeout(() => setCopiedPromoCode(null), 2000);
      }).catch(() => {
        // Fallback method
        fallbackCopyToClipboard(code, id);
      });
    } else {
      // Fallback method for browsers/environments that don't support clipboard API
      fallbackCopyToClipboard(code, id);
    }
  };

  const fallbackCopyToClipboard = (text: string, id: number) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedPromoCode(id);
      setTimeout(() => setCopiedPromoCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);
  };

  const togglePromotionExpand = (id: number) => {
    setExpandedPromotion(expandedPromotion === id ? null : id);
  };

  // Get active promotions for staff view
  const activePromotions = promotions.filter(p => p.isActive).slice(0, 3);

  // Helper to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Handle edit task
  const handleEditTaskClick = (task: { id: number; title: string; dueDate: string }) => {
    setEditTaskModal({
      isOpen: true,
      task
    });
  };

  const handleEditTaskConfirm = (updatedTask: { id: number; title: string; dueDate: string }) => {
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    setEditTaskModal({
      isOpen: false,
      task: null
    });
  };

  const handleEditTaskCancel = () => {
    setEditTaskModal({
      isOpen: false,
      task: null
    });
  };

  // Handle edit appointment
  const handleEditAppointmentClick = (appointment: { id: number; title: string; subject: string; date: string }) => {
    setEditAppointmentModal({
      isOpen: true,
      appointment
    });
  };

  const handleEditAppointmentConfirm = (updatedAppointment: { id: number; title: string; subject: string; date: string }) => {
    setAppointments(appointments.map(appointment => (appointment.id === updatedAppointment.id ? updatedAppointment : appointment)));
    setEditAppointmentModal({
      isOpen: false,
      appointment: null
    });
  };

  const handleEditAppointmentCancel = () => {
    setEditAppointmentModal({
      isOpen: false,
      appointment: null
    });
  };

  return (
    <div className="p-8">
      <div className="space-y-6">
        
        {/* ROW 1: AI Assistant + Notes + Estimates */}
        {!isStaffView ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Assistant - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="rounded-[20px] border border-[#e2e8f0] p-6 h-full" style={{ backgroundColor: '#faf5ff', boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                <div className="mb-6">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                    <Sparkles className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                    <span className="text-purple-600 text-[20px] m-[0px]">AI</span> Assistant <span className="text-sm font-normal text-gray-400">& Daily Insights</span>
                  </h2>
                </div>

                {/* Scrollable container for AI cards */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
                  {/* Conversion Insight Card */}
                  <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                    <h3 className="text-base font-semibold text-[#051046] mb-2">Conversion Insight:</h3>
                    <p className="text-sm text-[#051046] mb-4">
                      <span className="font-semibold text-[#9473ff]">Facebook</span> is your top-performing channel. Consider increasing budget allocation to maximize conversion potential.
                    </p>
                    <div>
                      <p className="text-sm font-semibold text-[#051046] mb-2">Suggestions:</p>
                      <p className="text-sm text-[#051046]">
                        - Utilize Facebook Ads to retarget users who have previously interacted with your website or app, encouraging them to complete their purchase or sign up for more information.
                      </p>
                    </div>
                  </div>

                  {/* Marketing Opportunity Card */}
                  <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                    <h3 className="text-base font-semibold text-[#051046] mb-2">Marketing opportunity:</h3>
                    <p className="text-sm text-[#051046] mb-4">
                      <span className="font-semibold text-[#9473ff]">Service</span> service is outperforming averages. Increase marketing in <span className="font-semibold text-[#9473ff]">Austin, Round Rock, Georgetown</span> via <span className="font-semibold text-[#9473ff]">Facebook</span> and <span className="font-semibold text-[#9473ff]">Google</span>
                    </p>
                    <div>
                      <p className="text-sm font-semibold text-[#051046] mb-2">Suggestions:</p>
                      <p className="text-sm text-[#051046]">
                        - Target local audiences with tailored Facebook ads highlighting unique aspects of the service, utilizing eye-catching visuals and testimonials from satisfied customers in Austin, Round Rock, and Georgetown.
                      </p>
                    </div>
                  </div>

                  {/* Inventory Alert Card */}
                  <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                    <h3 className="text-base font-semibold text-[#051046] mb-2">Inventory Alert:</h3>
                    <p className="text-sm text-[#051046]">
                      <span className="font-semibold text-[#f16a6a]">Condensor</span> and more are critically low or out. Please reorder immediately to avoid stockouts.
                    </p>
                  </div>

                  {/* Product Focus Card */}
                  <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                    <h3 className="text-base font-semibold text-[#051046] mb-2">Product Focus:</h3>
                    <p className="text-sm text-[#051046]">
                      Maintain adequate stock of <span className="font-semibold text-[#9473ff]">Condensor</span>. These are your highest-demand items.
                    </p>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    AI insights are generated automatically and may not always be accurate. They are provided for informational purposes only and do not guarantee business results.
                  </p>
                </div>
              </div>
            </div>

            {/* Notes + Estimates - Takes 1 column */}
            <div className="space-y-6">
              {/* Notes Card */}
              <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                <NotesPanel />
              </div>

              {/* Estimate Card */}
              <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                <EstimatePanel />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Active Promotions + Notes/Estimate Grid - Staff View Only */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Promotions - Left Column */}
              <div className="rounded-[20px] border border-[#e2e8f0] p-6 flex flex-col" style={{ backgroundColor: '#faf5ff', boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                <div className="mb-6">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                    <Tag className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                    <span className="text-purple-600 text-[20px] m-[0px]">Active</span> Promotions <span className="text-sm font-normal text-gray-400">& Special Offers</span>
                  </h2>
                </div>

                {/* Scrollable container for promotion cards */}
                {activePromotions.length > 0 ? (
                  <div className="space-y-4 flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
                    {activePromotions.map((promo) => (
                      <div 
                        key={promo.id} 
                        className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" 
                        style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-[#051046]">
                              {promo.title}
                            </h3>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full font-medium text-[#051046]" style={{ backgroundColor: '#b9df10' }}>
                            Active
                          </span>
                        </div>

                        <div className="mb-3">
                          <p className={`text-sm text-[#051046] ${expandedPromotion !== promo.id ? 'line-clamp-2' : ''}`}>
                            {promo.description}
                          </p>
                          {promo.description.length > 100 && (
                            <button
                              onClick={() => togglePromotionExpand(promo.id)}
                              className="text-sm text-purple-600 hover:text-purple-700 font-medium mt-1 flex items-center gap-1"
                            >
                              {expandedPromotion === promo.id ? (
                                <>
                                  Show Less <ChevronUp className="w-3 h-3" />
                                </>
                              ) : (
                                <>
                                  Learn More <ChevronDown className="w-3 h-3" />
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="font-medium">Valid until:</span>
                            <span>{formatDate(promo.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="font-medium">Type:</span>
                            <span>{promo.discountType}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="font-medium">Target:</span>
                            <span>{promo.targetAudience}</span>
                          </div>
                        </div>


                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 text-center">
                    <Tag className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-sm">No active promotions at this time.</p>
                    <p className="text-gray-400 text-xs mt-2">Promotions created by office admin will appear here.</p>
                  </div>
                )}
              </div>

              {/* Notes & Estimate - Right Column Stacked */}
              <div className="flex flex-col gap-6">
                {/* Notes Card */}
                <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                  <NotesPanel />
                </div>

                {/* Estimate Card */}
                <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                  <EstimatePanel />
                </div>
              </div>
            </div>
          </>
        )}

        {/* ROW 2: Today's Appointments, Today's Tasks, Today's Leads */}
        <div className={`grid grid-cols-1 gap-6 ${isStaffView ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          {/* Today's Appointments */}
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 flex flex-col" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="mb-4 flex items-start justify-between">
              <h3 className="flex items-center gap-2 text-base font-semibold text-[#051046]">
                <Calendar className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                Today's Appointments <span className="text-sm font-normal text-gray-400">(Today)</span>
              </h3>
              <div className="relative group">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10" style={{ width: '220px', whiteSpace: 'normal' }}>
                  Max 5 items shown. View All link always visible at bottom. Vertical scroll enabled for overflow.
                  <div className="absolute bottom-full right-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto flex-1">
              {appointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="flex items-start justify-between">
                  <div 
                    onClick={() => handleEditAppointmentClick(appointment)}
                    className="flex-1 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors"
                  >
                    <p className="text-sm font-medium text-[#051046] mb-1">{appointment.title}</p>
                    <p className="text-[#051046] text-[12px]">Subject: {appointment.subject}</p>
                    <p className="text-xs text-[#051046]">Date: {appointment.date}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick('appointment', appointment.id, appointment.title);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
              <Link to={isStaffView ? "/staff/schedule" : "/admin/schedule"} className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View All →
              </Link>
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 flex flex-col" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="flex items-center gap-2 text-base font-semibold text-[#051046]">
                <CheckSquare className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                Today's Tasks <span className="text-sm font-normal text-gray-400">(Today)</span>
              </h3>
              <div className="relative group">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10" style={{ width: '220px', whiteSpace: 'normal' }}>
                  Max 5 items shown. View All link always visible at bottom. Vertical scroll enabled for overflow.
                  <div className="absolute bottom-full right-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto flex-1">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-start justify-between">
                  <div 
                    onClick={() => handleEditTaskClick(task)}
                    className="flex-1 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors"
                  >
                    <p className="text-sm font-medium text-[#051046] mb-1">{task.title}</p>
                    <p className="text-xs text-[#051046]">Due Date: {task.dueDate}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick('task', task.id, task.title);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
              <Link to={isStaffView ? "/staff/schedule" : "/admin/schedule"} className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View All →
              </Link>
            </div>
          </div>

          {/* Today's Leads */}
          {!isStaffView && (
            <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 flex flex-col overflow-hidden" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="flex items-center gap-2 text-base font-semibold text-[#051046]">
                  <Zap className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                  Today's New Leads <span className="text-sm font-normal text-gray-400">(Today)</span>
                </h3>
                <div className="relative group">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10" style={{ width: '220px', whiteSpace: 'normal' }}>
                    Max 5 items shown. View All link always visible at bottom. Vertical scroll enabled for overflow.
                    <div className="absolute bottom-full right-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {todaysLeads.slice(0, 5).map((lead) => (
                  <div 
                    key={lead.id} 
                    onClick={() => navigate('/admin/leads', { state: { selectedLeadId: lead.id.toString(), filterByLead: true } })}
                    className="border-b border-gray-100 last:border-0 pb-3 last:pb-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-2 rounded transition-colors"
                  >
                    <div className="flex items-start gap-4 mb-1">
                      <p className="text-sm font-medium text-[#051046] flex-1">{lead.name}</p>
                      <span className="text-xs text-gray-400 flex-shrink-0">{lead.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Source: {lead.source}</p>
                    <p className="text-xs text-[#051046]">{lead.phone}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
                <Link to="/admin/leads" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View All →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ROW 3: Past Jobs, Today's Jobs, Future Jobs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Past Jobs */}
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 flex flex-col" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="mb-4 flex items-start justify-between">
              <h3 className="flex items-center gap-2 text-base font-semibold text-[#051046]">
                <ClipboardCopy className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                Past Jobs <span className="text-sm font-normal text-gray-400">(Today)</span>
              </h3>
              <div className="relative group">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10" style={{ width: '220px', whiteSpace: 'normal' }}>
                  Max 5 items shown. View All link always visible at bottom. Vertical scroll enabled for overflow.
                  <div className="absolute bottom-full right-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto flex-1">
              {pastJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="flex gap-4 items-center">
                  <div className="w-[100px] flex-shrink-0">
                    <p className="text-sm text-gray-400">Ended:</p>
                    <p className="text-sm text-[#051046]">{job.time}</p>
                  </div>
                  <div className="w-8 flex-shrink-0 flex items-center justify-center">
                    {job.isLate && (
                      <div className="relative group">
                        <Truck className="w-5 h-5 text-red-500" />
                        <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10">
                          Technician arrived late
                          <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="h-12 w-px bg-gray-200 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#051046]">
                      {job.customer} <a href={`/jobs/${job.jobId}`} className="text-purple-600 hover:text-purple-700 text-xs">ID: #{job.jobId}</a>
                    </p>
                    <p className="text-sm text-gray-500">{job.address}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
              <a href={isStaffView ? "/staff/jobs/all-jobs" : "/admin/jobs/all-jobs"} className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View All →
              </a>
            </div>
          </div>

          {/* Today's Jobs */}
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 flex flex-col" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="mb-4 flex items-start justify-between">
              <h3 className="flex items-center gap-2 text-base font-semibold text-[#051046]">
                <Briefcase className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                Today's Jobs <span className="text-sm font-normal text-gray-400">(Today)</span>
              </h3>
              <div className="relative group">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10" style={{ width: '220px', whiteSpace: 'normal' }}>
                  Max 5 items shown. View All link always visible at bottom. Vertical scroll enabled for overflow.
                  <div className="absolute bottom-full right-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto flex-1">
              {todaysJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="flex gap-4 items-center">
                  <div className="w-[100px] flex-shrink-0">
                    <p className="text-sm text-gray-400">Start Date:</p>
                    <p className="text-sm text-[#051046]">{job.startDate}</p>
                    <p className="text-sm text-[#051046] mt-1">{job.time}</p>
                  </div>
                  <div className="w-8 flex-shrink-0 flex items-center justify-center">
                    {job.inProgress && (
                      <div className="relative group">
                        <div className="relative">
                          <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#b9df10' }}></div>
                          <div className="absolute inset-0 w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: '#b9df10', opacity: 0.4 }}></div>
                        </div>
                        <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10">
                          Job currently in progress
                          <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="h-12 w-px bg-gray-200 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#051046]">
                      {job.customer} <a href={`/jobs/${job.jobId}`} className="text-purple-600 hover:text-purple-700 text-xs">ID: #{job.jobId}</a>
                    </p>
                    <p className="text-sm text-gray-500">{job.address}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
              <a href={isStaffView ? "/staff/jobs/all-jobs" : "/admin/jobs/all-jobs"} className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View All →
              </a>
            </div>
          </div>

          {/* Future Jobs */}
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 flex flex-col" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="mb-4 flex items-start justify-between">
              <h3 className="flex items-center gap-2 text-base font-semibold text-[#051046]">
                <Clock className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                Future Jobs <span className="text-sm font-normal text-gray-400">(Tomorrow)</span>
              </h3>
              <div className="relative group">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10" style={{ width: '220px', whiteSpace: 'normal' }}>
                  Max 5 items shown. View All link always visible at bottom. Vertical scroll enabled for overflow.
                  <div className="absolute bottom-full right-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto flex-1">
              {futureJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="flex gap-4 items-center">
                  <div className="w-[100px] flex-shrink-0">
                    <p className="text-sm text-gray-400">Start Date:</p>
                    <p className="text-sm text-[#051046]">{job.startDate}</p>
                    <p className="text-sm text-[#051046] mt-1">{job.time}</p>
                  </div>
                  <div className="w-8 flex-shrink-0 flex items-center justify-center">
                    {/* Empty space for consistency with other job cards */}
                  </div>
                  <div className="h-12 w-px bg-gray-200 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#051046]">
                      {job.customer} <a href={`/jobs/${job.jobId}`} className="text-purple-600 hover:text-purple-700 text-xs">ID: #{job.jobId}</a>
                    </p>
                    <p className="text-sm text-gray-500">{job.address}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
              <a href={isStaffView ? "/staff/jobs/all-jobs" : "/admin/jobs/all-jobs"} className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View All →
              </a>
            </div>
          </div>
        </div>



        {/* ROW 5: Monthly Sales, Payment Type Insights */}
        <div className={`grid grid-cols-1 gap-6 ${isStaffView ? 'md:grid-cols-2' : 'md:grid-cols-2'}`}>
          {/* Monthly Sales */}
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-base font-semibold text-[#051046]">
                <BarChart3 className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                Monthly Sales
                {isStaffView && <span className="text-xs font-normal text-gray-500 ml-2">For dev: This metric based on this staff/technician, not the whole company data</span>}
              </h3>
              <select
                value={monthlySalesFilter}
                onChange={(e) => setMonthlySalesFilter(e.target.value)}
                className="px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="Current Month">Current Month</option>
                <option value="Last Month">Last Month</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="Current Year">Current Year</option>
              </select>
            </div>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height={250} key="monthly-sales-chart">
                <BarChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => `$${value}k`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                    labelStyle={{ color: '#051046', fontWeight: 600 }}
                    itemStyle={{ color: '#051046' }}
                  />
                  <Bar dataKey="sales" fill="#cac2ff" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low Inventory Items - Staff View Only */}
          {isStaffView && (
            <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
              <div className="mb-4">
                <h3 className="flex items-center gap-2 text-base font-semibold text-[#051046]">
                  <Package className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                  Low Inventory Items <span className="text-sm font-normal text-gray-400">(Current)</span>
                </h3>
              </div>
              <div className="max-h-[250px] overflow-y-auto space-y-2 pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
                {lowInventoryItems.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-sm text-[#051046]">{item.name}</span>
                    <span className="text-sm text-[#051046]">{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Type Insights */}
          {!isStaffView && (
            <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-base font-semibold text-[#051046]">
                  <DollarSign className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                  Payment Type Insights
                </h3>
                <select
                  value={paymentTypeFilter}
                  onChange={(e) => setPaymentTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="Current Month">Current Month</option>
                  <option value="Last Month">Last Month</option>
                  <option value="Last 3 Months">Last 3 Months</option>
                  <option value="Current Year">Current Year</option>
                </select>
              </div>
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height={250} key="payment-type-chart">
                  <PieChart>
                    <Pie
                      id="payment-type-pie"
                      data={paymentTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      cornerRadius={8}
                    >
                      {paymentTypeData.map((entry, index) => (
                        <Cell key={`payment-cell-${entry.name}-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length > 0) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white px-3 py-2 rounded-lg border border-[#e2e8f0] shadow-lg">
                              <p className="text-sm font-semibold text-[#051046]">{data.name}</p>
                              <p className="text-sm text-[#051046]">{data.value}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ position: 'relative' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* ROW 6: Most Sold Service, Top Sources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Most Sold Service */}
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-base font-semibold text-[#051046]">
                <Star className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                Most Sold Service
              </h3>
              <select
                value={mostSoldServiceFilter}
                onChange={(e) => setMostSoldServiceFilter(e.target.value)}
                className="px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="Current Month">Current Month</option>
                <option value="Last Month">Last Month</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="Current Year">Current Year</option>
              </select>
            </div>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height={250} key="most-sold-service-chart">
                <BarChart data={mostSoldServiceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="service" type="category" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white px-3 py-2 rounded-lg border border-[#e2e8f0] shadow-lg">
                            <p className="text-sm font-semibold text-[#051046]">{data.service}</p>
                            <p className="text-sm text-[#051046]">{data.value}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="#cac2ff" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Sources */}
          {!isStaffView && (
            <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-base font-semibold text-[#051046]">
                  <TrendingUp className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                  Top Sources
                </h3>
                <select
                  value={topSourcesFilter}
                  onChange={(e) => setTopSourcesFilter(e.target.value)}
                  className="px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="Current Month">Current Month</option>
                  <option value="Last Month">Last Month</option>
                  <option value="Last 3 Months">Last 3 Months</option>
                  <option value="Current Year">Current Year</option>
                </select>
              </div>
              <div className="w-full h-[280px] flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={200} key="top-sources-chart">
                  <PieChart>
                    <Pie
                      id="top-sources-pie"
                      data={topSources}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      cornerRadius={8}
                    >
                      {topSources.map((entry) => (
                        <Cell key={`source-cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length > 0) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white px-3 py-2 rounded-lg border border-[#e2e8f0] shadow-lg">
                              <p className="text-sm font-semibold text-[#051046]">{data.name}</p>
                              <p className="text-sm text-[#051046]">Revenue: ${data.revenue.toLocaleString()}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                  {topSources.map((source) => (
                    <div key={source.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: source.color }}></div>
                      <span className="text-xs text-[#051046]">{source.name} {source.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Popup */}
      <DeleteConfirmationPopup
        isOpen={deletePopup.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deletePopup.type === 'appointment' ? 'Appointment' : 'Task'}?`}
        message={`Are you sure you want to delete \"${deletePopup.title}\"? This action cannot be undone.`}
      />

      {/* Edit Task Modal */}
      {editTaskModal.isOpen && editTaskModal.task && (
        <EditTaskModal
          isOpen={editTaskModal.isOpen}
          task={editTaskModal.task}
          onClose={handleEditTaskCancel}
          onSave={handleEditTaskConfirm}
        />
      )}

      {/* Edit Appointment Modal */}
      {editAppointmentModal.isOpen && editAppointmentModal.appointment && (
        <EditAppointmentModal
          isOpen={editAppointmentModal.isOpen}
          appointment={editAppointmentModal.appointment}
          onClose={handleEditAppointmentCancel}
          onSave={handleEditAppointmentConfirm}
        />
      )}
    </div>
  );
}