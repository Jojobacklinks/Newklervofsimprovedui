import type { MemberDiscount } from '../utils/memberDiscount';

export function MemberDiscountToggle({ checked, onChange }: { discount: MemberDiscount; checked: boolean; onChange: (checked: boolean) => void }) {
  return <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-[#e8e8e8]">
    <span className="text-xs text-[#051046]">Plan Member Discount (15%)</span>
    <button type="button" role="switch" aria-label="Apply plan member discount to this line item" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-purple-600 ${checked ? 'bg-[#9473ff]' : 'bg-gray-300'}`}><span className={`absolute top-0.5 h-5 w-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} /></button>
  </div>;
}
