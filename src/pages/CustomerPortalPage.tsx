import { useEffect, useState } from 'react';
import { Phone, X, Info } from 'lucide-react';
import { DeveloperNotesPopup } from '../components/DeveloperNotesPopup';

interface EstimateInvoiceItem {
  id: number;
  description: string;
  notes: string;
  quantity: number;
  price: number;
  taxable: boolean;
}

interface EstimateInvoice {
  id: string;
  type: 'estimate' | 'invoice';
  documentLabel?: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Declined' | 'Paid' | 'Due' | 'Refunded';
  total: number;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  jobDescription: string;
  items: EstimateInvoiceItem[];
  discountAmount?: string;
  discountType?: '%' | '$';
  taxRate?: string;
  taxOption?: 'non-taxable' | 'tax-rate';
  notes?: string;
  isServicePlanEstimate?: boolean;
  recurringBillingCycle?: string;
  companyName?: string;
  companyWebsite?: string;
}

export default function CustomerPortalPage() {
  const [selectedItem, setSelectedItem] = useState<EstimateInvoice | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [showDevNotes, setShowDevNotes] = useState(false);
  const [devNotesContent, setDevNotesContent] = useState<React.ReactNode>(null);
  const [hasAcceptedServiceTerms, setHasAcceptedServiceTerms] = useState(false);

  // Mock data - this would come from backend
  const [items, setItems] = useState<EstimateInvoice[]>([
    {
      id: 'EST-001',
      type: 'estimate',
      documentLabel: 'Serviceplan',
      date: '2026-02-20',
      status: 'Pending',
      total: 2500,
      customerName: 'John Smith',
      customerAddress: '123 Main Street, Austin, TX 78701',
      customerPhone: '(555) 123-4567',
      customerEmail: 'john.smith@email.com',
      jobDescription: 'Kitchen Renovation - Cabinet Installation',
      items: [
        { id: 1, description: 'Custom Kitchen Cabinets', notes: 'Premium oak finish', quantity: 1, price: 1800, taxable: true },
        { id: 2, description: 'Installation Labor', notes: '8 hours of professional installation', quantity: 8, price: 75, taxable: false },
      ],
      discountAmount: '10',
      discountType: '%',
      taxRate: '8.25',
      taxOption: 'tax-rate',
      notes: 'Includes all materials and labor. Installation scheduled for next week.',
      isServicePlanEstimate: true,
      recurringBillingCycle: 'month',
      companyName: 'My Plumber Company',
      companyWebsite: 'https://www.myplumbercompany.com',
    },
    {
      id: 'INV-045',
      type: 'invoice',
      documentLabel: 'Deposit',
      date: '2026-02-15',
      status: 'Due',
      total: 1850,
      customerName: 'John Smith',
      customerAddress: '123 Main Street, Austin, TX 78701',
      customerPhone: '(555) 123-4567',
      customerEmail: 'john.smith@email.com',
      jobDescription: 'Bathroom Plumbing Repair',
      items: [
        { id: 1, description: 'Pipe Replacement', notes: 'Copper piping', quantity: 1, price: 450, taxable: true },
        { id: 2, description: 'Labor (4 hours)', notes: 'Emergency service', quantity: 4, price: 125, taxable: false },
        { id: 3, description: 'Fixtures and Materials', notes: 'High-quality fixtures', quantity: 1, price: 825, taxable: true },
      ],
      discountAmount: '50',
      discountType: '$',
      taxRate: '8.25',
      taxOption: 'tax-rate',
      notes: 'Payment due within 30 days.',
    },
    {
      id: 'INV-042',
      type: 'invoice',
      documentLabel: 'Instant',
      date: '2026-02-10',
      status: 'Paid',
      total: 950,
      customerName: 'John Smith',
      customerAddress: '123 Main Street, Austin, TX 78701',
      customerPhone: '(555) 123-4567',
      customerEmail: 'john.smith@email.com',
      jobDescription: 'HVAC Filter Replacement',
      items: [
        { id: 1, description: 'HVAC Filters (Premium)', notes: 'HEPA filters', quantity: 3, price: 45, taxable: true },
        { id: 2, description: 'Service Call', notes: 'Standard service fee', quantity: 1, price: 150, taxable: false },
        { id: 3, description: 'Labor', notes: '2 hours', quantity: 2, price: 100, taxable: false },
      ],
      discountAmount: '0',
      discountType: '$',
      taxRate: '8.25',
      taxOption: 'tax-rate',
    },
    {
      id: 'EST-002',
      type: 'estimate',
      date: '2026-02-18',
      status: 'Pending',
      total: 3200,
      customerName: 'John Smith',
      customerAddress: '123 Main Street, Austin, TX 78701',
      customerPhone: '(555) 123-4567',
      customerEmail: 'john.smith@email.com',
      jobDescription: 'Electrical Panel Upgrade',
      items: [
        { id: 1, description: '200A Electrical Panel', notes: 'Commercial grade', quantity: 1, price: 1200, taxable: true },
        { id: 2, description: 'Installation & Wiring', notes: 'Full installation with permit', quantity: 1, price: 1800, taxable: false },
      ],
      discountAmount: '0',
      discountType: '$',
      taxRate: '8.25',
      taxOption: 'tax-rate',
      notes: 'Includes permit fees and inspection.',
    },
    {
      id: 'INV-048',
      type: 'invoice',
      documentLabel: 'Instant',
      date: '2026-02-22',
      status: 'Due',
      total: 725,
      customerName: 'John Smith',
      customerAddress: '123 Main Street, Austin, TX 78701',
      customerPhone: '(555) 123-4567',
      customerEmail: 'john.smith@email.com',
      jobDescription: 'Window Installation',
      items: [
        { id: 1, description: 'Double Pane Window', notes: 'Energy efficient', quantity: 2, price: 300, taxable: true },
        { id: 2, description: 'Installation', notes: 'Professional installation', quantity: 1, price: 100, taxable: false },
      ],
      discountAmount: '0',
      discountType: '$',
      taxRate: '8.25',
      taxOption: 'non-taxable',
    },
    {
      id: 'EST-003',
      type: 'estimate',
      documentLabel: 'Serviceplan',
      date: '2026-02-12',
      status: 'Approved',
      total: 1290,
      customerName: 'John Smith',
      customerAddress: '123 Main Street, Austin, TX 78701',
      customerPhone: '(555) 123-4567',
      customerEmail: 'john.smith@email.com',
      jobDescription: 'Annual maintenance membership renewal',
      items: [
        { id: 1, description: 'Annual Maintenance Membership', notes: '12-month recurring service plan', quantity: 1, price: 1290, taxable: false },
      ],
      notes: 'Customer already approved this membership renewal estimate.',
      isServicePlanEstimate: true,
      recurringBillingCycle: 'year',
      companyName: 'My Plumber Company',
      companyWebsite: 'https://www.myplumbercompany.com',
    },
    {
      id: 'EST-004',
      type: 'estimate',
      date: '2026-02-09',
      status: 'Declined',
      total: 680,
      customerName: 'John Smith',
      customerAddress: '123 Main Street, Austin, TX 78701',
      customerPhone: '(555) 123-4567',
      customerEmail: 'john.smith@email.com',
      jobDescription: 'Follow-up repair estimate for secondary fixture replacement',
      items: [
        { id: 1, description: 'Fixture Replacement', notes: 'Secondary bathroom replacement option', quantity: 1, price: 480, taxable: true },
        { id: 2, description: 'Labor', notes: 'Follow-up visit labor', quantity: 1, price: 200, taxable: false },
      ],
      discountAmount: '0',
      discountType: '$',
      taxRate: '8.25',
      taxOption: 'tax-rate',
      notes: 'Customer declined this follow-up estimate.',
    },
    {
      id: 'INV-049',
      type: 'invoice',
      documentLabel: 'Deposit',
      date: '2026-02-08',
      status: 'Refunded',
      total: 410,
      customerName: 'John Smith',
      customerAddress: '123 Main Street, Austin, TX 78701',
      customerPhone: '(555) 123-4567',
      customerEmail: 'john.smith@email.com',
      jobDescription: 'Returned replacement part credit',
      items: [
        { id: 1, description: 'Replacement Part Credit', notes: 'Customer refunded after part return', quantity: 1, price: 410, taxable: false },
      ],
      notes: 'This invoice has been refunded back to the customer.',
    },
  ]);

  const handleViewNow = (item: EstimateInvoice) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    setHasAcceptedServiceTerms(false);
  }, [selectedItem?.id]);

  const handleApprove = () => {
    if (selectedItem?.isServicePlanEstimate && !hasAcceptedServiceTerms) {
      return;
    }
    if (selectedItem) {
      setItems(items.map(item =>
        item.id === selectedItem.id
          ? { ...item, status: 'Approved' as const }
          : item
      ));
      setSelectedItem({ ...selectedItem, status: 'Approved' });
    }
    alert('Estimate approved! Converting to invoice...');
    // Backend would handle conversion here
  };

  const handleDecline = () => {
    alert('Estimate declined.');
    // Backend would handle this
  };

  const handlePayNow = () => {
    // Redirect to Stripe checkout
    alert('Redirecting to Stripe checkout...');
    // window.location.href = 'stripe_checkout_url';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return '#9473ff';
      case 'Pending':
        return '#28bdf2';
      case 'Paid':
        return '#b9df10';
      case 'Due':
        return '#f0a041';
      case 'Declined':
        return '#f16a6a';
      case 'Refunded':
        return '#ff6493';
      default:
        return '#6b7280';
    }
  };

  const servicePlanConsentText = selectedItem?.isServicePlanEstimate
    ? {
        companyName: selectedItem.companyName || 'My Plumber Company',
        companyWebsite: selectedItem.companyWebsite || 'https://www.myplumbercompany.com',
        amount: selectedItem.total.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }),
        billingCycle: selectedItem.recurringBillingCycle || 'month',
      }
    : null;

  const getDocumentDisplayLabel = (item: EstimateInvoice) => {
    return item.documentLabel || '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b" style={{ borderColor: '#e2e8f0' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold" style={{ color: '#051046' }}>
            My Plumber Company
          </h1>
          <div className="relative group/calltip">
            <button className="flex items-center gap-2 px-6 py-2.5 text-white rounded-[32px] transition-colors"
              style={{ backgroundColor: '#9473ff' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}>
              <Phone className="w-4 h-4" />
              Call Us
              <Info className="w-3.5 h-3.5 opacity-75" />
            </button>
            {/* Hover tooltip */}
            <div className="absolute right-0 top-full mt-2 z-50 pointer-events-none opacity-0 group-hover/calltip:opacity-100 transition-opacity duration-200">
              <div className="bg-white rounded-[15px] border border-[#e2e8f0] shadow-lg px-4 py-3 whitespace-nowrap"
                style={{ boxShadow: 'rgba(226, 232, 240, 0.8) 0px 4px 16px 2px' }}>
                <p className="text-xs text-gray-400 mb-1">Call us at</p>
                <a
                  href="tel:5555555555"
                  className="flex items-center gap-2 font-semibold text-sm pointer-events-auto"
                  style={{ color: '#9473ff' }}
                >
                  <Phone className="w-3.5 h-3.5" />
                  (555) 555-5555
                </a>
              </div>
              {/* Arrow */}
              <div className="absolute right-6 -top-1.5 w-3 h-3 bg-white border-l border-t border-[#e2e8f0] rotate-45" />
            </div>
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-semibold mb-8" style={{ color: '#051046' }}>
          Hey, John Smith it's great to see you.
        </h2>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Inbox */}
          <div className="col-span-4">
            <div className="bg-white rounded-[20px] p-6 shadow-sm" style={{ borderColor: '#e2e8f0', border: '1px solid #e2e8f0' }}>
              <h3 className="text-xl font-semibold mb-6" style={{ color: '#051046' }}>
                Your Inbox ({items.length})
              </h3>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[20px] p-4 shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                    style={{
                      borderColor: selectedItem?.id === item.id ? '#d8d8d8' : '#e2e8f0',
                      backgroundColor: selectedItem?.id === item.id ? '#e8e8e8' : '#ffffff',
                    }}
                    onClick={() => handleViewNow(item)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-sm" style={{ color: '#051046' }}>
                          {item.id}
                          {getDocumentDisplayLabel(item) && (
                            <span className="text-gray-500 font-medium"> ({getDocumentDisplayLabel(item)})</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(item.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <span
                        className="px-3 py-1 text-xs font-bold"
                        style={{
                          backgroundColor: getStatusColor(item.status),
                          color: '#ffffff',
                          borderRadius: '.25rem',
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold" style={{ color: '#051046' }}>
                        ${item.total.toLocaleString()}
                      </p>
                      <button
                        className="text-sm px-4 py-2 text-white rounded-[32px] transition-colors"
                        style={{ backgroundColor: '#9473ff' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewNow(item);
                        }}
                      >
                        View Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 text-center text-sm font-medium hover:underline"
                style={{ color: '#9473ff' }}>
                Load more
              </button>
            </div>
          </div>

          {/* Right Content Area - Details */}
          <div className="col-span-8">
            <div
              className="bg-white rounded-[20px] border min-h-[600px]"
              style={{ borderColor: '#e2e8f0', boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
            >
              {selectedItem ? (
                <div>
                  {/* Header with Pay Now button for invoices */}
                  <div className="border-b px-8 py-6 flex items-center justify-center" style={{ borderColor: '#e2e8f0' }}>
                    <h2 className="text-xl font-bold text-center" style={{ color: '#051046' }}>
                      {selectedItem.type === 'estimate' ? 'ESTIMATE' : 'INVOICE'}
                    </h2>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Company & Estimate/Invoice Info Row */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                      {/* Left: Company Info */}
                      <div>
                        <h3 className="font-semibold text-[#051046] text-lg mb-1">My Plumber Company</h3>
                        <p className="text-sm text-[#051046]">huexdesigns@gmail.com</p>
                        <p className="text-sm text-[#051046]">5555555555</p>
                      </div>

                      {/* Right: Estimate/Invoice Details */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-[#051046] w-24">
                            {selectedItem.type === 'estimate' ? 'Estimate #' : 'Invoice #'}
                          </span>
                          <input 
                            type="text" 
                            value={getDocumentDisplayLabel(selectedItem) ? `${selectedItem.id} (${getDocumentDisplayLabel(selectedItem)})` : selectedItem.id}
                            readOnly
                            className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] bg-gray-50"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-[#051046] w-24">Date</span>
                          <input 
                            type="text" 
                            value={selectedItem.date} 
                            readOnly
                            className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-[8px] text-sm text-[#051046] bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Prepared For / Bill To & Service Location */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                      {/* Prepared For / Bill To */}
                      <div>
                        <h4 className="font-semibold text-[#051046] mb-2">
                          {selectedItem.type === 'estimate' ? 'Prepared For:' : 'Bill To:'}
                        </h4>
                        <p className="text-sm text-[#051046]">{selectedItem.customerName}</p>
                        <p className="text-sm text-[#051046]">{selectedItem.customerAddress}</p>
                        <p className="text-sm text-[#051046]">{selectedItem.customerPhone}</p>
                        <p className="text-sm text-[#051046]">{selectedItem.customerEmail}</p>
                      </div>

                      {/* Service Location */}
                      <div>
                        <h4 className="font-semibold text-[#051046] mb-2">Service location:</h4>
                        <p className="text-sm text-[#051046]">{selectedItem.customerName}</p>
                        <p className="text-sm text-[#051046]">{selectedItem.customerAddress}</p>
                        <p className="text-sm text-[#051046]">{selectedItem.customerPhone}</p>
                        <p className="text-sm text-[#051046]">{selectedItem.customerEmail}</p>
                      </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-6">
                      <table className="w-full border-t border-b border-[#e2e8f0]">
                        <thead>
                          <tr className="border-b border-[#e2e8f0]">
                            <th className="text-left py-3 text-sm font-semibold text-[#051046]">Description</th>
                            <th className="text-center py-3 text-sm font-semibold text-[#051046] w-20">QTY</th>
                            <th className="text-right py-3 text-sm font-semibold text-[#051046] w-24">Price</th>
                            <th className="text-right py-3 text-sm font-semibold text-[#051046] w-32">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedItem.items.map((lineItem) => (
                            <tr key={`item-${lineItem.id}`} className="border-b border-[#e2e8f0]">
                              <td className="py-4">
                                <div>
                                  <p className="text-sm font-medium text-[#051046]">{lineItem.description}</p>
                                  {lineItem.notes && (
                                    <p className="text-xs text-gray-500 mt-1">{lineItem.notes}</p>
                                  )}
                                  <span className="inline-block mt-2 text-[12px] font-medium text-[#6a7282]">
                                    {lineItem.taxable ? 'TAXABLE' : 'NON-TAXABLE'}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 text-center text-sm text-[#051046]">{lineItem.quantity}</td>
                              <td className="py-4 text-right text-sm text-[#051046]">${lineItem.price.toFixed(2)}</td>
                              <td className="py-4 text-right text-sm font-medium text-[#051046]">${(lineItem.quantity * lineItem.price).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Financial Summary */}
                    <div className="flex justify-end mb-8">
                      <div className="w-96 space-y-3">
                        {(() => {
                          const subtotal = selectedItem.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                          
                          let discountValue = 0;
                          if (selectedItem.discountAmount && parseFloat(selectedItem.discountAmount) > 0) {
                            if (selectedItem.discountType === '%') {
                              discountValue = subtotal * (parseFloat(selectedItem.discountAmount) / 100);
                            } else {
                              discountValue = parseFloat(selectedItem.discountAmount);
                            }
                          }
                          
                          const afterDiscount = subtotal - discountValue;
                          
                          const taxableAmount = selectedItem.items.filter(item => item.taxable).reduce((sum, item) => sum + (item.quantity * item.price), 0);
                          const taxRate = selectedItem.taxRate ? parseFloat(selectedItem.taxRate) : 8.25;
                          const useTax = selectedItem.taxOption === 'tax-rate';
                          const taxAmount = useTax ? taxableAmount * (taxRate / 100) : 0;
                          
                          const total = afterDiscount + taxAmount;
                          
                          return (
                            <>
                              <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                                <span className="text-sm font-semibold text-[#051046]">Subtotal:</span>
                                <span className="text-sm text-[#051046]">${subtotal.toFixed(2)}</span>
                              </div>
                              
                              {discountValue > 0 && (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-[#051046]">Discount:</span>
                                  <span className="text-sm text-[#051046]">
                                    -{selectedItem.discountType === '%' ? `${selectedItem.discountAmount}%` : `$${selectedItem.discountAmount}`} (${discountValue.toFixed(2)})
                                  </span>
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-[#051046]">Tax rate%:</span>
                                <span className="text-sm text-[#051046]">
                                  {useTax ? `Tax Rate (${taxRate}%)` : 'Non-taxable'}
                                </span>
                              </div>

                              {useTax && (
                                <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                                  <span className="text-sm font-semibold text-[#051046]">Tax:</span>
                                  <span className="text-sm text-[#051046]">${taxAmount.toFixed(2)}</span>
                                </div>
                              )}

                              <div className="flex items-center justify-between pt-3 border-t-2 border-[#051046]">
                                <span className="text-lg font-bold text-[#051046]">Total:</span>
                                <span className="text-lg font-bold text-[#051046]">${total.toFixed(2)}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Notes */}
                    {selectedItem.notes && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-[#051046] mb-2">Notes:</h4>
                        <p className="text-sm text-[#051046]">{selectedItem.notes}</p>
                      </div>
                    )}

                    {/* Action Buttons for Estimates */}
                    {selectedItem.type === 'estimate' && selectedItem.status === 'Pending' && (
                      <div>
                        {servicePlanConsentText && (
                          <div className="mb-4 rounded-[15px] border border-[#e2e8f0] bg-[#f8f7ff] p-4">
                            <label className="flex items-start gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={hasAcceptedServiceTerms}
                                onChange={(e) => setHasAcceptedServiceTerms(e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#9473ff] focus:ring-[#9473ff]"
                              />
                              <span className="text-sm text-[#051046] leading-6">
                                I agree to the Service Terms outlined by {servicePlanConsentText.companyName} and authorize recurring charges of {servicePlanConsentText.amount} every{' '}
                                {servicePlanConsentText.billingCycle} until I cancel.
                              </span>
                            </label>
                          </div>
                        )}

                        <div className="flex gap-4 justify-end mb-4">
                          <button
                            onClick={() => setShowDeclineModal(true)}
                            className="px-8 py-3 border-2 rounded-[32px] font-semibold transition-colors"
                            style={{ 
                              borderColor: '#e2e8f0',
                              color: '#051046',
                              backgroundColor: 'white'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => {
                              handleApprove();
                              setDevNotesContent(
                                <div className="space-y-4">
                                  {([
                                    'Once the customer "approves" the estimate, the estimate status should progress to "Approved" on the job details.',
                                    'Removed from the "Pending" section on the dashboard.',
                                    'Clients & Staff dashboard are updated.',
                                    '"Pending" count will decrease and "Approved" count will increase on the dashboard.',
                                    'Appears on the approved area on the dashboard.',
                                    'Estimate on the estimate list is changed to "Approved".',
                                    'Estimate on the client profile is changed to "Approved".',
                                    <span key="email-approve">"Client approved your estimate" email notification is sent to the user/company.<br /><br /><span className="font-semibold">Email Notification Template:</span><br /><br />Dear [User company name],<br /><br />We hope this email finds you well.<br /><br />We are pleased to inform you that the estimate you provided has been approved by the client. Client is satisfied with the terms and is ready to proceed with the project as outlined.<br /><br /><span className="font-semibold">Client:</span> [client name]<br /><span className="font-semibold">Estimate ID:</span> [estimate ID]<br /><br />Thank you for your hard work in putting together the estimate.<br /><br />Best Regards,<br />[User company name]<br />[User company website — hyperlinked]<br />For any concerns, feel free to call us at [Users phone number — hyperlinked]</span>,
                                    <span key="email-reminder">If the estimate is left in a pending status for 48 hours, automatically send the <span className="font-semibold">"Reminder — Your Estimate Is Now Available"</span> email notification to the customer. Same notification as "Your Estimate Is Now Available" but change the subject line to "Reminder — Your Estimate Is Now Available".<br /><br /><span className="font-semibold">Email Notification Template:</span><br /><span className="font-semibold">Attach:</span> Estimate PDF<br /><br />Dear [customer name],<br /><br />We hope this email finds you well.<br /><br />Thank you for choosing [users company name].<br /><br />We are pleased to inform you that your work estimate is now available. You can view and approve or reject it by clicking on this link:<br />[hyperlink to customers dashboard]<br /><br />Should you have any questions or need further clarification, feel free to reach out to us.<br /><br />Looking forward to the opportunity to work with you.<br /><br />Best regards,<br />[users company name]<br />[users company website is hyperlinked]<br />For any concerns, feel free to call us at [users phone number is hyperlinked]</span>,
                                  ] as React.ReactNode[]).map((note, idx) => (
                                    <div key={idx} className="flex gap-3">
                                      <span className="text-[#9473ff] flex-shrink-0 mt-0.5">✓</span>
                                      <p className="text-sm text-[#051046]">{note}</p>
                                    </div>
                                  ))}
                                </div>
                              );
                              setShowDevNotes(true);
                            }}
                            className="px-8 py-3 text-white rounded-[32px] font-semibold transition-colors"
                            style={{
                              backgroundColor: selectedItem.isServicePlanEstimate && !hasAcceptedServiceTerms ? '#c4b5fd' : '#9473ff',
                              cursor: selectedItem.isServicePlanEstimate && !hasAcceptedServiceTerms ? 'not-allowed' : 'pointer',
                            }}
                            onMouseOver={(e) => {
                              if (selectedItem.isServicePlanEstimate && !hasAcceptedServiceTerms) return;
                              e.currentTarget.style.backgroundColor = '#7f5fd9';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor =
                                selectedItem.isServicePlanEstimate && !hasAcceptedServiceTerms ? '#c4b5fd' : '#9473ff';
                            }}
                            disabled={selectedItem.isServicePlanEstimate && !hasAcceptedServiceTerms}
                          >
                            Approve
                          </button>
                        </div>
                        
                        {/* Note about approving */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-[15px]">
                          <p className="text-sm text-[#051046]">
                            <span className="font-semibold">Note:</span> By clicking "Approve," you accept this estimate and authorize us to proceed.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Status message for paid invoices */}
                    {selectedItem.type === 'invoice' && selectedItem.status === 'Paid' && (
                      <div className="bg-green-50 border-2 border-green-200 rounded-[15px] p-4 text-center">
                        <p className="text-green-700 font-semibold">
                          ✓ This invoice has been paid
                        </p>
                      </div>
                    )}

                    {/* Pay Now button for due invoices */}
                    {selectedItem.type === 'invoice' && selectedItem.status === 'Due' && (
                      <div className="flex gap-4 justify-end">
                        <button
                          onClick={handlePayNow}
                          className="px-8 py-3 text-white rounded-[32px] font-semibold transition-colors"
                          style={{ backgroundColor: '#9473ff' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                        >
                          Pay Now
                        </button>
                      </div>
                    )}
                    {selectedItem.type === 'invoice' && selectedItem.status === 'Refunded' && (
                      <div className="bg-[#fff1f6] border-2 border-[#ffb7cf] rounded-[15px] p-4 text-center">
                        <p className="font-semibold text-[#ff6493]">
                          This invoice has been refunded
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[600px]">
                  <p className="text-gray-400 text-lg">
                    Select an item from your inbox to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[20px] p-8 w-[500px]" style={{ border: '1px solid #e2e8f0', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: '#051046' }}>Decline Estimate</h3>
              <button
                onClick={() => {
                  setShowDeclineModal(false);
                  setDeclineReason('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
                Decline Reason
              </label>
              <select
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="w-full px-4 py-3 border rounded-[15px] text-sm"
                style={{ 
                  borderColor: '#e8e8e8',
                  borderWidth: '1px',
                  color: declineReason ? '#051046' : '#6b7280'
                }}
              >
                <option value="">Select reason</option>
                <option value="Price">Price</option>
                <option value="Competitor">Competitor</option>
                <option value="Scheduling">Scheduling</option>
                <option value="Communication">Communication</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeclineModal(false);
                  setDeclineReason('');
                }}
                className="px-6 py-2.5 border rounded-[32px] font-medium transition-colors"
                style={{ 
                  borderColor: '#e2e8f0',
                  color: '#051046',
                  backgroundColor: 'white'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (declineReason && selectedItem) {
                    // Update the status in the items array
                    setItems(items.map(item => 
                      item.id === selectedItem.id 
                        ? { ...item, status: 'Declined' as const }
                        : item
                    ));
                    // Update the selected item status
                    setSelectedItem({ ...selectedItem, status: 'Declined' });
                    setShowDeclineModal(false);
                    setDeclineReason('');
                    alert(`Estimate declined. Reason: ${declineReason}`);
                  } else {
                    alert('Please select a reason for declining.');
                  }
                }}
                className="px-6 py-2.5 text-white rounded-[32px] font-medium transition-colors"
                style={{ backgroundColor: '#9473ff' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Developer Notes Popup */}
      {showDevNotes && (
        <DeveloperNotesPopup
          title="Developer Notes — Approve Estimate"
          content={devNotesContent}
          onClose={() => setShowDevNotes(false)}
        />
      )}
    </div>
  );
}
