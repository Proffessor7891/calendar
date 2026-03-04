import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Task } from '../types';

interface Props {
  task: Task;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  draggable: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  isDragging: boolean;
  isFiltered: boolean;
}

const Card = styled.div<{ color: string; isDragging: boolean; isFiltered: boolean }>`
  position: relative;
  border-radius: 6px;
  padding: 6px 28px 6px 10px;
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  background: ${p => p.color};
  cursor: grab;
  user-select: none;
  opacity: ${p => (p.isDragging ? 0.4 : p.isFiltered ? 0.25 : 1)};
  transition: opacity 0.15s, box-shadow 0.15s, transform 0.1s;
  word-break: break-word;
  line-height: 1.3;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    cursor: grabbing;
  }
`;

const EditInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const DeleteBtn = styled.button`
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 2px;
  line-height: 1;
  font-size: 14px;
  display: none;
  border-radius: 3px;

  &:hover {
    color: #fff;
    background: rgba(0, 0, 0, 0.2);
  }

  ${Card}:hover & {
    display: block;
  }
`;

const TaskCard: React.FC<Props> = ({
  task,
  onEdit,
  onDelete,
  draggable,
  onDragStart,
  onDragEnd,
  isDragging,
  isFiltered,
}) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const handleDoubleClick = () => setEditing(true);

  const handleBlur = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== task.title) {
      onEdit(task._id, trimmed);
    } else {
      setValue(task.title);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') inputRef.current?.blur();
    if (e.key === 'Escape') {
      setValue(task.title);
      setEditing(false);
    }
  };

  return (
    <Card
      color={task.color || '#3b82f6'}
      isDragging={isDragging}
      isFiltered={isFiltered}
      draggable={draggable && !editing}
      onDragStart={editing ? undefined : onDragStart}
      onDragEnd={onDragEnd}
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit, drag to move"
    >
      {editing ? (
        <EditInput
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <>
          {task.title}
          <DeleteBtn
            onClick={e => {
              e.stopPropagation();
              onDelete(task._id);
            }}
            title="Delete task"
          >
            ×
          </DeleteBtn>
        </>
      )}
    </Card>
  );
};

export default TaskCard;
