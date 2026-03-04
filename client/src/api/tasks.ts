import { Task } from '../types';

// In development CRA proxies /api → localhost:5000 via "proxy" in package.json
const API_BASE = process.env.REACT_APP_API_URL || '/api';

export const fetchTasks = async (month: string): Promise<Task[]> => {
  const res = await fetch(`${API_BASE}/tasks?month=${month}`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
};

export const createTask = async (data: Omit<Task, '_id'>): Promise<Task> => {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
};

export const updateTask = async (id: string, data: Partial<Task>): Promise<Task> => {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
};

export const deleteTask = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
};

export const reorderTasks = async (
  tasks: Array<{ id: string; order: number; date: string }>
): Promise<void> => {
  const res = await fetch(`${API_BASE}/tasks/bulk/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tasks }),
  });
  if (!res.ok) throw new Error('Failed to reorder tasks');
};
