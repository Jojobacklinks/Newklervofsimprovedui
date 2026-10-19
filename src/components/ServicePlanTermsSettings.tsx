import { useState } from 'react';
import { MAX_TERMS_TEMPLATES, saveTermsTemplates, useServicePlanTerms, type TermsTemplate } from '../hooks/useServicePlanTerms';
import { ServicePlanTermsEditor } from './ServicePlanTermsEditor';
import { ServicePlanTermsContent } from './ServicePlanTermsContent';

export function ServicePlanTermsSettings() {
  const templates = useServicePlanTerms();
  const atLimit = templates.length >= MAX_TERMS_TEMPLATES;
  const [draft, setDraft] = useState<TermsTemplate | null>(null);
  const [message, setMessage] = useState('');
  function save() {
    if (!draft) return;
    if (atLimit && !templates.some(template => template.id === draft.id)) {
      setMessage('You can save one set of terms of service. Edit the existing entry instead.'); return;
    }
    if (!draft.name.trim()) { setMessage('Please enter a name for these terms.'); return; }
    if (templates.some(template => template.id !== draft.id && template.name.trim().toLowerCase() === draft.name.trim().toLowerCase())) {
      setMessage('Please use a unique name for these terms.'); return;
    }
    try {
      saveTermsTemplates([...templates.filter(template => template.id !== draft.id), { ...draft, name: draft.name.trim() }]);
      setDraft(null);
      setMessage('Terms of service saved.');
    } catch (error) { setMessage(error instanceof Error && error.message.startsWith('You can save') ? error.message : 'Unable to save terms. Please try again.'); }
  }
  return (
    <div className="bg-gray-50 rounded-[20px] border border-[#e2e8f0] p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-[#051046]">Terms of Service</h3>
        {!draft && !atLimit && <button type="button" disabled={atLimit} onClick={() => { if (atLimit) return; setDraft({ id: crypto.randomUUID(), name: '', content: '' }); setMessage(''); }} className="px-4 py-2 bg-[#9473ff] text-white rounded-[60px] text-sm disabled:opacity-50 disabled:cursor-not-allowed">Add New</button>}
      </div>
      <p className="text-sm text-gray-500 mb-4">Create your terms of service to be used in your estimates and invoices.</p>
      <div className="space-y-3">
        {!templates.length && <p className="text-sm text-gray-500">No terms of service saved yet.</p>}
        {templates.map(template => (
          <div key={template.id} className="p-4 bg-white border border-[#e8e8e8] rounded-[15px]">
            <div className="flex justify-between items-center gap-3 mb-3">
              <h4 className="text-sm font-semibold text-[#051046]">{template.name}</h4>
              <button type="button" disabled={Boolean(draft)} onClick={() => { setDraft({ ...template }); setMessage(''); }} className="text-sm text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed">Edit</button>
            </div>
            <div className="max-h-[280px] overflow-y-auto"><ServicePlanTermsContent value={template.content} /></div>
          </div>
        ))}
      </div>
      {draft && <div className="space-y-4 mt-4">
        <label className="block text-sm font-medium text-[#051046]">Name <span className="text-red-500">*</span><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="e.g. Residential Maintenance Terms" className="block mt-2 w-full px-4 py-2 bg-white border border-[#e8e8e8] rounded-[15px]" /></label>
        <ServicePlanTermsEditor key={draft.id} value={draft.content} onChange={(content) => setDraft({ ...draft, content })} onSave={save} />
        <button type="button" onClick={() => { setDraft(null); setMessage(''); }} className="px-4 py-2 border border-gray-300 rounded-[60px] text-sm">Cancel</button>
      </div>}
      <p role="status" className="text-sm text-[#051046] mt-3">{message}</p>
    </div>
  );
}
