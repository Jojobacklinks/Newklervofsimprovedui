import { useId, useState } from 'react';
import { invoiceInventory } from '../data/invoiceInventory';

type Entry = typeof invoiceInventory[number];
export function StaffAppInvoiceItemPicker({ value, onChange, onSelect }: { value: string; onChange: (value: string) => void; onSelect: (entry: Entry) => void }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const matches = invoiceInventory.filter(entry => entry.name.toLowerCase().includes(value.toLowerCase()) || entry.type.toLowerCase().includes(value.toLowerCase()));
  const expanded = open;
  const choose = (entry: Entry) => { onSelect(entry); setOpen(false); setActive(-1); };
  return <div className="sa-invoice-item-picker" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
    <label className="sa-field" htmlFor={id}>Item<input id={id} required role="combobox" autoComplete="off" aria-autocomplete="list" aria-expanded={expanded} aria-controls={expanded ? id + '-options' : undefined} aria-activedescendant={expanded && active >= 0 && matches[active] ? id + '-option-' + active : undefined} value={value} placeholder="Search and select from inventory..." onFocus={() => setOpen(true)} onChange={event => { onChange(event.target.value); setOpen(true); setActive(-1); }} onKeyDown={event => {
      if (event.key === 'Escape' && expanded) { event.preventDefault(); event.stopPropagation(); setOpen(false); }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); setActive(current => matches.length ? (current + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length : -1); }
      if (event.key === 'Enter' && expanded && active >= 0 && matches[active]) { event.preventDefault(); choose(matches[active]); }
    }} /></label>
    {expanded && <div className="sa-invoice-inventory-options" id={id + '-options'} role="listbox" aria-label="Inventory items">
      {matches.length ? matches.map((entry, index) => <div role="option" aria-selected={index === active} id={id + '-option-' + index} key={entry.id} onPointerDown={event => event.preventDefault()} onClick={() => choose(entry)} onPointerMove={() => setActive(index)} className="sa-invoice-inventory-option"><div><strong>{entry.name}</strong><span className={'sa-invoice-item-type sa-invoice-item-type-' + entry.type}>{entry.type === 'part' ? 'Part' : 'Service'}</span><small>{entry.taxable ? 'Taxable' : 'Non-taxable'}</small></div><b>${entry.price.toFixed(2)}</b></div>) : <p role="status">No items found matching &quot;{value}&quot;</p>}
    </div>}
  </div>;
}