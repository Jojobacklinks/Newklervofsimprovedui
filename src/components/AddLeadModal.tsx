import { X, Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Lead } from './LeadCard';
import { DeveloperNotesPopup } from './DeveloperNotesPopup';
import { AddCustomValueModal } from './AddCustomValueModal';
import { AddClientModal } from './AddClientModal';

const teamMemberBusyStatus: { [key: string]: string } = {
  'Mike Bailey': '#b9df10',
  'John Tom': '#f0a041',
  'Sarah Wilson': '#f16a6a',
  'David Chen': '#f16a6a',
};

const teamMemberAvailability: { [key: string]: string } = {
  'Mike Bailey': '5 min away',
  'John Tom': '24 min away',
  'Sarah Wilson': '12 min away',
  'David Chen': 'Double Booked',
};

// Mock client database for autocomplete
const mockClientDatabase = [
  { id: '1', name: 'John Smith', email: 'john.smith@email.com', phone: '(555) 123-4567', address: '123 Main Street, Springfield, IL 62701' },
  { id: '2', name: 'John Smith', email: 'johnsmith99@gmail.com', phone: '(555) 987-6543', address: '456 Oak Avenue, Chicago, IL 60614' },
  { id: '3', name: 'Sarah Johnson', email: 'sarah.j@company.com', phone: '(555) 234-5678', address: '789 Pine Road, Naperville, IL 60540' },
  { id: '4', name: 'Michael Chen', email: 'mchen@business.com', phone: '(555) 345-6789', address: '321 Elm Street, Aurora, IL 60506' },
  { id: '5', name: 'Emily Davis', email: 'emily.davis@home.net', phone: '(555) 456-7890', address: '654 Maple Drive, Peoria, IL 61602' },
  { id: '6', name: 'Robert Williams', email: 'rwilliams@email.com', phone: '(555) 567-8901', address: '987 Cedar Lane, Rockford, IL 61101' },
  { id: '7', name: 'Jennifer Martinez', email: 'jmartinez@company.org', phone: '(555) 678-9012', address: '246 Birch Court, Champaign, IL 61820' },
];

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Omit<Lead, 'id' | 'daysInStage' | 'createdDate'>) => void;
}

export function AddLeadModal({ isOpen, onClose, onAddLead }: AddLeadModalProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    address: '',
    serviceType: 'HVAC',
    estimatedValue: '',
    priority: 'Medium' as Lead['priority'],
    stage: 'New' as Lead['stage'],
    leadSource: 'Website',
    customLeadSource: '',
    notes: '',
    activityTimeline: [] as Lead['activityTimeline'],
  });
  const [showDevNotes, setShowDevNotes] = useState(false);
  const [schedulingEnabled, setSchedulingEnabled] = useState(false);
  const [schedulingData, setSchedulingData] = useState({
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    assignedTeamMembers: [] as string[],
    dontSendEmailToCustomer: false,
  });

  // Custom value modal state
  const [customValueModal, setCustomValueModal] = useState<{
    isOpen: boolean;
    type: 'jobType' | 'leadSource' | null;
    title: string;
  }>({
    isOpen: false,
    type: null,
    title: '',
  });

  // Client autocomplete state
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<typeof mockClientDatabase[0] | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [filteredClients, setFilteredClients] = useState<typeof mockClientDatabase>([]);
  const clientInputRef = useRef<HTMLDivElement>(null);
  const [isTeamMemberDropdownOpen, setIsTeamMemberDropdownOpen] = useState(false);

  // Add Client Modal state
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  // Job types list
  const [jobTypes, setJobTypes] = useState([
    'HVAC',
    'Plumbing',
    'Electrical',
    'Roofing',
    'Landscaping',
    'General Repair',
    'Painting',
    'Flooring',
  ]);

  // Lead sources list
  const [leadSources, setLeadSources] = useState([
    'Website',
    'Referral',
    'Social Media',
    'Trade Show',
  ]);

  // Client search and autocomplete
  const handleClientSearch = (value: string) => {
    setClientSearchTerm(value);
    setSelectedClient(null);
    setFormData({ ...formData, clientName: value });
    
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
    setFormData({ 
      ...formData, 
      clientName: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address
    });
    setShowClientDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientInputRef.current && !clientInputRef.current.contains(event.target as Node)) {
        setShowClientDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const formatEstimatedValueInput = (value: string) => {
    const numericValue = value.replace(/[^\d.]/g, '');

    if (!numericValue) return '';

    const [wholePart, decimalPart] = numericValue.split('.');
    const formattedWholePart = Number(wholePart || '0').toLocaleString('en-US');

    if (decimalPart !== undefined) {
      return `$${formattedWholePart}.${decimalPart.slice(0, 2)}`;
    }

    return `$${formattedWholePart}`;
  };

  const parseEstimatedValue = (value: string) => {
    return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    const finalLeadSource = formData.leadSource === 'Other (Custom)' ? formData.customLeadSource : formData.leadSource;
    
    onAddLead({
      ...formData,
      leadSource: finalLeadSource,
      estimatedValue: parseEstimatedValue(formData.estimatedValue),
      activityTimeline: [
        { id: '1', type: 'note', description: 'Lead created manually', timestamp, user: 'System' }
      ],
    });
    setFormData({
      clientName: '',
      email: '',
      phone: '',
      address: '',
      serviceType: 'HVAC',
      estimatedValue: '',
      priority: 'Medium',
      stage: 'New',
      leadSource: 'Website',
      customLeadSource: '',
      notes: '',
      activityTimeline: [],
    });
    setSchedulingEnabled(false);
    setIsTeamMemberDropdownOpen(false);
    setSchedulingData({
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      assignedTeamMembers: [],
      dontSendEmailToCustomer: false,
    });
    
    // Show developer notes BEFORE closing the modal
    setShowDevNotes(true);
  };

  const handleCloseDevNotes = () => {
    setShowDevNotes(false);
    onClose(); // Close the modal after dev notes are dismissed
  };

  const devNotesContent = (
    <div className="text-[#051046] space-y-4">
      <div>
        <div className="font-semibold mb-3">Backend Operations Triggered:</div>
        <div className="space-y-2">
          <div>✓ Status set to "New Lead" by default</div>
          <div>✓ Activity log entry created: "Lead created from {'{Lead Source}'} by [User]" with timestamp</div>
          <div>✓ Notification sent to the notification center icon</div>
          <div>✓ Notification sent to Today's Leads widget (if it is today)</div>
          <div>✓ Below Email template sent to the customer (Automation notification)</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">Template:</div>
        <div className="space-y-3 leading-relaxed">
          <div>Hello, {'{{'}<span>FirstName</span>{'}}'},</div>
          <div className="mt-3">
            Thanks for contacting {'{{'}<span>CompanyName</span>{'}}'}. We've received your request, and a member of our team will review it and get back to you shortly.
          </div>
          <div>
            If you need to share additional details or have questions, please email {'{{'}<span>CompanyEmail</span>{'}}.'}</div>
          <div className="mt-3">Best regards,<br />
            {'{{'}<span>CompanyName</span>{'}}'}
            <br />{'{{'}<span>CompanyPhone</span>{'}}'}
            <br />{'{{'}<span>CompanyWebsite</span>{'}}'}
          </div>
        </div>
      </div>

      <div>
        <div className="font-semibold mb-2">
          ✓ After 4 hours with no activity on the lead, create an auto task on the calendar for Admin only (Automation action)
        </div>
        <div className="ml-4 space-y-2">
          <div><strong>Due date:</strong> Same day, next hour. Example: Tue Feb 10, 2026 - 5:00 pm</div>
          <div><strong>Task logic:</strong></div>
          <div className="ml-4 space-y-1">
            <div>IF no activity after 4 business hours → create task</div>
            <div>IF activity happens → cancel task</div>
            <div>IF activity happens after creating the auto tasks, then remove the task from the calendar</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">Auto Task Template (appears in the note field for Add new task):</div>
        <div className="italic">
          "First outreach is pending. Contact {'{{'}<span>CustomerName</span>{'}}'}."
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-[20px] border border-[#e2e8f0] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-[#051046]">Add New Lead</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-[#051046] mb-2">
                Client Name *
              </label>
              <div ref={clientInputRef} className="relative">
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => handleClientSearch(e.target.value)}
                  onFocus={() => {
                    if (clientSearchTerm && filteredClients.length > 0) {
                      setShowClientDropdown(true);
                    }
                  }}
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Client Name"
                />
                
                {/* Autocomplete Dropdown */}
                {showClientDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e2e8f0] rounded-[15px] shadow-lg z-30 max-h-60 overflow-y-auto">
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
                onClick={() => setIsAddClientModalOpen(true)}
                className="mt-1 text-xs text-[#8b5cf6] hover:underline"
              >
                + Add Client
              </button>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#051046] mb-2">
                Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="(555) 123-4567"
              />
              {/* SMS Consent Notice */}
              <div className="mt-3 p-3 bg-gray-50 rounded-[15px] border border-gray-200">
                <div className="flex items-start gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="smsConsent"
                    className="mt-0.5 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-600"
                  />
                  <label htmlFor="smsConsent" className="text-xs text-[#051046]">
                    Customer consent obtained for service-related text messages.
                  </label>
                </div>
                <div className="text-[10px] text-gray-600 leading-relaxed">
                  <strong>Important:</strong> You are responsible for obtaining and documenting customer consent before sending text messages. Klervo does not obtain consent on your behalf. You must provide the required consent language to your customer and comply with all applicable SMS, privacy, and consumer protection laws.
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#051046] mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="john@example.com"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-[#051046] mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="123 Main St, Anytown, USA"
              />
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-[#051046] mb-2">
                Job Type *
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setCustomValueModal({ isOpen: true, type: 'jobType', title: 'Add New Job Type' })}
                className="mt-2 flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
                style={{ color: '#8b5cf6' }}
              >
                <Plus className="w-3 h-3" />
                Add Job Type
              </button>
            </div>

            {/* Estimated Value and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#051046] mb-2">
                  Estimated Value
                </label>
                <input
                  type="text"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({ ...formData, estimatedValue: formatEstimatedValueInput(e.target.value) })}
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="$5,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#051046] mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Lead['priority'] })}
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Initial Stage */}
            <div>
              <label className="block text-sm font-medium text-[#051046] mb-2">
                Initial Stage
              </label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as Lead['stage'] })}
                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Price Shared">Price Shared</option>
                <option value="Follow-Up">Follow-Up</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            {/* Lead Source */}
            <div>
              <label className="block text-sm font-medium text-[#051046] mb-2">
                Lead Source
              </label>
              <select
                value={formData.leadSource}
                onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                {leadSources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
                {formData.leadSource === 'Other (Custom)' && (
                  <option value="Other (Custom)">Other (Custom)</option>
                )}
              </select>
              {formData.leadSource !== 'Other (Custom)' && (
                <button
                  type="button"
                  onClick={() => setCustomValueModal({ isOpen: true, type: 'leadSource', title: 'Add New Lead Source' })}
                  className="mt-2 flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
                  style={{ color: '#8b5cf6' }}
                >
                  <Plus className="w-3 h-3" />
                  Add Lead Source
                </button>
              )}
            </div>

            {/* Custom Lead Source */}
            {formData.leadSource === 'Other (Custom)' && (
              <div>
                <label className="block text-sm font-medium text-[#051046] mb-2">
                  Custom Lead Source
                </label>
                <input
                  type="text"
                  value={formData.customLeadSource}
                  onChange={(e) => setFormData({ ...formData, customLeadSource: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Enter custom lead source..."
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-[#051046] mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                placeholder="Add any additional notes about this lead..."
              />
            </div>

            {/* Scheduling Toggle */}
            <div className="flex items-center justify-between py-2">
              <label className="block text-sm font-medium text-[#051046]">
                Schedule (Arrival window)
              </label>
              <button
                type="button"
                onClick={() => setSchedulingEnabled(!schedulingEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  schedulingEnabled ? 'bg-[#9473ff]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    schedulingEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Scheduling Fields - Conditionally Rendered */}
            {schedulingEnabled && (
              <div className="space-y-4 pl-4 border-l-2 border-purple-200">
                {/* Starts */}
                <div>
                  <label className="block text-sm font-medium text-[#051046] mb-2">
                    Starts
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={schedulingData.startDate}
                      onChange={(e) => setSchedulingData({ ...schedulingData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <select
                      value={schedulingData.startTime}
                      onChange={(e) => setSchedulingData({ ...schedulingData, startTime: e.target.value })}
                      className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
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

                {/* Ends */}
                <div>
                  <label className="block text-sm font-medium text-[#051046] mb-2">
                    Ends
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={schedulingData.endDate}
                      onChange={(e) => setSchedulingData({ ...schedulingData, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <select
                      value={schedulingData.endTime}
                      onChange={(e) => setSchedulingData({ ...schedulingData, endTime: e.target.value })}
                      className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
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

                {/* Assign Team Members */}
                <div>
                  <label className="block text-sm font-medium text-[#051046] mb-2">
                    Assign Team Members
                  </label>
                  <div className="relative">
                    <div 
                      onClick={() => setIsTeamMemberDropdownOpen(!isTeamMemberDropdownOpen)}
                      className="w-full min-h-[40px] px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm cursor-pointer bg-white flex flex-wrap gap-2 items-center hover:border-[#9473ff] transition-colors"
                    >
                      {/* Selected Team Members as Chips */}
                      {schedulingData.assignedTeamMembers.map((member) => (
                        <div
                          key={member}
                          className="flex items-center gap-1 bg-purple-100 text-[#051046] px-2 py-1 rounded text-xs"
                        >
                          <span>{member}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSchedulingData({
                                ...schedulingData,
                                assignedTeamMembers: schedulingData.assignedTeamMembers.filter(m => m !== member)
                              });
                            }}
                            className="text-purple-600 hover:text-purple-800 font-semibold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      
                      {schedulingData.assignedTeamMembers.length === 0 && (
                        <span className="text-gray-400">Choose team options...</span>
                      )}
                      
                      {/* Hidden Select for Adding Members */}
                      <select
                        id="teamMemberSelect"
                        value=""
                        onChange={(e) => {
                          if (e.target.value && !schedulingData.assignedTeamMembers.includes(e.target.value)) {
                            setSchedulingData({ 
                              ...schedulingData, 
                              assignedTeamMembers: [...schedulingData.assignedTeamMembers, e.target.value] 
                            });
                          }
                        }}
                        className="hidden"
                      >
                        <option value="">Select...</option>
                        <option value="Michael Johnson">Michael Johnson</option>
                        <option value="Sarah Williams">Sarah Williams</option>
                        <option value="David Anderson">David Anderson</option>
                      </select>
                    </div>
                    {isTeamMemberDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsTeamMemberDropdownOpen(false)}
                        />
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e8e8e8] rounded-[15px] shadow-lg z-20 max-h-60 overflow-y-auto">
                          {['Mike Bailey', 'John Tom', 'Sarah Wilson', 'David Chen']
                            .filter((member) => !schedulingData.assignedTeamMembers.includes(member))
                            .map((member) => (
                              <button
                                key={member}
                                type="button"
                                onClick={() => {
                                  setSchedulingData({
                                    ...schedulingData,
                                    assignedTeamMembers: [...schedulingData.assignedTeamMembers, member]
                                  });
                                  setIsTeamMemberDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-[#051046] hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                              >
                                <span className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: teamMemberBusyStatus[member] }}></span>
                                <span className="flex items-center gap-2 flex-1">
                                  {member} - {teamMemberAvailability[member]}
                                </span>
                              </button>
                            ))}
                          {schedulingData.assignedTeamMembers.length === 4 && (
                            <div className="px-4 py-2.5 text-sm text-gray-400 text-center">
                              All team members selected
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Don't Send Email Checkbox */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="dontSendEmail"
                    checked={schedulingData.dontSendEmailToCustomer}
                    onChange={(e) => setSchedulingData({ ...schedulingData, dontSendEmailToCustomer: e.target.checked })}
                    className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-600"
                  />
                  <label htmlFor="dontSendEmail" className="text-sm text-[#051046]">
                    Don't send any notifications to customer
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-[#051046] rounded-[32px] hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors text-sm font-medium"
            >
              Add Lead
            </button>
          </div>
        </form>
      </div>
      {showDevNotes && (
        <DeveloperNotesPopup
          isOpen={showDevNotes}
          title="Developer Notes - Lead Creation"
          content={devNotesContent}
          onClose={handleCloseDevNotes}
        />
      )}
      {customValueModal.isOpen && (
        <AddCustomValueModal
          isOpen={customValueModal.isOpen}
          title={customValueModal.title}
          onClose={() => setCustomValueModal({ isOpen: false, type: null, title: '' })}
          onSave={(value) => {
            if (customValueModal.type === 'jobType') {
              setJobTypes([...jobTypes, value]);
              setFormData({ ...formData, serviceType: value });
            } else if (customValueModal.type === 'leadSource') {
              setLeadSources([...leadSources, value]);
              setFormData({ ...formData, leadSource: value });
            }
          }}
        />
      )}
      {isAddClientModalOpen && (
        <AddClientModal
          isOpen={isAddClientModalOpen}
          onClose={() => setIsAddClientModalOpen(false)}
          onAddClient={(client) => {
            // Add the new client to the mock database
            const newClient = {
              id: (mockClientDatabase.length + 1).toString(),
              name: client.name,
              email: client.email,
              phone: client.phone,
              address: client.address,
            };
            mockClientDatabase.push(newClient);
            // Set the selected client to the newly added client
            setSelectedClient(newClient);
            // Close the Add Client Modal
            setIsAddClientModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
