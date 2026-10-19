export interface MemberDiscount {
  type: 'percentage' | 'fixed';
  value: number;
  mode?: 'item' | 'member';
}

export function lineItemAmount(item: { quantity: number; price: number; memberDiscount?: MemberDiscount }): number {
  const gross = Math.max(0, item.quantity * item.price);
  const discount = item.memberDiscount;
  if (!discount || !Number.isFinite(discount.value)) return gross;
  const value = Math.max(0, discount.value);
  const reduction = discount.type === 'percentage' ? gross * Math.min(100, value) / 100 : value;
  return Math.round(Math.max(0, gross - reduction) * 100) / 100;
}

export function getPlanMemberDiscount(planId: string, fallback: MemberDiscount = { type: 'percentage', value: 0 }): MemberDiscount {
  try {
    const plans = JSON.parse(window.localStorage.getItem('klervo-service-plans') || '[]');
    const plan = Array.isArray(plans) ? plans.find(item => item?.id === planId) : null;
    if (!plan) return fallback;
    return { type: plan?.memberDiscountType === 'fixed' ? 'fixed' : 'percentage', value: Number(plan?.memberDiscountValue) || 0 };
  } catch { return fallback; }
}
