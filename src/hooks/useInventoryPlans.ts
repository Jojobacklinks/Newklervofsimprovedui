import { useEffect, useState } from 'react';

export const INVENTORY_PLANS_KEY = 'klervo-custom-service-plan-services';
export const INVENTORY_PLANS_CHANGED = 'klervo-inventory-plans-changed';

export interface InventoryPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  taxable: boolean;
}

const placeholderPlan: InventoryPlan = {
  id: 'placeholder-maintenance',
  name: 'Maintenance',
  description: 'Recurring maintenance service plan.',
  price: 240,
  taxable: false,
};

function loadPlans(): InventoryPlan[] {
  try {
    const items: unknown = JSON.parse(window.localStorage.getItem(INVENTORY_PLANS_KEY) || '[]');
    if (!Array.isArray(items)) return [placeholderPlan];
    const plans = items.filter(item => item && typeof item.name === 'string' && typeof item.price === 'number' && Number.isFinite(item.price))
      .map(item => ({
        id: item.name,
        name: item.name,
        description: typeof item.description === 'string' ? item.description : '',
        price: item.price,
        taxable: item.taxable === true || item.taxable === 'taxable',
      }));
    return plans.some(plan => plan.name.trim().toLowerCase() === 'maintenance')
      ? plans
      : [placeholderPlan, ...plans];
  } catch {
    return [placeholderPlan];
  }
}

export function useInventoryPlans() {
  const [plans, setPlans] = useState(loadPlans);
  useEffect(() => {
    const refresh = () => setPlans(loadPlans());
    window.addEventListener('storage', refresh);
    window.addEventListener(INVENTORY_PLANS_CHANGED, refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener(INVENTORY_PLANS_CHANGED, refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  return plans;
}
