import { X } from 'lucide-react';

interface AddServicePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddServicePlanModal({ isOpen, onClose }: AddServicePlanModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-[20px] border border-[#e2e8f0] w-full max-w-md"
        style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e2e8f0]">
          <h2 className="text-xl font-semibold text-[#051046]">Add Service Plan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[#051046] mb-4">
            This will redirect to the Service Plans page where you can create a new service plan.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e2e8f0]">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-[#e8e8e8] text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // In a real app, this would navigate to the Service Plans page
                alert('Redirecting to Service Plans page...');
                onClose();
              }}
              className="px-6 py-2.5 bg-[#10b981] text-white rounded-[32px] hover:bg-[#059669] transition-colors"
            >
              Go to Service Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
