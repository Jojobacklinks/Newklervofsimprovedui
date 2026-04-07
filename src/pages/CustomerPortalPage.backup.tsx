import { useState } from 'react';
import { Phone, X } from 'lucide-react';

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
  date: string;
  status: 'Estimate' | 'DUE' | 'PAID';
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
}

export default function CustomerPortalPage() {
  const [selectedItem, setSelectedItem] = useState<EstimateInvoice | null>(null);

  // Mock data - this would come from backend
  const items: EstimateInvoice[] = [
    {
      id: 'EST-001',
      type: 'estimate',
      date: '2026-02-20',
      status: 'Estimate',
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
    },
    {
      id: 'INV-045',
      type: 'invoice',
      date: '2026-02-15',
      status: 'DUE',
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
      date: '2026-02-10',
      status: 'PAID',
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
      status: 'Estimate',
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
      date: '2026-02-22',
      status: 'DUE',
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
  ];

  const handleViewNow = (item: EstimateInvoice) => {
    setSelectedItem(item);
  };

  const handleApprove = () => {
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
      case 'Estimate':
        return 'bg-blue-100 text-blue-700';
      case 'DUE':
        return 'bg-orange-100 text-orange-700';
      case 'PAID':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b" style={{ borderColor: '#e2e8f0' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold" style={{ color: '#051046' }}>
            My Plumber Company
          </h1>
          <button className="flex items-center gap-2 px-6 py-2.5 text-white rounded-[32px] transition-colors"
            style={{ backgroundColor: '#9473ff' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}>
            <Phone className="w-4 h-4" />
            Call Us
          </button>
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
                    className="bg-white rounded-[20px] p-4 shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                    style={{ borderColor: '#e2e8f0' }}
                    onClick={() => handleViewNow(item)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-sm" style={{ color: '#051046' }}>
                          {item.id}
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
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-sm mb-3" style={{ color: '#051046' }}>
                      {item.jobDescription}
                    </p>

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
                  <div className="border-b px-8 py-6 flex items-center justify-between" style={{ borderColor: '#e2e8f0' }}>
                    <div className="flex-1"></div>
                    <h2 className="text-xl font-bold text-center" style={{ color: '#051046' }}>
                      {selectedItem.type === 'estimate' ? 'ESTIMATE' : 'INVOICE'}
                    </h2>
                    <div className="flex-1 flex justify-end">
                      {selectedItem.type === 'invoice' && selectedItem.status === 'DUE' && (
                        <button
                          onClick={handlePayNow}
                          className="px-8 py-2.5 text-white rounded-[32px] font-semibold transition-colors"
                          style={{ backgroundColor: '#9473ff' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
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
                            value={selectedItem.id} 
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
                                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${lineItem.taxable ? 'bg-[#A6E4FA] text-[#3d424d]' : 'bg-[#FFDBE6] text-[#3d424d]'}`}>
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
                    {selectedItem.type === 'estimate' && (
                      <div className="flex gap-4 justify-end">
                        <button
                          onClick={handleDecline}
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
                          onClick={handleApprove}
                          className="px-8 py-3 text-white rounded-[32px] font-semibold transition-colors"
                          style={{ backgroundColor: '#9473ff' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                        >
                          Approve
                        </button>
                      </div>
                    )}

                    {/* Status message for paid invoices */}
                    {selectedItem.type === 'invoice' && selectedItem.status === 'PAID' && (
                      <div className="bg-green-50 border-2 border-green-200 rounded-[15px] p-4 text-center">
                        <p className="text-green-700 font-semibold">
                          ✓ This invoice has been paid
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
    </div>
  );
}
