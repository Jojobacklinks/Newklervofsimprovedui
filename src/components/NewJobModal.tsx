import { useState, useEffect, useRef } from 'react';
import { Search, X, Trash2 } from 'lucide-react';
import { AddPartOrServiceModal } from './AddPartOrServiceModal';

// Available tags
const availableTags = ['Urgent', 'New', 'Quick'];

// Team member busy status colors
const teamMemberBusyStatus: { [key: string]: string } = {
  'Mike Bailey': '#b9df10',      // Available (green)
  'John Tom': '#f0a041',         // Moderate (orange)
  'Sarah Wilson': '#f16a6a',     // Busy (red)
  'David Chen': '#f16a6a',       // Busy (red)
};

// Mock client database for autocomplete
const mockClientDatabase = [
  { id: '1', name: 'John Smith', email: 'john.smith@email.com', phone: '(555) 123-4567' },
  { id: '2', name: 'John Smith', email: 'johnsmith99@gmail.com', phone: '(555) 987-6543' },
  { id: '3', name: 'Sarah Johnson', email: 'sarah.j@company.com', phone: '(555) 234-5678' },
  { id: '4', name: 'Michael Brown', email: 'mbrown@business.com', phone: '(555) 345-6789' },
  { id: '5', name: 'Emily Davis', email: 'emily.davis@email.com', phone: '(555) 456-7890' },
  { id: '6', name: 'John Williams', email: 'j.williams@work.com', phone: '(555) 567-8901' },
  { id: '7', name: 'Jessica Miller', email: 'jess.miller@email.com', phone: '(555) 678-9012' },
];

// Mock inventory database
const inventoryDatabase = [
  { id: 101, name: 'HVAC Tune-Up Service', type: 'service' as const, price: 150.00, taxable: false },
  { id: 102, name: 'AC Filter Replacement', type: 'service' as const, price: 45.00, taxable: false },
  { id: 103, name: 'Drain Cleaning', type: 'service' as const, price: 125.00, taxable: false },
  { id: 104, name: 'Water Heater Installation', type: 'service' as const, price: 850.00, taxable: false },
  { id: 105, name: 'Electrical Inspection', type: 'service' as const, price: 95.00, taxable: false },
  { id: 106, name: 'Copper Pipe - 10ft', type: 'part' as const, price: 28.50, taxable: true },
  { id: 107, name: 'PVC Pipe - 10ft', type: 'part' as const, price: 12.75, taxable: true },
  { id: 108, name: 'Air Filter 16x20', type: 'part' as const, price: 15.99, taxable: true },
  { id: 109, name: 'Thermostat - Digital', type: 'part' as const, price: 89.00, taxable: true },
  { id: 110, name: 'Circuit Breaker 20A', type: 'part' as const, price: 24.50, taxable: true },
  { id: 111, name: 'Plumbing Snake', type: 'part' as const, price: 45.00, taxable: true },
  { id: 112, name: 'GFCI Outlet', type: 'part' as const, price: 18.99, taxable: true },
  { id: 113, name: 'Smoke Detector', type: 'part' as const, price: 32.00, taxable: true },
  { id: 114, name: 'Water Heater - 50 Gallon', type: 'part' as const, price: 575.00, taxable: true },
  { id: 115, name: 'Sump Pump Installation', type: 'service' as const, price: 425.00, taxable: false }
];

// Selected inventory item interface
interface SelectedInventoryItem {
  id: number;
  description: string;
  isUpsell: boolean;
  quantity: number;
  price: number;
  type: 'service' | 'part';
}

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: {
    id: string;
    tags: string[];
    client: string;
    clientEmail: string;
    clientPhone: string;
    jobType: string;
    jobStatus: 'Scheduled';
    duration: string;
    scheduled: string;
    scheduledStart: string;
    scheduledEnd: string;
    tech: string;
    address: string;
    jobDescription: string;
    jobSource: string;
    techNotes: string;
    isNew: boolean;
    hasUpsell: boolean;
    arrivedLate: boolean;
    scheduledByStaff: boolean;
    isAllDay: boolean;
    servicePlanId?: string;
  }) => void;
  onAddClientClick: () => void;
  onCustomValueModalOpen: (config: { isOpen: boolean; type: 'jobType' | 'jobSource' | 'tags'; title: string }) => void;
  jobTypes: string[];
  jobSources: string[];
  initialData?: {
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    address?: string;
    jobType?: string;
    jobDescription?: string;
    jobSource?: string;
    servicePlanId?: string;
  };
}

export function NewJobModal({
  isOpen,
  onClose,
  onSubmit,
  onAddClientClick,
  onCustomValueModalOpen,
  jobTypes,
  jobSources,
  initialData,
}: NewJobModalProps) {
  // Form state
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<typeof mockClientDatabase[0] | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [filteredClients, setFilteredClients] = useState<typeof mockClientDatabase>([]);
  const [addressInput, setAddressInput] = useState('');
  const [jobType, setJobType] = useState('');
  const [jobSource, setJobSource] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [showInventoryDropdown, setShowInventoryDropdown] = useState(false);
  const [selectedInventoryItems, setSelectedInventoryItems] = useState<SelectedInventoryItem[]>([]);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [isTeamMemberDropdownOpen, setIsTeamMemberDropdownOpen] = useState(false);
  const [jobTags, setJobTags] = useState<string[]>([]);
  const [isJobTagDropdownOpen, setIsJobTagDropdownOpen] = useState(false);
  const [isAddInventoryModalOpen, setIsAddInventoryModalOpen] = useState(false);

  const clientInputRef = useRef<HTMLDivElement>(null);

  // Filter inventory based on search
  const filteredInventory = inventoryDatabase.filter(item =>
    item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    item.type.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  // Client search and autocomplete
  const handleClientSearch = (value: string) => {
    setClientSearchTerm(value);
    setSelectedClient(null);
    
    if (value.trim() === '') {
      setFilteredClients([]);
      setShowClientDropdown(false);
      return;
    }
    
    const matches = mockClientDatabase.filter(client =>
      client.name.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredClients(matches);
    setShowClientDropdown(true);
  };

  const handleSelectClient = (client: typeof mockClientDatabase[0]) => {
    setSelectedClient(client);
    setClientSearchTerm(client.name);
    setShowClientDropdown(false);
  };

  // Close client dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientInputRef.current && !clientInputRef.current.contains(event.target as Node)) {
        setShowClientDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Inventory management
  const handleAddInventoryItem = (item: typeof inventoryDatabase[0]) => {
    const newItem: SelectedInventoryItem = {
      id: Date.now(),
      description: item.name,
      isUpsell: false,
      quantity: item.type === 'service' ? 1 : 1,
      price: item.price,
      type: item.type,
    };
    setSelectedInventoryItems([...selectedInventoryItems, newItem]);
    setShowInventoryDropdown(false);
    setInventorySearch('');
  };

  const handleRemoveInventoryItem = (id: number) => {
    setSelectedInventoryItems(selectedInventoryItems.filter(item => item.id !== id));
  };

  const handleUpsellToggle = (id: number) => {
    setSelectedInventoryItems(selectedInventoryItems.map(item =>
      item.id === id ? { ...item, isUpsell: !item.isUpsell } : item
    ));
  };

  const handleQuantityChange = (id: number, value: string) => {
    const quantity = parseInt(value) || 1;
    setSelectedInventoryItems(selectedInventoryItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handlePriceChange = (id: number, value: string) => {
    const price = parseFloat(value) || 0;
    setSelectedInventoryItems(selectedInventoryItems.map(item =>
      item.id === id ? { ...item, price } : item
    ));
  };

  // Add custom inventory item handler
  const handleAddCustomInventoryItem = (itemData: {
    name: string;
    type: 'service' | 'part';
    quantity: number;
    minStockLevel: number;
    sku: string;
    cost: string;
    markup: string;
    markupType: 'percentage' | 'dollar';
    price: string;
    taxable: string;
    category: string;
    brand: string;
    description: string;
  }) => {
    const newItem: SelectedInventoryItem = {
      id: Date.now(),
      description: itemData.name,
      isUpsell: false,
      quantity: itemData.type === 'service' ? 1 : 1,
      price: parseFloat(itemData.price) || 0,
      type: itemData.type,
    };
    setSelectedInventoryItems([...selectedInventoryItems, newItem]);
  };

  // Tags management
  const handleJobTagToggle = (tag: string) => {
    if (jobTags.includes(tag)) {
      setJobTags(jobTags.filter(t => t !== tag));
    } else {
      setJobTags([...jobTags, tag]);
    }
  };

  const handleRemoveJobTag = (tag: string) => {
    setJobTags(jobTags.filter(t => t !== tag));
  };

  // Form reset
  const resetForm = () => {
    setClientSearchTerm('');
    setSelectedClient(null);
    setAddressInput('');
    setJobType('');
    setJobSource('');
    setJobDescription('');
    setInventorySearch('');
    setSelectedInventoryItems([]);
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setSelectedTeamMembers([]);
    setJobTags([]);
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Populate form with initial data when provided
  useEffect(() => {
    if (initialData && isOpen) {
      if (initialData.clientName) setClientSearchTerm(initialData.clientName);
      if (initialData.address) setAddressInput(initialData.address);
      if (initialData.jobType) setJobType(initialData.jobType);
      if (initialData.jobSource) setJobSource(initialData.jobSource);
      if (initialData.jobDescription) setJobDescription(initialData.jobDescription);
    }
  }, [initialData, isOpen]);

  // Handle form submission
  const handleSubmit = () => {
    if (!startDate) {
      alert('Please select a start date');
      return;
    }

    // Helper: convert "9:00 AM" / "1:30 PM" → "09:00" / "13:30" for valid ISO strings
    const parseTimeToISO = (timeStr: string): string => {
      if (!timeStr) return '00:00';
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return '00:00';
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const period = match[3].toUpperCase();
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    };

    // Build valid ISO datetime strings (e.g. "2026-02-15T09:00")
    const startISO = `${startDate}T${parseTimeToISO(startTime)}`;
    const endISO = endDate
      ? `${endDate}T${parseTimeToISO(endTime || startTime)}`
      : `${startDate}T${parseTimeToISO(endTime || startTime)}`;

    // Use temporary ID - parent component will replace with proper J-XXX format
    const jobId = `temp-${Date.now()}`;
    
    // Calculate duration
    const duration = '2h 0min';

    // Build display address
    const jobAddress = addressInput.trim() || (selectedClient ? `${selectedClient.name}'s location` : 'No address');
    
    // Create full Job object
    const newJobData = {
      id: jobId,
      tags: jobTags,
      client: selectedClient?.name || initialData?.clientName || 'Client',
      clientEmail: selectedClient?.email || initialData?.clientEmail || 'no-email@example.com',
      clientPhone: selectedClient?.phone || initialData?.clientPhone || '(000) 000-0000',
      jobType: jobType || 'Service',
      jobStatus: 'Scheduled' as const,
      duration: duration,
      scheduled: `${startDate} ${startTime || '12:00 AM'}`,
      scheduledStart: startISO,
      scheduledEnd: endISO,
      tech: selectedTeamMembers.join(', ') || 'Unassigned',
      address: jobAddress,
      jobDescription: jobDescription || 'No description',
      jobSource: jobSource || 'Schedule',
      techNotes: '',
      isNew: false,
      hasUpsell: selectedInventoryItems.some(item => item.isUpsell),
      arrivedLate: false,
      scheduledByStaff: true,
      isAllDay: false,
      servicePlanId: initialData?.servicePlanId,
    };

    onSubmit(newJobData);
    onClose();
    // Reset form after closing to avoid state conflicts
    setTimeout(() => {
      resetForm();
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] w-full max-w-xl border border-[#e2e8f0] overflow-hidden">
        <div className="max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-[#051046]">New Job</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#051046]" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Client Details */}
            <div ref={clientInputRef}>
              <label className="block text-sm font-semibold text-[#051046] mb-2">Client Details</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Client Name"
                  value={clientSearchTerm}
                  onChange={(e) => handleClientSearch(e.target.value)}
                  onFocus={() => {
                    if (clientSearchTerm && filteredClients.length > 0) {
                      setShowClientDropdown(true);
                    }
                  }}
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                
                {/* Autocomplete Dropdown */}
                {showClientDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e8e8e8] rounded-[15px] shadow-lg z-30 max-h-60 overflow-y-auto">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <div
                          key={client.id}
                          onClick={() => handleSelectClient(client)}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="text-sm font-medium text-[#051046]">{client.name}</div>
                          <div className="text-xs text-gray-500">{client.email}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No client found in the database with this name.
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button 
                type="button"
                onClick={onAddClientClick}
                className="mt-1 text-xs hover:underline"
                style={{ color: '#9473ff' }}
              >
                + Add Client
              </button>
            </div>

            {/* Service Location */}
            <div>
              <label className="block text-sm font-semibold text-[#051046] mb-2">Service Location</label>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Address"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            {/* Job Details */}
            <div>
              <label className="block text-sm font-semibold text-[#051046] mb-2">Job Details</label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Job type</label>
                  <select 
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Job type</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <button 
                    type="button"
                    onClick={() => onCustomValueModalOpen({ isOpen: true, type: 'jobType', title: 'Add New Job Type' })}
                    className="mt-1 text-xs hover:underline"
                    style={{ color: '#9473ff' }}
                  >
                    + Add Job Type
                  </button>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Job source</label>
                  <select 
                    value={jobSource}
                    onChange={(e) => setJobSource(e.target.value)}
                    className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Choose an option...</option>
                    {jobSources.map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                  <button 
                    type="button"
                    onClick={() => onCustomValueModalOpen({ isOpen: true, type: 'jobSource', title: 'Add New Job Source' })}
                    className="mt-1 text-xs hover:underline"
                    style={{ color: '#9473ff' }}
                  >
                    + Add Job Source
                  </button>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Job description</label>
                  <textarea
                    placeholder="Description"
                    rows={3}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
            </div>

            {/* Add service or product */}
            <div className="relative">
              <label className="block text-sm font-semibold text-[#051046] mb-2">Add service or product</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  onFocus={() => setShowInventoryDropdown(true)}
                  className="w-full px-4 py-2 pr-10 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Searchable Dropdown */}
              {showInventoryDropdown && (
                <>
                  {/* Overlay backdrop */}
                  <div 
                    className="fixed inset-0 z-10 md:hidden bg-black bg-opacity-50" 
                    onClick={() => {
                      setShowInventoryDropdown(false);
                      setInventorySearch('');
                    }}
                  />
                  <div 
                    className="hidden md:block fixed inset-0 z-10" 
                    onClick={() => setShowInventoryDropdown(false)}
                  />
                  
                  {/* Desktop Dropdown */}
                  <div className="hidden md:block absolute z-20 w-full mt-1 bg-white border border-[#e2e8f0] rounded-[20px] shadow-lg max-h-80 overflow-y-auto"
                    style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 4px 16px 2px' }}
                  >
                    {filteredInventory.length > 0 ? (
                      <div className="py-2">
                        {filteredInventory.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleAddInventoryItem(item)}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-medium text-[#051046] break-words">{item.name}</span>
                                  <span className={`px-3 py-1 rounded text-xs font-medium ${
                                    item.type === 'part' 
                                      ? 'bg-[#A6E4FA] text-[#399deb]' 
                                      : 'bg-[#E2F685] text-green-700'
                                  }`}>
                                    {item.type === 'part' ? 'Part' : 'Service'}
                                  </span>
                                </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[12px] text-[#6a7282]">
                                      {item.taxable ? 'Taxable' : 'Non-taxable'}
                                    </span>
                                  </div>
                              </div>
                              <span className="text-sm font-semibold text-[#9473ff] whitespace-nowrap flex-shrink-0">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">
                        No items found matching "{inventorySearch}"
                      </div>
                    )}
                  </div>
                  
                  {/* Mobile/Tablet Modal */}
                  <div className="md:hidden fixed inset-0 z-20 bg-white flex flex-col">
                    {/* Modal Header with Search */}
                    <div className="sticky top-0 bg-white border-b border-[#e2e8f0] px-4 py-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <button
                          onClick={() => {
                            setShowInventoryDropdown(false);
                            setInventorySearch('');
                          }}
                          className="text-[#051046] hover:text-[#9473ff]"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold text-[#051046]">Search Inventory</h2>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search products or services..."
                          value={inventorySearch}
                          onChange={(e) => setInventorySearch(e.target.value)}
                          autoFocus
                          className="w-full px-4 py-3 pr-10 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    {/* Modal Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto">
                      {filteredInventory.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {filteredInventory.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleAddInventoryItem(item)}
                              className="px-4 py-4 active:bg-gray-100 cursor-pointer transition-colors"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start gap-2 flex-wrap mb-2">
                                    <span className="text-base font-medium text-[#051046] break-words leading-tight">{item.name}</span>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                                      item.type === 'part' 
                                        ? 'bg-[#A6E4FA] text-[#399deb]' 
                                        : 'bg-[#E2F685] text-green-700'
                                    }`}>
                                      {item.type === 'part' ? 'Part' : 'Service'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[12px] text-[#6a7282]">
                                      {item.taxable ? 'Taxable' : 'Non-taxable'}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-base font-semibold text-[#9473ff] whitespace-nowrap flex-shrink-0">
                                  ${item.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64">
                          <Search className="w-12 h-12 text-gray-300 mb-3" />
                          <p className="text-gray-500 text-center px-4">
                            {inventorySearch ? (
                              <>No items found matching "<span className="font-semibold">{inventorySearch}</span>"</>
                            ) : (
                              'Start typing to search inventory...'
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              <button 
                type="button"
                onClick={() => setIsAddInventoryModalOpen(true)}
                className="mt-1 text-xs hover:underline"
                style={{ color: '#9473ff' }}
              >
                + Add Service or Product
              </button>
              
              {/* Selected Items Table */}
              {selectedInventoryItems.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                  <div className="min-w-[640px]">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Description</th>
                          <th className="text-center py-2 text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Upsell</th>
                          <th className="text-center py-2 text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Quantity</th>
                          <th className="text-right py-2 text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Price</th>
                          <th className="text-right py-2 text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Total</th>
                          <th className="text-center py-2 text-xs font-semibold text-[#6a7282] uppercase tracking-wider w-16">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInventoryItems.map((item) => (
                          <tr key={item.id} className="border-b border-gray-100">
                            <td className="py-2 text-[#051046]">{item.description}</td>
                            <td className="py-2 text-center">
                              <input
                                type="checkbox"
                                checked={item.isUpsell}
                                onChange={() => handleUpsellToggle(item.id)}
                                className="w-4 h-4 accent-purple-600"
                              />
                            </td>
                            <td className="py-2 text-center">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                min="1"
                                disabled={item.type === 'service'}
                                className={`w-16 px-2 py-1 border border-[#e8e8e8] rounded-[8px] text-center text-[#051046] ${
                                  item.type === 'service' ? 'bg-gray-50 cursor-not-allowed' : ''
                                }`}
                              />
                            </td>
                            <td className="py-2 text-right">
                              <div className="flex items-center justify-end">
                                <span className="text-[#051046] mr-1">$</span>
                                <input
                                  type="number"
                                  value={item.price.toFixed(2)}
                                  onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                  step="0.01"
                                  min="0"
                                  className="w-20 px-2 py-1 border border-[#e8e8e8] rounded-[8px] text-right text-[#051046]"
                                />
                              </div>
                            </td>
                            <td className="py-2 text-right font-semibold text-[#051046]">
                              ${(item.quantity * item.price).toFixed(2)}
                            </td>
                            <td className="py-2 text-center">
                              <button 
                                onClick={() => handleRemoveInventoryItem(item.id)}
                                className="hover:opacity-80 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4" style={{ color: '#f16a6a' }} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Scheduled (Arrival window) */}
            <div>
              <label className="block text-sm font-semibold text-[#051046] mb-2">Scheduled (Arrival window)</label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Starts</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      placeholder="Fri Feb 13, 2026"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      <option value="">Select time...</option>
                      <option value="12:00 AM">12:00 AM</option>
                      <option value="12:30 AM">12:30 AM</option>
                      <option value="1:00 AM">1:00 AM</option>
                      <option value="1:30 AM">1:30 AM</option>
                      <option value="2:00 AM">2:00 AM</option>
                      <option value="2:30 AM">2:30 AM</option>
                      <option value="3:00 AM">3:00 AM</option>
                      <option value="3:30 AM">3:30 AM</option>
                      <option value="4:00 AM">4:00 AM</option>
                      <option value="4:30 AM">4:30 AM</option>
                      <option value="5:00 AM">5:00 AM</option>
                      <option value="5:30 AM">5:30 AM</option>
                      <option value="6:00 AM">6:00 AM</option>
                      <option value="6:30 AM">6:30 AM</option>
                      <option value="7:00 AM">7:00 AM</option>
                      <option value="7:30 AM">7:30 AM</option>
                      <option value="8:00 AM">8:00 AM</option>
                      <option value="8:30 AM">8:30 AM</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="9:30 AM">9:30 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="12:30 PM">12:30 PM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="1:30 PM">1:30 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="2:30 PM">2:30 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="3:30 PM">3:30 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="4:30 PM">4:30 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                      <option value="5:30 PM">5:30 PM</option>
                      <option value="6:00 PM">6:00 PM</option>
                      <option value="6:30 PM">6:30 PM</option>
                      <option value="7:00 PM">7:00 PM</option>
                      <option value="7:30 PM">7:30 PM</option>
                      <option value="8:00 PM">8:00 PM</option>
                      <option value="8:30 PM">8:30 PM</option>
                      <option value="9:00 PM">9:00 PM</option>
                      <option value="9:30 PM">9:30 PM</option>
                      <option value="10:00 PM">10:00 PM</option>
                      <option value="10:30 PM">10:30 PM</option>
                      <option value="11:00 PM">11:00 PM</option>
                      <option value="11:30 PM">11:30 PM</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Ends</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      placeholder="Fri Feb 13, 2026"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      <option value="">Select time...</option>
                      <option value="12:00 AM">12:00 AM</option>
                      <option value="12:30 AM">12:30 AM</option>
                      <option value="1:00 AM">1:00 AM</option>
                      <option value="1:30 AM">1:30 AM</option>
                      <option value="2:00 AM">2:00 AM</option>
                      <option value="2:30 AM">2:30 AM</option>
                      <option value="3:00 AM">3:00 AM</option>
                      <option value="3:30 AM">3:30 AM</option>
                      <option value="4:00 AM">4:00 AM</option>
                      <option value="4:30 AM">4:30 AM</option>
                      <option value="5:00 AM">5:00 AM</option>
                      <option value="5:30 AM">5:30 AM</option>
                      <option value="6:00 AM">6:00 AM</option>
                      <option value="6:30 AM">6:30 AM</option>
                      <option value="7:00 AM">7:00 AM</option>
                      <option value="7:30 AM">7:30 AM</option>
                      <option value="8:00 AM">8:00 AM</option>
                      <option value="8:30 AM">8:30 AM</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="9:30 AM">9:30 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="12:30 PM">12:30 PM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="1:30 PM">1:30 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="2:30 PM">2:30 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="3:30 PM">3:30 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="4:30 PM">4:30 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                      <option value="5:30 PM">5:30 PM</option>
                      <option value="6:00 PM">6:00 PM</option>
                      <option value="6:30 PM">6:30 PM</option>
                      <option value="7:00 PM">7:00 PM</option>
                      <option value="7:30 PM">7:30 PM</option>
                      <option value="8:00 PM">8:00 PM</option>
                      <option value="8:30 PM">8:30 PM</option>
                      <option value="9:00 PM">9:00 PM</option>
                      <option value="9:30 PM">9:30 PM</option>
                      <option value="10:00 PM">10:00 PM</option>
                      <option value="10:30 PM">10:30 PM</option>
                      <option value="11:00 PM">11:00 PM</option>
                      <option value="11:30 PM">11:30 PM</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-red-500">
                  End Date cannot be earlier or equal than Start Date. Please select a valid End Date.
                </p>
              </div>
            </div>

            {/* Assign Team Members */}
            <div>
              <label className="block text-sm font-semibold text-[#051046] mb-2">Assign Team Members</label>
              <div className="relative">
                <div 
                  onClick={() => setIsTeamMemberDropdownOpen(!isTeamMemberDropdownOpen)}
                  className="w-full min-h-[40px] px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm cursor-pointer bg-white flex flex-wrap gap-2 items-center hover:border-[#9473ff] transition-colors"
                >
                  {selectedTeamMembers.length > 0 ? (
                    selectedTeamMembers.map((member, index) => (
                      <span key={index} className="px-2 py-0.5 bg-gray-200 text-[#051046] text-xs rounded flex items-center gap-1">
                        {member}
                        <X 
                          className="w-3 h-3 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTeamMembers(selectedTeamMembers.filter((_, i) => i !== index));
                          }}
                        />
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">Choose team options...</span>
                  )}
                </div>
                {isTeamMemberDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e8e8e8] rounded-[15px] shadow-lg z-10 max-h-60 overflow-y-auto">
                    {['Mike Bailey', 'John Tom', 'Sarah Wilson', 'David Chen']
                      .filter(member => !selectedTeamMembers.includes(member))
                      .map((member, index) => {
                        // Mock distance data (in real app, this would be calculated from tech's current location)
                        const distanceInfo: { [key: string]: string } = {
                          'Mike Bailey': '5 min away',
                          'John Tom': '24 min away',
                          'Sarah Wilson': '12 min away',
                          'David Chen': 'Double Booked'
                        };
                        
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedTeamMembers([...selectedTeamMembers, member]);
                              setIsTeamMemberDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-[#051046] hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                          >
                            <span className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: teamMemberBusyStatus[member] }}></span>
                            <span className="flex items-center gap-2 flex-1">
                              {member} - {distanceInfo[member]}
                            </span>
                          </button>
                        );
                      })}
                    {selectedTeamMembers.length === 4 && (
                      <div className="px-4 py-2.5 text-sm text-gray-400 text-center">
                        All team members selected
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-[#051046] mb-2">Tags</label>
              <div className="relative">
                <div 
                  onClick={() => setIsJobTagDropdownOpen(!isJobTagDropdownOpen)}
                  className="w-full min-h-[40px] px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm cursor-pointer focus-within:ring-2 focus-within:ring-purple-600 flex flex-wrap gap-2 items-center"
                >
                  {jobTags.length > 0 ? (
                    jobTags.map(tag => (
                      <span key={tag} className="inline-flex items-center bg-gray-200 text-[#051046] text-xs px-2.5 py-1 rounded-md">
                        ×{tag}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveJobTag(tag);
                          }}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-[#051046]">Choose some options...</span>
                  )}
                </div>
                {isJobTagDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsJobTagDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e8e8e8] rounded-[15px] shadow-lg z-20">
                      {availableTags.map(tag => (
                        <div 
                          key={tag} 
                          onClick={() => handleJobTagToggle(tag)}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                        >
                          <input
                            type="checkbox"
                            checked={jobTags.includes(tag)}
                            onChange={() => {}}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-600 pointer-events-none"
                          />
                          <span className="ml-2 text-sm text-[#051046]">{tag}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <button 
                type="button"
                onClick={() => onCustomValueModalOpen({ isOpen: true, type: 'tags', title: 'Add New Tag' })}
                className="mt-1 text-xs hover:underline"
                style={{ color: '#9473ff' }}
              >
                + Add Tag
              </button>
            </div>

            {/* Note */}
            <div className="bg-gray-100 rounded-[15px] p-4">
              <p className="text-xs text-[#051046] leading-relaxed">
                <span className="font-semibold">Note:</span> You can change team member color threshold for less busy, medium busy and very busy from settings. <span className="font-semibold">Important:</span> To avoid double-booking or work overload, always set the appointment limit before assigning a technician.
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="sticky bottom-0 bg-white border-t border-[#e2e8f0] px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-[#051046] border border-[#e8e8e8] hover:bg-gray-50 rounded-[32px] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-8 py-2 text-white rounded-[32px] transition-colors ${
                selectedTeamMembers.length > 0 && startDate
                  ? 'bg-[#9473ff] hover:bg-[#7f5fd9]' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              disabled={selectedTeamMembers.length === 0 || !startDate}
            >
              Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Add Inventory Item Modal */}
      <AddPartOrServiceModal
        isOpen={isAddInventoryModalOpen}
        onClose={() => setIsAddInventoryModalOpen(false)}
        onSave={handleAddCustomInventoryItem}
      />
    </div>
  );
}
