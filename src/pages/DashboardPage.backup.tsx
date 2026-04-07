import { Calendar, Phone, Users, Package, TrendingUp, Briefcase, DollarSign, Truck, Trash2, Zap, CheckSquare, Clock, Award, BarChart3, PieChart as PieChartIcon, MapPin, Star, ClipboardCopy, SquareArrowUp, Sparkles, Info } from 'lucide-react';
import { NotesPanel } from '../components/NotesPanel';
import { EstimatePanel } from '../components/EstimatePanel';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import mapImage from 'figma:asset/b92f14060424d7dd310ddff0d675b2ca2de9f75c.png';
import { useState } from 'react';
import { useLocation } from 'react-router';

export function DashboardPage() {
  const location = useLocation();
  const isStaffView = location.pathname.startsWith('/staff');
  
  // State for Most Sold Service filter
  const [mostSoldServiceFilter, setMostSoldServiceFilter] = useState('Current Month');
  
  // State for Payment Type Insights filter
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('Current Month');
  
  // State for Monthly Sales filter
  const [monthlySalesFilter, setMonthlySalesFilter] = useState('Current Month');
  
  // State for Top Sources filter
  const [topSourcesFilter, setTopSourcesFilter] = useState('Current Month');

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
    { id: 1, name: 'Sarah Johnson', source: 'Facebook', phone: '(512) 555-0123', time: '10 minutes ago' },
    { id: 2, name: 'Michael Chen', source: 'Google', phone: '(512) 555-0456', time: '25 minutes ago' },
    { id: 3, name: 'Emily Rodriguez', source: 'Referral', phone: '(512) 555-0789', time: '1 hour ago' },
  ];

  const pastJobs = [
    { id: 1, jobId: 1247, customer: 'Jeff Lopez', address: '623 W Front St, Hutto, TX 78634, USA', time: '5 minutes ago', isLate: false },
    { id: 2, jobId: 1246, customer: 'Sarah Martinez', address: '845 Oak Ave, Round Rock, TX 78681, USA', time: '45 minutes ago', isLate: true },
    { id: 3, jobId: 1245, customer: 'Robert Chen', address: '1234 Elm Street, Austin, TX 78701, USA', time: '2 hours ago', isLate: false },
    { id: 4, jobId: 1244, customer: 'Lisa Anderson', address: '567 Pine Road, Georgetown, TX 78626, USA', time: '3 hours ago', isLate: true },
    { id: 5, jobId: 1243, customer: 'Mike Thompson', address: '890 Maple Drive, Cedar Park, TX 78613, USA', time: '5 hours ago', isLate: false },
  ];

  const todaysJobs = [
    { id: 1, jobId: 1248, customer: 'Jeff Lopez', address: '623 W Front St, Hutto, TX 78634, USA', startDate: 'Today', time: '9:00 am', inProgress: true },
    { id: 2, jobId: 1249, customer: 'Amanda White', address: '456 Cedar Lane, Pflugerville, TX 78660, USA', startDate: 'Today', time: '2:30 pm', inProgress: true },
  ];

  const futureJobs = [
    { id: 1, jobId: 1250, customer: 'Maria Mcknolen', address: '623 W Front St, Hutto, TX 78634, USA', startDate: 'Tomorrow', time: '3:00 pm' },
    { id: 2, jobId: 1251, customer: 'David Thompson', address: '845 Oak Ave, Round Rock, TX 78681, USA', startDate: 'Tomorrow', time: '5:30 pm' },
    { id: 3, jobId: 1252, customer: 'Jennifer Wilson', address: '234 Willow Creek Dr, Austin, TX 78704, USA', startDate: 'Tomorrow', time: '7:00 pm' },
  ];

  const topSources = [
    { name: 'Facebook', value: 128, color: '#28bdf2' },
    { name: 'Yelp', value: 81, color: '#f16a6a' },
    { name: 'Google', value: 71, color: '#c555e1' },
    { name: 'Instagram', value: 57, color: '#f0a041' },
    { name: 'Referral', value: 52, color: '#b9df10' },
    { name: 'Reddit', value: 3, color: '#6b7280' },
  ];

  const appointments = [
    { id: 1, title: 'Our social media ads budget', subject: 'Marketing meeting', date: 'Feb 12, 2026, 3:00 pm' },
    { id: 2, title: 'Client consultation call', subject: 'New project discussion', date: 'Feb 12, 2026, 10:30 am' },
    { id: 3, title: 'Team standup meeting', subject: 'Daily sync', date: 'Feb 12, 2026, 9:00 am' },
  ];

  const tasks = [
    { id: 1, title: 'Find the keys for George', dueDate: 'Feb 12, 2026, 2:13 pm' },
    { id: 2, title: 'Follow up with new leads', dueDate: 'Feb 12, 2026, 4:00 pm' },
    { id: 3, title: 'Update inventory report', dueDate: 'Feb 12, 2026, 5:30 pm' },
  ];

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

                <div className="space-y-4">
                  {/* Conversion Insight Card */}
                  <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                    <h3 className="text-base font-semibold text-[#051046] mb-2">Conversion Insight:</h3>
                    <p className="text-sm text-[#051046] mb-4">
                      [Facebook] is your top-performing channel. Consider increasing budget allocation to maximize conversion potential.
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
                      [Service] service is outperforming averages. Increase marketing in [Austin, Round Rock, Georgetown] via [Facebook] and [Google]
                    </p>
                    <div>
                      <p className="text-sm font-semibold text-[#051046] mb-2">Suggestions:</p>
                      <p className="text-sm text-[#051046]">
                        - Target local audiences with tailored Facebook ads highlighting unique aspects of the service, utilizing eye-catching visuals and testimonials from satisfied customers in Austin, Round Rock, and Georgetown.
                      </p>
                    </div>
                  </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notes Card */}
            <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
              <NotesPanel />
            </div>

            {/* Estimate Card */}
            <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
              <EstimatePanel />
            </div>
          </div>
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
                  <div>
                    <p className="text-sm font-medium text-[#051046] mb-1">{appointment.title}</p>
                    <p className="text-sm text-[#051046]">Subject: {appointment.subject}</p>
                    <p className="text-sm text-[#051046]">Date: {appointment.date}</p>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
              <a href="/schedule" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View All →
              </a>
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
                  <div>
                    <p className="text-sm font-medium text-[#051046] mb-1">{task.title}</p>
                    <p className="text-sm text-[#051046]">Due Date: {task.dueDate}</p>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
              <a href="/schedule" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View All →
              </a>
            </div>
          </div>

          {/* Today's Leads */}
          {!isStaffView && (
            <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 flex flex-col" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
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
              <div className="space-y-3 max-h-[400px] overflow-y-auto flex-1">
                {todaysLeads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-medium text-[#051046]">{lead.name}</p>
                      <span className="text-xs text-gray-400">{lead.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Source: {lead.source}</p>
                    <p className="text-xs text-[#051046]">{lead.phone}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
                <a href="/leads?status=new" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View All →
                </a>
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
              <a href="/schedule" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
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
              <a href="/schedule" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
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
              <a href="/schedule" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View All →
              </a>
            </div>
          </div>
        </div>

        {/* ROW 4: Low Inventory Items, Most Used Inventory, Top 3 Employees */}
        {!isStaffView && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Low Inventory Items */}
            <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
              <div className="mb-4">
                <h3 className="flex items-center gap-2 text-base font-semibold text-[#051046]">
                  <Package className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                  Low Inventory Items <span className="text-sm font-normal text-gray-400">(Current)</span>
                </h3>
              </div>
              <div className="space-y-2">
                {lowInventoryItems.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-sm text-[#051046]">{item.name}</span>
                    <span className="text-sm text-[#051046]">{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Used Inventory */}
            <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
              <div className="mb-4">
                <h3 className="flex items-center gap-2 text-base font-semibold text-[#051046]">
                  <SquareArrowUp className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                  Most Used Inventory <span className="text-sm font-normal text-gray-400">(Current Month)</span>
                </h3>
              </div>
              <div className="space-y-2">
                {mostUsedInventory.map((item) => (
                  <div key={item.name}>
                    <span className="text-sm text-[#051046]">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 3 Employees */}
            <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
              <div className="mb-4 flex items-start justify-between">
                <h3 className="flex items-center gap-2 text-base font-semibold text-[#051046]">
                  <Award className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                  Top 3 Employees <span className="text-sm font-normal text-gray-400">(Current Month)</span>
                </h3>
                <div className="relative group">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10" style={{ width: '220px', whiteSpace: 'normal' }}>
                    Note: Based on the data, the employee with the highest number of positive reviews and successful upsells.
                    <div className="absolute bottom-full right-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {topEmployees.map((employee, index) => (
                  <div key={employee.name} className="flex items-center gap-2">
                    <span className="text-sm text-[#051046]">{index + 1}.</span>
                    <span className="text-sm text-[#051046]">{employee.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ROW 5: Monthly Sales, Payment Type Insights, Top Sources */}
        <div className={`grid grid-cols-1 gap-6 ${isStaffView ? 'md:grid-cols-1' : 'md:grid-cols-3'}`}>
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
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => `$${value}k`} />
                  <Bar dataKey="sales" fill="#e0e7ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

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
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={paymentTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {paymentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

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
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={topSources}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {topSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
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

        {/* ROW 6: Today's Progress, Most Sold Service */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Progress */}
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-base font-semibold text-[#051046]">
                <PieChartIcon className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                Today's Progress
              </h3>
            </div>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={todaysProgressData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {todaysProgressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

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
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mostSoldServiceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="service" type="category" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#c555e1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ROW 7: Popular Service Areas (Full Width) */}
        {!isStaffView && (
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-base font-semibold text-[#051046]">
                <MapPin className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                Popular service areas
              </h3>
            </div>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: 400 }}>
              <img 
                src={mapImage}
                alt="US Service Areas Map"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
