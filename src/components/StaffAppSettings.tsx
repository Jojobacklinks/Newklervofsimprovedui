import { useState } from 'react';
import { Eye, EyeOff, Info, LockKeyhole, Upload, UserRound } from 'lucide-react';
import { StaffAppPageHeading } from './StaffAppPageHeading';
import './StaffAppSettings.css';

export function StaffAppSettings({ onBack }: { onBack: () => void }) {
  const [profile, setProfile] = useState({ firstName: 'Paonda', lastName: 'Pulaor', email: 'paonda@example.com', phone: '(512) 555-0123', address: '123 Main St, Austin, TX 78701' });
  const [notice, setNotice] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });
  return <div className="sas">
    <StaffAppPageHeading title="Settings" onBack={onBack} />
    <section className="sa-card"><div className="sa-card-heading"><h2><UserRound size={17} />Your Data</h2></div>
      <form onSubmit={event => { event.preventDefault(); setNotice('Your data has been updated in this preview.'); }}>
        <div className="sas-name-fields"><label className="sa-field">First name<input autoComplete="given-name" required value={profile.firstName} onChange={event => { setProfile({ ...profile, firstName: event.target.value }); setNotice(''); }} /></label><label className="sa-field">Last name<input autoComplete="family-name" required value={profile.lastName} onChange={event => { setProfile({ ...profile, lastName: event.target.value }); setNotice(''); }} /></label></div>
        <label className="sa-field">Email<input type="email" autoComplete="email" required value={profile.email} onChange={event => { setProfile({ ...profile, email: event.target.value }); setNotice(''); }} /></label>
        <label className="sa-field">Phone<input type="tel" autoComplete="tel" required value={profile.phone} onChange={event => { setProfile({ ...profile, phone: event.target.value }); setNotice(''); }} /></label>
        <label className="sa-field">Address<input autoComplete="street-address" required value={profile.address} onChange={event => { setProfile({ ...profile, address: event.target.value }); setNotice(''); }} /></label>
        <div className="sas-photo"><h3>Your Photo</h3><p>This image will appear in your email notifications.</p><div><span className="sas-avatar">{photo ? <img src={photo} alt="Your profile" /> : 'PP'}</span><label className="sas-upload"><Upload size={15} />Upload Photo<input type="file" accept="image/*" onChange={event => { const file = event.target.files?.[0]; if (!file || !file.type.startsWith('image/')) return; const reader = new FileReader(); reader.onload = () => setPhoto(String(reader.result)); reader.readAsDataURL(file); }} /></label></div></div>
        <button type="submit" className="sa-primary sa-full">Update Data</button>
      </form>
    </section>
    <section className="sa-card"><div className="sa-card-heading"><h2><LockKeyhole size={17} />Change Password</h2></div>
      <form onSubmit={event => {
        event.preventDefault(); setError(''); setNotice('');
        if (!passwords.current || !passwords.next || !passwords.confirm) { setError('Please fill in all password fields.'); return; }
        if (passwords.next.length < 8) { setError('New password must be at least 8 characters.'); return; }
        if (passwords.next !== passwords.confirm) { setError('New passwords do not match.'); return; }
        setPasswords({ current: '', next: '', confirm: '' }); setVisible({ current: false, next: false, confirm: false });
        setNotice('Password validation passed. Implement the same password change function as in the browser.');
      }}>
        {([{ key: 'current', label: 'Current password' }, { key: 'next', label: 'New password' }, { key: 'confirm', label: 'Confirm password' }] as const).map(({ key, label }) => <label className="sa-field" key={key}>{label}<div className="sas-password"><input type={visible[key] ? 'text' : 'password'} autoComplete={key === 'current' ? 'current-password' : 'new-password'} required value={passwords[key]} onChange={event => { setPasswords({ ...passwords, [key]: event.target.value }); setError(''); }} /><button type="button" aria-label={`${visible[key] ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={visible[key]} onClick={() => setVisible({ ...visible, [key]: !visible[key] })}>{visible[key] ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>)}
        {error && <p role="alert" className="sas-error">{error}</p>}
        <button type="submit" className="sa-primary sa-full">Change Password</button>
        <button type="button" className="sas-reset" onClick={() => { setError(''); setNotice('Implement the same password reset email function as in the browser.'); }}>Reset Password<Info size={14} /></button>
        <p className="sas-reset-help">Request an email with a link to reset your password.</p>
      </form>
    </section>
    {notice && <p className="sas-notice" role="status">{notice}</p>}
  </div>;
}
