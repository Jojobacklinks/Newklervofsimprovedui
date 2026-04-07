import { X } from 'lucide-react';

interface DeveloperNotesPopupProps {
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
  isOpen?: boolean;
  content?: React.ReactNode;
}

export function DeveloperNotesPopup({ title, onClose, children, isOpen = true, content }: DeveloperNotesPopupProps) {
  if (!isOpen) return null;
  
  const displayContent = content || children;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div 
        className="bg-[#f5f5f5] rounded-[20px] border border-[#e2e8f0] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e2e8f0] bg-white">
          <h2 className="font-semibold text-[#051046]" style={{ fontSize: '16px' }}>Create Invoice</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6" style={{ fontSize: '12px' }}>
          {displayContent}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#e2e8f0] bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#9473ff] text-white rounded-[20px] hover:bg-[#7f5fd9] transition-colors font-medium"
            style={{ fontSize: '14px' }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}