import './StaffAppTabs.css';

export function StaffAppTabs({ tabs, value, onChange, label, sticky = false }: {
  tabs: string[]; value: string; onChange: (value: string) => void; label: string; sticky?: boolean;
}) {
  return <nav className={`sa-tabs-area${sticky ? ' sa-tabs-sticky' : ''}`} aria-label={label}>{tabs.map(tab => <button type="button" key={tab} aria-current={value === tab ? 'page' : undefined} onClick={() => onChange(tab)}>{tab}</button>)}</nav>;
}
