import { useState, useEffect, useRef } from 'react';
import { Search, Plus, User, TrendingUp, TrendingDown, Users, Clock, ChevronDown, Calendar, ChevronLeft, ChevronRight, Info, X } from 'lucide-react';
import { useSearchParams, useLocation } from 'react-router';
import { AddLeadModal } from '../components/AddLeadModal';
import { LeadDetailModal } from '../components/LeadDetailModal';
import { DeveloperNotesPopup } from '../components/DeveloperNotesPopup';

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
    id: 'L-101',
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
        id: 'A-101',
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
    id: 'L-102',
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
        id: 'A-102',
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
    id: 'L-103',
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
        id: 'A-103',
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
    id: 'L-104',
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
        id: 'A-104',
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
    id: 'L-105',
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
        id: 'A-105',
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
    id: 'L-106',
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
        id: 'A-106',
        type: 'stage_change',
        description: 'Lead moved to Lost stage (Competitor)',
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

const LOST_REASON_OPTIONS = ['Price', 'Competitor', 'Scheduling', 'Communication', 'Employee'] as const;

const formatLeadId = (value: number) => `L-${value.toString().padStart(3, '0')}`;

export function LeadsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [lostReasonFilter, setLostReasonFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [filteredLeadId, setFilteredLeadId] = useState<string | null>(null);
  const [showLostReasonModal, setShowLostReasonModal] = useState(false);
  const [pendingLostLeadId, setPendingLostLeadId] = useState<string | null>(null);
  const [lostReason, setLostReason] = useState('');
  
  // Developer Notes state
  const [showDevNotes, setShowDevNotes] = useState(false);
  const [devNotesTitle, setDevNotesTitle] = useState('');
  const [devNotesContent, setDevNotesContent] = useState<React.ReactNode>(null);
  
  // Date range picker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;

  // Close date picker when clicking outside
  useEffect(() => {
    if (!isDatePickerOpen) return; // Only add listener when picker is open
    
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDatePickerOpen]);

  // Check for URL parameter to open Add Lead modal
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add-lead') {
      setIsAddLeadModalOpen(true);
      // Remove the parameter from URL
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Check for selectedLeadId in location state (from Dashboard)
  useEffect(() => {
    const state = location.state as { selectedLeadId?: string; filterByLead?: boolean } | null;
    if (state?.selectedLeadId && state?.filterByLead) {
      // Filter the list to show only this lead
      setFilteredLeadId(state.selectedLeadId);
      // Clear the state to prevent re-opening on refresh
      window.history.replaceState({}, document.title);
    } else if (state?.selectedLeadId) {
      const lead = leads.find(l => l.id === state.selectedLeadId);
      if (lead) {
        setSelectedLead(lead);
      }
      // Clear the state to prevent re-opening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, leads]);

  // Clear filteredLeadId when search query or filters change
  useEffect(() => {
    if (searchQuery || stageFilter !== 'All' || lostReasonFilter !== 'All') {
      setFilteredLeadId(null);
    }
  }, [searchQuery, stageFilter, lostReasonFilter, sortBy]);

  // Calculate metrics
  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, l) => sum + l.value, 0);
  const wonLeads = leads.filter((l) => l.stage === 'Won').length;
  const lostLeads = leads.filter((l) => l.stage === 'Lost').length;
  const activeLeads = leads.filter((l) => !['Won', 'Lost'].includes(l.stage)).length;
  const activeValue = leads.filter((l) => !['Won', 'Lost'].includes(l.stage)).reduce((sum, l) => sum + l.value, 0);
  const winRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0.0';
  const lostRate = totalLeads > 0 ? ((lostLeads / totalLeads) * 100).toFixed(1) : '0.0';

  const getLeadLostReason = (lead: Lead) => {
    const lostActivity = lead.activityTimeline.find((activity) =>
      activity.description.startsWith('Lead moved to Lost stage')
    );

    if (!lostActivity) return '';

    const match = lostActivity.description.match(/\(([^)]+)\)$/);
    return match ? match[1] : '';
  };

  const topLostReasonsText = (() => {
    const lostReasonCounts = leads
      .filter((lead) => lead.stage === 'Lost')
      .map(getLeadLostReason)
      .filter(Boolean)
      .reduce<Record<string, number>>((acc, reason) => {
        acc[reason] = (acc[reason] || 0) + 1;
        return acc;
      }, {});

    const topReasons = Object.entries(lostReasonCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([reason, count]) => `${reason} (${count})`)
      .join(', ');

    return topReasons ? `Lost: ${lostLeads}/${totalLeads} | ${topReasons}` : `Lost: ${lostLeads}/${totalLeads}`;
  })();

  // Filter leads based on search and stage
  const filteredLeads = leads.filter((lead) => {
    // If filtering by specific lead ID, show only that lead
    if (filteredLeadId) {
      return lead.id === filteredLeadId;
    }
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      lead.clientName.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.serviceType.toLowerCase().includes(searchLower);
    
    const matchesStage = stageFilter === 'All' || lead.stage === stageFilter;
    const leadLostReason = getLeadLostReason(lead);
    const matchesLostReason =
      lostReasonFilter === 'All' ||
      (lead.stage === 'Lost' && leadLostReason === lostReasonFilter);
    
    return matchesSearch && matchesStage && matchesLostReason;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      case 'date-asc':
        return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      case 'client':
        return a.clientName.localeCompare(b.clientName);
      default:
        return 0;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-[#f16a6a]';
      case 'Medium':
        return 'bg-[#f0a041]';
      case 'Low':
        return 'bg-[#b9df10]';
      default:
        return 'bg-gray-400';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'New':
        return 'bg-[#399DEB]';
      case 'Contacted':
        return 'bg-[#28BDF2]';
      case 'Price Shared':
        return 'bg-[#B9DF10]';
      case 'Follow-Up':
        return 'bg-[#F0A041]';
      case 'Won':
        return 'bg-[#9473ff]';
      case 'Lost':
        return 'bg-[#f16a6a]';
      default:
        return 'bg-gray-400';
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

  // Developer Notes Content Functions
  const getContactedDevNotes = () => (
    <div className="text-[#051046] space-y-4">
      <div>
        <div className="font-semibold mb-3">⚡ Trigger: Manual status change to "Contacted"</div>
      </div>
      
      <div>
        <div className="font-semibold mb-2">🤖 Automation Action:</div>
        <div className="space-y-2 ml-4">
          <div>• None (manual only)</div>
        </div>
      </div>

      <div>
        <div className="font-semibold mb-2">📝 System Actions:</div>
        <div className="space-y-2 ml-4">
          <div>✓ Log activity in timeline: "Stage changed to Contacted" with timestamp and user</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">⚠️ Guardrails:</div>
        <div className="space-y-2 ml-4">
          <div>• Only auto-move from "New" status</div>
          <div>• Don't auto-move if status is already: Scheduled / Pricing Discussed / Won / Lost</div>
          <div>• Manual status changes override automation</div>
        </div>
      </div>
    </div>
  );

  const getPriceSharedDevNotes = () => (
    <div className="text-[#051046] space-y-4">
      <div>
        <div className="font-semibold mb-3">⚡ Trigger: Manual status change to "Price Shared"</div>
      </div>
      
      <div>
        <div className="font-semibold mb-2">🤖 Automation Action:</div>
        <div className="space-y-2 ml-4">
          <div>• If lead status is "New" or "Contacted" → set to "Price Shared"</div>
          <div>• If lead status is "Price Shared", "Follow-Up", "Won", or "Lost" → do nothing</div>
        </div>
      </div>

      <div>
        <div className="font-semibold mb-2">📝 System Actions:</div>
        <div className="space-y-2 ml-4">
          <div>✓ Log activity: "Stage changed to Price Shared" with timestamp</div>
          <div>✓ Log activity: "Estimate recorded on the job" (if applicable)</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">📱 Auto SMS Follow-Up (24 Business Hours):</div>
        <div className="space-y-2 ml-4">
          <div className="font-semibold">Trigger (ALL conditions must be true):</div>
          <div>• Lead status = "Price Shared"</div>
          <div>• Job has at least one estimate</div>
          <div>• 24 business hours have passed since estimate was sent</div>
          <div>• Estimate has not been approved or declined</div>
          <div>• No internal activity since estimate was sent</div>
          <div>• Auto SMS has not already been sent for this estimate</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">SMS Template:</div>
        <div className="italic space-y-2">
          <div>Hi {'{'}{'{'}<span>FirstName</span>{'}'}{'}'},  this is {'{'}{'{'}<span>CompanyName</span>{'}'}{'}'} . Just checking in regarding the service we discussed. If you'd like to move forward, please contact our office at {'{'}{'{'}<span>CompanyPhone</span>{'}'}{'}'} .</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">⚠️ Guardrails:</div>
        <div className="space-y-2 ml-4">
          <div>• Status only moves forward</div>
          <div>• Auto status update runs once</div>
          <div>• Maximum one auto SMS per estimate</div>
          <div>• No links in SMS</div>
          <div>• No pricing details in SMS</div>
          <div>• Do not revert status if estimate is deleted later</div>
        </div>
      </div>
    </div>
  );

  const getFollowUpDevNotes = () => (
    <div className="text-[#051046] space-y-4">
      <div>
        <div className="font-semibold mb-3">⚡ Trigger: Manual status change to "Follow-Up"</div>
      </div>
      
      <div>
        <div className="font-semibold mb-2">🤖 Automation Action:</div>
        <div className="space-y-2 ml-4">
          <div>• None (no auto stage movement)</div>
        </div>
      </div>

      <div>
        <div className="font-semibold mb-2">📝 System Actions:</div>
        <div className="space-y-2 ml-4">
          <div>✓ Log activity in timeline: "Stage changed to Follow-Up" with timestamp</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">📅 Auto Task Creation (On Enter Follow-Up):</div>
        <div className="space-y-2 ml-4">
          <div>• Create internal task (on calendar – admin only):</div>
          <div className="ml-4 italic">"Follow up with {'{'}{'{'}<span>CustomerName</span>{'}'}{'}'}  to get a decision."</div>
          <div>• <strong>Due:</strong> Next business day (configurable)</div>
          <div>✓ Log activity in timeline: "Follow-up task created" with timestamp</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">🔔 Inactivity Escalation (Notification Center Only):</div>
        <div className="space-y-2 ml-4">
          <div className="font-semibold">Trigger (ALL must be true):</div>
          <div>• Lead status = Follow-Up</div>
          <div>• 3 business days have passed since entering Follow-Up</div>
          <div>• No internal activity since entering Follow-Up</div>
          <div>• Lead is not Won or Lost</div>
          <div>• Escalation notification has not already been sent</div>
          <div className="mt-2">
            <strong>Notification:</strong> "Follow-up overdue [Number] (Deep link)"
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">⚠️ Guardrails:</div>
        <div className="space-y-2 ml-4">
          <div>• Status only moves forward automatically when estimate is declined or payment is received</div>
          <div>• Manual status changes override automation</div>
          <div>• Create only one follow-up task per Follow-Up cycle</div>
          <div>• Create only one escalation notification per Follow-Up cycle</div>
          <div>• Do not auto-send SMS or email from Follow-Up</div>
          <div>• Do not auto-mark Lost based on time</div>
        </div>
      </div>
    </div>
  );

  const getWonDevNotes = () => (
    <div className="text-[#051046] space-y-4">
      <div>
        <div className="font-semibold mb-3">⚡ Trigger: Manual status change to "Won" OR payment received</div>
      </div>
      
      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">💰 Auto Won Trigger:</div>
        <div className="space-y-2 ml-4">
          <div>Lead status automatically moves to Won when:</div>
          <div>• A deposit is recorded</div>
          <div><strong>OR</strong></div>
          <div>• A full payment is recorded with any payment type (Card, Cash, Other)</div>
        </div>
      </div>

      <div>
        <div className="font-semibold mb-2">🔄 System Actions (Auto Won):</div>
        <div className="space-y-2 ml-4">
          <div>✓ Set lead status → "Won"</div>
          <div>✓ Log activity in timeline: "Lead marked Won (Payment received) by [admin or staff name] with timestamp"</div>
          <div>✓ Cancel any pending Follow-Up reminders</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2"> Manual Won (Still Allowed – With Restriction):</div>
        <div className="space-y-2 ml-4">
          <div>⚠️ User may manually set status to Won <strong>ONLY IF:</strong></div>
          <div>• No payment has been recorded in the system</div>
          <div className="mt-2">
            <strong>Required Behavior:</strong>
          </div>
          <div>• Show confirmation modal: "No payment is recorded. Mark this lead as Won?"</div>
          <div> Require a note explaining the reason</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">🔔 Notification Center (Internal Only):</div>
        <div className="space-y-2 ml-4">
          <div>When lead moves to Won, create an in-app notification:</div>
          <div className="italic">"Won Lead [number of won leads] (deep link)"</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">⚠️ Guardrails:</div>
        <div className="space-y-2 ml-4">
          <div>• Estimate approval alone does <strong>NOT</strong> trigger Won</div>
          <div>• Any valid recorded payment type can trigger Won</div>
          <div>• Manual Won requires confirmation and note</div>
          <div>• System does not auto-revert Won if payment is later edited or refunded</div>
          <div>• Fire notification once per lead</div>
          <div>• Do not send email or SMS</div>
        </div>
      </div>
    </div>
  );

  const getDevNotesForStage = (stage: string) => {
    switch (stage) {
      case 'Contacted':
        return {
          title: 'Developer Notes - Contacted Status Logic',
          content: getContactedDevNotes()
        };
      case 'Price Shared':
        return {
          title: 'Developer Notes - Price Shared Status Logic',
          content: getPriceSharedDevNotes()
        };
      case 'Follow-Up':
        return {
          title: 'Developer Notes - Follow-Up Status Logic',
          content: getFollowUpDevNotes()
        };
      case 'Won':
        return {
          title: 'Developer Notes - Won Status Logic',
          content: getWonDevNotes()
        };
      default:
        return null;
    }
  };

  const applyStageChange = (
    leadId: string,
    newStage: 'New' | 'Contacted' | 'Price Shared' | 'Follow-Up' | 'Won' | 'Lost',
    reason?: string
  ) => {
    // Generate unique activity ID once
    const baseTimestamp = Date.now();
    const activityId = `activity-${baseTimestamp}-${leadId}`;
    
    setLeads((prevLeads) =>
      prevLeads.map((lead) => {
        if (lead.id === leadId) {
          // Add activity timeline entry for stage change
          const newActivity = {
            id: activityId,
            type: 'stage_change' as const,
            description:
              newStage === 'Lost'
                ? reason
                  ? `Lead moved to Lost stage (${reason})`
                  : 'Lead moved to Lost stage'
                : `Stage changed to ${newStage}`,
            timestamp: new Date().toISOString(),
            user: 'Current User' // This would come from auth context in real app
          };
          
          const updatedLead = {
            ...lead,
            stage: newStage,
            activityTimeline: [newActivity, ...lead.activityTimeline]
          };

          if (selectedLead && selectedLead.id === leadId) {
            setSelectedLead(updatedLead);
          }

          return updatedLead;
        }
        return lead;
      })
    );

    // Show Developer Notes for specific stage changes
    const devNotesData = getDevNotesForStage(newStage);
    if (devNotesData) {
      setDevNotesTitle(devNotesData.title);
      setDevNotesContent(devNotesData.content);
      setShowDevNotes(true);
    }

    // Close the dropdown after selection
    setOpenDropdownId(null);
  };

  const handleStageChange = (leadId: string, newStage: 'New' | 'Contacted' | 'Price Shared' | 'Follow-Up' | 'Won' | 'Lost') => {
    if (newStage === 'Lost') {
      setPendingLostLeadId(leadId);
      setLostReason('');
      setShowLostReasonModal(true);
      setOpenDropdownId(null);
      return;
    }

    applyStageChange(leadId, newStage);
  };

  const handleCloseLostReasonModal = () => {
    setShowLostReasonModal(false);
    setPendingLostLeadId(null);
    setLostReason('');
  };

  const handleConfirmLostReason = () => {
    if (!pendingLostLeadId || !lostReason) return;

    applyStageChange(pendingLostLeadId, 'Lost', lostReason);
    handleCloseLostReasonModal();
  };

  const handleSkipLostReason = () => {
    if (!pendingLostLeadId) return;

    applyStageChange(pendingLostLeadId, 'Lost');
    handleCloseLostReasonModal();
  };

  const handleLeadUpdate = (leadId: string, updatedData: Partial<Lead>) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) => {
        if (lead.id === leadId) {
          // Check if activityTimeline is in the updatedData
          // If so, use it directly (like for call notes) instead of adding a generic "Lead details updated"
          let updatedLead;
          
          if (updatedData.activityTimeline) {
            // Activity timeline is explicitly provided (e.g., from Call Made)
            updatedLead = {
              ...lead,
              ...updatedData
            };
          } else {
            // Generate unique activity ID for generic lead update
            const baseTimestamp = Date.now();
            const activityId = `activity-${baseTimestamp}-${leadId}`;
            
            // Create activity timeline entry for lead update
            const newActivity = {
              id: activityId,
              type: 'note' as const,
              description: 'Lead details updated',
              timestamp: new Date().toISOString(),
              user: 'Current User' // This would come from auth context in real app
            };
            
            // Update the lead with new data and add activity
            updatedLead = {
              ...lead,
              ...updatedData,
              activityTimeline: [newActivity, ...lead.activityTimeline]
            };
          }

          // Update the selected lead if it's currently open
          if (selectedLead && selectedLead.id === leadId) {
            setSelectedLead(updatedLead);
          }

          return updatedLead;
        }
        return lead;
      })
    );
  };

  const handleAddLead = (newLead: Omit<Lead, 'id' | 'daysInStage' | 'createdDate' | 'avatar' | 'value'>) => {
    const nextLeadNumber =
      leads.reduce((maxId, lead) => {
        const match = lead.id.match(/^L-(\d{3,})$/);
        return match ? Math.max(maxId, parseInt(match[1], 10)) : maxId;
      }, 0) + 1;

    const leadWithMetadata: Lead = {
      ...newLead,
      id: formatLeadId(nextLeadNumber),
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
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Leads */}
        <div
          className="rounded-[20px] border border-[#e2e8f0] p-6 bg-white"
          style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
        >
          <p className="text-sm text-gray-600 mb-2">Total Leads</p>
          <p className="text-3xl font-bold text-[#051046] mb-1">{totalLeads}</p>
          <p className="text-xs text-gray-600">Total Value: ${totalValue.toLocaleString()}</p>
        </div>

        {/* Win Rate */}
        <div
          className="rounded-[20px] border border-[#e2e8f0] p-6 bg-white"
          style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
        >
          <p className="text-sm text-gray-700 mb-2">Win Rate</p>
          <p className="text-3xl font-bold text-[#051046] mb-1">{winRate}%</p>
          <p className="text-xs text-gray-600">Won: {wonLeads}/{totalLeads}</p>
        </div>

        {/* Lost Rate */}
        <div
          className="rounded-[20px] border border-[#e2e8f0] p-6 bg-white"
          style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
        >
          <p className="text-sm text-gray-700 mb-2">Lost Rate</p>
          <p className="text-3xl font-bold text-[#051046] mb-1">{lostRate}%</p>
          <p className="text-xs text-gray-600 truncate" title={topLostReasonsText}>
            {topLostReasonsText}
          </p>
        </div>

        {/* Active Leads */}
        <div
          className="rounded-[20px] border border-[#e2e8f0] p-6 bg-white"
          style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
        >
          <p className="text-sm text-gray-700 mb-2">Active Leads</p>
          <p className="text-3xl font-bold text-[#051046] mb-1">{activeLeads}</p>
          <p className="text-xs text-gray-600">Active Value: ${activeValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Search Bar and Add Lead Button */}
      <div
        className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 mb-6"
        style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
      >
        <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[180px] h-[44px] pl-10 pr-4 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-purple-600 text-[#051046] text-sm"
          />
        </div>
        
        {/* Date Range Picker */}
        <div className="relative" ref={datePickerRef}>
          <button
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="w-[180px] h-[44px] flex items-center justify-between px-4 border border-[#e8e8e8] rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 hover:bg-gray-50 transition-colors"
          >
            <span className={startDate || endDate ? 'text-[#051046]' : 'text-gray-400'}>
              {startDate && endDate
                ? `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                : startDate
                ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Select range'}
            </span>
            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 flex-shrink-0 ml-2" />
          </button>

          {/* Calendar Dropdown */}
          {isDatePickerOpen && (
            <div className="absolute top-full left-0 mt-2 z-50">
              <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-4 w-72 md:w-80" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => {
                      const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
                      setCurrentMonth(newMonth);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#051046]" />
                  </button>
                  <div className="font-semibold text-[#051046]">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                  <button
                    onClick={() => {
                      const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
                      setCurrentMonth(newMonth);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-[#051046]" />
                  </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {(() => {
                    const getDaysInMonth = (date: Date) => {
                      const year = date.getFullYear();
                      const month = date.getMonth();
                      return new Date(year, month + 1, 0).getDate();
                    };

                    const getFirstDayOfMonth = (date: Date) => {
                      const year = date.getFullYear();
                      const month = date.getMonth();
                      return new Date(year, month, 1).getDay();
                    };

                    const isDateInRange = (day: number) => {
                      if (!startDate || !endDate) return false;
                      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                      return date >= startDate && date <= endDate;
                    };

                    const isDateSelected = (day: number) => {
                      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                      const dateStr = date.toDateString();
                      return (
                        (startDate && dateStr === startDate.toDateString()) ||
                        (endDate && dateStr === endDate.toDateString())
                      );
                    };

                    const isStartDate = (day: number) => {
                      if (!startDate) return false;
                      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                      return date.toDateString() === startDate.toDateString();
                    };

                    const isEndDate = (day: number) => {
                      if (!endDate) return false;
                      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                      return date.toDateString() === endDate.toDateString();
                    };

                    const handleDateClick = (day: number) => {
                      const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                      
                      if (!startDate || (startDate && endDate)) {
                        // Start new range
                        setStartDate(selectedDate);
                        setEndDate(null);
                      } else if (startDate && !endDate) {
                        // Complete the range
                        if (selectedDate < startDate) {
                          setStartDate(selectedDate);
                          setEndDate(startDate);
                        } else {
                          setEndDate(selectedDate);
                        }
                      }
                    };

                    const daysInMonth = getDaysInMonth(currentMonth);
                    const firstDay = getFirstDayOfMonth(currentMonth);
                    const days = [];

                    // Add empty cells for days before the first day of the month
                    for (let i = 0; i < firstDay; i++) {
                      days.push(<div key={`empty-${i}`} className="h-8" />);
                    }

                    // Add cells for each day of the month
                    for (let day = 1; day <= daysInMonth; day++) {
                      const inRange = isDateInRange(day);
                      const selected = isDateSelected(day);
                      const isStart = isStartDate(day);
                      const isEnd = isEndDate(day);

                      days.push(
                        <button
                          key={day}
                          onClick={() => handleDateClick(day)}
                          className={`h-8 rounded-lg text-sm transition-colors ${
                            selected
                              ? 'bg-[#9810fa] text-white font-semibold'
                              : inRange
                              ? 'bg-purple-100 text-[#051046]'
                              : 'text-[#051046] hover:bg-gray-100'
                          } ${
                            isStart && !isEnd ? 'rounded-r-none' : ''
                          } ${
                            isEnd && !isStart ? 'rounded-l-none' : ''
                          } ${
                            inRange && !isStart && !isEnd ? 'rounded-none' : ''
                          }`}
                        >
                          {day}
                        </button>
                      );
                    }

                    return days;
                  })()}
                </div>

                {/* Selected range display and clear button */}
                {(startDate || endDate) && (
                  <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0]">
                    <div className="text-sm text-[#051046]">
                      {startDate && endDate
                        ? `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                        : startDate
                        ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'Select range'}
                    </div>
                    <button
                      onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                        setIsDatePickerOpen(false);
                      }}
                      className="text-sm text-[#9810fa] hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sort Filter */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-[220px] h-[44px] px-4 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-purple-600 text-[#051046] text-sm"
          >
            <option value="date-desc">Date created (Newest first)</option>
            <option value="date-asc">Date created (Oldest first)</option>
            <option value="client">Client Name (A-Z)</option>
          </select>
        </div>
        
        {/* Stage Filter */}
        <div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-[180px] h-[44px] px-4 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-purple-600 text-[#051046] text-sm"
          >
            <option value="All">All Stages</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Price Shared">Price Shared</option>
            <option value="Follow-Up">Follow-Up</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div>
          <select
            value={lostReasonFilter}
            onChange={(e) => setLostReasonFilter(e.target.value)}
            className="w-[190px] h-[44px] px-4 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-purple-600 text-[#051046] text-sm"
          >
            <option value="All">All Lost Reasons</option>
            {LOST_REASON_OPTIONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        {/* Add Lead Button */}
        <div className="ml-auto">
          <button
            className="w-[160px] bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[32px] flex items-center justify-center gap-2 text-[16px] px-[24px] py-[10px] transition-colors"
            onClick={() => setIsAddLeadModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            Add Lead
          </button>
        </div>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div
        className="rounded-[20px] mb-8 p-[5px]"
      >
        <h2 className="text-xs font-semibold text-[#051046] mb-4 text-center">Lead Pipeline</h2>
        <div className="flex items-center justify-center gap-3 flex-wrap text-xs">
          <span className="font-medium text-[#399deb]">New</span>
          <span className="text-gray-400">→</span>
          <span className="font-medium text-[#28bdf2]">Contacted</span>
          <span className="text-gray-400">→</span>
          <span className="font-medium text-[#b9df10]">Price Shared</span>
          <span className="text-gray-400">→</span>
          <span className="font-medium text-[#f0a041]">Follow-Up</span>
          <span className="text-gray-400">→</span>
          <span className="text-[#b9df10] font-semibold">Won</span>
          <span className="text-gray-400">→</span>
          <span className="font-semibold text-[#f16a6a]">Lost</span>
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
                  Lead ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Job Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Lead Source
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
                  <div className="group relative inline-flex items-center gap-1.5">
                    Days
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                    <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-[100] normal-case shadow-lg">
                      Days in Current Stage
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {sortedLeads.slice((currentPage - 1) * leadsPerPage, currentPage * leadsPerPage).map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleLeadClick(lead)}
                >
                  {/* Lead ID Column */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-[#051046]">{lead.id}</p>
                  </td>

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

                  {/* Job Type Column */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#051046]">{lead.serviceType}</p>
                  </td>

                  {/* Lead Source Column */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#051046]">{lead.leadSource}</p>
                  </td>

                  {/* Value Column */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#051046]">
                      ${lead.value.toLocaleString()}
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
                        className={`px-3 py-1.5 rounded-[15px] text-xs font-medium flex items-center gap-2 text-[#051046] ${getStageColor(
                          lead.stage
                        )} hover:opacity-80 transition-opacity`}
                      >
                        {lead.stage}
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      {lead.stage === 'Lost' && getLeadLostReason(lead) && (
                        <p className="mt-1 text-xs text-[#f16a6a]">
                          ({getLeadLostReason(lead)})
                        </p>
                      )}
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
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(lead.priority)}`}></div>
                      <span className="text-sm text-[#051046]">{lead.priority}</span>
                    </div>
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
        
        {/* Pagination */}
        <div className="border-t border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * leadsPerPage) + 1} to {Math.min(currentPage * leadsPerPage, filteredLeads.length)} of {filteredLeads.length} entries
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
              {Array.from({ length: Math.min(5, Math.ceil(filteredLeads.length / leadsPerPage)) }, (_, i) => {
                const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredLeads.length / leadsPerPage)))}
              disabled={currentPage === Math.ceil(filteredLeads.length / leadsPerPage)}
              className="p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
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
        onUpdateLead={handleLeadUpdate}
      />

      {showLostReasonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-md w-full"
            style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#051046]">Mark Lead as Lost</h3>
              <button
                onClick={handleCloseLostReasonModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Lost Reason</label>
                <select
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                >
                  <option value="">Select reason</option>
                  {LOST_REASON_OPTIONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSkipLostReason}
                  className="flex-1 px-4 py-2 border border-[#e8e8e8] text-[#051046] rounded-[20px] hover:bg-gray-50 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleConfirmLostReason}
                  className="flex-1 px-4 py-2 bg-[#9473ff] text-white rounded-[20px] hover:bg-[#7f5fd9] transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Developer Notes Popup */}
      <DeveloperNotesPopup
        isOpen={showDevNotes}
        onClose={() => setShowDevNotes(false)}
        title={devNotesTitle}
        content={devNotesContent}
      />
    </div>
  );
}
