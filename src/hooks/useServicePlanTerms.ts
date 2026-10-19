import { useEffect, useState } from 'react';

const KEY = 'klervo-service-plan-terms-templates';
const EVENT = 'klervo-service-plan-terms-changed';
const DEFAULT_KEY = 'klervo-service-plan-preferred-terms-id';
export const MAX_TERMS_TEMPLATES = 1;
export interface TermsTemplate { id: string; name: string; content: string }

export function getPreferredServicePlanTerms(): string {
  try {
    const id = window.localStorage.getItem(DEFAULT_KEY);
    return load().find(template => template.id === id)?.content || '';
  } catch { return ''; }
}

export function savePreferredServicePlanTerms(id: string) {
  window.localStorage.setItem(DEFAULT_KEY, id);
}

function load(): TermsTemplate[] {
  try {
    const stored = window.localStorage.getItem(KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.filter(item => item && typeof item.id === 'string' && typeof item.name === 'string' && typeof item.content === 'string').slice(0, MAX_TERMS_TEMPLATES) : [];
    }
    const legacy = window.localStorage.getItem('klervo-service-plan-default-terms');
    return legacy ? [{ id: 'legacy-default', name: 'Default Terms of Service', content: legacy }] : [];
  } catch { return []; }
}

export function saveTermsTemplates(templates: TermsTemplate[]) {
  if (templates.length > MAX_TERMS_TEMPLATES) {
    throw new Error('You can save one set of terms of service. Edit the existing entry instead.');
  }
  const stored = window.localStorage.getItem(KEY);
  let previous: TermsTemplate[] = [];
  try { const parsed = JSON.parse(stored || '[]'); previous = Array.isArray(parsed) ? parsed : []; } catch { /* Replace invalid storage. */ }
  window.localStorage.setItem(KEY, JSON.stringify([...templates, ...previous.slice(1)]));
  window.dispatchEvent(new Event(EVENT));
}

export function useServicePlanTerms() {
  const [templates, setTemplates] = useState(load);
  useEffect(() => {
    const refresh = () => setTemplates(load());
    window.addEventListener(EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return templates;
}
