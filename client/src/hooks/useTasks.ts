import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import { storage } from '../api/storage';

export const useTasks = (month: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await storage.fetchTasks(month);
      setTasks(data);
    } catch {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    load();
  }, [load]);

  const addTask = useCallback(
    async (date: string, title: string, color?: string) => {
      const tasksOnDay = tasks.filter(t => t.date === date);
      const order = tasksOnDay.length;
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
      const assignedColor = color || colors[Math.floor(Math.random() * colors.length)];
      const task = await storage.createTask({ title, date, order, color: assignedColor });
      setTasks(prev => [...prev, task]);
      return task;
    },
    [tasks]
  );

  const editTask = useCallback(async (id: string, data: Partial<Task>) => {
    const updated = await storage.updateTask(id, data);
    setTasks(prev => prev.map(t => (t._id === id ? updated : t)));
    return updated;
  }, []);

  const removeTask = useCallback(async (id: string) => {
    await storage.deleteTask(id);
    setTasks(prev => prev.filter(t => t._id !== id));
  }, []);

  const moveTask = useCallback(
    async (taskId: string, targetDate: string, targetIndex: number) => {
      setTasks(prev => {
        const task = prev.find(t => t._id === taskId);
        if (!task) return prev;

        const sourceDate = task.date;
        const withoutTask = prev.filter(t => t._id !== taskId);

        const sourceDay = withoutTask
          .filter(t => t.date === sourceDate)
          .sort((a, b) => a.order - b.order)
          .map((t, i) => ({ ...t, order: i }));

        const targetDay = withoutTask
          .filter(t => t.date === targetDate)
          .sort((a, b) => a.order - b.order);

        const insertIndex = Math.min(targetIndex, targetDay.length);
        targetDay.splice(insertIndex, 0, { ...task, date: targetDate });
        const reorderedTarget = targetDay.map((t, i) => ({ ...t, order: i }));

        const others = withoutTask.filter(
          t => t.date !== sourceDate && t.date !== targetDate
        );

        const updated = [...others, ...sourceDay, ...reorderedTarget];

        storage
          .reorderTasks(updated.map(t => ({ id: t._id, order: t.order, date: t.date })))
          .catch(console.error);

        return updated;
      });
    },
    []
  );

  return { tasks, loading, error, addTask, editTask, removeTask, moveTask, reload: load };
};
