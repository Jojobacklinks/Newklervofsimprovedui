import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Search, Plus, MoreVertical, FileText, Trash2, X, Calendar, DollarSign, User, MapPin, Eye, CheckCircle, CircleX } from 'lucide-react';
import { DateRangePicker } from '../components/DateRangePicker';

type EstimateStatus = 'Unsent' | 'Pending' | 'Approved' | 'Declined';
type EstimatePeriodFilter =
  | 'all-time'
  | 'today'
  | 'last-7-days'
  | 'current-month'
  | 'last-month'
  | 'last-3-months'
  | 'current-year';

interface Estimate {
  id: string;
  jobId: string;
  client: string;
  created: string;
  amount: number;
  status: EstimateStatus;
}

// Full estimate details for PDF view
interface EstimateDetails extends Estimate {
  items: Array<{
    id: number;
    description: string;
    notes: string;
    quantity: number;
    price: number;
    taxable: boolean;
  }>;
  discountAmount?: string;
  discountType?: '%' | '$';
  taxRate?: string;
  taxOption?: 'non-taxable' | 'tax-rate';
  estimateNotes?: string;
}

// Helper function to get status dot color
const getStatusColor = (status: EstimateStatus) => {
  switch(status) {
    case 'Approved': return 'bg-[#b9df10]';
    case 'Pending': return 'bg-[#28bdf2]';
    case 'Declined': return 'bg-[#f16a6a]';
    case 'Unsent': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};

export function EstimatesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EstimateStatus | 'All'>('All');
  const [periodFilter, setPeriodFilter] = useState<EstimatePeriodFilter>('all-time');
  
  // Read status from URL params on component mount
  useEffect(() => {
    const statusFromUrl = searchParams.get('status');
    if (statusFromUrl && (statusFromUrl === 'Unsent' || statusFromUrl === 'Pending' || statusFromUrl === 'Approved' || statusFromUrl === 'Declined')) {
      setStatusFilter(statusFromUrl as EstimateStatus);
    }
  }, [searchParams]);
  
  // PDF View Modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<EstimateDetails | null>(null);
  const [pdfTaxOption, setPdfTaxOption] = useState<'non-taxable' | 'tax-rate'>('non-taxable');
  
  // Success notification popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', description: '' });
  
  // Date picker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock estimates data
  const [estimates] = useState<Estimate[]>([
    { id: 'E-101', jobId: 'J-101', client: 'John AI', created: '2026-02-10', amount: 2500.00, status: 'Unsent' },
    { id: 'E-102', jobId: 'J-102', client: 'John AI', created: '2026-02-11', amount: 1800.00, status: 'Unsent' },
    { id: 'E-103', jobId: 'J-103', client: 'Sarah Johnson', created: '2026-02-08', amount: 3200.00, status: 'Pending' },
    { id: 'E-104', jobId: 'J-104', client: 'Michael Chen', created: '2026-02-05', amount: 4500.00, status: 'Approved' },
    { id: 'E-105', jobId: 'J-105', client: 'Emily Davis', created: '2026-02-03', amount: 1500.00, status: 'Declined' },
    { id: 'E-106', jobId: 'J-106', client: 'Robert Williams', created: '2026-02-12', amount: 2800.00, status: 'Pending' },
    { id: 'E-107', jobId: 'J-107', client: 'Jennifer Martinez', created: '2026-02-09', amount: 3600.00, status: 'Approved' },
  ]);

  // Calculate status counts
  const statusCounts = {
    Unsent: estimates.filter(e => e.status === 'Unsent').length,
    Pending: estimates.filter(e => e.status === 'Pending').length,
    Approved: estimates.filter(e => e.status === 'Approved').length,
    Declined: estimates.filter(e => e.status === 'Declined').length,
  };

  const statusAmounts = {
    Unsent: estimates.filter(e => e.status === 'Unsent').reduce((sum, est) => sum + est.amount, 0),
    Pending: estimates.filter(e => e.status === 'Pending').reduce((sum, est) => sum + est.amount, 0),
    Approved: estimates.filter(e => e.status === 'Approved').reduce((sum, est) => sum + est.amount, 0),
    Declined: estimates.filter(e => e.status === 'Declined').reduce((sum, est) => sum + est.amount, 0),
  };

  const isWithinSelectedPeriod = (dateString: string) => {
    if (periodFilter === 'all-time') {
      return true;
    }

    const estimateDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const compareDate = new Date(estimateDate);
    compareDate.setHours(0, 0, 0, 0);

    switch (periodFilter) {
      case 'today':
        return compareDate.getTime() === today.getTime();
      case 'last-7-days': {
        const start = new Date(today);
        start.setDate(today.getDate() - 6);
        return compareDate >= start && compareDate <= today;
      }
      case 'current-month':
        return (
          compareDate.getMonth() === today.getMonth() &&
          compareDate.getFullYear() === today.getFullYear()
        );
      case 'last-month': {
        const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        return compareDate >= lastMonthStart && compareDate < currentMonthStart;
      }
      case 'last-3-months': {
        const start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        return compareDate >= start && compareDate <= today;
      }
      case 'current-year':
        return compareDate.getFullYear() === today.getFullYear();
      default:
        return true;
    }
  };

  // Filter estimates
  const filteredEstimates = estimates.filter(estimate => {
    // Status filter
    if (statusFilter !== 'All' && estimate.status !== statusFilter) {
      return false;
    }

    // Date range filter
    if (startDate && endDate) {
      const estimateDate = new Date(estimate.created);
      if (estimateDate < startDate || estimateDate > endDate) {
        return false;
      }
    }

    // Time period filter
    if (!isWithinSelectedPeriod(estimate.created)) {
      return false;
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        estimate.id.toLowerCase().includes(searchLower) ||
        estimate.client.toLowerCase().includes(searchLower) ||
        estimate.amount.toString().includes(searchLower)
      );
    }

    return true;
  });

  const handleEstimateClick = (estimateId: string) => {
    // Navigate to job details view with estimates tab selected
    const estimate = estimates.find(e => e.id === estimateId);
    if (!estimate) return;
    
    // Determine if we're on admin or staff route
    const basePath = window.location.pathname.startsWith('/staff') ? '/staff' : '/admin';
    navigate(`${basePath}/jobs/details/${estimate.jobId}?tab=Estimate`);
  };

  const handleViewJob = (estimateId: string) => {
    // Find the basic estimate
    const estimate = estimates.find(e => e.id === estimateId);
    if (!estimate) return;
    
    // Create full estimate details with mock line items
    const fullEstimate: EstimateDetails = {
      ...estimate,
      items: [
        {
          id: 1,
          description: 'HVAC Tune-Up Service',
          notes: 'Complete system inspection and tune-up',
          quantity: 1,
          price: 150.00,
          taxable: false
        },
        {
          id: 2,
          description: 'AC Filter Replacement',
          notes: 'High-efficiency filter installation',
          quantity: 2,
          price: 45.00,
          taxable: true
        }
      ],
      discountAmount: '10',
      discountType: '%',
      taxRate: '8.25',
      taxOption: 'tax-rate',
      estimateNotes: 'Thank you for your business!'
    };
    
    setSelectedEstimate(fullEstimate);
    setShowViewModal(true);
  };

  const handleEdit = (estimateId: string) => {
    alert(`Edit estimate ${estimateId}`);
  };

  const handleDelete = (estimateId: string) => {
    if (confirm(`Are you sure you want to delete estimate ${estimateId}?`)) {
      alert(`Deleted estimate ${estimateId}`);
    }
  };

  const handleSend = (estimateId: string) => {
    setSuccessMessage({
      title: 'Estimate Sent Successfully!',
      description: 'Customer has been notified via email.'
    });
    setShowSuccessPopup(true);
  };

  const handleSendReminder = (estimateId: string) => {
    setSuccessMessage({
      title: 'Reminder Sent!',
      description: 'Customer has been notified about the pending estimate.'
    });
    setShowSuccessPopup(true);
  };

  const handleDecline = (estimateId: string) => {
    if (confirm(`Are you sure you want to decline estimate ${estimateId}?`)) {
      alert(`Declined estimate ${estimateId}`);
    }
  };

  const handleView = (estimateId: string) => {
    alert(`View estimate ${estimateId}`);
  };

  const handleRequestDeposit = (estimateId: string) => {
    alert(`Request deposit for estimate ${estimateId}`);
  };

  const handleCopyToInvoice = (estimateId: string) => {
    alert(`Copy estimate ${estimateId} to invoice`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="p-4 md:p-8">
      {/* Status Count Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="relative flex min-h-[152px] flex-col justify-between bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5]">
            <FileText className="w-5 h-5 text-[#BDBDBD]" />
          </div>
          <p className="text-sm text-gray-600 mb-2">Unsent</p>
          <p className="text-3xl font-bold text-[#051046] mb-1">{statusCounts.Unsent}</p>
          <p className="text-xs text-gray-600">Total unsent value: {formatCurrency(statusAmounts.Unsent)}</p>
        </div>
        <div className="relative flex min-h-[152px] flex-col justify-between bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#A6E4FA]">
            <Calendar className="w-5 h-5 text-[#28bdf2]" />
          </div>
          <p className="text-sm text-gray-600 mb-2">Pending</p>
          <p className="text-3xl font-bold text-[#051046] mb-1">{statusCounts.Pending}</p>
          <p className="text-xs text-gray-600">Total pending value: {formatCurrency(statusAmounts.Pending)}</p>
        </div>
        <div className="relative flex min-h-[152px] flex-col justify-between bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E2F685]">
            <CheckCircle className="w-5 h-5 text-[#99b80d]" />
          </div>
          <p className="text-sm text-gray-600 mb-2">Approved</p>
          <p className="text-3xl font-bold text-[#051046] mb-1">{statusCounts.Approved}</p>
          <p className="text-xs text-gray-600">Total approved value: {formatCurrency(statusAmounts.Approved)}</p>
        </div>
        <div className="relative flex min-h-[152px] flex-col justify-between bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FFDBE6]">
            <CircleX className="w-5 h-5 text-[#f16a6a]" />
          </div>
          <p className="text-sm text-gray-600 mb-2">Declined</p>
          <p className="text-3xl font-bold text-[#051046] mb-1">{statusCounts.Declined}</p>
          <p className="text-xs text-gray-600">Total declined value: {formatCurrency(statusAmounts.Declined)}</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-4 md:p-6 mb-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        <div className="flex items-center gap-4">
          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[180px] h-[44px] pl-10 pr-4 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Date Range Filter */}
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
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value as EstimatePeriodFilter)}
              className="w-[180px] h-[44px] px-4 border border-[#9473ff] rounded-[15px] text-sm text-[#051046] bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
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

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as EstimateStatus | 'All')}
              className="w-[180px] h-[44px] px-4 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="All">All Statuses</option>
              <option value="Unsent">Unsent</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estimates Table */}
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] overflow-hidden" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">
                  Estimate ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filteredEstimates.map((estimate) => (
                <tr 
                  key={estimate.id} 
                  onClick={() => handleEstimateClick(estimate.id)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewJob(estimate.id);
                      }}
                      className="text-sm hover:underline font-medium"
                      style={{ color: '#9473ff' }}
                    >
                      {estimate.id}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#051046]">{estimate.client}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#051046]">{formatDate(estimate.created)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#051046] font-medium">{formatCurrency(estimate.amount)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(estimate.status)}`}></div>
                      <span className="text-sm text-[#051046]">{estimate.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEstimateClick(estimate.id);
                        }}
                        className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        title="View Job"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e2e8f0] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing 1 to {filteredEstimates.length} of {filteredEstimates.length} entries
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm text-white bg-[#9473ff] rounded-[10px] hover:bg-purple-700 transition-colors">
                1
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF View Modal */}
      {showViewModal && selectedEstimate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowViewModal(false);
              setSelectedEstimate(null);
            }
          }}
        >
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between rounded-t-[20px]">
              <div className="flex-1"></div>
              <h2 className="text-xl font-bold text-[#051046]">ESTIMATE</h2>
              <div className="flex-1 flex justify-end">
                <button 
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedEstimate(null);
                  }} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Company & Estimate Info Row */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Left: Company Info */}
                <div>
                  <h3 className="font-semibold text-[#051046] text-lg mb-1">KL Plumbing</h3>
                  <p className="text-sm text-[#051046]">huexdesigns@gmail.com</p>
                  <p className="text-sm text-[#051046]">5555555555</p>
                </div>

                {/* Right: Estimate Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#051046] w-24">Estimate #</span>
                    <input 
                      type="text" 
                      value={selectedEstimate.id} 
                      readOnly
                      className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] bg-gray-50"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#051046] w-24">Date</span>
                    <input 
                      type="text" 
                      value={selectedEstimate.created} 
                      readOnly
                      className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Prepared For & Service Location */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Prepared For */}
                <div>
                  <h4 className="font-semibold text-[#051046] mb-2">Prepared For:</h4>
                  <p className="text-sm text-[#051046]">{selectedEstimate.client}</p>
                  <p className="text-sm text-[#051046]">Client Address</p>
                  <p className="text-sm text-[#051046]">(555) 123-4567</p>
                  <p className="text-sm text-[#051046]">client@email.com</p>
                </div>

                {/* Service Location */}
                <div>
                  <h4 className="font-semibold text-[#051046] mb-2">Service location:</h4>
                  <p className="text-sm text-[#051046]">{selectedEstimate.client}</p>
                  <p className="text-sm text-[#051046]">Service Address</p>
                  <p className="text-sm text-[#051046]">(555) 123-4567</p>
                  <p className="text-sm text-[#051046]">client@email.com</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <table className="w-full border-t border-b border-[#e2e8f0]">
                  <thead>
                    <tr className="border-b border-[#e2e8f0]">
                      <th className="text-left py-3 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Description</th>
                      <th className="text-center py-3 text-sm font-semibold text-[#6a7282] uppercase tracking-wider w-20">QTY</th>
                      <th className="text-right py-3 text-sm font-semibold text-[#6a7282] uppercase tracking-wider w-24">Price</th>
                      <th className="text-right py-3 text-sm font-semibold text-[#6a7282] uppercase tracking-wider w-32">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEstimate.items.map((item) => (
                      <tr key={item.id} className="border-b border-[#e2e8f0]">
                        <td className="py-4">
                          <div>
                            <p className="text-sm font-medium text-[#051046]">{item.description}</p>
                            {item.notes && (
                              <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                            )}
                            <span className="inline-block mt-2 text-[12px] font-medium text-[#6a7282]">
                              {item.taxable ? 'TAXABLE' : 'NON-TAXABLE'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-center text-sm text-[#051046]">{item.quantity}</td>
                        <td className="py-4 text-right text-sm text-[#051046]">${item.price.toFixed(2)}</td>
                        <td className="py-4 text-right text-sm font-medium text-[#051046]">${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Summary */}
              <div className="flex justify-end mb-8">
                <div className="w-96 space-y-3">
                  {(() => {
                    const items = selectedEstimate.items || [];
                    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                    
                    let discountValue = 0;
                    if (selectedEstimate.discountAmount) {
                      if (selectedEstimate.discountType === '%') {
                        discountValue = subtotal * (parseFloat(selectedEstimate.discountAmount) / 100);
                      } else {
                        discountValue = parseFloat(selectedEstimate.discountAmount);
                      }
                    }
                    
                    const afterDiscount = subtotal - discountValue;
                    
                    const taxableAmount = items.filter(item => item.taxable).reduce((sum, item) => sum + (item.quantity * item.price), 0);
                    const taxRate = selectedEstimate.taxRate ? parseFloat(selectedEstimate.taxRate) : 8.25;
                    const useTax = selectedEstimate.taxOption === 'tax-rate';
                    const taxAmount = useTax ? taxableAmount * (taxRate / 100) : 0;
                    
                    const total = afterDiscount + taxAmount;
                    
                    return (
                      <>
                        <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                          <span className="text-sm font-semibold text-[#051046]">Subtotal:</span>
                          <span className="text-sm text-[#051046]">${subtotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#051046]">Discount:</span>
                          <span className="text-sm text-[#051046]">
                            -{selectedEstimate.discountType === '%' ? `${selectedEstimate.discountAmount}%` : `$${selectedEstimate.discountAmount}`} (${discountValue.toFixed(2)})
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#051046]">Tax rate%:</span>
                          <span className="text-sm text-[#051046]">
                            {useTax ? `Tax Rate (${taxRate}%)` : 'Non-taxable'}
                          </span>
                        </div>

                        {useTax && (
                          <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                            <span className="text-sm font-semibold text-[#051046]">Tax:</span>
                            <span className="text-sm text-[#051046]">${taxAmount.toFixed(2)}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t-2 border-[#051046]">
                          <span className="text-lg font-bold text-[#051046]">Total:</span>
                          <span className="text-lg font-bold text-[#051046]">${total.toFixed(2)}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Notes */}
              {selectedEstimate.estimateNotes && (
                <div>
                  <h4 className="font-semibold text-[#051046] mb-2">Notes:</h4>
                  <p className="text-sm text-[#051046]">{selectedEstimate.estimateNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-8 max-w-md w-full" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#b9df10] rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            
            {/* Message */}
            <h3 className="text-xl font-semibold text-[#051046] mb-3 text-center">
              {successMessage.title}
            </h3>
            <p className="text-sm text-[#051046] leading-relaxed mb-6 text-center">
              {successMessage.description}
            </p>
            
            {/* Close Button */}
            <button 
              onClick={() => setShowSuccessPopup(false)}
              className="w-full px-6 py-2.5 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
