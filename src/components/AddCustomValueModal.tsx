import { X } from 'lucide-react';
import { useState } from 'react';

interface AddCustomValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  title: string;
  placeholder?: string;
}

export function AddCustomValueModal({ 
  isOpen, 
  onClose, 
  onSave, 
  title,
  placeholder = "Enter custom value..." 
}: AddCustomValueModalProps) {
  const [value, setValue] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (value.trim()) {
      onSave(value.trim());
      setValue('');
      onClose();
    }
  };

  const handleCancel = () => {
    setValue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-[20px] w-full max-w-md border border-[#e2e8f0]">
        {/* Header */}
        <div className="border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#051046]">{title}</h3>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#051046]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            placeholder={placeholder}
            autoFocus
            className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-[#e2e8f0] px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-[#051046] hover:bg-gray-50 rounded-[15px] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!value.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}