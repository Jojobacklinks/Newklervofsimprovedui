import { useState } from 'react';
import { ChevronDown, ClipboardList } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export function EstimatePanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedType, setSelectedType] = useState<'estimate' | 'invoice'>('estimate');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const estimateData = [
    { label: 'Unsent', count: 3 },
    { label: 'Pending', count: 1 },
    { label: 'Approved', count: 148 },
    { label: 'Declined', count: 45 },
  ];

  const invoiceData = [
    { label: 'Due', count: 2 },
    { label: 'Unpaid', count: 1 },
    { label: 'Paid', count: 362 },
    { label: 'Refunded', count: 5 },
  ];

  const currentData = selectedType === 'estimate' ? estimateData : invoiceData;
  const title = selectedType === 'estimate' ? 'Estimate' : 'Invoice';

  const handleStatusClick = (status: string) => {
    // Determine the base path based on current location (admin or staff)
    const basePath = location.pathname.startsWith('/staff') ? '/staff' : '/admin';
    
    if (selectedType === 'estimate') {
      navigate(`${basePath}/jobs/estimates?status=${status}`);
    } else {
      navigate(`${basePath}/jobs/invoices?status=${status}`);
    }
  };

  return (
    <div>
      {/* Dropdown Header */}
      <div className="relative mb-4">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 text-base font-semibold text-[#051046] hover:opacity-80 transition-opacity"
        >
          <ClipboardList className="w-5 h-5" style={{ color: '#8b5cf6' }} />
          {title}
          <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div 
            className="absolute top-full left-0 mt-2 bg-white rounded-[15px] border border-[#e8e8e8] py-1 z-10 min-w-[140px]"
            style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
          >
            <button
              onClick={() => {
                setSelectedType('estimate');
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[#051046] hover:bg-gray-50 transition-colors"
            >
              Estimate
            </button>
            <button
              onClick={() => {
                setSelectedType('invoice');
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[#051046] hover:bg-gray-50 transition-colors"
            >
              Invoice
            </button>
          </div>
        )}
      </div>
      
      {/* Status List */}
      <div className="space-y-3">
        {currentData.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <span className="text-sm text-[#051046]">{item.label}</span>
            <button 
              onClick={() => handleStatusClick(item.label)}
              className="text-sm font-medium hover:underline transition-all cursor-pointer"
              style={{ color: '#8b5cf6' }}
            >
              {item.count}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}