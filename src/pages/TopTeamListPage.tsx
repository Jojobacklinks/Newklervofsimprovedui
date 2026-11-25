import { useEffect, useState } from 'react';
import { ArrowLeft, Maximize, Minimize } from 'lucide-react';
import { Link } from 'react-router';
import { technicianKpis } from '../data/teamReportData';
import technicianPortraits from '../assets/leaderboard-technicians.png';

const rankedMembers = [
  { ...technicianKpis.michaelChen, name: 'Mike Bailey', portraitPosition: 'left top' },
  { ...technicianKpis.sarahJohnson, name: 'Alex Rivera', portraitPosition: 'right top' },
  { ...technicianKpis.davidMartinez, name: 'David Chen', portraitPosition: 'left bottom' },
  { ...technicianKpis.emmaWilliams, name: 'John Tom', portraitPosition: 'right bottom' },
].sort((first, second) => second.satisfaction - first.satisfaction || second.jobs - first.jobs);

const metrics = [
  { key: 'jobs', label: 'Jobs', unit: '' },
  { key: 'satisfaction', label: 'Customer satisfaction', unit: '%' },
  { key: 'lateArrival', label: 'Late arrivals', unit: '%' },
] as const;

export function TopTeamListPage() {
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement));
  const [fullscreenError, setFullscreenError] = useState(false);

  useEffect(() => {
    const sync = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  async function toggleFullscreen() {
    setFullscreenError(false);
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setFullscreenError(true);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f2fc] px-4 py-6 text-[#051046] sm:px-8 lg:px-12 lg:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/team" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6242c5] hover:underline">
          <ArrowLeft size={18} aria-hidden="true" /> Back to Team
        </Link>
        {document.fullscreenEnabled && (
          <button type="button" onClick={toggleFullscreen} className="inline-flex items-center gap-2 rounded-full border border-[#d9caff] bg-white px-4 py-2 text-sm font-semibold text-[#6242c5] hover:bg-purple-50">
            {fullscreen ? <Minimize size={18} aria-hidden="true" /> : <Maximize size={18} aria-hidden="true" />}
            {fullscreen ? 'Exit full screen' : 'Full screen'}
          </button>
        )}
      </div>
      {fullscreenError && <p role="status" className="mt-3 text-right text-sm text-slate-600">Full screen is unavailable in this browser window.</p>}

      <header className="mb-6 mt-4 lg:mb-8">
        <h1 className="text-4xl font-bold tracking-tight lg:text-[clamp(3rem,4vw,5rem)]">Top Team List</h1>
        <p className="mt-2 text-sm text-slate-700 lg:text-xl">Ranked by customer satisfaction · Sample Reports data</p>
      </header>

      <ol className="space-y-3 lg:space-y-4">
        {rankedMembers.map((member, index) => (
          <li
            key={member.name}
            className={'grid items-center gap-4 rounded-[24px] border p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] lg:px-8 ' +
              (index === 0 ? 'border-[#c7b6fa] bg-[#ebe3ff]' : 'border-[#e3dcef] bg-white')}
          >
            <div className="flex min-w-0 items-center gap-3 lg:gap-6">
              <span aria-label={'Rank ' + (index + 1)} className="min-w-8 shrink-0 text-center text-2xl font-bold text-[#6242c5] lg:min-w-12 lg:text-[clamp(2.25rem,3.2vw,4rem)]">
                {index + 1}
              </span>
              <div
                aria-hidden="true"
                className="size-14 shrink-0 rounded-full bg-white bg-no-repeat lg:size-[clamp(4.5rem,6vw,7.5rem)]"
                style={{ backgroundImage: `url(${technicianPortraits})`, backgroundPosition: member.portraitPosition, backgroundSize: '200% 200%' }}
              />
              <h2 className="min-w-0 break-words text-xl font-semibold lg:text-[clamp(1.6rem,2.4vw,3rem)]">{member.name}</h2>
            </div>
            <dl className="grid grid-cols-3 gap-2 border-t border-[#e3dcef] pt-3 text-center md:border-t-0 md:pt-0 lg:gap-6">
              {metrics.map(metric => (
                <div key={metric.key} className="flex min-w-0 flex-col-reverse gap-1">
                  <dt className="text-xs text-slate-700 lg:text-[clamp(0.9rem,1.2vw,1.25rem)]">{metric.label}</dt>
                  <dd className={'text-2xl font-semibold tabular-nums lg:text-[clamp(2.1rem,3vw,4rem)] ' +
                    (metric.key === 'satisfaction' ? 'text-[#6242c5]' : '')}>{member[metric.key]}{metric.unit}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ol>
    </main>
  );
}
