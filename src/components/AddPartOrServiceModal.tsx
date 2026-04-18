import { useState, useEffect } from 'react';
import { X, Box, Wrench, Plus } from 'lucide-react';

type ItemType = 'part' | 'service';

interface AddPartOrServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: {
    name: string;
    type: ItemType;
    quantity: number;
    sku: string;
    cost: string;
    markup: string;
    markupType: 'percentage' | 'dollar';
    price: string;
    taxable: string;
    category: string;
    brand: string;
    description: string;
  }) => void;
  customCategories?: string[];
  onAddCategory?: () => void;
}

export function AddPartOrServiceModal({ 
  isOpen, 
  onClose, 
  onSave,
  customCategories = [],
  onAddCategory 
}: AddPartOrServiceModalProps) {
  const [itemType, setItemType] = useState<ItemType>('part');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [sku, setSku] = useState('');
  const [cost, setCost] = useState('');
  const [markupType, setMarkupType] = useState<'percentage' | 'dollar'>('percentage');
  const [markupValue, setMarkupValue] = useState('');
  const [price, setPrice] = useState('');
  const [taxable, setTaxable] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [lastModified, setLastModified] = useState<'markup' | 'price' | null>(null);

  // Calculate price when cost or markup changes
  useEffect(() => {
    if (lastModified === 'markup') {
      const costNum = parseFloat(cost) || 0;
      const markupNum = parseFloat(markupValue) || 0;

      if (costNum > 0 && markupNum > 0) {
        let calculatedPrice = 0;
        if (markupType === 'percentage') {
          calculatedPrice = costNum + (costNum * (markupNum / 100));
        } else {
          calculatedPrice = costNum + markupNum;
        }
        setPrice(calculatedPrice.toFixed(2));
      }
    }
  }, [cost, markupType, markupValue, lastModified]);

  // Calculate markup percentage when price changes
  useEffect(() => {
    if (lastModified === 'price') {
      const costNum = parseFloat(cost) || 0;
      const priceNum = parseFloat(price) || 0;

      if (costNum > 0 && priceNum > 0) {
        const markupPercentage = ((priceNum - costNum) / costNum * 100);
        setMarkupType('percentage');
        setMarkupValue(markupPercentage.toFixed(2));
      }
    }
  }, [cost, price, lastModified]);

  const getAllCategories = () => {
    const baseCategories = itemType === 'part' 
      ? ['HVAC Parts', 'Plumbing', 'Electrical', 'Tools']
      : ['HVAC Services', 'Plumbing Services', 'Electrical Services', 'Maintenance'];
    return [...baseCategories, ...customCategories];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      name,
      type: itemType,
      quantity,
      sku,
      cost,
      markup: markupValue,
      markupType,
      price,
      taxable,
      category,
      brand,
      description,
    });

    // Reset form
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setItemType('part');
    setName('');
    setQuantity(0);
    setSku('');
    setCost('');
    setMarkupValue('');
    setPrice('');
    setTaxable('');
    setCategory('');
    setBrand('');
    setDescription('');
    setLastModified(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#051046]">Add Part or Service</h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-[10px]">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-[15px]">
          <p className="text-sm text-[#051046] mb-3 font-medium text-center">What are you adding?</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setItemType('part')}
              className={`flex-1 px-4 py-3 rounded-[32px] font-medium transition-colors flex items-center justify-center gap-2 ${
                itemType === 'part'
                  ? 'bg-[#9473ff] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#e8e8e8]'
              }`}
            >
              <Box className="w-4 h-4" />
              Parts/Products
            </button>
            <button
              type="button"
              onClick={() => setItemType('service')}
              className={`flex-1 px-4 py-3 rounded-[32px] font-medium transition-colors flex items-center justify-center gap-2 ${
                itemType === 'service'
                  ? 'bg-[#9473ff] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#e8e8e8]'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Service/Plans
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            {itemType === 'part' 
              ? 'Parts are physical items tracked in inventory (HVAC filters, pipes, etc.)'
              : 'Services and plans are the work or recurring offerings you provide (diagnostics, repairs, maintenance, memberships).'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder={itemType === 'part' ? 'Product name' : 'Service name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
            />
          </div>

          {/* Quantity - Only for parts */}
          {itemType === 'part' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#051046] mb-2">
                Initial Quantity
              </label>
              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                required
                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
              />
            </div>
          )}

          {/* SKU */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              SKU
            </label>
            <input
              type="text"
              placeholder="SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
            />
          </div>

          {/* Cost */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              {itemType === 'part' ? 'Unit Cost' : 'Service Cost'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                placeholder="0.00"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
                className="w-full pl-8 pr-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {itemType === 'part' ? 'What you pay for this part' : 'Your cost to provide this service (labor, overhead, etc.)'}
            </p>
          </div>

          {/* Markup */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Markup
            </label>
            <div className="flex gap-2">
              <select
                value={markupType}
                onChange={(e) => {
                  setMarkupType(e.target.value as 'percentage' | 'dollar');
                  setLastModified('markup');
                }}
                className="px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] text-gray-700"
              >
                <option value="percentage">%</option>
                <option value="dollar">$</option>
              </select>
              <input
                type="text"
                placeholder="0.00"
                value={markupValue}
                onChange={(e) => {
                  setMarkupValue(e.target.value);
                  setLastModified('markup');
                }}
                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Add your profit margin
            </p>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              {itemType === 'part' ? 'Customer Price' : 'Customer Price'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                placeholder="0.00"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setLastModified('price');
                }}
                required
                className="w-full pl-8 pr-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400 bg-purple-50"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This price will appear on invoices and estimates for customers
            </p>
          </div>

          {/* Taxable */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Taxable
            </label>
            <select
              value={taxable}
              onChange={(e) => setTaxable(e.target.value)}
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] text-gray-700"
            >
              <option value="">Select tax status...</option>
              <option value="taxable">Taxable</option>
              <option value="non-taxable">Non-Taxable</option>
              <option value="tax-exempt">Tax Exempt</option>
            </select>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] text-gray-700"
            >
              <option value="">Select category...</option>
              {getAllCategories().map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {onAddCategory && (
              <button 
                type="button" 
                className="mt-2 text-sm text-[#9473ff] hover:text-[#7f5fd9] font-medium" 
                onClick={onAddCategory}
              >
                + Add new category
              </button>
            )}
          </div>

          {/* Brand - Only for parts */}
          {itemType === 'part' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#051046] mb-2">
                Brand
              </label>
              <input
                type="text"
                placeholder="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
              />
            </div>
          )}

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Short, simple descriptions are recommended since these will be displayed in estimates and invoices for your clients.
            </p>
          </div>

          {/* Image - Only for parts */}
          {itemType === 'part' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#051046] mb-2">
                Image
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  Upload an image of the part<br />
                  (Optional)
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-[#e8e8e8] rounded-[15px] font-medium text-[#051046] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[32px] font-medium transition-colors"
            >
              Save {itemType === 'part' ? 'Part' : 'Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
