import { ArrowLeft } from 'lucide-react';
import './StaffAppPageHeading.css';

export function StaffAppPageHeading({ title, backLabel = 'Back to More', onBack }: {
  title: string; backLabel?: string; onBack: () => void;
}) {
  return <div className="sa-page-heading"><button type="button" onClick={onBack}><ArrowLeft size={16} />{backLabel}</button><h1>{title}</h1></div>;
}
