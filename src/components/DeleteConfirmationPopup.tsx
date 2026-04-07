import { X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function DeleteConfirmationPopup({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  message 
}: DeleteConfirmationPopupProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-[20px] border border-[#e2e8f0] p-8 max-w-md w-full relative"
        style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#FEF2F2' }}
          >
            <AlertTriangle className="w-8 h-8 text-[#f16a6a]" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-2" style={{ color: '#051046' }}>
          {title}
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 mb-6">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-2.5 border border-[#e8e8e8] text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-2.5 bg-[#f16a6a] text-white rounded-[32px] hover:bg-[#e05555] transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
