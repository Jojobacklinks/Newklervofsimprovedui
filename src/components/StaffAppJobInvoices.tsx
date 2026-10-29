import { StaffAppInvoiceItemPicker } from './StaffAppInvoiceItemPicker';
import { useEffect, useRef, useState } from 'react';
import { ChevronRight, FileText, Plus, Trash2, X } from 'lucide-react';
import { lineItemAmount, type MemberDiscount } from '../utils/memberDiscount';

type Item = { description: string; notes: string; quantity: number; price: number; taxable: boolean; memberDiscount?: MemberDiscount };
type Invoice = { id: string; items: Item[]; total: number; notes: string; date: string; status: 'Due' | 'Paid' | 'Refunded' };
const blank = (): Item => ({ description: '', notes: '', quantity: 1, price: 0, taxable: false });
const money = (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
export function StaffAppJobInvoices({ job, complete }: { job: { id: string; client: string; address: string; service: string; systemTags: string[] }; complete: boolean }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [items, setItems] = useState<Item[]>([blank()]);
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState('%');
  const [tax, setTax] = useState('non-taxable');
  const [notes, setNotes] = useState('');
  const localDate = () => { const now = new Date(); return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-'); };
  const [date, setDate] = useState(localDate);
  const nextNumber = useRef(1);
  const invoiceNumber = 'I-' + job.id.slice(2) + '-' + nextNumber.current;
  const phone = '(512) 555-0104';
  const email = job.client.toLowerCase().replace(/\s+/g, '.') + '@example.com';
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [mode, setMode] = useState('');
  const [method, setMethod] = useState('');
  const [message, setMessage] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const popup = dialog.current;
    const device = popup?.closest<HTMLElement>('.sa-device');
    if (!popup || !device) return;
    const syncWidth = () => {
      const bounds = device.getBoundingClientRect();
      popup.style.setProperty('--invoice-screen-width', `${device.clientWidth}px`);
      popup.style.setProperty('--invoice-screen-left', `${bounds.left + device.clientLeft}px`);
    };
    syncWidth();
    const observer = new ResizeObserver(syncWidth);
    observer.observe(device);
    window.addEventListener('resize', syncWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncWidth);
    };
  }, []);
  const subtotal = items.reduce((sum, item) => sum + lineItemAmount(item), 0);
  const discountValue = discountType === '%' ? subtotal * Number(discount || 0) / 100 : Number(discount || 0);
  const taxable = items.filter(item => item.taxable).reduce((sum, item) => sum + lineItemAmount(item), 0);
  const total = subtotal - discountValue + (tax === 'non-taxable' ? 0 : taxable * (discountType === '%' ? 1 - Number(discount || 0) / 100 : 1) * .0825);
  const update = (index: number, patch: Partial<Item>) => setItems(current => current.map((item, i) => i === index ? { ...item, ...patch } : item));
  const show = (next: string, invoice: Invoice | null = null) => { setSelected(invoice); setMode(next); dialog.current?.showModal(); };
  const close = () => dialog.current?.close();
  const reset = () => { setItems([blank()]); setDiscount(''); setDiscountType('%'); setTax('non-taxable'); setNotes(''); setDate(localDate()); };
  return <section className="sa-card sa-job-invoices">
    <div className="sa-card-heading"><h2><FileText size={17} />Job invoices</h2><button className="sjd-add-document" disabled={complete} onClick={() => { reset(); show('Add Invoice'); }}><Plus size={13} />Add</button></div>
    {message && <p role="status" className="sa-muted">{message}</p>}
    {!invoices.length ? <div className="sjd-empty"><FileText size={28} /><h3>No invoices yet</h3><p>Create an invoice for this job when youâ€™re ready.</p></div> : invoices.map(invoice => <article className="sa-invoice-row" key={invoice.id}><button className="sjd-document" onClick={() => show('Developer note', invoice)}><span className="sjd-document-icon"><FileText size={23} /></span><div><strong>{invoice.id}</strong><small>{job.client} · {money(invoice.total)}</small></div><span className="sa-invoice-status"><i className={`sa-invoice-status-${invoice.status.toLowerCase()}`} />{invoice.status}</span><ChevronRight size={15} /></button><div className="sa-invoice-actions">{invoice.status === 'Due' && <button className="sa-secondary" onClick={() => setMessage('Reminder preview for ' + invoice.id + '. No message is sent in this demo.')}>Send Reminder</button>}{invoice.status === 'Due' && <><button className="sa-primary" onClick={() => show('Select Payment Method', invoice)}>Pay Now</button><button className="sa-invoice-card-delete" aria-label={'Delete ' + invoice.id} onClick={() => show('Delete', invoice)}><Trash2 size={16} /></button></>}{invoice.status === 'Paid' && <button className="sa-secondary" onClick={() => show('Refund', invoice)}>Refund</button>}</div></article>)}
    <dialog ref={dialog} className={`sa-status-dialog sa-invoice-dialog${mode === 'Add Invoice' ? ' sa-invoice-create-dialog' : ''}`} aria-labelledby="sa-invoice-title" onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="sa-status-title"><h2 id="sa-invoice-title">{mode}</h2><button type="button" aria-label="Close invoice" onClick={close}><X size={18} /></button></div>
      {mode === 'Add Invoice' ? <form onSubmit={event => { event.preventDefault(); if (complete || !Number.isFinite(total) || total < 0) return; setInvoices(current => [...current, { id: invoiceNumber, items: items.map(item => ({ ...item })), total: Math.round(total * 100) / 100, notes, date, status: 'Due' }]); nextNumber.current += 1; setMessage('Invoice created in this preview.'); close(); }}>
        <div className="sa-invoice-meta"><div><span>Invoice #</span><strong>{invoiceNumber} <small>INSTANT INVOICE</small></strong></div><div><span>Client</span><strong>{job.client}</strong></div><label className="sa-field">Date<input type="date" required value={date} onChange={event => setDate(event.target.value)} /></label><div><span>Status</span><strong>Due</strong></div></div>
        <div className="sa-invoice-addresses"><div><h3>Prepared For:</h3><p>{job.client}<br />{phone}<br />{email}</p></div><div><h3>Service Location:</h3><p>{job.address}<br />{phone}<br />{email}</p></div></div>
        <h3>Line items ({items.length})</h3>
        {items.map((item, index) => <fieldset key={index}><legend className="sr-only">Item {index + 1}</legend><StaffAppInvoiceItemPicker value={item.description} onChange={description => update(index, { description })} onSelect={entry => update(index, { description: entry.name, price: entry.price, taxable: entry.taxable })} /><label className="sa-field">Description<textarea placeholder="Additional details" value={item.notes} onChange={event => update(index, { notes: event.target.value })} /></label><div className="sa-invoice-item-numbers"><label className="sa-field">Quantity<input type="number" required min="1" step="1" value={item.quantity} onChange={event => update(index, { quantity: Number(event.target.value) })} /></label><label className="sa-field">Price<input type="number" required min="0" step="0.01" value={item.price} onChange={event => update(index, { price: Number(event.target.value) })} /></label><label className="sa-field">Amount<input readOnly value={money(lineItemAmount(item))} /></label><label><input type="checkbox" checked={item.taxable} onChange={event => update(index, { taxable: event.target.checked })} /> Taxable</label></div><button type="button" className="sa-invoice-delete" aria-label={'Delete item ' + (index + 1)} onClick={() => setItems(current => current.length === 1 ? [blank()] : current.filter((_, i) => i !== index))}><Trash2 size={16} /></button></fieldset>)}
        <button type="button" className="sa-primary sa-invoice-add-item" onClick={() => setItems(current => [...current, blank()])}><Plus size={16} />Add Item</button>
        <div className="sa-invoice-summary"><h3>Financial Summary</h3><p className="sa-invoice-summary-row"><strong>Subtotal:</strong><span>{money(subtotal)}</span></p><div className="sa-invoice-summary-row"><strong>Discount:</strong><div className="sa-invoice-discount"><select aria-label="Discount type" value={discountType} onChange={event => setDiscountType(event.target.value)}><option>$</option><option>%</option></select><input type="number" min="0" max={discountType === '%' ? 100 : subtotal} step="0.01" value={discount} placeholder="0" aria-label="Discount amount" onChange={event => setDiscount(event.target.value)} /></div></div><p className="sa-muted">Apply discounts for promotions.</p><label className="sa-invoice-summary-row"><strong>Tax:</strong><select value={tax} onChange={event => setTax(event.target.value)}><option value="non-taxable">Non-Taxable</option><option value="standard-sales-tax">Standard Tax (8.25%)</option><option value="austin-sales-tax">Austin Tax (8.25%)</option></select></label><p className="sa-invoice-summary-row sa-invoice-total"><strong>Total:</strong><strong>{money(total)}</strong></p></div><label className="sa-field">Invoice Notes<textarea rows={4} placeholder="Add any additional notes or terms..." value={notes} onChange={event => setNotes(event.target.value)} /></label><div className="sa-button-row sa-invoice-footer"><button type="button" className="sa-secondary" onClick={close}>Cancel</button><button type="submit" className="sa-primary">Create Invoice</button></div>
      </form> : mode === 'Select Payment Method' ? <div className="sa-add-options">{[{ name: 'Card', detail: 'Process payment via Stripe checkout' }, { name: 'Cash', detail: 'Collect cash payment in person' }, { name: 'Other', detail: 'Check, wire transfer, or other methods' }].map(option => <button key={option.name} className="sa-menu-item" onClick={() => { setMethod(option.name); setMode('Confirm Payment'); }}><div><h3>{option.name}</h3><p>{option.detail}</p></div></button>)}</div> : mode === 'Confirm Payment' && selected ? <><p>Are you sure you want to process this payment using: {method}?</p><p>{money(selected.total)}</p><p className="sa-muted">Preview only. No payment is processed or recorded outside this demo.</p><div className="sa-button-row"><button className="sa-secondary" onClick={close}>Cancel</button><button className="sa-primary" onClick={() => { setInvoices(current => current.map(invoice => invoice.id === selected.id ? { ...invoice, status: 'Paid' } : invoice)); setMessage('Payment preview completed via ' + method + '. No real payment was processed.'); close(); }}>Confirm Payment</button></div></> : mode === 'Developer note' && selected ? <><h3>Invoice PDF preview</h3><p>Display the PDF version of invoice {selected.id}, using the same invoice layout and content as the browser app.</p><p className="sa-muted">Developer note: Open the PDF preview when the invoice row or its arrow is selected.</p><div className="sa-button-row"><button className="sa-primary" onClick={close}>Got it</button></div></> : mode === 'Delete' && selected ? <><p>Are you sure you want to delete {selected.id}?</p><div className="sa-button-row"><button className="sa-secondary" onClick={close}>Cancel</button><button className="sa-primary" onClick={() => { setInvoices(current => current.filter(invoice => invoice.id !== selected.id)); close(); }}>Save</button></div></> : mode === 'Refund' ? <><p>Youâ€™re about to be redirected to Stripe to process this refund. Would you like to continue?</p><div className="sa-button-row"><button className="sa-secondary" onClick={close}>Cancel</button><button className="sa-primary" onClick={() => { setMessage('Stripe refund requires the connected payment provider. No refund was processed.'); close(); }}>Yes, Continue</button></div></> : null}
    </dialog>
  </section>;
}
