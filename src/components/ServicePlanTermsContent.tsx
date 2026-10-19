const RICH_TEXT_PREFIX = 'klervo-rich-terms:';
const allowedTags = new Set(['P', 'DIV', 'SPAN', 'BR', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'STRONG', 'B', 'EM', 'I', 'U', 'UL', 'OL', 'LI']);

export function sanitizeTermsHtml(html: string): string {
  const template = document.createElement('template');
  template.innerHTML = html;
  const clean = (parent: Node) => {
    for (const child of Array.from(parent.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) continue;
      if (!(child instanceof HTMLElement)) { child.remove(); continue; }
      if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT'].includes(child.tagName)) { child.remove(); continue; }
      // Word and Google Docs often express inline formatting with styled spans.
      // Convert those styles to semantic markup before removing attributes.
      const style = child.style;
      const fontSize = style.fontSize;
      const wrappers: string[] = [];
      if (style.fontWeight === 'bold' || Number.parseInt(style.fontWeight, 10) >= 600) wrappers.push('strong');
      if (style.fontStyle === 'italic') wrappers.push('em');
      if (style.textDecoration.includes('underline') || style.textDecorationLine.includes('underline')) wrappers.push('u');
      for (const tag of wrappers) {
        const wrapper = document.createElement(tag);
        wrapper.append(...Array.from(child.childNodes));
        child.append(wrapper);
      }
      clean(child);
      if (!allowedTags.has(child.tagName)) {
        child.replaceWith(...Array.from(child.childNodes));
      } else {
        for (const attribute of Array.from(child.attributes)) child.removeAttribute(attribute.name);
        if (/^\d+(?:\.\d+)?(?:px|pt|em|rem)$/.test(fontSize)) {
          child.style.fontSize = `clamp(10px, ${fontSize}, 48px)`;
        } else if (/^clamp\(10px, \d+(?:\.\d+)?(?:px|pt|em|rem), 48px\)$/.test(fontSize)) {
          child.style.fontSize = fontSize;
        }
      }
    }
  };
  clean(template.content);
  return template.innerHTML;
}

export function termsToHtml(value: string): string {
  if (value.startsWith(RICH_TEXT_PREFIX)) return sanitizeTermsHtml(value.slice(RICH_TEXT_PREFIX.length));
  const container = document.createElement('div');
  container.textContent = value;
  return container.innerHTML.replace(/\r?\n/g, '<br>');
}

export function htmlToTerms(html: string): string {
  const clean = sanitizeTermsHtml(html);
  const container = document.createElement('div');
  container.innerHTML = clean;
  return container.textContent?.trim() ? RICH_TEXT_PREFIX + clean : '';
}

export function hasServicePlanTerms(value: string): boolean {
  const container = document.createElement('div');
  container.innerHTML = termsToHtml(value);
  return Boolean(container.textContent?.replace(/[\s\u200B-\u200D\uFEFF]/g, ''));
}

export const termsTextClasses = 'text-sm text-[#051046] break-words [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:mb-2 [&_h5]:font-semibold [&_h5]:mb-2 [&_h6]:font-semibold [&_h6]:mb-2 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6';

export function ServicePlanTermsContent({ value }: { value: string }) {
  return <div className={termsTextClasses} dangerouslySetInnerHTML={{ __html: termsToHtml(value) }} />;
}
