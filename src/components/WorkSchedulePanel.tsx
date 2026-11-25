import { useState } from 'react';
import { ChevronLeft, ChevronRight, Copy, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import {
  addDays, dateKey, formatShiftTime, readWorkSchedule, saveWorkSchedule,
  technicians, weekStart,
} from '../data/workSchedule';
import type { Shift, WorkSchedule } from '../data/workSchedule';

const control = 'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50';
const primary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#6242c5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5336ac]';
const field = 'mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm';
const dateLabel = (day: string, options: Intl.DateTimeFormatOptions) =>
  new Date(day + 'T12:00').toLocaleDateString([], options);
const shortDate = { month: 'short', day: 'numeric' } as const;
const shiftLabel = (shift: Shift) => formatShiftTime(shift.start) + ' – ' + formatShiftTime(shift.end);

export function WorkSchedulePanel() {
  const today = dateKey(new Date());
  const [schedule, setSchedule] = useState(readWorkSchedule);
  const [monday, setMonday] = useState(() => weekStart(today));
  const [editing, setEditing] = useState<{ day: string; technician: string; shift: Shift; off: boolean } | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const days = Array.from({ length: 7 }, (_, index) => addDays(monday, index));

  function persist(next: WorkSchedule, message: string) {
    try {
      saveWorkSchedule(next);
      setSchedule(next);
      setNotice(message);
      setError('');
      return true;
    } catch {
      setError('Browser storage is unavailable. Your changes could not be saved.');
      return false;
    }
  }

  function edit(date: string, technician: string) {
    const shift = schedule[date]?.[technician];
    setError('');
    setEditing({ day: date, technician, shift: shift ?? { start: '09:00', end: '17:00' }, off: shift === null });
  }

  function copyWeek() {
    const next = { ...schedule };
    let copied = 0;
    for (const date of days) {
      const previous = schedule[addDays(date, -7)] ?? {};
      const current = { ...schedule[date] };
      for (const technician of technicians) {
        if (current[technician] === undefined && previous[technician] !== undefined) {
          current[technician] = previous[technician];
          copied++;
        }
      }
      next[date] = current;
    }
    if (!copied) {
      setNotice('There are no empty cells with a matching shift or day off last week.');
      return;
    }
    persist(next, 'Copied ' + copied + ' entries into empty cells.');
  }

  return (
    <div className="space-y-4 text-[#051046]">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Work Schedule</h2>
        <button className={control} onClick={copyWeek}><Copy size={16} /> Copy last week</button>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-4">
          <h3 className="text-lg font-semibold">
            {dateLabel(monday, shortDate)} – {dateLabel(days[6], { ...shortDate, year: 'numeric' })}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <button className={control} aria-label="Previous week" onClick={() => { setMonday(addDays(monday, -7)); setNotice(''); }}><ChevronLeft size={16} /></button>
            <button className={control} aria-label="Next week" onClick={() => { setMonday(addDays(monday, 7)); setNotice(''); }}><ChevronRight size={16} /></button>
            <button className={control} onClick={() => { setMonday(weekStart(today)); setNotice(''); }}>Today</button>
          </div>
        </div>
        {notice && <p role="status" className="px-4 pt-3 text-sm text-[#6242c5]">{notice}</p>}
        {error && !editing && <p role="alert" className="px-4 pt-3 text-sm text-red-700">{error}</p>}

        <div className="overflow-x-auto p-4" tabIndex={0} aria-label="Weekly shift grid">
          <table className="w-full min-w-[850px] border-collapse text-left text-sm">
            <thead><tr className="bg-slate-50">
              <th scope="col" className="sticky left-0 z-10 bg-slate-50 p-3">Technician</th>
              {days.map(date => (
                <th
                  scope="col"
                  key={date}
                  aria-label={dateLabel(date, { weekday: 'long', ...shortDate })}
                  aria-current={date === today ? 'date' : undefined}
                  className={'p-3 text-center ' + (date === today ? 'bg-[#eee8ff] text-[#6242c5]' : '')}
                >
                  {dateLabel(date, { weekday: 'short' })}
                </th>
              ))}
            </tr></thead>
            <tbody>{technicians.map(technician => (
              <tr key={technician} className="border-b border-slate-100">
                <th scope="row" className="sticky left-0 z-10 whitespace-nowrap bg-white p-3">{technician}</th>
                {days.map(date => {
                  const shift = schedule[date]?.[technician];
                  const label = shift ? shiftLabel(shift) : shift === null ? 'Off' : 'Add shift';
                  return <td className={'p-1.5 ' + (date === today ? 'bg-[#f7f3ff]' : '')} key={date}>
                    <button aria-label={technician + ', ' + dateLabel(date, shortDate) + ', ' + label} onClick={() => edit(date, technician)}
                      className={'flex min-h-14 w-full items-center justify-center gap-1 rounded-xl px-2 py-2 text-center text-xs font-medium hover:ring-2 hover:ring-[#9473ff] ' +
                        (shift ? 'bg-[#f0ebff] text-[#5336ac]' : 'bg-slate-50 text-slate-600')}>
                      {shift === undefined && <Plus size={14} />}{label}
                    </button>
                  </td>;
                })}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <Dialog open={Boolean(editing)} onOpenChange={open => { if (!open) { setEditing(null); setError(''); } }}>
        {editing && <DialogContent className="bg-white text-[#051046]">
          <DialogTitle>{editing.technician}</DialogTitle>
          <DialogDescription>{dateLabel(editing.day, { weekday: 'long', ...shortDate })}</DialogDescription>
          <form className="space-y-4" onSubmit={event => {
            event.preventDefault();
            if (!editing.off && editing.shift.start >= editing.shift.end) {
              setError('Choose an end time after the shift starts.');
              return;
            }
            const entry = editing.off ? null : editing.shift;
            if (persist({ ...schedule, [editing.day]: { ...schedule[editing.day], [editing.technician]: entry } }, 'Schedule updated.')) {
              setEditing(null);
            }
          }}>
            <label className="block text-sm font-medium">Status
              <select className={field} value={editing.off ? 'off' : 'working'} onChange={event => setEditing({ ...editing, off: event.target.value === 'off' })}>
                <option value="working">Working</option><option value="off">Day off</option>
              </select>
            </label>
            {!editing.off && <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-medium">Start time<input required className={field} type="time" value={editing.shift.start} onChange={event => setEditing({ ...editing, shift: { ...editing.shift, start: event.target.value } })} /></label>
              <label className="text-sm font-medium">End time<input required className={field} type="time" value={editing.shift.end} onChange={event => setEditing({ ...editing, shift: { ...editing.shift, end: event.target.value } })} /></label>
            </div>}
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" className={control} onClick={() => { setEditing(null); setError(''); }}>Cancel</button>
              <button className={primary} type="submit">Save schedule</button>
            </div>
          </form>
        </DialogContent>}
      </Dialog>
    </div>
  );
}
