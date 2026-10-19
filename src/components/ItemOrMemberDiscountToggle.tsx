import type { MemberDiscount } from '../utils/memberDiscount';

export function ItemOrMemberDiscountToggle({ discount, onChange }: {
  discount?: MemberDiscount;
  onChange: (discount: MemberDiscount | undefined) => void;
}) {
  const selection = discount?.mode === 'member' ? 'member' : discount?.type === 'fixed' ? '$' : '%';
  return (
    <div className="mt-3 pt-3 border-t border-[#e8e8e8]">
      <label className="flex items-center justify-between gap-3 text-xs text-[#051046]">
        Add item or member discounts
        <button type="button" role="switch" aria-label="Add item or member discounts" aria-checked={Boolean(discount)} onClick={() => onChange(discount ? undefined : { type: 'percentage', value: 0, mode: 'item' })} className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-purple-600 ${discount ? 'bg-[#9473ff]' : 'bg-gray-300'}`}>
          <span className={`absolute top-0.5 h-5 w-5 bg-white rounded-full transition-transform ${discount ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </label>
      {discount && <div className="flex items-center gap-3 mt-3">
        <select aria-label="Item discount type" value={selection} onChange={event => {
          const value = event.target.value;
          onChange(value === 'member' ? { type: 'percentage', value: 10, mode: 'member' } : { type: value === '$' ? 'fixed' : 'percentage', value: 0, mode: 'item' });
        }} className="px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] bg-white">
          <option value="%">%</option>
          <option value="$">$ amount</option>
          <option value="member">Member Discount (10%)</option>
        </select>
        {selection !== 'member' && <input type="number" aria-label="Item discount value" min={0} max={selection === '%' ? 100 : undefined} step="0.01" value={discount.value} onChange={event => onChange({ ...discount, value: Math.min(selection === '%' ? 100 : Infinity, Math.max(0, Number(event.target.value) || 0)) })} className="w-28 px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046]" />}
      </div>}
    </div>
  );
}
