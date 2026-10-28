import * as ProfileMenu from '@radix-ui/react-dropdown-menu';
import { StaffAppAI } from '../components/StaffAppAI';
import { StaffAppSettings } from '../components/StaffAppSettings';
import { StaffAppTabs } from '../components/StaffAppTabs';
import { StaffAppDocumentPreview } from '../components/StaffAppDocumentPreview';
import { StaffAppServicePlanIcon } from '../components/StaffAppServicePlanIcon';
import { StaffAppPageHeading } from '../components/StaffAppPageHeading';
import { StaffAppServicePlans } from '../components/StaffAppServicePlans';
import { StaffAppClientProfile } from '../components/StaffAppClientProfile';
import { StaffAppJobDetails } from '../components/StaffAppJobDetails';
import { useState, useRef, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ArrowLeft, ChevronLeft, ChevronDown, ArrowUpRight, Bell, CalendarDays, Check, ChevronRight, ClipboardList, Clock, FileText, HelpCircle, Handshake, LayoutDashboard, MapPin, MoreHorizontal, Package, Phone, Navigation, UserRound, Search, Settings, ShieldCheck, Smartphone, Sparkles, Tag, Users, Briefcase, Wrench, Plus, ListFilter, LogOut, X } from 'lucide-react';
import './StaffAppPage.css';
import '../components/StaffAppDropdowns.css';

// Set to false to restore the original white Schedule timeline cards.
const USE_COLORED_TIMELINE = true;
// Set to false to restore the original Staff App job details layout below.
const USE_NEW_JOB_DETAILS = true;

type ActivityStatus = 'Scheduled' | 'Done' | 'Overdue' | 'Canceled';
const activityStatuses: ActivityStatus[] = ['Scheduled', 'Done', 'Overdue', 'Canceled'];
const activities = [
  { id: 'appointment-1', kind: 'appointment', title: 'Morning team check-in', time: '8:30', period: 'AM', detail: '15 min · Phone call' },
  { id: 'task-1', kind: 'task', title: 'Pick up water heater fittings', time: '9:00', period: 'AM', detail: 'Supply pickup · Today' },
  { id: 'task-2', kind: 'task', title: 'Submit yesterday’s visit notes', time: '2:00', period: 'PM', detail: 'Visit notes · Today' },
];

const jobs = [
  { id: 'J-104', client: 'Michael Chen', service: 'Water heater installation', address: '567 Pine Road, Georgetown, TX', time: '9:00 – 11:00 AM', status: 'Scheduled', scheduledDate: '2026-10-16', systemTags: ["SPV"], customTags: ["New"] },
  { id: 'J-106', client: 'Sarah Williams', service: 'Kitchen drain repair', address: '120 Oak Avenue, Austin, TX', time: '12:00 – 2:00 PM', status: 'Scheduled', scheduledDate: '2026-10-16', systemTags: [], customTags: ["Urgent"] },
  { id: 'J-108', client: 'David Miller', service: 'Annual plumbing inspection', address: '86 Cedar Street, Austin, TX', time: '3:00 – 4:00 PM', status: 'Scheduled', scheduledDate: '2026-10-16', systemTags: ["SPV"], customTags: ["Quick"] },
];
const inventoryItems = [
        { name: 'Copper elbow', sku: 'CU-ELB-001', category: 'Parts', brand: 'CopperFit', type: 'part', stock: 4, minimum: 10, price: 8.5 },
        { name: 'Water heater fittings kit', sku: 'WH-KIT-002', category: 'Parts', brand: 'ProLine', type: 'part', stock: 12, minimum: 5, price: 45 },
        { name: 'Pipe sealant', sku: 'SEAL-004', category: 'Parts', brand: '', type: 'part', stock: 0, minimum: 5, price: 12 },
        { name: 'Drain cleaning', sku: 'SVC-DRN-003', category: 'Services', brand: '', type: 'service', stock: null, minimum: 0, price: 150 },
      ];

const menu = [
  { name: 'Notifications', icon: Bell, detail: 'Updates that need your attention' },
  { name: 'Service Plans', icon: ShieldCheck, detail: 'Memberships and recurring visits' },
  { name: 'Inventory', icon: Package, detail: 'Parts, services and stock levels' },
  { name: 'Klervo AI', icon: Sparkles, detail: 'Your assistant in the field' },
  { name: 'Settings', icon: Settings, detail: 'Your profile and preferences' },
  { name: 'Help', icon: HelpCircle, detail: 'Help when you need it' },
];

function StatusLabel({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Scheduled: '#0698c6', 'In Progress': '#28bdf2', 'Deposit Collected': '#9473ff',
    Done: '#b9df10', Completed: '#b9df10', Active: '#b9df10', Failed: '#f16a6a', Approved: '#b9df10', Paid: '#b9df10',
    Pending: '#28bdf2', Due: '#f0a041', Unpaid: '#f16a6a', Overdue: '#ff6493',
    Canceled: '#f16a6a', Cancelled: '#f16a6a', Lost: '#9ca3af', 'Estimate Declined': '#f16a6a', Declined: '#f16a6a', Refunded: '#9473ff',
  };
  return <span className="sa-status-label"><i aria-hidden="true" style={{ backgroundColor: colors[status] || '#9ca3af' }} />{status}</span>;
}

function JobTags({ job }: { job: typeof jobs[number] }) {
  return <div className="sa-job-tags" aria-label="Job tags">
    {job.systemTags.filter(tag => tag !== 'SPV').map(tag => <span key={tag} className="sa-system-tag">{tag}</span>)}
    {job.customTags.map(tag => <span key={tag} className="sa-custom-tag">{tag}</span>)}
  </div>;
}

function Card({ title, icon, children, action }: { title: string; icon?: ReactNode; children: ReactNode; action?: ReactNode }) {
  return <section className="sa-card"><div className="sa-card-heading"><h2>{icon}{title}</h2>{action}</div>{children}</section>;
}

const initialJobs = jobs;
const initialActivities = activities;

export function StaffAppPage() {
  const monthDialog = useRef<HTMLDialogElement>(null);
  const [monthPickerYear, setMonthPickerYear] = useState(2026);
  const [pickerMonth, setPickerMonth] = useState<number | null>(null);
  const [profileParams, setProfileParams] = useSearchParams();
  const [jobs] = useState(initialJobs);
  const [activities] = useState(initialActivities);
  const addDialog = useRef<HTMLDialogElement>(null);
  const [addType, setAddType] = useState<'Job' | 'Task' | 'Appointment' | 'Client' | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [screen, setScreen] = useState('Dashboard');
  const [documentPreview, setDocumentPreview] = useState<'Estimate' | 'Invoice' | null>(null);
  const [planClient, setPlanClient] = useState<typeof initialJobs[number] | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatuses, setJobStatuses] = useState<Record<string, string>>({});
  const [query, setQuery] = useState('');
  const [jobsPeriod, setJobsPeriod] = useState('all-time');
  const [jobsStatus, setJobsStatus] = useState('');
  const [listSort, setListSort] = useState<Record<string, string>>({});
  const filterDialog = useRef<HTMLDialogElement>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [inventoryFilters, setInventoryFilters] = useState({ type: 'all', stock: 'all', sort: 'name' });
  const [documentFilters, setDocumentFilters] = useState({ Estimates: { period: 'all-time', status: '' }, Invoices: { period: 'all-time', status: '' } });
  const [activityStatus, setActivityStatus] = useState<Record<string, ActivityStatus>>({});
  const [selectedActivity, setSelectedActivity] = useState<typeof activities[number] | null>(null);
  const [draftStatus, setDraftStatus] = useState<ActivityStatus>('Scheduled');
  const statusDialog = useRef<HTMLDialogElement>(null);
  const activityRows = (kind: string, id?: string) => activities.filter(item => item.kind === kind && (!id || item.id === id)).map(item => {
    const status = activityStatus[item.id] || 'Scheduled';
    return <button key={item.id} className="sa-activity" aria-label={`Update status for ${item.title}, currently ${status}`} onClick={() => {
      setSelectedActivity(item); setDraftStatus(status); setStatusOpen(true); statusDialog.current?.showModal();
    }}>
      <span className="sa-activity-info"><span className="sa-activity-heading"><strong>{item.title}</strong><StatusLabel status={status} /></span><small>October 15, 2026 · {item.time} {item.period}</small></span>
    </button>;
  });
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [read, setRead] = useState(false);
  const [period, setPeriod] = useState('Current Year');
  const salesPeriods: Record<string, { total: string; bars: number[]; labels: string[] }> = {
    'Current Month': { total: '$4,850', bars: [30, 52, 40, 80], labels: ['W1', 'W2', 'W3', 'W4'] },
    'Last Month': { total: '$3,620', bars: [42, 30, 65, 48], labels: ['W1', 'W2', 'W3', 'W4'] },
    'Last 3 Months': { total: '$11,250', bars: [55, 72, 90], labels: ['Jul', 'Aug', 'Sep'] },
    'Current Year': { total: '$24,850', bars: [25, 42, 35, 62, 45, 78, 56, 72, 62, 95], labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O'] },
  };
  const sales = salesPeriods[period];
  const [estimateView, setEstimateView] = useState('Estimates');
  const [scheduleDate, setScheduleDate] = useState('2026-10-16');
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'done' | 'jobs'>('all');
  const open = (next: string) => { if (next === 'Help') { window.open('https://klervo.gitbook.io/klervo', '_blank', 'noopener,noreferrer'); return; } setPlanClient(null); setProfileParams({}); setScheduleFilter('all'); setScreen(next); setJobId(null); setQuery(''); };
  const job = jobs.find(item => item.id === jobId);
  const filteredJobs = jobs.filter(item => `${item.id} ${item.client} ${item.service}`.toLowerCase().includes(query.toLowerCase()));
  const viewAll = (destination: string) => <button className="sa-text-button" onClick={() => {
    if (destination === 'Past Jobs' || destination === 'Future Jobs') {
      open('Schedule');
      setScheduleDate(destination === 'Past Jobs' ? '2026-10-16' : '2026-10-17');
      setScheduleFilter(destination === 'Past Jobs' ? 'done' : 'jobs');
    } else open(destination);
  }}>View all <ArrowUpRight size={13} /></button>;
  const jobCard = (item: typeof jobs[number]) => <button key={item.id} className="sa-job" onClick={() => setJobId(item.id)}><div className="sa-job-top"><span className="sa-job-id-label">{item.id}{item.systemTags.includes('SPV') && <StaffAppServicePlanIcon />}</span><StatusLabel status={jobStatuses[item.id] || item.status} /></div><h3>{item.service}</h3><p>{item.client} <span>· {item.time}</span></p><div className="sa-job-address"><MapPin size={13} />{item.address}<ChevronRight size={16} /></div><JobTags job={item} /></button>;
  const search = (placeholder: string) => <label className="sa-search"><Search size={18} /><input aria-label={placeholder} placeholder={placeholder} value={query} onChange={event => setQuery(event.target.value)} /></label>;
  const pageHeader = <header className="sa-page-header"><div className="sa-home-greeting">
        <div><p>Thursday, October 15</p><h1>Hi, Paonda</h1></div>
        <div className="sa-home-controls">
          <button className="sa-home-notification" aria-label="Notifications" onClick={() => open('Notifications')}><Bell size={23} />{!read && <span>3</span>}</button>
          <ProfileMenu.Root>
            <ProfileMenu.Trigger asChild><button type="button" className="sa-home-profile" aria-label="Your profile">PP</button></ProfileMenu.Trigger>
            <ProfileMenu.Content className="sa-profile-menu" align="end" sideOffset={8}>
              <ProfileMenu.Item className="sa-profile-menu-item" onSelect={() => open('Settings')}><Settings size={18} aria-hidden="true" />Settings</ProfileMenu.Item>
              <ProfileMenu.Item className="sa-profile-menu-item" onSelect={() => { window.location.href = 'https://jojobacklinks.github.io/Newklervofsimprovedui/'; }}><LogOut size={18} aria-hidden="true" />Log Out</ProfileMenu.Item>
            </ProfileMenu.Content>
          </ProfileMenu.Root>
        </div>
      </div></header>;
  const dashboard = <>
    <section className="sa-home-top">
      <div className="sa-home-up-next">
        <div className="sa-home-next-heading"><p>Up next, starts in 45 min</p>{jobs[0].systemTags.includes('SPV') && <StaffAppServicePlanIcon />}</div>
        <h2>4:00 pm</h2>
        <h3>{jobs[0].service} <span>Arrival: 4:00 - 6:00 pm</span></h3>
        <div className="sa-home-customer"><span><UserRound size={15} />{jobs[0].client}</span><span><MapPin size={15} />Georgetown TX</span></div>
        <JobTags job={jobs[0]} />
        <div className="sa-home-actions">
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(jobs[0].address)}`} target="_blank" rel="noreferrer"><Navigation size={19} />Navigate</a>
          <a href="tel:+15125550104"><Phone size={19} />Call</a>
          <button onClick={() => setJobId(jobs[0].id)}>Go to Job</button>
        </div>
      </div>
    </section>
    <section className="sa-promotion"><Tag size={20} /><div><h2>Active Promotions <span>& Special Offers</span></h2><p>No active promotions at this time.</p><small>Offers from your office will appear here.</small></div></section>
    <Card title="Estimates/Invoices" icon={<FileText size={17} />} action={<select aria-label="Overview type" value={estimateView} onChange={event => setEstimateView(event.target.value)}><option>Estimates</option><option>Invoices</option></select>}><div className="sa-metrics">{(estimateView === 'Estimates' ? [['Unsent', '1'], ['Pending', '2'], ['Approved', '3'], ['Declined', '0']] : [['Due', '2'], ['Unpaid', '1'], ['Paid', '3'], ['Refunded', '0']]).map(([label, count]) => <button key={label} onClick={() => open(estimateView)}><strong>{count}</strong><span>{label}</span></button>)}</div></Card>
    <Card title="Today’s Jobs" icon={<Briefcase size={17} />} action={viewAll('Jobs')}>{jobs.map(jobCard)}</Card>
    <Card title="Today’s Appointments" icon={<Handshake size={17} />}>{activityRows('appointment')}</Card>
    <Card title="Today’s Tasks" icon={<Check size={17} />}>{activityRows('task')}</Card>
    <div className="sa-two-up"><Card title="Past Jobs" icon={<Check size={16} />}><strong className="sa-big-number">{jobs.filter(item => ['Done', 'Completed'].includes(jobStatuses[item.id] || item.status)).length}</strong><p className="sa-muted">Completed today</p>{viewAll('Past Jobs')}</Card><Card title="Future Jobs" icon={<Clock size={16} />}><strong className="sa-big-number">{jobs.slice(1).length}</strong><p className="sa-muted">Scheduled tomorrow</p>{viewAll('Future Jobs')}</Card></div>
    <Card title="Sales Overview" icon={<ArrowUpRight size={17} />} action={<select aria-label="Sales period" value={period} onChange={event => setPeriod(event.target.value)}>{Object.keys(salesPeriods).map(option => <option key={option}>{option}</option>)}</select>}><div className="sa-sales"><strong>{sales.total}</strong><span>YOUR SALES</span></div><div className="sa-chart" role="img" aria-label={`Sample sales chart for ${period}`}>{sales.bars.map((height, index) => <div key={index}><i style={{ height: `${height}px` }} /><span>{sales.labels[index]}</span></div>)}</div></Card>
    <Card title="Low Inventory Items" icon={<Package size={17} />} action={viewAll('Inventory')}>{inventoryItems.filter(item => item.type === 'part' && item.stock !== null && item.stock < item.minimum).map(item => <button className="sa-list-row sa-low-stock-row" key={item.sku} onClick={() => open('Inventory')}><div><h3>{item.name}</h3><p>{item.stock} in stock</p></div><span className={`sa-stock-label sa-stock-${item.stock === 0 ? 'out' : 'low'}`}>{item.stock === 0 ? 'Out' : 'Low'}</span></button>)}</Card>
    <p className="sa-sample-note">Sample data for the mobile UI/UX preview.</p>
  </>;

  const matchesTimePeriod = (value: string, timePeriod: string) => {
      const todayParts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(new Date());
      const part = (name: string) => Number(todayParts.find(value => value.type === name)?.value);
      const today = new Date(part('year'), part('month') - 1, part('day'));
      const matchesPeriod = (value: string) => {
        if (timePeriod === 'all-time') return true;
        const date = new Date(value + 'T00:00:00');
        const end = new Date(today); end.setDate(end.getDate() + 1);
        let start = new Date(today);
        if (timePeriod === 'last-7-days') start.setDate(start.getDate() - 6);
        if (timePeriod === 'current-month') return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
        if (timePeriod === 'last-month') return date >= new Date(today.getFullYear(), today.getMonth() - 1, 1) && date < new Date(today.getFullYear(), today.getMonth(), 1);
        if (timePeriod === 'last-3-months') start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        if (timePeriod === 'current-year') return date.getFullYear() === today.getFullYear();
        return date >= start && date < end;
      };
    return matchesPeriod(value);
  };

  function content() {
    if (screen === 'Service Plans' && !jobId && !profileParams.get('client')) return <StaffAppServicePlans renderStatus={status => <StatusLabel status={status} />} onBack={() => open('More')} onClient={plan => { const client = jobs.find(item => item.client === plan.clientName) || { ...jobs[0], id: plan.id, client: plan.clientName, address: plan.propertyAddress, service: plan.serviceName }; setPlanClient(client); setProfileParams({ client: client.id }); }} />;
    const profileJob = profileParams.get('client') ? planClient || jobs.find(item => item.id === profileParams.get('client')) : undefined;
    if (profileJob) return <StaffAppClientProfile key={profileJob.client} clientJob={profileJob} jobs={jobs} backLabel={screen === 'Service Plans' ? 'Back to service plans' : jobId ? 'Back to job' : 'Back to clients'} onBack={() => { setPlanClient(null); setProfileParams({}); }} onJob={id => { setProfileParams({}); setJobId(id); }} renderStatus={status => <StatusLabel status={status} />} />;

    if (job && USE_NEW_JOB_DETAILS) return <StaffAppJobDetails key={job.id} initialTab={screen === 'Estimates' ? 'Estimate' : screen === 'Invoices' ? 'Invoice' : 'Details'} job={job} status={jobStatuses[job.id] || job.status} onStatusChange={status => setJobStatuses(current => ({ ...current, [job.id]: status }))} onBack={() => setJobId(null)} renderStatus={status => <StatusLabel status={status} />} renderTags={() => <JobTags job={job} />} />;
    if (job) return <><button className="sa-text-button sa-back" onClick={() => setJobId(null)}><ArrowLeft size={16} />Back</button><div className="sa-page-title"><span>{job.id}</span><h1>{job.service}</h1><p>{jobStatuses[job.id] || job.status} · {job.time}</p></div><Card title="Client & location" icon={<Users size={17} />}><h3>{job.client}</h3><p className="sa-muted">{job.address}</p><div className="sa-button-row"><a className="sa-secondary" href="tel:+15125550104"><Phone size={15} />Call</a><a className="sa-secondary" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`} target="_blank" rel="noreferrer"><MapPin size={15} />Directions</a></div></Card><Card title="Visit checklist" icon={<ClipboardList size={17} />}>{['Review service requirements', 'Complete safety inspection', 'Test completed work'].map(text => <label className="sa-task" key={text}><input type="checkbox" checked={Boolean(checks[`${job.id}-${text}`])} onChange={event => setChecks({ ...checks, [`${job.id}-${text}`]: event.target.checked })} />{text}</label>)}</Card><Card title="Visit notes"><textarea aria-label="Visit notes" placeholder="Describe the work completed…" rows={4} /></Card><div className="sa-button-row"><button className="sa-secondary" onClick={() => open('Estimates')}>Estimates</button><button className="sa-secondary" onClick={() => open('Invoices')}>Invoices</button></div><button className="sa-primary sa-full" onClick={() => { const status = jobStatuses[job.id] || job.status; setJobStatuses({ ...jobStatuses, [job.id]: status === 'Scheduled' ? 'In Progress' : 'Completed' }); }}>{(jobStatuses[job.id] || job.status) === 'Scheduled' ? 'Start job' : (jobStatuses[job.id] || job.status) === 'Completed' ? 'Visit completed' : 'Complete visit'}</button></>;
    if (screen === 'Dashboard') return dashboard;
    if (screen === 'More') return <><div className="sa-profile"><div className="sa-avatar">PP</div><h1>Paonda Pulaor</h1><p>Staff member · KL Plumbing</p></div>{menu.map(({ name, icon: Icon, detail }) => <button className="sa-menu-item" key={name} onClick={() => open(name)}><span className="sa-menu-icon"><Icon size={21} /></span><div><h3>{name}</h3><p>{detail}</p></div>{name === 'Notifications' && !read && <span className="sa-unread">3</span>}<ChevronRight size={17} /></button>)}</>;
    const title = menu.some(item => item.name === screen) ? <StaffAppPageHeading title={screen} onBack={() => open('More')} /> : <div className="sa-page-title"><h1>{screen}</h1></div>;
    if (screen === 'Schedule') {
      const today = '2026-10-16';
      const selectedDate = new Date(scheduleDate + 'T12:00:00');
      const moveDate = (offset: number) => {
        const next = new Date(scheduleDate + 'T12:00:00');
        next.setDate(next.getDate() + offset);
        setScheduleDate(next.getFullYear() + '-' + String(next.getMonth() + 1).padStart(2, '0') + '-' + String(next.getDate()).padStart(2, '0'));
      };
      const datedJobs = scheduleDate === today ? jobs : scheduleDate === '2026-10-17' ? jobs.slice(1) : [];
      const dayJobs = scheduleFilter === 'done' ? datedJobs.filter(item => ['Done', 'Completed'].includes(jobStatuses[item.id] || item.status)) : datedJobs;
      const dayActivities = scheduleFilter === 'all' && scheduleDate === today ? activities : [];
      const countLabel = (count: number, name: string) => count + ' ' + name + (count === 1 ? '' : 's');
      const summary = [countLabel(dayJobs.length, 'job'), countLabel(dayActivities.filter(item => item.kind === 'appointment').length, 'appointment'), countLabel(dayActivities.filter(item => item.kind === 'task').length, 'task')].join(', ');
      const minutes = (time: string) => {
        const match = time.match(/(\d+):(\d+)/);
        if (!match) return 0;
        const hour = Number(match[1]);
        return (hour % 12 + (/PM/i.test(time) ? 12 : 0)) * 60 + Number(match[2]);
      };
      const entries = [
        ...dayJobs.map(item => ({ id: item.id, kind: 'job', time: item.time, order: minutes(item.time), item })),
        ...dayActivities.map(item => ({ id: item.id, kind: item.kind, time: item.time + ' ' + item.period, order: minutes(item.time + ' ' + item.period), item })),
      ].sort((a, b) => a.order - b.order);
      return <>{title}
        <section className="sa-date-navigator" aria-label="Schedule date navigation">
          <button type="button" aria-label="Previous day" onClick={() => moveDate(-1)}><ChevronLeft size={20} /></button>
          <div><button type="button" className="sa-month-picker-trigger" aria-haspopup="dialog" aria-label="Choose schedule date" onClick={() => { setMonthPickerYear(selectedDate.getFullYear()); setPickerMonth(selectedDate.getMonth()); monthDialog.current?.showModal(); }}><strong>{scheduleDate === today ? 'Today, ' : ''}{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} <span aria-hidden="true">▾</span></strong><span>{summary}</span></button></div>
          <button type="button" aria-label="Next day" onClick={() => moveDate(1)}><ChevronRight size={20} /></button>
        </section>
        {scheduleFilter !== 'all' && <div className="sa-timeline-filter"><span>{scheduleFilter === 'done' ? 'Completed jobs (Done)' : 'Jobs only'}</span><button className="sa-text-button" onClick={() => setScheduleFilter('all')}>Show all events</button></div>}
        <dialog ref={monthDialog} className="sa-status-dialog sa-month-picker" aria-label="Choose schedule date" onClick={event => { if (event.target === event.currentTarget) monthDialog.current?.close(); }}>
          <div className="sa-status-title"><button type="button" className="sa-text-button sa-picker-today" aria-label="Go to today" onClick={() => { setScheduleDate(today); monthDialog.current?.close(); }}><CalendarDays size={16} aria-hidden="true" />Today</button><button type="button" aria-label="Close date picker" onClick={() => monthDialog.current?.close()}><X size={18} /></button></div>
          {pickerMonth === null ? <>
          <div className="sa-month-picker-year">
            <button type="button" aria-label="Previous year" onClick={() => setMonthPickerYear(year => year - 1)}><ChevronLeft size={20} /></button>
            <strong aria-live="polite">{monthPickerYear}</strong>
            <button type="button" aria-label="Next year" onClick={() => setMonthPickerYear(year => year + 1)}><ChevronRight size={20} /></button>
          </div>
          <div className="sa-month-picker-grid">{Array.from({ length: 12 }, (_, month) => {
            const name = new Date(2026, month, 1).toLocaleDateString('en-US', { month: 'short' });
            return <button type="button" key={month} aria-label={`${name} ${monthPickerYear}`} aria-pressed={selectedDate.getMonth() === month && selectedDate.getFullYear() === monthPickerYear} onClick={() => setPickerMonth(month)}>{name}</button>;
          })}</div>
          </> : <>
            <button type="button" className="sa-day-picker-month" onClick={() => setPickerMonth(null)}>{new Date(monthPickerYear, pickerMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}<ChevronDown size={18} aria-hidden="true" /></button>
            <div className="sa-day-picker-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <span key={day}>{day}</span>)}
              {Array.from({ length: new Date(monthPickerYear, pickerMonth, 1).getDay() }, (_, index) => <span key={`blank-${index}`} />)}
              {Array.from({ length: new Date(monthPickerYear, pickerMonth + 1, 0).getDate() }, (_, index) => {
                const day = index + 1;
                const date = `${monthPickerYear}-${String(pickerMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                return <button type="button" key={day} aria-label={new Date(monthPickerYear, pickerMonth, day).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} aria-pressed={date === scheduleDate} aria-current={date === today ? 'date' : undefined} onClick={() => { setScheduleDate(date); monthDialog.current?.close(); }}>{day}</button>;
              })}
            </div>
          </>}
        </dialog>
        {scheduleDate !== today && <button className="sa-text-button" onClick={() => setScheduleDate(today)}>Back to today</button>}
        <div className={`sa-timeline ${USE_COLORED_TIMELINE ? 'sa-timeline-colored' : ''}`}>{entries.map(entry => <section className="sa-timeline-entry" key={entry.id}>
          <div className="sa-timeline-time">{entry.time.split(/\s*[–-]\s*/)[0]}<i className={'sa-timeline-dot sa-timeline-dot-' + entry.kind} /></div>
          <div className={`sa-timeline-card sa-timeline-card-${entry.kind}`}><div className="sa-timeline-heading"><div className="sa-timeline-kind">{entry.kind === 'job' ? <Briefcase size={13} /> : entry.kind === 'appointment' ? <Handshake size={13} /> : <Check size={13} />}{entry.kind === 'job' ? 'Job' : entry.kind === 'appointment' ? 'Appointment' : 'Task'}{entry.kind === 'job' && (entry.item as typeof jobs[number]).systemTags.includes('SPV') && <StaffAppServicePlanIcon />}</div>{entry.kind === 'job' ? <StatusLabel status={jobStatuses[entry.id] || (entry.item as typeof jobs[number]).status} /> : <button type="button" className="sa-timeline-status-button" aria-label={'Update status for ' + (entry.item as typeof activities[number]).title} onClick={() => { setSelectedActivity(entry.item as typeof activities[number]); setDraftStatus(activityStatus[entry.id] || 'Scheduled'); setStatusOpen(true); statusDialog.current?.showModal(); }}><StatusLabel status={activityStatus[entry.id] || 'Scheduled'} /></button>}</div>{entry.kind === 'job' ? jobCard(entry.item as typeof jobs[number]) : activityRows(entry.kind, entry.id)}</div>
        </section>)}</div>
        {!entries.length && <Card title="Your day is clear" icon={<CalendarDays size={17} />}><p className="sa-muted">{scheduleFilter === 'done' ? 'No completed jobs for this date.' : scheduleFilter === 'jobs' ? 'No jobs scheduled for this date.' : 'No jobs, tasks, or appointments scheduled for this date.'}</p></Card>}
      </>;
    }
    if (screen === 'Clients') return <>{title}{search('Search clients')}{filteredJobs.map(item => <button key={item.id} className="sa-menu-item" onClick={() => { setJobId(null); setProfileParams({ client: item.id }); }}><span className="sa-client-avatar">{item.client.split(' ').map(name => name[0]).join('')}</span><div><h3>{item.client}</h3><p>{item.address}</p></div><ChevronRight size={18} /></button>)}</>;
    if (screen === 'Notifications') return <>{title}<button className="sa-text-button sa-back" onClick={() => setRead(true)}>{read ? 'All caught up' : 'Mark all as read'}<Check size={15} /></button>{['Your schedule for today is ready', 'Estimate E-104 was approved', 'Copper elbow stock is running low'].map((text, index) => <button className="sa-menu-item" key={text} onClick={() => open(['Schedule', 'Estimates', 'Inventory'][index])}><span className="sa-menu-icon"><Bell size={20} /></span><div><h3>{text}</h3><p>{index + 1} hour{index ? 's' : ''} ago</p></div>{!read && <span className="sa-dot" />}</button>)}</>;
    if (screen === 'Tasks') return <>{title}<Card title="Today’s Tasks" icon={<Check size={17} />}>{activityRows('task')}</Card></>;
    if (screen === 'Inventory') {
      const items = inventoryItems;
      const visible = items.filter(item => [item.name, item.sku, item.category, item.brand].join(' ').toLowerCase().includes(query.toLowerCase()) && (inventoryFilters.type === 'all' || item.type === inventoryFilters.type) && (inventoryFilters.stock === 'all' || item.stock !== null && (inventoryFilters.stock === 'low' ? item.stock > 0 && item.stock < item.minimum : inventoryFilters.stock === 'out' ? item.stock === 0 : item.stock >= item.minimum && item.stock > 0))).sort((a,b) => inventoryFilters.sort === 'price-high' ? b.price - a.price : inventoryFilters.sort === 'price-low' ? a.price - b.price : inventoryFilters.sort === 'name-desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
      const active = inventoryFilters.type !== 'all' || inventoryFilters.stock !== 'all' || inventoryFilters.sort !== 'name';
      return <>{title}<div className="sa-search-with-filter">{search('Search parts and services')}<button type="button" className={`sa-filter-trigger ${active ? 'active' : ''}`} aria-label="Filter and sort inventory" aria-haspopup="dialog" onClick={() => { setFilterOpen(true); filterDialog.current?.showModal(); }}><ListFilter size={19} />{active && <i />}</button></div>
        {visible.map(item => <Card title={`${item.name} - ${item.sku}`} icon={<Package size={17} />} key={item.sku} action={item.stock !== null ? <span className={`sa-stock-label sa-stock-${item.stock === 0 ? 'out' : item.stock < item.minimum ? 'low' : 'good'}`}>{item.stock === 0 ? 'Out' : item.stock < item.minimum ? 'Low' : 'Good'}</span> : undefined}><div className="sa-list-row"><p className="sa-muted">{item.stock === null ? 'Service' : item.stock + ' in stock - Minimum ' + item.minimum}</p><strong>{item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</strong></div></Card>)}{!visible.length && <p className="sa-muted">No inventory items match these filters.</p>}
        <dialog ref={filterDialog} className="sa-status-dialog sa-list-filter-dialog" aria-labelledby="sa-inventory-filter-title" onClose={() => setFilterOpen(false)} onClick={event => { if (event.target === event.currentTarget) filterDialog.current?.close(); }}><div className="sa-status-title"><h2 id="sa-inventory-filter-title">Filter &amp; Sort</h2><button type="button" aria-label="Close filters" onClick={() => filterDialog.current?.close()}><X size={18} /></button></div><form key={String(filterOpen)} onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); setInventoryFilters({ type: String(data.get('type')), stock: String(data.get('stock')), sort: String(data.get('sort')) }); filterDialog.current?.close(); }}>
          <label className="sa-filter-field">Item type<select name="type" defaultValue={inventoryFilters.type}><option value="all">All Items</option><option value="part">Parts</option><option value="service">Services</option></select></label>
          <label className="sa-filter-field">Stock level<select name="stock" defaultValue={inventoryFilters.stock}><option value="all">All Stock Levels</option><option value="low">Low</option><option value="out">Out</option><option value="good">Good</option></select></label>
          <label className="sa-filter-field">Sort by<select name="sort" defaultValue={inventoryFilters.sort}><option value="name">Name (A-Z)</option><option value="name-desc">Name (Z-A)</option><option value="price-low">Price: Low to high</option><option value="price-high">Price: High to low</option></select></label>
          <div className="sa-button-row"><button type="button" className="sa-filter-reset" onClick={() => { setInventoryFilters({ type: 'all', stock: 'all', sort: 'name' }); filterDialog.current?.close(); }}>Reset</button><button type="submit" className="sa-primary">Apply</button></div>
        </form></dialog></>;
    }
    if (['Jobs', 'Estimates', 'Invoices', 'Past Jobs', 'Future Jobs'].includes(screen)) {
      const isJobs = screen !== 'Estimates' && screen !== 'Invoices';
      const documentScreen = screen === 'Invoices' ? 'Invoices' : 'Estimates';
      const type = screen === 'Estimates' ? 'Estimate' : 'Invoice';
      const filters = isJobs ? { period: jobsPeriod, status: jobsStatus } : documentFilters[documentScreen];
      const statuses = isJobs ? ['Scheduled', 'Deposit Collected', 'In Progress', 'Done', 'Cancelled', 'Lost', 'Estimate Declined'] : type === 'Estimate' ? ['Unsent', 'Pending', 'Approved', 'Declined'] : ['Due', 'Unpaid', 'Paid', 'Refunded'];
      const records = jobs.map((item, index) => ({ ...item, listStatus: isJobs ? (jobStatuses[item.id] || item.status).replace('Completed', 'Done') : type === 'Estimate' ? index === 0 ? 'Approved' : 'Pending' : index === 0 ? 'Paid' : 'Due', amount: [4500, 325, 150][index] || 0 }));
      const sort = listSort[screen] || 'newest';
      const visible = records.filter(item => (item.client + ' ' + item.id + ' ' + item.service).toLowerCase().includes(query.toLowerCase()) && (!filters.status || item.listStatus === filters.status) && matchesTimePeriod(item.scheduledDate, filters.period)).sort((a,b) => sort === 'customer' ? a.client.localeCompare(b.client) : sort === 'amount-high' ? b.amount - a.amount : sort === 'amount-low' ? a.amount - b.amount : sort === 'oldest' ? (a.scheduledDate || '').localeCompare(b.scheduledDate || '') || a.id.localeCompare(b.id) : (b.scheduledDate || '').localeCompare(a.scheduledDate || '') || b.id.localeCompare(a.id));
      const activeFilters = filters.period !== 'all-time' || Boolean(filters.status) || sort !== 'newest';
      return <><div className="sa-page-title"><h1>My Jobs</h1></div><StaffAppTabs tabs={['All Jobs', 'Estimates', 'Invoices']} value={isJobs ? 'All Jobs' : screen} onChange={name => open(name === 'All Jobs' ? 'Jobs' : name)} label="Jobs sections" />
        <div className="sa-search-with-filter">{search(isJobs ? 'Search jobs' : 'Search ' + screen.toLowerCase())}<button type="button" className={`sa-filter-trigger ${activeFilters ? 'active' : ''}`} aria-label="Filter and sort" aria-haspopup="dialog" onClick={() => { setFilterOpen(true); filterDialog.current?.showModal(); }}><ListFilter size={19} />{activeFilters && <i />}</button></div>
        {isJobs ? visible.map(jobCard) : visible.map(item => <div className="sa-document-card" key={item.id}><Card title={`${type === 'Estimate' ? 'E' : 'I'}-${item.id.slice(2)}`} icon={<FileText size={17} />} action={<StatusLabel status={item.listStatus} />}><h3>{item.client}</h3><p className="sa-muted">{item.service}</p><button type="button" className="sa-document-card-link" aria-label={`Open ${item.id} ${type.toLowerCase()} tab`} onClick={() => setJobId(item.id)} /><div className="sa-list-row"><strong>{item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</strong><button type="button" className="sa-text-button sa-document-view" onClick={() => setDocumentPreview(type)}>View {type}<ChevronRight size={15} /></button></div></Card></div>)}
        {!visible.length && <p className="sa-muted">No {isJobs ? 'jobs' : screen.toLowerCase()} match these filters.</p>}
        <dialog ref={filterDialog} className="sa-status-dialog sa-list-filter-dialog" aria-labelledby="sa-filter-title" onClose={() => setFilterOpen(false)} onClick={event => { if (event.target === event.currentTarget) filterDialog.current?.close(); }}>
          <div className="sa-status-title"><h2 id="sa-filter-title">Filter &amp; Sort</h2><button type="button" aria-label="Close filters" onClick={() => filterDialog.current?.close()}><X size={18} /></button></div>
          <form key={screen + '-' + filterOpen} onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); const period = String(data.get('period')); const status = String(data.get('status')); if (isJobs) { setJobsPeriod(period); setJobsStatus(status); } else setDocumentFilters(current => ({ ...current, [documentScreen]: { period, status } })); setListSort(current => ({ ...current, [screen]: String(data.get('sort')) })); filterDialog.current?.close(); }}>
            <label className="sa-filter-field">Time period<select name="period" defaultValue={filters.period}>{[['all-time', 'All Time'], ['today', 'Today'], ['last-7-days', 'Last 7 Days'], ['current-month', 'Current Month'], ['last-month', 'Last Month'], ['last-3-months', 'Last 3 Months'], ['current-year', 'Current Year']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="sa-filter-field">Status<select name="status" defaultValue={filters.status}><option value="">All Status</option>{statuses.map(status => <option key={status}>{status}</option>)}</select></label>
            <label className="sa-filter-field">Sort by<select name="sort" defaultValue={sort}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="customer">Customer name (A-Z)</option>{!isJobs && <><option value="amount-high">Amount: High to low</option><option value="amount-low">Amount: Low to high</option></>}</select></label>
            <div className="sa-button-row"><button type="button" className="sa-filter-reset" onClick={() => { if (isJobs) { setJobsPeriod('all-time'); setJobsStatus(''); } else setDocumentFilters(current => ({ ...current, [documentScreen]: { period: 'all-time', status: '' } })); setListSort(current => ({ ...current, [screen]: 'newest' })); filterDialog.current?.close(); }}>Reset</button><button type="submit" className="sa-primary">Apply</button></div>
          </form>
        </dialog>
      </>;
    }
    if (screen === 'Klervo AI') return <StaffAppAI onBack={() => open('More')} />;
    if (screen === 'Settings') return <StaffAppSettings onBack={() => open('More')} />;
    return <>{title}<Card title="How can we help?">{['How do I start a job?', 'Where can I find estimates?', 'How do I check inventory?'].map((text, index) => <details className="sa-help" key={text}><summary>{text}</summary><p>{['Open a job from Dashboard, Schedule, or Jobs, then tap Start job.', 'Open More, then Estimates. You can also open estimates inside a job.', 'Open More, then Inventory to search parts and services.'][index]}</p></details>)}</Card></>;
  }

  return <div className="sa-preview"><aside className="sa-preview-info"><Link to="/"><ArrowLeft size={16} />User Role Views</Link><div className="sa-preview-label"><Smartphone size={16} />STAFF MOBILE EXPERIENCE</div><h1>Your workday.<br />In your pocket.</h1><p>A mobile mockup for Klervo staff, inspired by your staging dashboard.</p><div className="sa-preview-tags"><span>iOS</span><span>Android</span><span>Interactive preview</span></div><div className="sa-preview-tip"><span>EXPLORE THE APP</span><p>Use the bottom tabs to browse. Open a job, update a task, or explore Inventory and Notifications in More.</p></div><small>UI/UX reference · Sample data</small></aside><div className={`sa-device ${screen === 'Dashboard' && !jobId ? 'sa-device-home' : ''}`}><div className="sa-status-bar"><span>9:41</span><div className="sa-camera" /><span aria-label="Full signal and battery">▮▮▮ ◒ ▰</span></div><dialog ref={statusDialog} onClose={() => setStatusOpen(false)} className="sa-status-dialog" aria-labelledby="sa-status-title" onClick={event => { if (event.target === event.currentTarget) statusDialog.current?.close(); }}>
    <form method="dialog" onSubmit={() => { if (selectedActivity) setActivityStatus(current => ({ ...current, [selectedActivity.id]: draftStatus })); }}>
      <div className="sa-status-title"><div><p>{selectedActivity?.kind === 'appointment' ? 'APPOINTMENT' : 'TASK'}</p><h2 id="sa-status-title">Update status</h2></div><button type="button" aria-label="Close status popup" onClick={() => statusDialog.current?.close()}><X size={20} /></button></div>
      <p className="sa-status-item-name">{selectedActivity?.title}</p>
      <label className="sa-status-field" htmlFor="sa-activity-status">Status</label>
      <div className={`sa-status-select sa-status-${draftStatus.toLowerCase()}`}><i /><select autoFocus id="sa-activity-status" value={draftStatus} onChange={event => setDraftStatus(event.target.value as ActivityStatus)}>{activityStatuses.map(status => <option key={status}>{status}</option>)}</select></div>
      <div className="sa-button-row"><button type="button" className="sa-secondary" onClick={() => statusDialog.current?.close()}>Cancel</button><button className="sa-primary" type="submit">Save status</button></div>
    </form>
  </dialog><dialog ref={addDialog} className="sa-status-dialog sa-add-dialog" aria-labelledby="sa-add-title" onClose={() => { setAddOpen(false); setAddType(null); }} onClick={event => { if (event.target === event.currentTarget) addDialog.current?.close(); }}>
    <div className="sa-status-title"><h2 id="sa-add-title">{addType ? 'Add ' + addType : 'Add New'}</h2><button type="button" aria-label="Close Add New" onClick={() => addDialog.current?.close()}><X size={20} /></button></div>
    {!addType ? <div className="sa-add-options">{[{ name: 'Job' as const, icon: Briefcase, description: 'Schedule work for a customer' }, { name: 'Task' as const, icon: Check, description: 'Add something to your to-do list' }, { name: 'Appointment' as const, icon: Handshake, description: 'Plan a meeting or a call' }, { name: 'Client' as const, icon: Users, description: 'Add a new customer to Klervo' }].map(({ name, icon: Icon, description }) => <button className="sa-menu-item" key={name} onClick={() => setAddType(name)}><span className="sa-menu-icon"><Icon size={21} /></span><div><h3>Add {name}</h3><p>{description}</p></div><ChevronRight size={17} /></button>)}</div> : <div className="sa-add-form"><p>Implement same fields as in the browser.</p><div className="sa-button-row"><button type="button" className="sa-secondary" onClick={() => setAddType(null)}>Back</button><button type="button" className="sa-primary" onClick={() => addDialog.current?.close()}>OK</button></div></div>}
  </dialog>
  {!jobId && !profileParams.get('client') && !statusOpen && !addOpen && !filterOpen && ['Dashboard', 'Schedule', 'Jobs', 'Past Jobs', 'Future Jobs', 'Clients'].includes(screen) && <button className="sa-fab" aria-label="Add New" aria-haspopup="dialog" onClick={() => { setAddType(null); setAddOpen(true); addDialog.current?.showModal(); }}><Plus size={27} /></button>}<StaffAppDocumentPreview type={documentPreview} onClose={() => setDocumentPreview(null)} /><main className="sa-content" key={`${screen}-${jobId || ''}`}>{pageHeader}{content()}</main><nav className="sa-bottom-nav" aria-label="Staff app navigation">{[{ name: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard }, { name: 'Schedule', label: 'Schedule', icon: CalendarDays }, { name: 'Jobs', label: 'Jobs', icon: Briefcase }, { name: 'Clients', label: 'Clients', icon: Users }, { name: 'More', label: 'More', icon: MoreHorizontal }].map(({ name, label, icon: Icon }) => <button key={name} aria-current={(screen === name || (name === 'Jobs' && ['Estimates', 'Invoices'].includes(screen)) || (name === 'More' && menu.some(item => item.name === screen))) ? 'page' : undefined} onClick={() => open(name)}><Icon size={21} /><span>{label}</span></button>)}</nav><div className="sa-home-indicator"><span /></div></div></div>;
}
