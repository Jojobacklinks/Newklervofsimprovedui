import { useState } from 'react';
import { Search, Plus, User, TrendingUp, TrendingDown, Users, Clock, ChevronDown } from 'lucide-react';
import { AddLeadModal } from '../components/AddLeadModal';
import { LeadDetailModal } from '../components/LeadDetailModal';

interface Lead {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  address?: string;
  serviceType: string;
  value: number;
  stage: 'New' | 'Contacted' | 'Price Shared' | 'Follow-Up' | 'Won' | 'Lost';
  priority: 'High' | 'Medium' | 'Low';
  daysInStage: number;
  avatar: string;
  estimatedValue: number;
  leadSource: string;
  activityTimeline: Array<{
    id: string;
    type: 'email' | 'call' | 'note' | 'stage_change' | 'price_shared' | 'converted' | 'payment';
    description: string;
    timestamp: string;
    user?: string;
  }>;
  notes: string;
  createdDate: string;
}

// Mock data for leads
const mockLeads: Lead[] = [
  {
    id: '1',
    clientName: 'Michael Roberts',
    email: 'michael.roberts@email.com',
    phone: '123-456-7890',
    address: '123 Main St, Anytown, USA',
    serviceType: 'HVAC Installation',
    value: 8500,
    stage: 'New',
    priority: 'High',
    daysInStage: 1,
    avatar: 'MR',
    estimatedValue: 9000,
    leadSource: 'Referral',
    activityTimeline: [
      {
        id: '1',
        type: 'email',
        description: 'Initial contact email sent',
        timestamp: '2023-10-01T10:00:00Z',
        user: 'John Tom',
      },
    ],
    notes: 'Client is interested in a new HVAC system for their home.',
    createdDate: '2023-10-01T10:00:00Z',
  },
  {
    id: '2',
    clientName: 'Sarah Martinez',
    email: 'sarah.martinez@email.com',
    phone: '987-654-3210',
    address: '456 Elm St, Othertown, USA',
    serviceType: 'Plumbing Repair',
    value: 1200,
    stage: 'Contacted',
    priority: 'Medium',
    daysInStage: 2,
    avatar: 'SM',
    estimatedValue: 1500,
    leadSource: 'Online Ad',
    activityTimeline: [
      {
        id: '2',
        type: 'call',
        description: 'Initial phone call to discuss plumbing issues',
        timestamp: '2023-10-02T14:00:00Z',
        user: 'John Tom',
      },
    ],
    notes: 'Client has a leaky faucet and needs it repaired.',
    createdDate: '2023-10-02T14:00:00Z',
  },
  {
    id: '3',
    clientName: 'David Chen',
    email: 'david.chen@email.com',
    phone: '555-123-4567',
    address: '789 Oak St, Thirtown, USA',
    serviceType: 'Electrical Panel Upgrade',
    value: 4500,
    stage: 'Price Shared',
    priority: 'High',
    daysInStage: 1,
    avatar: 'DC',
    estimatedValue: 5000,
    leadSource: 'Trade Show',
    activityTimeline: [
      {
        id: '3',
        type: 'price_shared',
        description: 'Price details shared via email',
        timestamp: '2023-10-03T09:00:00Z',
        user: 'John Tom',
      },
    ],
    notes: 'Client is considering upgrading their electrical panel.',
    createdDate: '2023-10-03T09:00:00Z',
  },
  {
    id: '4',
    clientName: 'Jennifer Wilson',
    email: 'jennifer.wilson@email.com',
    phone: '555-987-6543',
    address: '101 Pine St, Fourtown, USA',
    serviceType: 'Roofing Replacement',
    value: 15000,
    stage: 'Follow-Up',
    priority: 'High',
    daysInStage: 3,
    avatar: 'JW',
    estimatedValue: 16000,
    leadSource: 'Cold Call',
    activityTimeline: [
      {
        id: '4',
        type: 'stage_change',
        description: 'Lead moved to Follow-Up stage',
        timestamp: '2023-10-04T11:00:00Z',
        user: 'John Tom',
      },
    ],
    notes: 'Client is interested in a new roof but needs more information.',
    createdDate: '2023-10-04T11:00:00Z',
  },
  {
    id: '5',
    clientName: 'Robert Thompson',
    email: 'robert.thompson@email.com',
    phone: '555-555-5555',
    address: '202 Maple St, Fivetown, USA',
    serviceType: 'Landscaping',
    value: 6800,
    stage: 'Won',
    priority: 'Medium',
    daysInStage: 5,
    avatar: 'RT',
    estimatedValue: 7000,
    leadSource: 'Referral',
    activityTimeline: [
      {
        id: '5',
        type: 'converted',
        description: 'Lead converted to a customer',
        timestamp: '2023-10-05T13:00:00Z',
        user: 'John Tom',
      },
    ],
    notes: 'Client hired us for landscaping services.',
    createdDate: '2023-10-05T13:00:00Z',
  },
  {
    id: '6',
    clientName: 'Amanda Lee',
    email: 'amanda.lee@email.com',
    phone: '555-111-2222',
    address: '303 Birch St, Sixtown, USA',
    serviceType: 'HVAC Maintenance',
    value: 3200,
    stage: 'Lost',
    priority: 'Low',
    daysInStage: 2,
    avatar: 'AL',
    estimatedValue: 3500,
    leadSource: 'Online Ad',
    activityTimeline: [
      {
        id: '6',
        type: 'stage_change',
        description: 'Lead moved to Lost stage',
        timestamp: '2023-10-06T08:00:00Z',
        user: 'John Tom',
      },
    ],
    notes: 'Client decided to go with a different contractor.',
    createdDate: '2023-10-06T08:00:00Z',
  },
];

const LEAD_STAGES: Array<'New' | 'Contacted' | 'Price Shared' | 'Follow-Up' | 'Won' | 'Lost'> = [
  'New',
  'Contacted',
  'Price Shared',
  'Follow-Up',
  'Won',
  'Lost',
];

export function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Calculate metrics
  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, l) => sum + l.value, 0);
  const wonLeads = leads.filter((l) => l.stage === 'Won').length;
  const lostLeads = leads.filter((l) => l.stage === 'Lost').length;
  const activeLeads = leads.filter((l) => !['Won', 'Lost'].includes(l.stage)).length;
  const activeValue = leads.filter((l) => !['Won', 'Lost'].includes(l.stage)).reduce((sum, l) => sum + l.value, 0);
  const winRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0.0';
  const lostRate = totalLeads > 0 ? ((lostLeads / totalLeads) * 100).toFixed(1) : '0.0';

  // Filter leads based on search
  const filteredLeads = leads.filter((lead) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      lead.clientName.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.serviceType.toLowerCase().includes(searchLower)
    );
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'Medium':
        return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'Low':
        return 'bg-green-50 text-green-600 border-green-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'New':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Contacted':
        return 'bg-cyan-50 text-cyan-600 border-cyan-200';
      case 'Price Shared':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'Follow-Up':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'Won':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Lost':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'from-purple-500 to-purple-600',
      'from-blue-500 to-blue-600',
      'from-pink-500 to-pink-600',
      'from-orange-500 to-orange-600',
      'from-green-500 to-green-600',
      'from-teal-500 to-teal-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleStageChange = (leadId: string, newStage: 'New' | 'Contacted' | 'Price Shared' | 'Follow-Up' | 'Won' | 'Lost') => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) => {
        if (lead.id === leadId) {
          // Add activity timeline entry for stage change
          const newActivity = {
            id: `activity-${Date.now()}`,
            type: 'stage_change' as const,
            description: `Stage changed to ${newStage}`,
            timestamp: new Date().toISOString(),
            user: 'Current User' // This would come from auth context in real app
          };
          
          return {
            ...lead,
            stage: newStage,
            activityTimeline: [newActivity, ...lead.activityTimeline]
          };
        }
        return lead;
      })
    );
    
    // Update selectedLead if it's the one being changed
    if (selectedLead && selectedLead.id === leadId) {
      const newActivity = {
        id: `activity-${Date.now()}`,
        type: 'stage_change' as const,
        description: `Stage changed to ${newStage}`,
        timestamp: new Date().toISOString(),
        user: 'Current User'
      };
      
      setSelectedLead({
        ...selectedLead,
        stage: newStage,
        activityTimeline: [newActivity, ...selectedLead.activityTimeline]
      });
    }
    
    setOpenDropdownId(null);
  };

  const handleAddLead = (newLead: Omit<Lead, 'id' | 'daysInStage' | 'createdDate' | 'avatar' | 'value'>) => {
    const leadWithMetadata: Lead = {
      ...newLead,
      id: Date.now().toString(),
      daysInStage: 0,
      createdDate: new Date().toISOString(),
      avatar: newLead.clientName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      value: newLead.estimatedValue,
    };
    setLeads([leadWithMetadata, ...leads]);
    setIsAddLeadModalOpen(false);
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[#9810fa] text-sm mb-1">Hello, John Tom</p>
        <h1 className="text-2xl font-semibold text-[#101828] mb-1">Leads</h1>
        <p className="text-sm text-[#4a5565]">Manage and track your leads</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Leads */}
        <div
          className="rounded-[20px] border border-[#e2e8f0] p-6 bg-[#F8EFFF]"
          style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
        >
          <p className="text-sm text-gray-600 mb-2">Total Leads</p>
          <p className="text-3xl font-bold text-[#051046] mb-1">{totalLeads}</p>
          <p className="text-xs text-gray-500">Total Value: ${totalValue.toLocaleString()}</p>
        </div>

        {/* Win Rate */}
        <div
          className="rounded-[20px] border border-[#e2e8f0] p-6"
          style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px', backgroundColor: '#A6E4FA' }}
        >
          <p className="text-sm text-gray-700 mb-2">Win Rate</p>
          <p className="text-3xl font-bold text-[#051046] mb-1">{winRate}%</p>
          <p className="text-xs text-gray-600">Won: {wonLeads}/{totalLeads}</p>
        </div>

        {/* Lost Rate */}
        <div
          className="rounded-[20px] border border-[#e2e8f0] p-6"
          style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px', backgroundColor: '#FFDBE6' }}
        >
          <p className="text-sm text-gray-700 mb-2">Lost Rate</p>
          <p className="text-3xl font-bold text-[#051046] mb-1">{lostRate}%</p>
          <p className="text-xs text-gray-600">Lost: {lostLeads}/{totalLeads}</p>
        </div>

        {/* Active Leads */}
        <div
          className="rounded-[20px] border border-[#e2e8f0] p-6"
          style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px', backgroundColor: '#E2F685' }}
        >
          <p className="text-sm text-gray-700 mb-2">Active Leads</p>
          <p className="text-3xl font-bold text-[#051046] mb-1">{activeLeads}</p>
          <p className="text-xs text-gray-600">Active Value: ${activeValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Search Bar and Add Lead Button */}
      <div
        className="flex items-center gap-4 mb-8 bg-white rounded-[20px] border border-[#e2e8f0] p-6"
        style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#051046] bg-white"
          />
        </div>
        <button
          className="ml-auto px-6 py-2.5 bg-[#9810fa] text-white rounded-[15px] hover:bg-[#8610d8] transition-colors flex items-center gap-2"
          onClick={() => setIsAddLeadModalOpen(true)}
        >
          <Plus className="w-5 h-5" />
          Add Lead
        </button>
      </div>

      {/* Pipeline Visualization */}
      <div
        className="rounded-[20px] mb-8 p-[5px]"
      >
        <h2 className="text-xs font-semibold text-[#051046] mb-4 text-center">Lead Pipeline</h2>
        <div className="flex items-center justify-center gap-3 flex-wrap text-xs">
          <span className="text-blue-600 font-medium">New</span>
          <span className="text-gray-400">→</span>
          <span className="text-cyan-600 font-medium">Contacted</span>
          <span className="text-gray-400">→</span>
          <span className="text-green-600 font-medium">Price Shared</span>
          <span className="text-gray-400">→</span>
          <span className="text-orange-600 font-medium">Follow-Up</span>
          <span className="text-gray-400">→</span>
          <span className="text-purple-600 font-medium">Won</span>
          <span className="text-gray-400">/</span>
          <span className="text-red-600 font-medium">Lost</span>
        </div>
      </div>

      {/* Leads Table */}
      <div
        className="bg-white rounded-[20px] border border-[#e2e8f0] overflow-hidden"
        style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[#e2e8f0]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Days
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleLeadClick(lead)}
                >
                  {/* Client Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"
                      >
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-[#051046]">{lead.clientName}</p>
                        <p className="text-sm text-gray-500">{lead.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Service Column */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#051046]">{lead.serviceType}</p>
                  </td>

                  {/* Value Column */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#10b981]">
                      $ {lead.value.toLocaleString()}
                    </p>
                  </td>

                  {/* Stage Column with Dropdown */}
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === lead.id ? null : lead.id);
                        }}
                        className={`px-3 py-1.5 rounded-[15px] text-xs font-medium border flex items-center gap-2 ${getStageColor(
                          lead.stage
                        )} hover:opacity-80 transition-opacity`}
                      >
                        {lead.stage}
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      {openDropdownId === lead.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenDropdownId(null)}
                          />
                          <div
                            className="absolute top-full left-0 mt-1 w-40 bg-white border border-[#e2e8f0] rounded-[15px] shadow-lg z-20 overflow-hidden"
                            style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
                          >
                            {LEAD_STAGES.map((stage) => (
                              <button
                                key={stage}
                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors border-b border-[#e2e8f0] last:border-b-0 ${
                                  lead.stage === stage ? 'bg-gray-50 font-medium' : ''
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStageChange(lead.id, stage);
                                }}
                              >
                                <span className={`inline-flex items-center gap-2`}>
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      stage === 'New'
                                        ? 'bg-blue-500'
                                        : stage === 'Contacted'
                                        ? 'bg-cyan-500'
                                        : stage === 'Price Shared'
                                        ? 'bg-green-500'
                                        : stage === 'Follow-Up'
                                        ? 'bg-orange-500'
                                        : stage === 'Won'
                                        ? 'bg-purple-500'
                                        : 'bg-red-500'
                                    }`}
                                  />
                                  <span className="text-[#051046]">{stage}</span>
                                </span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Priority Column */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                        lead.priority
                      )}`}
                    >
                      {lead.priority}
                    </span>
                  </td>

                  {/* Days Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{lead.daysInStage}d</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        onAddLead={handleAddLead}
      />

      {/* Lead Detail Modal */}
      <LeadDetailModal
        isOpen={selectedLead !== null}
        onClose={() => setSelectedLead(null)}
        lead={selectedLead}
        onUpdateStage={handleStageChange}
      />
    </div>
  );
}
