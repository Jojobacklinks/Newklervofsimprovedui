import { useId, useState } from 'react';
import { Link } from 'react-router';
import { savePreferredServicePlanTerms, useServicePlanTerms } from '../hooks/useServicePlanTerms';

export function ServicePlanTermsSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const id = useId();
  const [message, setMessage] = useState('');
  const templates = useServicePlanTerms();
  const selected = templates.find(template => template.content === value);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#051046] mb-2">Terms of Service <span className="text-red-500">*</span></label>
      <p className="text-xs text-gray-500 mb-3">{templates.length ? 'Select your terms of service to show on all your service and job estimates and invoices.' : 'Create terms of service in Settings → Customization before creating a plan.'} <Link to="/admin/settings?tab=customization" className="text-purple-600 underline">Manage saved terms</Link></p>
      <select id={id} required value={selected?.id || (value ? 'existing-plan-terms' : '')} onChange={(event) => { setMessage(''); onChange(templates.find(template => template.id === event.target.value)?.content || ''); }} className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600">
        <option value="">Select saved terms of service...</option>
        {value && !selected && <option value="existing-plan-terms">Current plan terms</option>}
        {templates.map(template => <option key={template.id} value={template.id}>{template.name}</option>)}
      </select>
      <div className="flex flex-col items-end gap-2 mt-2 text-right">
        <p className="text-xs text-gray-500">Saved. These terms will be selected automatically for future estimate and invoices.</p>
        {message && <p role="status" className="text-xs text-gray-500">{message}</p>}
        <button type="button" disabled={!selected} onClick={() => {
          if (!selected) return;
          try {
            savePreferredServicePlanTerms(selected.id);
            setMessage('');
          } catch { setMessage('Unable to save your preference. Please try again.'); }
        }} className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded-[60px] disabled:cursor-not-allowed">Save for Future</button>
      </div>
    </div>
  );
}
