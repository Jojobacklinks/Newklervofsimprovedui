import { useEffect, useRef, useId } from 'react';
import { FileText, X } from 'lucide-react';

export function StaffAppDocumentPreview({ type, onClose }: { type: 'Estimate' | 'Invoice' | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (type && !dialog.current?.open) dialog.current?.showModal();
    else if (!type && dialog.current?.open) dialog.current.close();
  }, [type]);
  return <dialog ref={dialog} className="sa-status-dialog sa-document-preview" aria-labelledby={titleId} onClose={onClose} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
    <div className="sa-status-title"><h2 id={titleId}>{type} preview</h2><button type="button" aria-label="Close preview" onClick={() => dialog.current?.close()}><X size={18} /></button></div>
    <FileText size={42} className="sa-document-preview-icon" aria-hidden="true" />
    <p className="sa-muted">Implement same function as in the browser.</p>
    <button type="button" className="sa-primary sa-full" onClick={() => dialog.current?.close()}>OK</button>
  </dialog>;
}
