import { StaffAppPageHeading } from './StaffAppPageHeading';
import { useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, CalendarDays, ChevronRight, CreditCard, FileText, Mail, MapPin, Pencil, Phone, Plus, Search, ShieldCheck, UserRound, Navigation, Users, X } from 'lucide-react';
import './StaffAppServicePlans.css';

type Plan = {
  id: string; clientName: string; clientEmail: string; phone: string; propertyAddress: string;
  serviceName: string; serviceDescription: string; price: number; billingInterval: string; intervalCount: number;
  status: string; totalVisits: number; visitsUsed: number; createdAt: string; startDate: string;
  nextBillingDate: string; autoRenew: boolean; paymentMethod: string; memberDiscountValue: number;
  upsoldBy?: { name: string; type: string } | null;
};
const samples: Plan[] = [
  { id: 'S-101', clientName: 'Michael Chen', clientEmail: 'michael.chen@example.com', phone: '(512) 555-0104', propertyAddress: '567 Pine Road, Georgetown, TX', serviceName: 'Annual Home Care', serviceDescription: 'Preventive plumbing inspections and priority service.', price: 249, billingInterval: 'year', intervalCount: 1, status: 'active', totalVisits: 2, visitsUsed: 1, createdAt: '2026-02-05', startDate: '2026-02-05', nextBillingDate: '2027-02-05', autoRenew: true, paymentMethod: 'Visa ending in 4242', memberDiscountValue: 10, upsoldBy: { name: 'Paonda Pulaor', type: 'T' } },
  { id: 'S-102', clientName: 'Sarah Williams', clientEmail: 'sarah.williams@example.com', phone: '(512) 555-0106', propertyAddress: '120 Oak Avenue, Austin, TX', serviceName: 'Drain Protection Plan', serviceDescription: 'Routine drain maintenance with scheduled service visits.', price: 39, billingInterval: 'month', intervalCount: 1, status: 'approved', totalVisits: 4, visitsUsed: 0, createdAt: '2026-10-15', startDate: '2026-10-20', nextBillingDate: '', autoRenew: true, paymentMethod: 'Pending payment', memberDiscountValue: 10 },
  { id: 'S-103', clientName: 'David Miller', clientEmail: 'david.miller@example.com', phone: '(512) 555-0108', propertyAddress: '86 Cedar Street, Austin, TX', serviceName: 'Annual Home Care', serviceDescription: 'Preventive plumbing inspections and priority service.', price: 249, billingInterval: 'year', intervalCount: 1, status: 'pending', totalVisits: 2, visitsUsed: 0, createdAt: '2026-10-18', startDate: '2026-10-25', nextBillingDate: '', autoRenew: true, paymentMethod: 'Pending approval', memberDiscountValue: 10 },
  { id: 'S-104', clientName: 'Emma Wilson', clientEmail: 'emma.wilson@example.com', phone: '(512) 555-0109', propertyAddress: '24 Willow Lane, Austin, TX', serviceName: 'Seasonal HVAC Care', serviceDescription: 'Seasonal tune-ups and filter checks.', price: 199, billingInterval: 'year', intervalCount: 1, status: 'failed', totalVisits: 2, visitsUsed: 1, createdAt: '2026-03-01', startDate: '2026-03-01', nextBillingDate: '2026-10-18', autoRenew: true, paymentMethod: 'Card payment failed', memberDiscountValue: 10 },
];
const periodOptions = [['all-time', 'All Time'], ['today', 'Today'], ['last-7-days', 'Last 7 Days'], ['current-month', 'Current Month'], ['last-month', 'Last Month'], ['last-3-months', 'Last 3 Months'], ['current-year', 'Current Year']];
const money = (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const dateLabel = (value: string) => value ? new Date(value.includes('T') ? value : value.includes('-') ? value + 'T12:00:00' : value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const billing = (plan: Plan) => plan.intervalCount === 1 ? `per ${plan.billingInterval}` : `every ${plan.intervalCount} ${plan.billingInterval}s`;
const titleCase = (value: string) => value[0].toUpperCase() + value.slice(1);

export function StaffAppServicePlans({ renderStatus, onBack, onClient }: { renderStatus: (status: string) => ReactNode; onBack: () => void; onClient: (client: { id: string; clientName: string; propertyAddress: string; serviceName: string }) => void }) {
  const [plans, setPlans] = useState<Plan[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('klervo-service-plans') || 'null');
      if (Array.isArray(stored) && stored.length) return stored.filter(plan => plan.upsoldBy?.name === 'Mike Bailey' || plan.upsoldBy?.name === 'Paonda Pulaor').map(plan => ({ ...plan, memberDiscountValue: plan.memberDiscountValue || 0 }));
    } catch { /* Use sample portfolio when browser data is unavailable. */ }
    return samples;
  });
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('all-time');
  const [service, setService] = useState('');
  const [status, setStatus] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [popup, setPopup] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const selected = plans.find(plan => plan.id === selectedId);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const show = (name: string) => { setPopup(name); dialog.current?.showModal(); };
  const withinPeriod = (value: string) => {
    if (period === 'all-time') return true;
    const date = new Date(value);
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(new Date());
    const get = (key: string) => Number(parts.find(part => part.type === key)?.value);
    const today = new Date(get('year'), get('month') - 1, get('day'));
    const end = new Date(today); end.setDate(end.getDate() + 1);
    if (period === 'today') return date >= today && date < end;
    if (period === 'current-month') return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    if (period === 'current-year') return date.getFullYear() === today.getFullYear();
    if (period === 'last-month') return date >= new Date(today.getFullYear(), today.getMonth() - 1, 1) && date < new Date(today.getFullYear(), today.getMonth(), 1);
    const start = period === 'last-3-months' ? new Date(today.getFullYear(), today.getMonth() - 2, 1) : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    return date >= start && date < end;
  };
  const filtered = plans.filter(plan => `${plan.id} ${plan.clientName} ${plan.clientEmail}`.toLowerCase().includes(query.toLowerCase()) && (!status || plan.status === status) && (!service || plan.serviceName === service) && withinPeriod(plan.createdAt));
  const count = (value: string) => plans.filter(plan => plan.status === value).length;
  const edit = (plan: Plan) => { setEditPlan(plan); show('Edit Service Plan'); };
  const details = (plan: Plan) => <>
    <StaffAppPageHeading title="Service Plan Details" backLabel="Back to service plans" onBack={() => setSelectedId(null)} />
    <section className="sjd-hero ssp-detail-hero"><div className="sjd-id-row"><span>{plan.id}</span>{renderStatus(titleCase(plan.status))}</div><h1><button type="button" className="sjd-customer-link ssp-customer-link" onClick={() => onClient(plan)}><UserRound size={18} aria-hidden="true" />{plan.clientName}</button></h1><h2 className="sjd-summary-service">{plan.serviceName}</h2><p><CalendarDays size={14} />Starts {dateLabel(plan.startDate)} <span>&middot;</span> {money(plan.price)} {billing(plan)}</p><div className="sjd-contact"><a target="_blank" rel="noreferrer" href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(plan.propertyAddress)}><Navigation size={16} />Navigate</a><a href={'tel:' + plan.phone.replace(/[^+\d]/g, '')}><Phone size={16} />Call</a><a href={'mailto:' + plan.clientEmail}><Mail size={16} />Email</a></div></section>
    <section className="sa-card"><div className="sa-card-heading"><h2><Users size={17} />Client Information</h2><button type="button" className="ssp-client-edit sa-edit-icon" aria-label="Edit client information" onClick={() => setEditingClientId(editingClientId === plan.id ? null : plan.id)}><Pencil size={15} /></button></div>
      {editingClientId === plan.id ? <form className="ssp-client-form" key={plan.id} onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); const clientName = String(data.get('clientName') || '').trim(); const clientEmail = String(data.get('clientEmail') || '').trim(); const phone = String(data.get('phone') || '').trim(); const propertyAddress = String(data.get('propertyAddress') || '').trim(); if (!clientName || !clientEmail || !phone || !propertyAddress) return; setPlans(current => current.map(item => item.id === plan.id ? { ...item, clientName, clientEmail, phone, propertyAddress } : item)); setEditingClientId(null); }}>
        <label className="sa-field">Client name<input name="clientName" required maxLength={100} defaultValue={plan.clientName} /></label>
        <label className="sa-field">Email<input name="clientEmail" type="email" required defaultValue={plan.clientEmail} /></label>
        <label className="sa-field">Phone<input name="phone" type="tel" required defaultValue={plan.phone} /></label>
        <label className="sa-field">Address<textarea name="propertyAddress" required rows={3} defaultValue={plan.propertyAddress} /></label>
        <div className="sa-button-row"><button type="button" className="ssp-cancel" onClick={() => setEditingClientId(null)}><X size={14} />Cancel</button><button type="submit" className="sa-primary">Save Changes</button></div>
      </form> : <dl className="ssp-facts"><div><dt>Client name</dt><dd>{plan.clientName}</dd></div><div><dt>Email</dt><dd><a href={'mailto:' + plan.clientEmail}>{plan.clientEmail}</a></dd></div><div><dt>Phone</dt><dd><a href={'tel:' + plan.phone.replace(/[^+\d]/g, '')}>{plan.phone}</a></dd></div><div><dt>Address</dt><dd>{plan.propertyAddress}</dd></div></dl>}
    </section>
    <section className="sa-card"><div className="sa-card-heading"><h2><ShieldCheck size={17} />Service Details</h2><button className="sa-text-button sa-edit-icon" aria-label="Edit service plan" onClick={() => edit(plan)}><Pencil size={15} /></button></div><p className="sa-muted">{plan.serviceDescription}</p><dl className="ssp-facts"><div><dt>Visits remaining</dt><dd>{Math.max(0, plan.totalVisits - plan.visitsUsed)}</dd></div><div><dt>Visits used</dt><dd>{plan.visitsUsed}/{plan.totalVisits}</dd></div><div><dt>Member discount</dt><dd>{plan.memberDiscountValue}%</dd></div><div><dt>Start date</dt><dd>{dateLabel(plan.startDate)}</dd></div></dl></section>
    <section className="sa-card"><div className="sa-card-heading"><h2><CreditCard size={17} />Billing Information</h2></div><dl className="ssp-facts"><div><dt>Price</dt><dd>{money(plan.price)} {billing(plan)}</dd></div><div><dt>Next billing</dt><dd>{['active', 'failed'].includes(plan.status) ? dateLabel(plan.nextBillingDate) : '—'}</dd></div><div><dt>Payment method</dt><dd>{plan.paymentMethod}</dd></div><div><dt>Auto-renew</dt><dd>{plan.autoRenew ? 'On' : 'Off'}</dd></div><div><dt>Upsell owner</dt><dd>{plan.upsoldBy ? `${plan.upsoldBy.name} (${plan.upsoldBy.type})` : '—'}</dd></div></dl>{plan.status === 'failed' && <p className="ssp-alert">Payment failed. Review the payment method before retrying.</p>}</section>
    <div className="ssp-actions"><button className="sa-secondary" onClick={() => edit(plan)}><Pencil size={14} />Edit</button><button className="sa-secondary" onClick={() => show('View invoice')}><FileText size={14} />View</button>{plan.status === 'approved' && <button className="sa-primary" onClick={() => show('Pay Now')}>Pay Now</button>}{plan.status === 'pending' && <button className="sa-primary" onClick={() => show('Send estimate')}>Send estimate</button>}{plan.status === 'active' && <button className="sa-primary" disabled={plan.visitsUsed >= plan.totalVisits} onClick={() => show('Schedule Job/Visit')}><CalendarDays size={14} />Schedule Job/Visit</button>}{!['canceled', 'declined'].includes(plan.status) && <button className="ssp-stop-renew" disabled={!plan.autoRenew} onClick={() => show('Stop Auto-Renew')}>{plan.autoRenew ? 'Stop Auto-Renew' : 'Auto-Renew Stopped'}</button>}</div>
    <section className="sa-card"><div className="sa-card-heading"><h2><CalendarDays size={17} />Visit Timeline</h2></div><p className="sa-muted">{plan.visitsUsed} of {plan.totalVisits} visits used. Scheduled and completed visits will appear here.</p></section>
  </>;
  return <div className="ssp">
    {selected ? details(selected) : <>
      <StaffAppPageHeading title="Service Plans" onBack={onBack} /><div className="ssp-heading ssp-add-toolbar"><button className="sa-primary" onClick={() => show('Add Service Plan')}><Plus size={15} />Add Plan</button></div>
      <div className="ssp-metrics">{[['Total Plans', plans.length, ''], ['Active', count('active'), 'active'], ['Pending', count('pending'), 'pending'], ['Failed', count('failed'), 'failed']].map(([label, value, filter]) => <button key={label} onClick={() => setStatus(String(filter))}><strong>{value}</strong><span>{label}</span></button>)}</div>
      <p className="ssp-portfolio">Your service plan portfolio</p>
      <label className="sa-search"><Search size={17} /><input aria-label="Search service plans" placeholder="Search name, email or plan ID" value={query} onChange={event => setQuery(event.target.value)} /></label>
      <div className="ssp-filters"><select aria-label="Service plan period" value={period} onChange={event => setPeriod(event.target.value)}>{periodOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><select aria-label="Service plan status" value={status} onChange={event => setStatus(event.target.value)}><option value="">All Status</option>{['pending', 'approved', 'active', 'canceled', 'failed', 'declined'].map(value => <option key={value} value={value}>{titleCase(value)}</option>)}</select><select aria-label="Plan service" value={service} onChange={event => setService(event.target.value)}><option value="">All Plans</option>{Array.from(new Set(plans.map(plan => plan.serviceName))).map(name => <option key={name}>{name}</option>)}</select></div>
      <p className="ssp-results">{filtered.length} plan{filtered.length === 1 ? '' : 's'}</p>
      {filtered.map(plan => <section className="sa-card ssp-plan" key={plan.id}><button className="ssp-plan-open" onClick={() => setSelectedId(plan.id)}><div className="ssp-plan-top"><span>{plan.id}</span>{renderStatus(titleCase(plan.status))}</div><h2>{plan.serviceName}</h2><p>{plan.clientName}</p><p className="ssp-address"><MapPin size={12} />{plan.propertyAddress}</p><div className="ssp-price"><strong>{money(plan.price)} <small>{billing(plan)}</small></strong><ChevronRight size={17} /></div></button><div className="ssp-plan-bottom"><span>{['active', 'failed'].includes(plan.status) ? `${Math.max(0, plan.totalVisits - plan.visitsUsed)} visits remaining` : 'Awaiting ' + (plan.status === 'approved' ? 'payment' : 'approval')}</span><span>{['active', 'failed'].includes(plan.status) ? 'Next: ' + dateLabel(plan.nextBillingDate) : ''}</span></div><div className="ssp-card-actions"><button className="sa-text-button" onClick={() => edit(plan)}><Pencil size={12} />Edit</button>{plan.status === 'approved' && <button className="sa-primary" onClick={() => { setSelectedId(plan.id); show('Pay Now'); }}>Pay Now</button>}{plan.status === 'failed' && <button className="sa-text-button" onClick={() => setSelectedId(plan.id)}>Review payment</button>}</div></section>)}
      {!filtered.length && <section className="sa-card"><h3>No matching service plans</h3><p className="sa-muted">Try another search or change the filters.</p></section>}
    </>}
    <dialog ref={dialog} className="sa-status-dialog" aria-labelledby="ssp-dialog-title"><div className="sa-status-title"><h2 id="ssp-dialog-title">{popup}</h2><button aria-label="Close" onClick={() => dialog.current?.close()}><X size={18} /></button></div>
      {popup === 'Edit Service Plan' && editPlan ? <form className="ssp-edit-form" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); setPlans(current => current.map(plan => plan.id === editPlan.id ? { ...plan, price: Number(data.get('price')), totalVisits: Number(data.get('visits')), memberDiscountValue: Number(data.get('discount')), autoRenew: data.has('renew') } : plan)); dialog.current?.close(); }}><p className="sa-muted">{editPlan.serviceName} · {editPlan.clientName}</p><label className="sa-field">Price ($)<input name="price" type="number" min="0" step="0.01" required defaultValue={editPlan.price} /></label><label className="sa-field">Total visits<input name="visits" type="number" min={editPlan.visitsUsed} required defaultValue={editPlan.totalVisits} /></label><label className="sa-field">Member discount (%)<input name="discount" type="number" min="0" max="100" required defaultValue={editPlan.memberDiscountValue} /></label><label className="sa-task"><input name="renew" type="checkbox" defaultChecked={editPlan.autoRenew} />Auto-renew</label><div className="sa-button-row"><button type="button" className="ssp-cancel" onClick={() => dialog.current?.close()}>Cancel</button><button className="sa-primary">Save Changes</button></div></form> : popup === 'Stop Auto-Renew' ? <><p className="sa-muted">Stop automatic renewal for this plan? The plan will remain active for its current term and will not renew.</p><div className="sa-button-row"><button className="ssp-cancel" onClick={() => dialog.current?.close()}>Keep Auto-Renew</button><button className="ssp-stop-renew" onClick={() => { setPlans(current => current.map(plan => plan.id === selectedId ? { ...plan, autoRenew: false } : plan)); dialog.current?.close(); }}>Stop Auto-Renew</button></div></> : <><p className="sa-muted">Implement the same {popup.toLowerCase()} fields and flow as in the browser.</p><button className="sa-primary sa-full" onClick={() => dialog.current?.close()}>OK</button></>}
    </dialog>
  </div>;
}
