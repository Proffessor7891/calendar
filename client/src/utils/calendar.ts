export const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

export const getFirstDayOfMonth = (year: number, month: number): number =>
  new Date(year, month, 1).getDay();

export const formatDate = (year: number, month: number, day: number): string => {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
};

export const formatMonth = (year: number, month: number): string => {
  const m = String(month + 1).padStart(2, '0');
  return `${year}-${m}`;
};

export const getMonthName = (month: number): string =>
  new Date(2000, month, 1).toLocaleString('en-US', { month: 'long' });

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const buildCalendarDays = (year: number, month: number): CalendarDay[] => {
  const today = new Date();
  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days: CalendarDay[] = [];

  // Previous month padding
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrev = getDaysInMonth(prevYear, prevMonth);
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrev - i;
    const date = formatDate(prevYear, prevMonth, day);
    days.push({ date, day, isCurrentMonth: false, isToday: date === todayStr });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = formatDate(year, month, d);
    days.push({ date, day: d, isCurrentMonth: true, isToday: date === todayStr });
  }

  // Next month padding
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  let nextDay = 1;
  while (days.length % 7 !== 0) {
    const date = formatDate(nextYear, nextMonth, nextDay);
    days.push({ date, day: nextDay, isCurrentMonth: false, isToday: date === todayStr });
    nextDay++;
  }

  return days;
};
