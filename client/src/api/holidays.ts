import { Holiday } from '../types';

const NAGER_BASE = 'https://date.nager.at/api/v3';

const cache = new Map<string, Holiday[]>();

export const fetchHolidays = async (year: number, countryCode = 'US'): Promise<Holiday[]> => {
  const key = `${year}-${countryCode}`;
  if (cache.has(key)) return cache.get(key)!;

  try {
    const res = await fetch(`${NAGER_BASE}/PublicHolidays/${year}/${countryCode}`);
    if (!res.ok) return [];
    const data: Holiday[] = await res.json();
    cache.set(key, data);
    return data;
  } catch {
    return [];
  }
};
