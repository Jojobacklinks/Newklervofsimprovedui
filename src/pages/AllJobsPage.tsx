import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, Truck, HardHat, Star, DollarSign, ArrowLeft, X, ChevronLeft, ChevronRight, Calendar, CalendarClock, Info, Briefcase, CircleX } from 'lucide-react';
import { useSearchParams, useNavigate, useLocation } from 'react-router';
import { DateRangePicker } from '../components/DateRangePicker';
import { AddClientModal, ClientData } from '../components/AddClientModal';
import { AddCustomValueModal } from '../components/AddCustomValueModal';
import { NewJobModal } from '../components/NewJobModal';
import { useJobs } from '../contexts/JobsContext';
import type { Job } from '../data/jobsData';

// Available tags for both jobs and clients
const availableTags = ['Urgent', 'New', 'Quick'];

// Mock client database for autocomplete
const mockClientDatabase = [
  { id: 'C-101', name: 'John Smith', email: 'john.smith@email.com', phone: '(555) 123-4567' },
  { id: 'C-102', name: 'John Smith', email: 'johnsmith99@gmail.com', phone: '(555) 987-6543' },
  { id: 'C-103', name: 'Sarah Johnson', email: 'sarah.j@company.com', phone: '(555) 234-5678' },
  { id: 'C-104', name: 'Michael Brown', email: 'mbrown@business.com', phone: '(555) 345-6789' },
  { id: 'C-105', name: 'Emily Davis', email: 'emily.davis@email.com', phone: '(555) 456-7890' },
  { id: 'C-106', name: 'John Williams', email: 'j.williams@work.com', phone: '(555) 567-8901' },
  { id: 'C-107', name: 'Jessica Miller', email: 'jess.miller@email.com', phone: '(555) 678-9012' },
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

const jobValueById: Record<string, number> = {
  'J-101': 2500,
  'J-102': 1800,
  'J-103': 3200,
  'J-104': 4500,
  'J-105': 1500,
  'J-106': 2800,
  'J-107': 3600,
  'J-108': 2200,
};

type JobPeriodFilter =
  | 'all-time'
  | 'today'
  | 'last-7-days'
  | 'current-month'
  | 'last-month'
  | 'last-3-months'
  | 'current-year';

export function AllJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { jobs: contextJobs, addJob, updateJob, deleteJob } = useJobs();
  const location = useLocation();
  const isStaffView = location.pathname.startsWith('/staff');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // Default to newest first
  const [periodFilter, setPeriodFilter] = useState<JobPeriodFilter>('all-time');
  const [dateRange, setDateRange] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [showUpsellsOnly, setShowUpsellsOnly] = useState(false);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Details');
  
  // Job form state
  const [jobTags, setJobTags] = useState<string[]>([]);
  const [isJobTagDropdownOpen, setIsJobTagDropdownOpen] = useState(false);
  
  // Client autocomplete state
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<typeof mockClientDatabase[0] | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [filteredClients, setFilteredClients] = useState<typeof mockClientDatabase>([]);
  const clientInputRef = useRef<HTMLDivElement>(null);

  // Inventory dropdown state
  const [showInventoryDropdown, setShowInventoryDropdown] = useState(false);
  const [inventorySearch, setInventorySearch] = useState('');

  // Filter inventory based on search
  const filteredInventory = inventoryDatabase.filter(item =>
    item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    item.type.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  // Custom value modal state
  const [customValueModal, setCustomValueModal] = useState<{
    isOpen: boolean;
    type: 'jobType' | 'jobSource' | 'tags' | null;
    title: string;
  }>({
    isOpen: false,
    type: null,
    title: '',
  });

  // Job types list
  const [jobTypes, setJobTypes] = useState([
    'HVAC Installation',
    'Plumbing Repair',
    'Electrical Work',
    'Roofing',
    'Landscaping',
  ]);

  // Job sources list
  const [jobSources, setJobSources] = useState([
    'Website',
    'Referral',
    'Social Media',
    'Trade Show',
  ]);
  
  // Date range picker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const formatScheduledDate = (value: string) => {
    const parsedDate = new Date(value);

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }

    const [datePart] = value.split(' ');
    const [month, day, year] = datePart.split('/');

    if (!month || !day || !year) return datePart;

    const normalizedYear = year.length === 2 ? `20${year}` : year;
    const fallbackDate = new Date(`${normalizedYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`);

    return Number.isNaN(fallbackDate.getTime())
      ? datePart
      : fallbackDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
  };

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

  // Check for URL parameter to open Add Job modal
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add-job') {
      setIsAddJobModalOpen(true);
      // Remove the parameter from URL
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
    
    // Check for jobId parameter to filter to specific job
    const jobIdParam = searchParams.get('jobId');
    if (jobIdParam) {
      setSearchTerm(jobIdParam);
      // Remove the parameter from URL after setting the search
      searchParams.delete('jobId');
      setSearchParams(searchParams, { replace: true });
    }

    const sortByParam = searchParams.get('sortBy');
    if (sortByParam === 'positive-rated' || sortByParam === 'negative-rated') {
      setSortBy(sortByParam);
    }
  }, [searchParams, setSearchParams]);

  // Close tag dropdown when clicking outside
  useEffect(() => {
    if (!isTagDropdownOpen) return; // Only add listener when dropdown is open
    
    const handleClickOutside = (event: MouseEvent) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isTagDropdownOpen]);

  // Use jobs from context instead of local state
  const jobs = contextJobs;

  // Get all unique tags from jobs
  const allTags = Array.from(new Set(jobs.flatMap(job => job.tags))).sort();

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Remove a specific tag
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  // Job Tags management
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

  // Filtering
  const isWithinSelectedPeriod = (dateString: string) => {
    if (periodFilter === 'all-time') return true;

    const jobDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const compareDate = new Date(jobDate);
    compareDate.setHours(0, 0, 0, 0);

    switch (periodFilter) {
      case 'today':
        return compareDate.getTime() === today.getTime();
      case 'last-7-days': {
        const start = new Date(today);
        start.setDate(today.getDate() - 6);
        return compareDate >= start && compareDate <= today;
      }
      case 'current-month':
        return compareDate.getMonth() === today.getMonth() && compareDate.getFullYear() === today.getFullYear();
      case 'last-month': {
        const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        return compareDate >= lastMonthStart && compareDate < currentMonthStart;
      }
      case 'last-3-months': {
        const start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        return compareDate >= start && compareDate <= today;
      }
      case 'current-year':
        return compareDate.getFullYear() === today.getFullYear();
      default:
        return true;
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesJobStatus = jobStatusFilter === '' || job.jobStatus === jobStatusFilter;
    const matchesTag = selectedTags.length === 0 || job.tags.some(tag => selectedTags.includes(tag));
    const matchesUpsell = !showUpsellsOnly || job.hasUpsell;
    const matchesUpsellFilter = sortBy !== 'upsell-only' || job.hasUpsell;
    const matchesDateRange =
      !(startDate && endDate) ||
      (() => {
        const jobDate = new Date(job.scheduledStart);
        return jobDate >= startDate && jobDate <= endDate;
      })();
    const matchesPeriod = isWithinSelectedPeriod(job.scheduledStart);
    const matchesRatingFilter =
      sortBy === 'positive-rated'
        ? typeof job.feedbackRating === 'number' && job.feedbackRating >= 4
        : sortBy === 'negative-rated'
          ? typeof job.feedbackRating === 'number' && job.feedbackRating <= 3
          : true;
    
    return matchesSearch && matchesJobStatus && matchesTag && matchesUpsell && matchesUpsellFilter && matchesDateRange && matchesPeriod && matchesRatingFilter;
  });

  // Sorting - create a new array to avoid mutating
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const getRatingGroup = (job: Job, type: 'positive' | 'negative') => {
      const rating = job.feedbackRating;
      if (typeof rating !== 'number') return 0;
      return type === 'positive' ? (rating >= 4 ? 1 : 0) : (rating <= 3 ? 1 : 0);
    };

    const getScheduledTime = (job: Job) => new Date(job.scheduledStart).getTime();

    if (sortBy === 'date-desc') {
      // Newest first
      return new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime();
    } else if (sortBy === 'date-asc') {
      // Oldest first
      return new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime();
    } else if (sortBy === 'positive-rated') {
      const ratingGroupDiff = getRatingGroup(b, 'positive') - getRatingGroup(a, 'positive');
      if (ratingGroupDiff !== 0) return ratingGroupDiff;

      return getScheduledTime(b) - getScheduledTime(a);
    } else if (sortBy === 'negative-rated') {
      const ratingGroupDiff = getRatingGroup(b, 'negative') - getRatingGroup(a, 'negative');
      if (ratingGroupDiff !== 0) return ratingGroupDiff;

      return getScheduledTime(b) - getScheduledTime(a);
    } else if (sortBy === 'upsell-only') {
      // Sort by newest first when showing upsells only
      return new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime();
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobs = sortedJobs.slice(startIndex, endIndex);

  const totalJobs = jobs.length;
  const cancelledJobs = jobs.filter((job) => job.jobStatus === 'Cancelled').length;
  const totalJobsValue = jobs.reduce((sum, job) => sum + (jobValueById[job.id] ?? 0), 0);
  const averageJobValue = totalJobs > 0 ? totalJobsValue / totalJobs : 0;
  const cancellationRate = totalJobs > 0 ? (cancelledJobs / totalJobs) * 100 : 0;
  const lostRevenue = jobs
    .filter((job) => job.jobStatus === 'Cancelled')
    .reduce((sum, job) => sum + (jobValueById[job.id] ?? 0), 0);
  const ratedJobs = jobs.filter((job) => typeof job.feedbackRating === 'number');
  const averageRating =
    ratedJobs.length > 0
      ? ratedJobs.reduce((sum, job) => sum + (job.feedbackRating ?? 0), 0) / ratedJobs.length
      : 0;
  const positiveRatedJobs = ratedJobs.filter((job) => (job.feedbackRating ?? 0) >= 4).length;
  const negativeRatedJobs = ratedJobs.filter((job) => (job.feedbackRating ?? 0) <= 3).length;
  const parseDurationToMinutes = (duration: string) => {
    const hoursMatch = duration.match(/(\d+)h/);
    const minutesMatch = duration.match(/(\d+)min/);
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
    return (hours * 60) + minutes;
  };
  const formatMinutesAsDuration = (minutes: number) => {
    const wholeMinutes = Math.max(0, Math.round(minutes));
    const hours = Math.floor(wholeMinutes / 60);
    const remainingMinutes = wholeMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }

    return `${remainingMinutes}m`;
  };
  const averageJobDurationMinutes =
    totalJobs > 0
      ? jobs.reduce((sum, job) => sum + parseDurationToMinutes(job.duration), 0) / totalJobs
      : 0;
  const averageJobDurationLabel = formatMinutesAsDuration(averageJobDurationMinutes);
  const longestJobTypesText = Object.entries(
    jobs.reduce<Record<string, { totalMinutes: number; count: number }>>((acc, job) => {
      const key = job.jobType || 'Unknown';
      if (!acc[key]) {
        acc[key] = { totalMinutes: 0, count: 0 };
      }

      acc[key].totalMinutes += parseDurationToMinutes(job.duration);
      acc[key].count += 1;
      return acc;
    }, {})
  )
    .map(([jobType, stats]) => ({
      jobType,
      averageMinutes: stats.count > 0 ? stats.totalMinutes / stats.count : 0,
    }))
    .sort((a, b) => b.averageMinutes - a.averageMinutes)
    .slice(0, 3)
    .map(({ jobType, averageMinutes }) => `${jobType}: ${formatMinutesAsDuration(averageMinutes)}`)
    .join(' | ');

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const handleEditJob = (job: Job) => {
    const basePath = isStaffView ? '/staff' : '/admin';
    navigate(`${basePath}/jobs/details/${encodeURIComponent(job.id)}`);
  };

  const handleDeleteClick = (jobId: string) => {
    setJobToDelete(jobId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (jobToDelete) {
      deleteJob(jobToDelete);
      alert('Job deleted successfully!');
    }
    setIsDeleteModalOpen(false);
    setJobToDelete(null);
  };

  const handleSaveClient = (clientData: ClientData) => {
    console.log('New client saved:', clientData);
    alert(`Client ${clientData.firstName} ${clientData.lastName} added successfully!`);
    // In a real application, this would save to a database
  };

  const handleNewJobSubmit = (jobData: Job) => {
    // Generate proper J-XXX ID format
    const existingJobNumbers = contextJobs
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
    alert('Job created successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-[#0698c6]';
      case 'Needs Scheduling':
        return 'bg-gray-400';
      case 'In Progress':
        return 'bg-[#28bdf2]';
      case 'Done':
        return 'bg-[#b9df10]';
      case 'Cancelled':
        return 'bg-[#f16a6a]';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="p-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          className="relative flex min-h-[152px] flex-col justify-between rounded-[20px] border border-[#e2e8f0] p-6 bg-white"
          style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
        >
          <div className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5]">
            <Briefcase className="w-5 h-5 text-[#BDBDBD]" />
          </div>
          <p className="text-sm text-gray-600 mb-2">Total Jobs</p>
          <p className="text-3xl font-bold text-[#051046] mb-1">{totalJobs}</p>
          <p className="text-xs text-gray-600">Total Jobs: {formatCurrency(totalJobsValue)} | Average Job Value: {formatCurrency(averageJobValue)}</p>
        </div>

        <div
          className="relative flex min-h-[152px] flex-col justify-between rounded-[20px] border border-[#e2e8f0] p-6 bg-white"
          style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
        >
          <div className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ffdbb0]">
            <Star className="w-5 h-5 text-[#f0a041]" />
          </div>
          <p className="text-sm text-gray-600 mb-2">Average Ratings</p>
          <p className="text-3xl font-bold text-[#051046] mb-1">{averageRating.toFixed(1)}</p>
          <p className="text-xs text-gray-600">Positive-rated jobs: {positiveRatedJobs} | Negative-rated jobs: {negativeRatedJobs}</p>
        </div>

        <div
          className="relative flex min-h-[152px] flex-col justify-between rounded-[20px] border border-[#e2e8f0] p-6 bg-white"
          style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
        >
          <div className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E2F685]">
            <CalendarClock className="w-5 h-5 text-[#99b80d]" />
          </div>
          <p className="text-sm text-gray-600 mb-2">Average Job Duration</p>
          <p className="text-3xl font-bold text-[#051046] mb-1">{averageJobDurationLabel}</p>
          <p className="text-xs text-gray-600">{longestJobTypesText || 'No job duration data yet'}</p>
        </div>

        <div
          className="relative flex min-h-[152px] flex-col justify-between rounded-[20px] border border-[#e2e8f0] p-6 bg-white"
          style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
        >
          <div className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FFDBE6]">
            <CircleX className="w-5 h-5 text-[#f16a6a]" />
          </div>
          <p className="text-sm text-gray-600 mb-2">Job Cancellation Rate</p>
          <p className="text-3xl font-bold text-[#051046] mb-1">{cancellationRate.toFixed(1)}%</p>
          <p className="text-xs text-gray-600">Cancelled jobs: {cancelledJobs} | Lost Revenue: {formatCurrency(lostRevenue)}</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 mb-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        {/* Filters Grid */}
        <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-[180px] h-[44px] pl-10 pr-4 border border-[#e8e8e8] rounded-[15px] text-[#051046] text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Select range */}
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

        <div>
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value as JobPeriodFilter)}
            className="w-[180px] h-[44px] px-4 border border-[#9473ff] rounded-[15px] text-[#051046] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="all-time">All Time</option>
            <option value="today">Today</option>
            <option value="last-7-days">Last 7 Days</option>
            <option value="current-month">Current Month</option>
            <option value="last-month">Last Month</option>
            <option value="last-3-months">Last 3 Months</option>
            <option value="current-year">Current Year</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-[180px] h-[44px] px-4 border border-[#e8e8e8] rounded-[15px] text-[#051046] text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="date-desc">Date created (Newest first)</option>
            <option value="date-asc">Date created (Oldest first)</option>
            <option value="positive-rated">Positive Rated (4-5 stars)</option>
            <option value="negative-rated">Negative Rated (3 or below)</option>
            <option value="upsell-only">Upsell only</option>
          </select>
        </div>

        {/* Job Status Filter */}
        <div>
          <select
            value={jobStatusFilter}
            onChange={(e) => setJobStatusFilter(e.target.value)}
            className="w-[180px] h-[44px] px-4 border border-[#e8e8e8] rounded-[15px] text-[#051046] text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Job Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Deposit Collected">Deposit Collected</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Search by tags */}
        <div className="relative" ref={tagDropdownRef}>
          <button
            onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
            className="w-[180px] h-[44px] px-4 border border-[#e8e8e8] rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 hover:bg-gray-50 transition-colors text-left"
          >
            {selectedTags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded"
                  >
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag(tag);
                      }}
                    />
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-400">Search by tags</span>
            )}
          </button>

          {/* Tag Dropdown */}
          {isTagDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-[#e2e8f0] rounded-[20px] shadow-lg min-w-[200px]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
              <div className="p-3 border-b border-gray-100">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Available Tags</div>
              </div>
              <div className="max-h-60 overflow-y-auto p-2">
                {allTags.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-400">No tags available</div>
                ) : (
                  allTags.map(tag => (
                    <label
                      key={tag}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-[10px] cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                        className="rounded border-gray-300 text-[#8b5cf6] focus:ring-[#8b5cf6]"
                      />
                      <span className="text-sm text-[#051046]">{tag}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Add Job Button */}
        <div className="ml-auto">
          <button
            onClick={() => setIsAddJobModalOpen(true)}
            className="w-[160px] bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[32px] flex items-center justify-center gap-2 text-[16px] px-[24px] py-[10px] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add job
          </button>
        </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-[20px] border border-[#e2e8f0]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">JOB ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    TAGS
                    <div className="group relative inline-block">
                      <Info className="w-3 h-3 text-gray-400 cursor-help" />
                      <div className="invisible group-hover:visible fixed bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-[100] ml-8 -translate-y-1/2 normal-case">
                        Tags are created by users, not preset
                      </div>
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#6a7282] uppercase tracking-wider">
                  <div className="group relative inline-block">
                    E
                    <div className="invisible group-hover:visible fixed bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-[100] -translate-y-1/2 ml-8 normal-case">
                      # of estimates
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#6a7282] uppercase tracking-wider">
                  <div className="group relative inline-block">
                    I
                    <div className="invisible group-hover:visible fixed bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-[100] -translate-y-1/2 ml-8 normal-case">
                      # of invoices
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">CLIENT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">JOB TYPE</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">JOB STATUS</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">SCHEDULED</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">
                  <div className="inline-flex items-center gap-1 text-[#6a7282]">
                    DETAILS
                    <div className="group relative inline-block">
                      <Info className="w-3 h-3 text-gray-400 cursor-help" />
                      <div className="invisible group-hover:visible fixed bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-[100] ml-8 -translate-y-1/2 normal-case">
                        The details about this job
                      </div>
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">ADDRESS</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6a7282] uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedJobs.map((job) => (
                <tr
                  key={job.id}
                  onClick={() => handleEditJob(job)}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-1">
                      {job.servicePlanId && (
                        <div className="group relative inline-block">
                          <div className="w-5 h-5 bg-[#28bdf2] flex items-center justify-center rounded-sm">
                            <span className="text-white text-xs font-bold">S</span>
                          </div>
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                            Service Plan Job
                          </div>
                        </div>
                      )}
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEditJob(job);
                        }}
                        className="text-sm font-medium hover:underline"
                        style={{ color: '#9473ff' }}
                      >
                        {job.id}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {job.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                      {job.isNew && (
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">New</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-[#051046]">0</td>
                  <td className="px-4 py-3 text-center text-sm text-[#051046]">0</td>
                  <td className="px-4 py-3 text-sm text-[#051046]">{job.client}</td>
                  <td className="px-4 py-3 text-sm text-[#051046]">{job.jobType}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(job.jobStatus)}`}></div>
                      <span className="text-sm text-[#051046]">{job.jobStatus}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-1">
                      {job.arrivedLate && (
                        <div className="group relative inline-block">
                          <Truck className="w-4 h-4 text-red-500" />
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                            Technician arrived late
                          </div>
                        </div>
                      )}
                      <span className="text-sm text-[rgb(5,16,70)]">{job.duration}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#051046]">
                    <div className="flex flex-col">
                      {(() => {
                        // Split scheduled into date and time (format: "02/18/26 11:00 am")
                        const parts = job.scheduled.split(' ');
                        const date = formatScheduledDate(job.scheduled);
                        const time = parts.slice(1).join(' '); // "11:00 am"
                        return (
                          <>
                            <span>{date}</span>
                            <span>{time}</span>
                          </>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        {job.hasUpsell && (
                          <div className="group relative inline-block">
                            <div className="w-4 h-4 bg-[rgb(185,223,16)] flex items-center justify-center rounded-sm">
                              <span className="text-white text-[10px] font-bold leading-none">U</span>
                            </div>
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                              Upsell on the job
                            </div>
                          </div>
                        )}
                        {job.scheduledByStaff && (
                          <div className="group relative inline-block">
                            <HardHat className="w-4 h-4 text-[#BDBDBD]" />
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                              Job was scheduled by the staff/tech
                            </div>
                          </div>
                        )}
                        {typeof job.feedbackRating === 'number' && (
                          <div className="group relative inline-block">
                            <Star
                              className={`w-4 h-4 ${job.feedbackRating <= 3 ? 'fill-[#f16a6a] text-[#f16a6a]' : 'fill-[#f0a041] text-[#f0a041]'}`}
                            />
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                              Rated {job.feedbackRating} {job.feedbackRating === 1 ? 'star' : 'stars'}
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-[#051046]">{job.tech}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#051046] max-w-xs">
                    <div className="flex flex-col">
                      {(() => {
                        // Split address at the state abbreviation (e.g., TX, CA, NY)
                        const match = job.address.match(/(.*),\s*([A-Z]{2}\s+\d{5}.*)/);
                        if (match) {
                          return (
                            <>
                              <span>{match[1]}</span>
                              <span>{match[2]}</span>
                            </>
                          );
                        }
                        return <span>{job.address}</span>;
                      })()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEditJob(job);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit job"
                      >
                        <Edit2 className="w-4 h-4 text-[#8b5cf6]" />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteClick(job.id);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Delete job"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="border-t border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} entries
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

      {/* Job Details Modal */}
      {isJobDetailsModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-5xl border border-[#e2e8f0] overflow-hidden">
            <div className="max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-[#e2e8f0] px-6 py-4 z-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsJobDetailsModalOpen(false)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-[#051046]" />
                    </button>
                    <h2 className="text-xl font-semibold text-[#051046]">
                      Job {selectedJob.id} - {selectedJob.client}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsJobDetailsModalOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-[#051046]" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 text-sm">
                  <button
                    onClick={() => setActiveTab('Details')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'Details'
                        ? 'border-[#8b5cf6] text-[#8b5cf6] font-semibold'
                        : 'border-transparent text-gray-500 hover:text-[#051046]'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('Check List')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'Check List'
                        ? 'border-[#8b5cf6] text-[#8b5cf6] font-semibold'
                        : 'border-transparent text-gray-500 hover:text-[#051046]'
                    }`}
                  >
                    Check List
                  </button>
                  <button
                    onClick={() => setActiveTab('Estimate')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'Estimate'
                        ? 'border-[#8b5cf6] text-[#8b5cf6] font-semibold'
                        : 'border-transparent text-gray-500 hover:text-[#051046]'
                    }`}
                  >
                    Estimate (0)
                  </button>
                  <button
                    onClick={() => setActiveTab('Invoice')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'Invoice'
                        ? 'border-[#8b5cf6] text-[#8b5cf6] font-semibold'
                        : 'border-transparent text-gray-500 hover:text-[#051046]'
                    }`}
                  >
                    Invoice (0)
                  </button>
                </div>
              </div>

              {/* Content */}
              {activeTab === 'Details' && (
                <div className="p-6">
                  {/* Status and Action Button */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Status:</span>
                      <select
                        value={selectedJob.jobStatus}
                        onChange={() => {}}
                        className="px-3 py-1 border border-[#e8e8e8] rounded-[10px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Deposit Collected">Deposit Collected</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <button className="px-4 py-2 bg-[#9473ff] text-white rounded-[20px] text-sm hover:bg-[#7f5fd9] transition-colors">
                      On My Way
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              value={selectedJob.client}
                              readOnly
                              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[10px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Phone</label>
                            <input
                              type="text"
                              value={selectedJob.clientPhone}
                              readOnly
                              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[10px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Email</label>
                            <input
                              type="email"
                              value={selectedJob.clientEmail}
                              readOnly
                              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[10px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                              value={selectedJob.jobType}
                              onChange={() => {}}
                              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[10px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                            >
                              <option value="Service">Service</option>
                              <option value="plumbing">Plumbing</option>
                              <option value="HVAC">HVAC</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Job source</label>
                            <select
                              value={selectedJob.jobSource}
                              onChange={() => {}}
                              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[10px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                            >
                              <option value="Google">Google</option>
                              <option value="Phone">Phone</option>
                              <option value="Website">Website</option>
                              <option value="Referral">Referral</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Job description</label>
                            <textarea
                              value={selectedJob.jobDescription}
                              readOnly
                              rows={3}
                              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[10px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Team */}
                      <div>
                        <h3 className="text-sm font-semibold text-[#051046] mb-3">Team</h3>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Team Member</label>
                          <div className="flex items-center gap-2 px-3 py-2 border border-[#e8e8e8] rounded-[10px]">
                            <span className="px-2 py-0.5 bg-gray-200 text-[#051046] text-xs rounded flex items-center gap-1">
                              {selectedJob.tech}
                              <X className="w-3 h-3 cursor-pointer" />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Inventory */}
                      <div>
                        <h3 className="text-sm font-semibold text-[#051046] mb-3">Inventory</h3>
                        <div className="border border-[#e8e8e8] rounded-[10px] overflow-hidden">
                          <table className="w-full text-xs">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left font-semibold text-[#6a7282] uppercase tracking-wider">Description</th>
                                <th className="px-3 py-2 text-center font-semibold text-[#6a7282] uppercase tracking-wider">Upsell?</th>
                                <th className="px-3 py-2 text-center font-semibold text-[#6a7282] uppercase tracking-wider">QTY</th>
                                <th className="px-3 py-2 text-right font-semibold text-[#6a7282] uppercase tracking-wider">Price</th>
                                <th className="px-3 py-2 text-right font-semibold text-[#6a7282] uppercase tracking-wider">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-t border-gray-100">
                                <td className="px-3 py-2">
                                  <span className="inline-block text-[12px] font-medium text-[#6a7282]">
                                    NON-TAXABLE
                                  </span>
                                  <div className="text-[#051046] mt-1">Service call</div>
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <input type="checkbox" className="rounded" />
                                </td>
                                <td className="px-3 py-2 text-center text-[#051046]">1</td>
                                <td className="px-3 py-2 text-right text-[#051046]">$50.00</td>
                                <td className="px-3 py-2 text-right text-[#051046]">$50.00</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <button className="mt-2 text-sm text-[#8b5cf6] hover:underline">
                          + Create Inventory
                        </button>
                      </div>

                      {/* Tags */}
                      <div>
                        <h3 className="text-sm font-semibold text-[#051046] mb-3">Tags</h3>
                        <input
                          type="text"
                          placeholder="Choose some options..."
                          className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[10px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>

                      {/* Notification */}
                      <div>
                        <h3 className="text-sm font-semibold text-[#051046] mb-3">Notification</h3>
                        <label className="flex items-center gap-2 text-sm text-[#051046]">
                          <input type="checkbox" className="rounded" />
                          Don't send update email to customer
                        </label>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Scheduled */}
                      <div>
                        <h3 className="text-sm font-semibold text-[#051046] mb-3">Scheduled (Arrival window)</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Starts</label>
                            <div className="flex gap-2">
                              <input
                                type="date"
                                value={selectedJob.scheduledStart.split('T')[0]}
                                readOnly
                                className="flex-1 px-3 py-2 border border-[#e8e8e8] rounded-[10px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                              />
                              <input
                                type="time"
                                value={selectedJob.scheduledStart.split('T')[1]}
                                readOnly
                                className="w-32 px-3 py-2 border border-[#e8e8e8] rounded-[10px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Ends</label>
                            <div className="flex gap-2">
                              <input
                                type="date"
                                value={selectedJob.scheduledEnd.split('T')[0]}
                                readOnly
                                className="flex-1 px-3 py-2 border border-[#e8e8e8] rounded-[10px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                              />
                              <input
                                type="time"
                                value={selectedJob.scheduledEnd.split('T')[1]}
                                readOnly
                                className="w-32 px-3 py-2 border border-[#e8e8e8] rounded-[10px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                              />
                            </div>
                          </div>
                          <label className="flex items-center gap-2 text-sm text-[#051046]">
                            <input 
                              type="checkbox" 
                              checked={selectedJob.isAllDay}
                              readOnly
                              className="rounded" 
                            />
                            All-day event
                          </label>
                        </div>
                      </div>

                      {/* Service Location */}
                      <div>
                        <h3 className="text-sm font-semibold text-[#051046] mb-3">Service Location</h3>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Address</label>
                          <textarea
                            value={selectedJob.address}
                            readOnly
                            rows={2}
                            className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[10px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                          />
                        </div>
                      </div>

                      {/* Service Details */}
                      <div>
                        <h3 className="text-sm font-semibold text-[#051046] mb-3">Service Details</h3>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Tech Notes</label>
                          <textarea
                            placeholder="Add your notes here. (Not Visible to Customers)"
                            value={selectedJob.techNotes}
                            readOnly
                            rows={3}
                            className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[10px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                          />
                        </div>
                      </div>

                      {/* Photos */}
                      <div>
                        <h3 className="text-sm font-semibold text-[#051046] mb-3">Photos</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Before (Max 5 photos)</label>
                            <div className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-[10px] cursor-pointer hover:border-[#8b5cf6] transition-colors">
                              <Plus className="w-6 h-6 text-gray-400" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">After (Max 5 photos)</label>
                            <div className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-[10px] cursor-pointer hover:border-[#8b5cf6] transition-colors">
                              <Plus className="w-6 h-6 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#e2e8f0]">
                    <button
                      onClick={() => setIsJobDetailsModalOpen(false)}
                      className="px-6 py-2 border border-[#e8e8e8] text-[#051046] rounded-[20px] hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        alert('Job updated successfully!');
                        setIsJobDetailsModalOpen(false);
                      }}
                      className="px-8 py-2 bg-[#9473ff] text-white rounded-[20px] hover:bg-[#7f5fd9] transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'Check List' && (
                <div className="p-6">
                  <p className="text-gray-500">Check List content coming soon...</p>
                </div>
              )}

              {activeTab === 'Estimate' && (
                <div className="p-6">
                  <p className="text-gray-500">No estimates available</p>
                </div>
              )}

              {activeTab === 'Invoice' && (
                <div className="p-6">
                  <p className="text-gray-500">No invoices available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Job Modal */}
      <NewJobModal
        isOpen={isAddJobModalOpen}
        onClose={() => setIsAddJobModalOpen(false)}
        onSubmit={handleNewJobSubmit}
        onAddClientClick={() => setIsAddClientModalOpen(true)}
        onCustomValueModalOpen={setCustomValueModal}
        jobTypes={jobTypes}
        jobSources={jobSources}
      />

      {/* Add Custom Value Modal */}
      {customValueModal.isOpen && (
        <AddCustomValueModal
          isOpen={customValueModal.isOpen}
          title={customValueModal.title}
          placeholder={
            customValueModal.type === 'jobType' ? 'Enter job type name...' :
            customValueModal.type === 'jobSource' ? 'Enter job source name...' :
            'Enter tag name...'
          }
          onClose={() => setCustomValueModal({ isOpen: false, type: null, title: '' })}
          onSave={(value) => {
            if (customValueModal.type === 'jobType') {
              setJobTypes([...jobTypes, value]);
            } else if (customValueModal.type === 'jobSource') {
              setJobSources([...jobSources, value]);
            } else if (customValueModal.type === 'tags') {
              // Add to availableTags if you want it to be available system-wide
              // Or just add to current job tags
              setJobTags([...jobTags, value]);
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-md border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <h3 className="text-lg font-semibold text-[#051046] mb-3">Delete Job</h3>
            <p className="text-[#051046] mb-6">Are you sure you want to delete this job? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2 border border-[#e8e8e8] text-[#051046] rounded-[15px] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-[15px] hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onSave={handleSaveClient}
      />
    </div>
  );
}
