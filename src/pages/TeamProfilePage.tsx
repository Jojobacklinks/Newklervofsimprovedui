import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Download, Calendar, DollarSign, TrendingUp, Percent, Eye, ChevronLeft, ChevronRight, Search, CheckCircle, ArrowUpNarrowWide } from 'lucide-react';
import { DateRangePicker } from '../components/DateRangePicker';

interface Upsell {
  id: string;
  date: string;
  type: 'job_item' | 'service_plan';
  clientId: string;
  clientName: string;
  description: string;
  amount: number;
  commissionPercent: number;
  isPaid: boolean;
  sourceId: string; // Job ID or Service Plan ID
}

export function TeamProfilePage() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  
  // Mock team member data
  const teamMember = {
    id: memberId,
    fullName: 'Mike Bailey',
    firstName: 'Mike',
    lastName: 'Bailey',
    email: 'mikebobaile@yolx@gmail.com',
    phone: '+1 234 567 8900',
    role: 'Staff',
    hireDate: 'Feb 13, 2025',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
  };
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Date range picker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);
  
  // Filter states
  const [typeFilter, setTypeFilter] = useState<'all' | 'job_item' | 'service_plan'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Default commission from settings (this would come from global settings)
  const defaultCommission = 15; // 15%
  
  // Mock upsells data
  const [upsells, setUpsells] = useState<Upsell[]>([
    {
      id: '1',
      date: '2025-03-10',
      type: 'job_item',
      clientId: '1',
      clientName: 'John Smith',
      description: 'Premium HVAC Filter',
      amount: 150.00,
      commissionPercent: 15,
      isPaid: false,
      sourceId: 'JOB-001',
    },
    {
      id: '2',
      date: '2025-03-08',
      type: 'service_plan',
      clientId: '2',
      clientName: 'Sarah Johnson',
      description: 'Annual Maintenance Plan',
      amount: 599.00,
      commissionPercent: 20,
      isPaid: true,
      sourceId: 'PLAN-001',
    },
    {
      id: '3',
      date: '2025-03-05',
      type: 'job_item',
      clientId: '3',
      clientName: 'Robert Williams',
      description: 'Water Heater Upgrade',
      amount: 450.00,
      commissionPercent: 15,
      isPaid: false,
      sourceId: 'JOB-002',
    },
    {
      id: '4',
      date: '2025-03-01',
      type: 'service_plan',
      clientId: '4',
      clientName: 'Emily Davis',
      description: 'Premium Protection Plan',
      amount: 899.00,
      commissionPercent: 15,
      isPaid: true,
      sourceId: 'PLAN-002',
    },
  ]);
  
  // Filter upsells based on filters
  const filteredUpsells = upsells.filter(upsell => {
    const upsellDate = new Date(upsell.date);
    const start = startDate ? new Date(startDate) : new Date('2025-01-01');
    const end = endDate ? new Date(endDate) : new Date('2025-12-31');
    
    const dateMatch = upsellDate >= start && upsellDate <= end;
    const typeMatch = typeFilter === 'all' || upsell.type === typeFilter;
    const statusMatch = statusFilter === 'all' || 
      (statusFilter === 'paid' && upsell.isPaid) ||
      (statusFilter === 'pending' && !upsell.isPaid);
    
    return dateMatch && typeMatch && statusMatch;
  });
  
  // Calculate totals
  const totalUpsells = filteredUpsells.length;
  const jobsWithUpsells = new Set(
    filteredUpsells
      .filter((upsell) => upsell.type === 'job_item')
      .map((upsell) => upsell.sourceId)
  ).size;
  const totalJobsHandled = 45;
  const totalRevenue = filteredUpsells.reduce((sum, u) => sum + u.amount, 0);
  const totalCommission = filteredUpsells.reduce((sum, u) => sum + (u.amount * u.commissionPercent / 100), 0);
  const conversionRate = totalJobsHandled > 0 ? (totalUpsells / totalJobsHandled) * 100 : 0;
  
  // Handle commission update
  const handleCommissionUpdate = (upsellId: string, newPercent: number) => {
    setUpsells(upsells.map(u => 
      u.id === upsellId ? { ...u, commissionPercent: newPercent } : u
    ));
  };
  
  // Handle payment status toggle
  const handlePaymentToggle = (upsellId: string) => {
    setUpsells(upsells.map(u => 
      u.id === upsellId ? { ...u, isPaid: !u.isPaid } : u
    ));
  };
  
  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Date', 'Type', 'Client', 'Description', 'Amount', 'Commission %', 'Commission $', 'Status'];
    const rows = filteredUpsells.map(u => [
      u.date,
      u.type === 'job_item' ? 'Job Item' : 'Service Plan',
      u.clientName,
      u.description,
      `$${u.amount.toFixed(2)}`,
      `${u.commissionPercent}%`,
      `$${(u.amount * u.commissionPercent / 100).toFixed(2)}`,
      u.isPaid ? 'Paid' : 'Pending'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${teamMember.fullName}_Upsells_${startDate}_to_${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  // Export to PDF (simplified - in production, use a library like jsPDF)
  const handleExportPDF = () => {
    alert('PDF export functionality would use a library like jsPDF or react-pdf');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/team')}
        className="flex items-center gap-2 text-[#051046] hover:text-[#9473ff] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">Back to Team</span>
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={teamMember.photo}
            alt={teamMember.fullName}
            className="w-24 h-24 rounded-full object-cover border-2 border-[#e2e8f0]"
          />
          <div className="flex-1 w-full">
            <h1 className="text-xl md:text-2xl font-bold text-[#051046] mb-2 text-center md:text-left">{teamMember.fullName}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center md:text-left">
                <span className="text-gray-500">Role:</span>
                <span className="ml-2 font-medium text-[#051046]">{teamMember.role}</span>
              </div>
              <div className="text-center md:text-left">
                <span className="text-gray-500">Hire Date:</span>
                <span className="ml-2 font-medium text-[#051046]">{teamMember.hireDate}</span>
              </div>
              <div className="text-center md:text-left">
                <span className="text-gray-500">Email:</span>
                <span className="ml-2 font-medium text-[#051046]">{teamMember.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="relative flex min-h-[152px] flex-col justify-between bg-white rounded-[20px] border border-[#e2e8f0] shadow-sm p-6">
          <div className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5]">
            <TrendingUp className="w-5 h-5 text-[#BDBDBD]" />
          </div>
          <p className="text-sm text-gray-500">Total Upsells</p>
          <div className="text-3xl font-bold text-[#051046]">{totalUpsells}/{totalJobsHandled}</div>
          <p className="text-xs text-gray-600">Jobs with upsells out of total jobs</p>
        </div>
        
        <div className="relative flex min-h-[152px] flex-col justify-between bg-white rounded-[20px] border border-[#e2e8f0] shadow-sm p-6">
          <div className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#A6E4FA]">
            <DollarSign className="w-5 h-5 text-[#399deb]" />
          </div>
          <p className="text-sm text-gray-500">Total Revenue</p>
          <div className="text-3xl font-bold text-[#051046]">${totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-gray-600">Revenue generated from credited upsells</p>
        </div>
        
        <div className="relative flex min-h-[152px] flex-col justify-between bg-white rounded-[20px] border border-[#e2e8f0] shadow-sm p-6">
          <div className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E2F685]">
            <Percent className="w-5 h-5 text-[#99b80d]" />
          </div>
          <p className="text-sm text-gray-500">Total Commission</p>
          <div className="text-3xl font-bold text-[#051046]">${totalCommission.toFixed(2)}</div>
          <p className="text-xs text-gray-600">Commission earned so far</p>
        </div>
        
        <div className="relative flex min-h-[152px] flex-col justify-between bg-white rounded-[20px] border border-[#e2e8f0] shadow-sm p-6">
          <div className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e8ff]">
            <ArrowUpNarrowWide className="w-5 h-5 text-[#9473ff]" />
          </div>
          <p className="text-sm text-gray-500">Upsell Rate</p>
          <div className="text-3xl font-bold text-[#051046]">{conversionRate.toFixed(1)}%</div>
          <p className="text-xs text-gray-600">The percentage of jobs with upsells</p>
        </div>
      </div>

      {/* Filters and Export */}
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-[180px] h-[44px] pl-10 pr-4 border border-[#e8e8e8] rounded-[15px] text-[#051046] text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Date Range Picker */}
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

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-[180px] h-[44px] px-4 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
          >
            <option value="all">All Types</option>
            <option value="job_item">Job Items</option>
            <option value="service_plan">Service Plans</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-[180px] h-[44px] px-4 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>

          {/* Export Buttons */}
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleExportCSV}
              className="w-[160px] bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[32px] flex items-center justify-center gap-2 text-[16px] px-[24px] py-[10px] transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="w-[160px] bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[32px] flex items-center justify-center gap-2 text-[16px] px-[24px] py-[10px] transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Upsells Table */}
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-[#e2e8f0]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Commission %</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Commission $</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Paid</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUpsells.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((upsell) => (
                <tr key={upsell.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-[#051046]">
                    {new Date(upsell.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    {upsell.type === 'job_item' ? (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                        Job Item
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                        Service Plan
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/admin/clients/${upsell.clientId}`)}
                      className="text-sm font-medium"
                      style={{ color: '#051046' }}
                    >
                      {upsell.clientName}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#051046]">
                    ${upsell.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={upsell.commissionPercent}
                        onChange={(e) => handleCommissionUpdate(upsell.id, parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                      />
                      <span className="text-sm text-gray-500">%</span>
                      {upsell.commissionPercent === defaultCommission && (
                        <span className="text-xs text-gray-400">(default)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#051046]">
                    ${(upsell.amount * upsell.commissionPercent / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={upsell.isPaid}
                      onChange={() => handlePaymentToggle(upsell.id)}
                      className="w-5 h-5 border-gray-300 rounded focus:ring-[#9473ff] cursor-pointer"
                      style={{ accentColor: '#9473ff' }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (upsell.type === 'job_item') {
                          navigate(`/admin/jobs/details/${upsell.sourceId}`);
                        } else {
                          navigate('/admin/service-plans');
                        }
                      }}
                      className="text-[#9473ff] hover:text-[#7f5fd9] transition-colors"
                      title="View Source"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUpsells.length > 0 && (
          <div className="border-t border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUpsells.length)} of {filteredUpsells.length} entries
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, Math.ceil(filteredUpsells.length / itemsPerPage)) }, (_, i) => {
                  const totalPages = Math.ceil(filteredUpsells.length / itemsPerPage);
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
                      onClick={() => setCurrentPage(pageNum)}
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredUpsells.length / itemsPerPage)))}
                disabled={currentPage === Math.ceil(filteredUpsells.length / itemsPerPage)}
                className="p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
