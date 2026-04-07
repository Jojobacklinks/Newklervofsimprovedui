import { CheckCircle } from 'lucide-react';

interface SuccessPopupProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export function SuccessPopup({ isOpen, title, description, onClose }: SuccessPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-8 max-w-md w-full" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#b9df10] rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        
        {/* Message */}
        <h3 className="text-xl font-semibold text-[#051046] mb-3 text-center">
          {title}
        </h3>
        <p className="text-sm text-[#051046] leading-relaxed mb-6 text-center">
          {description}
        </p>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="w-full px-6 py-2.5 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
