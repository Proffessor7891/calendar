import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { buildCalendarDays, DAYS_OF_WEEK, getMonthName, formatMonth } from '../utils/calendar';
import { useTasks } from '../hooks/useTasks';
import { useHolidays } from '../hooks/useHolidays';
import { theme } from '../styles/theme';
import CalendarCell from './CalendarCell';

const Wrapper = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: ${theme.colors.bg};
  min-height: 100vh;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NavBtn = styled.button`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: ${theme.colors.text};
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: ${theme.colors.borderLight};
    border-color: ${theme.colors.primary};
  }
`;

const MonthTitle = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: ${theme.colors.text};
  min-width: 200px;
  text-align: center;
`;

const TodayBtn = styled.button`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  color: ${theme.colors.text};
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${theme.colors.borderLight};
  }
`;

const SearchInput = styled.input`
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  outline: none;
  background: ${theme.colors.surface};
  color: ${theme.colors.text};
  width: 220px;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}20;
  }

  &::placeholder {
    color: ${theme.colors.textMuted};
  }
`;

const Grid = styled.div`
  background: ${theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${theme.colors.border};
  overflow: hidden;
  box-shadow: 0 1px 6px ${theme.colors.shadow};
`;

const WeekHeaders = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: ${theme.colors.bg};
  border-bottom: 1px solid ${theme.colors.border};
`;

const WeekDay = styled.div`
  padding: 10px 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: ${theme.colors.border};
`;

const ErrorMsg = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 16px;
  color: #dc2626;
  margin-bottom: 16px;
  font-size: 14px;
`;

const Calendar: React.FC = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [searchQuery, setSearchQuery] = useState('');
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const monthStr = formatMonth(year, month);
  const { tasks, error, addTask, editTask, removeTask, moveTask } = useTasks(monthStr);
  const holidays = useHolidays(year);

  const days = useMemo(() => buildCalendarDays(year, month), [year, month]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, typeof tasks>();
    tasks.forEach(task => {
      const existing = map.get(task.date) || [];
      map.set(task.date, [...existing, task]);
    });
    // Sort each day's tasks by order
    map.forEach((dayTasks, date) => {
      map.set(date, [...dayTasks].sort((a, b) => a.order - b.order));
    });
    return map;
  }, [tasks]);

  const goToPrev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const goToNext = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const goToToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  const handleDragStart = useCallback((taskId: string, _sourceDate: string, _sourceIndex: number) => {
    setDraggingId(taskId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
  }, []);

  const handleDrop = useCallback((targetDate: string, targetIndex: number) => {
    if (!draggingId) return;
    moveTask(draggingId, targetDate, targetIndex);
    setDraggingId(null);
  }, [draggingId, moveTask]);

  const handleAddTask = useCallback(async (date: string, title: string) => {
    await addTask(date, title);
  }, [addTask]);

  const handleEditTask = useCallback(async (id: string, title: string) => {
    await editTask(id, { title });
  }, [editTask]);

  return (
    <Wrapper>
      <Header>
        <NavGroup>
          <NavBtn onClick={goToPrev} title="Previous month">‹</NavBtn>
          <MonthTitle>{getMonthName(month)} {year}</MonthTitle>
          <NavBtn onClick={goToNext} title="Next month">›</NavBtn>
          <TodayBtn onClick={goToToday}>Today</TodayBtn>
        </NavGroup>
        <SearchInput
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </Header>

      {error && <ErrorMsg>{error}</ErrorMsg>}

      <Grid>
        <WeekHeaders>
          {DAYS_OF_WEEK.map(d => <WeekDay key={d}>{d}</WeekDay>)}
        </WeekHeaders>
        <DaysGrid>
          {days.map(calDay => (
            <CalendarCell
              key={calDay.date}
              date={calDay.date}
              day={calDay.day}
              isCurrentMonth={calDay.isCurrentMonth}
              isToday={calDay.isToday}
              tasks={tasksByDate.get(calDay.date) || []}
              holiday={holidays.get(calDay.date)}
              searchQuery={searchQuery}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={removeTask}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              draggingId={draggingId}
            />
          ))}
        </DaysGrid>
      </Grid>
    </Wrapper>
  );
};

export default Calendar;
