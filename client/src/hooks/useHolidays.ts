import { useState, useEffect } from 'react';
import { Holiday } from '../types';
import { fetchHolidays } from '../api/holidays';

export const useHolidays = (year: number) => {
  const [holidays, setHolidays] = useState<Map<string, Holiday>>(new Map());

  useEffect(() => {
    fetchHolidays(year).then(data => {
      const map = new Map<string, Holiday>();
      data.forEach(h => map.set(h.date, h));
      setHolidays(map);
    });
  }, [year]);

  return holidays;
};
