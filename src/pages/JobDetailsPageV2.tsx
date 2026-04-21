import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router';
import { ArrowLeft, X, Plus, Search, Trash2, MapPin, Edit2, Trash, CreditCard, DollarSign, AlertCircle } from 'lucide-react';
import { mockJobs, Job } from '../data/jobsData';
import { useJobs } from '../contexts/JobsContext';
import { DeveloperNotesPopup } from '../components/DeveloperNotesPopup';

// Estimate interface
interface Estimate {
  id: string;
  client: string;
  created: string;
  amount: string;
  status: 'Unsent' | 'Pending' | 'Approved' | 'Declined';
  declineReason?: string;
  items?: Array<{
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
  taxOption?: 'non-taxable' | 'standard-sales-tax' | 'austin-sales-tax';
  estimateNotes?: string;
}

// Invoice interface
interface Invoice {
  id: string;
  client: string;
  created: string;
  date: string;
  amount: string;
  status: 'Due' | 'Unpaid' | 'Paid' | 'Refunded';
  type?: 'Down Payment' | 'Instant Invoice' | 'Regular';
  estimateTotal?: string; // For down payments, stores the original estimate total
  items?: Array<{
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
  taxOption?: 'non-taxable' | 'standard-sales-tax' | 'austin-sales-tax';
  invoiceNotes?: string;
}

// Tax rates mapping
const TAX_RATES: Record<string, number> = {
  'standard-sales-tax': 8.25,
  'austin-sales-tax': 8.25,
};

export function JobDetailsPageV2() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { jobs } = useJobs();
  const isStaffView = location.pathname.startsWith('/staff');
  const [activeTab, setActiveTab] = useState('Details');
  const [showDevNotes, setShowDevNotes] = useState(false);
  const [devNotesContent, setDevNotesContent] = useState<React.ReactNode>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const successTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Read tab from URL params on component mount
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  // Decode the job ID from the URL and find the job
  const decodedJobId = jobId ? decodeURIComponent(jobId) : '';
  const baseMockJob = mockJobs.find((job) => job.id === decodedJobId);
  const contextJob = jobs.find((job) => job.id === decodedJobId);
  const selectedJob = contextJob
    ? {
        ...baseMockJob,
        ...contextJob,
        feedbackRating: contextJob.feedbackRating ?? baseMockJob?.feedbackRating,
        declineReason: contextJob.declineReason ?? baseMockJob?.declineReason,
      }
    : baseMockJob;

  // Check if we're creating a new job from a service plan
  const isNewJob = jobId === 'new';
  const servicePlanData = location.state as any;

  // Create a virtual job object for new jobs from service plans
  const displayJob = isNewJob && servicePlanData?.fromServicePlan ? {
    id: 'NEW',
    tags: [],
    client: servicePlanData.clientName || '',
    clientEmail: servicePlanData.clientEmail || '',
    clientPhone: servicePlanData.clientPhone || '',
    jobType: servicePlanData.serviceName || 'Service',
    jobStatus: 'Scheduled' as 'Scheduled',
    duration: '',
    scheduled: '',
    scheduledStart: '',
    scheduledEnd: '',
    tech: '',
    address: servicePlanData.address || '',
    jobDescription: servicePlanData.serviceDescription || '',
    jobSource: 'Service Plan',
    techNotes: '',
    isNew: false,
    hasUpsell: false,
    arrivedLate: false,
    scheduledByStaff: false,
    isAllDay: false,
    servicePlanId: servicePlanData.servicePlanId || '',
  } : selectedJob;

  // Update form states when selectedJob changes
  useEffect(() => {
    if (displayJob) {
      setJobStatus(displayJob.jobStatus);
      setJobType(displayJob.jobType);
      setJobSource(displayJob.jobSource || 'Google');
      setJobDescription(displayJob.jobDescription || '');
      setServiceLocation(displayJob.address || '');
    }
  }, [displayJob]);

  // Details tab state
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [jobStage, setJobStage] = useState<'onMyWay' | 'started' | 'completed'>('onMyWay');
  const [inventoryItems, setInventoryItems] = useState([
    { 
      id: 1, 
      description: 'Service call', 
      type: 'service' as const,
      taxable: false, 
      isUpsell: false, 
      quantity: 1, 
      price: 50.00 
    }
  ]);
  const [showInventoryDropdown, setShowInventoryDropdown] = useState(false);
  const [inventorySearch, setInventorySearch] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<'inventory' | 'visit' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [jobDurations, setJobDurations] = useState<Array<{ start: string; end: string }>>([
    { start: '2024-02-21 09:15 AM', end: '2024-02-21 11:30 AM' },
    { start: '2024-02-22 02:00 PM', end: '2024-02-22 04:45 PM' },
    { start: '2024-02-23 08:30 AM', end: '2024-02-23 10:15 AM' }
  ]);
  
  // Editable field states
  const [jobStatus, setJobStatus] = useState(selectedJob?.jobStatus || 'Scheduled');
  const [jobType, setJobType] = useState(selectedJob?.jobType || 'Service');
  const [jobSource, setJobSource] = useState(selectedJob?.jobSource || 'Google');
  const [jobDescription, setJobDescription] = useState(selectedJob?.jobDescription || '');
  const [serviceLocation, setServiceLocation] = useState(selectedJob?.address || '');
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [notes, setNotes] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  // Helper function to convert ISO datetime to date string (YYYY-MM-DD)
  const extractDate = (isoString: string): string => {
    if (!isoString) return '';
    // isoString format: "2026-02-15T09:00"
    const datePart = isoString.split('T')[0];
    return datePart || '';
  };

  // Helper function to convert ISO datetime to time string (12-hour format like "9:00 AM")
  const extractTime = (isoString: string): string => {
    if (!isoString) return '';
    // isoString format: "2026-02-15T09:00"
    const timePart = isoString.split('T')[1];
    if (!timePart) return '';
    
    const [hourStr, minuteStr] = timePart.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr || '00';
    
    const period = hour >= 12 ? 'PM' : 'AM';
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    
    return `${hour}:${minute} ${period}`;
  };

  // Populate scheduled date/time fields when job data is available
  useEffect(() => {
    if (displayJob && displayJob.scheduledStart) {
      setStartDate(extractDate(displayJob.scheduledStart));
      setStartTime(extractTime(displayJob.scheduledStart));
    }
    if (displayJob && displayJob.scheduledEnd) {
      setEndDate(extractDate(displayJob.scheduledEnd));
      setEndTime(extractTime(displayJob.scheduledEnd));
    }
  }, [displayJob]);

  // Checklist state
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Review job details and customer notes', completed: false },
    { id: 2, text: 'Confirm customer contact information', completed: false },
    { id: 3, text: 'Inspect work area and identify access points', completed: false },
    { id: 4, text: 'Verify all required tools and equipment are available', completed: false },
    { id: 5, text: 'Introduce yourself to the customer', completed: false },
    { id: 6, text: 'Explain the scope of work to the customer', completed: false },
    { id: 7, text: 'Take photos of the work area (before)', completed: false },
    { id: 8, text: 'Set up safety barriers if needed', completed: false },
    { id: 9, text: 'Locate shut-off valves and electrical panels', completed: false },
    { id: 10, text: 'Confirm customer expectations and timeline', completed: false }
  ]);

  // Helper to check if job is locked (cannot be edited)
  const isJobLocked = jobStatus === 'Done' || jobStatus === 'Cancelled';
  
  // Use displayJob for all rendering
  const currentJob = displayJob;

  // Available team members
  const availableTeamMembers = [
    'John Smith',
    'Sarah Johnson', 
    'Mike Davis',
    'Emily Brown',
    'David Wilson',
    'Lisa Anderson'
  ];

  // Team member busy status colors
  const teamMemberBusyStatus: { [key: string]: string } = {
    'John Smith': '#b9df10',      // Available (green)
    'Sarah Johnson': '#f0a041',   // Moderate (orange)
    'Mike Davis': '#f16a6a',      // Busy (red)
    'Emily Brown': '#b9df10',     // Available (green)
    'David Wilson': '#f0a041',    // Moderate (orange)
    'Lisa Anderson': '#f16a6a'    // Busy (red)
  };

  // Team member availability information
  const teamMemberAvailability: { [key: string]: string } = {
    'John Smith': '5 min away',
    'Sarah Johnson': '24 min away',
    'Mike Davis': 'Double booked',
    'Emily Brown': '12 min away',
    'David Wilson': '18 min away',
    'Lisa Anderson': 'Double booked'
  };

  // Mock inventory database
  const inventoryDatabase = [
    { id: 101, name: 'HVAC Tune-Up Service', type: 'service' as const, price: 150.00, taxable: false },
    { id: 102, name: 'AC Filter Replacement', type: 'service' as const, price: 45.00, taxable: false },
    { id: 103, name: 'Drain Cleaning', type: 'service' as const, price: 125.00, taxable: false },
    { id: 104, name: 'Water Heater Installation', type: 'service' as const, price: 850.00, taxable: false },
    { id: 105, name: 'Electrical Inspection', type: 'service' as const, price: 95.00, taxable: false },
    { id: 106, name: 'Thermostat - Nest Pro', type: 'part' as const, price: 249.99, taxable: true },
    { id: 107, name: 'Air Filter - 16x20x1', type: 'part' as const, price: 12.99, taxable: true },
    { id: 108, name: 'Copper Pipe - 3/4" x 10ft', type: 'part' as const, price: 28.50, taxable: true },
    { id: 109, name: 'PVC Pipe - 2" x 10ft', type: 'part' as const, price: 15.75, taxable: true },
    { id: 110, name: 'Wire Nuts - Assorted Pack', type: 'part' as const, price: 8.99, taxable: true }
  ];

  // Mock address database
  const mockAddresses = [
    '123 Main Street, Los Angeles, CA 90001',
    '456 Oak Avenue, San Francisco, CA 94102',
    '789 Pine Road, San Diego, CA 92101',
    '321 Elm Street, Sacramento, CA 95814',
    '654 Maple Drive, San Jose, CA 95113',
    '987 Cedar Lane, Fresno, CA 93721'
  ];

  // Filter inventory based on search
  const filteredInventory = inventoryDatabase.filter(item =>
    item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    item.type.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  // Filter addresses based on input
  const filteredAddresses = mockAddresses.filter(address =>
    address.toLowerCase().includes(serviceLocation.toLowerCase())
  );

  // Calculate total cost
  const calculateTotalCost = () => {
    return inventoryItems.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  // Calculate total upsell amount
  const calculateUpsellAmount = () => {
    return inventoryItems
      .filter(item => item.isUpsell)
      .reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const handleUpsellToggle = (itemId: number) => {
    setInventoryItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, isUpsell: !item.isUpsell } : item
      )
    );
  };

  const handlePriceChange = (itemId: number, newPrice: string) => {
    const priceValue = parseFloat(newPrice) || 0;
    setInventoryItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, price: priceValue } : item
      )
    );
  };

  const handleAddInventoryItem = (item: typeof inventoryDatabase[0]) => {
    const newItem = {
      id: Date.now(),
      description: item.name,
      type: item.type,
      taxable: item.taxable,
      isUpsell: false,
      quantity: 1,
      price: item.price
    };
    setInventoryItems([...inventoryItems, newItem]);
    setShowInventoryDropdown(false);
    setInventorySearch('');
  };

  const handleChecklistToggle = (id: number) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleJobStageClick = () => {
    if (jobStage === 'onMyWay') {
      setDevNotesContent(
        <div className="space-y-4">

          <div className="flex gap-3">
            <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
            <p className="text-sm text-[#051046]">Assigned team member presses "On my way" button.</p>
          </div>

          <div className="flex gap-3">
            <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
            <div className="flex-1">
              <p className="text-sm text-[#051046] font-medium">SMS OMW message is sent to customer that tech is on their way.</p>
              <p className="text-xs text-[#9473ff] font-medium mt-1 mb-2">SMS Notification Template:</p>
              <div className="bg-[#f8f7ff] border border-[#e2d9ff] rounded-[12px] px-4 py-3 text-xs text-[#051046] leading-relaxed space-y-1">
                <p>Hi <span className="font-semibold">[customers name]</span>, your technician <span className="font-semibold">[team member name]</span> is on the way to <span className="font-semibold">[service location address]</span>.</p>
                <p className="pt-1">To reschedule or cancel, please call us at <span className="text-[#9473ff] underline cursor-pointer font-medium">[user company phone hyperlinked]</span>.</p>
                <p className="pt-1">Thank you!</p>
                <p className="text-[#64748b] italic">-No Reply</p>
              </div>
            </div>
          </div>

          {[
            '"On my way" button changes to "Job Started".',
            'Green blinking dot appears on the dashboard under "Today\'s Jobs".',
            'Job status automatically changes to "In Progress" on job and job status on schedule calendar hover over.',
            "Today's progress is changed on the dashboard to reflect status change.",
            'OMW button locks the following fields on the job details: client name, phone number, email, start time, end time, all-day event checkbox, job type, job source, address.',
          ].map((note, idx) => (
            <div key={idx} className="flex gap-3">
              <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
              <p className="text-sm text-[#051046]">{note}</p>
            </div>
          ))}

        </div>
      );
      setShowDevNotes(true);
      setJobStage('started');
    } else if (jobStage === 'started') {
      setDevNotesContent(
        <div className="space-y-4">

          {[
            'Once the team member arrives to the customers home, they press "Job Started", "Job Started" changes to "Completed".',
            'Pressing "Job Started" starts the clock for the job duration.',
            'Job duration start timestamp displays on the job insights.',
            "Red truck will appear on the specific job on the job list & dashboard under Today's & Past Jobs if the team member arrives late.",
            'Team member is considered late if they press "Job Started" after the job end time.',
            'If team member is late, Late Arrival Rate metric is adjusted.',
          ].map((note, idx) => (
            <div key={idx} className="flex gap-3">
              <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
              <p className="text-sm text-[#051046]">{note}</p>
            </div>
          ))}

        </div>
      );
      setShowDevNotes(true);
      setJobStage('completed');
    } else {
      setDevNotesContent(
        <div className="space-y-4">

          {[
            'Completed button will not disappear when pressed if the team member has a mandatory checklist unfinished.',
            'Pop up error message with "OK" button appears saying "Complete Mandatory Checklist", pressing "OK" button takes the user to the job checklist.',
            'Once the "Completed" button is pressed, changes back to "On My Way".',
            'The job duration end time stamp is added, then, it is calculated and appears on the job details under job insights with a delete icon.',
            'If delete icon is pressed, removes the specific job duration from job insights.',
            'Adjust the workload hours accordingly if duration is deleted.',
            'Job duration on job list is recalculated.',
            'Blinking green dot disappears from the job on the dashboard.',
            'Team member metrics are updated: Workload hours.',
            'Job duration appears on the job list under duration column.',
          ].map((note, idx) => (
            <div key={idx} className="flex gap-3">
              <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
              <p className="text-sm text-[#051046]">{note}</p>
            </div>
          ))}

        </div>
      );
      setShowDevNotes(true);
      setJobStage('onMyWay');
    }
  };

  const getButtonText = () => {
    switch (jobStage) {
      case 'onMyWay':
        return 'On My Way';
      case 'started':
        return 'Job Started';
      case 'completed':
        return 'Completed';
    }
  };

  const handleUpdate = () => {
    // Clear any existing timer
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
    }
    
    // If the job has no status (converted from lead), set it to "Scheduled"
    if (jobStatus === '') {
      setJobStatus('Scheduled');
    }
    
    setShowSuccessMessage(true);
    setSuccessMessage('Job updated successfully!');
    successTimerRef.current = setTimeout(() => {
      setShowSuccessMessage(false);
      successTimerRef.current = null;
    }, 3000);
    setDevNotesContent(
      <div className="space-y-4">

        <div className="flex gap-3">
          <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
          <p className="text-sm text-[#051046]">Any type of updates requires the user to press the "Update" button.</p>
        </div>

        <div className="flex gap-3">
          <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
          <div className="flex-1">
            <p className="text-sm text-[#051046]">Only send "Changes in your appointment" to client when the address, date, time, or assigned team member is changed on the job and the user presses the "Update" button.</p>
            <p className="text-xs text-[#9473ff] font-medium mt-2 mb-2">Email Notification Template:</p>
            <div className="bg-[#f8f7ff] border border-[#e2d9ff] rounded-[12px] px-4 py-3 text-xs text-[#051046] leading-relaxed space-y-1">
              <p>We wanted to let you know that your job details have been successfully updated!</p>
              <p className="pt-1">Here's a summary of the changes:</p>
              <p className="text-[#64748b] italic">(New Details, only display what was changed on the job)</p>
              <p className="font-semibold">[Changed Field]</p>
              <p className="pt-2">Best Regards,</p>
              <p className="font-semibold">[User Company Name]</p>
              <p><span className="text-[#9473ff] underline cursor-pointer">[User Company Website]</span></p>
              <p className="pt-1">For any concerns, feel free to call us at <span className="text-[#9473ff] underline cursor-pointer">[User Phone Number]</span></p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
          <div className="flex-1">
            <p className="text-sm text-[#051046]">Only send "Job Details Have Been Updated" to team member when the address, date, time, or assigned team member is changed on the job and the user presses the "Update" button.</p>
            <p className="text-xs text-[#9473ff] font-medium mt-2 mb-2">Email Notification Template:</p>
            <div className="bg-[#f8f7ff] border border-[#e2d9ff] rounded-[12px] px-4 py-3 text-xs text-[#051046] leading-relaxed space-y-1">
              <p>Dear Technician,</p>
              <p className="pt-1">I hope this email finds you well. I am writing to inform you that job <span className="font-semibold">[job ID]</span> was updated.</p>
              <p className="pt-1">Below are the changes of the job:</p>
              <p className="text-[#64748b] italic">(New Details, only display what was changed on the job)</p>
              <p className="font-semibold">[Changed Field]</p>
              <p className="pt-2">Please review the information provided and reach out to the office administrator if you have any questions or need further clarification. Your prompt attention to this matter is greatly appreciated.</p>
              <p className="pt-1">Thank you for your commitment to excellence in your work. We are confident that you will handle this job with professionalism and efficiency.</p>
              <p className="pt-2">Best regards,</p>
              <p className="font-semibold">[User Company Name]</p>
              <p className="font-semibold">[User Name]</p>
              <p><span className="text-[#9473ff] underline cursor-pointer">[User Company Website]</span></p>
              <p className="pt-1">For any concerns, feel free to call us at <span className="text-[#9473ff] underline cursor-pointer">[User Phone Number]</span></p>
            </div>
          </div>
        </div>

      </div>
    );
    setShowDevNotes(true);
  };

  const handleCancel = () => {
    if (displayJob) {
      setJobStatus(displayJob.jobStatus);
      setJobType(displayJob.jobType);
      setJobSource(displayJob.jobSource);
      setJobDescription(displayJob.jobDescription);
      setNotes('');
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
    }
  };

  // Estimates state - now mutable
  const [estimates, setEstimates] = useState<Estimate[]>([
    {
      id: '#222-4',
      client: selectedJob?.client || 'Gina Bozer',
      created: 'Mon October 10 2025 2:30 pm',
      amount: '$3,245.00',
      status: 'Approved'
    },
    {
      id: '#222-3',
      client: selectedJob?.client || 'Gina Bozer',
      created: 'Mon October 9 2025 11:15 am',
      amount: '$1,850.75',
      status: 'Pending'
    },
    {
      id: '#222-2',
      client: selectedJob?.client || 'Gina Bozer',
      created: 'Mon October 8 2025 9:08 pm',
      amount: '$2,813.42',
      status: 'Declined',
      declineReason: 'Price'
    },
    {
      id: '#222-1',
      client: selectedJob?.client || 'Gina Bozer',
      created: 'Mon October 8 2025 9:04 pm',
      amount: '$0.00',
      status: 'Unsent'
    }
  ]);

  // Invoices state - now mutable
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Modals state
  const [showAddEstimateModal, setShowAddEstimateModal] = useState(false);
  const [showEditEstimateModal, setShowEditEstimateModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRequestDepositModal, setShowRequestDepositModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [showPaymentConfirmModal, setShowPaymentConfirmModal] = useState(false);
  const [pendingPaymentMethod, setPendingPaymentMethod] = useState<'card' | 'cash' | 'other' | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showAddInstantInvoiceModal, setShowAddInstantInvoiceModal] = useState(false);

  // Selected items
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'estimate' | 'invoice', id: string } | null>(null);

  // Form states
  const [declineReason, setDeclineReason] = useState('');
  const [downPaymentAmount, setDownPaymentAmount] = useState('');
  const [downPaymentType, setDownPaymentType] = useState<'%' | '$'>('$');
  const [downPaymentDueDate, setDownPaymentDueDate] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [estimateAmount, setEstimateAmount] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [discountType, setDiscountType] = useState<'%' | '$'>('%');
  
  // Edit Estimate form states
  const [editEstimateItems, setEditEstimateItems] = useState<Array<{
    id: number;
    description: string;
    notes: string;
    quantity: number;
    price: number;
    taxable: boolean;
  }>>([]);
  const [editDiscountAmount, setEditDiscountAmount] = useState('');
  const [editDiscountType, setEditDiscountType] = useState<'%' | '$'>('%');
  const [editTaxRate, setEditTaxRate] = useState('8.25');
  const [editEstimateNotes, setEditEstimateNotes] = useState('');
  const [editTaxOption, setEditTaxOption] = useState<'non-taxable' | 'standard-sales-tax' | 'austin-sales-tax'>('non-taxable');
  const [editEstimateDate, setEditEstimateDate] = useState('');
  
  // Add Instant Invoice form states
  const [newInvoiceItems, setNewInvoiceItems] = useState<Array<{
    id: number;
    description: string;
    notes: string;
    quantity: number;
    price: number;
    taxable: boolean;
  }>>([{ id: Date.now(), description: '', notes: '', quantity: 1, price: 0, taxable: false }]);
  const [newInvoiceDiscountAmount, setNewInvoiceDiscountAmount] = useState('');
  const [newInvoiceDiscountType, setNewInvoiceDiscountType] = useState<'%' | '$'>('%');
  const [newInvoiceTaxRate, setNewInvoiceTaxRate] = useState('8.25');
  const [newInvoiceNotes, setNewInvoiceNotes] = useState('');
  const [newInvoiceTaxOption, setNewInvoiceTaxOption] = useState<'non-taxable' | 'standard-sales-tax' | 'austin-sales-tax'>('non-taxable');
  const [newInvoiceDate, setNewInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Tax selection for PDF view
  const [pdfTaxOption, setPdfTaxOption] = useState<'non-taxable' | 'standard-sales-tax' | 'austin-sales-tax'>('non-taxable');

  // Estimate line item dropdown states
  const [activeItemDropdown, setActiveItemDropdown] = useState<number | null>(null);

  // Helper function to show success message
  const showSuccess = (message: string) => {
    // Clear any existing timer
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
    }
    
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    successTimerRef.current = setTimeout(() => {
      setShowSuccessMessage(false);
      successTimerRef.current = null;
    }, 3000);
  };

  // ===== ESTIMATE FUNCTIONS =====

  // Add Estimate
  const handleAddEstimate = () => {
    if (!estimateAmount) return;
    
    const newEstimate: Estimate = {
      id: `#${selectedJob?.id.split('-')[0]}-${estimates.length + 1}`,
      client: selectedJob?.client || '',
      created: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      amount: `$${parseFloat(estimateAmount).toFixed(2)}`,
      status: 'Unsent'
    };

    setEstimates([...estimates, newEstimate]);
    setShowAddEstimateModal(false);
    setEstimateAmount('');
    showSuccess('Estimate created successfully!');
    
    setDevNotesContent(
      <div className="space-y-4">
        <h3 className="font-semibold text-[#051046]">✓ Estimate Created Successfully</h3>
        <div className="bg-gray-50 p-4 rounded-[15px] border border-[#e8e8e8]">
          <p className="text-sm text-[#051046] mb-2"><strong>System Updates Completed:</strong></p>
          <ul className="space-y-2 text-[#051046] text-sm">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Unsent count increased on dashboard</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Estimate created on estimate list section</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Estimate created on client's profile</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Estimate count on job details increased</span>
            </li>
          </ul>
        </div>
      </div>
    );
    setShowDevNotes(true);
  };

  // Open Edit Estimate Modal
  const handleOpenEditEstimate = (estimate: Estimate) => {
    setSelectedEstimate(estimate);
    
    // Load saved items or use default mock data
    if (estimate.items && estimate.items.length > 0) {
      setEditEstimateItems(estimate.items);
    } else {
      // Default mock data for new/unsaved estimates
      setEditEstimateItems([
        {
          id: Date.now(),
          description: 'Service call',
          notes: 'Service call including checking system, tune up and diagnostics.',
          quantity: 1,
          price: 50.00,
          taxable: false
        }
      ]);
    }
    
    // Load saved form data or use defaults
    setEditDiscountAmount(estimate.discountAmount || '');
    setEditDiscountType(estimate.discountType || '%');
    setEditTaxRate(estimate.taxRate || '8.25');
    setEditTaxOption(estimate.taxOption || 'non-taxable');
    setEditEstimateNotes(estimate.estimateNotes || '');
    setEditEstimateDate(estimate.created);
    
    setShowEditEstimateModal(true);
  };

  // Save Edit Estimate
  const handleSaveEditEstimate = () => {
    if (!selectedEstimate) return;

    // Calculate totals
    const subtotal = editEstimateItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    let discountValue = 0;
    if (editDiscountAmount) {
      if (editDiscountType === '%') {
        discountValue = subtotal * (parseFloat(editDiscountAmount) / 100);
      } else {
        discountValue = parseFloat(editDiscountAmount);
      }
    }
    const afterDiscount = subtotal - discountValue;
    const taxableAmount = editEstimateItems.filter(item => item.taxable).reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxAmount = editTaxOption !== 'non-taxable' ? taxableAmount * (TAX_RATES[editTaxOption] / 100) : 0;
    const total = afterDiscount + taxAmount;

    // Check if this is a new estimate (status is Unsent and amount is $0.00)
    const isNewEstimate = selectedEstimate.status === 'Unsent' && selectedEstimate.amount === '$0.00';

    if (isNewEstimate) {
      // Add new estimate to the list with all data
      const newEstimate: Estimate = {
        ...selectedEstimate,
        amount: `$${total.toFixed(2)}`,
        created: editEstimateDate || selectedEstimate.created,
        items: editEstimateItems,
        discountAmount: editDiscountAmount,
        discountType: editDiscountType,
        taxRate: editTaxRate,
        taxOption: editTaxOption,
        estimateNotes: editEstimateNotes
      };
      setEstimates([newEstimate, ...estimates]);
      showSuccess('Estimate created successfully!');
    } else {
      // Update existing estimate in the list with all data
      setEstimates(estimates.map(est => 
        est.id === selectedEstimate.id 
          ? { 
              ...est, 
              amount: `$${total.toFixed(2)}`, 
              created: editEstimateDate,
              items: editEstimateItems,
              discountAmount: editDiscountAmount,
              discountType: editDiscountType,
              taxRate: editTaxRate,
              taxOption: editTaxOption,
              estimateNotes: editEstimateNotes
            }
          : est
      ));
      showSuccess('Estimate updated successfully!');
    }

    setShowEditEstimateModal(false);
    setSelectedEstimate(null);

    setDevNotesContent(
      <div className="space-y-4">

        {[
          'Unsent count increases on dashboard.',
          'Appears on the "Unsent" area on the dashboard.',
          'Inventory price is adjusted accordingly on the job details if the inventory price is changed on the estimate.',
          'Estimate is created on estimate list section.',
          'Estimate is created on client\'s profile.',
          'Estimate count on job details increases.',
          'Unsent estimate appears on estimate job details.',
          'Staff dashboard is updated if applicable.',
        ].map((note, idx) => (
          <div key={idx} className="flex gap-3">
            <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
            <p className="text-sm text-[#051046]">{note}</p>
          </div>
        ))}

      </div>
    );
    setShowDevNotes(true);
  };

  // Delete Estimate/Invoice
  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'estimate') {
      setEstimates(estimates.filter(est => est.id !== itemToDelete.id));
      showSuccess('Estimate deleted successfully!');
      
      setDevNotesContent(
        <div className="space-y-4">
          <h3 className="font-semibold text-[#051046]">✓ Estimate Deleted Successfully</h3>
          <div className="bg-gray-50 p-4 rounded-[15px] border border-[#e8e8e8]">
            <ul className="space-y-2 text-[#051046] text-sm">
              <li className="flex items-start"><span className="mr-2">✓</span><span>Estimate removed from job</span></li>
              <li className="flex items-start"><span className="mr-2">✓</span><span>Dashboard estimate count decreased</span></li>
            </ul>
          </div>
        </div>
      );
    } else {
      setInvoices(invoices.filter(inv => inv.id !== itemToDelete.id));
      showSuccess('Invoice deleted successfully!');
      
      setDevNotesContent(
        <div className="space-y-4">
          <h3 className="font-semibold text-[#051046]">✓ Invoice Deleted Successfully</h3>
          <div className="bg-gray-50 p-4 rounded-[15px] border border-[#e8e8e8]">
            <ul className="space-y-2 text-[#051046] text-sm">
              <li className="flex items-start"><span className="mr-2">✓</span><span>Invoice removed from job</span></li>
              <li className="flex items-start"><span className="mr-2">✓</span><span>Dashboard invoice count decreased</span></li>
            </ul>
          </div>
        </div>
      );
    }

    setShowDevNotes(true);
    setShowDeleteConfirmModal(false);
    setItemToDelete(null);
  };

  // Send Estimate (Unsent → Pending)
  const handleSendEstimate = (estimateId: string) => {
    setEstimates(estimates.map(est => 
      est.id === estimateId ? { ...est, status: 'Pending' as const } : est
    ));
    showSuccess('Estimate sent successfully!');
    
    setDevNotesContent(
      <div className="space-y-4">
        <h3 className="font-semibold text-[#051046]">✓ Estimate Sent to Client</h3>
        <div className="bg-gray-50 p-4 rounded-[15px] border border-[#e8e8e8]">
          <ul className="space-y-2 text-[#051046] text-sm">
            <li className="flex items-start"><span className="mr-2">📧</span><span>Estimate email sent to client</span></li>
            <li className="flex items-start"><span className="mr-2">✓</span><span>Status changed to "Pending"</span></li>
            <li className="flex items-start"><span className="mr-2">✓</span><span>Dashboard updated (Unsent → Pending)</span></li>
          </ul>
        </div>
      </div>
    );
    setShowDevNotes(true);
  };

  // Send Estimate Reminder (Pending status)
  const handleSendEstimateReminder = () => {
    showSuccess('Estimate reminder sent!');
    
    setDevNotesContent(
      <div className="space-y-4">
        <h3 className="font-semibold text-[#051046]">✓ Estimate Reminder Sent</h3>
        <div className="bg-gray-50 p-4 rounded-[15px] border border-[#e8e8e8]">
          <ul className="space-y-2 text-[#051046] text-sm">
            <li className="flex items-start"><span className="mr-2">📧</span><span>Reminder email sent to client</span></li>
            <li className="flex items-start"><span className="mr-2">✓</span><span>Client notified about pending estimate</span></li>
          </ul>
        </div>
      </div>
    );
    setShowDevNotes(true);
  };

  // Decline Estimate
  const handleDeclineEstimate = () => {
    if (!selectedEstimate || !declineReason) return;

    setEstimates(estimates.map(est => 
      est.id === selectedEstimate.id 
        ? { ...est, status: 'Declined' as const, declineReason } 
        : est
    ));
    setShowDeclineModal(false);
    setDeclineReason('');
    showSuccess('Estimate declined successfully!');
    
    setDevNotesContent(
      <div className="space-y-4">
        <h3 className="font-semibold text-[#051046]">✓ Estimate Declined</h3>
        <div className="bg-gray-50 p-4 rounded-[15px] border border-[#e8e8e8]">
          <ul className="space-y-2 text-[#051046] text-sm">
            <li className="flex items-start"><span className="mr-2">✓</span><span>Status changed to "Declined"</span></li>
            <li className="flex items-start"><span className="mr-2">���</span><span>Decline reason: {declineReason}</span></li>
            <li className="flex items-start"><span className="mr-2">✓</span><span>Job status updated</span></li>
            <li className="flex items-start"><span className="mr-2">✓</span><span>Dashboard metrics updated</span></li>
            <li className="flex items-start"><span className="mr-2">📧</span><span>Decline notification email sent</span></li>
          </ul>
        </div>
      </div>
    );
    setShowDevNotes(true);
  };

  // Request Deposit
  const handleRequestDeposit = () => {
    if (!downPaymentAmount || !downPaymentDueDate || !selectedEstimate) return;

    const totalAmount = parseFloat(selectedEstimate.amount.replace(/[$,]/g, ''));
    let depositAmount = 0;
    
    if (downPaymentType === '%') {
      depositAmount = (totalAmount * parseFloat(downPaymentAmount)) / 100;
    } else {
      depositAmount = parseFloat(downPaymentAmount);
    }

    const dateString = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const newInvoice: Invoice = {
      id: `#${selectedJob?.id.split('-')[0]}-1 Down Payment`,
      client: selectedJob?.client || '',
      created: dateString,
      date: dateString,
      amount: `$${depositAmount.toFixed(2)}`,
      status: 'Due',
      type: 'Down Payment',
      estimateTotal: selectedEstimate.amount // Store the original estimate total
    };

    setInvoices([newInvoice, ...invoices]);
    setShowRequestDepositModal(false);
    setDownPaymentAmount('');
    setDownPaymentDueDate('');
    showSuccess('Down payment invoice created!');
    setActiveTab('Invoice');
    
    setDevNotesContent(
      <div className="space-y-4">
        <h3 className="font-semibold text-[#051046]">✓ Down Payment Invoice Created</h3>
        <div className="bg-gray-50 p-4 rounded-[15px] border border-[#e8e8e8]">
          <ul className="space-y-2 text-[#051046] text-sm">
            <li className="flex items-start"><span className="mr-2">✓</span><span>Down payment invoice created (${depositAmount.toFixed(2)})</span></li>
            <li className="flex items-start"><span className="mr-2">✓</span><span>Status set to "Due"</span></li>
            <li className="flex items-start"><span className="mr-2">✓</span><span>Dashboard invoice count increased</span></li>
          </ul>
        </div>
      </div>
    );
    setShowDevNotes(true);
  };

  // Create Invoice from Approved Estimate
  const handleCreateInvoice = (estimate: Estimate) => {
    const dateString = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const newInvoice: Invoice = {
      id: `#${selectedJob?.id.split('-')[0]}-${invoices.length + 1}`,
      client: estimate.client,
      created: dateString,
      date: dateString,
      amount: estimate.amount,
      status: 'Due',
      type: 'Regular',
      items: estimate.items,
      discountAmount: estimate.discountAmount,
      discountType: estimate.discountType,
      taxRate: estimate.taxRate,
      taxOption: estimate.taxOption,
      invoiceNotes: estimate.estimateNotes
    };

    setInvoices([newInvoice, ...invoices]);
    showSuccess('Invoice created successfully!');
    setActiveTab('Invoice');
    
    setDevNotesContent(
      <div className="space-y-4">
        {([
          '✓ Successful" pop-up appears.',
          '✓ Generates an invoice for the full amount on the job.',
          '✓ Count increases on the invoice section of the job.',
          '✓ Client & Staff dashboard are updated.',
          '✓ Invoice displays on the invoice list with a status of Due.',
          '✓ Invoice is added to the client\'s profile with a status of Due.',
          '✓ Invoice email notification sent to the customer automatically',
          '✓ Invoice is automatically sent to the client\'s dashboard for payment.',
          '✓ Due count on the invoice area on the dashboard increases.',
          '✓ Invoice appears on the due count on the dashboard.',
        ] as string[]).map((note, idx) => (
          <div key={idx} className="flex gap-3">
            <p className="text-sm text-[#051046]">{note}</p>
          </div>
        ))}
      </div>
    );
    setShowDevNotes(true);
  };

  // Add Instant Invoice
  const handleAddInstantInvoice = () => {
    // Calculate subtotal
    const subtotal = newInvoiceItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    // Calculate discount
    let discountValue = 0;
    if (newInvoiceDiscountAmount) {
      if (newInvoiceDiscountType === '%') {
        discountValue = subtotal * (parseFloat(newInvoiceDiscountAmount) / 100);
      } else {
        discountValue = parseFloat(newInvoiceDiscountAmount);
      }
    }
    const afterDiscount = subtotal - discountValue;
    
    // Calculate tax
    const taxableAmount = newInvoiceItems.filter(item => item.taxable).reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxAmount = newInvoiceTaxOption !== 'non-taxable' ? (taxableAmount - (newInvoiceDiscountType === '%' ? taxableAmount * (parseFloat(newInvoiceDiscountAmount || '0') / 100) : 0)) * (TAX_RATES[newInvoiceTaxOption] / 100) : 0;
    
    const total = afterDiscount + taxAmount;
    
    const dateString = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const newInvoice: Invoice = {
      id: `#${selectedJob?.id.split('-')[0]}-${invoices.length + 1}`,
      client: selectedJob?.client || '',
      created: dateString,
      date: dateString,
      amount: `$${total.toFixed(2)}`,
      status: 'Due',
      type: 'Invoice',
      items: newInvoiceItems,
      discountAmount: newInvoiceDiscountAmount,
      discountType: newInvoiceDiscountType,
      taxRate: newInvoiceTaxRate,
      taxOption: newInvoiceTaxOption,
      invoiceNotes: newInvoiceNotes
    };

    setInvoices([newInvoice, ...invoices]);
    setShowAddInstantInvoiceModal(false);
    
    // Reset form
    setNewInvoiceItems([{ id: Date.now(), description: '', notes: '', quantity: 1, price: 0, taxable: false }]);
    setNewInvoiceDiscountAmount('');
    setNewInvoiceDiscountType('%');
    setNewInvoiceTaxRate('8.25');
    setNewInvoiceNotes('');
    setNewInvoiceTaxOption('non-taxable');
    setNewInvoiceDate(new Date().toISOString().split('T')[0]);
    
    showSuccess('Invoice created!');
    
    setDevNotesContent(
      <div className="space-y-4">
        <h3 className="font-semibold text-[#051046]">✓ Invoice Created</h3>
        <div className="bg-gray-50 p-4 rounded-[15px] border border-[#e8e8e8]">
          <ul className="space-y-2 text-[#051046] text-sm">
            <li className="flex items-start"><span className="mr-2">✓</span><span>Invoice created</span></li>
            <li className="flex items-start"><span className="mr-2">✓</span><span>Status set to "Due"</span></li>
            <li className="flex items-start"><span className="mr-2">✓</span><span>Dashboard invoice count increased</span></li>
          </ul>
        </div>
      </div>
    );
    setShowDevNotes(true);
  };

  // Send Invoice Reminder (Due → Unpaid)
  const handleSendInvoiceReminder = (invoiceId: string) => {
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'Unpaid' as const } : inv
    ));
    showSuccess('Invoice reminder sent!');
    
    setDevNotesContent(
      <div className="space-y-4">
        {([
          "Invoice was already sent to the client's dashboard when the estimate was approved or a deposit was requested.",
          <span key="email">
            <span className="font-semibold">"Invoice of recent work"</span> email notification is sent to the customer when Send Reminder is pressed.<br /><br />
            <span className="font-semibold">Email Notification Template:</span><br />
            <span className="italic text-gray-500">Attach: PDF Invoice</span><br /><br />
            Hi [Customer Name],<br /><br />
            Your invoice #[type of invoice][Invoice ID] from [User Company Name] is now available.<br /><br />
            You can view the details and securely complete your payment using the link below:<br />
            [Customer Dashboard hyperlink]<br /><br />
            If you have any questions, call us at [Users Phone Number hyperlinked].<br /><br />
            Thank you,<br />
            [Users Company Name]<br />
            [Users Company Website hyperlinked]
          </span>,
          '"Sent Successfully" pop-up appears.',
          'Invoice status changes to "Unpaid".',
          'Invoice on the invoice list status changes to "Unpaid".',
          "Invoice status on the client's profile is changed to \"Unpaid\".",
          '"Unpaid" count increases and invoice appears on the "Unpaid" list on the dashboard.',
          "Invoice status on the customer's dashboard & staff dashboard are updated.",
          '"Due" count decreases and invoice is removed from the "Due" list on the dashboard.',
          'Customer/client dashboard & staff dashboard are updated.',
        ] as React.ReactNode[]).map((note, idx) => (
          <div key={idx} className="flex gap-3">
            <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
            <p className="text-sm text-[#051046]">{note}</p>
          </div>
        ))}
      </div>
    );
    setShowDevNotes(true);
  };

  // Process Payment
  const handleProcessPayment = (paymentMethod: 'card' | 'cash' | 'other') => {
    if (!selectedInvoice) return;

    // Check if this is a down payment invoice
    const isDownPayment = selectedInvoice.type === 'Down Payment';

    setInvoices(invoices.map(inv => 
      inv.id === selectedInvoice.id ? { ...inv, status: 'Paid' as const } : inv
    ));
    
    // If down payment, create second invoice for remaining balance
    if (isDownPayment && selectedInvoice.estimateTotal) {
      const depositPaid = parseFloat(selectedInvoice.amount.replace(/[$,]/g, ''));
      const estimateTotal = parseFloat(selectedInvoice.estimateTotal.replace(/[$,]/g, ''));
      const remainingBalance = estimateTotal - depositPaid;
      
      const remainingInvoice: Invoice = {
        id: `#${selectedJob?.id.split('-')[0]}-2`,
        client: selectedInvoice.client,
        created: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        amount: `$${remainingBalance.toFixed(2)}`,
        status: 'Due',
        type: 'Regular'
      };
      
      setInvoices(prev => [remainingInvoice, ...prev]);
    }
    
    setShowPaymentMethodModal(false);
    setSelectedInvoice(null);
    showSuccess(`Payment processed via ${paymentMethod}!`);
    
    const paymentMethodName = paymentMethod === 'card' ? 'Card' : paymentMethod === 'cash' ? 'Cash' : 'Other';
    
    // Different developer notes for down payment vs regular payment
    if (isDownPayment) {
      const depositPaid = parseFloat(selectedInvoice.amount.replace(/[$,]/g, ''));
      const estimateTotal = selectedInvoice.estimateTotal ? parseFloat(selectedInvoice.estimateTotal.replace(/[$,]/g, '')) : 0;
      const remainingBalance = estimateTotal - depositPaid;
      
      setDevNotesContent(
        <div className="space-y-4">
          <h3 className="font-semibold text-[#051046]">✓ Down Payment Collected - {paymentMethodName}</h3>
          <div className="bg-gray-50 p-4 rounded-[15px] border border-[#e8e8e8]">
            <ul className="space-y-2 text-[#051046] text-sm">
              <li className="flex items-start"><span className="mr-2">✓</span><span>Down payment invoice marked as "Paid"</span></li>
              <li className="flex items-start"><span className="mr-2">✓</span><span>Second invoice auto-created for remaining balance (${remainingBalance.toFixed(2)})</span></li>
              <li className="flex items-start"><span className="mr-2">✓</span><span>Remaining invoice status set to "Due"</span></li>
              <li className="flex items-start"><span className="mr-2">✓</span><span>Dashboard Paid count increased</span></li>
              <li className="flex items-start"><span className="mr-2">✓</span><span>Payment added to monthly revenue</span></li>
              <li className="flex items-start"><span className="mr-2">✓</span><span>Job status remains active until final invoice paid</span></li>
              <li className="flex items-start"><span className="mr-2">📧</span><span>Payment confirmation email sent</span></li>
            </ul>
          </div>
        </div>
      );
    } else if (paymentMethod === 'card') {
      setDevNotesContent(
        <div className="space-y-4">
          {([
            'User presses card, pop-up appears.',
            'Allows the user to pay with credit card through Stripe.',
            'Takes the user to the Stripe payment site to enter card details.',
            'Pop-up with a Continue button for customer satisfaction questions appears.',
            'Once the CSAT is completed, takes the user back to the job invoice section.',
            'Invoice status is changed to "Paid".',
            'Invoice "Paid" count on the dashboard increases and appears.',
            'Invoice status on the invoice list is updated to "Paid".',
            "Invoice status on the client's profile is changed to \"Paid\".",
            "Job is added to completed jobs on the client's profile.",
            'Invoice "Due" count decreases on the dashboard.',
            'Invoice disappears from the "Due" list on the dashboard.',
            'The job status is changed from "In Progress" to "Done" automatically.',
            <span key="email1">
              <span className="font-semibold">"We're all set"</span> email notification is sent to the user.<br /><br />
              <span className="font-semibold">Email Notification Template:</span><br />
              <span className="italic text-gray-500">Attach: PDF Invoice</span><br /><br />
              Hi [User Name],<br /><br />
              This is a confirmation that we've received your payment for invoice [invoice type][Invoice ID].<br /><br />
              If you have any questions, feel free to reach out at [User Phone Number hyperlinked].<br /><br />
              Thank you,<br />
              [User Company Name]<br />
              [User Company Website hyperlinked]
            </span>,
            <span key="email2">
              <span className="font-semibold">"Thanks for the payment"</span> email notification is sent to the customer.<br /><br />
              <span className="font-semibold">Email Notification Template:</span><br />
              <span className="italic text-gray-500">Attach: PDF Invoice</span><br /><br />
              Thank you for your payment!<br /><br />
              We truly appreciate your business and trust in our products/services.<br /><br />
              We look forward to serving you again soon!<br /><br />
              [User Company Name]<br />
              [User Company Website hyperlinked]<br /><br />
              For any concerns, feel free to call us at [User Phone Number hyperlinked]
            </span>,
            'Inventory quantities are updated on the inventory tab.',
            'Inventory is added to the activity section on the inventory tab with a status of "Used".',
            'If the job invoice is paid and user canceled, deleted, or job was refunded — inventory item actions are: quantity is added back to the inventory tab (not applicable to unlimited inventory items), and inventory activity is added with the activity as "Restored".',
            'If applicable — low inventory items on the dashboard, most used inventory, most sold service display could adjust.',
            "If upsell items were added to a team member's upsell metric, remove them.",
            "Inventory items marked as upsell are added to all assigned team members' upsell metric.",
            "Today's progress — In Progress count decreases and Done count increases.",
            'Total is added to the monthly sales on the dashboard.',
            'Total is added to the correct payment type on the dashboard.',
            'Pop-up appears with "OK" button reminding the team member to press the "Completed" button after the CSAT is completed.',
            'Pressing the "OK" button takes the user to the job details page.',
            'Completed button will not disappear when pressed if the team member has a mandatory checklist unfinished.',
            'Pop-up error message with "OK" button appears saying "Complete Mandatory Checklist"; pressing "OK" takes the user to the job checklist.',
            'Once the "Completed" button is pressed, changes back to "On My Way".',
            'The job duration end time stamp is added, then it is calculated and appears on the job details under Job Insights with a delete icon.',
            'If the delete icon is pressed, removes the specific job duration.',
            'Job duration on the job list is recalculated.',
            'Workload hours are adjusted accordingly if duration is deleted.',
            'Job is transferred to "Past Jobs" on the dashboard.',
            "Job is removed from \"Today's Jobs\" on the dashboard.",
            'Blinking green dot disappears from the job on the dashboard.',
            'Team member metrics are updated: Workload Hours & CSAT.',
            'Job status on the schedule calendar tab hover-over is changed to "Done".',
            'Client and Staff dashboard are updated.',
            'Only options on the invoice section on the job are "View" and "Refund".',
            <span key="sms-review">
              <span className="font-semibold">SMS Message</span><br /><br />
              The customer is sent a Google review link (from settings tab) via SMS asking the customer to leave feedback. SMS Feedback message is sent one hour after the invoice is paid in full.<br /><br />
              <span className="font-semibold">SMS Notification Template:</span><br /><br />
              Customer satisfaction is our top priority. Please take a moment to share your experience with us by leaving a review. Thank you!: [Users Google review link hyperlinked]<br /><br />
              For any concern, feel free to call us at [users phone number hyperlinked]<br />
              -No Reply
            </span>,
          ] as React.ReactNode[]).map((note, idx) => (
            <div key={idx} className="flex gap-3">
              <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
              <p className="text-sm text-[#051046]">{note}</p>
            </div>
          ))}
        </div>
      );
    } else if (paymentMethod === 'cash') {
      setDevNotesContent(
        <div className="space-y-4">
          {([
            'User presses the button to accept cash.',
            'Pop-up appears confirming the dollar amount being taken as cash.',
            'Pop-up with a Continue button for customer satisfaction questions appears.',
            'Once the CSAT is completed, takes the user back to the job invoice section.',
            'Invoice status is changed to "Paid".',
            'Invoice "Paid" count on the dashboard increases and appears.',
            'Invoice status on the invoice list is updated to "Paid".',
            "Invoice status on the client's profile is changed to \"Paid\".",
            "Job is added to completed jobs on the client's profile.",
            'Invoice "Due" count decreases on the dashboard.',
            'Invoice disappears from the "Due" list on the dashboard.',
            'The job status is changed from "In Progress" to "Done" automatically.',
            <span key="email1">
              <span className="font-semibold">"We're all set"</span> email notification is sent to the user.<br /><br />
              <span className="font-semibold">Email Notification Template:</span><br />
              <span className="italic text-gray-500">Attach: PDF Invoice</span><br /><br />
              Hi [User Name],<br /><br />
              This is a confirmation that we've received your payment for invoice [invoice type][Invoice ID].<br /><br />
              If you have any questions, feel free to reach out at [User Phone Number hyperlinked].<br /><br />
              Thank you,<br />
              [User Company Name]<br />
              [User Company Website hyperlinked]
            </span>,
            <span key="email2">
              <span className="font-semibold">"Thanks for the payment"</span> email notification is sent to the customer.<br /><br />
              <span className="font-semibold">Email Notification Template:</span><br />
              <span className="italic text-gray-500">Attach: PDF Invoice</span><br /><br />
              Thank you for your payment!<br /><br />
              We truly appreciate your business and trust in our products/services.<br /><br />
              We look forward to serving you again soon!<br /><br />
              [User Company Name]<br />
              [User Company Website hyperlinked]<br /><br />
              For any concerns, feel free to call us at [User Phone Number hyperlinked]
            </span>,
            'Inventory quantities are updated on the inventory tab.',
            'Inventory is added to the activity section on the inventory tab with a status of "Used".',
            'If the job invoice is paid and user canceled, deleted, or job was refunded — inventory item actions are: quantity is added back to the inventory tab (not applicable to unlimited inventory items), and inventory activity is added with the activity as "Restored".',
            'If applicable — low inventory items on the dashboard, most used inventory, most sold service display could adjust.',
            "If upsell items were added to a team member's upsell metric, remove them.",
            "Inventory items marked as upsell are added to all assigned team members' upsell metric.",
            "Today's progress — In Progress count decreases and Done count increases.",
            'Total is added to the monthly sales on the dashboard.',
            'Total is added to the correct payment type on the dashboard.',
            'Pop-up appears with "OK" button reminding the team member to press the "Completed" button after the CSAT is completed.',
            'Pressing the "OK" button takes the user to the job details page.',
            'Completed button will not disappear when pressed if the team member has a mandatory checklist unfinished.',
            'Pop-up error message with "OK" button appears saying "Complete Mandatory Checklist"; pressing "OK" takes the user to the job checklist.',
            'Once the "Completed" button is pressed, changes back to "On My Way".',
            'The job duration end time stamp is added, then it is calculated and appears on the job details under Job Insights with a delete icon.',
            'If the delete icon is pressed, removes the specific job duration.',
            'Job duration on the job list is recalculated.',
            'Workload hours are adjusted accordingly if duration is deleted.',
            'Job is transferred to "Past Jobs" on the dashboard.',
            "Job is removed from \"Today's Jobs\" on the dashboard.",
            'Blinking green dot disappears from the job on the dashboard.',
            'Team member metrics are updated: Workload Hours & CSAT.',
            'Job status on the schedule calendar tab hover-over is changed to "Done".',
            'Client and Staff dashboard are updated.',
            'Only options on the invoice section on the job are "View" and "Refund".',
            <span key="sms-review-cash">
              <span className="font-semibold">SMS Message</span><br /><br />
              The customer is sent a Google review link (from settings tab) via SMS asking the customer to leave feedback. SMS Feedback message is sent one hour after the invoice is paid in full.<br /><br />
              <span className="font-semibold">SMS Notification Template:</span><br /><br />
              Customer satisfaction is our top priority. Please take a moment to share your experience with us by leaving a review. Thank you!: [Users Google review link hyperlinked]<br /><br />
              For any concern, feel free to call us at [users phone number hyperlinked]<br />
              -No Reply
            </span>,
          ] as React.ReactNode[]).map((note, idx) => (
            <div key={idx} className="flex gap-3">
              <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
              <p className="text-sm text-[#051046]">{note}</p>
            </div>
          ))}
        </div>
      );
    } else {
      setDevNotesContent(
        <div className="space-y-4">
          {([
            'User presses payment method of Other.',
            'Pop-up appears confirming the dollar amount being taken as Other.',
            'Pop-up with a Continue button for customer satisfaction questions appears.',
            'Once the CSAT is completed, takes the user back to the job invoice section.',
            'Invoice status is changed to "Paid".',
            'Invoice "Paid" count on the dashboard increases and appears.',
            'Invoice status on the invoice list is updated to "Paid".',
            "Invoice status on the client's profile is changed to \"Paid\".",
            "Job is added to completed jobs on the client's profile.",
            'Invoice "Due" count decreases on the dashboard.',
            'Invoice disappears from the "Due" list on the dashboard.',
            'The job status is changed from "In Progress" to "Done" automatically.',
            <span key="email1">
              <span className="font-semibold">"We're all set"</span> email notification is sent to the user.<br /><br />
              <span className="font-semibold">Email Notification Template:</span><br />
              <span className="italic text-gray-500">Attach: PDF Invoice</span><br /><br />
              Hi [User Name],<br /><br />
              This is a confirmation that we've received your payment for invoice [invoice type][Invoice ID].<br /><br />
              If you have any questions, feel free to reach out at [User Phone Number hyperlinked].<br /><br />
              Thank you,<br />
              [User Company Name]<br />
              [User Company Website hyperlinked]
            </span>,
            <span key="email2">
              <span className="font-semibold">"Thanks for the payment"</span> email notification is sent to the customer.<br /><br />
              <span className="font-semibold">Email Notification Template:</span><br />
              <span className="italic text-gray-500">Attach: PDF Invoice</span><br /><br />
              Thank you for your payment!<br /><br />
              We truly appreciate your business and trust in our products/services.<br /><br />
              We look forward to serving you again soon!<br /><br />
              [User Company Name]<br />
              [User Company Website hyperlinked]<br /><br />
              For any concerns, feel free to call us at [User Phone Number hyperlinked]
            </span>,
            'Inventory quantities are updated on the inventory tab.',
            'Inventory is added to the activity section on the inventory tab with a status of "Used".',
            'If the job invoice is paid and user canceled, deleted, or job was refunded — inventory item actions are: quantity is added back to the inventory tab (not applicable to unlimited inventory items), and inventory activity is added with the activity as "Restored".',
            'If applicable — low inventory items on the dashboard, most used inventory, most sold service display could adjust.',
            "If upsell items were added to a team member's upsell metric, remove them.",
            "Inventory items marked as upsell are added to all assigned team members' upsell metric.",
            "Today's progress — In Progress count decreases and Done count increases.",
            'Total is added to the monthly sales on the dashboard.',
            'Total is added to the correct payment type on the dashboard.',
            'Pop-up appears with "OK" button reminding the team member to press the "Completed" button after the CSAT is completed.',
            'Pressing the "OK" button takes the user to the job details page.',
            'Completed button will not disappear when pressed if the team member has a mandatory checklist unfinished.',
            'Pop-up error message with "OK" button appears saying "Complete Mandatory Checklist"; pressing "OK" takes the user to the job checklist.',
            'Once the "Completed" button is pressed, changes back to "On My Way".',
            'The job duration end time stamp is added, then it is calculated and appears on the job details under Job Insights with a delete icon.',
            'If the delete icon is pressed, removes the specific job duration.',
            'Job duration on the job list is recalculated.',
            'Workload hours are adjusted accordingly if duration is deleted.',
            'Job is transferred to "Past Jobs" on the dashboard.',
            "Job is removed from \"Today's Jobs\" on the dashboard.",
            'Blinking green dot disappears from the job on the dashboard.',
            'Team member metrics are updated: Workload Hours & CSAT.',
            'Job status on the schedule calendar tab hover-over is changed to "Done".',
            'Client and Staff dashboard are updated.',
            'Only options on the invoice section on the job are "View" and "Refund".',
            <span key="sms-review-other">
              <span className="font-semibold">SMS Message</span><br /><br />
              The customer is sent a Google review link (from settings tab) via SMS asking the customer to leave feedback. SMS Feedback message is sent one hour after the invoice is paid in full.<br /><br />
              <span className="font-semibold">SMS Notification Template:</span><br /><br />
              Customer satisfaction is our top priority. Please take a moment to share your experience with us by leaving a review. Thank you!: [Users Google review link hyperlinked]<br /><br />
              For any concern, feel free to call us at [users phone number hyperlinked]<br />
              -No Reply
            </span>,
          ] as React.ReactNode[]).map((note, idx) => (
            <div key={idx} className="flex gap-3">
              <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
              <p className="text-sm text-[#051046]">{note}</p>
            </div>
          ))}
        </div>
      );
    }
    setShowDevNotes(true);
  };

  // Refund Invoice
  const handleRefund = () => {
    if (!selectedInvoice || !refundAmount) return;

    // Update invoice status to Refunded
    setInvoices(invoices.map(inv => 
      inv.id === selectedInvoice.id 
        ? { ...inv, status: 'Refunded' as const } 
        : inv
    ));

    showSuccess('Refund processed!');
    setShowRefundModal(false);
    setRefundAmount('');
    setSelectedInvoice(null);
    
    setDevNotesContent(
      <div className="space-y-4">
        <h3 className="font-semibold text-[#051046]">✓ Refund Processed</h3>
        <div className="bg-gray-50 p-4 rounded-[15px] border border-[#e8e8e8]">
          <p className="text-sm text-[#051046] mb-2"><strong>⚠️ Important:</strong> This only updates system records. For card payments, issue refunds in Stripe. For cash/other, refund using your own method.</p>
          <ul className="space-y-2 text-[#051046] text-sm">
            <li className="flex items-start"><span className="mr-2">✓</span><span>Invoice status changed to "Refunded"</span></li>
            <li className="flex items-start"><span className="mr-2">✓</span><span>Refund amount: {refundAmount}</span></li>
            <li className="flex items-start"><span className="mr-2">✓</span><span>Inventory quantities restored</span></li>
            <li className="flex items-start"><span className="mr-2">✓</span><span>Dashboard metrics adjusted</span></li>
          </ul>
        </div>
      </div>
    );
    setShowDevNotes(true);
  };

  if (!displayJob) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#051046] hover:text-[#9473ff] mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-8 text-center">
            <h2 className="text-xl font-semibold text-[#051046] mb-2">Job Not Found</h2>
            <p className="text-gray-600">The job you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#051046] hover:text-[#9473ff] mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Jobs
        </button>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-[20px] flex items-center justify-between">
            <span className="text-sm">✓ {successMessage}</span>
            <button onClick={() => setShowSuccessMessage(false)} className="text-green-600 hover:text-green-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Card */}
        <div 
          className="bg-white rounded-[20px] border border-[#e2e8f0] px-[5px] py-[50px] mx-[0px] my-[25px]"
          style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
        >
          {/* Header */}
          <div className="border-b border-[#e2e8f0] px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-[#051046]">
                Job {currentJob?.id || 'NEW'} - {currentJob?.client || 'New Job'}
              </h1>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 text-sm">
              <button
                onClick={() => setActiveTab('Details')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'Details'
                    ? 'border-[#9473ff] text-[#9473ff] font-semibold'
                    : 'border-transparent text-gray-500 hover:text-[#051046]'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('Check List')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'Check List'
                    ? 'border-[#9473ff] text-[#9473ff] font-semibold'
                    : 'border-transparent text-gray-500 hover:text-[#051046]'
                }`}
              >
                Check List
              </button>
              <button
                onClick={() => setActiveTab('Estimate')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'Estimate'
                    ? 'border-[#9473ff] text-[#9473ff] font-semibold'
                    : 'border-transparent text-gray-500 hover:text-[#051046]'
                }`}
              >
                Estimate ({estimates.length})
              </button>
              <button
                onClick={() => setActiveTab('Invoice')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'Invoice'
                    ? 'border-[#9473ff] text-[#9473ff] font-semibold'
                    : 'border-transparent text-gray-500 hover:text-[#051046]'
                }`}
              >
                Invoice ({invoices.length})
              </button>
            </div>
          </div>

          {/* DETAILS TAB */}
          {activeTab === 'Details' && (
            <div className="p-6">
              {/* Status and Action Button */}
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Status:</span>
                    <select
                      value={jobStatus}
                      onChange={(e) => setJobStatus(e.target.value)}
                      className="px-3 py-1 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                      disabled={isJobLocked}
                    >
                      {jobStatus === '' && <option value="">(No Status)</option>}
                      <option value="Scheduled">Scheduled</option>
                      <option value="Deposit Collected">Deposit Collected</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  {(jobStatus === 'Done' || jobStatus === 'Cancelled') && (
                    <p className="text-xs text-[#f0a041] mt-2">
                      Note: Switch status to make changes to this job
                    </p>
                  )}
                </div>
                <button
                  onClick={handleJobStageClick}
                  className="px-4 py-2 bg-[#9473ff] text-white rounded-[20px] text-sm hover:bg-[#7f5fd9] transition-colors"
                >
                  {getButtonText()}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Client Details */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#051046] mb-3">Client Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Client Name</label>
                        <input
                          type="text"
                          value={currentJob?.client || ''}
                          readOnly
                          className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Phone</label>
                        <input
                          type="text"
                          value={currentJob?.clientPhone || ''}
                          readOnly
                          className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Email</label>
                        <input
                          type="email"
                          value={currentJob?.clientEmail || ''}
                          readOnly
                          className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#051046] mb-3">Job Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Job Type</label>
                        <select
                          value={jobType}
                          onChange={(e) => setJobType(e.target.value)}
                          disabled={isJobLocked}
                          className={`w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 ${isJobLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="Service">Service</option>
                          <option value="plumbing">Plumbing</option>
                          <option value="HVAC">HVAC</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Job source</label>
                        {jobSource.startsWith('(L) ') ? (
                          <>
                            <div className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] bg-gray-50">
                              {jobSource}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">(L) = Converted from Lead</p>
                          </>
                        ) : (
                          <select
                            value={jobSource}
                            onChange={(e) => setJobSource(e.target.value)}
                            disabled={isJobLocked}
                            className={`w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 ${isJobLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                          >
                            <option value="Google">Google</option>
                            <option value="Phone">Phone</option>
                            <option value="Website">Website</option>
                            <option value="Referral">Referral</option>
                          </select>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Job description</label>
                        <textarea
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          rows={3}
                          disabled={isJobLocked}
                          className={`w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 ${isJobLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Team */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#051046] mb-3">Assign Team Members</h3>
                    <div className="relative">
                      <label className="block text-xs text-gray-600 mb-1">Team Member</label>
                      <div 
                        className={`flex items-center gap-2 px-3 py-2 border border-[#e8e8e8] rounded-[15px] min-h-[38px] ${isJobLocked ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#9473ff]'} transition-colors`}
                        onClick={() => !isJobLocked && setShowTeamDropdown(!showTeamDropdown)}
                      >
                        {selectedTeamMembers.map((member, index) => (
                          <span key={index} className="px-2 py-0.5 bg-gray-200 text-[#051046] text-xs rounded flex items-center gap-1">
                            {member}
                            {!isJobLocked && (
                              <X 
                                className="w-3 h-3 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTeamMembers(selectedTeamMembers.filter((_, i) => i !== index));
                                }}
                              />
                            )}
                          </span>
                        ))}
                      </div>
                      
                      {/* Dropdown */}
                      {showTeamDropdown && !isJobLocked && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-[#e8e8e8] rounded-[15px] shadow-lg max-h-48 overflow-y-auto">
                          {availableTeamMembers
                            .filter(member => member !== currentJob?.tech && !selectedTeamMembers.includes(member))
                            .map((member, index) => (
                              <div
                                key={index}
                                className="px-4 py-2.5 text-sm text-[#051046] hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                                onClick={() => {
                                  setSelectedTeamMembers([...selectedTeamMembers, member]);
                                  setShowTeamDropdown(false);
                                }}
                              >
                                <span className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: teamMemberBusyStatus[member] }}></span>
                                <span>{member} - {teamMemberAvailability[member]}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Inventory */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#051046] mb-3">Inventory</h3>
                    
                    {/* Add service or product field */}
                    <div className="mb-4 relative">
                      <label className="block text-xs text-gray-600 mb-1">Add service or product</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search inventory..."
                          value={inventorySearch}
                          onChange={(e) => setInventorySearch(e.target.value)}
                          onFocus={() => !isJobLocked && setShowInventoryDropdown(true)}
                          disabled={isJobLocked}
                          className={`w-full px-4 py-2 pr-10 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 ${isJobLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      
                      {/* Searchable Dropdown */}
                      {showInventoryDropdown && !isJobLocked && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowInventoryDropdown(false)}
                          />
                          
                          <div className="absolute z-20 w-full mt-1 bg-white border border-[#e2e8f0] rounded-[20px] shadow-lg max-h-80 overflow-y-auto"
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
                                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            item.type === 'part' 
                                              ? 'bg-[#A6E4FA] text-[#399deb]' 
                                              : 'bg-[#E2F685] text-green-700'
                                          }`}>
                                            {item.type === 'part' ? 'Part' : 'Service'}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="inline-block bg-transparent px-0 py-0 rounded-none text-[12px] font-medium text-[#6a7282] shadow-none">
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
                        </>
                      )}
                      
                      <button className="mt-1 text-xs text-[#8b5cf6] hover:underline">+ Add new</button>
                    </div>

                    {/* Inventory Table */}
                    <div className="overflow-x-auto">
                      <div className="min-w-[560px]">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 pr-3 text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Description</th>
                              <th className="w-16 text-center py-2 px-1 text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Upsell</th>
                              <th className="w-20 text-center py-2 px-1 text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Quantity</th>
                              <th className="w-24 text-right py-2 px-1 text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Price</th>
                              <th className="w-24 text-right py-2 px-1 text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Total</th>
                              <th className="w-14 text-center py-2 pl-2 text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inventoryItems.map((item) => (
                              <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 pr-3 text-[#051046]">{item.description}</td>
                                <td className="py-2 px-1 text-center">
                                  <input
                                    type="checkbox"
                                    checked={item.isUpsell}
                                    onChange={() => handleUpsellToggle(item.id)}
                                    disabled={isJobLocked}
                                    className="w-4 h-4 accent-[#9473ff]"
                                  />
                                </td>
                                <td className="py-2 px-1 text-center">
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={() => {}}
                                    min="1"
                                    disabled={isJobLocked || item.type === 'service'}
                                    className={`w-16 px-2 py-1 border border-[#e8e8e8] rounded-[8px] text-center text-[#051046] ${
                                      isJobLocked || item.type === 'service' ? 'bg-gray-50 cursor-not-allowed' : ''
                                    }`}
                                  />
                                </td>
                                <td className="py-2 px-1 text-right">
                                  <div className="flex items-center justify-end">
                                    <span className="text-[#051046] mr-1">$</span>
                                    <input
                                      type="number"
                                      value={item.price.toFixed(2)}
                                      onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                      step="0.01"
                                      min="0"
                                      disabled={isJobLocked}
                                      className={`w-20 px-2 py-1 border border-[#e8e8e8] rounded-[8px] text-right text-[#051046] ${
                                        isJobLocked ? 'bg-gray-50 cursor-not-allowed' : ''
                                      }`}
                                    />
                                  </div>
                                </td>
                                <td className="py-2 px-1 text-right font-semibold text-[#051046]">
                                  ${(item.quantity * item.price).toFixed(2)}
                                </td>
                                <td className="py-2 pl-2 text-center">
                                  <button 
                                    onClick={() => {
                                      if (isJobLocked) return;
                                      setDeleteType('inventory');
                                      setDeleteTarget(item.id);
                                      setShowDeleteConfirm(true);
                                    }}
                                    disabled={isJobLocked}
                                    className={`transition-opacity ${isJobLocked ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'}`}
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
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Schedule */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#051046] mb-3">Scheduled (Arrival window)</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Starts</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            disabled={isJobLocked}
                            className={`px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 ${isJobLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                          />
                          <select
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            disabled={isJobLocked}
                            className={`px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 ${isJobLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            disabled={isJobLocked}
                            className={`px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 ${isJobLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                          />
                          <select
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            disabled={isJobLocked}
                            className={`px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 ${isJobLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
                      <div className="relative">
                        <label className="block text-xs text-gray-600 mb-1">Service Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          <input
                            type="text"
                            value={serviceLocation}
                            onChange={(e) => {
                              setServiceLocation(e.target.value);
                              if (e.target.value.length > 0 && !isJobLocked) {
                                setShowAddressDropdown(true);
                              } else {
                                setShowAddressDropdown(false);
                              }
                            }}
                            onFocus={() => {
                              if (serviceLocation.length > 0 && !isJobLocked) {
                                setShowAddressDropdown(true);
                              }
                            }}
                            disabled={isJobLocked}
                            placeholder="Enter address..."
                            className={`w-full pl-10 pr-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 ${isJobLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                          />
                        </div>
                        
                        {/* Google Maps Style Autocomplete Dropdown */}
                        {showAddressDropdown && filteredAddresses.length > 0 && !isJobLocked && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setShowAddressDropdown(false)}
                            />
                            
                            <div className="absolute z-20 w-full mt-1 bg-white border border-[#e2e8f0] rounded-[15px] shadow-lg max-h-60 overflow-y-auto"
                              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                            >
                              <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-100 flex items-center justify-end gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>Powered by Google</span>
                              </div>
                              
                              {filteredAddresses.slice(0, 5).map((address, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 border-b border-gray-50 last:border-b-0"
                                  onClick={() => {
                                    setServiceLocation(address);
                                    setShowAddressDropdown(false);
                                  }}
                                >
                                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-sm text-[#051046] font-medium">{address.split(',')[0]}</p>
                                    <p className="text-xs text-gray-500">{address.split(',').slice(1).join(',').trim()}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#051046] mb-3">Tech Notes</h3>
                    <p className="text-xs text-gray-600 mb-3">
                      These notes are not shown to the customer. Use this space for tech notes, and relevant links such as proposal PDFs, Google Docs, or Google Sheets.
                    </p>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      placeholder="Add job notes..."
                      disabled={isJobLocked}
                      className={`w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 ${isJobLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    />
                  </div>

                  {/* Photos */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#051046] mb-3">Photos</h3>
                    
                    <div className="mb-4">
                      <label className="block text-xs text-gray-600 mb-2">Before (Max 5 photos)</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-[15px] p-6 text-center">
                        <Plus className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Add before photos</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">After (Max 5 photos)</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-[15px] p-6 text-center">
                        <Plus className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Add after photos</p>
                      </div>
                    </div>
                  </div>

                  {/* Job Insights Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-sm font-semibold text-[#051046]">Job Insights</h3>
                      {(currentJob?.servicePlanId || servicePlanData?.fromServicePlan) && (
                        <div className="group relative inline-block">
                          <div className="w-5 h-5 bg-[#28bdf2] flex items-center justify-center rounded-sm">
                            <span className="text-white text-xs font-bold">S</span>
                          </div>
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                            Service Plan Job
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-[15px] border border-[#e2e8f0] p-4 h-48 overflow-y-auto">
                      <div className="space-y-2">
                        {/* Total Cost */}
                        <div className="bg-white/70 rounded-[10px] p-3 mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#051046]">Total Cost</span>
                            <span className="text-lg font-bold text-[#9473ff]">
                              ${calculateTotalCost().toFixed(2)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Upsell Amount */}
                        <div className="bg-white/70 rounded-[10px] p-3 mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#051046]">Total Upsell Amount</span>
                            <span className="text-lg font-bold text-green-600">
                              ${calculateUpsellAmount().toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="bg-white/70 rounded-[10px] p-3 mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#051046]">Rating</span>
                            <span className="text-sm font-medium text-[#051046]">
                              {typeof currentJob?.feedbackRating === 'number'
                                ? `${currentJob.feedbackRating} ${currentJob.feedbackRating === 1 ? 'star' : 'stars'}`
                                : 'none'}
                            </span>
                          </div>
                        </div>
                        {/* Job Durations */}
                        <div className="flex items-center justify-between text-xs mb-3">
                          <span className="font-semibold text-[#051046]">Job Durations</span>
                          <span className="text-gray-500">{jobDurations.length} visits</span>
                        </div>
                        {jobDurations.map((duration, index) => (
                          <div key={index} className="bg-white/70 rounded-[10px] p-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[#051046]">Visit {index + 1}</span>
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-[#9473ff] font-medium">
                                  {(() => {
                                    const start = new Date(duration.start);
                                    const end = new Date(duration.end);
                                    const diff = end.getTime() - start.getTime();
                                    const hours = Math.floor(diff / (1000 * 60 * 60));
                                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                    return `${hours}h ${minutes}m`;
                                  })()}
                                </span>
                                {!isStaffView && !isJobLocked && (
                                  <button
                                    onClick={() => {
                                      setDeleteType('visit');
                                      setDeleteTarget(index);
                                      setShowDeleteConfirm(true);
                                    }}
                                    className="hover:opacity-80 transition-opacity"
                                    title="Delete visit"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" style={{ color: '#f16a6a' }} />
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="text-gray-600 mt-1">
                              <div>{duration.start}</div>
                              <div>{duration.end}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Update/Cancel Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-[#e8e8e8] text-[#051046] rounded-[20px] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-6 py-2 bg-[#9473ff] text-white rounded-[20px] hover:bg-[#7f5fd9] transition-colors"
                >
                  Update Job
                </button>
              </div>
            </div>
          )}

          {/* CHECK LIST TAB */}
          {activeTab === 'Check List' && (
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#051046] mb-2">Job Site Checklist</h3>
              </div>
              
              <div className="space-y-3">
                {checklist.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-start gap-3 p-4 bg-white border border-[#e2e8f0] rounded-[20px] hover:shadow-sm transition-shadow"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleChecklistToggle(item.id)}
                      disabled={isJobLocked}
                      className="mt-0.5 w-5 h-5 rounded border-gray-300 text-[#399deb] focus:ring-[#399deb] focus:ring-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ accentColor: '#399deb' }}
                    />
                    <label 
                      className={`flex-1 text-sm cursor-pointer select-none ${
                        item.completed 
                          ? 'text-gray-400 line-through' 
                          : 'text-[#051046]'
                      } ${isJobLocked ? 'cursor-not-allowed' : ''}`}
                      onClick={() => !isJobLocked && handleChecklistToggle(item.id)}
                    >
                      {item.text}
                    </label>
                  </div>
                ))}
              </div>
              
              {/* Progress indicator */}
              <div className="mt-6 p-4 bg-gray-50 rounded-[20px] border border-[#e2e8f0]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#051046]">Progress</span>
                  <span className="text-sm font-semibold text-[#9473ff]">
                    {checklist.filter(item => item.completed).length} / {checklist.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#9473ff] h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(checklist.filter(item => item.completed).length / checklist.length) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ESTIMATE TAB */}
          {activeTab === 'Estimate' && (
            <div className="p-6">
              {/* Header with Add Estimate button */}
              <div className="flex justify-end mb-4">
                <button 
                  onClick={() => {
                    // Pre-populate edit estimate modal with data from Details tab
                    const prepopulatedItems = inventoryItems.map(item => ({
                      id: item.id,
                      description: item.description,
                      notes: '',
                      quantity: item.quantity,
                      price: item.price,
                      taxable: item.taxable
                    }));
                    
                    setEditEstimateItems(prepopulatedItems);
                    setEditDiscountAmount('');
                    setEditDiscountType('%');
                    setEditTaxOption('non-taxable');
                    setEditTaxRate('8.25');
                    setEditEstimateNotes('');
                    setEditEstimateDate('');
                    
                    // Create a temporary "new" estimate to edit
                    const newEstimate: Estimate = {
                      id: `#${selectedJob?.id.split('-')[0]}-${estimates.length + 1}`,
                      client: selectedJob?.client || '',
                      created: new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      }),
                      amount: '$0.00',
                      status: 'Unsent'
                    };
                    
                    setSelectedEstimate(newEstimate);
                    setShowEditEstimateModal(true);
                  }}
                  className="px-5 py-2.5 bg-[#9473ff] text-white rounded-[36px] hover:bg-[#7f5fd9] transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <span className="text-lg text-[#ffffff]">+</span>
                  Add estimate
                </button>
              </div>

              {/* Estimates Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e2e8f0]">
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6a7282] uppercase tracking-wider">
                        ESTIMATE ID
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6a7282] uppercase tracking-wider">
                        CLIENT
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6a7282] uppercase tracking-wider">
                        CREATED
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6a7282] uppercase tracking-wider">
                        AMOUNT
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6a7282] uppercase tracking-wider">
                        STATUS
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6a7282] uppercase tracking-wider">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimates.map((estimate, index) => {
                      // Determine status color
                      const getStatusColor = (status: string) => {
                        switch(status) {
                          case 'Approved': return 'bg-[#b9df10]';
                          case 'Pending': return 'bg-[#28bdf2]';
                          case 'Declined': return 'bg-[#f16a6a]';
                          case 'Unsent': return 'bg-gray-400';
                          default: return 'bg-gray-400';
                        }
                      };

                      return (
                        <tr key={estimate.id} className="border-b border-[#e2e8f0] hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-sm text-[#051046]">
                            {estimate.id}
                          </td>
                          <td className="py-4 px-4 text-sm text-[#051046]">
                            {estimate.client}
                          </td>
                          <td className="py-4 px-4 text-sm text-[#051046]">
                            {estimate.created}
                          </td>
                          <td className="py-4 px-4 text-sm text-[#051046] font-medium">
                            {estimate.amount}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-start gap-2">
                              <div className={`w-2 h-2 rounded-full mt-1.5 ${getStatusColor(estimate.status)}`}></div>
                              <div className="flex flex-col">
                                <span className="text-sm text-[#051046]">{estimate.status}</span>
                                {estimate.status === 'Declined' && estimate.declineReason && (
                                  <span className="text-xs" style={{ color: '#f16a6a' }}>
                                    ({estimate.declineReason})
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {/* Unsent Status Actions */}
                              {estimate.status === 'Unsent' && (
                                <>
                                  <button 
                                    onClick={() => handleOpenEditEstimate(estimate)}
                                    className="p-2 hover:bg-gray-100 rounded-md transition-colors" 
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4 text-[#051046]" />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setItemToDelete({ type: 'estimate', id: estimate.id });
                                      setShowDeleteConfirmModal(true);
                                      setDevNotesContent(
                                        <div className="space-y-4">
                                          <p className="text-sm text-[#051046]">If the user presses the delete button when the estimate is in <span className="font-semibold">"Unsent"</span> status:</p>
                                          {[
                                            'If the user deletes the estimate, the unsent count decreases on dashboard.',
                                            'Estimate count on the job decreases.',
                                            'Estimate on job is removed.',
                                            "Estimate on client's profile is removed.",
                                            'Estimate is removed from the estimate list and job details.',
                                            'Staff dashboard is updated if applicable.',
                                          ].map((note, idx) => (
                                            <div key={idx} className="flex gap-3">
                                              <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
                                              <p className="text-sm text-[#051046]">{note}</p>
                                            </div>
                                          ))}
                                        </div>
                                      );
                                      setShowDevNotes(true);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-md transition-colors" 
                                    title="Delete"
                                  >
                                    <Trash className="w-4 h-4 text-[#f16a6a]" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedEstimate(estimate);
                                      setShowViewModal(true);
                                    }}
                                    className="px-4 py-1.5 bg-white border border-[#e8e8e8] text-[#051046] rounded-[36px] hover:bg-gray-50 transition-colors font-medium text-sm"
                                  >
                                    View
                                  </button>
                                  <button 
                                    onClick={() => {
                                      handleSendEstimate(estimate.id);
                                      setDevNotesContent(
                                        <div className="space-y-4">
                                          <p className="text-sm text-[#051046]">When the user presses the <span className="font-semibold">"Send"</span> button when the estimate is in <span className="font-semibold">"Unsent"</span> status:</p>
                                          {([
                                            <>Once the user presses send, <span className="font-semibold">"Your Estimate Is Now Available"</span> email notification is sent to the customer.<br /><br /><span className="font-semibold">Email Notification Template:</span><br /><span className="font-semibold">Attach:</span> Estimate PDF<br /><span className="font-semibold">Email Verbiage:</span><br /><br />Dear [customer name],<br /><br />We hope this email finds you well.<br /><br />Thank you for choosing [users company name].<br /><br />We are pleased to inform you that your work estimate is now available. You can view and approve or reject it by clicking on this link:<br />[hyperlink to customers dashboard]<br /><br />Should you have any questions or need further clarification, feel free to reach out to us.<br /><br />Looking forward to the opportunity to work with you.<br /><br />Best regards,<br />[users company name]<br />[users company website is hyperlinked]<br />For any concerns, feel free to call us at [users phone number is hyperlinked]</>,
                                            'Sent Successfully pop up appears.',
                                            'The estimate is changed to Pending.',
                                            'Estimate appears on the "Pending" area on the dashboard.',
                                            'Estimate is removed from the "Unsent" area on the dashboard.',
                                            'Unsent count decreases on dashboard.',
                                            'Pending count increases on dashboard.',
                                            'Estimate on estimate list is changed from Unsent to Pending.',
                                            'Estimate status on the job is changed from Unsent to Pending.',
                                            "Estimate on the client's profile is changed to Pending.",
                                            "Estimate is sent to client's dashboard.",
                                            'Staff dashboard is updated.',
                                            'Software will keep the user in the "Estimate" section on the job details once estimate is created.',
                                          ] as React.ReactNode[]).map((note, idx) => (
                                            <div key={idx} className="flex gap-3">
                                              <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
                                              <p className="text-sm text-[#051046]">{note}</p>
                                            </div>
                                          ))}
                                        </div>
                                      );
                                      setShowDevNotes(true);
                                    }}
                                    className="px-4 py-1.5 border border-[#e8e8e8] text-[#051046] rounded-[36px] hover:bg-gray-50 transition-colors font-medium text-sm"
                                  >
                                    Send
                                  </button>
                                </>
                              )}

                              {/* Pending Status Actions */}
                              {estimate.status === 'Pending' && (
                                <>
                                  <button 
                                    onClick={() => {
                                      handleSendEstimateReminder();
                                      setDevNotesContent(
                                        <div className="space-y-4">
                                          <p className="text-sm text-[#051046]"><span className="font-semibold">Send Reminder</span> — resends the <span className="font-semibold">"Your Estimate Is Now Available"</span> email notification to the customer.</p>
                                          <div className="bg-gray-50 rounded-xl p-4 border border-[#e8e8e8] space-y-2">
                                            <p className="text-sm font-semibold text-[#051046]">Email Notification Template:</p>
                                            <p className="text-sm text-[#051046]"><span className="font-semibold">Attach:</span> Estimate PDF</p>
                                            <div className="mt-3 space-y-2 text-sm text-[#051046]">
                                              <p>Hi [Customer First Name],</p>
                                              <p>Your service estimate is ready and waiting for your review. You can view the full details and approve or decline it using the secure link below:</p>
                                              <p className="text-[#9473ff] font-semibold">[View & Review Estimate Button or Hyperlink]</p>
                                              <p>If you have any questions about the scope of work, pricing, or next steps, we're happy to help. Just reply to this email or give us a call.</p>
                                              <p>We look forward to working with you.</p>
                                              <p>Best regards,<br />[User's Company Name]<br />[User's Website – Hyperlinked]<br />Phone: [User's Phone Number – Hyperlinked]</p>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                      setShowDevNotes(true);
                                    }}
                                    className="px-3 py-1.5 border border-[#e8e8e8] text-[#051046] rounded-[36px] hover:bg-gray-50 transition-colors font-medium text-sm whitespace-nowrap"
                                  >
                                    Send Reminder
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setSelectedEstimate(estimate);
                                      setShowDeclineModal(true);
                                      setDevNotesContent(
                                        <div className="space-y-4">
                                          {([
                                            'If declined, a pop up appears for the customer to select a decline reason.',
                                            'Software keeps the user in the "Estimate" section on the job details.',
                                            'The "Declined" count increases on the dashboard.',
                                            'The "Declined" estimate appears on the dashboard.',
                                            '"Pending" estimate count on dashboard decreases.',
                                            'Estimate status on the estimate list changes to "Declined".',
                                            "Estimate on client's profile is changed to \"Declined\".",
                                            'Staff dashboard is updated if applicable.',
                                            'Data transfers to estimate decline rate section ("Overview" section under "Jobs").',
                                            'Decline reason code count increases on the estimate decline rate and team member stats.',
                                            'Estimate on the job is changed to Declined.',
                                            'Job status on the schedule calendar hover over is changed to Estimate Declined.',
                                            'Job status is changed to Estimate Declined.',
                                            "Job is removed from Today's Jobs, Past Jobs, Future Jobs (where applicable).",
                                            'Remove any upsell totals and green "U", if applicable.',
                                            "Today's progress on the dashboard — In Progress count decreases, Estimate Decline count increases (if the job is scheduled for today).",
                                            <span>"Client rejected your estimate" email notification is sent to the user/company if the estimate is declined.<br /><br /><span className="font-semibold">Email Notification Template:</span><br /><br />Dear [User company name],<br /><br />We hope this email finds you well.<br /><br />We regret to inform you that your estimate has been rejected. We understand that you may have concerns regarding certain aspects of the proposal.<br /><br /><span className="font-semibold">Client:</span> [client name]<br /><span className="font-semibold">Estimate ID:</span> [estimate ID]<br /><span className="font-semibold">Decline Reason:</span> [decline reason]<br /><br />Thank you for your hard work in putting together the estimate.<br /><br />Best Regards,<br />[User company name]<br />[User company website hyperlinked]<br />For any concerns, feel free to call us at [user phone number hyperlinked]</span>,
                                          ] as React.ReactNode[]).map((note, idx) => (
                                            <div key={idx} className="flex gap-3">
                                              <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
                                              <p className="text-sm text-[#051046]">{note}</p>
                                            </div>
                                          ))}
                                        </div>
                                      );
                                      setShowDevNotes(true);
                                    }}
                                    className="px-3 py-1.5 border border-[#e8e8e8] text-[#051046] rounded-[36px] hover:bg-gray-50 transition-colors font-medium text-sm"
                                  >
                                    Decline
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setSelectedEstimate(estimate);
                                      setShowViewModal(true);
                                    }}
                                    className="px-3 py-1.5 border border-[#e8e8e8] text-[#051046] rounded-[36px] hover:bg-gray-50 transition-colors font-medium text-sm"
                                  >
                                    View
                                  </button>
                                </>
                              )}

                              {/* Approved Status Actions */}
                              {estimate.status === 'Approved' && (
                                <>
                                  <button 
                                    onClick={() => {
                                      setSelectedEstimate(estimate);
                                      setShowViewModal(true);
                                    }}
                                    className="px-3 py-1.5 border border-[#e8e8e8] text-[#051046] rounded-[36px] hover:bg-gray-50 transition-colors font-medium text-sm"
                                  >
                                    View
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setSelectedEstimate(estimate);
                                      setShowRequestDepositModal(true);
                                      setDevNotesContent(
                                        <div className="space-y-4">
                                          {([
                                            'A pop-up appears asking the user to enter the deposit amount and date. User can select dollar amount ($) or percentage (%).',
                                            'Once the user clicks "Continue", an invoice is generated and appears on the job details — invoice count increases.',
                                            'Invoice status is set to "Due".',
                                            'Invoice ID is labeled "Down Payment [invoice number]".',
                                            '"Due" invoice count increases on the dashboard.',
                                            'Invoice appears in the "Due" area on the dashboard.',
                                            'Invoice is automatically sent to the client\'s dashboard for payment.',
                                            'Client & Staff dashboards are updated.',
                                            'Invoice is added to the invoice list.',
                                            'Invoice is added to the client\'s profile with a status of "Due".',
                                          ] as string[]).map((note, idx) => (
                                            <div key={idx} className="flex gap-3">
                                              <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
                                              <p className="text-sm text-[#051046]">{note}</p>
                                            </div>
                                          ))}
                                        </div>
                                      );
                                      setShowDevNotes(true);
                                    }}
                                    className="px-3 py-1.5 border border-[#e8e8e8] text-[#051046] rounded-[36px] hover:bg-gray-50 transition-colors font-medium text-sm whitespace-nowrap"
                                  >
                                    Request Deposit
                                  </button>
                                  <button 
                                    onClick={() => handleCreateInvoice(estimate)}
                                    className="px-3 py-1.5 border border-[#e8e8e8] text-[#051046] rounded-[36px] hover:bg-gray-50 transition-colors font-medium text-sm whitespace-nowrap"
                                  >
                                    Create Invoice
                                  </button>
                                </>
                              )}

                              {/* Declined Status Actions */}
                              {estimate.status === 'Declined' && (
                                <button 
                                  onClick={() => {
                                    setSelectedEstimate(estimate);
                                    setShowViewModal(true);
                                  }}
                                  className="px-4 py-1.5 border border-[#e8e8e8] text-[#051046] rounded-[36px] hover:bg-gray-50 transition-colors font-medium text-sm"
                                >
                                  View
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer with pagination info */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing 1 to {estimates.length} of {estimates.length} entries
                </div>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#9473ff] text-white text-sm font-medium">
                    1
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* INVOICE TAB */}
          {activeTab === 'Invoice' && (
            <div className="p-6">
              <div className="flex items-center justify-end mb-6">
                <button
                  onClick={() => setShowAddInstantInvoiceModal(true)}
                  className="px-5 py-2.5 bg-[#9473ff] text-white rounded-[20px] text-sm hover:bg-[#7f5fd9] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Instant Invoice
                </button>
              </div>

              {invoices.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-[20px] border border-[#e2e8f0]">
                  <p className="text-gray-500 text-sm">No invoices yet. Create an invoice from an approved estimate or add an instant invoice.</p>
                </div>
              ) : (
                <div className="bg-white border border-[#e2e8f0] rounded-[20px] overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-[#e2e8f0]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Invoice ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Client</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Created</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice, index) => (
                        <tr key={index} className="border-b border-[#e2e8f0]">
                          <td className="px-4 py-3 text-sm text-[#051046]">{invoice.id}</td>
                          <td className="px-4 py-3 text-sm text-[#051046]">{invoice.client}</td>
                          <td className="px-4 py-3 text-sm text-[#051046]">{invoice.created}</td>
                          <td className="px-4 py-3 text-sm text-[#051046]">{invoice.amount}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                invoice.status === 'Paid' 
                                  ? 'bg-[#b9df10]' 
                                  : invoice.status === 'Due'
                                  ? 'bg-[#f0a041]'
                                  : 'bg-[#f16a6a]'
                              }`}></div>
                              <span className="text-sm text-[#051046]">{invoice.status}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {invoice.status !== 'Paid' && invoice.status !== 'Refunded' && (
                                <>
                                  <button
                                    onClick={() => handleSendInvoiceReminder(invoice.id)}
                                    className="px-3 py-1 bg-white border border-[#e8e8e8] text-[#051046] rounded-[15px] text-xs hover:bg-gray-50 transition-colors"
                                  >
                                    Send Reminder
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedInvoice(invoice);
                                      setShowViewModal(true);
                                    }}
                                    className="px-3 py-1 bg-white border border-[#e8e8e8] text-[#051046] rounded-[15px] text-xs hover:bg-gray-50 transition-colors"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedInvoice(invoice);
                                      setShowPaymentMethodModal(true);
                                    }}
                                    className="px-3 py-1 bg-[#9473ff] text-white rounded-[15px] text-xs hover:bg-[#7f5fd9] transition-colors"
                                  >
                                    Pay Now
                                  </button>
                                  <button
                                    onClick={() => {
                                      setItemToDelete({ type: 'invoice', id: invoice.id });
                                       setDevNotesContent(
                                         <div className="space-y-4">
                                           {([
                                             'Allows the user to delete the invoice.',
                                             'Pop up with cancel and save buttons appear asking the user if they are sure they want to delete the specific invoice that is selected.',
                                             'Saved Successfully pop up.',
                                             'Invoice is deleted from the job.',
                                             'Invoice count decreases on the job.',
                                             'Invoice will disappear from the invoice list.',
                                             'Invoice will disappear from the "Due" list on the dashboard.',
                                             'Invoice is removed from the client\'s profile.',
                                             'Due count on dashboard is decreased.',
                                             <span key="unpaid-status">
                                               <span className="font-semibold">If in Unpaid status:</span><br /><br />
                                               Invoice will disappear from the "Unpaid" list on the dashboard.<br /><br />
                                               Unpaid count on dashboard is decreased.
                                             </span>,
                                           ] as React.ReactNode[]).map((note, idx) => (
                                             <div key={idx} className="flex gap-3">
                                               <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
                                               <p className="text-sm text-[#051046]">{note}</p>
                                             </div>
                                           ))}
                                         </div>
                                       );
                                       setShowDevNotes(true);
                                      setShowDeleteConfirmModal(true);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    title="Delete"
                                  >
                                    <Trash className="w-4 h-4 text-red-500" />
                                  </button>
                                </>
                              )}
                              {invoice.status === 'Paid' && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedInvoice(invoice);
                                      setShowViewModal(true);
                                    }}
                                    className="px-3 py-1 bg-white border border-[#e8e8e8] text-[#051046] rounded-[15px] text-xs hover:bg-gray-50 transition-colors"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedInvoice(invoice);
                                      setDevNotesContent(
                                        <div className="space-y-4">
                                          {([
                                            'When pressed, the software displays a pop-up with three choices: "Card", "Cash", and "Other".',
                                            <span key="card-section">
                                              <span className="font-semibold">Card</span><br />
                                              Allows the user to refund the customer for all or part of the invoice.<br /><br />
                                              Includes a pop-up with Cancel and "Yes, Continue" buttons saying: "You're about to be redirected to Stripe to process this refund. Would you like to continue?"<br /><br />
                                              User clicks <span className="font-semibold">Yes, Continue</span> — redirects them to their Stripe payment portal to process a refund.<br />
                                              User clicks <span className="font-semibold">Cancel</span> — pop-up disappears.
                                            </span>,
                                            <span key="cash-section">
                                              <span className="font-semibold">Cash</span><br />
                                              Pop-up appears.<br />
                                              User clicks <span className="font-semibold">Yes, Continue</span> — proceed with the actions below. "Saved successfully" pop-up appears.<br />
                                              User clicks <span className="font-semibold">Cancel</span> — pop-up disappears.
                                            </span>,
                                            <span key="other-section">
                                              <span className="font-semibold">Other</span><br />
                                              Pop-up appears.<br />
                                              User clicks <span className="font-semibold">Yes, Continue</span> — proceed with the actions below. "Saved successfully" pop-up appears.<br />
                                              User clicks <span className="font-semibold">Cancel</span> — pop-up disappears.
                                            </span>,
                                            'Monthly sales on the dashboard is decreased for the day the job was completed.',
                                            'Payment type insights is decreased for the day the job was completed.',
                                            'Job status is changed to "Canceled".',
                                            "Today's progress is updated accordingly (if job and refund were today).",
                                            'Invoice status is changed to "Refunded" on the job.',
                                            "Invoice status on the customer's dashboard & staff dashboard are updated.",
                                            'Update status on schedule calendar tab hover-over.',
                                            '"Paid" count on the dashboard is decreased.',
                                            '"Refunded" count on the dashboard is increased.',
                                            'Invoice on the invoice list is updated to "Refunded".',
                                            "Invoice on the customer's profile is updated to \"Refunded\".",
                                            'Inventory quantities are placed back into inventory on the inventory tab.',
                                            'Inventory item is added to the activity section on the inventory tab with a status of "Restored".',
                                            'If applicable — low inventory items on the dashboard, most used inventory, most sold service display count will adjust.',
                                            "If any upsells, the assigned team members' upsell metric needs to be adjusted.",
                                            <span key="admin-email">
                                              <span className="font-semibold">"Refund Processed Successfully"</span> is sent to the user when a refund is processed.<br /><br />
                                              Hi [User Name],<br /><br />
                                              This is to confirm that the refund you initiated was processed.<br /><br />
                                              The refunded amount of [$$Amount] has been returned to the [payment method] payment method. Please note that it may take 5–10 business days for the funds to appear, depending on the customer's bank or card provider.<br /><br />
                                              You can view the full refund details in your Klervo dashboard.<br /><br />
                                              If you have any questions or notice anything that requires clarification, feel free to contact our support team.<br /><br />
                                              Best regards,<br />
                                              The Klervo Team
                                            </span>,
                                          ] as React.ReactNode[]).map((note, idx) => (
                                            <div key={idx} className="flex gap-3">
                                              <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
                                              <p className="text-sm text-[#051046]">{note}</p>
                                            </div>
                                          ))}
                                        </div>
                                      );
                                      setShowDevNotes(true);
                                    }}
                                    className="px-3 py-1 bg-white border border-[#e8e8e8] text-[#051046] rounded-[15px] text-xs hover:bg-gray-50 transition-colors"
                                  >
                                    Refund
                                  </button>
                                </>
                              )}
                              {invoice.status === 'Refunded' && (
                                <button
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setShowViewModal(true);
                                  }}
                                  className="px-3 py-1 bg-white border border-[#e8e8e8] text-[#051046] rounded-[15px] text-xs hover:bg-gray-50 transition-colors"
                                >
                                  View
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}

      {/* Delete Confirm Modal for Inventory/Visit */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#051046]">Confirm Delete</h3>
              <button onClick={() => setShowDeleteConfirm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this {deleteType === 'inventory' ? 'inventory item' : 'visit'}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-[#e8e8e8] text-[#051046] rounded-[20px] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteType === 'inventory' && deleteTarget !== null) {
                    setInventoryItems(inventoryItems.filter(item => item.id !== deleteTarget));
                  } else if (deleteType === 'visit' && deleteTarget !== null) {
                    setJobDurations(jobDurations.filter((_, i) => i !== deleteTarget));
                  }
                  setShowDeleteConfirm(false);
                  setDeleteType(null);
                  setDeleteTarget(null);
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-[20px] hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Estimate Modal */}
      {showAddEstimateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#051046]">Add Estimate</h3>
              <button onClick={() => setShowAddEstimateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Estimate Amount</label>
                <input
                  type="number"
                  value={estimateAmount}
                  onChange={(e) => setEstimateAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddEstimateModal(false)}
                  className="flex-1 px-4 py-2 border border-[#e8e8e8] text-[#051046] rounded-[20px] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEstimate}
                  className="flex-1 px-4 py-2 bg-[#9473ff] text-white rounded-[20px] hover:bg-[#7f5fd9] transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Estimate Modal */}
      {showEditEstimateModal && selectedEstimate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between rounded-t-[20px]">
              <h2 className="text-xl font-bold text-[#051046]">
                {selectedEstimate.status === 'Unsent' && selectedEstimate.amount === '$0.00' ? 'Add Estimate' : 'Edit Estimate'}
              </h2>
              <button 
                onClick={() => {
                  setShowEditEstimateModal(false);
                  setSelectedEstimate(null);
                }} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Estimate Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-[15px] border border-[#e8e8e8]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Estimate #</p>
                    <p className="text-sm font-semibold text-[#051046]">{selectedEstimate.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Client</p>
                    <p className="text-sm font-semibold text-[#051046]">{selectedEstimate.client}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <input
                      type="date"
                      value={editEstimateDate}
                      onChange={(e) => setEditEstimateDate(e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <p className="text-sm font-semibold text-[#051046]">{selectedEstimate.status}</p>
                  </div>
                </div>
              </div>

              {/* Prepared For & Service Location */}
              <div className="mb-6 p-4 bg-gray-50 rounded-[15px] border border-[#e8e8e8]">
                <div className="grid grid-cols-2 gap-6">
                  {/* Prepared For */}
                  <div>
                    <h4 className="font-semibold text-[#051046] mb-3 text-sm">Prepared For:</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-[#051046]">{selectedJob?.client || 'N/A'}</p>
                      <p className="text-sm text-[#051046]">{selectedJob?.clientEmail || 'N/A'}</p>
                      <p className="text-sm text-[#051046]">{selectedJob?.clientPhone || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Service Location */}
                  <div>
                    <h4 className="font-semibold text-[#051046] mb-3 text-sm">Service Location:</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-[#051046]">{selectedJob?.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#051046]">Line Items</h3>
                  <button
                    onClick={() => {
                      setEditEstimateItems([...editEstimateItems, {
                        id: Date.now(),
                        description: '',
                        notes: '',
                        quantity: 1,
                        price: 0,
                        taxable: false
                      }]);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#9473ff] text-white rounded-[15px] text-sm hover:bg-[#7f5fd9] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {editEstimateItems.map((item, index) => {
                    // Filter inventory based on current item's description (used as search)
                    const filteredItemInventory = inventoryDatabase.filter(invItem =>
                      invItem.name.toLowerCase().includes(item.description.toLowerCase()) ||
                      invItem.type.toLowerCase().includes(item.description.toLowerCase())
                    );

                    return (
                      <div key={item.id} className="p-4 border border-[#e2e8f0] rounded-[15px]">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1 relative">
                            <label className="block text-xs text-gray-500 mb-1">Description</label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...editEstimateItems];
                                newItems[index].description = e.target.value;
                                setEditEstimateItems(newItems);
                              }}
                              onFocus={() => setActiveItemDropdown(item.id)}
                              placeholder="Search inventory or type custom description..."
                              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                            />

                            {/* Searchable Dropdown */}
                            {activeItemDropdown === item.id && item.description && (
                              <>
                                <div 
                                  className="fixed inset-0 z-10" 
                                  onClick={() => setActiveItemDropdown(null)}
                                />
                                
                                <div className="absolute z-20 w-full mt-1 bg-white border border-[#e2e8f0] rounded-[20px] shadow-lg max-h-80 overflow-y-auto"
                                  style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 4px 16px 2px' }}
                                >
                                  {filteredItemInventory.length > 0 ? (
                                    <div className="py-2">
                                      {filteredItemInventory.map((invItem) => (
                                        <div
                                          key={invItem.id}
                                          onClick={() => {
                                            const newItems = [...editEstimateItems];
                                            newItems[index].description = invItem.name;
                                            newItems[index].price = invItem.price;
                                            newItems[index].taxable = invItem.taxable;
                                            setEditEstimateItems(newItems);
                                            setActiveItemDropdown(null);
                                          }}
                                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                                        >
                                          <div className="flex items-center justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-medium text-[#051046] break-words">{invItem.name}</span>
                                                <span className={`px-3 py-1 text-xs font-medium ${
                                                  invItem.type === 'part' 
                                                    ? 'bg-[#A6E4FA] text-[#399deb]' 
                                                    : 'bg-[#E2F685] text-green-700'
                                                }`} style={{ borderRadius: '0.25rem' }}>
                                                  {invItem.type === 'part' ? 'Part' : 'Service'}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-2 mt-1">
                                                <span className="inline-block bg-transparent px-0 py-0 rounded-none text-[12px] font-medium text-[#6a7282] shadow-none">
                                                  {invItem.taxable ? 'Taxable' : 'Non-taxable'}
                                                </span>
                                              </div>
                                            </div>
                                            <span className="text-sm font-semibold text-[#9473ff] whitespace-nowrap flex-shrink-0">
                                              ${invItem.price.toFixed(2)}
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                                      No items found matching "{item.description}"
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setEditEstimateItems(editEstimateItems.filter((_, i) => i !== index));
                            }}
                            className="p-2 hover:bg-gray-100 rounded-md transition-colors mt-5"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>

                      <div className="mb-3">
                        <label className="block text-xs text-gray-500 mb-1">Notes</label>
                        <textarea
                          value={item.notes}
                          onChange={(e) => {
                            const newItems = [...editEstimateItems];
                            newItems[index].notes = e.target.value;
                            setEditEstimateItems(newItems);
                          }}
                          placeholder="Additional details"
                          rows={2}
                          className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                        />
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...editEstimateItems];
                              newItems[index].quantity = parseInt(e.target.value) || 0;
                              setEditEstimateItems(newItems);
                            }}
                            className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Price</label>
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => {
                              const newItems = [...editEstimateItems];
                              newItems[index].price = parseFloat(e.target.value) || 0;
                              setEditEstimateItems(newItems);
                            }}
                            step="0.01"
                            className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Amount</label>
                          <input
                            type="text"
                            value={`$${(item.quantity * item.price).toFixed(2)}`}
                            readOnly
                            className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] bg-gray-50"
                          />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.taxable}
                              onChange={(e) => {
                                const newItems = [...editEstimateItems];
                                newItems[index].taxable = e.target.checked;
                                setEditEstimateItems(newItems);
                              }}
                              className="w-4 h-4 accent-[#9473ff]"
                            />
                            <span className="text-xs text-[#051046]">Taxable</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-[15px] border border-[#e8e8e8]">
                <h3 className="font-semibold text-[#051046] mb-4">Financial Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                    <span className="text-sm font-semibold text-[#051046]">Subtotal:</span>
                    <span className="text-sm text-[#051046]">
                      ${editEstimateItems.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#051046]">Discount:</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={editDiscountType}
                        onChange={(e) => setEditDiscountType(e.target.value as '%' | '$')}
                        className="w-16 px-2 py-1 border border-[#e8e8e8] rounded-[8px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                      >
                        <option value="$">$</option>
                        <option value="%">%</option>
                      </select>
                      <input 
                        type="number" 
                        value={editDiscountAmount}
                        onChange={(e) => setEditDiscountAmount(e.target.value)}
                        placeholder="0"
                        className="w-20 px-2 py-1 border border-[#e8e8e8] rounded-[8px] text-sm text-[#051046] text-right focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#051046]">Tax Rate:</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={editTaxOption}
                        onChange={(e) => setEditTaxOption(e.target.value as 'non-taxable' | 'standard-sales-tax' | 'austin-sales-tax')}
                        className="w-40 px-2 py-1 border border-[#e8e8e8] rounded-[8px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                      >
                        <option value="non-taxable">Non-taxable</option>
                        <option value="standard-sales-tax">Standard Tax (8.25%)</option>
                        <option value="austin-sales-tax">Austin Tax (8.25%)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0]">
                    <span className="text-base font-bold text-[#051046]">Total:</span>
                    <span className="text-base font-bold text-[#051046]">
                      ${(() => {
                        const subtotal = editEstimateItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                        let discountValue = 0;
                        if (editDiscountAmount) {
                          if (editDiscountType === '%') {
                            discountValue = subtotal * (parseFloat(editDiscountAmount) / 100);
                          } else {
                            discountValue = parseFloat(editDiscountAmount);
                          }
                        }
                        const afterDiscount = subtotal - discountValue;
                        const taxableAmount = editEstimateItems.filter(item => item.taxable).reduce((sum, item) => sum + (item.quantity * item.price), 0);
                        const taxAmount = editTaxOption !== 'non-taxable' ? taxableAmount * (TAX_RATES[editTaxOption] / 100) : 0;
                        return (afterDiscount + taxAmount).toFixed(2);
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#051046] mb-2">Notes</label>
                <textarea
                  value={editEstimateNotes}
                  onChange={(e) => setEditEstimateNotes(e.target.value)}
                  placeholder="Add any additional notes or terms..."
                  rows={4}
                  className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEditEstimateModal(false);
                    setSelectedEstimate(null);
                  }}
                  className="flex-1 px-4 py-2 border border-[#e8e8e8] text-[#051046] rounded-[20px] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditEstimate}
                  className="flex-1 px-4 py-2 bg-[#9473ff] text-white rounded-[20px] hover:bg-[#7f5fd9] transition-colors"
                >
                  {selectedEstimate.status === 'Unsent' && selectedEstimate.amount === '$0.00' ? 'Save Estimate' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Estimate/Invoice Confirm Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#051046]">Confirm Delete</h3>
              <button onClick={() => setShowDeleteConfirmModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-[#e8e8e8] text-[#051046] rounded-[20px] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-[20px] hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#051046]">Decline Estimate</h3>
              <button onClick={() => setShowDeclineModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Decline Reason</label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                >
                  <option value="">Select reason</option>
                  <option value="Price">Price</option>
                  <option value="Competitor">Competitor</option>
                  <option value="Scheduling">Scheduling</option>
                  <option value="Communication">Communication</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDeclineModal(false)}
                  className="flex-1 px-4 py-2 border border-[#e8e8e8] text-[#051046] rounded-[20px] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeclineEstimate}
                  className="flex-1 px-4 py-2 bg-[#9473ff] text-white rounded-[20px] hover:bg-[#7f5fd9] transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal (Estimate/Invoice PDF) */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowViewModal(false);
              setSelectedEstimate(null);
              setSelectedInvoice(null);
            }
          }}
        >
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between rounded-t-[20px]">
              <div className="flex-1"></div>
              <h2 className="text-xl font-bold text-[#051046]">{selectedInvoice ? 'INVOICE' : 'ESTIMATE'}</h2>
              <div className="flex-1 flex justify-end">
                <button 
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedEstimate(null);
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
              {selectedEstimate && (
                <>
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
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#051046] w-24">Total</span>
                        <input 
                          type="text" 
                          value={selectedEstimate.amount} 
                          readOnly
                          className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] bg-gray-50"
                        />
                      </div>
                      {selectedEstimate.status === 'Declined' && selectedEstimate.declineReason && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-red-500">Declined:</span>
                          <span className="text-sm font-semibold text-red-500">{selectedEstimate.declineReason}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prepared For & Service Location */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    {/* Prepared For */}
                    <div>
                      <h4 className="font-semibold text-[#051046] mb-2">Prepared For:</h4>
                      <p className="text-sm text-[#051046]">{selectedJob?.client || 'Client Name'}</p>
                      <p className="text-sm text-[#051046]">{selectedJob?.address || 'Client Address'}</p>
                      <p className="text-sm text-[#051046]">{selectedJob?.clientPhone || 'Client Phone'}</p>
                      <p className="text-sm text-[#051046]">{selectedJob?.clientEmail || 'Client Email'}</p>
                    </div>

                    {/* Service Location */}
                    <div>
                      <h4 className="font-semibold text-[#051046] mb-2">Service location:</h4>
                      <p className="text-sm text-[#051046]">{selectedJob?.client || 'Client Name'}</p>
                      <p className="text-sm text-[#051046]">{selectedJob?.address || 'Service Address'}</p>
                      <p className="text-sm text-[#051046]">{selectedJob?.clientPhone || 'Client Phone'}</p>
                      <p className="text-sm text-[#051046]">{selectedJob?.clientEmail || 'Client Email'}</p>
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
                        {selectedEstimate.items && selectedEstimate.items.length > 0 ? (
                          selectedEstimate.items.map((item) => (
                            <tr key={item.id} className="border-b border-[#e2e8f0]">
                              <td className="py-4">
                                <div>
                                  <p className="text-sm font-medium text-[#051046]">{item.description}</p>
                                  {item.notes && (
                                    <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                                  )}
                                  <span className="inline-block mt-2 bg-transparent px-0 py-0 rounded-none text-[12px] font-medium text-[#6a7282] shadow-none">
                                    {item.taxable ? 'TAXABLE' : 'NON-TAXABLE'}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 text-center text-sm text-[#051046]">{item.quantity}</td>
                              <td className="py-4 text-right text-sm text-[#051046]">${item.price.toFixed(2)}</td>
                              <td className="py-4 text-right text-sm font-medium text-[#051046]">${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b border-[#e2e8f0]">
                            <td className="py-4">
                              <div>
                                <p className="text-sm font-medium text-[#051046]">Service call</p>
                                <p className="text-xs text-gray-500 mt-1">Service call including checking system, tune up and diagnostics.</p>
                                <span className="inline-block mt-2 bg-transparent px-0 py-0 rounded-none text-[12px] font-medium text-[#6a7282] shadow-none">
                                  NON-TAXABLE
                                </span>
                              </div>
                            </td>
                            <td className="py-4 text-center text-sm text-[#051046]">1</td>
                            <td className="py-4 text-right text-sm text-[#051046]">$50</td>
                            <td className="py-4 text-right text-sm font-medium text-[#051046]">$50.00</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Financial Summary */}
                  <div className="flex justify-end mb-8">
                    <div className="w-96 space-y-3">
                      {(() => {
                        // Calculate financial summary from estimate items
                        const items = selectedEstimate.items || [];
                        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                        
                        // Discount calculation
                        let discountValue = 0;
                        if (selectedEstimate.discountAmount) {
                          if (selectedEstimate.discountType === '%') {
                            discountValue = subtotal * (parseFloat(selectedEstimate.discountAmount) / 100);
                          } else {
                            discountValue = parseFloat(selectedEstimate.discountAmount);
                          }
                        }
                        
                        const afterDiscount = subtotal - discountValue;
                        
                        // Tax calculation
                        const taxableAmount = items.filter(item => item.taxable).reduce((sum, item) => sum + (item.quantity * item.price), 0);
                        const taxRate = selectedEstimate.taxRate ? parseFloat(selectedEstimate.taxRate) : 8.25;
                        const useTax = selectedEstimate.taxOption === 'tax-rate' || pdfTaxOption === 'tax-rate';
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
                              <div className="flex items-center gap-2">
                                <select
                                  value={selectedEstimate.discountType || discountType}
                                  onChange={(e) => setDiscountType(e.target.value as '%' | '$')}
                                  className="w-16 px-2 py-1 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                                >
                                  <option value="$">$</option>
                                  <option value="%">%</option>
                                </select>
                                <input 
                                  type="number" 
                                  value={selectedEstimate.discountAmount || discountAmount}
                                  onChange={(e) => setDiscountAmount(e.target.value)}
                                  placeholder="0"
                                  className="w-20 px-2 py-1 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] text-right focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                                />
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-400 text-right italic">
                              Use this field to apply a discount or waive the fee for service issues.
                            </p>

                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-[#051046]">Taxable:</span>
                              <span className="text-sm text-[#051046]">${taxableAmount.toFixed(2)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-[#051046]">Tax rate%:</span>
                              <select 
                                value={selectedEstimate.taxOption || pdfTaxOption}
                                onChange={(e) => setPdfTaxOption(e.target.value as 'non-taxable' | 'tax-rate')}
                                className="px-3 py-1 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                              >
                                <option value="non-taxable">Non-taxable</option>
                                <option value="tax-rate">Tax Rate ({taxRate}%)</option>
                              </select>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-[#051046]">Tax:</span>
                              <span className="text-sm text-[#051046]">${taxAmount.toFixed(2)}</span>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0]">
                              <span className="text-sm font-bold text-[#051046]">Total:</span>
                              <span className="text-sm font-bold text-[#051046]">${total.toFixed(2)}</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-[#051046] mb-2">Notes</h4>
                    <textarea
                      value={selectedEstimate.estimateNotes || ''}
                      placeholder="Notes goes here..."
                      rows={4}
                      readOnly
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff] bg-gray-50"
                    />
                  </div>

                  {/* Terms */}
                  <div className="bg-gray-50 rounded-[15px] p-4">
                    <h4 className="text-sm font-semibold text-[#051046] mb-2">Terms:</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Estimates are rough guesses of costs, based on what's expected to be done. Unexpected issues might change the cost. If more parts or work are needed, we'll let you know right away.
                    </p>
                  </div>
                </>
              )}

              {selectedInvoice && (
                <>
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
                          value={selectedInvoice.date} 
                          readOnly
                          className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] bg-gray-50"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#051046] w-24">Total</span>
                        <input 
                          type="text" 
                          value={selectedInvoice.amount} 
                          readOnly
                          className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] bg-gray-50"
                        />
                      </div>
                      {selectedInvoice.status === 'Refunded' && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-purple-500">Status:</span>
                          <span className="text-sm font-semibold text-purple-500">Refunded</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Billed To & Service Location */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    {/* Billed To */}
                    <div>
                      <h4 className="font-semibold text-[#051046] mb-2">Billed To:</h4>
                      <p className="text-sm text-[#051046]">{selectedJob?.client || 'Client Name'}</p>
                      <p className="text-sm text-[#051046]">{selectedJob?.address || 'Client Address'}</p>
                      <p className="text-sm text-[#051046]">{selectedJob?.clientPhone || 'Client Phone'}</p>
                      <p className="text-sm text-[#051046]">{selectedJob?.clientEmail || 'Client Email'}</p>
                    </div>

                    {/* Service Location */}
                    <div>
                      <h4 className="font-semibold text-[#051046] mb-2">Service location:</h4>
                      <p className="text-sm text-[#051046]">{selectedJob?.client || 'Client Name'}</p>
                      <p className="text-sm text-[#051046]">{selectedJob?.address || 'Service Address'}</p>
                      <p className="text-sm text-[#051046]">{selectedJob?.clientPhone || 'Client Phone'}</p>
                      <p className="text-sm text-[#051046]">{selectedJob?.clientEmail || 'Client Email'}</p>
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
                        {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                          selectedInvoice.items.map((item) => (
                            <tr key={item.id} className="border-b border-[#e2e8f0]">
                              <td className="py-4">
                                <div>
                                  <p className="text-sm font-medium text-[#051046]">{item.description}</p>
                                  {item.notes && (
                                    <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                                  )}
                                  <span className="inline-block mt-2 bg-transparent px-0 py-0 rounded-none text-[12px] font-medium text-[#6a7282] shadow-none">
                                    {item.taxable ? 'TAXABLE' : 'NON-TAXABLE'}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 text-center text-sm text-[#051046]">{item.quantity}</td>
                              <td className="py-4 text-right text-sm text-[#051046]">${item.price.toFixed(2)}</td>
                              <td className="py-4 text-right text-sm font-medium text-[#051046]">${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b border-[#e2e8f0]">
                            <td className="py-4">
                              <div>
                                <p className="text-sm font-medium text-[#051046]">Service call</p>
                                <p className="text-xs text-gray-500 mt-1">Service call including checking system, tune up and diagnostics.</p>
                                <span className="inline-block mt-2 bg-transparent px-0 py-0 rounded-none text-[12px] font-medium text-[#6a7282] shadow-none">
                                  NON-TAXABLE
                                </span>
                              </div>
                            </td>
                            <td className="py-4 text-center text-sm text-[#051046]">1</td>
                            <td className="py-4 text-right text-sm text-[#051046]">$50</td>
                            <td className="py-4 text-right text-sm font-medium text-[#051046]">$50.00</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Financial Summary */}
                  <div className="flex justify-end mb-8">
                    <div className="w-96 space-y-3">
                      {(() => {
                        // Calculate financial summary from invoice items
                        const items = selectedInvoice.items || [];
                        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                        
                        // Discount calculation
                        let discountValue = 0;
                        if (selectedInvoice.discountAmount) {
                          if (selectedInvoice.discountType === '%') {
                            discountValue = subtotal * (parseFloat(selectedInvoice.discountAmount) / 100);
                          } else {
                            discountValue = parseFloat(selectedInvoice.discountAmount);
                          }
                        }
                        
                        const afterDiscount = subtotal - discountValue;
                        
                        // Tax calculation
                        const taxableAmount = items.filter(item => item.taxable).reduce((sum, item) => sum + (item.quantity * item.price), 0);
                        const taxRate = selectedInvoice.taxRate ? parseFloat(selectedInvoice.taxRate) : 8.25;
                        const useTax = selectedInvoice.taxOption === 'tax-rate' || pdfTaxOption === 'tax-rate';
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
                              <div className="flex items-center gap-2">
                                <select
                                  value={selectedInvoice.discountType || discountType}
                                  onChange={(e) => setDiscountType(e.target.value as '%' | '$')}
                                  disabled
                                  className="w-16 px-2 py-1 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] bg-gray-50 cursor-not-allowed"
                                >
                                  <option value="$">$</option>
                                  <option value="%">%</option>
                                </select>
                                <input 
                                  type="number" 
                                  value={selectedInvoice.discountAmount || discountAmount}
                                  onChange={(e) => setDiscountAmount(e.target.value)}
                                  placeholder="0"
                                  disabled
                                  className="w-20 px-2 py-1 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] text-right bg-gray-50 cursor-not-allowed"
                                />
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-400 text-right italic">
                              Invoices cannot be edited once created.
                            </p>

                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-[#051046]">Taxable:</span>
                              <span className="text-sm text-[#051046]">${taxableAmount.toFixed(2)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-[#051046]">Tax rate%:</span>
                              <select 
                                value={selectedInvoice.taxOption || pdfTaxOption}
                                onChange={(e) => setPdfTaxOption(e.target.value as 'non-taxable' | 'tax-rate')}
                                disabled
                                className="px-3 py-1 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] bg-gray-50 cursor-not-allowed"
                              >
                                <option value="non-taxable">Non-taxable</option>
                                <option value="tax-rate">Tax Rate ({taxRate}%)</option>
                              </select>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-[#051046]">Tax:</span>
                              <span className="text-sm text-[#051046]">${taxAmount.toFixed(2)}</span>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0]">
                              <span className="text-sm font-bold text-[#051046]">Total:</span>
                              <span className="text-sm font-bold text-[#051046]">${total.toFixed(2)}</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-[#051046] mb-2">Notes</h4>
                    <textarea
                      value={selectedInvoice.invoiceNotes || ''}
                      placeholder="Notes goes here..."
                      rows={4}
                      readOnly
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-[15px] text-sm text-[#051046] bg-gray-50 cursor-not-allowed"
                    />
                  </div>

                  {/* Terms */}
                  <div className="bg-gray-50 rounded-[15px] p-4">
                    <h4 className="text-sm font-semibold text-[#051046] mb-2">Terms:</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Payment is due upon receipt. Late payments may be subject to additional fees. All services are provided according to our standard terms and conditions.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Request Deposit Modal */}
      {showRequestDepositModal && selectedEstimate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#051046]">Request Down Payment</h3>
              <button onClick={() => setShowRequestDepositModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Total Amount: {selectedEstimate.amount}
                </label>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Down Payment</label>
                <div className="flex gap-2">
                  <select
                    value={downPaymentType}
                    onChange={(e) => setDownPaymentType(e.target.value as '%' | '$')}
                    className="w-20 px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                  >
                    <option value="$">$</option>
                    <option value="%">%</option>
                  </select>
                  <input
                    type="number"
                    value={downPaymentAmount}
                    onChange={(e) => setDownPaymentAmount(e.target.value)}
                    placeholder={`Enter ${downPaymentType === '%' ? 'percentage' : 'amount'}`}
                    className="flex-1 px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                  />
                </div>
                {downPaymentType === '%' && downPaymentAmount && (() => {
                  const totalAmount = parseFloat(selectedEstimate.amount.replace(/[^0-9.-]+/g, ''));
                  const percentage = parseFloat(downPaymentAmount);
                  if (!isNaN(totalAmount) && !isNaN(percentage)) {
                    const calculatedAmount = (totalAmount * percentage) / 100;
                    return (
                      <div className="mt-2 text-sm text-[#051046] font-medium">
                        = ${calculatedAmount.toFixed(2)}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Due Date</label>
                <input
                  type="date"
                  value={downPaymentDueDate}
                  onChange={(e) => setDownPaymentDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRequestDepositModal(false)}
                  className="flex-1 px-4 py-2 border border-[#e8e8e8] text-[#051046] rounded-[20px] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestDeposit}
                  className="flex-1 px-4 py-2 bg-[#9473ff] text-white rounded-[20px] hover:bg-[#7f5fd9] transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentMethodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-[#051046]">Select Payment Method</h3>
              <button onClick={() => setShowPaymentMethodModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">How would you like to collect payment for this service plan?</p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setPendingPaymentMethod('card');
                  setShowPaymentConfirmModal(true);
                }}
                className="w-full p-4 border-2 border-[#e2e8f0] rounded-[15px] hover:border-[#9473ff] hover:bg-[#f5f3ff] transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#e6f3ff] flex items-center justify-center group-hover:bg-[#9473ff] transition-colors">
                    <CreditCard className="w-6 h-6 text-[#399deb] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#051046]">Card</p>
                    <p className="text-xs text-gray-500">Process payment via Stripe checkout</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => {
                  setPendingPaymentMethod('cash');
                  setShowPaymentConfirmModal(true);
                }}
                className="w-full p-4 border-2 border-[#e2e8f0] rounded-[15px] hover:border-[#b9df10] hover:bg-[#f5fad6] transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#f5fad6] flex items-center justify-center group-hover:bg-[#b9df10] transition-colors">
                    <DollarSign className="w-6 h-6 text-[#b9df10] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#051046]">Cash</p>
                    <p className="text-xs text-gray-500">Collect cash payment in person</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => {
                  setPendingPaymentMethod('other');
                  setShowPaymentConfirmModal(true);
                }}
                className="w-full p-4 border-2 border-[#e2e8f0] rounded-[15px] hover:border-[#a78bfa] hover:bg-[#f3f0ff] transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#f3f0ff] flex items-center justify-center group-hover:bg-[#a78bfa] transition-colors">
                    <AlertCircle className="w-6 h-6 text-[#a78bfa] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#051046]">Other</p>
                    <p className="text-xs text-gray-500">Check, wire transfer, or other methods</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {showPaymentConfirmModal && pendingPaymentMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-md w-full shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#051046]">Confirm Payment</h3>
              <button 
                onClick={() => {
                  setShowPaymentConfirmModal(false);
                  setPendingPaymentMethod(null);
                }} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-gray-50 rounded-[15px] border border-[#e8e8e8] p-4">
                <p className="text-sm text-[#051046] mb-3">
                  Are you sure you want to process this payment using:
                </p>
                <div className="flex items-center gap-3 bg-white rounded-[15px] border border-[#e8e8e8] p-3">
                  {pendingPaymentMethod === 'card' && (
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-[#9473ff]" />
                      <span className="font-medium text-[#051046]">Card Payment (Stripe)</span>
                    </div>
                  )}
                  {pendingPaymentMethod === 'cash' && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-[#9473ff]" />
                      <span className="font-medium text-[#051046]">Cash Payment</span>
                    </div>
                  )}
                  {pendingPaymentMethod === 'other' && (
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-[#9473ff]" />
                      <span className="font-medium text-[#051046]">Other Payment Method</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-[15px] p-3">
                <p className="text-xs text-yellow-800">
                  <strong>⚠️ Note:</strong> This action cannot be undone. Please verify the payment method before confirming.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPaymentConfirmModal(false);
                  setPendingPaymentMethod(null);
                }}
                className="flex-1 px-4 py-2.5 bg-white border border-[#e8e8e8] text-[#051046] rounded-[20px] hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (pendingPaymentMethod) {
                    handleProcessPayment(pendingPaymentMethod);
                    setShowPaymentConfirmModal(false);
                    setPendingPaymentMethod(null);
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-[#9473ff] text-white rounded-[20px] hover:bg-[#7f5fd9] transition-colors text-sm font-medium"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#051046]">Process Refund</h3>
              <button onClick={() => setShowRefundModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-[15px] p-3">
                <p className="text-xs text-yellow-800">
                  <strong>⚠️ Important:</strong> This only updates system records. For card payments, issue refunds in Stripe. For cash/other, refund using your own method.
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Refund Amount</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="Enter refund amount"
                  className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="flex-1 px-4 py-2 border border-[#e8e8e8] text-[#051046] rounded-[20px] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRefund}
                  className="flex-1 px-4 py-2 bg-[#9473ff] text-white rounded-[20px] hover:bg-[#7f5fd9] transition-colors"
                >
                  Process Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Instant Invoice Modal */}
      {showAddInstantInvoiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between rounded-t-[20px]">
              <h2 className="text-xl font-bold text-[#051046]">Add Invoice</h2>
              <button 
                onClick={() => {
                  setShowAddInstantInvoiceModal(false);
                  // Reset form
                  setNewInvoiceItems([{ id: Date.now(), description: '', notes: '', quantity: 1, price: 0, taxable: false }]);
                  setNewInvoiceDiscountAmount('');
                  setNewInvoiceDiscountType('%');
                  setNewInvoiceTaxRate('8.25');
                  setNewInvoiceNotes('');
                  setNewInvoiceTaxOption('non-taxable');
                }} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Invoice Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-[15px] border border-[#e8e8e8]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Invoice #</p>
                    <p className="text-sm font-semibold text-[#051046]">#{selectedJob?.id.split('-')[0]}-{invoices.length + 1}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Client</p>
                    <p className="text-sm font-semibold text-[#051046]">{selectedJob?.client || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <input
                      type="date"
                      value={newInvoiceDate}
                      onChange={(e) => setNewInvoiceDate(e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <p className="text-sm font-semibold text-[#051046]">Due</p>
                  </div>
                </div>
              </div>

              {/* Prepared For & Service Location */}
              <div className="mb-6 p-4 bg-gray-50 rounded-[15px] border border-[#e8e8e8]">
                <div className="grid grid-cols-2 gap-6">
                  {/* Prepared For */}
                  <div>
                    <h4 className="font-semibold text-[#051046] mb-3 text-sm">Prepared For:</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-[#051046]">{selectedJob?.client || 'N/A'}</p>
                      <p className="text-sm text-[#051046]">{selectedJob?.clientEmail || 'N/A'}</p>
                      <p className="text-sm text-[#051046]">{selectedJob?.clientPhone || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Service Location */}
                  <div>
                    <h4 className="font-semibold text-[#051046] mb-3 text-sm">Service Location:</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-[#051046]">{selectedJob?.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#051046]">Line Items</h3>
                  <button
                    onClick={() => {
                      setNewInvoiceItems([...newInvoiceItems, {
                        id: Date.now(),
                        description: '',
                        notes: '',
                        quantity: 1,
                        price: 0,
                        taxable: false
                      }]);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#9473ff] text-white rounded-[15px] text-sm hover:bg-[#7f5fd9] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {newInvoiceItems.map((item, index) => {
                    // Filter inventory based on current item's description
                    const filteredItemInventory = inventoryDatabase.filter(invItem =>
                      invItem.name.toLowerCase().includes(item.description.toLowerCase()) ||
                      invItem.type.toLowerCase().includes(item.description.toLowerCase())
                    );

                    return (
                      <div key={item.id} className="p-4 border border-[#e2e8f0] rounded-[15px]">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1 relative">
                            <label className="block text-xs text-gray-500 mb-1">Description</label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...newInvoiceItems];
                                newItems[index].description = e.target.value;
                                setNewInvoiceItems(newItems);
                              }}
                              onFocus={() => setActiveItemDropdown(item.id)}
                              placeholder="Search inventory or type custom description..."
                              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                            />

                            {/* Searchable Dropdown */}
                            {activeItemDropdown === item.id && item.description && (
                              <>
                                <div 
                                  className="fixed inset-0 z-10" 
                                  onClick={() => setActiveItemDropdown(null)}
                                />
                                
                                <div className="absolute z-20 w-full mt-1 bg-white border border-[#e2e8f0] rounded-[20px] shadow-lg max-h-80 overflow-y-auto"
                                  style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 4px 16px 2px' }}
                                >
                                  {filteredItemInventory.length > 0 ? (
                                    <div className="py-2">
                                      {filteredItemInventory.map((invItem) => (
                                        <div
                                          key={invItem.id}
                                          onClick={() => {
                                            const newItems = [...newInvoiceItems];
                                            newItems[index].description = invItem.name;
                                            newItems[index].price = invItem.price;
                                            newItems[index].taxable = invItem.taxable;
                                            setNewInvoiceItems(newItems);
                                            setActiveItemDropdown(null);
                                          }}
                                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                                        >
                                          <div className="flex items-center justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-medium text-[#051046] break-words">{invItem.name}</span>
                                                <span className={`px-3 py-1 text-xs font-medium ${
                                                  invItem.type === 'part' 
                                                    ? 'bg-[#A6E4FA] text-[#399deb]' 
                                                    : 'bg-[#E2F685] text-green-700'
                                                }`} style={{ borderRadius: '0.25rem' }}>
                                                  {invItem.type === 'part' ? 'Part' : 'Service'}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-2 mt-1">
                                                <span className="inline-block bg-transparent px-0 py-0 rounded-none text-[12px] font-medium text-[#6a7282] shadow-none">
                                                  {invItem.taxable ? 'Taxable' : 'Non-taxable'}
                                                </span>
                                              </div>
                                            </div>
                                            <span className="text-sm font-semibold text-[#9473ff] whitespace-nowrap flex-shrink-0">
                                              ${invItem.price.toFixed(2)}
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                                      No items found matching "{item.description}"
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setNewInvoiceItems(newInvoiceItems.filter((_, i) => i !== index));
                            }}
                            className="p-2 hover:bg-gray-100 rounded-md transition-colors mt-5"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>

                        <div className="mb-3">
                          <label className="block text-xs text-gray-500 mb-1">Notes</label>
                          <textarea
                            value={item.notes}
                            onChange={(e) => {
                              const newItems = [...newInvoiceItems];
                              newItems[index].notes = e.target.value;
                              setNewInvoiceItems(newItems);
                            }}
                            placeholder="Additional details"
                            rows={2}
                            className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                          />
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newItems = [...newInvoiceItems];
                                newItems[index].quantity = parseInt(e.target.value) || 0;
                                setNewInvoiceItems(newItems);
                              }}
                              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Price</label>
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) => {
                                const newItems = [...newInvoiceItems];
                                newItems[index].price = parseFloat(e.target.value) || 0;
                                setNewInvoiceItems(newItems);
                              }}
                              step="0.01"
                              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Amount</label>
                            <input
                              type="text"
                              value={`$${(item.quantity * item.price).toFixed(2)}`}
                              readOnly
                              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] bg-gray-50"
                            />
                          </div>
                          <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.taxable}
                                onChange={(e) => {
                                  const newItems = [...newInvoiceItems];
                                  newItems[index].taxable = e.target.checked;
                                  setNewInvoiceItems(newItems);
                                }}
                                className="w-4 h-4 accent-[#9473ff]"
                              />
                              <span className="text-xs text-[#051046]">Taxable</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-[15px] border border-[#e8e8e8]">
                <h3 className="font-semibold text-[#051046] mb-4">Financial Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                    <span className="text-sm font-semibold text-[#051046]">Subtotal:</span>
                    <span className="text-sm text-[#051046]">
                      ${newInvoiceItems.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#051046]">Discount:</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={newInvoiceDiscountType}
                        onChange={(e) => setNewInvoiceDiscountType(e.target.value as '%' | '$')}
                        className="w-16 px-2 py-1 border border-[#e8e8e8] rounded-[8px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                      >
                        <option value="$">$</option>
                        <option value="%">%</option>
                      </select>
                      <input 
                        type="number" 
                        value={newInvoiceDiscountAmount}
                        onChange={(e) => setNewInvoiceDiscountAmount(e.target.value)}
                        placeholder="0"
                        className="w-20 px-2 py-1 border border-[#e8e8e8] rounded-[8px] text-sm text-[#051046] text-right focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                    <span className="text-sm text-[#051046]">Amount after discount:</span>
                    <span className="text-sm text-[#051046]">
                      ${(() => {
                        const subtotal = newInvoiceItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                        let discount = 0;
                        if (newInvoiceDiscountAmount) {
                          if (newInvoiceDiscountType === '%') {
                            discount = subtotal * (parseFloat(newInvoiceDiscountAmount) / 100);
                          } else {
                            discount = parseFloat(newInvoiceDiscountAmount);
                          }
                        }
                        return (subtotal - discount).toFixed(2);
                      })()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#051046]">Tax:</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={newInvoiceTaxOption}
                        onChange={(e) => setNewInvoiceTaxOption(e.target.value as 'non-taxable' | 'standard-sales-tax' | 'austin-sales-tax')}
                        className="px-3 py-1 border border-[#e8e8e8] rounded-[8px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                      >
                        <option value="non-taxable">Non-Taxable</option>
                        <option value="standard-sales-tax">Standard Tax (8.25%)</option>
                        <option value="austin-sales-tax">Austin Tax (8.25%)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t-2 border-[#051046]">
                    <span className="text-base font-bold text-[#051046]">Total:</span>
                    <span className="text-base font-bold text-[#051046]">
                      ${(() => {
                        const subtotal = newInvoiceItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                        let discount = 0;
                        if (newInvoiceDiscountAmount) {
                          if (newInvoiceDiscountType === '%') {
                            discount = subtotal * (parseFloat(newInvoiceDiscountAmount) / 100);
                          } else {
                            discount = parseFloat(newInvoiceDiscountAmount);
                          }
                        }
                        const afterDiscount = subtotal - discount;
                        const taxableAmount = newInvoiceItems.filter(item => item.taxable).reduce((sum, item) => sum + (item.quantity * item.price), 0);
                        const taxAmount = newInvoiceTaxOption !== 'non-taxable' ? taxableAmount * (TAX_RATES[newInvoiceTaxOption] / 100) : 0;
                        return (afterDiscount + taxAmount).toFixed(2);
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Invoice Notes */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#051046] mb-2">Invoice Notes</label>
                <textarea
                  value={newInvoiceNotes}
                  onChange={(e) => setNewInvoiceNotes(e.target.value)}
                  placeholder="Add any additional notes or terms..."
                  rows={4}
                  className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-[#e2e8f0]">
                <button
                  onClick={() => {
                    setShowAddInstantInvoiceModal(false);
                    // Reset form
                    setNewInvoiceItems([{ id: Date.now(), description: '', notes: '', quantity: 1, price: 0, taxable: false }]);
                    setNewInvoiceDiscountAmount('');
                    setNewInvoiceDiscountType('%');
                    setNewInvoiceTaxRate('8.25');
                    setNewInvoiceNotes('');
                    setNewInvoiceTaxOption('non-taxable');
                  }}
                  className="flex-1 px-6 py-3 bg-white border border-[#e8e8e8] text-[#051046] rounded-[20px] hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddInstantInvoice}
                  className="flex-1 px-6 py-3 bg-[#9473ff] text-white rounded-[20px] hover:bg-[#7f5fd9] transition-colors font-medium"
                >
                  Create Invoice
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
        content={devNotesContent}
      />
    </div>
  );
}
