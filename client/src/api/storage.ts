import { Task } from '../types';

const KEY = 'calendar_tasks';

const load = (): Task[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
};

const save = (tasks: Task[]) => {
  localStorage.setItem(KEY, JSON.stringify(tasks));
};

const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2)}`;

export const storage = {
  fetchTasks: async (month: string): Promise<Task[]> => {
    return load().filter(t => t.date.startsWith(month));
  },

  createTask: async (data: Omit<Task, '_id'>): Promise<Task> => {
    const task: Task = { ...data, _id: genId() };
    const all = load();
    all.push(task);
    save(all);
    return task;
  },

  updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
    const all = load();
    const idx = all.findIndex(t => t._id === id);
    if (idx === -1) throw new Error('Not found');
    all[idx] = { ...all[idx], ...data };
    save(all);
    return all[idx];
  },

  deleteTask: async (id: string): Promise<void> => {
    save(load().filter(t => t._id !== id));
  },

  reorderTasks: async (tasks: Array<{ id: string; order: number; date: string }>): Promise<void> => {
    const all = load();
    tasks.forEach(({ id, order, date }) => {
      const t = all.find(t => t._id === id);
      if (t) { t.order = order; t.date = date; }
    });
    save(all);
  },
};
