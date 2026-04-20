import { useState, useRef, useEffect } from 'react';
import { Plus, Edit2, Trash2, DollarSign, Clock, CheckCircle, AlertCircle, XCircle, Mail, ChevronLeft, ChevronRight, X, CreditCard, Calendar, Search } from 'lucide-react';
import { PlanDetailsModal } from '../components/PlanDetailsModal';
import { NewJobModal } from '../components/NewJobModal';
import { useJobs } from '../contexts/JobsContext';
import { useNavigate, useLocation } from 'react-router';
import { DateRangePicker } from '../components/DateRangePicker';

// Mock client database for autocomplete
const mockClientDatabase = [
  { id: 'C-101', name: 'Sarah Johnson', email: 'sarah.johnson@email.com', phone: '(512) 555-0123', address: '123 Main St, Austin, TX 78701' },
  { id: 'C-102', name: 'Michael Roberts', email: 'michael@robertsconstruction.com', phone: '(555) 123-4567', address: '123 Main St, Anytown, USA' },
  { id: 'C-103', name: 'David Chen', email: 'david@chenindustries.com', phone: '(555) 456-7890', address: '789 Oak St, Thirtown, USA' },
  { id: 'C-104', name: 'Emily Davis', email: 'emily.davis@email.com', phone: '(555) 333-4444', address: '505 Walnut St, Eighttown, USA' },
  { id: 'C-105', name: 'Robert Thompson', email: 'robert@thompsonent.com', phone: '(555) 654-3210', address: '202 Maple St, Fivetown, USA' },
  { id: 'C-106', name: 'Amanda Lee', email: 'amanda.lee@email.com', phone: '(555) 111-2222', address: '303 Birch St, Sixtown, USA' },
  { id: 'C-107', name: 'Christopher Moore', email: 'chris@mooresolutions.com', phone: '(555) 444-5555', address: '606 Spruce St, Ninetown, USA' },
  { id: 'C-108', name: 'Lisa Anderson', email: 'lisa.anderson@email.com', phone: '(555) 555-6666', address: '707 Ash St, Tentown, USA' },
];

// Mock inventory database - services only
const inventoryDatabase = [
  { id: 101, name: 'HVAC Tune-Up Service', type: 'service' as const, price: 150.00, description: 'Complete HVAC system inspection and tune-up', taxable: false },
  { id: 102, name: 'AC Filter Replacement', type: 'service' as const, price: 45.00, description: 'Replace air conditioning filter', taxable: false },
  { id: 103, name: 'Drain Cleaning', type: 'service' as const, price: 125.00, description: 'Professional drain cleaning service', taxable: false },
  { id: 104, name: 'Water Heater Installation', type: 'service' as const, price: 850.00, description: 'Complete water heater installation', taxable: false },
  { id: 105, name: 'Electrical Inspection', type: 'service' as const, price: 95.00, description: 'Comprehensive electrical system inspection', taxable: false },
  { id: 106, name: 'Annual HVAC Maintenance', type: 'service' as const, price: 499.00, description: 'Complete HVAC system inspection and maintenance', taxable: false },
  { id: 107, name: 'Quarterly Plumbing Check', type: 'service' as const, price: 799.00, description: 'Comprehensive plumbing inspection and maintenance', taxable: false },
  { id: 108, name: 'Monthly Lawn Care', type: 'service' as const, price: 100.00, description: 'Professional lawn maintenance and care', taxable: false },
  { id: 109, name: 'Quarterly Pool Service', type: 'service' as const, price: 299.00, description: 'Pool cleaning and chemical balance', taxable: false },
  { id: 110, name: 'Bi-Annual Pest Control', type: 'service' as const, price: 350.00, description: 'Interior and exterior pest control treatment', taxable: false },
  { id: 115, name: 'Sump Pump Installation', type: 'service' as const, price: 425.00, description: 'Professional sump pump installation', taxable: false },
];

// Mock team members database
const mockTeamMembers = [
  { name: 'Mike Bailey', role: 'T' as const },
  { name: 'Tom Henderson', role: 'T' as const },
  { name: 'John Tom', role: 'T' as const },
  { name: 'Sarah Wilson', role: 'T' as const },
  { name: 'David Chen', role: 'T' as const },
  { name: 'Sarah Johnson', role: 'A' as const },
];

// Stripe-compatible Service Plan interface
interface ServicePlan {
  id: string; // Stripe subscription ID (sub_xxx)
  customerId: string; // Stripe customer ID (cus_xxx)
  clientName: string;
  clientEmail: string;
  propertyAddress: string;
  phone: string;
  serviceName: string; // From inventory (future)
  serviceDescription: string;
  price: number; // Stripe price.unit_amount
  currency: string; // USD, etc.
  billingInterval: 'day' | 'week' | 'month' | 'year'; // Stripe recurring.interval
  intervalCount: number; // Stripe recurring.interval_count
  startDate: string; // Stripe billing_cycle_anchor
  trialDays: number; // Stripe trial_period_days
  cancelAt: string | null; // Stripe cancel_at
  autoRenew: boolean; // !cancel_at_period_end
  collectionMethod: 'charge_automatically' | 'send_invoice';
  paymentMethod: string;
  paymentType?: 'card' | 'cash' | 'other'; // Track original payment type for editing
  discount: number; // Percentage or amount
  status: 'pending' | 'approved' | 'active' | 'canceled' | 'failed' | 'declined'; // Updated flow: pending -> approved -> active
  nextBillingDate: string;
  createdAt: string;
  upsoldBy?: { name: string; type: 'T' | 'A' } | null; // Technician or Admin who sold the upsell
  totalVisits: number; // Total number of visits included in the plan
  visitsUsed: number; // Number of visits already used/completed
}

export function ServicePlansPage() {
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
  const [isCardConfirmOpen, setIsCardConfirmOpen] = useState(false);
  const [isSendConfirmOpen, setIsSendConfirmOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  
  // Plan Details Modal state
  const [isPlanDetailsModalOpen, setIsPlanDetailsModalOpen] = useState(false);
  const [selectedPlanForDetails, setSelectedPlanForDetails] = useState<ServicePlan | null>(null);
  
  // New Job Modal state
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [servicePlanJobData, setServicePlanJobData] = useState<any>(null);
  
  // Hooks
  const { jobs, addJob } = useJobs();
  const navigate = useNavigate();
  const location = useLocation();
  const isStaffView = location.pathname.startsWith('/staff');
  
  // Payment method popups
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);
  const [isCardDeveloperNoteOpen, setIsCardDeveloperNoteOpen] = useState(false);
  const [isPaymentSafetyConfirmOpen, setIsPaymentSafetyConfirmOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'cash' | 'other' | null>(null);
  const [isUpdateCardModalOpen, setIsUpdateCardModalOpen] = useState(false);
  const [showEditPaymentFields, setShowEditPaymentFields] = useState(false);
  const [isPayNowConfirmOpen, setIsPayNowConfirmOpen] = useState(false);
  const [showPayNowCardFields, setShowPayNowCardFields] = useState(false);
  
  // Payment collection modal state
  const [isPaymentCollectionModalOpen, setIsPaymentCollectionModalOpen] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<ServicePlan | null>(null);
  const [paymentCardNumber, setPaymentCardNumber] = useState('');
  const [paymentExpiry, setPaymentExpiry] = useState('');
  const [paymentCVV, setPaymentCVV] = useState('');
  const [paymentCardholderName, setPaymentCardholderName] = useState('');
  const isBillingSetupLocked = isEditMode;
  
  // PDF Preview Modal state
  const [showEstimatePdfModal, setShowEstimatePdfModal] = useState(false);
  const [showInvoicePdfModal, setShowInvoicePdfModal] = useState(false);
  const [selectedPlanForPdf, setSelectedPlanForPdf] = useState<ServicePlan | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter state
  const [searchName, setSearchName] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Date range picker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Client autocomplete state
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<typeof mockClientDatabase[0] | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [filteredClients, setFilteredClients] = useState<typeof mockClientDatabase>([]);
  const clientInputRef = useRef<HTMLDivElement>(null);

  // Service search state
  const [serviceSearch, setServiceSearch] = useState('');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const serviceInputRef = useRef<HTMLDivElement>(null);

  // Upsell owner dropdown state
  const [showUpsellOwnerDropdown, setShowUpsellOwnerDropdown] = useState(false);
  const upsellOwnerInputRef = useRef<HTMLDivElement>(null);

  // Reset to page 1 when filters change
  const resetPage = () => setCurrentPage(1);
  
  // Close date picker when clicking outside
  useEffect(() => {
    if (!isDatePickerOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDatePickerOpen]);

  // Close upsell owner dropdown when clicking outside
  useEffect(() => {
    if (!showUpsellOwnerDropdown) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (upsellOwnerInputRef.current && !upsellOwnerInputRef.current.contains(event.target as Node)) {
        setShowUpsellOwnerDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUpsellOwnerDropdown]);

  // Filter services based on search
  const filteredServices = inventoryDatabase.filter(item =>
    item.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  // Service Plan form state (Stripe-compatible)
  const [planForm, setPlanForm] = useState({
    // Client Information
    clientName: '',
    clientEmail: '',
    propertyAddress: '',
    phone: '',
    
    // Service Details
    serviceName: '', // Will be from inventory dropdown
    serviceDescription: '',
    customNotes: '',
    totalVisits: '', // Number of visits included in the plan
    
    // Billing Setup
    price: '',
    currency: 'USD',
    billingInterval: 'month' as 'day' | 'week' | 'month' | 'year',
    intervalCount: '1',
    startDate: new Date().toISOString().split('T')[0],
    trialDays: '0',
    cancelAt: '',
    autoRenew: true,
    isUpsell: false,
    upsellOwner: '',
    upsellRole: 'T' as 'T' | 'A',
    
    // Payment
    collectionMethod: 'send_payment_link' as 'collect_in_person' | 'send_payment_link',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '0',
    
    // Card Information (for edit mode)
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    cardholderName: '',
  });

  // Sample data for Service Plans (Stripe subscriptions)
  const allServicePlans: ServicePlan[] = [
    {
      id: 'S-101',
      customerId: 'C-101',
      clientName: 'Sarah Johnson',
      clientEmail: 'sarah.johnson@email.com',
      propertyAddress: '123 Main St, Austin, TX 78701',
      phone: '(512) 555-0123',
      serviceName: 'Annual HVAC Maintenance',
      serviceDescription: 'Complete HVAC system inspection and maintenance',
      price: 499,
      currency: 'USD',
      billingInterval: 'year',
      intervalCount: 1,
      startDate: '01/15/2026',
      trialDays: 0,
      cancelAt: null,
      autoRenew: true,
      collectionMethod: 'charge_automatically',
      paymentMethod: 'card_ending_4242',
      paymentType: 'card',
      discount: 0,
      status: 'active',
      nextBillingDate: '01/15/2027',
      createdAt: '01/15/2026',
      upsoldBy: { name: 'Mike Bailey', type: 'T' },
      totalVisits: 12,
      visitsUsed: 8,
    },
    {
      id: 'S-102',
      customerId: 'C-102',
      clientName: 'Michael Chen',
      clientEmail: 'michael.chen@email.com',
      propertyAddress: '456 Oak Ave, Round Rock, TX 78664',
      phone: '(512) 555-0456',
      serviceName: 'Quarterly Plumbing Check',
      serviceDescription: 'Comprehensive plumbing inspection and maintenance',
      price: 799,
      currency: 'USD',
      billingInterval: 'year',
      intervalCount: 1,
      startDate: '02/01/2026',
      trialDays: 14,
      cancelAt: null,
      autoRenew: true,
      collectionMethod: 'send_invoice',
      paymentMethod: 'invoice',
      paymentType: 'other',
      discount: 10,
      status: 'approved',
      nextBillingDate: '02/15/2026',
      createdAt: '02/01/2026',
      upsoldBy: { name: 'Sarah Johnson', type: 'A' },
      totalVisits: 4,
      visitsUsed: 1,
    },
    {
      id: 'S-103',
      customerId: 'C-103',
      clientName: 'Emily Rodriguez',
      clientEmail: 'emily.rodriguez@email.com',
      propertyAddress: '789 Pine Rd, Georgetown, TX 78626',
      phone: '(512) 555-0789',
      serviceName: 'Monthly Lawn Care',
      serviceDescription: 'Professional lawn maintenance and care',
      price: 100,
      currency: 'USD',
      billingInterval: 'month',
      intervalCount: 1,
      startDate: '12/01/2025',
      trialDays: 0,
      cancelAt: null,
      autoRenew: true,
      collectionMethod: 'charge_automatically',
      paymentMethod: 'Cash',
      paymentType: 'cash',
      discount: 0,
      status: 'active',
      nextBillingDate: '03/01/2026',
      createdAt: '12/01/2025',
      upsoldBy: { name: 'Tom Henderson', type: 'T' },
      totalVisits: 24,
      visitsUsed: 16,
    },
    {
      id: 'S-104',
      customerId: 'C-104',
      clientName: 'David Kim',
      clientEmail: 'david.kim@email.com',
      propertyAddress: '321 Elm St, Cedar Park, TX 78613',
      phone: '(512) 555-0321',
      serviceName: 'Quarterly Pool Service',
      serviceDescription: 'Pool cleaning and chemical balance',
      price: 299,
      currency: 'USD',
      billingInterval: 'month',
      intervalCount: 3,
      startDate: '01/10/2026',
      trialDays: 0,
      cancelAt: '07/10/2026',
      autoRenew: false,
      collectionMethod: 'charge_automatically',
      paymentMethod: 'card_ending_8888',
      paymentType: 'card',
      discount: 0,
      status: 'failed',
      nextBillingDate: '04/10/2026',
      createdAt: '01/10/2026',
      upsoldBy: { name: 'Mike Johnson', type: 'T' },
      totalVisits: 8,
      visitsUsed: 8,
    },
    {
      id: 'S-105',
      customerId: 'C-105',
      clientName: 'Robert Thompson',
      clientEmail: 'robert@thompsonent.com',
      propertyAddress: '202 Maple St, Fivetown, USA',
      phone: '(555) 654-3210',
      serviceName: 'Bi-Annual Pest Control',
      serviceDescription: 'Interior and exterior pest control treatment',
      price: 350,
      currency: 'USD',
      billingInterval: 'month',
      intervalCount: 6,
      startDate: '03/01/2026',
      trialDays: 0,
      cancelAt: null,
      autoRenew: false,
      collectionMethod: 'send_invoice',
      paymentMethod: 'Not Collected',
      discount: 0,
      status: 'declined',
      nextBillingDate: '',
      createdAt: '03/01/2026',
      upsoldBy: null,
      totalVisits: 2,
      visitsUsed: 0,
    },
  ];

  // Filter service plans based on user role - Staff only see their own plans
  const servicePlans = location.pathname.startsWith('/staff') 
    ? allServicePlans.filter(plan => plan.upsoldBy?.name === 'Mike Bailey')
    : allServicePlans;

  // Mock services list (future inventory integration)
  const mockServices = [
    { id: 'srv_001', name: 'Annual HVAC Maintenance', description: 'Complete HVAC system inspection and maintenance', defaultPrice: 499 },
    { id: 'srv_002', name: 'Quarterly Plumbing Check', description: 'Comprehensive plumbing inspection and maintenance', defaultPrice: 799 },
    { id: 'srv_003', name: 'Monthly Lawn Care', description: 'Professional lawn maintenance and care', defaultPrice: 100 },
    { id: 'srv_004', name: 'Quarterly Pool Service', description: 'Pool cleaning and chemical balance', defaultPrice: 299 },
    { id: 'srv_005', name: 'Bi-Annual Pest Control', description: 'Interior and exterior pest control treatment', defaultPrice: 350 },
  ];

  // Calculate metrics
  const monthlyRecurringRevenue = servicePlans
    .filter(p => p.status === 'active' || p.status === 'pending' || p.status === 'approved')
    .reduce((sum, p) => {
      // Convert to monthly MRR
      let monthlyAmount = p.price;
      if (p.billingInterval === 'year') monthlyAmount = p.price / 12;
      if (p.billingInterval === 'month') monthlyAmount = p.price;
      if (p.billingInterval === 'week') monthlyAmount = p.price * 4.33;
      if (p.billingInterval === 'day') monthlyAmount = p.price * 30;
      return sum + (monthlyAmount / p.intervalCount);
    }, 0);

  const activeSubscriptions = servicePlans.filter(p => p.status === 'active').length;
  const pendingApprovalSubscriptions = servicePlans.filter(p => p.status === 'pending' || p.status === 'approved').length;
  const canceledSubscriptions = servicePlans.filter(p => p.status === 'canceled').length;

  // Pagination logic
  const filteredServicePlans = servicePlans.filter(plan => {
    const matchesSearch = searchName === '' || 
      plan.clientName.toLowerCase().includes(searchName.toLowerCase()) ||
      plan.clientEmail.toLowerCase().includes(searchName.toLowerCase());
    
    const matchesService = selectedService === '' || plan.serviceName === selectedService;
    const matchesStatus = selectedStatus === '' || plan.status === selectedStatus;
    
    return matchesSearch && matchesService && matchesStatus;
  });

  const totalPages = Math.ceil(filteredServicePlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedServicePlans = filteredServicePlans.slice(startIndex, endIndex);

  const handleDeleteClick = (planId: string) => {
    setPlanToDelete(planId);
    setIsDeleteModalOpen(true);
  };

  // Client autocomplete handlers
  const handleClientSearch = (searchTerm: string) => {
    setClientSearchTerm(searchTerm);
    setPlanForm({ ...planForm, clientName: searchTerm });
    
    if (searchTerm.trim()) {
      const matches = mockClientDatabase.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(matches);
      setShowClientDropdown(true);
    } else {
      setFilteredClients([]);
      setShowClientDropdown(false);
    }
  };

  const handleSelectClient = (client: typeof mockClientDatabase[0]) => {
    setSelectedClient(client);
    setClientSearchTerm(client.name);
    setPlanForm({
      ...planForm,
      clientName: client.name,
      clientEmail: client.email,
      propertyAddress: client.address,
      phone: client.phone,
    });
    setShowClientDropdown(false);
  };

  // Service selection handler
  const handleSelectService = (service: typeof inventoryDatabase[0]) => {
    setServiceSearch(service.name);
    setPlanForm({
      ...planForm,
      serviceName: service.name,
      serviceDescription: service.description,
      price: service.price.toString(),
    });
    setShowServiceDropdown(false);
  };

  // Upsell owner selection handler
  const handleSelectUpsellOwner = (memberName: string) => {
    const member = mockTeamMembers.find(m => m.name === memberName);
    setPlanForm({
      ...planForm,
      upsellOwner: memberName,
      upsellRole: member?.role || 'T',
    });
    setShowUpsellOwnerDropdown(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientInputRef.current && !clientInputRef.current.contains(event.target as Node)) {
        setShowClientDropdown(false);
      }
      if (serviceInputRef.current && !serviceInputRef.current.contains(event.target as Node)) {
        setShowServiceDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditClick = (plan: ServicePlan) => {
    // Extract card last 4 digits if payment method contains card info
    const cardLast4 = plan.paymentMethod.includes('_') ? plan.paymentMethod.split('_').pop() : '';
    
    // Populate form with plan data
    setPlanForm({
      clientName: plan.clientName,
      clientEmail: plan.clientEmail,
      propertyAddress: plan.propertyAddress,
      phone: plan.phone,
      serviceName: plan.serviceName,
      serviceDescription: plan.serviceDescription,
      customNotes: '',
      totalVisits: plan.totalVisits.toString(),
      price: plan.price.toString(),
      currency: plan.currency,
      billingInterval: plan.billingInterval,
      intervalCount: plan.intervalCount.toString(),
      startDate: new Date(plan.startDate).toISOString().split('T')[0],
      trialDays: plan.trialDays.toString(),
      cancelAt: plan.cancelAt || '',
      autoRenew: plan.autoRenew,
      collectionMethod: plan.collectionMethod === 'charge_automatically' ? 'collect_in_person' : 'send_payment_link',
      discountType: 'percentage',
      discountValue: plan.discount.toString(),
      isUpsell: plan.upsoldBy ? true : false,
      upsellOwner: plan.upsoldBy?.name || '',
      upsellRole: plan.upsoldBy?.type || 'T',
      // Card info - show last 4 if available
      cardNumber: cardLast4 ? `•••• •••• •••• ${cardLast4}` : '',
      cardExpiry: '',
      cardCVV: '',
      cardholderName: '',
    });
    setClientSearchTerm(plan.clientName);
    setServiceSearch(plan.serviceName);
    setEditingPlanId(plan.id);
    setIsEditMode(true);
    setIsAddPlanModalOpen(true);
  };

  const confirmDelete = () => {
    if (planToDelete) {
      setServicePlans(servicePlans.filter(plan => plan.id !== planToDelete));
      alert('Subscription canceled successfully!');
    }
    setIsDeleteModalOpen(false);
    setPlanToDelete(null);
  };

  const createServicePlan = () => {
    // Calculate next billing date
    const startDate = new Date(planForm.startDate);
    const nextBilling = new Date(startDate);
    const intervalCount = parseInt(planForm.intervalCount);
    
    switch(planForm.billingInterval) {
      case 'day':
        nextBilling.setDate(nextBilling.getDate() + intervalCount);
        break;
      case 'week':
        nextBilling.setDate(nextBilling.getDate() + (intervalCount * 7));
        break;
      case 'month':
        nextBilling.setMonth(nextBilling.getMonth() + intervalCount);
        break;
      case 'year':
        nextBilling.setFullYear(nextBilling.getFullYear() + intervalCount);
        break;
    }

    // Calculate discount
    const price = parseFloat(planForm.price || '0');
    let discount = 0;
    if (planForm.discountType === 'percentage') {
      discount = parseFloat(planForm.discountValue || '0');
    } else {
      discount = parseFloat(planForm.discountValue || '0');
    }

    if (isEditMode && editingPlanId) {
      // Update existing service plan
      setServicePlans(servicePlans.map(plan => {
        if (plan.id === editingPlanId) {
          // Update payment method if new card info was provided
          let updatedPaymentMethod = plan.paymentMethod;
          if (planForm.cardNumber && planForm.cardNumber.length >= 4 && !planForm.cardNumber.includes('•')) {
            // Extract last 4 digits from the new card number
            const last4 = planForm.cardNumber.replace(/\s/g, '').slice(-4);
            updatedPaymentMethod = `card_ending_${last4}`;
          }
          
          return {
            ...plan,
            clientName: planForm.clientName,
            clientEmail: planForm.clientEmail,
            propertyAddress: planForm.propertyAddress,
            phone: planForm.phone,
            serviceName: planForm.serviceName,
            serviceDescription: planForm.serviceDescription,
            price: price,
            currency: planForm.currency,
            billingInterval: planForm.billingInterval,
            intervalCount: parseInt(planForm.intervalCount),
            startDate: new Date(planForm.startDate).toLocaleDateString(),
            trialDays: parseInt(planForm.trialDays),
            cancelAt: planForm.cancelAt || null,
            autoRenew: planForm.autoRenew,
            collectionMethod: planForm.collectionMethod === 'collect_in_person' ? 'charge_automatically' : 'send_invoice',
            paymentMethod: updatedPaymentMethod,
            discount: discount,
            nextBillingDate: nextBilling.toLocaleDateString(),
            totalVisits: parseInt(planForm.totalVisits) || 0,
            upsoldBy: planForm.isUpsell ? { name: planForm.upsellOwner, type: planForm.upsellRole } : plan.upsoldBy,
          };
        }
        return plan;
      }));
      alert('Service plan updated successfully!' + (planForm.cardNumber && !planForm.cardNumber.includes('•') ? '\n\nCard information has been updated.' : ''));
    } else {
      // Create new service plan
      // Generate proper S-XXX ID format
      const existingPlanNumbers = servicePlans
        .map(plan => {
          const match = plan.id.match(/^S-(\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter(num => num > 0);
      const nextNumber = existingPlanNumbers.length > 0 ? Math.max(...existingPlanNumbers) + 1 : 101;
      const newPlanId = `S-${nextNumber}`;

      const newPlan: ServicePlan = {
        id: newPlanId,
        customerId: selectedClient?.id || `C-${Math.floor(Math.random() * 900) + 100}`,
        clientName: planForm.clientName,
        clientEmail: planForm.clientEmail,
        propertyAddress: planForm.propertyAddress,
        phone: planForm.phone,
        serviceName: planForm.serviceName,
        serviceDescription: planForm.serviceDescription,
        price: price,
        currency: planForm.currency,
        billingInterval: planForm.billingInterval,
        intervalCount: parseInt(planForm.intervalCount),
        startDate: new Date(planForm.startDate).toLocaleDateString(),
        trialDays: parseInt(planForm.trialDays),
        cancelAt: planForm.cancelAt || null,
        autoRenew: planForm.autoRenew,
        collectionMethod: planForm.collectionMethod === 'collect_in_person' ? 'charge_automatically' : 'send_invoice',
        paymentMethod: selectedPaymentMethod === 'card' ? 'Card (Stripe)' : selectedPaymentMethod === 'cash' ? 'Cash' : selectedPaymentMethod === 'other' ? 'Other' : 'Payment Link',
        paymentType: selectedPaymentMethod || undefined,
        discount: discount,
        status: 'pending',
        nextBillingDate: nextBilling.toLocaleDateString(),
        createdAt: new Date().toLocaleDateString(),
        upsoldBy: planForm.isUpsell && planForm.upsellOwner ? { name: planForm.upsellOwner, type: planForm.upsellRole } : null,
        totalVisits: parseInt(planForm.totalVisits) || 0,
        visitsUsed: 0,
      };

      // Add to service plans list
      setServicePlans([newPlan, ...servicePlans]);
    }

    // Reset form and edit mode
    setPlanForm({
      clientName: '',
      clientEmail: '',
      propertyAddress: '',
      phone: '',
      serviceName: '',
      serviceDescription: '',
      customNotes: '',
      totalVisits: '',
      price: '',
      currency: 'USD',
      billingInterval: 'month',
      intervalCount: '1',
      startDate: new Date().toISOString().split('T')[0],
      trialDays: '0',
      cancelAt: '',
      autoRenew: true,
      isUpsell: false,
      upsellOwner: '',
      upsellRole: 'T' as 'T' | 'A',
      collectionMethod: 'send_payment_link',
      discountType: 'percentage',
      discountValue: '0',
    });
    setIsEditMode(false);
    setEditingPlanId(null);
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#b9df10';
      case 'pending':
        return '#28bdf2';
      case 'approved':
        return '#9473ff'; // Purple for approved
      case 'canceled':
        return '#f16a6a';
      case 'failed':
        return '#f97316'; // Orange for failed
      case 'declined':
        return '#f16a6a'; // Red for declined
      default:
        return '#9ca3af';
    }
  };

  const formatBillingInterval = (interval: string, count: number) => {
    const intervalText = interval === 'month' ? 'Monthly' : 
                        interval === 'year' ? 'Yearly' : 
                        interval === 'week' ? 'Weekly' : 
                        interval === 'day' ? 'Daily' : interval;
    
    if (count === 1) return intervalText;
    return `Every ${count} ${interval}s`;
  };

  return (
    <div className="p-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <p className="text-sm text-gray-600 mb-2">Active Total Value</p>
          <p className="text-2xl font-bold text-[#051046]">
            ${Math.round(servicePlans.filter(plan => plan.status === 'active').reduce((sum, plan) => sum + plan.price, 0)).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <p className="text-sm text-gray-600 mb-2">Active</p>
          <p className="text-2xl font-bold text-[#051046]">{activeSubscriptions}</p>
        </div>

        <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <p className="text-sm text-gray-600 mb-2">Pending Approval</p>
          <p className="text-2xl font-bold text-[#051046]">{pendingApprovalSubscriptions}</p>
        </div>

        <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <p className="text-sm text-gray-600 mb-2">Canceled</p>
          <p className="text-2xl font-bold text-[#051046]">{canceledSubscriptions}</p>
        </div>
      </div>

      {/* Staff Role Notice */}
      {location.pathname.startsWith('/staff') && (
        <div className="bg-blue-50 border border-blue-200 rounded-[15px] p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-blue-800">
              <strong>Staff View:</strong> You are viewing only the service plans you have created. This list shows your personal service plan portfolio.
            </p>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 mb-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        {/* Filters Grid */}
        <div className="flex flex-wrap gap-4">
        {/* Search by Name/Email */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchName}
            onChange={(e) => { setSearchName(e.target.value); resetPage(); }}
            placeholder="Search..."
            className="w-[180px] h-[44px] pl-10 pr-4 border border-[#e8e8e8] rounded-[15px] text-[#051046] text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Date Range */}
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

        {/* Service Filter */}
        <div>
          <select
            value={selectedService}
            onChange={(e) => { setSelectedService(e.target.value); resetPage(); }}
            className="w-[180px] h-[44px] px-4 border border-[#e8e8e8] rounded-[15px] text-[#051046] text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">All Services</option>
            {mockServices.map(service => (
              <option key={service.id} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); resetPage(); }}
            className="w-[180px] h-[44px] px-4 border border-[#e8e8e8] rounded-[15px] text-[#051046] text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="active">Active</option>
            <option value="canceled">Canceled</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Add Plan Button */}
        <div className="ml-auto">
          <button
            onClick={() => {
              setIsEditMode(false);
              setEditingPlanId(null);
              setIsAddPlanModalOpen(true);
            }}
            className="w-[160px] bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[32px] flex items-center justify-center gap-2 text-[16px] px-[24px] py-[10px] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Plan
          </button>
        </div>
        </div>
      </div>

      {/* Service Plans Table */}
      <div className="bg-white rounded-[20px] border border-[#e2e8f0]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#051046]">Subscription ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#051046]">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#051046]">Service</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#051046]">Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#051046]">Visits</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#051046]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#051046]">Upsell</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#051046]">Next Billing</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#051046]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedServicePlans.map((plan) => (
                <tr 
                  key={plan.id} 
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedPlanForDetails(plan);
                    setIsPlanDetailsModalOpen(true);
                  }}
                >
                  <td className="px-6 py-4 text-sm text-[#051046] font-mono">{plan.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#051046] font-medium">{plan.clientName}</div>
                    <div className="text-xs text-gray-500">{plan.clientEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#051046] font-medium">{plan.serviceName}</div>
                    <div className="text-xs text-gray-500">{plan.propertyAddress}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#051046] font-semibold">
                      ${plan.price} {plan.currency}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatBillingInterval(plan.billingInterval, plan.intervalCount)}
                    </div>
                    {plan.discount > 0 && (
                      <div className="text-xs text-green-600">-{plan.discount}% discount</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {plan.status === 'active' || plan.status === 'failed' ? (
                      <>
                        <div className="text-sm text-[#051046] font-semibold">
                          {plan.totalVisits - plan.visitsUsed} remaining
                        </div>
                        <div className="text-xs text-gray-500">
                          {plan.visitsUsed}/{plan.totalVisits} used
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getStatusDotColor(plan.status) }}
                      />
                      <span className="text-sm text-[#051046]">
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1).replace('_', ' ')}
                      </span>
                      {plan.status === 'failed' && (
                        <div className="group relative inline-block">
                          <AlertCircle className="w-4 h-4 text-orange-500 cursor-help" />
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-10" style={{ width: '220px', whiteSpace: 'normal' }}>
                            Payment failed. This could be due to expired card, insufficient funds, or other payment issues. Click to investigate.
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      )}
                      {plan.status === 'declined' && (
                        <div className="group relative inline-block">
                          <AlertCircle className="w-4 h-4 text-red-500 cursor-help" />
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-10" style={{ width: '220px', whiteSpace: 'normal' }}>
                            This service plan estimate was declined by the customer.
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#051046]">
                    {plan.status === 'active' || plan.status === 'failed' ? (
                      plan.upsoldBy ? (
                        <div className="flex flex-col items-start gap-1">
                          <div className="group relative inline-block">
                            <div className="w-4 h-4 bg-[rgb(185,223,16)] flex items-center justify-center rounded-sm">
                              <span className="text-white text-[10px] font-bold leading-none">U</span>
                            </div>
                            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                              Upsell on the plan
                            </div>
                          </div>
                          <span>
                            {plan.upsoldBy.name}{' '}
                            <span className="font-semibold group relative inline-block cursor-help">
                              ({plan.upsoldBy.type})
                              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                                {plan.upsoldBy.type === 'A' ? 'Admin' : 'Technician'}
                              </span>
                            </span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#051046]">
                    {plan.status === 'active' || plan.status === 'failed' ? plan.nextBillingDate : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(plan)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit service plan"
                      >
                        <Edit2 className="w-4 h-4 text-[#8b5cf6]" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(plan.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Delete service plan"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                      {plan.status === 'approved' && (
                        <button
                          onClick={() => {
                            setSelectedPlanForPayment(plan);
                            setIsPaymentCollectionModalOpen(true);
                          }}
                          className="px-3 py-1 bg-[#9473ff] text-white rounded-[15px] text-xs hover:bg-[#7f5fd9] transition-colors flex items-center gap-2"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredServicePlans.length > 0 && (
          <div className="border-t border-[#e2e8f0] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredServicePlans.length)} of {filteredServicePlans.length} subscriptions
              </div>
              
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Service Plan Modal - Stripe Compatible */}
      {isAddPlanModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-4xl border border-[#e2e8f0] overflow-hidden">
            <div className="max-h-[90vh] overflow-y-auto p-[10px] m-[10px]">
              <div className="sticky top-0 bg-white border-b border-[#e2e8f0] px-6 py-4 z-50 flex items-center justify-between rounded-t-[20px]">
                <div>
                  <h2 className="text-xl font-semibold text-[#051046]">
                    {isEditMode ? 'Edit Service Plan' : 'Create Service Plan'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {isEditMode ? 'Update service subscription details' : 'Set up a recurring service subscription'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAddPlanModalOpen(false);
                    setIsEditMode(false);
                    setEditingPlanId(null);
                    setShowEditPaymentFields(false);
                    setClientSearchTerm('');
                    setSelectedClient(null);
                    setShowClientDropdown(false);
                    setFilteredClients([]);
                    setServiceSearch('');
                    setShowServiceDropdown(false);
                    setPlanForm({
                      clientName: '',
                      clientEmail: '',
                      propertyAddress: '',
                      phone: '',
                      serviceName: '',
                      serviceDescription: '',
                      customNotes: '',
                      totalVisits: '',
                      price: '',
                      currency: 'USD',
                      billingInterval: 'month',
                      intervalCount: '1',
                      startDate: new Date().toISOString().split('T')[0],
                      trialDays: '0',
                      cancelAt: '',
                      autoRenew: true,
                      isUpsell: false,
                      upsellOwner: '',
                      upsellRole: 'T' as 'T' | 'A',
                      collectionMethod: 'send_payment_link',
                      discountType: 'percentage',
                      discountValue: '0',
                      cardNumber: '',
                      cardExpiry: '',
                      cardCVV: '',
                      cardholderName: '',
                    });
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#051046]" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* 1. CLIENT INFORMATION */}
                <div>
                  <h3 className="text-lg font-semibold text-[#051046] mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#9473ff] text-white flex items-center justify-center text-sm font-bold">1</div>
                    Client Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-10">
                    <div ref={clientInputRef}>
                      <label className="block text-sm font-medium text-[#051046] mb-2">
                        Client Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={clientSearchTerm}
                          onChange={(e) => handleClientSearch(e.target.value)}
                          onFocus={() => {
                            if (clientSearchTerm && filteredClients.length > 0) {
                              setShowClientDropdown(true);
                            }
                          }}
                          placeholder="John Doe"
                          className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#051046] mb-2">
                        Email Address <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 ml-1">(Required for Stripe)</span>
                      </label>
                      <input
                        type="email"
                        value={planForm.clientEmail}
                        onChange={(e) => setPlanForm({ ...planForm, clientEmail: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#051046] mb-2">
                        Property Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={planForm.propertyAddress}
                        onChange={(e) => setPlanForm({ ...planForm, propertyAddress: e.target.value })}
                        placeholder="123 Main St, Austin, TX 78701"
                        className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#051046] mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={planForm.phone}
                        onChange={(e) => setPlanForm({ ...planForm, phone: e.target.value })}
                        placeholder="(512) 555-0123"
                        className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. SERVICE DETAILS */}
                <div>
                  <h3 className="text-lg font-semibold text-[#051046] mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#9473ff] text-white flex items-center justify-center text-sm font-bold">2</div>
                    Service Details
                  </h3>
                  <div className="space-y-4 ml-10">
                    <div ref={serviceInputRef}>
                      <label className="block text-sm font-medium text-[#051046] mb-2">
                        Service <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 ml-1">(From Inventory)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={serviceSearch}
                          onChange={(e) => setServiceSearch(e.target.value)}
                          onFocus={() => setShowServiceDropdown(true)}
                          placeholder="Search services..."
                          className="w-full px-4 py-2 pr-10 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        
                        {/* Service Dropdown */}
                        {showServiceDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e8e8e8] rounded-[15px] shadow-lg z-30 max-h-80 overflow-y-auto">
                            {filteredServices.length > 0 ? (
                              <div className="py-2">
                                {filteredServices.map((service) => (
                                  <div
                                    key={service.id}
                                    onClick={() => handleSelectService(service)}
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="text-sm font-medium text-[#051046] break-words">{service.name}</span>
                                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#E2F685] text-green-700">
                                            Service
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="text-[12px] text-[#6a7282]">
                                            {service.taxable ? 'Taxable' : 'Non-taxable'}
                                          </span>
                                        </div>
                                      </div>
                                      <span className="text-sm font-semibold text-[#9473ff] whitespace-nowrap flex-shrink-0">
                                        ${service.price.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="px-4 py-6 text-center text-sm text-gray-500">
                                No services found matching "{serviceSearch}"
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {planForm.serviceName && (
                      <div className="p-4 bg-gray-50 border border-[#e2e8f0] rounded-[15px]">
                        <p className="text-sm font-medium text-[#051046] mb-1">Service Description</p>
                        <p className="text-sm text-gray-600">{planForm.serviceDescription}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-[#051046] mb-2">Custom Notes (Optional)</label>
                      <textarea
                        value={planForm.customNotes}
                        onChange={(e) => setPlanForm({ ...planForm, customNotes: e.target.value })}
                        placeholder="Any special requirements or notes..."
                        className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 min-h-[80px]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#051046] mb-2">
                        Number of Visits Included <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={planForm.totalVisits}
                        onChange={(e) => setPlanForm({ ...planForm, totalVisits: e.target.value })}
                        placeholder="12"
                        className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Total number of visits/services included in this plan
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. BILLING SETUP */}
                <div>
                  <h3 className="text-lg font-semibold text-[#051046] mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#9473ff] text-white flex items-center justify-center text-sm font-bold">3</div>
                    Billing Setup
                  </h3>
                  <div className="space-y-4 ml-10">
                    <div>
                      <label className="block text-sm font-medium text-[#051046] mb-2">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#051046]">$</span>
                        <input
                          type="number"
                          value={planForm.price}
                          onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                          placeholder="0.00"
                          disabled={isBillingSetupLocked}
                          className={`w-full pl-8 pr-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 ${isBillingSetupLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#051046] mb-2">
                          Billing Cycle <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={planForm.billingInterval}
                          onChange={(e) => setPlanForm({ ...planForm, billingInterval: e.target.value as any })}
                          disabled={isBillingSetupLocked}
                          className={`w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 ${isBillingSetupLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="day">Day</option>
                          <option value="week">Week</option>
                          <option value="month">Month</option>
                          <option value="year">Year</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#051046] mb-2">
                          Charge Every
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={planForm.intervalCount}
                            onChange={(e) => setPlanForm({ ...planForm, intervalCount: e.target.value })}
                            placeholder="1"
                            disabled={isBillingSetupLocked}
                            className={`w-20 px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 ${isBillingSetupLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                          />
                          <span className="text-sm text-[#051046] font-medium">
                            {planForm.intervalCount === '1' ? planForm.billingInterval : `${planForm.billingInterval}s`}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Charge every {planForm.intervalCount || '1'} {planForm.intervalCount === '1' ? planForm.billingInterval : `${planForm.billingInterval}s`}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#051046] mb-2">
                          Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={planForm.startDate}
                          onChange={(e) => setPlanForm({ ...planForm, startDate: e.target.value })}
                          disabled={isBillingSetupLocked}
                          className={`w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 ${isBillingSetupLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#051046] mb-2">
                          End Subscription On (Optional)
                        </label>
                        <input
                          type="date"
                          value={planForm.cancelAt}
                          onChange={(e) => setPlanForm({ ...planForm, cancelAt: e.target.value })}
                          disabled={isBillingSetupLocked}
                          className={`w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 ${isBillingSetupLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Last charge occurs before this date
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-end">
                        <div className="flex items-center justify-between w-full p-4 border border-[#e2e8f0] rounded-[15px]">
                          <label className="text-sm font-medium text-[#051046]">Auto-Renew</label>
                          <button
                            type="button"
                            onClick={() => setPlanForm({ ...planForm, autoRenew: !planForm.autoRenew })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${planForm.autoRenew ? 'bg-[#b9df10]' : 'bg-[#f16a6a]'}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                planForm.autoRenew ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-4 border border-[#e2e8f0] rounded-[15px]">
                        <input
                          type="checkbox"
                          id="isUpsell"
                          checked={planForm.isUpsell}
                          onChange={(e) => setPlanForm({ ...planForm, isUpsell: e.target.checked })}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-600"
                        />
                        <label htmlFor="isUpsell" className="text-sm font-medium text-[#051046] flex items-center gap-2">
                          Is this an upsell?
                          <div className="w-5 h-5 bg-[rgb(185,223,16)] flex items-center justify-center rounded-sm">
                            <span className="text-white text-xs font-bold">U</span>
                          </div>
                        </label>
                      </div>

                      {/* Upsell Owner and Role Fields - Show only when isUpsell is checked */}
                      {planForm.isUpsell && (
                        <div className="col-span-2 grid grid-cols-2 gap-4 mt-4">
                          {/* Upsell Owner */}
                          <div>
                            <label className="block text-sm font-medium text-[#051046] mb-2">
                              Upsell Owner
                            </label>
                            <div className="relative" ref={upsellOwnerInputRef}>
                              <input
                                type="text"
                                value={planForm.upsellOwner}
                                onChange={(e) => {
                                  setPlanForm({ ...planForm, upsellOwner: e.target.value });
                                  setShowUpsellOwnerDropdown(true);
                                }}
                                onFocus={() => setShowUpsellOwnerDropdown(true)}
                                placeholder="Select team member"
                                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                              />
                              {showUpsellOwnerDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e8e8e8] rounded-[15px] shadow-lg z-10 max-h-60 overflow-y-auto">
                                  {mockTeamMembers
                                    .filter(member => 
                                      member.name.toLowerCase().includes(planForm.upsellOwner.toLowerCase())
                                    )
                                    .map((member, index) => (
                                      <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleSelectUpsellOwner(member.name)}
                                        className="w-full px-4 py-2 text-left text-sm text-[#051046] hover:bg-purple-50 transition-colors flex items-center justify-between"
                                      >
                                        <span>{member.name}</span>
                                        <span className="text-xs text-gray-500">
                                          {member.role === 'A' ? 'Admin' : 'Technician'}
                                        </span>
                                      </button>
                                    ))}
                                  {mockTeamMembers.filter(member => 
                                    member.name.toLowerCase().includes(planForm.upsellOwner.toLowerCase())
                                  ).length === 0 && (
                                    <div className="px-4 py-2 text-sm text-gray-500">
                                      No team members found
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Upsell Role */}
                          <div>
                            <label className="block text-sm font-medium text-[#051046] mb-2">
                              Upsell Role
                            </label>
                            <select
                              value={planForm.upsellRole}
                              onChange={(e) => setPlanForm({ ...planForm, upsellRole: e.target.value as 'T' | 'A' })}
                              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                            >
                              <option value="T">Technician (T)</option>
                              <option value="A">Admin (A)</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-[15px]">
                      <p className="text-xs text-[#f16a6a]">Note: Turning off auto-renew stops the plan at the end of the billing cycle.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#051046] mb-2">Apply Discount (Optional)</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                          value={planForm.discountType}
                          onChange={(e) => setPlanForm({ ...planForm, discountType: e.target.value as any })}
                          disabled={isBillingSetupLocked}
                          className={`w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 ${isBillingSetupLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount ($)</option>
                        </select>

                        <input
                          type="number"
                          min="0"
                          value={planForm.discountValue}
                          onChange={(e) => setPlanForm({ ...planForm, discountValue: e.target.value })}
                          placeholder="0"
                          disabled={isBillingSetupLocked}
                          className={`w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 ${isBillingSetupLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>

                    {/* Price Summary */}
                    {planForm.price && (
                      <div className="p-4 bg-[#f8f5ff] border border-[#e2e8f0] rounded-[15px]">
                        <p className="text-sm font-semibold text-[#051046] mb-3">Price Summary</p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Subtotal</span>
                            <span className="text-sm font-medium text-[#051046]">
                              ${parseFloat(planForm.price || '0').toFixed(2)} {planForm.currency}
                            </span>
                          </div>
                          {parseFloat(planForm.discountValue) > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                Discount {planForm.discountType === 'percentage' ? `(${planForm.discountValue}%)` : ''}
                              </span>
                              <span className="text-sm font-medium text-green-600">
                                -${(() => {
                                  const price = parseFloat(planForm.price || '0');
                                  if (planForm.discountType === 'percentage') {
                                    return ((price * parseFloat(planForm.discountValue)) / 100).toFixed(2);
                                  }
                                  return parseFloat(planForm.discountValue).toFixed(2);
                                })()}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Tax <span className="text-xs text-gray-400">(Set in Inventory)</span>
                            </span>
                            <span className="text-sm font-medium text-[#051046]">
                              $0.00 {planForm.currency}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                            <span className="text-sm font-bold text-[#051046]">Total</span>
                            <span className="text-lg font-bold text-[#8b5cf6]">
                              ${(() => {
                                const price = parseFloat(planForm.price || '0');
                                let discount = 0;
                                if (planForm.discountType === 'percentage') {
                                  discount = (price * parseFloat(planForm.discountValue || '0')) / 100;
                                } else {
                                  discount = parseFloat(planForm.discountValue || '0');
                                }
                                return (price - discount).toFixed(2);
                              })()} {planForm.currency}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. PAYMENT INFORMATION (Edit Mode Only) - Only show for Active and Failed plans */}
                {isEditMode && editingPlanId && 
                 (servicePlans.find(p => p.id === editingPlanId)?.status === 'active' || 
                  servicePlans.find(p => p.id === editingPlanId)?.status === 'failed') && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#051046] mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#9473ff] text-white flex items-center justify-center text-sm font-bold">4</div>
                      Payment Information
                    </h3>
                    <div className="space-y-4 ml-10">
                      <div className="p-4 bg-gray-50 border border-[#e2e8f0] rounded-[15px] relative">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm font-medium text-[#051046]">Original Payment Type</p>
                          <button
                            onClick={() => setShowEditPaymentFields(!showEditPaymentFields)}
                            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                            title="Edit payment method"
                          >
                            <Edit2 className="w-4 h-4 text-[#051046]" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {(() => {
                              const plan = servicePlans.find(p => p.id === editingPlanId);
                              if (!plan?.paymentType) return 'Not specified';
                              if (plan.paymentType === 'card') return 'Card';
                              if (plan.paymentType === 'cash') return 'Cash';
                              if (plan.paymentType === 'other') return 'Other (Check, Wire Transfer, etc.)';
                              return plan.paymentType;
                            })()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Payment method: {servicePlans.find(p => p.id === editingPlanId)?.paymentMethod || 'N/A'}</p>
                      </div>

                      {/* Card Update Fields - Show when pen icon is clicked, payment type is card, and status is active or failed */}
                      {showEditPaymentFields && servicePlans.find(p => p.id === editingPlanId)?.paymentType === 'card' && 
                       (servicePlans.find(p => p.id === editingPlanId)?.status === 'active' || 
                        servicePlans.find(p => p.id === editingPlanId)?.status === 'failed') && (
                        <div className="p-4 border-2 border-[#28bdf2] rounded-[15px] bg-blue-50">
                          <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 text-[#28bdf2]" />
                            <h4 className="font-semibold text-[#051046]">Update Card Information</h4>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Card Number</label>
                              <input
                                type="text"
                                value={planForm.cardNumber}
                                onChange={(e) => {
                                  let value = e.target.value;
                                  // Clear masked value if user starts typing
                                  if (planForm.cardNumber.includes('•')) {
                                    value = e.target.value.replace(/[^0-9]/g, '');
                                  } else {
                                    value = value.replace(/\s/g, '');
                                  }
                                  if (/^\d*$/.test(value) && value.length <= 16) {
                                    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                                    setPlanForm({ ...planForm, cardNumber: formatted });
                                  }
                                }}
                                onFocus={(e) => {
                                  // Clear masked value on focus
                                  if (planForm.cardNumber.includes('•')) {
                                    setPlanForm({ ...planForm, cardNumber: '' });
                                  }
                                }}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#28bdf2]"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Expiry Date</label>
                                <input
                                  type="text"
                                  value={planForm.cardExpiry}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 4) {
                                      const formatted = value.length >= 3 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
                                      setPlanForm({ ...planForm, cardExpiry: formatted });
                                    }
                                  }}
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#28bdf2]"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">CVV</label>
                                <input
                                  type="text"
                                  value={planForm.cardCVV}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 4) {
                                      setPlanForm({ ...planForm, cardCVV: value });
                                    }
                                  }}
                                  placeholder="123"
                                  maxLength={4}
                                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#28bdf2]"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Cardholder Name</label>
                              <input
                                type="text"
                                value={planForm.cardholderName}
                                onChange={(e) => setPlanForm({ ...planForm, cardholderName: e.target.value })}
                                placeholder="John Doe"
                                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#28bdf2]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Billing ZIP Code</label>
                              <input
                                type="text"
                                placeholder="12345"
                                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#28bdf2]"
                              />
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => setShowEditPaymentFields(false)}
                                className="flex-1 px-4 py-2 border border-[#e8e8e8] text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  setShowEditPaymentFields(false);
                                  alert('Card information updated successfully! 💳\n\nThe subscription will continue with the new payment method.');
                                }}
                                className="flex-1 px-4 py-2 bg-[#28bdf2] text-white rounded-[32px] hover:bg-[#1da8d9] transition-colors"
                              >
                                Update Card
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Developer Note */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-[15px]">
                  <p className="text-xs font-semibold text-blue-900 mb-1">🔧 Developer Note:</p>
                  <p className="text-xs text-blue-800">
                    This form maps directly to Stripe's API: customer.create(), price.create() (if needed), and subscription.create().
                    All fields are Stripe-compatible for seamless backend integration.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t border-[#e2e8f0] px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsAddPlanModalOpen(false);
                    setClientSearchTerm('');
                    setSelectedClient(null);
                    setShowClientDropdown(false);
                    setFilteredClients([]);
                    setServiceSearch('');
                    setShowServiceDropdown(false);
                    // Reset form
                    setPlanForm({
                      clientName: '',
                      clientEmail: '',
                      propertyAddress: '',
                      phone: '',
                      serviceName: '',
                      serviceDescription: '',
                      customNotes: '',
                      price: '',
                      currency: 'USD',
                      billingInterval: 'month',
                      intervalCount: '1',
                      startDate: new Date().toISOString().split('T')[0],
                      trialDays: '0',
                      cancelAt: '',
                      autoRenew: true,
                      isUpsell: false,
                      upsellOwner: '',
                      upsellRole: 'T' as 'T' | 'A',
                      collectionMethod: 'send_payment_link',
                      discountType: 'percentage',
                      discountValue: '0',
                    });
                  }}
                  className="px-6 py-2 border border-[#e8e8e8] text-[#051046] rounded-[25px] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                
                {/* Action Buttons */}
                {isEditMode ? (
                  <button
                    onClick={() => {
                      // Validate required fields
                      if (!planForm.clientName || !planForm.clientEmail || !planForm.propertyAddress || !planForm.serviceName || !planForm.price) {
                        alert('Please fill in all required fields (marked with *)');
                        return;
                      }
                      createServicePlan();
                      setIsAddPlanModalOpen(false);
                      setShowEditPaymentFields(false);
                      setIsEditMode(false);
                      setEditingPlanId(null);
                    }}
                    className="px-6 py-2 bg-[#9473ff] text-white rounded-[25px] hover:bg-[#7f5fd9] transition-colors"
                  >
                    Save Changes
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        // Validate required fields
                        if (!planForm.clientName || !planForm.clientEmail || !planForm.propertyAddress || !planForm.serviceName || !planForm.price) {
                          alert('Please fill in all required fields (marked with *)');
                          return;
                        }
                        // Create a temporary plan object for PDF preview
                        const tempPlan: ServicePlan = {
                          id: 'E-' + Math.floor(Math.random() * 1000),
                          customerId: 'C-' + Math.floor(Math.random() * 1000),
                          clientName: planForm.clientName,
                          clientEmail: planForm.clientEmail,
                          propertyAddress: planForm.propertyAddress,
                          phone: planForm.clientPhone,
                          serviceName: planForm.serviceName,
                          serviceDescription: planForm.serviceDescription,
                          price: parseFloat(planForm.price),
                          currency: planForm.currency,
                          billingInterval: planForm.billingInterval,
                          intervalCount: planForm.intervalCount,
                          startDate: planForm.startDate,
                          trialDays: planForm.trialDays,
                          cancelAt: planForm.cancelAt,
                          autoRenew: planForm.autoRenew,
                          collectionMethod: planForm.collectionMethod,
                          paymentMethod: 'Not Set',
                          discount: parseFloat(planForm.discountValue || '0'),
                          status: 'pending',
                          nextBillingDate: new Date(new Date(planForm.startDate).getTime() + planForm.trialDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                          createdAt: new Date().toISOString().split('T')[0],
                          totalVisits: planForm.totalVisits,
                          visitsUsed: 0
                        };
                        setSelectedPlanForPdf(tempPlan);
                        setShowEstimatePdfModal(true);
                      }}
                      className="px-6 py-2 border border-[#8b5cf6] text-[#8b5cf6] rounded-[25px] hover:bg-purple-50 transition-colors"
                    >
                      View
                    </button>
                    
                    <button
                      onClick={() => {
                        // Validate required fields
                        if (!planForm.clientName || !planForm.clientEmail || !planForm.propertyAddress || !planForm.serviceName || !planForm.price) {
                          alert('Please fill in all required fields (marked with *)');
                          return;
                        }
                        setIsSendConfirmOpen(true);
                      }}
                      className="px-6 py-2 bg-[#9473ff] text-white rounded-[25px] hover:bg-[#7f5fd9] transition-colors"
                    >
                      Send
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plan Details Modal */}
      <PlanDetailsModal 
        isOpen={isPlanDetailsModalOpen}
        onClose={() => {
          setIsPlanDetailsModalOpen(false);
          setSelectedPlanForDetails(null);
        }}
        plan={selectedPlanForDetails}
        onScheduleJob={(planData) => {
          setServicePlanJobData(planData);
          setIsNewJobModalOpen(true);
          setIsPlanDetailsModalOpen(false);
        }}
        onEditPlan={(plan) => {
          setIsPlanDetailsModalOpen(false);
          setSelectedPlanForDetails(null);
          handleEditClick(plan);
        }}
        onPayNow={(plan) => {
          setSelectedPlanForPayment(plan);
          setIsPaymentCollectionModalOpen(true);
          setIsPlanDetailsModalOpen(false);
        }}
        onViewInvoice={(plan) => {
          setSelectedPlanForPdf(plan);
          setShowInvoicePdfModal(true);
          setIsPlanDetailsModalOpen(false);
        }}
      />

      {/* New Job Modal */}
      <NewJobModal
        isOpen={isNewJobModalOpen}
        onClose={() => {
          setIsNewJobModalOpen(false);
          setServicePlanJobData(null);
        }}
        onSubmit={(jobData) => {
          // Generate proper J-XXX ID format
          const existingJobNumbers = jobs
            .map(job => {
              const match = job.id.match(/^J-(\d+)$/);
              return match ? parseInt(match[1], 10) : 0;
            })
            .filter(num => num > 0);
          
          const maxJobNumber = existingJobNumbers.length > 0 ? Math.max(...existingJobNumbers) : 100;
          const nextJobNumber = maxJobNumber + 1;
          const properJobId = `J-${nextJobNumber}`;
          
          // Replace temporary ID with proper J-XXX format
          const jobWithProperID = { ...jobData, id: properJobId };
          
          addJob(jobWithProperID);
          setIsNewJobModalOpen(false);
          setServicePlanJobData(null);
          // Navigate after modal closes to avoid state conflicts
          setTimeout(() => {
            navigate(`/admin/jobs/details/${properJobId}`);
          }, 100);
        }}
        onAddClientClick={() => {
          // Can implement add client from here if needed
        }}
        onCustomValueModalOpen={() => {
          // Can implement custom value modal if needed
        }}
        jobTypes={['Service', 'Repair', 'Installation', 'Maintenance', 'Inspection']}
        jobSources={['Google', 'Facebook', 'Referral', 'Direct', 'Website', 'Phone Call']}
        initialData={servicePlanJobData ? {
          clientName: servicePlanJobData.clientName,
          clientEmail: servicePlanJobData.clientEmail,
          clientPhone: servicePlanJobData.clientPhone,
          address: servicePlanJobData.address,
          jobType: servicePlanJobData.serviceName,
          jobDescription: servicePlanJobData.serviceDescription,
          servicePlanId: servicePlanJobData.servicePlanId,
        } : undefined}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-[20px] w-full max-w-md border border-[#e2e8f0] p-6"
            style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
          >
            <h3 className="text-lg font-semibold text-[#051046] mb-4">Cancel Subscription</h3>
            <p className="text-[#051046] mb-6">
              Are you sure you want to cancel this subscription? The customer will lose access at the end of the current billing period.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2 border border-[#e8e8e8] text-[#051046] rounded-[15px] hover:bg-gray-50 transition-colors"
              >
                No, Keep It
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-[15px] hover:bg-red-600 transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estimate PDF View Modal */}
      {showEstimatePdfModal && selectedPlanForPdf && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEstimatePdfModal(false);
              setSelectedPlanForPdf(null);
            }
          }}
        >
          <div className="bg-white rounded-[20px] w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[#e2e8f0]">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between rounded-t-[20px]">
              <div className="flex-1"></div>
              <h2 className="text-xl font-bold text-[#051046]">ESTIMATE</h2>
              <div className="flex-1 flex justify-end">
                <button 
                  onClick={() => {
                    setShowEstimatePdfModal(false);
                    setSelectedPlanForPdf(null);
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
                      value={selectedPlanForPdf.id} 
                      readOnly
                      className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] bg-gray-50"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#051046] w-24">Date</span>
                    <input 
                      type="text" 
                      value={selectedPlanForPdf.createdAt} 
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
                  <p className="text-sm text-[#051046]">{selectedPlanForPdf.clientName}</p>
                  <p className="text-sm text-[#051046]">{selectedPlanForPdf.propertyAddress}</p>
                  <p className="text-sm text-[#051046]">{selectedPlanForPdf.phone}</p>
                  <p className="text-sm text-[#051046]">{selectedPlanForPdf.clientEmail}</p>
                </div>

                {/* Service Location */}
                <div>
                  <h4 className="font-semibold text-[#051046] mb-2">Service location:</h4>
                  <p className="text-sm text-[#051046]">{selectedPlanForPdf.clientName}</p>
                  <p className="text-sm text-[#051046]">{selectedPlanForPdf.propertyAddress}</p>
                  <p className="text-sm text-[#051046]">{selectedPlanForPdf.phone}</p>
                  <p className="text-sm text-[#051046]">{selectedPlanForPdf.clientEmail}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <table className="w-full border-t border-b border-[#e2e8f0]">
                  <thead>
                    <tr className="border-b border-[#e2e8f0]">
                      <th className="text-left py-3 text-sm font-semibold text-[#051046]">Description</th>
                      <th className="text-center py-3 text-sm font-semibold text-[#051046] w-20">QTY</th>
                      <th className="text-right py-3 text-sm font-semibold text-[#051046] w-24">Price</th>
                      <th className="text-right py-3 text-sm font-semibold text-[#051046] w-32">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#e2e8f0]">
                      <td className="py-4">
                        <div>
                          <p className="text-sm font-medium text-[#051046]">{selectedPlanForPdf.serviceName}</p>
                          <p className="text-xs text-gray-500 mt-1">{selectedPlanForPdf.serviceDescription}</p>
                          <span className="inline-block mt-2 text-[12px] font-medium text-[#6a7282]">
                            NON-TAXABLE
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-center text-sm text-[#051046]">1</td>
                      <td className="py-4 text-right text-sm text-[#051046]">${selectedPlanForPdf.price.toFixed(2)}</td>
                      <td className="py-4 text-right text-sm font-medium text-[#051046]">${selectedPlanForPdf.price.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Financial Summary */}
              <div className="flex justify-end mb-8">
                <div className="w-96 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                    <span className="text-sm font-semibold text-[#051046]">Subtotal:</span>
                    <span className="text-sm text-[#051046]">${selectedPlanForPdf.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#051046]">Discount:</span>
                    <span className="text-sm text-[#051046]">
                      -${selectedPlanForPdf.discount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#051046]">Tax rate%:</span>
                    <span className="text-sm text-[#051046]">Non-taxable</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t-2 border-[#051046]">
                    <span className="text-lg font-bold text-[#051046]">Total:</span>
                    <span className="text-lg font-bold text-[#051046]">${(selectedPlanForPdf.price - selectedPlanForPdf.discount).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="font-semibold text-[#051046] mb-2">Service Plan Details:</h4>
                <p className="text-sm text-[#051046]">Billing: {selectedPlanForPdf.intervalCount === 1 ? selectedPlanForPdf.billingInterval.charAt(0).toUpperCase() + selectedPlanForPdf.billingInterval.slice(1) + 'ly' : `Every ${selectedPlanForPdf.intervalCount} ${selectedPlanForPdf.billingInterval}s`}</p>
                <p className="text-sm text-[#051046]">Total Visits: {selectedPlanForPdf.totalVisits}</p>
                <p className="text-sm text-[#051046]">Start Date: {selectedPlanForPdf.startDate}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice PDF View Modal */}
      {showInvoicePdfModal && selectedPlanForPdf && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowInvoicePdfModal(false);
              setSelectedPlanForPdf(null);
            }
          }}
        >
          <div className="bg-white rounded-[20px] w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[#e2e8f0]">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between rounded-t-[20px]">
              <div className="flex-1"></div>
              <h2 className="text-xl font-bold text-[#051046]">INVOICE</h2>
              <div className="flex-1 flex justify-end">
                <button 
                  onClick={() => {
                    setShowInvoicePdfModal(false);
                    setSelectedPlanForPdf(null);
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
                      value={selectedPlanForPdf.id.replace('S-', 'I-')} 
                      readOnly
                      className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] bg-gray-50"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#051046] w-24">Date</span>
                    <input 
                      type="text" 
                      value={selectedPlanForPdf.createdAt} 
                      readOnly
                      className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-[#051046] mb-3 uppercase">Bill To</h3>
                <div className="bg-gray-50 p-4 rounded-[15px]">
                  <p className="text-sm font-semibold text-[#051046]">{selectedPlanForPdf.clientName}</p>
                  <p className="text-sm text-gray-600">{selectedPlanForPdf.propertyAddress}</p>
                  <p className="text-sm text-gray-600">{selectedPlanForPdf.clientEmail}</p>
                  {selectedPlanForPdf.phone && <p className="text-sm text-gray-600">{selectedPlanForPdf.phone}</p>}
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <table className="w-full border-t border-b border-[#e2e8f0]">
                  <thead>
                    <tr className="border-b border-[#e2e8f0]">
                      <th className="text-left py-3 text-sm font-semibold text-[#051046]">Description</th>
                      <th className="text-center py-3 text-sm font-semibold text-[#051046] w-20">QTY</th>
                      <th className="text-right py-3 text-sm font-semibold text-[#051046] w-24">Price</th>
                      <th className="text-right py-3 text-sm font-semibold text-[#051046] w-32">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#e2e8f0]">
                      <td className="py-4">
                        <div>
                          <p className="text-sm font-semibold text-[#051046]">{selectedPlanForPdf.serviceName}</p>
                          <p className="text-xs text-gray-600 mt-1">{selectedPlanForPdf.serviceDescription}</p>
                          <span className="inline-block mt-2 text-[12px] font-medium text-[#6a7282]">
                            NON-TAXABLE
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-center text-sm text-[#051046]">1</td>
                      <td className="py-4 text-right text-sm text-[#051046]">${selectedPlanForPdf.price.toFixed(2)}</td>
                      <td className="py-4 text-right">
                        <p className="text-sm font-semibold text-[#051046]">${selectedPlanForPdf.price.toFixed(2)}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Financial Summary */}
              <div className="flex justify-end mb-8">
                <div className="w-96 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                    <span className="text-sm font-semibold text-[#051046]">Subtotal:</span>
                    <span className="text-sm text-[#051046]">${selectedPlanForPdf.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#051046]">Discount:</span>
                    <span className="text-sm text-[#051046]">
                      -${selectedPlanForPdf.discount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#051046]">Tax rate%:</span>
                    <span className="text-sm text-[#051046]">Non-taxable</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t-2 border-[#8b5cf6]">
                    <span className="text-base font-bold text-[#051046]">Total</span>
                    <span className="text-lg font-bold text-[#051046]">${(selectedPlanForPdf.price - selectedPlanForPdf.discount).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-[#051046] mb-3 uppercase">Service Plan Details</h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <p>• <strong>Billing Frequency:</strong> {selectedPlanForPdf.intervalCount === 1 ? selectedPlanForPdf.billingInterval.charAt(0).toUpperCase() + selectedPlanForPdf.billingInterval.slice(1) + 'ly' : `Every ${selectedPlanForPdf.intervalCount} ${selectedPlanForPdf.billingInterval}s`}</p>
                  <p>• <strong>Start Date:</strong> {new Date(selectedPlanForPdf.startDate).toLocaleDateString()}</p>
                  <p>• <strong>Auto-Renewal:</strong> {selectedPlanForPdf.autoRenew ? 'Enabled' : 'Disabled'}</p>
                  <p>• <strong>Total Visits:</strong> {selectedPlanForPdf.totalVisits}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-[#e2e8f0] space-y-4">
                <div className="border border-[#e2e8f0] rounded-[15px] p-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked
                      disabled
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#9473ff] focus:ring-[#9473ff]"
                    />
                    <span className="text-sm text-[#6a7282] leading-6">
                      I agree to the Service Terms outlined by My Plumber Company and authorize recurring charges of ${selectedPlanForPdf.price.toFixed(2)} every {selectedPlanForPdf.intervalCount === 1 ? selectedPlanForPdf.billingInterval : `${selectedPlanForPdf.intervalCount} ${selectedPlanForPdf.billingInterval}s`} until I cancel.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OLD PDF View Modal - Removing */}
      {isPDFViewOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[20px] w-full max-w-4xl border border-[#e2e8f0] overflow-hidden" style={{ boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)' }}>
            <div className="max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-[#e2e8f0] px-6 py-4 z-10 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#051046]">Subscription Preview</h2>
                <button onClick={() => setIsPDFViewOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-[#051046]" />
                </button>
              </div>
              <div className="p-8 bg-gray-50">
                <div className="bg-white p-8 rounded-[20px] border border-[#e2e8f0]" style={{ boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)' }}>
                  <div className="mb-8 pb-6 border-b-2 border-[#8b5cf6]">
                    <h1 className="text-3xl font-bold text-[#051046] mb-2">Service Subscription Agreement</h1>
                    <p className="text-sm text-gray-600">Your Company Name</p>
                    <p className="text-sm text-gray-600">123 Business Street, City, State 12345</p>
                    <p className="text-sm text-gray-600">Phone: (555) 123-4567 | Email: info@company.com</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">SUBSCRIPTION ID</p>
                      <p className="text-sm font-semibold text-[#051046]">SUB-{Date.now().toString().slice(-8)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">CREATED DATE</p>
                      <p className="text-sm font-semibold text-[#051046]">{new Date().toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">START DATE</p>
                      <p className="text-sm font-semibold text-[#051046]">{new Date(planForm.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">STATUS</p>
                      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Pending Payment</span>
                    </div>
                  </div>
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-[#051046] mb-3 uppercase">Bill To</h3>
                    <div className="bg-gray-50 p-4 rounded-[15px]">
                      <p className="text-sm font-semibold text-[#051046]">{planForm.clientName}</p>
                      <p className="text-sm text-gray-600">{planForm.propertyAddress}</p>
                      <p className="text-sm text-gray-600">{planForm.clientEmail}</p>
                      {planForm.phone && <p className="text-sm text-gray-600">{planForm.phone}</p>}
                    </div>
                  </div>
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-[#051046] mb-3 uppercase">Service Details</h3>
                    <div className="border border-[#e2e8f0] rounded-[15px] overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-[#e2e8f0]">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#051046] uppercase">Service</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#051046] uppercase">Billing</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-[#051046] uppercase">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[#e2e8f0]">
                            <td className="px-4 py-4">
                              <p className="text-sm font-semibold text-[#051046]">{planForm.serviceName}</p>
                              <p className="text-xs text-gray-600 mt-1">{planForm.serviceDescription}</p>
                              {planForm.customNotes && <p className="text-xs text-gray-500 mt-2 italic">Note: {planForm.customNotes}</p>}
                            </td>
                            <td className="px-4 py-4">
                              <p className="text-sm text-[#051046]">{formatBillingInterval(planForm.billingInterval, parseInt(planForm.intervalCount))}</p>
                              {parseInt(planForm.trialDays) > 0 && <p className="text-xs text-blue-600 mt-1">{planForm.trialDays} day trial</p>}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <p className="text-sm font-semibold text-[#051046]">${parseFloat(planForm.price).toFixed(2)} {planForm.currency}</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mb-8">
                    <div className="bg-[#f8f5ff] border border-[#e2e8f0] rounded-[15px] p-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Subtotal</span>
                          <span className="text-sm font-medium text-[#051046]">${parseFloat(planForm.price).toFixed(2)} {planForm.currency}</span>
                        </div>
                        {parseFloat(planForm.discountValue) > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Discount {planForm.discountType === 'percentage' ? `(${planForm.discountValue}%)` : ''}</span>
                            <span className="text-sm font-medium text-green-600">-${(() => {
                              const price = parseFloat(planForm.price);
                              if (planForm.discountType === 'percentage') {
                                return ((price * parseFloat(planForm.discountValue)) / 100).toFixed(2);
                              }
                              return parseFloat(planForm.discountValue).toFixed(2);
                            })()}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-3 border-t-2 border-[#8b5cf6]">
                          <span className="text-base font-bold text-[#051046]">Total per {planForm.billingInterval}</span>
                          <span className="text-xl font-bold text-[#8b5cf6]">${(() => {
                            const price = parseFloat(planForm.price);
                            let discount = 0;
                            if (planForm.discountType === 'percentage') {
                              discount = (price * parseFloat(planForm.discountValue)) / 100;
                            } else {
                              discount = parseFloat(planForm.discountValue);
                            }
                            return (price - discount).toFixed(2);
                          })()} {planForm.currency}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-[#051046] mb-3 uppercase">Subscription Terms</h3>
                    <div className="space-y-2 text-xs text-gray-600">
                      <p>• <strong>Billing Frequency:</strong> {formatBillingInterval(planForm.billingInterval, parseInt(planForm.intervalCount))}</p>
                      <p>• <strong>Start Date:</strong> {new Date(planForm.startDate).toLocaleDateString()}</p>
                      {parseInt(planForm.trialDays) > 0 && <p>• <strong>Trial Period:</strong> {planForm.trialDays} days (no charge during trial)</p>}
                      <p>• <strong>Auto-Renewal:</strong> {planForm.autoRenew ? 'Enabled' : 'Disabled'}</p>
                      {planForm.cancelAt && <p>• <strong>End Date:</strong> {new Date(planForm.cancelAt).toLocaleDateString()}</p>}
                      <p>• <strong>Payment Method:</strong> {planForm.collectionMethod === 'collect_in_person' ? 'Collect in Person' : 'Payment Link (Stripe Checkout)'}</p>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-[#e2e8f0]">
                    <p className="text-xs text-gray-500 text-center">This is a preview of your service subscription agreement. Once payment is processed, you will receive a confirmation email with your subscription details.</p>
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 bg-white border-t border-[#e2e8f0] px-6 py-4 flex justify-end gap-3">
                <button onClick={() => setIsPDFViewOpen(false)} className="px-6 py-2 border border-[#e8e8e8] text-[#051046] rounded-[25px] hover:bg-gray-50 transition-colors">Close</button>
                <button onClick={() => alert('PDF download functionality would be implemented here')} className="px-6 py-2 bg-[#9473ff] text-white rounded-[25px] hover:bg-[#7f5fd9] transition-colors">Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card Payment Confirmation Modal */}
      {isCardConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[20px] w-full max-w-md border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#051046]">Collect Payment with Card</h3>
            </div>
            <p className="text-[#051046] mb-6">This will redirect you to Stripe Checkout where you can collect payment from the customer in person using their card details. The subscription will be activated immediately upon successful payment.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-[15px] p-4 mb-6">
              <p className="text-xs text-blue-900"><strong>Customer:</strong> {planForm.clientName}<br /><strong>Service:</strong> {planForm.serviceName}<br /><strong>Amount:</strong> ${(() => {
                const price = parseFloat(planForm.price);
                let discount = 0;
                if (planForm.discountType === 'percentage') {
                  discount = (price * parseFloat(planForm.discountValue)) / 100;
                } else {
                  discount = parseFloat(planForm.discountValue);
                }
                return (price - discount).toFixed(2);
              })()} {planForm.currency}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsCardConfirmOpen(false)} className="px-6 py-2 border border-[#e8e8e8] text-[#051046] rounded-[15px] hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => {
                // Calculate next billing date
                const startDate = new Date(planForm.startDate);
                const nextBilling = new Date(startDate);
                const intervalCount = parseInt(planForm.intervalCount);
                
                switch(planForm.billingInterval) {
                  case 'day':
                    nextBilling.setDate(nextBilling.getDate() + intervalCount);
                    break;
                  case 'week':
                    nextBilling.setDate(nextBilling.getDate() + (intervalCount * 7));
                    break;
                  case 'month':
                    nextBilling.setMonth(nextBilling.getMonth() + intervalCount);
                    break;
                  case 'year':
                    nextBilling.setFullYear(nextBilling.getFullYear() + intervalCount);
                    break;
                }

                // Calculate discount
                const price = parseFloat(planForm.price || '0');
                let discount = 0;
                if (planForm.discountType === 'percentage') {
                  discount = parseFloat(planForm.discountValue || '0');
                } else {
                  discount = parseFloat(planForm.discountValue || '0');
                }

                // Create new service plan
                const newPlan: ServicePlan = {
                  id: `sub_${Date.now()}`,
                  customerId: `cus_${Date.now()}`,
                  clientName: planForm.clientName,
                  clientEmail: planForm.clientEmail,
                  propertyAddress: planForm.propertyAddress,
                  phone: planForm.phone,
                  serviceName: planForm.serviceName,
                  serviceDescription: planForm.serviceDescription,
                  price: price,
                  currency: planForm.currency,
                  billingInterval: planForm.billingInterval,
                  intervalCount: parseInt(planForm.intervalCount),
                  startDate: new Date(planForm.startDate).toLocaleDateString(),
                  trialDays: parseInt(planForm.trialDays),
                  cancelAt: planForm.cancelAt || null,
                  autoRenew: planForm.autoRenew,
                  collectionMethod: planForm.collectionMethod === 'collect_in_person' ? 'charge_automatically' : 'send_invoice',
                  paymentMethod: planForm.collectionMethod === 'collect_in_person' ? 'Card' : 'Payment Link',
                  discount: discount,
                  status: 'incomplete',
                  nextBillingDate: nextBilling.toLocaleDateString(),
                  createdAt: new Date().toLocaleDateString(),
                };

                // Add to service plans list
                setServicePlans([newPlan, ...servicePlans]);

                setIsCardConfirmOpen(false);
                setIsAddPlanModalOpen(false);
                alert('Redirecting to Stripe Checkout... 💳\n\nSubscription would be created and Stripe Checkout would open for payment collection.');
                setPlanForm({
                  clientName: '',
                  clientEmail: '',
                  propertyAddress: '',
                  phone: '',
                  serviceName: '',
                  serviceDescription: '',
                  customNotes: '',
                  price: '',
                  currency: 'USD',
                  billingInterval: 'month',
                  intervalCount: '1',
                  startDate: new Date().toISOString().split('T')[0],
                  trialDays: '0',
                  cancelAt: '',
                  autoRenew: true,
                  collectionMethod: 'send_payment_link',
                  discountType: 'percentage',
                  discountValue: '0',
                });
              }} className="px-6 py-2 bg-blue-600 text-white rounded-[15px] hover:bg-blue-700 transition-colors">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}

      {/* Send Payment Link Confirmation Modal */}
      {isSendConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[20px] w-full max-w-md border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Mail className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <h3 className="text-lg font-semibold text-[#051046]">Send Payment Link</h3>
            </div>
            <p className="text-[#051046] mb-6">This will create the service plan estimate and send it to the customer's email address and portal for approval. Are you sure?</p>
            <div className="bg-purple-50 border border-purple-200 rounded-[15px] p-4 mb-6">
              <p className="text-xs text-[#051046]"><strong>Send to:</strong> {planForm.clientEmail}<br /><strong>Customer:</strong> {planForm.clientName}<br /><strong>Service:</strong> {planForm.serviceName}<br /><strong>Amount:</strong> ${(() => {
                const price = parseFloat(planForm.price);
                let discount = 0;
                if (planForm.discountType === 'percentage') {
                  discount = (price * parseFloat(planForm.discountValue)) / 100;
                } else {
                  discount = parseFloat(planForm.discountValue);
                }
                return (price - discount).toFixed(2);
              })()} {planForm.currency}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsSendConfirmOpen(false)} className="px-6 py-2 border border-[#e8e8e8] text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => {
                createServicePlan();
                setIsSendConfirmOpen(false);
                setIsAddPlanModalOpen(false);
                alert('Payment link sent successfully! 📧\n\nThe customer will receive an email with a secure link to complete payment through Stripe Checkout in their customer dashboard.');
              }} className="px-6 py-2 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors">Send Link</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Selection Modal */}
      {isPaymentMethodModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[20px] w-full max-w-md border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#051046]">Select Payment Method</h3>
              <button onClick={() => setIsPaymentMethodModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-[#051046]" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">How would you like to collect payment for this service plan?</p>
            
            <div className="space-y-3">
              {/* Card Option */}
              <button
                onClick={() => {
                  setIsPaymentMethodModalOpen(false);
                  setSelectedPaymentMethod('card');
                  setIsCardDeveloperNoteOpen(true);
                }}
                className="w-full p-4 border-2 border-[#e2e8f0] rounded-[15px] hover:border-[#28bdf2] hover:bg-blue-50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-[#28bdf2] transition-colors">
                    <CreditCard className="w-6 h-6 text-[#28bdf2] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#051046]">Card</p>
                    <p className="text-xs text-gray-500">Process payment via Stripe checkout</p>
                  </div>
                </div>
              </button>

              {/* Cash Option */}
              <button
                onClick={() => {
                  setIsPaymentMethodModalOpen(false);
                  setSelectedPaymentMethod('cash');
                  setIsPaymentSafetyConfirmOpen(true);
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

              {/* Other Option */}
              <button
                onClick={() => {
                  setIsPaymentMethodModalOpen(false);
                  setSelectedPaymentMethod('other');
                  setIsPaymentSafetyConfirmOpen(true);
                }}
                className="w-full p-4 border-2 border-[#e2e8f0] rounded-[15px] hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                    <AlertCircle className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
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

      {/* Card Developer Note Modal */}
      {isCardDeveloperNoteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-[20px] w-full max-w-lg border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#28bdf2]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#051046]">Card Payment</h3>
                <p className="text-xs text-gray-500">Stripe Integration</p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-[15px] mb-6">
              <p className="text-xs font-semibold text-blue-900 mb-2">🔧 Developer Note:</p>
              <p className="text-sm text-blue-800">
                Takes the user to Stripe checkout to pay the invoice for the customer by manually inputting card info
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsCardDeveloperNoteOpen(false);
                  setSelectedPaymentMethod(null);
                }} 
                className="px-6 py-2 border border-[#e8e8e8] text-[#051046] rounded-[15px] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  createServicePlan();
                  setIsCardDeveloperNoteOpen(false);
                  setIsAddPlanModalOpen(false);
                  setSelectedPaymentMethod(null);
                  alert('Redirecting to Stripe Checkout... 💳\n\nYou will be able to manually enter the customer\'s card information to complete payment.');
                }} 
                className="px-6 py-2 bg-[#28bdf2] text-white rounded-[15px] hover:bg-[#1da8d9] transition-colors"
              >
                Continue to Stripe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Safety Confirmation Modal */}
      {isPaymentSafetyConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-[20px] w-full max-w-md border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#051046]">Confirm Payment Method</h3>
                <p className="text-xs text-gray-500">
                  {selectedPaymentMethod === 'cash' ? 'Cash Payment' : 'Other Payment Method'}
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to record this as a {selectedPaymentMethod === 'cash' ? 'cash' : 'non-card'} payment? 
              This will mark the service plan as paid but won't process it through Stripe.
            </p>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-[15px] mb-6">
              <p className="text-xs text-yellow-800">
                ⚠️ Make sure you've received payment before confirming.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsPaymentSafetyConfirmOpen(false);
                  setSelectedPaymentMethod(null);
                }} 
                className="px-6 py-2 border border-[#e8e8e8] text-[#051046] rounded-[15px] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  createServicePlan();
                  setIsPaymentSafetyConfirmOpen(false);
                  setIsAddPlanModalOpen(false);
                  setSelectedPaymentMethod(null);
                  alert(`${selectedPaymentMethod === 'cash' ? 'Cash' : 'Other'} payment recorded successfully! ✅\n\nThe service plan has been created and marked as paid.`);
                }} 
                className="px-6 py-2 bg-[#9473ff] text-white rounded-[15px] hover:bg-[#7f5fd9] transition-colors"
              >
                Yes, I'm Sure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Card Modal */}
      {isUpdateCardModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-[20px] w-full max-w-md border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#051046]">Update Card Information</h3>
              <button onClick={() => setIsUpdateCardModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-[#051046]" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-[15px] mb-4">
                <p className="text-sm text-blue-900 mb-2">
                  <strong>Current Payment Method:</strong>
                </p>
                <p className="text-sm text-blue-800">
                  {servicePlans.find(p => p.id === editingPlanId)?.paymentMethod || 'N/A'}
                </p>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                This will redirect you to Stripe to securely update the customer's card information for this subscription.
              </p>

              <div className="p-3 bg-gray-50 border border-[#e2e8f0] rounded-[15px]">
                <p className="text-xs text-gray-600">
                  🔒 Card information is securely processed through Stripe. You can either:
                </p>
                <ul className="text-xs text-gray-600 mt-2 ml-4 space-y-1 list-disc">
                  <li>Send a secure link to the customer to update their card</li>
                  <li>Update the card manually if the customer is present</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsUpdateCardModalOpen(false)} 
                className="px-6 py-2 border border-[#e8e8e8] text-[#051046] rounded-[15px] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsUpdateCardModalOpen(false);
                  alert('Redirecting to Stripe... 💳\n\nYou can now securely update the customer\'s card information. The subscription will continue with the new payment method.');
                }} 
                className="px-6 py-2 bg-[#28bdf2] text-white rounded-[15px] hover:bg-[#1da8d9] transition-colors"
              >
                Update Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Now Confirmation Modal */}
      {isPayNowConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[20px] w-full max-w-md border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#051046]">Confirm Card Payment</h3>
              <button onClick={() => setIsPayNowConfirmOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-[#051046]" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to proceed with the card payment?
              </p>

              <div className="p-4 border border-blue-200 rounded-[15px] bg-[#f8efff]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-[#051046]">Service Plan Amount:</span>
                  <span className="text-lg font-bold text-[#9473ff]">
                    ${planForm.price ? parseFloat(planForm.price).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span>Billing: {planForm.billingInterval === 'month' ? 'Monthly' : planForm.billingInterval === 'year' ? 'Yearly' : planForm.billingInterval}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsPayNowConfirmOpen(false)} 
                className="px-6 py-2 border border-[#e8e8e8] text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsPayNowConfirmOpen(false);
                  setShowPayNowCardFields(true);
                }} 
                className="px-6 py-2 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors"
              >
                OK, Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Now Card Fields Modal */}
      {showPayNowCardFields && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[20px] w-full max-w-md border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#051046]">Enter Card Information</h3>
              <button onClick={() => setShowPayNowCardFields(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-[#051046]" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-[15px] mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-[#051046]">Payment Amount:</span>
                  <span className="text-lg font-bold text-[#9473ff]">
                    ${planForm.price ? parseFloat(planForm.price).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#28bdf2]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#28bdf2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#28bdf2]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#28bdf2]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Billing ZIP Code</label>
                  <input
                    type="text"
                    placeholder="12345"
                    className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#28bdf2]"
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-[#e2e8f0] rounded-[15px] mt-4">
                <p className="text-xs text-gray-600">
                  🔒 Your payment information is securely processed through Stripe. We never store your full card details.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowPayNowCardFields(false)} 
                className="px-6 py-2 border border-[#e8e8e8] text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowPayNowCardFields(false);
                  setIsAddPlanModalOpen(false);
                  alert('Payment processed successfully! 💳✅\n\nThe service plan has been created and the card has been charged.');
                }} 
                className="px-6 py-2 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors"
              >
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Collection Modal */}
      {isPaymentCollectionModalOpen && selectedPlanForPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-[20px] w-full max-w-md border border-[#e2e8f0]"
            style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
          >
            {/* Header */}
            <div className="border-b border-[#e2e8f0] px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#051046]">Collect Payment</h2>
                <button
                  onClick={() => {
                    setIsPaymentCollectionModalOpen(false);
                    setSelectedPlanForPayment(null);
                    setPaymentCardNumber('');
                    setPaymentExpiry('');
                    setPaymentCVV('');
                    setPaymentCardholderName('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#051046]" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Plan Details */}
              <div className="bg-gray-50 rounded-[15px] border border-[#e2e8f0] p-4">
                <p className="text-sm text-gray-500 mb-2">Service Plan</p>
                <p className="text-lg font-semibold text-[#051046]">{selectedPlanForPayment.serviceName}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedPlanForPayment.clientName}</p>
                <p className="text-2xl font-bold text-[#051046] mt-3">${selectedPlanForPayment.price} {selectedPlanForPayment.currency}</p>
              </div>

              {/* Card Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#051046] mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={paymentCardholderName}
                    onChange={(e) => setPaymentCardholderName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full h-[44px] px-4 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#051046] mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={paymentCardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, '');
                      if (/^\d*$/.test(value) && value.length <= 16) {
                        const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                        setPaymentCardNumber(formatted);
                      }
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full h-[44px] px-4 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#051046] mb-2">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      value={paymentExpiry}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                          const formatted = value.length >= 3 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
                          setPaymentExpiry(formatted);
                        }
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full h-[44px] px-4 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#051046] mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={paymentCVV}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                          setPaymentCVV(value);
                        }
                      }}
                      placeholder="123"
                      maxLength={4}
                      className="w-full h-[44px] px-4 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-[#9473ff] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#e2e8f0] px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setIsPaymentCollectionModalOpen(false);
                  setSelectedPlanForPayment(null);
                  setPaymentCardNumber('');
                  setPaymentExpiry('');
                  setPaymentCVV('');
                  setPaymentCardholderName('');
                }}
                className="flex-1 px-6 py-2 border border-[#e8e8e8] text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Update the plan status to active
                  setServicePlans(servicePlans.map(p => 
                    p.id === selectedPlanForPayment.id 
                      ? { ...p, status: 'active' as const, paymentMethod: `card_ending_${paymentCardNumber.slice(-4)}` }
                      : p
                  ));
                  
                  setIsPaymentCollectionModalOpen(false);
                  setSelectedPlanForPayment(null);
                  setPaymentCardNumber('');
                  setPaymentExpiry('');
                  setPaymentCVV('');
                  setPaymentCardholderName('');
                  
                  alert('Payment processed successfully! 💳✅\n\nThe service plan is now Active.');
                }}
                className="flex-1 px-6 py-2 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors"
              >
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
