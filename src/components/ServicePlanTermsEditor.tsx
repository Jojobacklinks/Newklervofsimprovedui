import { useEffect, useId, useRef, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, RemoveFormatting } from 'lucide-react';
import { hasServicePlanTerms, htmlToTerms, sanitizeTermsHtml, termsToHtml, termsTextClasses } from './ServicePlanTermsContent';

const TERMS_KEY = 'klervo-service-plan-default-terms';

export function getDefaultServicePlanTerms(): string {
  try {
    return window.localStorage.getItem(TERMS_KEY) || '';
  } catch {
    return '';
  }
}

export function ServicePlanTermsEditor({ value, onChange, onSave }: { value: string; onChange: (value: string) => void; onSave?: () => void }) {
  const id = useId();
  const [editing, setEditing] = useState(Boolean(onSave) || !value);
  const [message, setMessage] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const [blockStyle, setBlockStyle] = useState('p');

  function rememberSelection() {
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) {
      selectionRef.current = selection.getRangeAt(0).cloneRange();
      let element = selection.anchorNode instanceof Element ? selection.anchorNode : selection.anchorNode?.parentElement;
      while (element && element !== editorRef.current) {
        const tag = element.tagName.toLowerCase();
        if (['p', 'h1', 'h2', 'h3'].includes(tag)) { setBlockStyle(tag); return; }
        element = element.parentElement;
      }
      setBlockStyle('p');
    }
  }

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && htmlToTerms(editor.innerHTML) !== value) {
      editor.innerHTML = termsToHtml(value);
    }
  }, [value]);

  function format(command: string, argument?: string) {
    editorRef.current?.focus();
    if (selectionRef.current && editorRef.current?.contains(selectionRef.current.commonAncestorContainer)) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(selectionRef.current);
    }
    document.execCommand(command, false, argument);
    if (editorRef.current) onChange(htmlToTerms(editorRef.current.innerHTML));
    rememberSelection();
    setMessage('');
  }

  function saveDefault() {
    if (!hasServicePlanTerms(value)) {
      setMessage('Please enter your terms of service.');
      editorRef.current?.focus();
      return;
    }
    try {
      if (onSave) { onSave(); return; }
      window.localStorage.setItem(TERMS_KEY, value);
      setEditing(false);
      setMessage('Saved for future service plans in this browser.');
    } catch {
      setMessage('Unable to save terms. Please check your browser storage settings and try again.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <span id={`${id}-label`} className="text-sm font-medium text-[#051046]">Terms of Service <span className="text-red-500">*</span></span>
        {!editing && <button type="button" onClick={() => { setEditing(true); setMessage(''); }} className="text-sm font-medium text-[#8b5cf6]">Edit Terms</button>}
      </div>
      <p className="text-xs text-gray-500 mb-3">These terms will appear in the customer portal when the customer views their service plan and job estimates and invoices. You are responsible for providing and maintaining this content. Klervo is not responsible for the terms you provide.</p>
      {editing && (
        <div role="toolbar" aria-label="Terms formatting" className="flex flex-wrap items-center gap-1 border border-[#e8e8e8] rounded-t-[15px] p-2 bg-gray-50">
          <select aria-label="Paragraph style" value={blockStyle} onChange={(event) => { format('formatBlock', event.target.value); setBlockStyle(event.target.value); }} className="bg-white border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option value="p">Body text</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>
          <span aria-hidden="true" className="h-6 border-l border-gray-200 mx-2" />
          {[
            { label: 'Bold', command: 'bold', Icon: Bold },
            { label: 'Italic', command: 'italic', Icon: Italic },
            { label: 'Underline', command: 'underline', Icon: Underline },
            { label: 'Bullet list', command: 'insertUnorderedList', Icon: List },
            { label: 'Numbered list', command: 'insertOrderedList', Icon: ListOrdered },
            { label: 'Clear text formatting', command: 'removeFormat', Icon: RemoveFormatting },
          ].map(({ label, command, Icon }) => (
            <button key={label} type="button" title={label} aria-label={label} onMouseDown={(event) => event.preventDefault()} onClick={() => format(command)} className="p-2 rounded-lg text-[#051046] hover:bg-purple-100 focus-visible:outline-purple-600"><Icon className="w-4 h-4" /></button>
          ))}
        </div>
      )}
      <div
        id={id}
        ref={editorRef}
        role="textbox"
        aria-labelledby={`${id}-label`}
        aria-multiline="true"
        aria-required="true"
        aria-readonly={!editing}
        contentEditable={editing}
        suppressContentEditableWarning
        onBlur={rememberSelection}
        onMouseUp={rememberSelection}
        onKeyUp={rememberSelection}
        onInput={(event) => { onChange(htmlToTerms(event.currentTarget.innerHTML)); rememberSelection(); setMessage(''); }}
        onPaste={(event) => {
          event.preventDefault();
          const html = event.clipboardData.getData('text/html');
          if (html) {
            format('insertHTML', sanitizeTermsHtml(html));
          } else {
            format('insertText', event.clipboardData.getData('text/plain'));
          }
        }}
        data-placeholder="Enter your terms of service..."
        className={`w-full min-h-[220px] max-h-[440px] overflow-y-auto px-4 py-4 leading-relaxed border border-[#e8e8e8] focus:outline-none focus:ring-2 focus:ring-purple-600 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 ${editing ? 'rounded-b-[15px] bg-white' : 'rounded-[15px] bg-gray-50'} ${termsTextClasses}`}
      />
      <div className="flex flex-col items-end gap-2 mt-2 text-right">
        {editing && <p className="text-xs text-gray-500">Save these terms to make them available when creating estimates and invoices.</p>}
        {editing && <button type="button" onClick={saveDefault} className="px-4 py-2 bg-[#9473ff] text-white text-sm rounded-[60px] hover:bg-[#7f5fd9]">{onSave ? 'Save Terms Of Service' : 'Save for Future Plans'}</button>}
      </div>
      <p role="status" className="text-xs text-[#051046] mt-2">{message}</p>
    </div>
  );
}
