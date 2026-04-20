import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Eye, Calendar as CalendarIcon, Search, Bell, Trash2, ChevronDown, CreditCard, Banknote, MoreHorizontal, RotateCcw, X, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { DateRangePicker } from '../components/DateRangePicker';

type InvoiceStatus = 'Due' | 'Unpaid' | 'Paid' | 'Refunded';

interface Invoice {
  id: string;
  jobId: string;
  client: string;
  created: string;
  amount: number;
  status: InvoiceStatus;
}

// Full invoice details for PDF view
interface InvoiceDetails extends Invoice {
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
  invoiceNotes?: string;
}

export function InvoicesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'All'>('All');
  
  // Read status from URL params on component mount
  useEffect(() => {
    const statusFromUrl = searchParams.get('status');
    if (statusFromUrl && (statusFromUrl === 'Due' || statusFromUrl === 'Unpaid' || statusFromUrl === 'Paid' || statusFromUrl === 'Refunded')) {
      setStatusFilter(statusFromUrl as InvoiceStatus);
    }
  }, [searchParams]);
  
  // PDF View Modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetails | null>(null);
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

  // Pay dropdown state
  const [openPayDropdown, setOpenPayDropdown] = useState<string | null>(null);
  const payDropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

  // Close pay dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openPayDropdown) {
        const dropdownRef = payDropdownRefs.current[openPayDropdown];
        if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
          setOpenPayDropdown(null);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openPayDropdown]);

  // Mock invoices data
  const [invoices] = useState<Invoice[]>([
    { id: 'I-101', jobId: 'J-101', client: 'John AI', created: '2026-02-10', amount: 2500.00, status: 'Due' },
    { id: 'I-102', jobId: 'J-102', client: 'John AI', created: '2026-02-11', amount: 1800.00, status: 'Due' },
    { id: 'I-103', jobId: 'J-103', client: 'Sarah Johnson', created: '2026-02-08', amount: 3200.00, status: 'Unpaid' },
    { id: 'I-104', jobId: 'J-104', client: 'Michael Chen', created: '2026-02-05', amount: 4500.00, status: 'Paid' },
    { id: 'I-105', jobId: 'J-105', client: 'Emily Davis', created: '2026-02-03', amount: 1500.00, status: 'Refunded' },
    { id: 'I-106', jobId: 'J-106', client: 'Robert Williams', created: '2026-02-12', amount: 2800.00, status: 'Paid' },
    { id: 'I-107', jobId: 'J-107', client: 'Jennifer Martinez', created: '2026-02-09', amount: 3600.00, status: 'Due' },
    { id: 'I-108', jobId: 'J-108', client: 'David Brown', created: '2026-02-07', amount: 2200.00, status: 'Paid' },
  ]);

  // Calculate status counts
  const statusCounts = {
    Due: invoices.filter(i => i.status === 'Due').length,
    Unpaid: invoices.filter(i => i.status === 'Unpaid').length,
    Paid: invoices.filter(i => i.status === 'Paid').length,
    Refunded: invoices.filter(i => i.status === 'Refunded').length,
  };

  const statusAmounts = {
    Due: invoices.filter(i => i.status === 'Due').reduce((sum, inv) => sum + inv.amount, 0),
    Unpaid: invoices.filter(i => i.status === 'Unpaid').reduce((sum, inv) => sum + inv.amount, 0),
    Paid: invoices.filter(i => i.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0),
    Refunded: invoices.filter(i => i.status === 'Refunded').reduce((sum, inv) => sum + inv.amount, 0),
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    // Status filter
    if (statusFilter !== 'All' && invoice.status !== statusFilter) {
      return false;
    }

    // Date range filter
    if (startDate && endDate) {
      const invoiceDate = new Date(invoice.created);
      if (invoiceDate < startDate || invoiceDate > endDate) {
        return false;
      }
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        invoice.id.toLowerCase().includes(searchLower) ||
        invoice.client.toLowerCase().includes(searchLower) ||
        invoice.amount.toString().includes(searchLower)
      );
    }

    return true;
  });

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'Due':
        return 'bg-[#f0a041]';
      case 'Unpaid':
        return 'bg-[#99a1af]';
      case 'Paid':
        return 'bg-[#b9df10]';
      case 'Refunded':
        return 'bg-[#f16a6a]';
    }
  };

  const handleInvoiceClick = (invoiceId: string) => {
    // Show PDF modal when invoice ID is clicked
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    // Create full invoice details with mock line items
    const fullInvoice: InvoiceDetails = {
      ...invoice,
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
      invoiceNotes: 'Thank you for your business!'
    };
    
    setSelectedInvoice(fullInvoice);
    setShowViewModal(true);
  };

  const handleViewJob = (invoiceId: string) => {
    // Navigate to job details with Invoice tab selected
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    // Determine if we're on admin or staff route
    const basePath = window.location.pathname.startsWith('/staff') ? '/staff' : '/admin';
    navigate(`${basePath}/jobs/details/${invoice.jobId}?tab=Invoice`);
  };

  const handleSendReminder = (invoiceId: string) => {
    setSuccessMessage({
      title: 'Reminder Sent!',
      description: 'Customer has been notified about the pending payment.'
    });
    setShowSuccessPopup(true);
  };

  const handleView = (invoiceId: string) => {
    // Find the basic invoice
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    // Create full invoice details with mock line items
    const fullInvoice: InvoiceDetails = {
      ...invoice,
      items: [
        {
          id: 1,
          description: 'Plumbing Repair Service',
          notes: 'Fixed leaking pipe in basement',
          quantity: 1,
          price: 200.00,
          taxable: false
        },
        {
          id: 2,
          description: 'Replacement Parts',
          notes: 'New copper fittings and connectors',
          quantity: 3,
          price: 35.00,
          taxable: true
        }
      ],
      discountAmount: '5',
      discountType: '%',
      taxRate: '8.25',
      taxOption: 'tax-rate',
      invoiceNotes: 'Payment due within 30 days. Thank you for your business!'
    };
    
    setSelectedInvoice(fullInvoice);
    setShowViewModal(true);
  };

  const handlePayCard = (invoiceId: string) => {
    alert(`Process card payment for invoice ${invoiceId}`);
    setOpenPayDropdown(null);
    setSuccessMessage({ title: 'Payment Processed', description: `Card payment for invoice ${invoiceId} has been processed successfully.` });
    setShowSuccessPopup(true);
  };

  const handlePayCash = (invoiceId: string) => {
    alert(`Record cash payment for invoice ${invoiceId}`);
    setOpenPayDropdown(null);
    setSuccessMessage({ title: 'Payment Recorded', description: `Cash payment for invoice ${invoiceId} has been recorded successfully.` });
    setShowSuccessPopup(true);
  };

  const handlePayOther = (invoiceId: string) => {
    alert(`Record other payment method for invoice ${invoiceId}`);
    setOpenPayDropdown(null);
    setSuccessMessage({ title: 'Payment Recorded', description: `Payment for invoice ${invoiceId} using other method has been recorded successfully.` });
    setShowSuccessPopup(true);
  };

  const handleDelete = (invoiceId: string) => {
    if (confirm(`Are you sure you want to delete invoice ${invoiceId}?`)) {
      alert(`Deleted invoice ${invoiceId}`);
    }
  };

  const handleRefund = (invoiceId: string) => {
    if (confirm(`Are you sure you want to refund invoice ${invoiceId}?`)) {
      alert(`Process refund for invoice ${invoiceId}`);
    }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="relative flex min-h-[152px] flex-col justify-between bg-white rounded-[20px] border border-[#e2e8f0] p-4" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ffdbb0]">
            <CalendarIcon className="w-5 h-5 text-[#f0a041]" />
          </div>
          <p className="text-sm text-gray-600">Due</p>
          <p className="text-3xl font-bold text-[#051046]">{statusCounts.Due}</p>
          <p className="text-xs text-gray-600">{formatCurrency(statusAmounts.Due)}</p>
        </div>
        <div className="relative flex min-h-[152px] flex-col justify-between bg-white rounded-[20px] border border-[#e2e8f0] p-4" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
            <CreditCard className="w-5 h-5 text-[#9473ff]" />
          </div>
          <p className="text-sm text-gray-600">Unpaid</p>
          <p className="text-3xl font-bold text-[#051046]">{statusCounts.Unpaid}</p>
          <p className="text-xs text-gray-600">{formatCurrency(statusAmounts.Unpaid)}</p>
        </div>
        <div className="relative flex min-h-[152px] flex-col justify-between bg-white rounded-[20px] border border-[#e2e8f0] p-4" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#A6E4FA]">
            <CheckCircle className="w-5 h-5 text-[#399deb]" />
          </div>
          <p className="text-sm text-gray-600">Paid</p>
          <p className="text-3xl font-bold text-[#051046]">{statusCounts.Paid}</p>
          <p className="text-xs text-gray-600">{formatCurrency(statusAmounts.Paid)}</p>
        </div>
        <div className="relative flex min-h-[152px] flex-col justify-between bg-white rounded-[20px] border border-[#e2e8f0] p-4" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FFDBE6]">
            <RotateCcw className="w-5 h-5 text-[#f16a6a]" />
          </div>
          <p className="text-sm text-gray-600">Refunded</p>
          <p className="text-3xl font-bold text-[#051046]">{statusCounts.Refunded}</p>
          <p className="text-xs text-gray-600">{formatCurrency(statusAmounts.Refunded)}</p>
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
              <CalendarIcon className="w-4 h-4 text-gray-400" />
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

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | 'All')}
              className="w-[180px] h-[44px] px-4 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="All">All Statuses</option>
              <option value="Due">Due</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] overflow-hidden" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">
                  Invoice ID
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
              {filteredInvoices.map((invoice) => (
                <tr 
                  key={invoice.id} 
                  onClick={() => handleViewJob(invoice.id)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInvoiceClick(invoice.id);
                      }}
                      className="text-sm hover:underline font-medium"
                      style={{ color: '#9473ff' }}
                    >
                      {invoice.id}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#051046]">{invoice.client}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#051046]">{formatDate(invoice.created)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#051046] font-medium">{formatCurrency(invoice.amount)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(invoice.status)}`}></div>
                      <span className="text-sm text-[#051046]">{invoice.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleViewJob(invoice.id)}
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
              Showing 1 to {filteredInvoices.length} of {filteredInvoices.length} entries
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
      {showViewModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowViewModal(false);
              setSelectedInvoice(null);
            }
          }}
        >
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between rounded-t-[20px]">
              <div className="flex-1"></div>
              <h2 className="text-xl font-bold text-[#051046]">INVOICE</h2>
              <div className="flex-1 flex justify-end">
                <button 
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedInvoice(null);
                  }} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Company & Invoice Info Row */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Left: Company Info */}
                <div>
                  <h3 className="font-semibold text-[#051046] text-lg mb-1">KL Plumbing</h3>
                  <p className="text-sm text-[#051046]">huexdesigns@gmail.com</p>
                  <p className="text-sm text-[#051046]">5555555555</p>
                </div>

                {/* Right: Invoice Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#051046] w-24">Invoice #</span>
                    <input 
                      type="text" 
                      value={selectedInvoice.id} 
                      readOnly
                      className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] bg-gray-50"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#051046] w-24">Date</span>
                    <input 
                      type="text" 
                      value={selectedInvoice.created} 
                      readOnly
                      className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Bill To & Service Location */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Bill To */}
                <div>
                  <h4 className="font-semibold text-[#051046] mb-2">Bill To:</h4>
                  <p className="text-sm text-[#051046]">{selectedInvoice.client}</p>
                  <p className="text-sm text-[#051046]">Client Address</p>
                  <p className="text-sm text-[#051046]">(555) 123-4567</p>
                  <p className="text-sm text-[#051046]">client@email.com</p>
                </div>

                {/* Service Location */}
                <div>
                  <h4 className="font-semibold text-[#051046] mb-2">Service location:</h4>
                  <p className="text-sm text-[#051046]">{selectedInvoice.client}</p>
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
                    {selectedInvoice.items.map((item) => (
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
                    const items = selectedInvoice.items || [];
                    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                    
                    let discountValue = 0;
                    if (selectedInvoice.discountAmount) {
                      if (selectedInvoice.discountType === '%') {
                        discountValue = subtotal * (parseFloat(selectedInvoice.discountAmount) / 100);
                      } else {
                        discountValue = parseFloat(selectedInvoice.discountAmount);
                      }
                    }
                    
                    const afterDiscount = subtotal - discountValue;
                    
                    const taxableAmount = items.filter(item => item.taxable).reduce((sum, item) => sum + (item.quantity * item.price), 0);
                    const taxRate = selectedInvoice.taxRate ? parseFloat(selectedInvoice.taxRate) : 8.25;
                    const useTax = selectedInvoice.taxOption === 'tax-rate';
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
                            -{selectedInvoice.discountType === '%' ? `${selectedInvoice.discountAmount}%` : `$${selectedInvoice.discountAmount}`} (${discountValue.toFixed(2)})
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
                          <div className="flex flex-col">
                            <span className="text-lg font-bold text-[#051046]">Total:</span>
                            {selectedInvoice.status === 'Refunded' && (
                              <span className="text-sm font-semibold" style={{ color: '#f16a6a' }}>Refunded</span>
                            )}
                          </div>
                          <span className={`text-lg font-bold ${selectedInvoice.status === 'Refunded' ? '' : 'text-[#051046]'}`} style={selectedInvoice.status === 'Refunded' ? { color: '#f16a6a' } : undefined}>${total.toFixed(2)}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Notes */}
              {selectedInvoice.invoiceNotes && (
                <div>
                  <h4 className="font-semibold text-[#051046] mb-2">Notes:</h4>
                  <p className="text-sm text-[#051046]">{selectedInvoice.invoiceNotes}</p>
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
