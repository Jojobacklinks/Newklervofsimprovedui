import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface ActionAlertPopupProps {
  isOpen: boolean;
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export function ActionAlertPopup({ isOpen, type, message, onClose }: ActionAlertPopupProps) {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4" role="alertdialog" aria-modal="true" aria-labelledby="action-alert-title" aria-describedby="action-alert-message">
      <div className="relative w-full max-w-md rounded-[20px] border border-[#e2e8f0] bg-white p-8" style={{ boxShadow: 'rgba(15, 23, 42, 0.18) 0px 16px 48px' }}>
        <button type="button" onClick={onClose} className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600" aria-label="Close alert">
          <X className="h-5 w-5" />
        </button>
        <div className="mb-5 flex justify-center">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full ${isSuccess ? 'bg-[#eef9c7]' : 'bg-red-50'}`}>
            {isSuccess ? <CheckCircle2 className="h-9 w-9 text-[#86a800]" /> : <AlertCircle className="h-9 w-9 text-[#f16a6a]" />}
          </div>
        </div>
        <h2 id="action-alert-title" className="mb-2 text-center text-xl font-semibold text-[#051046]">
          {isSuccess ? 'Action completed' : 'Action could not be completed'}
        </h2>
        <p id="action-alert-message" className="mb-6 text-center text-sm leading-6 text-gray-600">{message}</p>
        <button type="button" onClick={onClose} autoFocus className={`w-full rounded-[32px] px-6 py-2.5 font-medium text-white transition-colors ${isSuccess ? 'bg-[#9473ff] hover:bg-[#7f5fd9]' : 'bg-[#f16a6a] hover:bg-[#e05555]'}`}>
          Close
        </button>
      </div>
    </div>
  );
}
