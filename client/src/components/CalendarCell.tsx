import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Task, Holiday } from '../types';
import TaskCard from './TaskCard';
import { theme } from '../styles/theme';

interface Props {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
  holiday: Holiday | undefined;
  searchQuery: string;
  onAddTask: (date: string, title: string) => void;
  onEditTask: (id: string, title: string) => void;
  onDeleteTask: (id: string) => void;
  onDragStart: (taskId: string, sourceDate: string, sourceIndex: number) => void;
  onDragEnd: () => void;
  onDrop: (targetDate: string, targetIndex: number) => void;
  draggingId: string | null;
}

const Cell = styled.div<{ isCurrentMonth: boolean; isToday: boolean; isDragOver: boolean }>`
  min-height: 120px;
  padding: 6px;
  background: ${p =>
    p.isToday
      ? theme.colors.today
      : p.isCurrentMonth
      ? theme.colors.surface
      : theme.colors.otherMonth};
  border: 1px solid ${p => (p.isToday ? theme.colors.todayBorder : theme.colors.border)};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  transition: background 0.15s, box-shadow 0.15s;
  box-shadow: ${p => (p.isDragOver ? `0 0 0 2px ${theme.colors.primary}` : 'none')};
  position: relative;
`;

const DayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const DayNumber = styled.span<{ isToday: boolean; isCurrentMonth: boolean }>`
  font-size: 13px;
  font-weight: ${p => (p.isToday ? '700' : '500')};
  color: ${p =>
    !p.isCurrentMonth
      ? theme.colors.textMuted
      : p.isToday
      ? theme.colors.primary
      : theme.colors.text};
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${p => (p.isToday ? theme.colors.primary : 'transparent')};
  color: ${p =>
    p.isToday
      ? '#fff'
      : !p.isCurrentMonth
      ? theme.colors.textMuted
      : theme.colors.text};
`;

const AddBtn = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textMuted};
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 2px 4px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.15s, color 0.15s;

  &:hover {
    color: ${theme.colors.primary};
    background: ${theme.colors.borderLight};
  }

  ${Cell}:hover & {
    opacity: 1;
  }
`;

const HolidayBadge = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${theme.colors.holidayText};
  background: ${theme.colors.holiday};
  border-radius: 4px;
  padding: 2px 6px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
`;

const TasksContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 200px;
`;

const DropZone = styled.div<{ isVisible: boolean }>`
  height: ${p => (p.isVisible ? '32px' : '4px')};
  border-radius: 4px;
  background: ${p => (p.isVisible ? `${theme.colors.primary}20` : 'transparent')};
  border: ${p => (p.isVisible ? `2px dashed ${theme.colors.primary}` : '2px solid transparent')};
  transition: height 0.15s, background 0.15s;
  margin-bottom: 2px;
`;

const AddForm = styled.form`
  margin-top: 4px;
`;

const AddInput = styled.input`
  width: 100%;
  border: 1px solid ${theme.colors.primary};
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 12px;
  outline: none;
  background: ${theme.colors.surface};
  color: ${theme.colors.text};
  box-sizing: border-box;

  &:focus {
    box-shadow: 0 0 0 2px ${theme.colors.primary}40;
  }
`;


const CalendarCell: React.FC<Props> = ({
  date,
  day,
  isCurrentMonth,
  isToday,
  tasks,
  holiday,
  searchQuery,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDragEnd,
  onDrop,
  draggingId,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddClick = () => {
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = inputValue.trim();
    if (title) {
      onAddTask(date, title);
      setInputValue('');
    }
    setShowInput(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setInputValue('');
      setShowInput(false);
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setIsDragOver(false);
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setIsDragOver(false);
    setDragOverIndex(null);
    onDrop(date, index);
  };

  const lowerQuery = searchQuery.toLowerCase();

  return (
    <Cell
      isCurrentMonth={isCurrentMonth}
      isToday={isToday}
      isDragOver={isDragOver}
      onDragOver={e => handleDragOver(e, tasks.length)}
      onDragLeave={handleDragLeave}
      onDrop={e => handleDrop(e, tasks.length)}
    >
      <DayHeader>
        <DayNumber isToday={isToday} isCurrentMonth={isCurrentMonth}>
          {day}
        </DayNumber>
        <AddBtn onClick={handleAddClick} title="Add task">
          +
        </AddBtn>
      </DayHeader>

      {holiday && <HolidayBadge title={holiday.name}>🎉 {holiday.localName}</HolidayBadge>}

      <TasksContainer>
        {tasks.map((task, index) => {
          const matches =
            !searchQuery || task.title.toLowerCase().includes(lowerQuery);
          return (
            <React.Fragment key={task._id}>
              <DropZone
                isVisible={draggingId !== null && dragOverIndex === index}
                onDragOver={e => handleDragOver(e, index)}
                onDrop={e => handleDrop(e, index)}
              />
              <TaskCard
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                draggable={true}
                onDragStart={e => {
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('taskId', task._id);
                  onDragStart(task._id, date, index);
                }}
                onDragEnd={onDragEnd}
                isDragging={draggingId === task._id}
                isFiltered={!!searchQuery && !matches}
              />
            </React.Fragment>
          );
        })}
        <DropZone
          isVisible={draggingId !== null && dragOverIndex === tasks.length}
          onDragOver={e => handleDragOver(e, tasks.length)}
          onDrop={e => handleDrop(e, tasks.length)}
        />
      </TasksContainer>

      {showInput && (
        <AddForm onSubmit={handleSubmit}>
          <AddInput
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onBlur={handleSubmit}
            placeholder="Task name..."
          />
        </AddForm>
      )}
    </Cell>
  );
};

export default CalendarCell;
