import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, User, MapPin, Phone, Mail, Building2, Calendar, DollarSign, FileText, Briefcase, Users, CheckCircle, Edit2, Save, X, ChevronLeft, ChevronRight, Info, Eye, Plus, Search, CreditCard, AlertCircle } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  company: string;
  servicePlan: string;
  tags: string[];
  totalJobs: number;
  address: string;
  phone: string;
  email: string;
  created: string;
}

interface Job {
  id: string;
  title: string;
  status: string;
  date: string;
  amount: number;
  technician: string;
}

interface Estimate {
  id: string;
  title: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Expired';
  date: string;
  amount: number;
  validUntil: string;
}

interface Invoice {
  id: string;
  number: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Cancelled';
  date: string;
  dueDate: string;
  amount: number;
  job: string;
}

interface Lead {
  id: string;
  title: string;
  stage: 'New' | 'Contacted' | 'Price Shared' | 'Follow-Up' | 'Won' | 'Lost';
  source: string;
  value: number;
  createdDate: string;
  notes: string;
}

interface ServicePlanSubscription {
  id: string;
  planName: string;
  status: 'Active' | 'Paused' | 'Cancelled';
  clientName: string;
  clientEmail: string;
  propertyAddress: string;
  phone: string;
  serviceName: string;
  serviceDescription: string;
  startDate: string;
  nextBillingDate: string;
  amount: number;
  interval: string;
  billingInterval: 'day' | 'week' | 'month' | 'year';
  intervalCount: number;
  autoRenew: boolean;
  discount: number;
  totalVisits: number;
  createdAt: string;
}

// Mock client database for autocomplete
const mockClientDatabase = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.johnson@email.com', phone: '(512) 555-0123', address: '123 Main St, Austin, TX 78701' },
  { id: '2', name: 'Michael Roberts', email: 'michael@robertsconstruction.com', phone: '(555) 123-4567', address: '123 Main St, Anytown, USA' },
  { id: '3', name: 'David Chen', email: 'david@chenindustries.com', phone: '(555) 456-7890', address: '789 Oak St, Thirtown, USA' },
  { id: '4', name: 'Emily Davis', email: 'emily.davis@email.com', phone: '(555) 333-4444', address: '505 Walnut St, Eighttown, USA' },
  { id: '5', name: 'Robert Thompson', email: 'robert@thompsonent.com', phone: '(555) 654-3210', address: '202 Maple St, Fivetown, USA' },
  { id: '6', name: 'Jennifer Martinez', email: 'jennifer@martinezgroup.com', phone: '(555) 777-8888', address: '303 Birch St, Sixtown, USA' },
  { id: '7', name: 'Christopher Moore', email: 'chris@mooresolutions.com', phone: '(555) 444-5555', address: '606 Spruce St, Ninetown, USA' },
  { id: '8', name: 'Lisa Anderson', email: 'lisa.anderson@email.com', phone: '(555) 555-6666', address: '707 Ash St, Tentown, USA' },
];

// Mock inventory database - services only
const inventoryDatabase = [
  { id: 101, name: 'HVAC Tune-Up Service', type: 'service' as const, price: 150.00, description: 'Complete HVAC system inspection and tune-up', taxable: false },
  { id: 102, name: 'AC Filter Replacement', type: 'service' as const, price: 45.00, description: 'Replace air conditioning filter', taxable: false },
  { id: 103, name: 'Drain Cleaning', type: 'service' as const, price: 125.00, description: 'Professional drain cleaning service', taxable: false },
  { id: 104, name: 'Water Heater Installation', type: 'service' as const, price: 850.00, description: 'Complete water heater installation', taxable: false },
  { id: 105, name: 'Electrical Inspection', type: 'service' as const, price: 95.00, description: 'Comprehensive electrical system inspection', taxable: false },
  { id: 106, name: 'Plumbing Maintenance', type: 'service' as const, price: 180.00, description: 'Routine plumbing maintenance check', taxable: false },
  { id: 107, name: 'Duct Cleaning', type: 'service' as const, price: 300.00, description: 'Complete air duct cleaning service', taxable: false },
  { id: 108, name: 'Furnace Repair', type: 'service' as const, price: 250.00, description: 'Furnace diagnostic and repair', taxable: false },
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

// Mock data - in a real app, this would come from an API
const mockClients: Client[] = [
  {
    id: 'C-101',
    name: 'Michael Roberts',
    company: 'Roberts Construction',
    servicePlan: 'Premium Maintenance',
    tags: ['VIP', 'Commercial'],
    totalJobs: 12,
    address: '123 Main St, Anytown, USA',
    phone: '(555) 123-4567',
    email: 'michael@robertsconstruction.com',
    created: '2024-01-15',
  },
  {
    id: 'C-102',
    name: 'Sarah Martinez',
    company: '',
    servicePlan: '',
    tags: ['Residential'],
    totalJobs: 3,
    address: '456 Elm St, Othertown, USA',
    phone: '(555) 987-6543',
    email: 'sarah.martinez@email.com',
    created: '2024-02-20',
  },
  {
    id: 'C-103',
    name: 'David Chen',
    company: 'Chen Industries',
    servicePlan: 'Basic Service',
    tags: ['Commercial', 'Regular'],
    totalJobs: 8,
    address: '789 Oak St, Thirtown, USA',
    phone: '(555) 456-7890',
    email: 'david@chenindustries.com',
    created: '2024-01-10',
  },
  {
    id: 'C-104',
    name: 'Jennifer Wilson',
    company: '',
    servicePlan: '',
    tags: ['Residential', 'New'],
    totalJobs: 1,
    address: '101 Pine St, Fourtown, USA',
    phone: '(555) 321-6547',
    email: 'jennifer.wilson@email.com',
    created: '2024-03-05',
  },
  {
    id: 'C-105',
    name: 'Robert Thompson',
    company: 'Thompson Enterprises',
    servicePlan: 'Premium Maintenance',
    tags: ['VIP', 'Commercial'],
    totalJobs: 15,
    address: '202 Maple St, Fivetown, USA',
    phone: '(555) 654-3210',
    email: 'robert@thompsonent.com',
    created: '2023-12-01',
  },
  {
    id: 'C-106',
    name: 'Amanda Lee',
    company: '',
    servicePlan: 'Basic Service',
    tags: ['Residential'],
    totalJobs: 5,
    address: '303 Birch St, Sixtown, USA',
    phone: '(555) 111-2222',
    email: 'amanda.lee@email.com',
    created: '2024-02-14',
  },
  {
    id: 'C-107',
    name: 'James Patterson',
    company: 'Patterson Holdings',
    servicePlan: '',
    tags: ['Commercial'],
    totalJobs: 2,
    address: '404 Cedar St, Seventown, USA',
    phone: '(555) 222-3333',
    email: 'james@pattersonholdings.com',
    created: '2024-03-10',
  },
  {
    id: 'C-108',
    name: 'Emily Davis',
    company: '',
    servicePlan: 'Premium Maintenance',
    tags: ['Residential', 'VIP'],
    totalJobs: 9,
    address: '505 Walnut St, Eighttown, USA',
    phone: '(555) 333-4444',
    email: 'emily.davis@email.com',
    created: '2024-01-25',
  },
  {
    id: 'C-109',
    name: 'Christopher Moore',
    company: 'Moore Solutions',
    servicePlan: 'Basic Service',
    tags: ['Commercial', 'Regular'],
    totalJobs: 6,
    address: '606 Spruce St, Ninetown, USA',
    phone: '(555) 444-5555',
    email: 'chris@mooresolutions.com',
    created: '2024-02-01',
  },
  {
    id: 'C-110',
    name: 'Lisa Anderson',
    company: '',
    servicePlan: '',
    tags: ['Residential', 'New'],
    totalJobs: 1,
    address: '707 Ash St, Tentown, USA',
    phone: '(555) 555-6666',
    email: 'lisa.anderson@email.com',
    created: '2024-03-15',
  },
  {
    id: 'C-111',
    name: 'Daniel Brown',
    company: 'Brown & Associates',
    servicePlan: 'Premium Maintenance',
    tags: ['Commercial', 'VIP'],
    totalJobs: 11,
    address: '808 Poplar St, Eleventown, USA',
    phone: '(555) 666-7777',
    email: 'daniel@brownassociates.com',
    created: '2024-01-05',
  },
];

export function ClientProfilePage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'details' | 'service-plans' | 'jobs' | 'estimates' | 'invoices' | 'leads'>('details');
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);

  // Pagination states for each tab
  const [jobsCurrentPage, setJobsCurrentPage] = useState(1);
  const [estimatesCurrentPage, setEstimatesCurrentPage] = useState(1);
  const [invoicesCurrentPage, setInvoicesCurrentPage] = useState(1);
  const [leadsCurrentPage, setLeadsCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Service Plan Modal State
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<typeof mockClientDatabase[0] | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [filteredClients, setFilteredClients] = useState<typeof mockClientDatabase>([]);
  const clientInputRef = useRef<HTMLDivElement>(null);

  const [serviceSearch, setServiceSearch] = useState('');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const serviceInputRef = useRef<HTMLDivElement>(null);

  const filteredServices = inventoryDatabase.filter(item =>
    item.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const [planForm, setPlanForm] = useState({
    clientName: '',
    clientEmail: '',
    propertyAddress: '',
    phone: '',
    serviceName: '',
    serviceDescription: '',
    customNotes: '',
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
    collectionMethod: 'send_payment_link' as 'collect_in_person' | 'send_payment_link',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '0',
    totalVisits: '12',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    cardholderName: '',
  });

  // Additional modal states for the service plan creation workflow
  const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
  const [selectedServicePlanForPdf, setSelectedServicePlanForPdf] = useState<ServicePlanSubscription | null>(null);
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);
  const [isSendConfirmOpen, setIsSendConfirmOpen] = useState(false);
  const [isCardDeveloperNoteOpen, setIsCardDeveloperNoteOpen] = useState(false);
  const [isPaymentSafetyConfirmOpen, setIsPaymentSafetyConfirmOpen] = useState(false);
  const [isCardConfirmOpen, setIsCardConfirmOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'cash' | 'other' | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    // In a real app, fetch client data from API
    const foundClient = mockClients.find((c) => c.id === clientId);
    if (foundClient) {
      if (isMounted) {
        setClient(foundClient);
      }
    } else {
      if (isMounted) {
        navigate('/admin/clients');
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, [clientId, navigate]);

  // Handler functions for service plan modal
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

  const handleSelectClient = (selectedClient: typeof mockClientDatabase[0]) => {
    setSelectedClient(selectedClient);
    setClientSearchTerm(selectedClient.name);
    setPlanForm({
      ...planForm,
      clientName: selectedClient.name,
      clientEmail: selectedClient.email,
      propertyAddress: selectedClient.address,
      phone: selectedClient.phone,
    });
    setShowClientDropdown(false);
  };

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

  const formatBillingInterval = (interval: string, count: number) => {
    const intervalText = interval === 'month' ? 'Monthly' : 
                        interval === 'year' ? 'Yearly' : 
                        interval === 'week' ? 'Weekly' : 
                        interval === 'day' ? 'Daily' : interval;
    
    if (count === 1) return intervalText;
    return `Every ${count} ${interval}s`;
  };

  const createServicePlan = () => {
    alert('Service plan created successfully! In a production environment, this would create the plan in your backend.');
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
      totalVisits: '12',
      cardNumber: '',
      cardExpiry: '',
      cardCVV: '',
      cardholderName: '',
    });
    setClientSearchTerm('');
    setServiceSearch('');
    setIsAddPlanModalOpen(false);
  };

  if (!client) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  // Mock data for demonstration
  const mockJobs: Job[] = [
    { id: 'JOB-001', title: 'HVAC Maintenance', status: 'Done', date: '2024-01-15', amount: 450, technician: 'John Smith' },
    { id: 'JOB-002', title: 'Plumbing Repair', status: 'Done', date: '2024-02-20', amount: 280, technician: 'Sarah Johnson' },
    { id: 'JOB-003', title: 'Electrical Inspection', status: 'Done', date: '2024-03-10', amount: 320, technician: 'Mike Davis' },
    { id: 'JOB-004', title: 'HVAC System Upgrade', status: 'Done', date: '2024-01-25', amount: 1850, technician: 'John Smith' },
    { id: 'JOB-005', title: 'Water Heater Replacement', status: 'Done', date: '2024-02-08', amount: 920, technician: 'Sarah Johnson' },
  ];

  const mockEstimates: Estimate[] = [
    { id: 'EST-001', title: 'Kitchen Renovation', status: 'Approved', date: '2024-01-10', amount: 8500, validUntil: '2024-02-10' },
    { id: 'EST-002', title: 'Roof Repair', status: 'Pending', date: '2024-03-05', amount: 3200, validUntil: '2024-04-05' },
    { id: 'EST-003', title: 'Bathroom Update', status: 'Rejected', date: '2024-02-15', amount: 5400, validUntil: '2024-03-15' },
    { id: 'EST-004', title: 'Office Space Remodel', status: 'Approved', date: '2024-01-20', amount: 15000, validUntil: '2024-02-20' },
    { id: 'EST-005', title: 'Parking Lot Resurfacing', status: 'Expired', date: '2023-12-10', amount: 7800, validUntil: '2024-01-10' },
  ];

  const mockInvoices: Invoice[] = [
    { id: 'INV-001', number: 'INV-2024-001', status: 'Paid', date: '2024-01-15', dueDate: '2024-01-30', amount: 450, job: 'HVAC Maintenance' },
    { id: 'INV-002', number: 'INV-2024-002', status: 'Paid', date: '2024-02-20', dueDate: '2024-03-05', amount: 280, job: 'Plumbing Repair' },
    { id: 'INV-003', number: 'INV-2024-003', status: 'Pending', date: '2024-03-10', dueDate: '2024-03-25', amount: 320, job: 'Electrical Inspection' },
    { id: 'INV-004', number: 'INV-2024-004', status: 'Paid', date: '2024-01-25', dueDate: '2024-02-10', amount: 1850, job: 'HVAC System Upgrade' },
    { id: 'INV-005', number: 'INV-2024-005', status: 'Overdue', date: '2024-02-01', dueDate: '2024-02-15', amount: 650, job: 'Emergency Repair' },
  ];

  const mockLeads: Lead[] = [
    { id: 'LEAD-001', title: 'Bathroom Renovation', stage: 'Won', source: 'Website', value: 7500, createdDate: '2024-01-05', notes: 'Interested in full bathroom remodel' },
    { id: 'LEAD-002', title: 'Pool Installation', stage: 'Follow-Up', source: 'Referral', value: 25000, createdDate: '2024-02-20', notes: 'Needs quote for inground pool' },
    { id: 'LEAD-003', title: 'Deck Building', stage: 'Price Shared', source: 'Google Ads', value: 12000, createdDate: '2024-03-01', notes: 'Cedar deck with pergola' },
    { id: 'LEAD-004', title: 'Kitchen Remodel', stage: 'Contacted', source: 'Referral', value: 18000, createdDate: '2024-02-10', notes: 'Complete kitchen renovation' },
    { id: 'LEAD-005', title: 'Garage Addition', stage: 'Lost', source: 'Facebook', value: 35000, createdDate: '2024-01-15', notes: 'Went with competitor' },
  ];

  const mockServicePlans: ServicePlanSubscription[] = [
    {
      id: 'SUB-001',
      planName: 'Premium Maintenance',
      status: 'Active',
      clientName: 'Michael Roberts',
      clientEmail: 'michael@robertsconstruction.com',
      propertyAddress: '123 Main St, Anytown, USA',
      phone: '(555) 123-4567',
      serviceName: 'Premium Maintenance',
      serviceDescription: 'Priority recurring maintenance plan with scheduled inspection visits.',
      startDate: '2024-01-01',
      nextBillingDate: '2024-04-01',
      amount: 299,
      interval: 'Monthly',
      billingInterval: 'month',
      intervalCount: 1,
      autoRenew: true,
      discount: 0,
      totalVisits: 12,
      createdAt: '2024-01-01',
    },
    {
      id: 'SUB-002',
      planName: 'Basic Service',
      status: 'Active',
      clientName: 'Michael Roberts',
      clientEmail: 'michael@robertsconstruction.com',
      propertyAddress: '123 Main St, Anytown, USA',
      phone: '(555) 123-4567',
      serviceName: 'Basic Service',
      serviceDescription: 'Recurring essential service plan with routine scheduled visits.',
      startDate: '2024-02-15',
      nextBillingDate: '2024-03-15',
      amount: 99,
      interval: 'Monthly',
      billingInterval: 'month',
      intervalCount: 1,
      autoRenew: true,
      discount: 0,
      totalVisits: 6,
      createdAt: '2024-02-15',
    },
  ];

  const startEditing = () => {
    setEditedClient({ ...client });
    setIsEditingDetails(true);
  };

  const cancelEditing = () => {
    setEditedClient(null);
    setIsEditingDetails(false);
  };

  const saveDetails = () => {
    if (editedClient) {
      setClient(editedClient);
    }
    setIsEditingDetails(false);
    // In real app, save to backend
  };

  const handleViewServicePlanInvoice = (plan: ServicePlanSubscription) => {
    setSelectedServicePlanForPdf(plan);

    setPlanForm((prev) => ({
      ...prev,
      clientName: plan.clientName,
      clientEmail: plan.clientEmail,
      propertyAddress: plan.propertyAddress,
      phone: plan.phone,
      serviceName: plan.serviceName,
      serviceDescription: plan.serviceDescription,
      price: plan.amount.toString(),
      billingInterval: plan.billingInterval,
      intervalCount: plan.intervalCount.toString(),
      startDate: plan.startDate,
      autoRenew: plan.autoRenew,
      discountType: 'fixed',
      discountValue: plan.discount.toString(),
      totalVisits: plan.totalVisits.toString(),
    }));

    setIsPDFViewOpen(true);
  };

  // Helper functions for status dot colors (Job Details Style)
  const getJobStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'done' || statusLower === 'completed') {
      return 'bg-[#b9df10]'; // Green
    }
    return 'bg-gray-400'; // Default gray
  };

  const getEstimateStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'approved') {
      return 'bg-[#b9df10]'; // Green
    }
    if (statusLower === 'pending') {
      return 'bg-[#f0a041]'; // Orange
    }
    if (statusLower === 'rejected' || statusLower === 'expired') {
      return 'bg-[#f16a6a]'; // Red
    }
    return 'bg-gray-400'; // Default gray
  };

  const getInvoiceStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'paid') {
      return 'bg-[#b9df10]'; // Green
    }
    if (statusLower === 'pending') {
      return 'bg-[#f0a041]'; // Orange
    }
    if (statusLower === 'overdue' || statusLower === 'cancelled') {
      return 'bg-[#f16a6a]'; // Red
    }
    return 'bg-gray-400'; // Default gray
  };

  // Keep old function for Service Plans tabs that still use badge style
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'done' || statusLower === 'paid' || statusLower === 'approved' || statusLower === 'active' || statusLower === 'won') {
      return 'bg-green-50 text-green-600 border-green-200';
    }
    if (statusLower === 'pending' || statusLower === 'follow-up' || statusLower === 'contacted' || statusLower === 'price shared') {
      return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    }
    if (statusLower === 'overdue' || statusLower === 'cancelled' || statusLower === 'rejected' || statusLower === 'lost') {
      return 'bg-red-50 text-red-600 border-red-200';
    }
    if (statusLower === 'paused' || statusLower === 'expired') {
      return 'bg-gray-50 text-gray-600 border-gray-200';
    }
    return 'bg-blue-50 text-blue-600 border-blue-200';
  };

  // Stage colors for Leads tab (matching Leads page)
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

  const displayClient = isEditingDetails ? editedClient : client;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Gradient Background */}
      <div className="text-white" style={{ backgroundColor: '#f8efff' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8" style={{ backgroundColor: '#f8efff' }}>
          {/* Back Button */}
          <button
            onClick={() => navigate('/admin/clients')}
            className="flex items-center gap-2 text-[#051046] hover:bg-white hover:bg-opacity-20 px-4 py-2 rounded-[15px] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Clients
          </button>

          {/* Client Header Info */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-6">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 md:w-10 md:h-10 text-[#9473ff]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#051046]">{displayClient?.name}</h1>
                {displayClient?.company && (
                  <p className="text-[#051046] flex items-center gap-2 text-base md:text-lg mb-1">
                    <Building2 className="w-4 h-4 md:w-5 md:h-5" />
                    {displayClient.company}
                  </p>
                )}
                <p className="text-xs md:text-sm text-[#051046]">Client ID: {displayClient?.id}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white bg-opacity-20 rounded-[20px] p-4">
              <p className="text-xs md:text-sm text-[#051046] mb-1">Total Revenue</p>
              <p className="text-xl md:text-3xl font-bold text-[#051046]">
                ${mockJobs
                  .filter(job => job.status.toLowerCase() === 'done')
                  .reduce((sum, job) => sum + job.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-[20px] p-4">
              <p className="text-xs md:text-sm text-[#051046] mb-1">Total Jobs</p>
              <p className="text-xl md:text-3xl font-bold text-[#051046]">{displayClient?.totalJobs || 0}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-[20px] p-4">
              <p className="text-xs md:text-sm text-[#051046] mb-1">Estimates</p>
              <p className="text-xl md:text-3xl font-bold text-[#051046]">{mockEstimates.length}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-[20px] p-4">
              <p className="text-xs md:text-sm text-[#051046] mb-1">Invoices</p>
              <p className="text-xl md:text-3xl font-bold text-[#051046]">{mockInvoices.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
          <div className="flex gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'details'
                  ? 'border-[#9473ff] text-[#9473ff]'
                  : 'border-transparent text-gray-600 hover:text-[#051046]'
              }`}
            >
              <User className="hidden sm:inline-block w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Client Details</span>
              <span className="sm:hidden">Details</span>
            </button>
            <button
              onClick={() => setActiveTab('service-plans')}
              className={`px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'service-plans'
                  ? 'border-[#9473ff] text-[#9473ff]'
                  : 'border-transparent text-gray-600 hover:text-[#051046]'
              }`}
            >
              <Briefcase className="hidden sm:inline-block w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Active Plans ({mockServicePlans.length})</span>
              <span className="sm:hidden">Plans ({mockServicePlans.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'jobs'
                  ? 'border-[#9473ff] text-[#9473ff]'
                  : 'border-transparent text-gray-600 hover:text-[#051046]'
              }`}
            >
              <CheckCircle className="hidden sm:inline-block w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Jobs Completed ({mockJobs.length})</span>
              <span className="sm:hidden">Jobs ({mockJobs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('estimates')}
              className={`px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'estimates'
                  ? 'border-[#9473ff] text-[#9473ff]'
                  : 'border-transparent text-gray-600 hover:text-[#051046]'
              }`}
            >
              <FileText className="hidden sm:inline-block w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span>Estimates ({mockEstimates.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'invoices'
                  ? 'border-[#9473ff] text-[#9473ff]'
                  : 'border-transparent text-gray-600 hover:text-[#051046]'
              }`}
            >
              <DollarSign className="hidden sm:inline-block w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span>Invoices ({mockInvoices.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'leads'
                  ? 'border-[#9473ff] text-[#9473ff]'
                  : 'border-transparent text-gray-600 hover:text-[#051046]'
              }`}
            >
              <Users className="hidden sm:inline-block w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span>Leads ({mockLeads.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 lg:py-8">
        {/* Client Details Tab */}
        {activeTab === 'details' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-[#051046]">Client Information</h2>
              {!isEditingDetails ? (
                <button
                  onClick={startEditing}
                  className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base bg-[#9473ff] text-white rounded-[36px] hover:bg-[#7c5fd8] transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  Edit Details
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto">
                  <button
                    onClick={cancelEditing}
                    className="px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base bg-gray-200 text-[#051046] rounded-[36px] hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={saveDetails}
                    className="px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base bg-[#9473ff] text-white rounded-[36px] hover:bg-[#7c5fd8] transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div
              className="bg-white rounded-[20px] border border-[#e2e8f0] p-4 md:p-8"
              style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Full Name */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-[#051046] mb-2 md:mb-3">
                    Full Name *
                  </label>
                  {isEditingDetails ? (
                    <input
                      type="text"
                      value={editedClient?.name || ''}
                      onChange={(e) => setEditedClient(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#9473ff] text-[#051046] text-sm md:text-base"
                    />
                  ) : (
                    <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-[15px]">
                      <User className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                      <span className="text-[#051046] text-base md:text-lg">{displayClient?.name}</span>
                    </div>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-[#051046] mb-2 md:mb-3">
                    Company
                  </label>
                  {isEditingDetails ? (
                    <input
                      type="text"
                      value={editedClient?.company || ''}
                      onChange={(e) => setEditedClient(prev => prev ? { ...prev, company: e.target.value } : null)}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#9473ff] text-[#051046] text-sm md:text-base"
                    />
                  ) : (
                    <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-[15px]">
                      <Building2 className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                      <span className="text-[#051046] text-base md:text-lg">{displayClient?.company || '—'}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-[#051046] mb-2 md:mb-3">
                    Email *
                  </label>
                  {isEditingDetails ? (
                    <input
                      type="email"
                      value={editedClient?.email || ''}
                      onChange={(e) => setEditedClient(prev => prev ? { ...prev, email: e.target.value } : null)}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#9473ff] text-[#051046] text-sm md:text-base"
                    />
                  ) : (
                    <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-[15px]">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                      <span className="text-[#051046] text-base md:text-lg break-all">{displayClient?.email}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-[#051046] mb-2 md:mb-3">
                    Phone *
                  </label>
                  {isEditingDetails ? (
                    <input
                      type="tel"
                      value={editedClient?.phone || ''}
                      onChange={(e) => setEditedClient(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#9473ff] text-[#051046] text-sm md:text-base"
                    />
                  ) : (
                    <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-[15px]">
                      <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                      <span className="text-[#051046] text-base md:text-lg">{displayClient?.phone}</span>
                    </div>
                  )}
                </div>

                {/* Address - Full Width */}
                <div className="md:col-span-2">
                  <label className="block text-xs md:text-sm font-medium text-[#051046] mb-2 md:mb-3">
                    Address *
                  </label>
                  {isEditingDetails ? (
                    <input
                      type="text"
                      value={editedClient?.address || ''}
                      onChange={(e) => setEditedClient(prev => prev ? { ...prev, address: e.target.value } : null)}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#9473ff] text-[#051046] text-sm md:text-base"
                    />
                  ) : (
                    <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-[15px]">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                      <span className="text-[#051046] text-base md:text-lg">{displayClient?.address}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-[#051046] mb-2 md:mb-3">
                    Tags
                  </label>
                  <div className="flex items-center gap-1.5 md:gap-2 flex-wrap p-3 md:p-4 bg-gray-50 rounded-[15px] min-h-[52px] md:min-h-[56px]">
                    {displayClient?.tags && displayClient.tags.length > 0 ? (
                      displayClient.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2.5 md:px-3 py-1 rounded-[0.25rem] text-xs md:text-sm border border-gray-300"
                          style={{ backgroundColor: '#e5e7eb', color: '#364153' }}
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs md:text-sm">No tags</span>
                    )}
                  </div>
                </div>

                {/* Active Plans */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-[#051046] mb-2 md:mb-3">
                    Active Plans
                  </label>
                  <div className="flex items-center gap-1.5 md:gap-2 flex-wrap p-3 md:p-4 bg-gray-50 rounded-[15px] min-h-[52px] md:min-h-[56px]">
                    {displayClient?.servicePlan ? (
                      <span
                        className="px-2.5 md:px-3 py-1 rounded-[0.25rem] text-xs md:text-sm border border-gray-300"
                        style={{ backgroundColor: '#e5e7eb', color: '#364153' }}
                      >
                        {displayClient.servicePlan}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs md:text-sm">No active plans</span>
                    )}
                  </div>
                </div>

                {/* Client Since */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-[#051046] mb-2 md:mb-3">
                    Client Since
                  </label>
                  <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-[15px]">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-[#051046] text-base md:text-lg">
                      {displayClient?.created && new Date(displayClient.created).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Plans Tab */}
        {activeTab === 'service-plans' && (
          <div>
            <div className="mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-[#051046]">Service Plan Subscriptions</h2>
            </div>
            <div className="space-y-4 md:space-y-6">
              {mockServicePlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => navigate('/admin/service-plans')}
                  className="bg-white border border-[#e2e8f0] rounded-[20px] p-4 md:p-6 lg:p-8 cursor-pointer hover:shadow-lg transition-shadow"
                  style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4 md:mb-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                        <h3 className="text-lg md:text-xl font-bold text-[#051046]">{plan.planName}</h3>
                        <span 
                          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium ${
                            plan.status.toLowerCase() === 'active' 
                              ? '' 
                              : `border ${getStatusColor(plan.status)}`
                          }`}
                          style={plan.status.toLowerCase() === 'active' ? { color: '#b9df10' } : {}}
                        >
                          {plan.status}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-500">Subscription ID: {plan.id}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
                      <div className="relative group">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle cancel plan action
                          }}
                          className="w-full sm:w-auto px-4 md:px-6 py-2 text-sm md:text-base text-white rounded-[32px] hover:opacity-90 transition-all flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#f16a6a' }}
                        >
                          <Info className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          Stop Auto-Renewal
                        </button>
                        {/* Tooltip */}
                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-56 z-10">
                          <div 
                            className="bg-gray-800 text-white text-xs rounded-[10px] px-3 py-2 shadow-lg"
                          >
                            Cancels auto-renewal at cycle end
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewServicePlanInvoice(plan);
                        }}
                        className="w-full sm:w-auto px-4 md:px-6 py-2 text-sm md:text-base bg-white border border-[#e8e8e8] text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                    <div>
                      <p className="text-xs md:text-sm text-gray-500 mb-1 md:mb-2">Amount</p>
                      <p className="text-base md:text-lg lg:text-xl font-bold text-[#051046]">${plan.amount}/{plan.interval}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-500 mb-1 md:mb-2">Start Date</p>
                      <p className="text-sm md:text-base text-[#051046]">{new Date(plan.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-500 mb-1 md:mb-2">Next Billing</p>
                      <p className="text-sm md:text-base text-[#051046]">{new Date(plan.nextBillingDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-500 mb-1 md:mb-2">Interval</p>
                      <p className="text-sm md:text-base text-[#051046]">{plan.interval}</p>
                    </div>
                  </div>
                </div>
              ))}
              {mockServicePlans.length === 0 && (
                <div
                  className="bg-white border border-[#e2e8f0] rounded-[20px] p-8 md:p-12 text-center"
                  style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
                >
                  <Briefcase className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-base md:text-lg">No active service plans</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Jobs Completed Tab */}
        {activeTab === 'jobs' && (
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-[#051046] mb-4 md:mb-6">Completed Jobs</h2>
            <div
              className="bg-white border border-[#e2e8f0] rounded-[20px] overflow-hidden"
              style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-gray-50 border-b border-[#e2e8f0]">
                    <tr>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-500 uppercase">Job ID</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-500 uppercase">Job Type</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-500 uppercase">Job Status</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-500 uppercase">Scheduled</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-500 uppercase">Tech</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {mockJobs.slice((jobsCurrentPage - 1) * itemsPerPage, jobsCurrentPage * itemsPerPage).map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#051046] font-medium">{job.id}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#051046]">{job.title}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getJobStatusColor(job.status)}`}></div>
                            <span className="text-xs md:text-sm text-[#051046]">{job.status}</span>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#051046]">{new Date(job.date).toLocaleDateString()}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#051046]">{job.technician}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <button className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {mockJobs.length > 0 && (
                <div className="border-t border-[#e2e8f0] px-3 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs md:text-sm text-gray-600">
                    Showing {((jobsCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(jobsCurrentPage * itemsPerPage, mockJobs.length)} of {mockJobs.length} entries
                  </div>

                  <div className="flex items-center gap-1 md:gap-2">
                    <button
                      onClick={() => setJobsCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={jobsCurrentPage === 1}
                      className="p-1.5 md:p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                    
                    <div className="flex items-center gap-0.5 md:gap-1">
                      {Array.from({ length: Math.min(5, Math.ceil(mockJobs.length / itemsPerPage)) }, (_, i) => {
                        const totalPages = Math.ceil(mockJobs.length / itemsPerPage);
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (jobsCurrentPage <= 3) {
                          pageNum = i + 1;
                        } else if (jobsCurrentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = jobsCurrentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setJobsCurrentPage(pageNum)}
                            className={`w-7 h-7 md:w-8 md:h-8 rounded-[10px] text-xs md:text-sm font-medium transition-colors ${
                              jobsCurrentPage === pageNum
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
                      onClick={() => setJobsCurrentPage(prev => Math.min(prev + 1, Math.ceil(mockJobs.length / itemsPerPage)))}
                      disabled={jobsCurrentPage === Math.ceil(mockJobs.length / itemsPerPage)}
                      className="p-1.5 md:p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estimates Tab */}
        {activeTab === 'estimates' && (
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-[#051046] mb-4 md:mb-6">Estimates</h2>
            <div
              className="bg-white border border-[#e2e8f0] rounded-[20px] overflow-hidden"
              style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-gray-50 border-b border-[#e2e8f0]">
                    <tr>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-[#051046] uppercase tracking-wider">Estimate ID</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-[#051046] uppercase tracking-wider">Created</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-[#051046] uppercase tracking-wider">Amount</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-[#051046] uppercase tracking-wider">Status</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-[#051046] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {mockEstimates.slice((estimatesCurrentPage - 1) * itemsPerPage, estimatesCurrentPage * itemsPerPage).map((estimate) => (
                      <tr key={estimate.id} className="hover:bg-gray-50">
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#051046] font-medium">{estimate.id}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#051046]">{new Date(estimate.date).toLocaleDateString()}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#051046] font-medium">${estimate.amount.toLocaleString()}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getEstimateStatusColor(estimate.status)}`}></div>
                            <span className="text-xs md:text-sm text-[#051046]">{estimate.status}</span>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <button className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {mockEstimates.length > 0 && (
                <div className="border-t border-[#e2e8f0] px-3 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs md:text-sm text-gray-600">
                    Showing {((estimatesCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(estimatesCurrentPage * itemsPerPage, mockEstimates.length)} of {mockEstimates.length} entries
                  </div>

                  <div className="flex items-center gap-1 md:gap-2">
                    <button
                      onClick={() => setEstimatesCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={estimatesCurrentPage === 1}
                      className="p-1.5 md:p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                    
                    <div className="flex items-center gap-0.5 md:gap-1">
                      {Array.from({ length: Math.min(5, Math.ceil(mockEstimates.length / itemsPerPage)) }, (_, i) => {
                        const totalPages = Math.ceil(mockEstimates.length / itemsPerPage);
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (estimatesCurrentPage <= 3) {
                          pageNum = i + 1;
                        } else if (estimatesCurrentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = estimatesCurrentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setEstimatesCurrentPage(pageNum)}
                            className={`w-7 h-7 md:w-8 md:h-8 rounded-[10px] text-xs md:text-sm font-medium transition-colors ${
                              estimatesCurrentPage === pageNum
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
                      onClick={() => setEstimatesCurrentPage(prev => Math.min(prev + 1, Math.ceil(mockEstimates.length / itemsPerPage)))}
                      disabled={estimatesCurrentPage === Math.ceil(mockEstimates.length / itemsPerPage)}
                      className="p-1.5 md:p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-[#051046] mb-4 md:mb-6">Invoices</h2>
            <div
              className="bg-white border border-[#e2e8f0] rounded-[20px] overflow-hidden"
              style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-gray-50 border-b border-[#e2e8f0]">
                    <tr>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-[#051046] uppercase tracking-wider">Invoice ID</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-[#051046] uppercase tracking-wider">Created</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-[#051046] uppercase tracking-wider">Amount</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-[#051046] uppercase tracking-wider">Status</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-[#051046] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {mockInvoices.slice((invoicesCurrentPage - 1) * itemsPerPage, invoicesCurrentPage * itemsPerPage).map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#051046] font-medium">{invoice.number}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#051046]">{new Date(invoice.date).toLocaleDateString()}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#051046] font-medium">${invoice.amount}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getInvoiceStatusColor(invoice.status)}`}></div>
                            <span className="text-xs md:text-sm text-[#051046]">{invoice.status}</span>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <button className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {mockInvoices.length > 0 && (
                <div className="border-t border-[#e2e8f0] px-3 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs md:text-sm text-gray-600">
                    Showing {((invoicesCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(invoicesCurrentPage * itemsPerPage, mockInvoices.length)} of {mockInvoices.length} entries
                  </div>

                  <div className="flex items-center gap-1 md:gap-2">
                    <button
                      onClick={() => setInvoicesCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={invoicesCurrentPage === 1}
                      className="p-1.5 md:p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                    
                    <div className="flex items-center gap-0.5 md:gap-1">
                      {Array.from({ length: Math.min(5, Math.ceil(mockInvoices.length / itemsPerPage)) }, (_, i) => {
                        const totalPages = Math.ceil(mockInvoices.length / itemsPerPage);
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (invoicesCurrentPage <= 3) {
                          pageNum = i + 1;
                        } else if (invoicesCurrentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = invoicesCurrentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setInvoicesCurrentPage(pageNum)}
                            className={`w-7 h-7 md:w-8 md:h-8 rounded-[10px] text-xs md:text-sm font-medium transition-colors ${
                              invoicesCurrentPage === pageNum
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
                      onClick={() => setInvoicesCurrentPage(prev => Math.min(prev + 1, Math.ceil(mockInvoices.length / itemsPerPage)))}
                      disabled={invoicesCurrentPage === Math.ceil(mockInvoices.length / itemsPerPage)}
                      className="p-1.5 md:p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-[#051046] mb-4 md:mb-6">Leads</h2>
            <div
              className="bg-white border border-[#e2e8f0] rounded-[20px] overflow-hidden"
              style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[768px]">
                  <thead className="bg-gray-50 border-b border-[#e2e8f0]">
                    <tr>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-600 uppercase">Lead ID</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-600 uppercase">Job Type</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-600 uppercase">Stage</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-600 uppercase">Source</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-600 uppercase">Value</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-600 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {mockLeads.slice((leadsCurrentPage - 1) * itemsPerPage, leadsCurrentPage * itemsPerPage).map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#051046] font-medium">{lead.id}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#051046]">{lead.title}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <span className={`px-2 md:px-3 py-1 rounded-[15px] text-[10px] md:text-xs font-medium text-[#051046] ${getStageColor(lead.stage)}`}>
                            {lead.stage}
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#051046]">{lead.source}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#051046] font-semibold">${lead.value.toLocaleString()}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#051046]">{new Date(lead.createdDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {mockLeads.length > 0 && (
                <div className="border-t border-[#e2e8f0] px-3 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs md:text-sm text-gray-600">
                    Showing {((leadsCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(leadsCurrentPage * itemsPerPage, mockLeads.length)} of {mockLeads.length} entries
                  </div>

                  <div className="flex items-center gap-1 md:gap-2">
                    <button
                      onClick={() => setLeadsCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={leadsCurrentPage === 1}
                      className="p-1.5 md:p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                    
                    <div className="flex items-center gap-0.5 md:gap-1">
                      {Array.from({ length: Math.min(5, Math.ceil(mockLeads.length / itemsPerPage)) }, (_, i) => {
                        const totalPages = Math.ceil(mockLeads.length / itemsPerPage);
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (leadsCurrentPage <= 3) {
                          pageNum = i + 1;
                        } else if (leadsCurrentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = leadsCurrentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setLeadsCurrentPage(pageNum)}
                            className={`w-7 h-7 md:w-8 md:h-8 rounded-[10px] text-xs md:text-sm font-medium transition-colors ${
                              leadsCurrentPage === pageNum
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
                      onClick={() => setLeadsCurrentPage(prev => Math.min(prev + 1, Math.ceil(mockLeads.length / itemsPerPage)))}
                      disabled={leadsCurrentPage === Math.ceil(mockLeads.length / itemsPerPage)}
                      className="p-1.5 md:p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Service Plan Modal */}
      {isAddPlanModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-4xl border border-[#e2e8f0] overflow-hidden">
            <div className="max-h-[90vh] overflow-y-auto p-[10px] m-[10px]">
              <div className="sticky top-0 bg-white border-b border-[#e2e8f0] px-6 py-4 z-50 flex items-center justify-between rounded-t-[20px]">
                <div>
                  <h2 className="text-xl font-semibold text-[#051046]">Create Service Plan</h2>
                  <p className="text-sm text-gray-500 mt-1">Set up a recurring service subscription</p>
                </div>
                <button
                  onClick={() => {
                    setIsAddPlanModalOpen(false);
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
                      totalVisits: '12',
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
                          className="w-full pl-8 pr-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                          className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                            className="w-20 px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                          className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                          className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                          id="isUpsellClient"
                          checked={planForm.isUpsell}
                          onChange={(e) => setPlanForm({ ...planForm, isUpsell: e.target.checked })}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-600"
                        />
                        <label htmlFor="isUpsellClient" className="text-sm font-medium text-[#051046] flex items-center gap-2">
                          Is this an upsell?
                          <div className="w-5 h-5 bg-[rgb(185,223,16)] flex items-center justify-center rounded-sm">
                            <span className="text-white text-xs font-bold">U</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Upsell Owner Selection - Show only if "Is this an upsell?" is checked */}
                    {planForm.isUpsell && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#051046] mb-2">
                            Upsold By <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={planForm.upsellOwner}
                            onChange={(e) => setPlanForm({ ...planForm, upsellOwner: e.target.value })}
                            className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                          >
                            <option value="">Select team member...</option>
                            {mockTeamMembers.map((member, idx) => (
                              <option key={idx} value={member.name}>
                                {member.name} ({member.role === 'T' ? 'Technician' : 'Admin'})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#051046] mb-2">
                            Role <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={planForm.upsellRole}
                            onChange={(e) => setPlanForm({ ...planForm, upsellRole: e.target.value as 'T' | 'A' })}
                            className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                          >
                            <option value="T">Technician</option>
                            <option value="A">Admin</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-[15px]">
                      <p className="text-xs text-[#f16a6a]">Note: Turning off auto-renew stops the plan at the end of the billing cycle.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#051046] mb-2">Apply Discount (Optional)</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                          value={planForm.discountType}
                          onChange={(e) => setPlanForm({ ...planForm, discountType: e.target.value as any })}
                          className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                          className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                    </div>

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
                      totalVisits: '12',
                      cardNumber: '',
                      cardExpiry: '',
                      cardCVV: '',
                      cardholderName: '',
                    });
                  }}
                  className="px-6 py-2 border border-[#e8e8e8] text-[#051046] rounded-[25px] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                
                {/* Action Buttons */}
                <button
                  onClick={() => {
                    // Validate required fields
                    if (!planForm.clientName || !planForm.clientEmail || !planForm.propertyAddress || !planForm.serviceName || !planForm.price) {
                      alert('Please fill in all required fields (marked with *)');
                      return;
                    }
                    setIsPDFViewOpen(true);
                  }}
                  className="px-6 py-2 border border-[#8b5cf6] text-[#8b5cf6] rounded-[25px] hover:bg-purple-50 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  View
                </button>
                
                <button
                  onClick={() => {
                    // Validate required fields
                    if (!planForm.clientName || !planForm.clientEmail || !planForm.propertyAddress || !planForm.serviceName || !planForm.price) {
                      alert('Please fill in all required fields (marked with *)');
                      return;
                    }
                    setIsPaymentMethodModalOpen(true);
                  }}
                  className="px-6 py-2 bg-[#28bdf2] text-white rounded-[25px] hover:bg-[#1da8d9] transition-colors flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  Pay Now
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
                  className="px-6 py-2 bg-[#9473ff] text-white rounded-[25px] hover:bg-[#7f5fd9] transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF View Modal */}
      {isPDFViewOpen && selectedServicePlanForPdf && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsPDFViewOpen(false);
              setSelectedServicePlanForPdf(null);
            }
          }}
        >
          <div className="bg-white rounded-[20px] w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[#e2e8f0]">
              <div className="sticky top-0 bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between rounded-t-[20px]">
                <div className="flex-1"></div>
                <h2 className="text-xl font-bold text-[#051046]">INVOICE</h2>
                <div className="flex-1 flex justify-end">
                  <button onClick={() => {
                    setIsPDFViewOpen(false);
                    setSelectedServicePlanForPdf(null);
                  }} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <div className="mb-8 pb-6 border-b-2 border-[#8b5cf6]">
                  <h1 className="text-3xl font-bold text-[#051046] mb-2">INVOICE</h1>
                    <p className="text-sm text-[#051046]">KL Plumbing</p>
                    <p className="text-sm text-[#051046]">huexdesigns@gmail.com</p>
                    <p className="text-sm text-[#051046]">5555555555</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">INVOICE #</p>
                      <p className="text-sm font-semibold text-[#051046]">{selectedServicePlanForPdf.id.replace('SUB-', 'INV-')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">CREATED DATE</p>
                      <p className="text-sm font-semibold text-[#051046]">{selectedServicePlanForPdf.createdAt}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">BILLING START DATE</p>
                      <p className="text-sm font-semibold text-[#051046]">{new Date(planForm.startDate).toLocaleDateString()}</p>
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
                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#051046] uppercase">Description</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-[#051046] uppercase">Qty</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-[#051046] uppercase">Price</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-[#051046] uppercase">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[#e2e8f0]">
                            <td className="px-4 py-4">
                              <p className="text-sm font-semibold text-[#051046]">{planForm.serviceName}</p>
                              <p className="text-xs text-gray-600 mt-1">{planForm.serviceDescription}</p>
                              <span className="inline-block mt-2 text-[12px] font-medium text-[#6a7282]">NON-TAXABLE</span>
                            </td>
                            <td className="px-4 py-4 text-center text-sm text-[#051046]">1</td>
                            <td className="px-4 py-4 text-right text-sm text-[#051046]">${parseFloat(planForm.price).toFixed(2)}</td>
                            <td className="px-4 py-4 text-right">
                              <p className="text-sm font-semibold text-[#051046]">${parseFloat(planForm.price).toFixed(2)}</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mb-8">
                    <div className="border border-[#e2e8f0] rounded-[15px] p-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Subtotal</span>
                          <span className="text-sm font-medium text-[#051046]">${parseFloat(planForm.price).toFixed(2)}</span>
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
                          <span className="text-base font-bold text-[#051046]">Total</span>
                          <span className="text-xl font-bold text-[#8b5cf6]">${(() => {
                            const price = parseFloat(planForm.price);
                            let discount = 0;
                            if (planForm.discountType === 'percentage') {
                              discount = (price * parseFloat(planForm.discountValue)) / 100;
                            } else {
                              discount = parseFloat(planForm.discountValue);
                            }
                            return (price - discount).toFixed(2);
                          })()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-[#051046] mb-3 uppercase">Service Plan Details</h3>
                    <div className="space-y-2 text-xs text-gray-600">
                      <p>• <strong>Billing Frequency:</strong> {formatBillingInterval(planForm.billingInterval, parseInt(planForm.intervalCount))}</p>
                      <p>• <strong>Start Date:</strong> {new Date(planForm.startDate).toLocaleDateString()}</p>
                      <p>• <strong>Auto-Renewal:</strong> {planForm.autoRenew ? 'Enabled' : 'Disabled'}</p>
                      <p>• <strong>Total Visits:</strong> {planForm.totalVisits}</p>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-[#e2e8f0] space-y-4">
                    <div className="border border-[#e2e8f0] rounded-[15px] p-4">
                      <label className="flex items-start gap-3">
                        <input type="checkbox" checked disabled className="mt-1 h-4 w-4 rounded border-gray-300 text-[#9473ff] focus:ring-[#9473ff]" />
                        <span className="text-sm text-[#6a7282] leading-6">
                          I agree to the Service Terms outlined by My Plumber Company and authorize recurring charges of ${parseFloat(planForm.price).toFixed(2)} every {parseInt(planForm.intervalCount) === 1 ? planForm.billingInterval : `${planForm.intervalCount} ${planForm.billingInterval}s`} until I cancel.
                        </span>
                      </label>
                    </div>
                  </div>
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
              <h3 className="text-lg font-semibold text-[#051046]">Send Now</h3>
            </div>
            <p className="text-[#051046] mb-6">This will create the subscription and send a secure payment link to the customer's email address. The customer can complete payment at their convenience through their customer dashboard.</p>
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
              <button onClick={() => setIsSendConfirmOpen(false)} className="px-6 py-2 border border-[#e8e8e8] text-[#051046] rounded-[15px] hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => {
                createServicePlan();
                setIsSendConfirmOpen(false);
                setIsAddPlanModalOpen(false);
                alert('Payment link sent successfully! 📧\n\nThe customer will receive an email with a secure link to complete payment through Stripe Checkout in their customer dashboard.');
              }} className="px-6 py-2 bg-[#9473ff] text-white rounded-[15px] hover:bg-[#7f5fd9] transition-colors">Send Link</button>
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
                className="w-full p-4 border-2 border-[#e2e8f0] rounded-[15px] hover:border-green-500 hover:bg-green-50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                    <DollarSign className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
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
    </div>
  );
}
