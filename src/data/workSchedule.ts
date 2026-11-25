export const technicians = ['Mike Bailey', 'John Tom', 'Sarah Wilson', 'David Chen'];
export type Shift = { start: string; end: string };
export type WorkSchedule = Record<string, Record<string, Shift | null>>;
const storageKey = 'klervo.workSchedule.v1';

export function dateKey(date: Date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map(part => String(part).padStart(2, '0')).join('-');
}

export function addDays(day: string, days: number) {
  const date = new Date(day + 'T12:00');
  date.setDate(date.getDate() + days);
  return dateKey(date);
}

export function weekStart(day: string) {
  const weekday = new Date(day + 'T12:00').getDay();
  return addDays(day, -((weekday + 6) % 7));
}

export function readWorkSchedule(): WorkSchedule {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) return JSON.parse(stored);
  } catch {
    // A fresh preview is still available when browser storage is unavailable.
  }

  const monday = weekStart(dateKey(new Date()));
  const schedule: WorkSchedule = {};
  for (let offset = -7; offset < 7; offset++) {
    const weekday = (offset + 7) % 7;
    schedule[addDays(monday, offset)] = {
      'Mike Bailey': weekday < 5 ? { start: '07:00', end: '15:00' } : null,
      'John Tom': weekday < 5 ? { start: '09:00', end: '17:00' } : null,
      'Sarah Wilson': [0, 1, 3, 4].includes(weekday) ? { start: '08:00', end: '16:00' } : null,
      'David Chen': weekday > 1 && weekday < 6 ? { start: '10:00', end: '18:00' } : null,
    };
  }
  return schedule;
}

export function saveWorkSchedule(schedule: WorkSchedule) {
  localStorage.setItem(storageKey, JSON.stringify(schedule));
}

export function formatShiftTime(time: string) {
  return new Date('2000-01-01T' + time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function workScheduleStatus(
  schedule: WorkSchedule,
  technician: string,
  start: string,
  end: string,
) {
  const [day, time] = start.split('T');
  const [endDay, endTime] = end.split('T');
  if (!day || !time || !endDay || !endTime || end <= start) return 'Set job times to check';

  const shift = schedule[day]?.[technician];
  return shift && day === endDay && time >= shift.start && endTime <= shift.end
    ? 'On work schedule'
    : 'Outside work schedule';
}
