import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { AddCustomValueModal } from './AddCustomValueModal';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient?: (client: {
    name: string;
    company: string;
    servicePlan: string;
    tags: string[];
    address: string;
    phone: string;
    email: string;
  }) => void;
  onSave?: (client: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    company?: string;
    tags?: string[];
  }) => void;
}

export function AddClientModal({ isOpen, onClose, onAddClient, onSave }: AddClientModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    email: '',
    address: '',
    tags: [] as string[],
    smsConsent: false,
  });

  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [isCustomValueModalOpen, setIsCustomValueModalOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState(['VIP', 'Commercial', 'Residential', 'New', 'Regular', 'Priority']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If using onSave (for Job/Schedule modals - from Add New button)
    if (onSave) {
      onSave({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        company: formData.company,
        tags: formData.tags,
      });
    }
    
    // If using onAddClient (for Clients page - from Add Client button)
    if (onAddClient) {
      onAddClient({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        company: formData.company,
        servicePlan: '',
        tags: formData.tags,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
      });
    }

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      company: '',
      phone: '',
      email: '',
      address: '',
      tags: [],
      smsConsent: false,
    });
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div
        className="bg-white rounded-[20px] border border-[#e2e8f0] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e2e8f0]">
          <h2 className="text-xl font-semibold text-[#051046]">Add client</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-[#051046] mb-2">
              First Name
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#051046]"
              placeholder="First name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Last name
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#051046]"
              placeholder="Last name"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Company name
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#051046]"
              placeholder="Company name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Phone
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#051046]"
              placeholder="Phone"
            />
          </div>

          {/* SMS Consent Checkbox */}
          <div className="mt-3 p-3 bg-gray-50 rounded-[15px] border border-gray-200">
            <div className="flex items-start gap-2 mb-2">
              <input
                type="checkbox"
                id="smsConsent"
                required
                checked={formData.smsConsent}
                onChange={(e) => setFormData({ ...formData, smsConsent: e.target.checked })}
                className="mt-0.5 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-600"
              />
              <label htmlFor="smsConsent" className="text-xs text-[#051046]">
                <span className="text-red-500">*</span> Customer consent obtained for service-related text messages. <span className="text-red-500 font-medium">(Required)</span>
              </label>
            </div>
            <div className="text-[10px] text-gray-600 leading-relaxed">
              <strong>Important:</strong> You are responsible for obtaining and documenting customer consent before sending text messages. Klervo does not obtain consent on your behalf. You must provide the required consent language to your customer and comply with all applicable SMS, privacy, and consumer protection laws.
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#051046]"
              placeholder="Email"
            />
          </div>

          {/* Google Maps Embed */}
          <div className="rounded-[15px] overflow-hidden border border-[#e8e8e8]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Address
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#051046]"
              placeholder="Address"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Tags
            </label>
            <div className="relative">
              <div 
                onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                className="w-full min-h-[40px] px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm cursor-pointer focus-within:ring-2 focus-within:ring-purple-600 flex flex-wrap gap-2 items-center"
              >
                {formData.tags.length > 0 ? (
                  formData.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center bg-gray-200 text-[#051046] text-xs px-2.5 py-1 rounded-md">
                      {tag}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData(prev => ({
                            ...prev,
                            tags: prev.tags.filter(t => t !== tag)
                          }));
                        }}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-[#051046]">Choose some options...</span>
                )}
              </div>
              {isTagDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsTagDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e8e8e8] rounded-[15px] shadow-lg z-20">
                    {availableTags.map(tag => (
                      <div 
                        key={tag} 
                        onClick={() => handleTagToggle(tag)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                      >
                        <input
                          type="checkbox"
                          checked={formData.tags.includes(tag)}
                          onChange={() => {}}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-600 pointer-events-none"
                        />
                        <span className="ml-2 text-sm text-[#051046]">{tag}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button
              type="button"
              className="mt-1 text-xs hover:underline"
              style={{ color: '#9473ff' }}
              onClick={() => setIsCustomValueModalOpen(true)}
            >
              + Add Tag
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 border border-[#e8e8e8] text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <AddCustomValueModal
        isOpen={isCustomValueModalOpen}
        onClose={() => setIsCustomValueModalOpen(false)}
        onSave={(value) => {
          setAvailableTags([...availableTags, value]);
          handleTagToggle(value);
        }}
        title="Add New Tag"
        placeholder="Enter tag name..."
      />
    </div>
  );
}
