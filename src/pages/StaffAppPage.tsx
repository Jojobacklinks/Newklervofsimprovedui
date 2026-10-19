import { StaffAppClientProfile } from '../components/StaffAppClientProfile';
import { StaffAppJobDetails } from '../components/StaffAppJobDetails';
import { useState, useRef, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ArrowLeft, ChevronLeft, ArrowUpRight, Bell, CalendarDays, Check, ChevronRight, ClipboardList, Clock, FileText, HelpCircle, Handshake, LayoutDashboard, MapPin, MoreHorizontal, Package, Phone, Navigation, UserRound, Search, Settings, ShieldCheck, Smartphone, Sparkles, Tag, Users, Briefcase, Wrench, Plus, X } from 'lucide-react';
import './StaffAppPage.css';

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
  { id: 'J-106', client: 'Sarah Williams', service: 'Kitchen drain repair', address: '120 Oak Avenue, Austin, TX', time: '12:00 – 2:00 PM', status: 'Scheduled', systemTags: [], customTags: ["Urgent"] },
  { id: 'J-108', client: 'David Miller', service: 'Annual plumbing inspection', address: '86 Cedar Street, Austin, TX', time: '3:00 – 4:00 PM', status: 'Scheduled', systemTags: ["SPV"], customTags: ["Quick"] },
];
const menu = [
  { name: 'Notifications', icon: Bell, detail: 'Updates that need your attention' },
  { name: 'Service Plans', icon: ShieldCheck, detail: 'Memberships and recurring visits' },
  { name: 'Estimates', icon: FileText, detail: 'Quotes and customer approvals' },
  { name: 'Invoices', icon: ClipboardList, detail: 'Payments and outstanding balances' },
  { name: 'Inventory', icon: Package, detail: 'Parts, services and stock levels' },
  { name: 'Klervo AI', icon: Sparkles, detail: 'Your assistant in the field' },
  { name: 'Settings', icon: Settings, detail: 'Your profile and preferences' },
  { name: 'Help', icon: HelpCircle, detail: 'Help when you need it' },
];

function StatusLabel({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Scheduled: '#0698c6', 'In Progress': '#28bdf2', 'Deposit Collected': '#9473ff',
    Done: '#b9df10', Completed: '#b9df10', Active: '#b9df10', Approved: '#b9df10', Paid: '#b9df10',
    Pending: '#28bdf2', Due: '#f59e0b', Unpaid: '#f16a6a', Overdue: '#ed5293',
    Canceled: '#f16a6a', Cancelled: '#f16a6a', Lost: '#9ca3af', 'Estimate Declined': '#f16a6a', Declined: '#f16a6a', Refunded: '#9473ff',
  };
  return <span className="sa-status-label"><i aria-hidden="true" style={{ backgroundColor: colors[status] || '#9ca3af' }} />{status}</span>;
}

function JobTags({ job }: { job: typeof jobs[number] }) {
  return <div className="sa-job-tags" aria-label="Job tags">
    {job.systemTags.map(tag => <span key={tag} className="sa-system-tag">{tag}</span>)}
    {job.customTags.map(tag => <span key={tag} className="sa-custom-tag">{tag}</span>)}
  </div>;
}

function Card({ title, icon, children, action }: { title: string; icon?: ReactNode; children: ReactNode; action?: ReactNode }) {
  return <section className="sa-card"><div className="sa-card-heading"><h2>{icon}{title}</h2>{action}</div>{children}</section>;
}

const initialJobs = jobs;
const initialActivities = activities;

export function StaffAppPage() {
  const [profileParams, setProfileParams] = useSearchParams();
  const [jobs] = useState(initialJobs);
  const [activities] = useState(initialActivities);
  const addDialog = useRef<HTMLDialogElement>(null);
  const [addType, setAddType] = useState<'Job' | 'Task' | 'Appointment' | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [screen, setScreen] = useState('Dashboard');
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatuses, setJobStatuses] = useState<Record<string, string>>({});
  const [query, setQuery] = useState('');
  const [jobsPeriod, setJobsPeriod] = useState('all-time');
  const [jobsStatus, setJobsStatus] = useState('');
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
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const open = (next: string) => { setProfileParams({}); setScheduleFilter('all'); setScreen(next); setJobId(null); setQuery(''); setNotice(''); };
  const job = jobs.find(item => item.id === jobId);
  const filteredJobs = jobs.filter(item => `${item.id} ${item.client} ${item.service}`.toLowerCase().includes(query.toLowerCase()));
  const viewAll = (destination: string) => <button className="sa-text-button" onClick={() => {
    if (destination === 'Past Jobs' || destination === 'Future Jobs') {
      open('Schedule');
      setScheduleDate(destination === 'Past Jobs' ? '2026-10-16' : '2026-10-17');
      setScheduleFilter(destination === 'Past Jobs' ? 'done' : 'jobs');
    } else open(destination);
  }}>View all <ArrowUpRight size={13} /></button>;
  const jobCard = (item: typeof jobs[number]) => <button key={item.id} className="sa-job" onClick={() => setJobId(item.id)}><div className="sa-job-top"><span>{item.id}</span><StatusLabel status={jobStatuses[item.id] || item.status} /></div><h3>{item.service}</h3><p>{item.client} <span>· {item.time}</span></p><div className="sa-job-address"><MapPin size={13} />{item.address}<ChevronRight size={16} /></div><JobTags job={item} /></button>;
  const search = (placeholder: string) => <label className="sa-search"><Search size={18} /><input aria-label={placeholder} placeholder={placeholder} value={query} onChange={event => setQuery(event.target.value)} /></label>;
  const pageHeader = <header className="sa-page-header"><div className="sa-home-greeting">
        <div><p>Thursday, October 15</p><h1>Hi, Paonda</h1></div>
        <div className="sa-home-controls">
          <button className="sa-home-notification" aria-label="Notifications" onClick={() => open('Notifications')}><Bell size={23} />{!read && <span>3</span>}</button>
          <button className="sa-home-profile" aria-label="Your profile" onClick={() => open('More')}>PP</button>
        </div>
      </div></header>;
  const dashboard = <>
    <section className="sa-home-top">
      <div className="sa-home-up-next">
        <div className="sa-home-next-heading"><p>Up next, starts in 45 min</p></div>
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
    <Card title="Low Inventory Items" icon={<Package size={17} />} action={viewAll('Inventory')}><button className="sa-list-row" onClick={() => open('Inventory')}><div><h3>Copper elbow</h3><p>Minimum stock: 10</p></div><span className="sa-warning">4 left</span></button></Card>
    <p className="sa-sample-note">Sample data for the mobile UI/UX preview.</p>
  </>;

  function content() {
    const profileJob = jobs.find(item => item.id === profileParams.get('client'));
    if (profileJob) return <StaffAppClientProfile key={profileJob.client} clientJob={profileJob} jobs={jobs} backLabel={jobId ? 'Back to job' : 'Back to clients'} onBack={() => setProfileParams({})} onJob={id => { setProfileParams({}); setJobId(id); }} renderStatus={status => <StatusLabel status={status} />} />;

    if (job && USE_NEW_JOB_DETAILS) return <StaffAppJobDetails key={job.id} job={job} status={jobStatuses[job.id] || job.status} onStatusChange={status => setJobStatuses(current => ({ ...current, [job.id]: status }))} onBack={() => setJobId(null)} renderStatus={status => <StatusLabel status={status} />} renderTags={() => <JobTags job={job} />} />;
    if (job) return <><button className="sa-text-button sa-back" onClick={() => setJobId(null)}><ArrowLeft size={16} />Back</button><div className="sa-page-title"><span>{job.id}</span><h1>{job.service}</h1><p>{jobStatuses[job.id] || job.status} · {job.time}</p></div><Card title="Client & location" icon={<Users size={17} />}><h3>{job.client}</h3><p className="sa-muted">{job.address}</p><div className="sa-button-row"><a className="sa-secondary" href="tel:+15125550104"><Phone size={15} />Call</a><a className="sa-secondary" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`} target="_blank" rel="noreferrer"><MapPin size={15} />Directions</a></div></Card><Card title="Visit checklist" icon={<ClipboardList size={17} />}>{['Review service requirements', 'Complete safety inspection', 'Test completed work'].map(text => <label className="sa-task" key={text}><input type="checkbox" checked={Boolean(checks[`${job.id}-${text}`])} onChange={event => setChecks({ ...checks, [`${job.id}-${text}`]: event.target.checked })} />{text}</label>)}</Card><Card title="Visit notes"><textarea aria-label="Visit notes" placeholder="Describe the work completed…" rows={4} /></Card><div className="sa-button-row"><button className="sa-secondary" onClick={() => open('Estimates')}>Estimates</button><button className="sa-secondary" onClick={() => open('Invoices')}>Invoices</button></div><button className="sa-primary sa-full" onClick={() => { const status = jobStatuses[job.id] || job.status; setJobStatuses({ ...jobStatuses, [job.id]: status === 'Scheduled' ? 'In Progress' : 'Completed' }); }}>{(jobStatuses[job.id] || job.status) === 'Scheduled' ? 'Start job' : (jobStatuses[job.id] || job.status) === 'Completed' ? 'Visit completed' : 'Complete visit'}</button></>;
    if (screen === 'Dashboard') return dashboard;
    if (screen === 'More') return <><div className="sa-profile"><div className="sa-avatar">PP</div><h1>Paonda Pulaor</h1><p>Staff member · KL Plumbing</p></div>{menu.map(({ name, icon: Icon, detail }) => <button className="sa-menu-item" key={name} onClick={() => open(name)}><span className="sa-menu-icon"><Icon size={21} /></span><div><h3>{name}</h3><p>{detail}</p></div>{name === 'Notifications' && !read && <span className="sa-unread">3</span>}<ChevronRight size={17} /></button>)}</>;
    const title = <>{menu.some(item => item.name === screen) && <button type="button" className="sa-text-button sa-back" onClick={() => open('More')}><ArrowLeft size={16} />Back to More</button>}<div className="sa-page-title"><h1>{screen}</h1></div></>;
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
          <div><strong>{scheduleDate === today ? 'Today, ' : ''}{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong><span>{summary}</span><input type="date" aria-label="Choose schedule date" value={scheduleDate} onChange={event => { if (event.target.value) setScheduleDate(event.target.value); }} /></div>
          <button type="button" aria-label="Next day" onClick={() => moveDate(1)}><ChevronRight size={20} /></button>
        </section>
        {scheduleFilter !== 'all' && <div className="sa-timeline-filter"><span>{scheduleFilter === 'done' ? 'Completed jobs (Done)' : 'Jobs only'}</span><button className="sa-text-button" onClick={() => setScheduleFilter('all')}>Show all events</button></div>}
        {scheduleDate !== today && <button className="sa-text-button" onClick={() => setScheduleDate(today)}>Back to today</button>}
        <div className={`sa-timeline ${USE_COLORED_TIMELINE ? 'sa-timeline-colored' : ''}`}>{entries.map(entry => <section className="sa-timeline-entry" key={entry.id}>
          <div className="sa-timeline-time">{entry.time.split(/\s*[–-]\s*/)[0]}<i className={'sa-timeline-dot sa-timeline-dot-' + entry.kind} /></div>
          <div className={`sa-timeline-card sa-timeline-card-${entry.kind}`}><div className="sa-timeline-heading"><div className="sa-timeline-kind">{entry.kind === 'job' ? <Briefcase size={13} /> : entry.kind === 'appointment' ? <Handshake size={13} /> : <Check size={13} />}{entry.kind === 'job' ? 'Job' : entry.kind === 'appointment' ? 'Appointment' : 'Task'}</div>{entry.kind === 'job' ? <StatusLabel status={jobStatuses[entry.id] || (entry.item as typeof jobs[number]).status} /> : <button type="button" className="sa-timeline-status-button" aria-label={'Update status for ' + (entry.item as typeof activities[number]).title} onClick={() => { setSelectedActivity(entry.item as typeof activities[number]); setDraftStatus(activityStatus[entry.id] || 'Scheduled'); setStatusOpen(true); statusDialog.current?.showModal(); }}><StatusLabel status={activityStatus[entry.id] || 'Scheduled'} /></button>}</div>{entry.kind === 'job' ? jobCard(entry.item as typeof jobs[number]) : activityRows(entry.kind, entry.id)}</div>
        </section>)}</div>
        {!entries.length && <Card title="Your day is clear" icon={<CalendarDays size={17} />}><p className="sa-muted">{scheduleFilter === 'done' ? 'No completed jobs for this date.' : scheduleFilter === 'jobs' ? 'No jobs scheduled for this date.' : 'No jobs, tasks, or appointments scheduled for this date.'}</p></Card>}
      </>;
    }
    if (['Jobs', 'Past Jobs', 'Future Jobs'].includes(screen)) {
      const todayParts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(new Date());
      const part = (name: string) => Number(todayParts.find(value => value.type === name)?.value);
      const today = new Date(part('year'), part('month') - 1, part('day'));
      const matchesPeriod = (value: string) => {
        if (jobsPeriod === 'all-time') return true;
        const date = new Date(value + 'T00:00:00');
        const end = new Date(today); end.setDate(end.getDate() + 1);
        let start = new Date(today);
        if (jobsPeriod === 'last-7-days') start.setDate(start.getDate() - 6);
        if (jobsPeriod === 'current-month') return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
        if (jobsPeriod === 'last-month') return date >= new Date(today.getFullYear(), today.getMonth() - 1, 1) && date < new Date(today.getFullYear(), today.getMonth(), 1);
        if (jobsPeriod === 'last-3-months') start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        if (jobsPeriod === 'current-year') return date.getFullYear() === today.getFullYear();
        return date >= start && date < end;
      };
      const visibleJobs = filteredJobs.filter(item => (!jobsStatus || (jobStatuses[item.id] || item.status).replace('Completed', 'Done') === jobsStatus) && matchesPeriod(item.scheduledDate));
      return <>{title}{search('Search jobs or clients')}<div className="sa-jobs-filters"><select aria-label="Job time period" value={jobsPeriod} onChange={event => setJobsPeriod(event.target.value)}>{[['all-time', 'All Time'], ['today', 'Today'], ['last-7-days', 'Last 7 Days'], ['current-month', 'Current Month'], ['last-month', 'Last Month'], ['last-3-months', 'Last 3 Months'], ['current-year', 'Current Year']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><select aria-label="Job status filter" value={jobsStatus} onChange={event => setJobsStatus(event.target.value)}><option value="">All Status</option>{['Scheduled', 'Deposit Collected', 'In Progress', 'Done', 'Cancelled', 'Lost', 'Estimate Declined'].map(status => <option key={status}>{status}</option>)}</select></div>{visibleJobs.map(jobCard)}{!visibleJobs.length && <p className="sa-muted">No jobs match these filters.</p>}</>;
    }
    if (screen === 'Clients') return <>{title}{search('Search clients')}{filteredJobs.map(item => <button key={item.id} className="sa-menu-item" onClick={() => { setJobId(null); setProfileParams({ client: item.id }); }}><span className="sa-client-avatar">{item.client.split(' ').map(name => name[0]).join('')}</span><div><h3>{item.client}</h3><p>{item.address}</p></div><ChevronRight size={18} /></button>)}</>;
    if (screen === 'Notifications') return <>{title}<button className="sa-text-button sa-back" onClick={() => setRead(true)}>{read ? 'All caught up' : 'Mark all as read'}<Check size={15} /></button>{['Your schedule for today is ready', 'Estimate E-104 was approved', 'Copper elbow stock is running low'].map((text, index) => <button className="sa-menu-item" key={text} onClick={() => open(['Schedule', 'Estimates', 'Inventory'][index])}><span className="sa-menu-icon"><Bell size={20} /></span><div><h3>{text}</h3><p>{index + 1} hour{index ? 's' : ''} ago</p></div>{!read && <span className="sa-dot" />}</button>)}</>;
    if (screen === 'Tasks') return <>{title}<Card title="Today’s Tasks" icon={<Check size={17} />}>{activityRows('task')}</Card></>;
    if (screen === 'Inventory') return <>{title}{search('Search parts and services')}{[['¾″ Copper elbow', '4 in stock · Minimum 10', '$8.50'], ['Water heater fittings kit', '12 in stock', '$45.00'], ['Drain cleaning', 'Service', '$150.00']].filter(row => row.join(' ').toLowerCase().includes(query.toLowerCase())).map(([name, detail, price]) => <Card title={name} icon={<Package size={17} />} key={name}><div className="sa-list-row"><p className="sa-muted">{detail}</p><strong>{price}</strong></div></Card>)}</>;
    if (['Estimates', 'Invoices', 'Service Plans'].includes(screen)) return <>{title}{search(`Search ${screen.toLowerCase()}`)}{jobs.filter(item => item.client.toLowerCase().includes(query.toLowerCase())).map((item, index) => <Card key={item.id} title={screen === 'Service Plans' ? 'Annual Home Care' : `${screen === 'Estimates' ? 'E' : 'I'}-${104 + index}`} icon={<FileText size={17} />} action={<StatusLabel status={screen === 'Service Plans' ? 'Active' : index === 0 ? 'Approved' : 'Pending'} />}><h3>{item.client}</h3><p className="sa-muted">{screen === 'Service Plans' ? '2 visits per year · Member discount 10%' : item.service}</p><div className="sa-list-row"><strong>{screen === 'Service Plans' ? '$249 / year' : ['$4,500.00', '$325.00', '$150.00'][index]}</strong><button className="sa-text-button" onClick={() => setJobId(item.id)}>View job<ChevronRight size={15} /></button></div></Card>)}</>;
    if (screen === 'Klervo AI') return <>{title}<div className="sa-ai-intro"><Sparkles size={34} /><h2>A little help for your day.</h2><p>Ask about your jobs, or get help drafting a visit note.</p></div>{messages.map((text, index) => <div className="sa-chat" key={index}><p>{text}</p><div><Sparkles size={16} /><p>This is a UI preview. In the connected app, Klervo AI will help with your request using your permitted staff information.</p></div></div>)}<form onSubmit={event => { event.preventDefault(); if (message.trim()) { setMessages([...messages, message]); setMessage(''); } }}><textarea aria-label="Message Klervo AI" value={message} onChange={event => setMessage(event.target.value)} placeholder="Ask Klervo AI…" rows={3} /><button className="sa-primary sa-full" disabled={!message.trim()}>Send message<ArrowUpRight size={16} /></button></form></>;
    if (screen === 'Settings') return <>{title}<Card title="Your profile"><label className="sa-field">Name<input defaultValue="Paonda Pulaor" /></label><label className="sa-field">Email<input type="email" defaultValue="paonda@example.com" /></label><button className="sa-primary sa-full" onClick={() => setNotice('Profile updated for this preview.')}>Save profile</button></Card><Card title="Preferences"><label className="sa-task"><input type="checkbox" defaultChecked />Job assignment notifications</label><label className="sa-task"><input type="checkbox" defaultChecked />Schedule reminders</label></Card>{notice && <p role="status" className="sa-muted">{notice}</p>}</>;
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
    {!addType ? <div className="sa-add-options">{[{ name: 'Job' as const, icon: Briefcase, description: 'Schedule work for a customer' }, { name: 'Task' as const, icon: Check, description: 'Add something to your to-do list' }, { name: 'Appointment' as const, icon: Handshake, description: 'Plan a meeting or a call' }].map(({ name, icon: Icon, description }) => <button className="sa-menu-item" key={name} onClick={() => setAddType(name)}><span className="sa-menu-icon"><Icon size={21} /></span><div><h3>Add {name}</h3><p>{description}</p></div><ChevronRight size={17} /></button>)}</div> : <div className="sa-add-form"><p>Implement same fields as in the browser.</p><div className="sa-button-row"><button type="button" className="sa-secondary" onClick={() => setAddType(null)}>Back</button><button type="button" className="sa-primary" onClick={() => addDialog.current?.close()}>OK</button></div></div>}
  </dialog>
  {!jobId && !statusOpen && !addOpen && ['Dashboard', 'Schedule', 'Jobs', 'Past Jobs', 'Future Jobs'].includes(screen) && <button className="sa-fab" aria-label="Add New" aria-haspopup="dialog" onClick={() => { setAddType(null); setAddOpen(true); addDialog.current?.showModal(); }}><Plus size={27} /></button>}<main className="sa-content" key={`${screen}-${jobId || ''}`}>{pageHeader}{content()}</main><nav className="sa-bottom-nav" aria-label="Staff app navigation">{[{ name: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard }, { name: 'Schedule', label: 'Schedule', icon: CalendarDays }, { name: 'Jobs', label: 'Jobs', icon: Briefcase }, { name: 'Clients', label: 'Clients', icon: Users }, { name: 'More', label: 'More', icon: MoreHorizontal }].map(({ name, label, icon: Icon }) => <button key={name} aria-current={(screen === name || (name === 'More' && menu.some(item => item.name === screen))) ? 'page' : undefined} onClick={() => open(name)}><Icon size={21} /><span>{label}</span></button>)}</nav><div className="sa-home-indicator"><span /></div></div></div>;
}
