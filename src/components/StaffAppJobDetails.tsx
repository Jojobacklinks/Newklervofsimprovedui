import { StaffAppJobInvoices } from './StaffAppJobInvoices';
import { StaffAppTabs } from './StaffAppTabs';
import { StaffAppDocumentPreview } from './StaffAppDocumentPreview';
import { StaffAppServicePlanIcon } from './StaffAppServicePlanIcon';
import { StaffAppPageHeading } from './StaffAppPageHeading';
import { Link } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, CalendarDays, Camera, Check, ChevronRight, ClipboardList, FileText, Mail, MapPin, Navigation, Package, Phone, Plus, Pencil, Sparkles, LockKeyhole, Logs, UserRound, Users, Wrench, X } from 'lucide-react';
import './StaffAppJobDetails.css';

type MobileJob = { id: string; service: string; client: string; address: string; time: string; systemTags: string[]; customTags: string[] };
const checklist = ['Review service requirements', 'Complete safety inspection', 'Test completed work'];

export function StaffAppJobDetails({ job, status, onStatusChange, onBack, renderStatus, renderTags, initialTab = 'Details' }: {
  initialTab?: 'Details' | 'Estimate' | 'Invoice';
  job: MobileJob; status: string; onStatusChange: (status: string) => void; onBack: () => void;
  renderStatus: (status: string) => React.ReactNode; renderTags: () => React.ReactNode;
}) {
  const [tab, setTab] = useState<string>(initialTab);
  const [documentPreview, setDocumentPreview] = useState<'Estimate' | 'Invoice' | null>(null);
  const [editing, setEditing] = useState<'details' | 'schedule' | null>(null);
  const [details, setDetails] = useState({ service: job.service, source: 'Existing customer', description: 'Review the customer requirements, inspect the service area, and confirm the work before starting.' });
  const [schedule, setSchedule] = useState({ date: '2026-10-16', arrival: job.time });
  const formattedDate = new Date(schedule.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const [checked, setChecked] = useState<string[]>([]);
  const [inventory, setInventory] = useState([{ id: 'service-1', name: job.service, quantity: 1, price: job.id === 'J-104' ? 4500 : job.id === 'J-106' ? 325 : 150, upsell: false }, { id: 'part-1', name: 'Water heater fittings kit', quantity: 1, price: 45, upsell: false }]);
  const inventoryTotal = inventory.reduce((total, item) => total + item.quantity * item.price, 0);
  const upsellTotal = inventory.filter(item => item.upsell).reduce((total, item) => total + item.quantity * item.price, 0);
  const money = (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const [notes, setNotes] = useState('');
  const [visitNote, setVisitNote] = useState('');
  const [visits, setVisits] = useState<Array<{ recordedAt: string; notes: string; checklist: string[]; photos: Array<{ name: string; url: string; kind: string }> }>>([]);
  const [durations, setDurations] = useState<Array<{ start: string; end: string }>>([{ start: '2026-10-16T09:00:00-05:00', end: '2026-10-16T10:30:00-05:00' }]);
  const startedAt = useRef<string | null>(null);
  const [viewVisit, setViewVisit] = useState<number | null>(null);
  useEffect(() => {
    if (status === 'In Progress' && !startedAt.current) startedAt.current = new Date().toISOString();
    if ((status === 'Done' || status === 'Completed') && startedAt.current) {
      const start = startedAt.current;
      startedAt.current = null;
      setDurations(current => [...current, { start, end: new Date().toISOString() }]);
    }
  }, [status]);
  const timestamp = (value: string) => new Date(value).toLocaleString('en-US');
  const durationLabel = (start: string, end: string) => {
    const minutes = Math.max(0, Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 60000));
    return Math.floor(minutes / 60) + 'h ' + (minutes % 60) + 'm';
  };
  const [photos, setPhotos] = useState<Array<{ name: string; url: string; kind: string }>>([]);
  const photoUrls = useRef<string[]>([]);
  const [popup, setPopup] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const complete = status === 'Done' || status === 'Completed';
  const jobStatusOptions = ['Scheduled', 'Deposit Collected', 'In Progress', 'Done', 'Cancelled', 'Lost', 'Estimate Declined'];
  const selectedStatus = status === 'Completed' ? 'Done' : status;
  useEffect(() => () => photoUrls.current.forEach(url => URL.revokeObjectURL(url)), []);
  const show = (name: string) => { setPopup(name); dialog.current?.showModal(); };
  const upload = (files: FileList | null, kind: string) => {
    if (!files) return;
    const remaining = 5 - photos.filter(photo => photo.kind === kind).length;
    const additions = Array.from(files).filter(file => file.type.startsWith('image/')).slice(0, remaining).map(file => {
      const url = URL.createObjectURL(file); photoUrls.current.push(url); return { name: file.name, url, kind };
    });
    setPhotos(current => [...current, ...additions]);
  };
  return <div className="sjd">
    <StaffAppPageHeading title="Job Details" backLabel="Back to jobs" onBack={onBack} />
    <div className="sjd-action-bar"><button className="sa-secondary" disabled={complete} onClick={() => { setVisitNote(''); show('Record visit'); }}>Record visit</button><button className="sa-primary" disabled={complete} onClick={() => status === 'Scheduled' ? onStatusChange('In Progress') : show('Complete visit')}>{complete ? <><Check size={15} />Completed</> : status === 'Scheduled' ? 'Start job' : 'Complete visit'}</button><p className="sjd-action-dev-note"><strong>Developer note:</strong> For a regular job, display only the job flow button. Show Record Visit for service plan jobs only.</p></div>
    <section className="sjd-hero">
      <div className="sjd-id-row"><span>{job.id}</span><div className="sjd-status-picker"><span className="sjd-status-dot">{renderStatus(selectedStatus)}</span><select aria-label="Job status" value={selectedStatus} onChange={event => onStatusChange(event.target.value)}>{jobStatusOptions.map(value => <option key={value}>{value}</option>)}</select></div></div>
      <h1><Link className="sjd-customer-link" to={'/staff-app?client=' + encodeURIComponent(job.id)}><UserRound size={18} aria-hidden="true" />{job.client}</Link></h1>
      <h2 className="sjd-summary-service">{details.service}</h2>
      <p><CalendarDays size={14} />{formattedDate} <span>&middot;</span> {schedule.arrival}</p>{renderTags()}
      <div className="sjd-contact"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`} target="_blank" rel="noreferrer"><Navigation size={16} />Navigate</a><a href="tel:+15125550104"><Phone size={16} />Call</a><a href={'mailto:' + job.client.toLowerCase().replace(/\s+/g, '.') + '@example.com'}><Mail size={16} />Email</a></div>
    </section>
    <StaffAppTabs tabs={['Details', 'Check List', 'Estimate', 'Invoice']} value={tab} onChange={setTab} label="Job details sections" sticky />
    {tab === 'Details' && <>
      <section className="sa-card"><div className="sa-card-heading"><h2><Users size={17} />Client Info</h2><span className="sjd-readonly"><LockKeyhole size={12} />Read only</span></div><dl className="sjd-facts"><div><dt>Client name</dt><dd>{job.client}</dd></div><div><dt>Phone</dt><dd><a href="tel:+15125550104">(512) 555-0104</a></dd></div><div><dt>Address</dt><dd>{job.address}</dd></div></dl></section>
      <section className="sa-card"><div className="sa-card-heading"><h2><Wrench size={17} />Job Details</h2><button className="sjd-edit sa-edit-icon" aria-label="Edit job details" disabled={complete} onClick={() => setEditing(editing === 'details' ? null : 'details')}><Pencil size={15} /></button></div>
        {editing === 'details' ? <form onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); const service = String(data.get('service') || '').trim(); if (!service) return; setDetails({ service, source: String(data.get('source') || '').trim(), description: String(data.get('description') || '').trim() }); setEditing(null); }}>
          <label className="sa-field">Job type / service<input name="service" required maxLength={120} defaultValue={details.service} /></label>
          <label className="sa-field">Job source<input name="source" required maxLength={100} defaultValue={details.source} /></label>
          <label className="sa-field">Job description<textarea name="description" rows={4} defaultValue={details.description} /></label>
          <div className="sa-button-row"><button type="button" className="sa-secondary" onClick={() => setEditing(null)}>Cancel</button><button type="submit" className="sa-primary">Save changes</button></div>
        </form> : <><dl className="sjd-facts"><div><dt>Job type</dt><dd>{details.service}</dd></div><div><dt>Job source</dt><dd>{details.source}</dd></div></dl><p className="sjd-description">{details.description || 'No description added.'}</p></>}
      </section>
      <section className="sa-card"><div className="sa-card-heading"><h2><CalendarDays size={17} />Scheduled (Arrival window)</h2><button className="sjd-edit sa-edit-icon" aria-label="Edit arrival window" disabled={complete} onClick={() => setEditing(editing === 'schedule' ? null : 'schedule')}><Pencil size={15} /></button></div>
        {editing === 'schedule' ? <form onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); const arrival = String(data.get('arrival') || '').trim(); if (!arrival) return; setSchedule({ date: String(data.get('date')), arrival }); setEditing(null); }}>
          <label className="sa-field">Scheduled date<input name="date" type="date" required defaultValue={schedule.date} /></label>
          <label className="sa-field">Arrival window<input name="arrival" required maxLength={60} defaultValue={schedule.arrival} placeholder="9:00 - 11:00 AM" /></label>
          <div className="sjd-location"><span><MapPin size={13} />Service location<LockKeyhole size={12} /></span><p>{job.address}</p></div>
          <div className="sa-button-row"><button type="button" className="sa-secondary" onClick={() => setEditing(null)}>Cancel</button><button type="submit" className="sa-primary">Save changes</button></div>
        </form> : <><dl className="sjd-facts"><div><dt>Date</dt><dd>{formattedDate}</dd></div><div><dt>Arrival window</dt><dd>{schedule.arrival}</dd></div></dl><div className="sjd-location"><span><MapPin size={13} />Service location<LockKeyhole size={12} /></span><p>{job.address}</p></div></>}
      </section>
      <section className="sa-card"><div className="sa-card-heading"><h2><Users size={17} />Assigned team</h2></div><div className="sjd-person"><span className="sa-avatar">PP</span><div><strong>Paonda Pulaor</strong><small>Technician · You</small></div></div></section>
      <section className="sa-card"><div className="sa-card-heading"><h2><FileText size={17} />Tech notes</h2><span className="sjd-internal">Internal only</span></div><p className="sjd-analyze-explanation">They are saved to the job record and used by AI Analysis to provide a second opinion (<strong>0/3</strong> analyses used).</p><textarea aria-label="Tech notes" rows={3} placeholder="Access instructions, findings, or follow-up…" value={notes} disabled={complete} onChange={event => setNotes(event.target.value)} /><p className="sjd-analyze-disclaimer">AI second opinions may be inaccurate or incomplete. Verify all suggestions using your professional judgment before taking action.</p><button type="button" className="sa-primary sa-full sjd-analyze-button" disabled={complete || !notes.trim()} onClick={() => show('Analyze technician notes')}><Sparkles size={15} />Analyze</button></section>
      <section className="sa-card"><div className="sa-card-heading"><h2><Camera size={17} />Before & after photos</h2></div><div className="sjd-photos">{['Before', 'After'].map(kind => <div key={kind}><h3>{kind} <span>{photos.filter(photo => photo.kind === kind).length}/5</span></h3><div className="sjd-photo-list">{photos.filter(photo => photo.kind === kind).map(photo => <img key={photo.url} src={photo.url} alt={`${kind}: ${photo.name}`} />)}</div><label className={`sjd-upload ${complete ? 'disabled' : ''}`}><Camera size={18} /><span>Add {kind.toLowerCase()} photos</span><input type="file" accept="image/*" multiple disabled={complete || photos.filter(photo => photo.kind === kind).length >= 5} onChange={event => { upload(event.target.files, kind); event.target.value = ''; }} /></label></div>)}</div></section>
      <section className="sa-card sjd-inventory"><div className="sa-card-heading"><h2><Package size={17} />Inventory Summary</h2></div><p className="sjd-inventory-caption">Items will be displayed here after an invoice is paid.</p><div className="sjd-inventory-table"><table><thead><tr><th scope="col">Item</th><th scope="col">Amount</th><th scope="col">Upsell</th></tr></thead><tbody>{inventory.map(item => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{money(item.quantity * item.price)}</td><td><input className="sjd-upsell-checkbox" type="checkbox" aria-label={'Mark ' + item.name + ' as upsell'} checked={item.upsell} disabled={complete} onChange={event => { const upsell = event.target.checked; setInventory(current => current.map(line => line.id === item.id ? { ...line, upsell } : line)); }} /></td></tr>)}</tbody></table></div></section>
      <section className="sa-card sjd-insights"><div className="sa-card-heading"><h2><Logs size={17} />Job Insights</h2>{job.systemTags.includes('SPV') && <StaffAppServicePlanIcon />}</div><div className="sjd-insights-body" tabIndex={0} role="region" aria-label="Job insights and visit history"><div className="sjd-insight-metric"><span>Total Cost:</span><strong>{money(inventoryTotal)}</strong></div><div className="sjd-insight-metric sjd-insight-upsell"><span>Total Upsell Amount:</span><strong>{money(upsellTotal)}</strong></div><div className="sjd-insight-metric sjd-insight-rating"><span>Rating:</span><span>Not rated yet</span></div><div className="sjd-insight-metric sjd-insight-total-duration"><span>Total Duration:</span><strong>{(() => { const minutes = durations.reduce((total, duration) => total + Math.max(0, Math.floor((new Date(duration.end).getTime() - new Date(duration.start).getTime()) / 60000)), 0); return Math.floor(minutes / 60) + 'h ' + (minutes % 60) + 'm'; })()}</strong></div><div className="sjd-duration-heading"><span>Job Durations</span><span>{durations.length + visits.length} visits</span></div>{visits.map((visit, index) => <div className="sjd-recorded-visit" key={index}><p>Recorded {timestamp(visit.recordedAt)}</p><button type="button" className="sa-text-button" onClick={() => { setViewVisit(index); show('View visit details'); }}>View visit details</button></div>)}{durations.map((duration, index) => <div className="sjd-duration" key={index}><div><strong>Visit {index + 1}</strong><span>{durationLabel(duration.start, duration.end)}</span></div><p>{timestamp(duration.start)}<br />{timestamp(duration.end)}</p></div>)}</div></section>
    </>}
    {tab === 'Check List' && <section className="sa-card"><div className="sa-card-heading"><h2><ClipboardList size={17} />Service checklist</h2><span className="sjd-internal">{checked.length} of 3</span></div><div className="sjd-check-progress"><span style={{ width: `${checked.length / 3 * 100}%` }} /></div>{checklist.map(text => <label className="sa-task" key={text}><input type="checkbox" disabled={complete} checked={checked.includes(text)} onChange={event => setChecked(current => event.target.checked ? [...current, text] : current.filter(item => item !== text))} /><span>{text}</span></label>)}</section>}
    <div hidden={tab !== 'Invoice'}><StaffAppJobInvoices key={job.id} job={job} complete={complete} /></div>
    {tab === 'Estimate' && <section className="sa-card"><div className="sa-card-heading"><h2><FileText size={17} />Job estimates</h2><button className="sjd-add-document" disabled={complete} onClick={() => show('Add estimate')}><Plus size={13} />Add</button></div><button className="sjd-document" onClick={() => setDocumentPreview('Estimate')}><span className="sjd-document-icon"><FileText size={23} /></span><div><strong>E-{job.id.slice(2)}</strong><small>{job.client} · Sample estimate</small></div>{renderStatus('Approved')}<ChevronRight size={15} /></button></section>}
    <p className="sa-sample-note">UI/UX preview · Changes are saved for this session.</p>
    <StaffAppDocumentPreview type={documentPreview} onClose={() => setDocumentPreview(null)} />
    <dialog ref={dialog} className="sa-status-dialog sjd-dialog" aria-labelledby="sjd-dialog-title"><div className="sa-status-title"><h2 id="sjd-dialog-title">{popup}</h2><button aria-label="Close" onClick={() => dialog.current?.close()}><X size={18} /></button></div>
      {popup === 'View visit details' && viewVisit !== null && visits[viewVisit] ? <div className="sjd-visit-detail"><p className="sa-muted">Recorded {timestamp(visits[viewVisit].recordedAt)}</p><h3>Visit notes</h3><p>{visits[viewVisit].notes}</p><h3>Checklist</h3>{visits[viewVisit].checklist.length ? visits[viewVisit].checklist.map(text => <p key={text}><Check size={12} />{text}</p>) : <p>No checklist items included.</p>}<h3>Photos</h3><div className="sjd-photo-list">{visits[viewVisit].photos.map(photo => <img key={photo.url} src={photo.url} alt={photo.kind + ': ' + photo.name} />)}</div>{!visits[viewVisit].photos.length && <p>No photos included.</p>}</div> : popup === 'Analyze technician notes' ? <><p className="sa-muted">Implement the same notes analysis as in the browser. This mockup does not run AI analysis.</p><button className="sa-primary sa-full" onClick={() => dialog.current?.close()}>OK</button></> : popup === 'Record visit' ? <form onSubmit={event => { event.preventDefault(); if (!visitNote.trim()) return; setVisits(current => [...current, { recordedAt: new Date().toISOString(), notes: visitNote.trim(), checklist: [...checked], photos: [...photos] }]); dialog.current?.close(); }}><p className="sa-muted">Customer-visible visit notes</p><textarea autoFocus required rows={4} aria-label="Visit notes" value={visitNote} onChange={event => setVisitNote(event.target.value)} placeholder="Describe the work completed…" /><p className="sa-muted">Includes {checked.length}/3 checklist items and {photos.length} photos. No email is sent in this preview.</p><button className="sa-primary sa-full">Save visit</button></form> : popup === 'Complete visit' ? <><p className="sa-muted">Finish this visit? The checklist is {checked.length}/3 complete. You can review it before completing.</p><div className="sa-button-row"><button className="sa-secondary" onClick={() => { setTab('Check List'); dialog.current?.close(); }}>Review</button><button className="sa-primary" onClick={() => { onStatusChange('Done'); dialog.current?.close(); }}>Complete</button></div></> : <><p className="sa-muted">Implement same fields as in the browser.</p><button className="sa-primary sa-full" onClick={() => dialog.current?.close()}>OK</button></>}
    </dialog>
  </div>;
}
