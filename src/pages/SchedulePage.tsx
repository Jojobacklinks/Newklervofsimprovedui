import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, Search, Trash2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AddClientModal } from '../components/AddClientModal';
import { AddCustomValueModal } from '../components/AddCustomValueModal';
import { AddPartOrServiceModal } from '../components/AddPartOrServiceModal';
import { EditTaskModal } from '../components/EditTaskModal';
import { EditAppointmentModal } from '../components/EditAppointmentModal';
import { DraggableEvent } from '../components/DraggableEvent';
import { DroppableCalendarCell } from '../components/DroppableCalendarCell';
import { useJobs } from '../contexts/JobsContext';
import technicianImage from 'figma:asset/cbddeef0da9c22ff2803da61ea33cfc86cdc2274.png';
import technicianImage2 from 'figma:asset/050db89ac7a52d74f82346621f599d4978faea46.png';

// Available tags for jobs
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
  { id: 'C-101', name: 'John Smith', email: 'john.smith@email.com', phone: '(555) 123-4567', address: '123 Main Street, Springfield, IL 62701' },
  { id: 'C-102', name: 'John Smith', email: 'johnsmith99@gmail.com', phone: '(555) 987-6543', address: '456 Oak Avenue, Chicago, IL 60614' },
  { id: 'C-103', name: 'Sarah Johnson', email: 'sarah.j@company.com', phone: '(555) 234-5678', address: '789 Pine Road, Naperville, IL 60540' },
  { id: 'C-104', name: 'Michael Chen', email: 'mchen@business.com', phone: '(555) 345-6789', address: '321 Elm Street, Aurora, IL 60506' },
  { id: 'C-105', name: 'Emily Davis', email: 'emily.davis@home.net', phone: '(555) 456-7890', address: '654 Maple Drive, Joliet, IL 60431' },
  { id: 'C-106', name: 'Robert Williams', email: 'rwilliams@email.com', phone: '(555) 567-8901', address: '987 Cedar Lane, Rockford, IL 61101' },
  { id: 'C-107', name: 'Jennifer Martinez', email: 'jmartinez@company.org', phone: '(555) 678-9012', address: '147 Birch Court, Peoria, IL 61602' },
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

type ViewMode = 'month' | 'week' | 'day';
type PopupType = null | 'main' | 'newJob' | 'newTask' | 'newAppointment';
type EventType = 'job' | 'task' | 'appointment';

interface CalendarEvent {
  id: string;
  type: EventType;
  title: string;
  date: number;
  time?: string;
  city?: string;
  clientName?: string;
  teamMember?: string;
  address?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
}

export function SchedulePage() {
  const navigate = useNavigate();
  const { addJob, jobs, updateJob } = useJobs();
  const [selectedView, setSelectedView] = useState<ViewMode>('month');
  const [popupType, setPopupType] = useState<PopupType>(null);
  const [showAttendeeDropdown, setShowAttendeeDropdown] = useState(false);
  const [attendeeValue, setAttendeeValue] = useState('');
  const [activeFilter, setActiveFilter] = useState<EventType | 'all'>('all');
  
  // Week and Day view navigation
  const [currentWeekStart, setCurrentWeekStart] = useState(8); // Feb 8, 2026 (Sunday)
  const [currentDay, setCurrentDay] = useState(15); // Feb 15, 2026
  
  // Month navigation
  const [currentMonth, setCurrentMonth] = useState(1); // February 2026 (0-indexed: 0=Jan, 1=Feb, etc.)
  const [currentYear, setCurrentYear] = useState(2026);
  
  // Add Job Modal state
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);

  // Developer Notes popup state
  const [showDevNotesPopup, setShowDevNotesPopup] = useState(false);

  // Notification sent popup state
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // Client autocomplete state
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<typeof mockClientDatabase[0] | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [filteredClients, setFilteredClients] = useState<typeof mockClientDatabase>([]);
  const clientInputRef = useRef<HTMLDivElement>(null);

  // Add Client Modal state
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  // Job form state
  const [jobTags, setJobTags] = useState<string[]>([]);
  const [isJobTagDropdownOpen, setIsJobTagDropdownOpen] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [isTeamMemberDropdownOpen, setIsTeamMemberDropdownOpen] = useState(false);

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

  // Inventory dropdown state
  const [showInventoryDropdown, setShowInventoryDropdown] = useState(false);
  const [inventorySearch, setInventorySearch] = useState('');
  const [isAddInventoryModalOpen, setIsAddInventoryModalOpen] = useState(false);
  
  // Selected inventory items for the job
  const [selectedInventoryItems, setSelectedInventoryItems] = useState<Array<{
    id: number;
    description: string;
    type: 'service' | 'part';
    taxable: boolean;
    isUpsell: boolean;
    quantity: number;
    price: number;
  }>>([]);

  // Job form fields
  const [jobType, setJobType] = useState('');
  const [jobSource, setJobSource] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [addressInput, setAddressInput] = useState('');

  // Filter inventory based on search
  const filteredInventory = inventoryDatabase.filter(item =>
    item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    item.type.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  // Helper: parse an ISO-like datetime string WITHOUT applying UTC offset
  // e.g. "2026-02-15T09:00" → { day: 15, timeStr: "9:00am" }
  const parseDateTimeLocal = (dtStr: string) => {
    if (!dtStr) return { day: 0, timeStr: '12:00am' };
    
    // Split on 'T' to get date and time parts
    const [datePart, timePart] = dtStr.split('T');
    const datePieces = datePart ? datePart.split('-') : [];
    const day = datePieces[2] ? parseInt(datePieces[2], 10) : 0;
    
    let timeStr = '12:00am';
    if (timePart) {
      const [hourStr, minStr] = timePart.split(':');
      const hours = parseInt(hourStr, 10);
      const minutes = minStr ? minStr.substring(0, 2) : '00';
      const period = hours >= 12 ? 'pm' : 'am';
      const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      timeStr = `${displayHour}:${minutes}${period}`;
    }
    
    return { day, timeStr };
  };

  // Memoize events to prevent unnecessary re-renders
  const events = useMemo(() => {
    const staticEvents = [
      { id: '2', type: 'appointment' as const, title: 'Client Meeting', date: 5, time: '10:30am' },
      { id: '3', type: 'task' as const, title: 'Follow up call', date: 7, time: '2:00pm' },
    ];
    
    // Convert all jobs to calendar events
    const jobEvents = jobs.map(job => {
      const { day, timeStr: startTimeStr } = parseDateTimeLocal(job.scheduledStart);
      const { timeStr: endTimeStr } = parseDateTimeLocal(job.scheduledEnd);
      
      // Extract city from address or use default
      const addressParts = job.address.split(',');
      const city = addressParts.length >= 2 
        ? `${addressParts[addressParts.length - 2].trim()}, ${addressParts[addressParts.length - 1].trim()}` 
        : job.address || 'N/A';
      
      return {
        id: job.id,
        type: 'job' as const,
        title: job.jobType,
        date: day,
        time: startTimeStr,
        city: city,
        clientName: job.client,
        teamMember: job.tech,
        address: job.address,
        startTime: startTimeStr,
        endTime: endTimeStr,
        status: job.jobStatus
      };
    });
    
    return [...staticEvents, ...jobEvents];
  }, [jobs]);

  // Hover card state for jobs
  const [hoveredJob, setHoveredJob] = useState<CalendarEvent | null>(null);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [leaveTimer, setLeaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [isHoverMode, setIsHoverMode] = useState(false); // Track if opened by hover vs click/touch

  // Task and Appointment detail modal state
  const [editTaskModal, setEditTaskModal] = useState<{
    isOpen: boolean;
    task: { id: number; title: string; dueDate: string } | null;
  }>({
    isOpen: false,
    task: null
  });

  const [editAppointmentModal, setEditAppointmentModal] = useState<{
    isOpen: boolean;
    appointment: { id: number; title: string; subject: string; date: string } | null;
  }>({
    isOpen: false,
    appointment: null
  });

  // Generate calendar days for February 2026
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Time slots for week/day view (24 hours)
  const timeSlots = [
    '12:00am', '1:00am', '2:00am', '3:00am', '4:00am', '5:00am',
    '6:00am', '7:00am', '8:00am', '9:00am', '10:00am', '11:00am',
    '12:00pm', '1:00pm', '2:00pm', '3:00pm', '4:00pm', '5:00pm',
    '6:00pm', '7:00pm', '8:00pm', '9:00pm', '10:00pm', '11:00pm'
  ];
  
  // Helper to get week days from start date
  const getWeekDays = (startDate: number) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(startDate + i);
    }
    return days;
  };
  
  // Helper to parse time and convert to hour (0-23)
  const parseTimeToHour = (time: string) => {
    if (!time) return null;
    const match = time.match(/(\d+):(\d+)(am|pm)/i);
    if (!match) return null;
    let hour = parseInt(match[1]);
    const period = match[3].toLowerCase();
    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    return hour;
  };

  // Helper to convert hour to time string
  const hourToTimeString = (hour: number): string => {
    const period = hour >= 12 ? 'pm' : 'am';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00${period}`;
  };
  
  // Handle dropping an event on a new date/time
  const handleEventDrop = (event: CalendarEvent, newDate: number, newHour?: number | null) => {
    // Only update jobs, not tasks or appointments (those are static for now)
    if (event.type === 'job') {
      // Update the job's scheduled date and time
      const job = jobs.find(j => j.id === event.id);
      if (job) {
        // Parse the existing scheduled start and end
        const [datePart] = job.scheduledStart.split('T');
        const [, timePart] = job.scheduledStart.split('T');
        const [, endTimePart] = job.scheduledEnd.split('T');
        
        // Create new date string (February 2026)
        const newDateStr = `2026-02-${String(newDate).padStart(2, '0')}`;
        
        // If hour is provided (week/day view), update the time
        let newStartTime = timePart;
        let newEndTime = endTimePart;
        
        if (newHour !== null && newHour !== undefined) {
          newStartTime = `${String(newHour).padStart(2, '0')}:00`;
          // Keep the same duration
          const oldStartHour = parseInt(timePart?.split(':')[0] || '9');
          const oldEndHour = parseInt(endTimePart?.split(':')[0] || '17');
          const duration = oldEndHour - oldStartHour;
          const newEndHour = newHour + duration;
          newEndTime = `${String(newEndHour).padStart(2, '0')}:00`;
        }
        
        updateJob(event.id, {
          scheduledStart: `${newDateStr}T${newStartTime}`,
          scheduledEnd: `${newDateStr}T${newEndTime}`,
        });
      }
    }
  };
  
  // Inventory item handlers
  const handleAddInventoryItem = (item: typeof inventoryDatabase[0]) => {
    // Check if item already exists
    const exists = selectedInventoryItems.find(i => i.id === item.id);
    if (exists) {
      alert('This item is already added');
      return;
    }
    
    setSelectedInventoryItems([...selectedInventoryItems, {
      id: item.id,
      description: item.name,
      type: item.type,
      taxable: item.taxable,
      isUpsell: false,
      quantity: 1,
      price: item.price
    }]);
    setShowInventoryDropdown(false);
    setInventorySearch('');
  };

  const handleUpsellToggle = (id: number) => {
    setSelectedInventoryItems(selectedInventoryItems.map(item =>
      item.id === id ? { ...item, isUpsell: !item.isUpsell } : item
    ));
  };

  const handleQuantityChange = (id: number, value: string) => {
    const quantity = parseInt(value) || 1;
    setSelectedInventoryItems(selectedInventoryItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const handlePriceChange = (id: number, value: string) => {
    const price = parseFloat(value);
    setSelectedInventoryItems(selectedInventoryItems.map(item =>
      item.id === id ? { ...item, price: isNaN(price) ? 0 : price } : item
    ));
  };

  const handleRemoveInventoryItem = (id: number) => {
    setSelectedInventoryItems(selectedInventoryItems.filter(item => item.id !== id));
  };

  // Add custom inventory item handler
  const handleAddCustomInventoryItem = (itemData: {
    name: string;
    type: 'service' | 'part';
    quantity: number;
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
    const newItem = {
      id: Date.now(),
      description: itemData.name,
      type: itemData.type,
      taxable: itemData.taxable === 'taxable',
      isUpsell: false,
      quantity: 1,
      price: parseFloat(itemData.price) || 0,
    };
    setSelectedInventoryItems([...selectedInventoryItems, newItem]);
  };
  
  // Helper to get events for a specific date and time slot
  const getEventsForDateTime = (date: number, hour: number) => {
    const dateEvents = events.filter(event => event.date === date);
    const filteredEvents = activeFilter === 'all' 
      ? dateEvents 
      : dateEvents.filter(event => event.type === activeFilter);
    
    return filteredEvents.filter(event => {
      const eventHour = parseTimeToHour(event.startTime || event.time || '');
      return eventHour === hour;
    });
  };
  
  // Helper to navigate week
  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStart(prev => direction === 'prev' ? prev - 7 : prev + 7);
  };
  
  // Helper to navigate day
  const navigateDay = (direction: 'prev' | 'next') => {
    setCurrentDay(prev => direction === 'prev' ? prev - 1 : prev + 1);
  };
  
  // Helper to navigate month
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(prev => prev - 1);
      } else {
        setCurrentMonth(prev => prev - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(prev => prev + 1);
      } else {
        setCurrentMonth(prev => prev + 1);
      }
    }
  };
  
  // Helper to go back to today
  const goToToday = () => {
    // Today is April 4, 2026 (Saturday)
    if (selectedView === 'month') {
      setCurrentMonth(3); // April (0-indexed)
      setCurrentYear(2026);
    } else if (selectedView === 'week') {
      setCurrentWeekStart(29); // Week starting March 29, 2026 (Sunday) that contains April 4
    } else if (selectedView === 'day') {
      setCurrentDay(4); // April 4
      setCurrentMonth(3); // April
      setCurrentYear(2026);
    }
  };
  
  // Helper to get month name
  const getMonthName = (monthIndex: number) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
  };
  
  // Helper to get display title based on view
  const getDisplayTitle = () => {
    if (selectedView === 'month') return `${getMonthName(currentMonth)} ${currentYear}`;
    if (selectedView === 'week') {
      const weekEnd = currentWeekStart + 6;
      return `${getMonthName(currentMonth).substring(0, 3)} ${currentWeekStart}-${weekEnd}, ${currentYear}`;
    }
    return `${getMonthName(currentMonth)} ${currentDay}, ${currentYear}`;
  };
  
  // Helper to handle navigation
  const handleNavigation = (direction: 'prev' | 'next') => {
    if (selectedView === 'month') navigateMonth(direction);
    else if (selectedView === 'week') navigateWeek(direction);
    else if (selectedView === 'day') navigateDay(direction);
  };
  
  // Generate calendar days dynamically based on current month and year
  const generateCalendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday
    const daysInMonth = lastDay.getDate();
    
    const weeks: number[][] = [];
    let currentWeek: number[] = [];
    
    // Fill in days from previous month
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      currentWeek.push(prevMonthLastDay - i);
    }
    
    // Fill in days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Fill in days from next month to complete the grid (6 weeks)
    let nextMonthDay = 1;
    while (weeks.length < 6) {
      while (currentWeek.length < 7) {
        currentWeek.push(nextMonthDay++);
      }
      weeks.push(currentWeek);
      currentWeek = [];
    }
    
    return weeks;
  }, [currentMonth, currentYear]);
  
  const calendarDays = generateCalendarDays;

  const handleDateClick = () => {
    setPopupType('main');
  };

  const handleNewJobClick = () => {
    setPopupType(null);
    setIsAddJobModalOpen(true);
  };

  const handleNewTaskClick = () => {
    setPopupType('newTask');
  };

  const handleNewAppointmentClick = () => {
    setPopupType('newAppointment');
  };

  const getEventColor = (type: EventType) => {
    switch (type) {
      case 'job':
        return 'bg-[rgb(6,152,198)]'; // Cyan
      case 'appointment':
        return 'bg-[rgb(185,223,16)]'; // Yellow
      case 'task':
        return 'bg-[rgb(240,160,65)]'; // Orange
      default:
        return 'bg-gray-400';
    }
  };

  const getEventsForDate = (date: number) => {
    const dateEvents = events.filter(event => event.date === date);
    if (activeFilter === 'all') {
      return dateEvents;
    }
    return dateEvents.filter(event => event.type === activeFilter);
  };

  const handleFilterClick = (filterType: EventType) => {
    if (activeFilter === filterType) {
      setActiveFilter('all');
    } else {
      setActiveFilter(filterType);
    }
  };

  const formatEventDisplay = (event: CalendarEvent) => {
    if (event.type === 'job' && event.time && event.city) {
      return `${event.time} - ${event.title} - ${event.city}`;
    }
    if (event.type === 'appointment' && event.time) {
      return `${event.time} - ${event.title}`;
    }
    if (event.type === 'task' && event.time) {
      return `${event.time} - ${event.title}`;
    }
    return event.title;
  };

  // Task modal handlers
  const handleEditTaskClick = (event: CalendarEvent) => {
    setEditTaskModal({
      isOpen: true,
      task: {
        id: parseInt(event.id),
        title: event.title,
        dueDate: event.time || ''
      }
    });
  };

  const handleEditTaskConfirm = (updatedTask: { id: number; title: string; dueDate: string }) => {
    // Update the task in the events list
    setEvents(events.map(event => {
      if (event.id === updatedTask.id.toString() && event.type === 'task') {
        return {
          ...event,
          title: updatedTask.title,
          time: updatedTask.dueDate
        };
      }
      return event;
    }));
    setEditTaskModal({
      isOpen: false,
      task: null
    });
  };

  const handleEditTaskCancel = () => {
    setEditTaskModal({
      isOpen: false,
      task: null
    });
  };

  // Appointment modal handlers
  const handleEditAppointmentClick = (event: CalendarEvent) => {
    setEditAppointmentModal({
      isOpen: true,
      appointment: {
        id: parseInt(event.id),
        title: event.title,
        subject: event.title, // Using title as subject for now
        date: event.time || ''
      }
    });
  };

  const handleEditAppointmentConfirm = (updatedAppointment: { id: number; title: string; subject: string; date: string }) => {
    // Update the appointment in the events list
    setEvents(events.map(event => {
      if (event.id === updatedAppointment.id.toString() && event.type === 'appointment') {
        return {
          ...event,
          title: updatedAppointment.title,
          time: updatedAppointment.date
        };
      }
      return event;
    }));
    setEditAppointmentModal({
      isOpen: false,
      appointment: null
    });
  };

  const handleEditAppointmentCancel = () => {
    setEditAppointmentModal({
      isOpen: false,
      appointment: null
    });
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

  const handleAddClientClick = () => {
    setIsAddClientModalOpen(true);
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
    setAddressInput(client.address || ''); // Auto-populate address
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

  // Auto-hide notification popup after 4 seconds
  useEffect(() => {
    if (showNotificationPopup) {
      const timer = setTimeout(() => {
        setShowNotificationPopup(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showNotificationPopup]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 md:p-8">
        {/* Filter Tabs */}
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 flex-wrap">
        <span className="text-xs md:text-sm text-gray-700 w-full sm:w-auto mb-2 sm:mb-0">Designation:</span>
        <button 
          onClick={() => handleFilterClick('job')}
          className={`px-3 md:px-4 py-1.5 bg-[rgb(6,152,198)] text-white text-xs md:text-sm rounded-[10px] transition-all ${
            activeFilter === 'job' ? 'ring-2 ring-offset-2 ring-[rgb(6,152,198)]' : 'opacity-60 hover:opacity-100'
          }`}
        >
          Jobs
        </button>
        <button 
          onClick={() => handleFilterClick('appointment')}
          className={`px-3 md:px-4 py-1.5 bg-[rgb(185,223,16)] text-gray-900 text-xs md:text-sm rounded-[10px] transition-all ${
            activeFilter === 'appointment' ? 'ring-2 ring-offset-2 ring-[rgb(185,223,16)]' : 'opacity-60 hover:opacity-100'
          }`}
        >
          Appointments
        </button>
        <button 
          onClick={() => handleFilterClick('task')}
          className={`px-3 md:px-4 py-1.5 bg-[rgb(240,160,65)] text-white text-xs md:text-sm rounded-[10px] transition-all ${
            activeFilter === 'task' ? 'ring-2 ring-offset-2 ring-[rgb(240,160,65)]' : 'opacity-60 hover:opacity-100'
          }`}
        >
          Tasks
        </button>
        {activeFilter !== 'all' && (
          <button 
            onClick={() => setActiveFilter('all')}
            className="px-3 md:px-4 py-1.5 bg-gray-200 text-gray-700 text-xs md:text-sm rounded-[10px] hover:bg-gray-300 transition-all flex items-center gap-1.5"
          >
            <X className="w-3 md:w-3.5 h-3 md:h-3.5" />
            Show All
          </button>
        )}
      </div>

      {/* Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-4">
        <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
          <button 
            onClick={goToToday}
            className="text-xs md:text-sm text-gray-700 hover:text-[#9473ff] hover:underline cursor-pointer transition-colors"
          >
            today
          </button>
          <div className="flex items-center gap-2">
            <button 
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => handleNavigation('prev')}
            >
              <ChevronLeft className="w-4 md:w-5 h-4 md:h-5 text-gray-600" />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => handleNavigation('next')}
            >
              <ChevronRight className="w-4 md:w-5 h-4 md:h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <h3 className="text-base md:text-lg font-medium text-gray-900 w-full sm:w-auto text-center">{getDisplayTitle()}</h3>

        <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex bg-white border border-gray-300 rounded overflow-hidden">
            <button
              onClick={() => setSelectedView('month')}
              className={`px-2 md:px-4 py-1.5 text-xs md:text-sm ${
                selectedView === 'month'
                  ? 'bg-[#9473ff] text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              month
            </button>
            <button
              onClick={() => setSelectedView('week')}
              className={`px-2 md:px-4 py-1.5 text-xs md:text-sm border-l border-gray-300 ${
                selectedView === 'week'
                  ? 'bg-[#9473ff] text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              week
            </button>
            <button
              onClick={() => setSelectedView('day')}
              className={`px-2 md:px-4 py-1.5 text-xs md:text-sm border-l border-gray-300 ${
                selectedView === 'day'
                  ? 'bg-[#9473ff] text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              day
            </button>
          </div>
          <button className="w-[160px] bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[32px] flex items-center justify-center gap-2 whitespace-nowrap text-[16px] px-[24px] py-[10px]" onClick={() => setPopupType('main')}>
            + Add new
          </button>
        </div>
      </div>

      {/* Calendar Grid - Month View */}
      {selectedView === 'month' && (
        <div className="bg-white rounded-[20px] border border-[#e2e8f0] overflow-hidden overflow-x-auto" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-gray-200 min-w-[640px]">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="p-2 md:p-4 text-center text-xs md:text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 min-w-[640px]">
          {calendarDays.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              // Determine if day is from previous or next month
              const isOtherMonth = (weekIndex === 0 && day > 7) || (weekIndex >= 4 && day < 15);
              const dayEvents = !isOtherMonth ? getEventsForDate(day) : [];
              
              // Check if this is today (April 4, 2026)
              const isToday = currentMonth === 3 && currentYear === 2026 && day === 4 && !isOtherMonth;
              
              return (
                <DroppableCalendarCell
                  key={`${weekIndex}-${dayIndex}`}
                  date={day}
                  onDrop={handleEventDrop}
                  onClick={handleDateClick}
                  className={`h-20 md:h-24 border-r border-b border-gray-200 last:border-r-0 p-1 md:p-2 hover:bg-gray-50 cursor-pointer relative flex flex-col ${
                    isToday ? 'bg-[#F5F5F5]' : ''
                  }`}
                >
                  <span
                    className={`text-xs md:text-sm mb-1 ${
                      isOtherMonth ? 'text-gray-400' : 'text-gray-700'
                    }`}
                  >
                    {day}
                  </span>
                  
                  {/* Event indicators */}
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map((event) => (
                      <DraggableEvent
                        key={event.id}
                        event={event}
                        className={`${getEventColor(event.type)} text-white text-[10px] md:text-xs px-1 md:px-1.5 py-0.5 rounded truncate relative`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (event.type === 'job') {
                            // Navigate to job details page
                            navigate(`/admin/jobs/details/${event.id}`);
                          } else if (event.type === 'task') {
                            // Open task edit modal
                            handleEditTaskClick(event);
                          } else if (event.type === 'appointment') {
                            // Open appointment edit modal
                            handleEditAppointmentClick(event);
                          }
                        }}
                      >
                        <div
                          onMouseEnter={(e) => {
                            if (event.type === 'job') {
                              // Clear any existing leave timer
                              if (leaveTimer) {
                                clearTimeout(leaveTimer);
                                setLeaveTimer(null);
                              }
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoverPosition({ x: rect.left + rect.width / 2, y: rect.top });
                              setHoveredJob(event);
                              setIsHoverMode(true); // Hover mode - no backdrop
                            }
                          }}
                          onMouseLeave={() => {
                            if (event.type === 'job') {
                              // Small delay to allow smooth transition to card
                              const timer = setTimeout(() => {
                                setHoveredJob(null);
                                setIsHoverMode(false);
                                setHoverPosition(null);
                              }, 150);
                              setLeaveTimer(timer);
                            }
                          }}
                          onTouchStart={(e) => {
                            if (event.type === 'job') {
                              e.stopPropagation();
                              const timer = setTimeout(() => {
                                setHoveredJob(event);
                                setIsHoverMode(false); // Touch mode - show backdrop
                              }, 500); // 500ms press and hold
                              setPressTimer(timer);
                            }
                          }}
                          onTouchEnd={(e) => {
                            if (event.type === 'job') {
                              e.stopPropagation();
                              if (pressTimer) {
                                clearTimeout(pressTimer);
                                setPressTimer(null);
                              }
                            }
                          }}
                          onTouchCancel={() => {
                            if (event.type === 'job' && pressTimer) {
                              clearTimeout(pressTimer);
                              setPressTimer(null);
                            }
                          }}
                        >
                          {formatEventDisplay(event)}
                        </div>
                      </DraggableEvent>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] md:text-xs text-gray-500 px-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </DroppableCalendarCell>
              );
            })
          )}
        </div>
      </div>
      )}

      {/* Calendar Grid - Week View */}
      {selectedView === 'week' && (
        <div className="bg-white rounded-[20px] border border-[#e2e8f0] overflow-hidden overflow-x-auto" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="grid grid-cols-8 min-w-[900px]">
            {/* Time column header */}
            <div className="border-r border-b border-gray-200 p-2 md:p-4 bg-gray-50">
              <span className="text-xs md:text-sm font-medium text-gray-700">Time</span>
            </div>
            
            {/* Day headers */}
            {getWeekDays(currentWeekStart).map((day, index) => (
              <div key={day} className="border-r border-b border-gray-200 last:border-r-0 p-2 md:p-4 text-center bg-gray-50">
                <div className="text-xs md:text-sm font-medium text-gray-700">{daysOfWeek[index]}</div>
                <div className="text-xs text-gray-500">Feb {day}</div>
              </div>
            ))}
            
            {/* Time slots with events */}
            {timeSlots.map((time, hourIndex) => (
              <div key={`week-time-${hourIndex}`} style={{ display: 'contents' }}>
                {/* Time label */}
                <div className="border-r border-b border-gray-200 p-2 md:p-3 bg-gray-50 text-xs text-gray-600">
                  {time}
                </div>
                
                {/* Day cells */}
                {getWeekDays(currentWeekStart).map((day) => {
                  const eventsInSlot = getEventsForDateTime(day, hourIndex);
                  return (
                    <DroppableCalendarCell
                      key={`${day}-${hourIndex}`}
                      date={day}
                      hour={hourIndex}
                      onDrop={handleEventDrop}
                      onClick={handleDateClick}
                      className="border-r border-b border-gray-200 last:border-r-0 p-1 md:p-2 min-h-[60px] hover:bg-gray-50 cursor-pointer"
                    >
                      {eventsInSlot.map((event) => (
                        <DraggableEvent
                          key={event.id}
                          event={event}
                          className={`${getEventColor(event.type)} text-white text-[10px] md:text-xs px-1.5 py-1 rounded mb-1 truncate hover:opacity-90`}
                          onClick={(e) => {
                            if (event.type === 'job') {
                              e.stopPropagation();
                              navigate(`/admin/jobs/details/${event.id}`);
                            }
                          }}
                        >
                          <div title={`${event.title}${event.city ? ' - ' + event.city : ''}`}>
                            {event.title}
                          </div>
                        </DraggableEvent>
                      ))}
                    </DroppableCalendarCell>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Grid - Day View */}
      {selectedView === 'day' && (
        <div className="bg-white rounded-[20px] border border-[#e2e8f0] overflow-hidden" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="grid grid-cols-2">
            {/* Time column header */}
            <div className="border-r border-b border-gray-200 p-4 bg-gray-50">
              <span className="text-sm font-medium text-gray-700">Time</span>
            </div>
            
            {/* Day header */}
            <div className="border-b border-gray-200 p-4 text-center bg-gray-50">
              <div className="text-sm font-medium text-gray-700">
                {daysOfWeek[new Date(2026, 1, currentDay).getDay()]}
              </div>
              <div className="text-xs text-gray-500">February {currentDay}, 2026</div>
            </div>
            
            {/* Time slots with events */}
            {timeSlots.map((time, hourIndex) => (
              <div key={`day-time-${hourIndex}`} style={{ display: 'contents' }}>
                {/* Time label */}
                <div className="border-r border-b border-gray-200 p-3 bg-gray-50 text-sm text-gray-600">
                  {time}
                </div>
                
                {/* Event cell */}
                <DroppableCalendarCell
                  date={currentDay}
                  hour={hourIndex}
                  onDrop={handleEventDrop}
                  onClick={handleDateClick}
                  className="border-b border-gray-200 p-2 min-h-[70px] hover:bg-gray-50 cursor-pointer"
                >
                  {getEventsForDateTime(currentDay, hourIndex).map((event) => (
                    <DraggableEvent
                      key={event.id}
                      event={event}
                      className={`${getEventColor(event.type)} text-white text-sm px-3 py-2 rounded mb-2 hover:opacity-90`}
                      onClick={(e) => {
                        if (event.type === 'job') {
                          e.stopPropagation();
                          navigate(`/admin/jobs/details/${event.id}`);
                        }
                      }}
                    >
                      <div title={event.title}>
                        <div className="font-medium">{event.title}</div>
                        {event.city && <div className="text-xs mt-1">{event.city}</div>}
                        {event.clientName && <div className="text-xs">Client: {event.clientName}</div>}
                      </div>
                    </DraggableEvent>
                  ))}
                </DroppableCalendarCell>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {popupType === 'main' && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="bg-white rounded-[20px] w-full max-w-md p-6 md:p-8 relative mx-4" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <button
              onClick={() => setPopupType(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">
              What do you want to add?
            </h2>

            <div className="space-y-3 md:space-y-4">
              <button 
                onClick={handleNewJobClick}
                className="w-full text-left px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm md:text-base text-gray-900">Add new Job</span>
              </button>
              <button 
                onClick={handleNewTaskClick}
                className="w-full text-left px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm md:text-base text-gray-900">Add new Task</span>
              </button>
              <button 
                onClick={handleNewAppointmentClick}
                className="w-full text-left px-4 md:px-6 py-3 md:py-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm md:text-base text-gray-900">Add new Appointment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Task Form Modal */}
      {popupType === 'newTask' && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="bg-white rounded-[20px] w-full max-w-lg p-6 relative mx-4" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <button
              onClick={() => setPopupType(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Add new task</h2>

            <div className="space-y-4">
              <textarea
                placeholder="Your note goes here..."
                rows={6}
                className="w-full px-4 py-3 border border-[#e8e8e8] rounded-[15px] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400"
              />

              <div>
                <label className="text-sm text-gray-900 mb-2 block">Due date:</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Sat Feb 7, 2026"
                    defaultValue="Sat Feb 7, 2026"
                    className="px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="12:00 AM"
                    defaultValue="12:00 AM"
                    className="px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-4">
                <button
                  onClick={() => setPopupType(null)}
                  className="flex-1 px-6 py-3 text-sm border border-[#e8e8e8] text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button className="flex-1 px-6 py-3 bg-[#9473ff] text-white text-sm font-medium rounded-[32px] hover:bg-[#7f5fd9]">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Appointment Form Modal */}
      {popupType === 'newAppointment' && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="bg-white rounded-[20px] w-full max-w-lg p-6 relative mx-4" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <button
              onClick={() => setPopupType(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Add new appointment</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-900 mb-2 block">Subject</label>
                <input
                  type="text"
                  placeholder="Enter subject"
                  className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm text-gray-900 mb-2 block">Date & Time</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Sat Feb 7, 2026"
                    defaultValue="Sat Feb 7, 2026"
                    className="px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="12:00 AM"
                    defaultValue="12:00 AM"
                    className="px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-900 mb-2 block">Attendees (for google invite)</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Choose attendees or team members"
                    value={attendeeValue}
                    onChange={(e) => setAttendeeValue(e.target.value)}
                    onFocus={() => setShowAttendeeDropdown(true)}
                    onBlur={() => setTimeout(() => setShowAttendeeDropdown(false), 200)}
                    className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {showAttendeeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      <button
                        onClick={() => {
                          setAttendeeValue('#1 Team Member');
                          setShowAttendeeDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                      >
                        #1 Team Member
                      </button>
                      <button
                        onClick={() => {
                          setAttendeeValue('#2 Team Member');
                          setShowAttendeeDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                      >
                        #2 Team Member
                      </button>
                      <button
                        onClick={() => {
                          setAttendeeValue('#3 Team Member');
                          setShowAttendeeDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        #3 Team Member
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-900 mb-2 block">Details</label>
                <textarea
                  placeholder="Enter appointment details"
                  rows={4}
                  className="w-full px-4 py-3 border border-[#e8e8e8] rounded-[15px] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-4">
                <button
                  onClick={() => setPopupType(null)}
                  className="flex-1 px-6 py-3 text-sm border border-[#e8e8e8] text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[39px] flex items-center justify-center gap-2 whitespace-nowrap text-[16px] px-[24px] py-[10px]">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {isAddClientModalOpen && (
        <AddClientModal
          isOpen={isAddClientModalOpen}
          onClose={() => setIsAddClientModalOpen(false)}
          onSave={(clientData) => {
            // Generate a new client ID
            const newClientId = (mockClientDatabase.length + 1).toString();
            
            // Create the new client object matching the mock database structure
            const newClient = {
              id: newClientId,
              name: `${clientData.firstName} ${clientData.lastName}`.trim(),
              email: clientData.email,
              phone: clientData.phone,
              address: clientData.address || '',
            };
            
            // Add to the mock database
            mockClientDatabase.push(newClient);
            
            // Set as selected client and populate address
            setSelectedClient(newClient);
            setClientSearchTerm(newClient.name);
            setAddressInput(newClient.address); // Auto-populate address
            
            // Close the modal
            setIsAddClientModalOpen(false);
          }}
        />
      )}

      {/* Add Custom Value Modal */}
      {customValueModal.isOpen && (
        <AddCustomValueModal
          isOpen={customValueModal.isOpen}
          title={customValueModal.title}
          placeholder={
            customValueModal.type === 'jobType' ? 'Enter job type name...' :
            customValueModal.type === 'jobSource' ? 'Enter job source name...' :
            customValueModal.type === 'tags' ? 'Enter tag name...' :
            'Enter value...'
          }
          onClose={() => setCustomValueModal({ isOpen: false, type: null, title: '' })}
          onSave={(value) => {
            if (customValueModal.type === 'jobType') {
              setJobTypes([...jobTypes, value]);
            } else if (customValueModal.type === 'jobSource') {
              setJobSources([...jobSources, value]);
            }
            setCustomValueModal({ isOpen: false, type: null, title: '' });
          }}
        />
      )}

      {/* Job Summary Hover Card */}
      {hoveredJob && (
        <>
          {/* Backdrop - only show for click/touch interactions, not hover */}
          {!isHoverMode && (
            <div 
              className="fixed inset-0 z-[60] bg-black/20"
              onClick={() => {
                setHoveredJob(null);
                setIsHoverMode(false);
                setHoverPosition(null);
                if (pressTimer) {
                  clearTimeout(pressTimer);
                  setPressTimer(null);
                }
                if (leaveTimer) {
                  clearTimeout(leaveTimer);
                  setLeaveTimer(null);
                }
              }}
            />
          )}
          
          {/* Card */}
          <div 
            className="fixed z-[61] pointer-events-none"
            style={{
              left: hoverPosition ? `${hoverPosition.x}px` : '50%',
              top: hoverPosition ? `${hoverPosition.y}px` : '50%',
              transform: hoverPosition ? 'translate(-50%, calc(-100% - 12px))' : 'translate(-50%, -50%)',
            }}
            onMouseEnter={() => {
              // Clear leave timer when hovering over the card area
              if (leaveTimer) {
                clearTimeout(leaveTimer);
                setLeaveTimer(null);
              }
            }}
            onMouseLeave={() => {
              // Hide card when leaving the card area (only for hover mode)
              if (isHoverMode) {
                setHoveredJob(null);
                setIsHoverMode(false);
                setHoverPosition(null);
              }
            }}
          >
            <div 
              className="bg-white rounded-[20px] p-2.5 w-[240px] border border-[#e2e8f0] pointer-events-auto"
              style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Profile Picture & Status Badge */}
              <div className="flex items-start justify-between mb-1.5">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src={hoveredJob.teamMember === 'John Tom' ? technicianImage : technicianImage2}
                    alt="Technician"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="px-2 py-0.5 bg-[rgb(175,164,255)] text-[#051046] text-[9px] rounded-[15px] font-medium">
                  {hoveredJob.status}
                </span>
              </div>

              {/* Staff Name */}
              <h3 className="text-base font-bold text-[#051046] mb-0.5">
                {hoveredJob.teamMember}
              </h3>

              {/* Client Name */}
              <p className="text-sm font-medium text-[#051046] mb-0.5">
                {hoveredJob.clientName}
              </p>

              {/* Job Type */}
              <p className="text-sm font-medium text-[#051046] mb-1">
                {hoveredJob.title}
              </p>

              {/* Address */}
              <p className="text-xs text-[#051046] mb-1">
                {hoveredJob.address}
              </p>

              {/* Arrival Window */}
              <p className="text-xs font-medium text-[#051046]">
                {hoveredJob.startTime} - {hoveredJob.endTime}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Add Job Modal */}
      {isAddJobModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-xl border border-[#e2e8f0] overflow-hidden">
            <div className="max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-semibold text-[#051046]">New Job</h2>
                <button
                  onClick={() => {
                    setIsAddJobModalOpen(false);
                    setIsTeamMemberDropdownOpen(false);
                  }}
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
                    onClick={() => setIsAddClientModalOpen(true)}
                    className="mt-1 text-xs text-[#8b5cf6] hover:underline"
                  >
                    + Add new
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
                        onClick={() => setCustomValueModal({ isOpen: true, type: 'jobType', title: 'Add New Job Type' })}
                        className="mt-1 text-xs text-[#8b5cf6] hover:underline"
                      >
                        + Add new
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
                        onClick={() => setCustomValueModal({ isOpen: true, type: 'jobSource', title: 'Add New Job Source' })}
                        className="mt-1 text-xs text-[#8b5cf6] hover:underline"
                      >
                        + Add new
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
                                      <span className="text-xs text-gray-500">
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
                                        <span className="text-sm text-gray-500">
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
                    className="mt-1 text-xs text-[#8b5cf6] hover:underline"
                  >
                    + Add new
                  </button>
                  
                  {/* Selected Items Table */}
                  {selectedInventoryItems.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                      <div className="min-w-[640px]">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 text-xs font-semibold text-gray-600">Description</th>
                              <th className="text-center py-2 text-xs font-semibold text-gray-600">Upsell</th>
                              <th className="text-center py-2 text-xs font-semibold text-gray-600">Quantity</th>
                              <th className="text-right py-2 text-xs font-semibold text-gray-600">Price</th>
                              <th className="text-right py-2 text-xs font-semibold text-gray-600">Total</th>
                              <th className="text-center py-2 text-xs font-semibold text-gray-600 w-16">Actions</th>
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
                                      value={item.price}
                                      onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                      step="any"
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
                    onClick={() => setCustomValueModal({ isOpen: true, type: 'tags', title: 'Add New Tag' })}
                    className="mt-1 text-xs text-[#8b5cf6] hover:underline"
                  >
                    + Add new
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
                  onClick={() => {
                    setIsAddJobModalOpen(false);
                    setIsTeamMemberDropdownOpen(false);
                  }}
                  className="px-6 py-2 text-[#051046] border border-[#e8e8e8] hover:bg-gray-50 rounded-[32px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
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

                    // Parse day directly from date string to avoid UTC offset issues
                    const [, , dayStr] = startDate.split('-');
                    const day = parseInt(dayStr, 10);
                    
                    // Generate unique job ID
                    const jobId = `job-${Date.now()}`;
                    
                    // Calculate duration
                    const duration = '2h 0min';

                    // Build display address
                    const jobAddress = addressInput.trim() || (selectedClient ? `${selectedClient.name}'s location` : 'No address');
                    
                    // Create full Job object for JobsContext
                    const newJobData = {
                      id: jobId,
                      tags: jobTags,
                      client: selectedClient?.name || 'Client',
                      clientEmail: selectedClient?.email || 'no-email@example.com',
                      clientPhone: selectedClient?.phone || '(000) 000-0000',
                      jobType: jobType || 'Service',
                      jobStatus: 'Scheduled' as const,
                      duration: duration,
                      scheduled: `${startDate} ${startTime || '12:00 AM'}`,
                      scheduledStart: startISO,
                      scheduledEnd: endISO,
                      tech: selectedTeamMembers.length > 0 ? selectedTeamMembers[0] : 'Unassigned',
                      address: jobAddress,
                      jobDescription: jobDescription || 'No description',
                      jobSource: jobSource || 'Schedule',
                      techNotes: '',
                      isNew: false,
                      hasUpsell: selectedInventoryItems.some(item => item.isUpsell),
                      arrivedLate: false,
                      scheduledByStaff: true,
                      isAllDay: false,
                    };
                    
                    // Add to jobs context (the useEffect will update calendar events automatically)
                    addJob(newJobData);
                    
                    // Reset form
                    setJobType('');
                    setJobSource('');
                    setJobDescription('');
                    setStartDate('');
                    setStartTime('');
                    setEndDate('');
                    setEndTime('');
                    setAddressInput('');
                    setSelectedClient(null);
                    setClientSearchTerm('');
                    setSelectedTeamMembers([]);
                    setJobTags([]);
                    setSelectedInventoryItems([]);
                    setIsTeamMemberDropdownOpen(false);
                    
                    // Close modal and show notification popup
                    setIsAddJobModalOpen(false);
                    setShowNotificationPopup(true);
                  }}
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
        </div>
      )}

      {/* Developer Notes Popup */}
      {showDevNotesPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ backgroundColor: 'rgba(5,16,70,0.18)' }}>
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] shadow-2xl w-full max-w-2xl mx-4 flex flex-col" style={{ maxHeight: '88vh' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛠️</span>
                <span className="text-[#051046] font-semibold text-base">Developer Notes — Schedule Job</span>
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-[#f0ebff] text-[#9473ff] border border-[#e2d9ff]">Backend Automations</span>
              </div>
              <button
                onClick={() => setShowDevNotesPopup(false)}
                className="text-[#051046] hover:text-[#9473ff] transition-colors p-1 rounded-full hover:bg-[#f0ebff]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">

              {/* Note 1 */}
              <div className="flex gap-3">
                <span className="text-[#9473ff] mt-0.5 flex-shrink-0">✓</span>
                <p className="text-sm text-[#051046]">Job is scheduled and keyed in by a team member.</p>
              </div>

              {/* Note 2 — Customer Email */}
              <div className="flex gap-3">
                <span className="text-[#9473ff] mt-0.5 flex-shrink-0">✓</span>
                <div className="flex-1">
                  <p className="text-sm text-[#051046] font-medium">Scheduled Job Details email notification sent to customer</p>
                  <p className="text-xs text-[#9473ff] font-medium mt-1 mb-2">Email Notification Template:</p>
                  <div className="bg-[#f8f7ff] border border-[#e2d9ff] rounded-[12px] px-4 py-3 text-xs text-[#051046] space-y-1 leading-relaxed">
                    <p>Hello [Client Name],</p>
                    <p>Your service appointment with [User Company Name] has been scheduled.</p>
                    <p className="pt-1"><span className="font-medium">Appointment Date:</span> [Job Date]</p>
                    <p><span className="font-medium">Arrival Window:</span> Between [Arrival Window Start Time] and [Arrival Window End Time]</p>
                    <p><span className="font-medium">Service Address:</span> [Service Location Address]</p>
                    <p className="pt-1">Your technician:</p>
                    <p>[Assigned Team Member]</p>
                    <p>[Team Member Image]</p>
                    <p className="pt-1">Our technician will arrive within the scheduled window and will contact you if they are on the way or running ahead or behind schedule.</p>
                    <p className="pt-1">If you have any questions before your appointment, please call us at [User Phone Number].</p>
                    <p className="pt-1">Best regards,</p>
                    <p>[User Company Name]</p>
                    <p className="text-[#9473ff] underline cursor-pointer">[User Company Website]</p>
                  </div>
                </div>
              </div>

              {/* Note 3 — SMS */}
              <div className="flex gap-3">
                <span className="text-[#9473ff] mt-0.5 flex-shrink-0">✓</span>
                <div className="flex-1">
                  <p className="text-sm text-[#051046] font-medium">SMS Schedule message are sent to the customers.</p>
                  <p className="text-xs text-[#9473ff] font-medium mt-1 mb-2">SMS Notification Template:</p>
                  <div className="bg-[#f8f7ff] border border-[#e2d9ff] rounded-[12px] px-4 py-3 text-xs text-[#051046] leading-relaxed space-y-1">
                    <p>Hi {'{{customer_name}}'}, your appointment with {'{{company_name}}'} is confirmed for {'{{job_service_date}}'}. Our technician will arrive between {'{{job_start_time}}'} and {'{{job_end_time}}'}.</p>
                    <p className="pt-1">To reschedule or cancel, please call us at {'{{company_phone}}'}.</p>
                    <p className="pt-1">Thank you!</p>
                    <p className="text-[#64748b] italic">— No Reply</p>
                  </div>
                </div>
              </div>

              {/* Note 4 — Tech Email */}
              <div className="flex gap-3">
                <span className="text-[#9473ff] mt-0.5 flex-shrink-0">✓</span>
                <div className="flex-1">
                  <p className="text-sm text-[#051046] font-medium">New Job Scheduled is sent to the team member scheduled for the job.</p>
                  <p className="text-xs text-[#9473ff] font-medium mt-1 mb-2">Email Notification Template:</p>
                  <div className="bg-[#f8f7ff] border border-[#e2d9ff] rounded-[12px] px-4 py-3 text-xs text-[#051046] space-y-1 leading-relaxed">
                    <p>Dear Technician,</p>
                    <p>I hope this email finds you well. I am writing to inform you that a new job has been created and assigned to you by our office administrator. We trust in your expertise to successfully complete this task, and we appreciate your dedication to our team.</p>
                    <p className="pt-1 font-medium">Below are the details of the job:</p>
                    <p><span className="font-medium">Client Name:</span> [Client Name]</p>
                    <p><span className="font-medium">Client Contact Information:</span> [Service Location Address]</p>
                    <p><span className="font-medium">Job Description:</span> [Job Description]</p>
                    <p><span className="font-medium">Inventory:</span> [Job Inventory Items]</p>
                    <p className="pt-1 font-medium">Scheduled:</p>
                    <p>Start – [Job Start Date] [Job Start Time]</p>
                    <p>End – [Job End Date] [Job End Time]</p>
                    <p className="pt-1">Please review the information provided and reach out to the office administrator if you have any questions or need further clarification. Your prompt attention to this matter is greatly appreciated.</p>
                    <p className="pt-1">Thank you for your commitment to excellence in your work. We are confident that you will handle this job with professionalism and efficiency.</p>
                    <p className="pt-1">Best regards,</p>
                    <p>[User Name]</p>
                    <p>[User Company Name]</p>
                    <p className="text-[#9473ff] underline cursor-pointer">[User Company Website]</p>
                    <p>For any concerns, feel free to call us at <span className="text-[#9473ff] underline cursor-pointer">[User Phone Number]</span></p>
                  </div>
                </div>
              </div>

              {/* Remaining notes */}
              {[
                'Workload graph count increases for all assigned team members',
                "Today's Progress on the dashboard - Scheduled count increases (if scheduled for today)",
                'Appears on the schedule calendar tab, hover over status is scheduled',
                'Top Sources count increases on the dashboard',
                'If applicable - low inventory items on the dashboard, most used inventory, most sold service could adjust.',
                'Job will display on the job list',
                "Job will appear on the dashboard under future jobs or today's jobs",
                'Populates on the "Popular Service Area" on the dashboard',
                'Staff dashboard will update if applicable',
              ].map((note, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="text-[#9473ff] mt-0.5 flex-shrink-0">✓</span>
                  <p className="text-sm text-[#051046]">{note}</p>
                </div>
              ))}

            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-[#e2e8f0] flex-shrink-0">
              <button
                onClick={() => setShowDevNotesPopup(false)}
                className="px-6 py-2 bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[15px] text-sm transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Sent Popup */}
      {showNotificationPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(5,16,70,0.3)' }}>
          <div 
            className="bg-white rounded-[20px] border border-[#e2e8f0] w-full max-w-md p-8 text-center animate-fadeIn"
            style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 8px 32px 4px' }}
          >
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[#f0ebff] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#9473ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Message */}
            <h3 className="text-xl font-semibold text-[#051046] mb-3">
              Job Scheduled Successfully!
            </h3>
            <p className="text-sm text-[#051046] leading-relaxed mb-6">
              Notifications have been sent to the customer and assigned technician.
            </p>

            {/* Close Button */}
            <button
              onClick={() => setShowNotificationPopup(false)}
              className="px-8 py-2.5 bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[32px] text-sm font-medium transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editTaskModal.isOpen && editTaskModal.task && (
        <EditTaskModal
          isOpen={editTaskModal.isOpen}
          task={editTaskModal.task}
          onClose={handleEditTaskCancel}
          onSave={handleEditTaskConfirm}
        />
      )}

      {/* Edit Appointment Modal */}
      {editAppointmentModal.isOpen && editAppointmentModal.appointment && (
        <EditAppointmentModal
          isOpen={editAppointmentModal.isOpen}
          appointment={editAppointmentModal.appointment}
          onClose={handleEditAppointmentCancel}
          onSave={handleEditAppointmentConfirm}
        />
      )}

      {/* Add Part or Service Modal */}
      <AddPartOrServiceModal
        isOpen={isAddInventoryModalOpen}
        onClose={() => setIsAddInventoryModalOpen(false)}
        onSave={handleAddCustomInventoryItem}
      />
      </div>
    </DndProvider>
  );
}