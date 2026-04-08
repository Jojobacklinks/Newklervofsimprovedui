import { useState, useRef, useEffect } from 'react';
import { Download, CreditCard, DollarSign, Wallet, XCircle, ThumbsUp, TrendingDown, Smile, Meh, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { DateRangePicker } from '../components/DateRangePicker';

// Technician profile images
const technicianImages = {
  michaelChen: 'https://images.unsplash.com/photo-1701463206030-fd8a77b61698?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhc2lhbiUyMG1hbGUlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzE0NDU4NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  sarahJohnson: 'https://images.unsplash.com/photo-1569272059869-efe38db7e2a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBmZW1hbGUlMjBoZWFkc2hvdCUyMGJsb25kZXxlbnwxfHx8fDE3NzE0NDU4NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  davidMartinez: 'https://images.unsplash.com/photo-1563107197-df8cd4348c5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoaXNwYW5pYyUyMG1hbGUlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzE0NDU4NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  emmaWilliams: 'https://images.unsplash.com/photo-1573497491207-618cc224f243?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhZnJpY2FuJTIwYW1lcmljYW4lMjBmZW1hbGUlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzE0NDU4NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
};

// Mock data for different payment types
const creditCardPayments = [
  { id: 'J-101', jobId: 'J-101', dateTime: '2024-02-18 10:30 AM', amount: '$450.00', status: 'Completed' },
  { id: 'J-102', jobId: 'J-102', dateTime: '2024-02-18 09:15 AM', amount: '$1,250.00', status: 'Completed' },
  { id: 'J-103', jobId: 'J-103', dateTime: '2024-02-17 03:45 PM', amount: '$890.50', status: 'Completed' },
  { id: 'J-104', jobId: 'J-104', dateTime: '2024-02-17 02:20 PM', amount: '$325.00', status: 'Completed' },
  { id: 'J-105', jobId: 'J-105', dateTime: '2024-02-17 11:00 AM', amount: '$2,100.00', status: 'Completed' },
  { id: 'J-106', jobId: 'J-106', dateTime: '2024-02-16 04:30 PM', amount: '$675.00', status: 'Completed' },
  { id: 'J-107', jobId: 'J-107', dateTime: '2024-02-16 01:15 PM', amount: '$1,450.00', status: 'Completed' },
  { id: 'J-108', jobId: 'J-108', dateTime: '2024-02-15 10:00 AM', amount: '$550.00', status: 'Completed' },
  { id: 'J-109', jobId: 'J-109', dateTime: '2024-02-15 08:30 AM', amount: '$920.00', status: 'Completed' },
  { id: 'J-110', jobId: 'J-110', dateTime: '2024-02-14 03:00 PM', amount: '$1,800.00', status: 'Completed' },
];

const cashPayments = [
  { id: 'J-111', jobId: 'J-111', dateTime: '2024-02-18 11:45 AM', amount: '$200.00', status: 'Completed' },
  { id: 'J-112', jobId: 'J-112', dateTime: '2024-02-17 01:30 PM', amount: '$150.00', status: 'Completed' },
  { id: 'J-113', jobId: 'J-113', dateTime: '2024-02-16 10:15 AM', amount: '$350.00', status: 'Completed' },
  { id: 'J-114', jobId: 'J-114', dateTime: '2024-02-15 02:45 PM', amount: '$500.00', status: 'Completed' },
  { id: 'J-115', jobId: 'J-115', dateTime: '2024-02-14 09:00 AM', amount: '$275.00', status: 'Completed' },
  { id: 'J-116', jobId: 'J-116', dateTime: '2024-02-13 04:00 PM', amount: '$425.00', status: 'Completed' },
  { id: 'J-117', jobId: 'J-117', dateTime: '2024-02-12 11:30 AM', amount: '$180.00', status: 'Completed' },
];

const otherPayments = [
  { id: 'J-118', jobId: 'J-118', dateTime: '2024-02-18 02:00 PM', amount: '$750.00', status: 'Completed' },
  { id: 'J-119', jobId: 'J-119', dateTime: '2024-02-17 10:30 AM', amount: '$1,100.00', status: 'Completed' },
  { id: 'J-120', jobId: 'J-120', dateTime: '2024-02-16 03:15 PM', amount: '$625.00', status: 'Completed' },
  { id: 'J-121', jobId: 'J-121', dateTime: '2024-02-15 11:45 AM', amount: '$980.00', status: 'Completed' },
  { id: 'J-122', jobId: 'J-122', dateTime: '2024-02-14 01:20 PM', amount: '$450.00', status: 'Completed' },
];

const failedPayments = [
  { id: 'J-123', jobId: 'J-123', dateTime: '2024-02-18 03:30 PM', amount: '$560.00', status: 'Failed' },
  { id: 'J-124', jobId: 'J-124', dateTime: '2024-02-17 12:00 PM', amount: '$1,200.00', status: 'Failed' },
  { id: 'J-125', jobId: 'J-125', dateTime: '2024-02-16 09:45 AM', amount: '$875.00', status: 'Failed' },
  { id: 'J-126', jobId: 'J-126', dateTime: '2024-02-15 04:15 PM', amount: '$320.00', status: 'Failed' },
  { id: 'J-127', jobId: 'J-127', dateTime: '2024-02-14 10:30 AM', amount: '$1,450.00', status: 'Failed' },
  { id: 'J-128', jobId: 'J-128', dateTime: '2024-02-13 02:00 PM', amount: '$690.00', status: 'Failed' },
];

type ReportType = 'credit-card' | 'cash' | 'other' | 'failed';

// Decline reasons data for the donut chart
const declineReasonsData = [
  { name: 'Price', value: 13, percentage: 28.3, color: '#28bdf2' },
  { name: 'Competitor', value: 11, percentage: 23.9, color: '#c555e1' },
  { name: 'Scheduling', value: 7, percentage: 15.2, color: '#f0a041' },
  { name: 'Communication', value: 7, percentage: 15.2, color: '#b9df10' },
  { name: 'Employee', value: 8, percentage: 17.4, color: '#f16a6a' },
];

export function Reports() {
  const [dateRange, setDateRange] = useState('this-month');
  const [reportType, setReportType] = useState<ReportType>('credit-card');
  const [hoveredSegment, setHoveredSegment] = useState<{ technicianIndex: number; reasonIndex: number; reason: string; count: number } | null>(null);
  const [hoveredPieSegment, setHoveredPieSegment] = useState<{ reason: string; count: number; percentage: number } | null>(null);
  const [edrFilter, setEdrFilter] = useState('all-time');
  const [technicianFilter, setTechnicianFilter] = useState('all-time');
  const [workloadGraphFilter, setWorkloadGraphFilter] = useState('all-time');
  const [workloadHoursFilter, setWorkloadHoursFilter] = useState('all-time');
  const [csatFilter, setCsatFilter] = useState('all-time');
  const [upsellFilter, setUpsellFilter] = useState('all-time');
  const [lateArrivalFilter, setLateArrivalFilter] = useState('all-time');
  
  // Date range picker state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10;

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };

    if (isDatePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDatePickerOpen]);

  const getReportData = () => {
    switch (reportType) {
      case 'credit-card':
        return creditCardPayments;
      case 'cash':
        return cashPayments;
      case 'other':
        return otherPayments;
      case 'failed':
        return failedPayments;
      default:
        return creditCardPayments;
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'credit-card':
        return 'Credit Card Payments';
      case 'cash':
        return 'Cash Payments';
      case 'other':
        return 'Other Payments';
      case 'failed':
        return 'Failed Payments';
      default:
        return 'Credit Card Payments';
    }
  };

  const getReportIcon = () => {
    switch (reportType) {
      case 'credit-card':
        return <CreditCard className="w-5 h-5 text-[#9473ff]" />;
      case 'cash':
        return <DollarSign className="w-5 h-5" style={{ color: '#b9df10' }} />;
      case 'other':
        return <Wallet className="w-5 h-5 text-blue-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5" style={{ color: '#f16a6a' }} />;
      default:
        return <CreditCard className="w-5 h-5 text-[#9473ff]" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === 'completed') {
      return 'bg-[#b9df10]';
    }

    if (normalizedStatus === 'failed') {
      return 'bg-[#f16a6a]';
    }

    return 'bg-gray-400';
  };

  const reportData = getReportData();

  // Pagination logic
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = reportData.slice(indexOfFirstPayment, indexOfLastPayment);

  const totalPages = Math.ceil(reportData.length / paymentsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Workload and Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Workload Graph */}
        <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-[#051046]">Workload Graph</h3>
            <select
              value={workloadGraphFilter}
              onChange={(e) => setWorkloadGraphFilter(e.target.value)}
              className="px-3 py-1.5 border border-[#e8e8e8] rounded-[15px] text-xs text-[#051046] bg-white focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
            >
              <option value="all-time">All Time</option>
              <option value="today">Today</option>
              <option value="last-7-days">Last 7 Days</option>
              <option value="current-month">Current Month</option>
              <option value="last-month">Last Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="current-year">Current Year</option>
            </select>
          </div>
          <p className="text-xs text-gray-600 mb-8">Note: See how busy your team member is today, over the past week, two weeks, month, and their entire time.</p>
          
          <div className="flex items-end justify-around h-56 gap-4 mb-12">
            {/* Michael Chen */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-16 group">
                <div className="rounded-t-lg cursor-pointer transition-opacity hover:opacity-90" style={{ height: '160px', backgroundColor: '#f16a6a' }}></div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#051046] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  32 jobs
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#051046]"></div>
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                    <ImageWithFallback 
                      src={technicianImages.michaelChen} 
                      alt="Michael Chen" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#051046] mt-6">Michael Chen</p>
            </div>

            {/* Sarah Johnson */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-16 group">
                <div className="rounded-t-lg cursor-pointer transition-opacity hover:opacity-90" style={{ height: '80px', backgroundColor: '#f0a041' }}></div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#051046] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  16 jobs
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#051046]"></div>
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                    <ImageWithFallback 
                      src={technicianImages.sarahJohnson} 
                      alt="Sarah Johnson" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#051046] mt-6">Sarah Johnson</p>
            </div>

            {/* David Martinez */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-16 group">
                <div className="rounded-t-lg cursor-pointer transition-opacity hover:opacity-90" style={{ height: '155px', backgroundColor: '#f16a6a' }}></div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#051046] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  31 jobs
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#051046]"></div>
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                    <ImageWithFallback 
                      src={technicianImages.davidMartinez} 
                      alt="David Martinez" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#051046] mt-6">David Martinez</p>
            </div>

            {/* Emma Williams */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-16 group">
                <div className="rounded-t-lg cursor-pointer transition-opacity hover:opacity-90" style={{ height: '18px', backgroundColor: '#b9df10' }}></div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#051046] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  4 jobs
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#051046]"></div>
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                    <ImageWithFallback 
                      src={technicianImages.emmaWilliams} 
                      alt="Emma Williams" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#051046] mt-6">Emma Williams</p>
            </div>
          </div>
        </div>

        {/* Workload Hours */}
        <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-[#051046]">Workload Hours</h3>
            <select
              value={workloadHoursFilter}
              onChange={(e) => setWorkloadHoursFilter(e.target.value)}
              className="px-3 py-1.5 border border-[#e8e8e8] rounded-[15px] text-xs text-[#051046] bg-white focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
            >
              <option value="all-time">All Time</option>
              <option value="today">Today</option>
              <option value="last-7-days">Last 7 Days</option>
              <option value="current-month">Current Month</option>
              <option value="last-month">Last Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="current-year">Current Year</option>
            </select>
          </div>
          <p className="text-xs text-gray-600 mb-4">Note: Tracks technician hours between pressing the "Job Started" and "Completed" buttons to monitor workload. Not for accounting.</p>
          
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4 pb-2 border-b border-gray-200">
              <span className="text-xs font-medium text-gray-600">FULL NAME</span>
              <span className="text-xs font-medium text-gray-600">USER TYPE</span>
              <span className="text-xs font-medium text-gray-600">TOTAL HOURS</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center py-2">
              <span className="text-sm text-[#051046]">Michael Chen</span>
              <span className="text-sm text-[#051046]">Office Admin</span>
              <span className="text-sm text-[#051046]">99h 32min</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center py-2">
              <span className="text-sm text-[#051046]">Sarah Johnson</span>
              <span className="text-sm text-[#051046]">Staff</span>
              <span className="text-sm text-[#051046]">68h 29min</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center py-2">
              <span className="text-sm text-[#051046]">David Martinez</span>
              <span className="text-sm text-[#051046]">Staff</span>
              <span className="text-sm text-[#051046]">98h 6min</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center py-2">
              <span className="text-sm text-[#051046]">Emma Williams</span>
              <span className="text-sm text-[#051046]">Staff</span>
              <span className="text-sm text-[#051046]">2h 3min</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSAT and Upsell Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Customer Satisfaction Score (CSAT) */}
        <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-[#051046]">Customer Satisfaction Score (CSAT)</h3>
            <select
              value={csatFilter}
              onChange={(e) => setCsatFilter(e.target.value)}
              className="px-3 py-1.5 border border-[#e8e8e8] rounded-[15px] text-xs text-[#051046] bg-white focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
            >
              <option value="all-time">All Time</option>
              <option value="today">Today</option>
              <option value="last-7-days">Last 7 Days</option>
              <option value="current-month">Current Month</option>
              <option value="last-month">Last Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="current-year">Current Year</option>
            </select>
          </div>
          <p className="text-xs text-gray-600 mb-4">Note: After each job, customers rate their experience on a scale from 1-5, helping you measure and improve your technician's performance.</p>
          
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4 pb-2 border-b border-gray-200">
              <span className="text-xs font-medium text-gray-600">FULL NAME</span>
              <span className="text-xs font-medium text-gray-600">USER TYPE</span>
              <span className="text-xs font-medium text-gray-600">SATISFACTION RATE</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center py-2">
              <span className="text-sm text-[#051046]">Michael Chen</span>
              <span className="text-sm text-[#051046]">Office Admin</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#b9df10' }}>
                  <Smile className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-medium text-[#051046]">90%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center py-2">
              <span className="text-sm text-[#051046]">Sarah Johnson</span>
              <span className="text-sm text-[#051046]">Staff</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#b9df10' }}>
                  <Smile className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-medium text-[#051046]">84%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center py-2">
              <span className="text-sm text-[#051046]">David Martinez</span>
              <span className="text-sm text-[#051046]">Staff</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#b9df10' }}>
                  <Smile className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-medium text-[#051046]">95%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center py-2">
              <span className="text-sm text-[#051046]">Emma Williams</span>
              <span className="text-sm text-[#051046]">Staff</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f16a6a' }}>
                  <Meh className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-medium text-[#051046]">0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upsell Tracking */}
        <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-[#051046]">Upsell Tracking</h3>
            <select
              value={upsellFilter}
              onChange={(e) => setUpsellFilter(e.target.value)}
              className="px-3 py-1.5 border border-[#e8e8e8] rounded-[15px] text-xs text-[#051046] bg-white focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
            >
              <option value="all-time">All Time</option>
              <option value="today">Today</option>
              <option value="last-7-days">Last 7 Days</option>
              <option value="current-month">Current Month</option>
              <option value="last-month">Last Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="current-year">Current Year</option>
            </select>
          </div>
          <p className="text-xs text-gray-600 mb-4">Note: Make sure to require technicians to log recommended upsells in the job details area.</p>
          
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4 pb-2 border-b border-gray-200">
              <span className="text-xs font-medium text-gray-600">FULL NAME</span>
              <span className="text-xs font-medium text-gray-600">USER TYPE</span>
              <span className="text-xs font-medium text-gray-600"># OF UPSELLS</span>
              <span className="text-xs font-medium text-gray-600">UPSELL AMOUNT</span>
            </div>
            
            <div className="grid grid-cols-4 gap-4 items-center py-2">
              <span className="text-sm text-[#051046]">Sarah Johnson</span>
              <span className="text-sm text-[#051046]">Staff</span>
              <span className="text-sm text-[#051046]">50/12</span>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" style={{ color: '#b9df10' }} />
                <span className="text-sm font-medium text-[#051046]">$7,754.7</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 items-center py-2">
              <span className="text-sm text-[#051046]">Michael Chen</span>
              <span className="text-sm text-[#051046]">Office Admin</span>
              <span className="text-sm text-[#051046]">45/8</span>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" style={{ color: '#f0a041' }} />
                <span className="text-sm font-medium text-[#051046]">$5,204.63</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 items-center py-2">
              <span className="text-sm text-[#051046]">David Martinez</span>
              <span className="text-sm text-[#051046]">Staff</span>
              <span className="text-sm text-[#051046]">38/5</span>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" style={{ color: '#f0a041' }} />
                <span className="text-sm font-medium text-[#051046]">$3,981.0</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 items-center py-2">
              <span className="text-sm text-[#051046]">Emma Williams</span>
              <span className="text-sm text-[#051046]">Staff</span>
              <span className="text-sm text-[#051046]">42/0</span>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" style={{ color: '#f16a6a' }} />
                <span className="text-sm font-medium text-[#051046]">$0.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Late Arrival Rate - Full Width */}
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 mb-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-[#051046]">Late Arrival Rate</h3>
          <select
            value={lateArrivalFilter}
            onChange={(e) => setLateArrivalFilter(e.target.value)}
            className="px-3 py-1.5 border border-[#e8e8e8] rounded-[15px] text-xs text-[#051046] bg-white focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
          >
            <option value="all-time">All Time</option>
            <option value="today">Today</option>
            <option value="last-7-days">Last 7 Days</option>
            <option value="current-month">Current Month</option>
            <option value="last-month">Last Month</option>
            <option value="last-3-months">Last 3 Months</option>
            <option value="current-year">Current Year</option>
          </select>
        </div>
        <p className="text-xs text-gray-600 mb-6">Note: This metric shows the percentage of jobs where a technician is late, based on when they press the "Job Started" button after the scheduled end time.</p>
        
        <div className="space-y-6">
          {/* Emma Williams */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 w-40">
              <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden flex-shrink-0">
                <ImageWithFallback 
                  src={technicianImages.emmaWilliams} 
                  alt="Emma Williams" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm text-[#051046]">Emma Williams</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 bg-gray-100 h-8 overflow-hidden" style={{ borderRadius: '8px' }}>
                <div className="bg-gray-300 h-full" style={{ width: '0%', borderRadius: '8px' }}></div>
              </div>
              <span className="text-sm font-medium text-[#051046] w-12 text-right">0%</span>
            </div>
          </div>

          {/* David Martinez */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 w-40">
              <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden flex-shrink-0">
                <ImageWithFallback 
                  src={technicianImages.davidMartinez} 
                  alt="David Martinez" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm text-[#051046]">David Martinez</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 bg-gray-100 h-8 overflow-hidden" style={{ borderRadius: '8px' }}>
                <div className="h-full" style={{ width: '50%', backgroundColor: '#f16a6a', borderRadius: '8px' }}></div>
              </div>
              <span className="text-sm font-medium text-[#051046] w-12 text-right">50%</span>
            </div>
          </div>

          {/* Sarah Johnson */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 w-40">
              <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden flex-shrink-0">
                <ImageWithFallback 
                  src={technicianImages.sarahJohnson} 
                  alt="Sarah Johnson" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm text-[#051046]">Sarah Johnson</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 bg-gray-100 h-8 overflow-hidden" style={{ borderRadius: '8px' }}>
                <div className="h-full" style={{ width: '35%', backgroundColor: '#f16a6a', borderRadius: '8px' }}></div>
              </div>
              <span className="text-sm font-medium text-[#051046] w-12 text-right">35%</span>
            </div>
          </div>

          {/* Michael Chen */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 w-40">
              <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden flex-shrink-0">
                <ImageWithFallback 
                  src={technicianImages.michaelChen} 
                  alt="Michael Chen" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm text-[#051046]">Michael Chen</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 bg-gray-100 h-8 overflow-hidden" style={{ borderRadius: '8px' }}>
                <div className="h-full" style={{ width: '25%', backgroundColor: '#f16a6a', borderRadius: '8px' }}></div>
              </div>
              <span className="text-sm font-medium text-[#051046] w-12 text-right">25%</span>
            </div>
          </div>
        </div>

        {/* Scale Labels */}
        <div className="flex justify-between items-center mt-4 px-44">
          <span className="text-xs text-gray-500">0%</span>
          <span className="text-xs text-gray-500">5%</span>
          <span className="text-xs text-gray-500">10%</span>
          <span className="text-xs text-gray-500">15%</span>
          <span className="text-xs text-gray-500">20%</span>
          <span className="text-xs text-gray-500">25%</span>
          <span className="text-xs text-gray-500">30%</span>
          <span className="text-xs text-gray-500">35%</span>
          <span className="text-xs text-gray-500">40%</span>
          <span className="text-xs text-gray-500">45%</span>
          <span className="text-xs text-gray-500">50%</span>
          <span className="text-xs text-gray-500">55%</span>
        </div>
      </div>

      {/* Estimate Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Estimate Decline Rate Card */}
        <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#051046]">Estimate Decline Rate (EDR)</h3>
            <select
              value={edrFilter}
              onChange={(e) => setEdrFilter(e.target.value)}
              className="px-3 py-1.5 border border-[#e8e8e8] rounded-[15px] text-xs text-[#051046] bg-white focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
            >
              <option value="all-time">All Time</option>
              <option value="today">Today</option>
              <option value="last-7-days">Last 7 Days</option>
              <option value="current-month">Current Month</option>
              <option value="last-month">Last Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="current-year">Current Year</option>
            </select>
          </div>
          
          {/* Success Message */}
          <div className="flex items-start gap-2 mb-6 bg-purple-50 p-3 rounded-[15px]">
            <ThumbsUp className="w-5 h-5 text-[#9473ff] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#051046]">You're doing good!</p>
              <p className="text-xs text-gray-600">Keep pushing to lower declines</p>
            </div>
          </div>

          {/* Donut Chart Representation */}
          <div className="flex items-center justify-center mb-6 relative">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={declineReasonsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    cornerRadius={8}
                  >
                    {declineReasonsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                            {data.name}: {data.value} ({data.percentage.toFixed(1)}%)
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xs text-gray-600">Overall</p>
                <p className="text-3xl font-semibold text-[#051046]">26%</p>
                <p className="text-xs text-gray-500 mt-1">Total Declined</p>
                <p className="text-lg font-medium text-gray-600">46</p>
              </div>
            </div>
          </div>

          {/* All Decline Reasons */}
          <div>
            <p className="text-sm font-medium text-[#051046] mb-3">All Decline Reasons</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28bdf2' }}></div>
                  <span className="text-sm text-[#051046]">Price</span>
                </div>
                <span className="text-sm font-medium text-gray-600">#13</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#c555e1' }}></div>
                  <span className="text-sm text-[#051046]">Competitor</span>
                </div>
                <span className="text-sm font-medium text-gray-600">#11</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f0a041' }}></div>
                  <span className="text-sm text-[#051046]">Scheduling</span>
                </div>
                <span className="text-sm font-medium text-gray-600">#7</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#b9df10' }}></div>
                  <span className="text-sm text-[#051046]">Communication</span>
                </div>
                <span className="text-sm font-medium text-gray-600">#7</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f16a6a' }}></div>
                  <span className="text-sm text-[#051046]">Employee</span>
                </div>
                <span className="text-sm font-medium text-gray-600">#8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technician Decline Rates Card */}
        <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#051046]">Technician Decline Rates</h3>
            <select
              value={technicianFilter}
              onChange={(e) => setTechnicianFilter(e.target.value)}
              className="px-3 py-1.5 border border-[#e8e8e8] rounded-[15px] text-xs text-[#051046] bg-white focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
            >
              <option value="all-time">All Time</option>
              <option value="today">Today</option>
              <option value="last-7-days">Last 7 Days</option>
              <option value="current-month">Current Month</option>
              <option value="last-month">Last Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="current-year">Current Year</option>
            </select>
          </div>
          
          <div className="space-y-6">
            {/* Emma Williams */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[#051046]">Emma Williams</p>
                <p className="text-xs text-gray-500">Declined: 1</p>
              </div>
              <div className="relative flex h-8 overflow-visible bg-gray-100" style={{ borderRadius: '8px' }}>
                <div 
                  className="hover:brightness-110 transition-all relative flex items-center justify-center" 
                  style={{ width: '100%', backgroundColor: '#f16a6a', borderRadius: '8px' }}
                  onMouseEnter={(e) => setHoveredSegment({ technicianIndex: 0, reasonIndex: 0, reason: 'Employee', count: 1 })}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <span className="text-white text-xs font-medium">1</span>
                </div>
                {hoveredSegment?.technicianIndex === 0 && hoveredSegment?.reasonIndex === 0 && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-50 pointer-events-none">
                    Employee: 1
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f16a6a' }}></div>
                <span className="text-xs text-gray-600">Employee (1)</span>
              </div>
            </div>

            {/* David Martinez */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[#051046]">David Martinez</p>
                <p className="text-xs text-gray-500">Declined: 27</p>
              </div>
              <div className="relative flex h-8 overflow-visible bg-gray-100" style={{ borderRadius: '8px' }}>
                <div 
                  className="hover:brightness-110 transition-all relative flex items-center justify-center" 
                  style={{ width: '33%', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', backgroundColor: '#28bdf2' }}
                  onMouseEnter={(e) => setHoveredSegment({ technicianIndex: 1, reasonIndex: 0, reason: 'Price', count: 9 })}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <span className="text-white text-xs font-medium">9</span>
                </div>
                <div 
                  className="hover:brightness-110 transition-all relative flex items-center justify-center" 
                  style={{ width: '30%', backgroundColor: '#c555e1' }}
                  onMouseEnter={(e) => setHoveredSegment({ technicianIndex: 1, reasonIndex: 1, reason: 'Competitor', count: 8 })}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <span className="text-white text-xs font-medium">8</span>
                </div>
                <div 
                  className="hover:brightness-110 transition-all relative flex items-center justify-center" 
                  style={{ width: '22%', backgroundColor: '#f0a041' }}
                  onMouseEnter={(e) => setHoveredSegment({ technicianIndex: 1, reasonIndex: 2, reason: 'Scheduling', count: 6 })}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <span className="text-white text-xs font-medium">6</span>
                </div>
                <div 
                  className="hover:brightness-110 transition-all relative flex items-center justify-center" 
                  style={{ width: '15%', borderTopRightRadius: '8px', borderBottomRightRadius: '8px', backgroundColor: '#f16a6a' }}
                  onMouseEnter={(e) => setHoveredSegment({ technicianIndex: 1, reasonIndex: 3, reason: 'Employee', count: 4 })}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <span className="text-white text-xs font-medium">4</span>
                </div>
                {hoveredSegment?.technicianIndex === 1 && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-50 pointer-events-none">
                    {hoveredSegment.reason}: {hoveredSegment.count}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#28bdf2' }}></div>
                  <span className="text-xs text-gray-600">Price (9)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#c555e1' }}></div>
                  <span className="text-xs text-gray-600">Competitor (8)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f0a041' }}></div>
                  <span className="text-xs text-gray-600">Scheduling (6)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f16a6a' }}></div>
                  <span className="text-xs text-gray-600">Employee (4)</span>
                </div>
              </div>
            </div>

            {/* Sarah Johnson */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[#051046]">Sarah Johnson</p>
                <p className="text-xs text-gray-500">Declined: 8</p>
              </div>
              <div className="relative flex h-8 overflow-visible bg-gray-100" style={{ borderRadius: '8px' }}>
                <div 
                  className="hover:brightness-110 transition-all relative flex items-center justify-center" 
                  style={{ width: '37.5%', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', backgroundColor: '#c555e1' }}
                  onMouseEnter={(e) => setHoveredSegment({ technicianIndex: 2, reasonIndex: 0, reason: 'Competitor', count: 3 })}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <span className="text-white text-xs font-medium">3</span>
                </div>
                <div 
                  className="hover:brightness-110 transition-all relative flex items-center justify-center" 
                  style={{ width: '37.5%', backgroundColor: '#b9df10' }}
                  onMouseEnter={(e) => setHoveredSegment({ technicianIndex: 2, reasonIndex: 1, reason: 'Communication', count: 3 })}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <span className="text-white text-xs font-medium">3</span>
                </div>
                <div 
                  className="hover:brightness-110 transition-all relative flex items-center justify-center" 
                  style={{ width: '25%', borderTopRightRadius: '8px', borderBottomRightRadius: '8px', backgroundColor: '#f16a6a' }}
                  onMouseEnter={(e) => setHoveredSegment({ technicianIndex: 2, reasonIndex: 2, reason: 'Employee', count: 2 })}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <span className="text-white text-xs font-medium">2</span>
                </div>
                {hoveredSegment?.technicianIndex === 2 && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-50 pointer-events-none">
                    {hoveredSegment.reason}: {hoveredSegment.count}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#c555e1' }}></div>
                  <span className="text-xs text-gray-600">Competitor (3)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#b9df10' }}></div>
                  <span className="text-xs text-gray-600">Communication (3)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f16a6a' }}></div>
                  <span className="text-xs text-gray-600">Employee (2)</span>
                </div>
              </div>
            </div>

            {/* Michael Chen */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[#051046]">Michael Chen</p>
                <p className="text-xs text-gray-500">Declined: 10</p>
              </div>
              <div className="relative flex h-8 overflow-visible bg-gray-100" style={{ borderRadius: '8px' }}>
                <div 
                  className="hover:brightness-110 transition-all relative flex items-center justify-center" 
                  style={{ width: '40%', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', backgroundColor: '#28bdf2' }}
                  onMouseEnter={(e) => setHoveredSegment({ technicianIndex: 3, reasonIndex: 0, reason: 'Price', count: 4 })}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <span className="text-white text-xs font-medium">4</span>
                </div>
                <div 
                  className="hover:brightness-110 transition-all relative flex items-center justify-center" 
                  style={{ width: '30%', backgroundColor: '#f0a041' }}
                  onMouseEnter={(e) => setHoveredSegment({ technicianIndex: 3, reasonIndex: 1, reason: 'Scheduling', count: 3 })}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <span className="text-white text-xs font-medium">3</span>
                </div>
                <div 
                  className="hover:brightness-110 transition-all relative flex items-center justify-center" 
                  style={{ width: '20%', backgroundColor: '#f16a6a' }}
                  onMouseEnter={(e) => setHoveredSegment({ technicianIndex: 3, reasonIndex: 2, reason: 'Employee', count: 2 })}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <span className="text-white text-xs font-medium">2</span>
                </div>
                <div 
                  className="hover:brightness-110 transition-all relative flex items-center justify-center" 
                  style={{ width: '10%', borderTopRightRadius: '8px', borderBottomRightRadius: '8px', backgroundColor: '#b9df10' }}
                  onMouseEnter={(e) => setHoveredSegment({ technicianIndex: 3, reasonIndex: 3, reason: 'Communication', count: 1 })}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <span className="text-white text-xs font-medium">1</span>
                </div>
                {hoveredSegment?.technicianIndex === 3 && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-50 pointer-events-none">
                    {hoveredSegment.reason}: {hoveredSegment.count}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#28bdf2' }}></div>
                  <span className="text-xs text-gray-600">Price (4)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f0a041' }}></div>
                  <span className="text-xs text-gray-600">Scheduling (3)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f16a6a' }}></div>
                  <span className="text-xs text-gray-600">Employee (2)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#b9df10' }}></div>
                  <span className="text-xs text-gray-600">Communication (1)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-t-[20px] border border-[#e2e8f0] border-b-0 p-6">
        <h2 className="text-xl font-semibold text-[#051046] mb-4">Sales Report</h2>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] bg-white focus:outline-none focus:ring-2 focus:ring-[#9473ff] min-w-[180px]"
              >
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-quarter">This Quarter</option>
                <option value="this-year">This Year</option>
              </select>
            </div>

            {/* Select range */}
            <div className="relative" ref={datePickerRef}>
              <button
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className="w-[180px] h-[44px] flex items-center justify-between px-4 border border-[#e8e8e8] rounded-[15px] text-[#051046] text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 hover:bg-gray-50 transition-colors"
              >
                <span className={startDate || endDate ? 'text-[#051046]' : 'text-gray-400'}>
                  {startDate && endDate
                    ? `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                    : startDate
                    ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Select range'}
                </span>
                <Calendar className="w-4 h-4 text-gray-400" />
              </button>

              {/* Calendar Dropdown */}
              {isDatePickerOpen && (
                <div className="absolute top-full left-0 mt-2 z-50">
                  <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    currentMonth={currentMonth}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                    onCurrentMonthChange={setCurrentMonth}
                    onClear={() => {
                      setStartDate(null);
                      setEndDate(null);
                      setIsDatePickerOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as ReportType)}
                  className="px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] bg-white focus:outline-none focus:ring-2 focus:ring-[#9473ff] min-w-[180px]"
                >
                  <option value="credit-card">Credit Card Payments</option>
                  <option value="cash">Cash Payments</option>
                  <option value="other">Other Payments</option>
                  <option value="failed">Failed Payments</option>
                </select>
                <div className="px-4 py-2 bg-[#f8f9fa] rounded-[15px] border border-[#e8e8e8]">
                  <span className="text-sm text-gray-600">Total: </span>
                  <span className="text-sm font-semibold text-[#051046]">
                    {reportData.reduce((sum, payment) => {
                      const amount = parseFloat(payment.amount.replace('$', '').replace(',', ''));
                      return sum + amount;
                    }, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button className="w-[160px] bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[32px] flex items-center justify-center gap-2 text-[16px] px-[24px] py-[10px] transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Payment Report Table */}
      <div className="bg-white rounded-b-[20px] border border-[#e2e8f0] border-t-0 p-6">
        <div className="flex items-center gap-3 mb-6">
          {getReportIcon()}
          <h3 className="text-lg font-semibold text-[#051046]">{getReportTitle()}</h3>
        </div>
        
        <div className="overflow-x-auto" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-[#e8e8e8]">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Job ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date and Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {currentPayments.map((payment, index) => (
                <tr key={payment.id} className={index !== currentPayments.length - 1 ? 'border-b border-[#e8e8e8]' : ''}>
                  <td className="py-3 px-4 text-sm">
                    <Link 
                      to={`/admin/jobs/all-jobs?jobId=${payment.jobId}`} 
                      className="text-[#9473ff] hover:underline font-medium"
                    >
                      {payment.jobId}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-sm text-[#051046]">{payment.dateTime}</td>
                  <td className="py-3 px-4 text-sm text-[#051046] font-medium">{payment.amount}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPaymentStatusColor(payment.status)}`}></div>
                      <span className="text-sm text-[#051046]">{payment.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total and Pagination */}
        <div className="mt-4 pt-4 border-t border-[#e2e8f0] flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium text-[#051046]">{indexOfFirstPayment + 1}</span> to <span className="font-medium text-[#051046]">{Math.min(indexOfLastPayment, reportData.length)}</span> of <span className="font-medium text-[#051046]">{reportData.length}</span> {reportData.length === 1 ? 'payment' : 'payments'}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-[10px] text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-[#9473ff] text-white'
                        : 'border border-[#e2e8f0] text-[#051046] hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
