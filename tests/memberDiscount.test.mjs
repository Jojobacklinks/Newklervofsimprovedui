import assert from 'node:assert/strict';
import test from 'node:test';
import { lineItemAmount, getPlanMemberDiscount } from '../src/utils/memberDiscount.ts';

test('regular items and disabled member discounts retain their original amount', () => {
  assert.equal(lineItemAmount({ quantity: 2, price: 150 }), 300);
  assert.equal(lineItemAmount({ quantity: 2, price: 150, memberDiscount: undefined }), 300);
});

test('percentage discount applies to the full line and rounds to cents', () => {
  assert.equal(lineItemAmount({ quantity: 2, price: 150, memberDiscount: { type: 'percentage', value: 10 } }), 270);
  assert.equal(lineItemAmount({ quantity: 1, price: 19.99, memberDiscount: { type: 'percentage', value: 15 } }), 16.99);
});

test('fixed discount applies once per line and cannot exceed its amount', () => {
  assert.equal(lineItemAmount({ quantity: 3, price: 100, memberDiscount: { type: 'fixed', value: 25 } }), 275);
  assert.equal(lineItemAmount({ quantity: 1, price: 10, memberDiscount: { type: 'fixed', value: 25 } }), 0);
});

test('discounts cannot create negative line amounts', () => {
  assert.equal(lineItemAmount({ quantity: 1, price: 100, memberDiscount: { type: 'percentage', value: 150 } }), 0);
  assert.equal(lineItemAmount({ quantity: 1, price: 100, memberDiscount: { type: 'fixed', value: -5 } }), 100);
});

test('only enabled lines affect the subtotal and taxable base', () => {
  const items = [
    { quantity: 2, price: 100, taxable: true, memberDiscount: { type: 'percentage', value: 10 } },
    { quantity: 1, price: 50, taxable: false },
  ];
  assert.equal(items.reduce((sum, item) => sum + lineItemAmount(item), 0), 230);
  assert.equal(items.filter(item => item.taxable).reduce((sum, item) => sum + lineItemAmount(item), 0), 180);
  const invoiceItems = JSON.parse(JSON.stringify(items));
  assert.equal(lineItemAmount(invoiceItems[0]), 180);
});

test('plan lookup uses member discount, independently of the plan price discount', () => {
  globalThis.window = { localStorage: { getItem: () => JSON.stringify([{ id: 'S-123', discount: 40, memberDiscountType: 'fixed', memberDiscountValue: 15 }]) } };
  try {
    assert.deepEqual(getPlanMemberDiscount('S-123'), { type: 'fixed', value: 15 });
    assert.deepEqual(getPlanMemberDiscount('S-missing'), { type: 'percentage', value: 0 });
  } finally { delete globalThis.window; }
});
