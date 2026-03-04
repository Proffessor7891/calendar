import { Router, Request, Response } from 'express';
import Task from '../models/Task';

const router = Router();

// GET /api/tasks?month=YYYY-MM
router.get('/', async (req: Request, res: Response) => {
  try {
    const { month } = req.query;
    const filter = month ? { date: { $regex: `^${month}` } } : {};
    const tasks = await Task.find(filter).sort({ date: 1, order: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/tasks
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, date, order, color } = req.body;
    const task = new Task({ title, date, order, color });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/tasks/reorder - bulk update orders
router.put('/bulk/reorder', async (req: Request, res: Response) => {
  try {
    const { tasks } = req.body as { tasks: Array<{ id: string; order: number; date: string }> };
    await Promise.all(
      tasks.map(({ id, order, date }) =>
        Task.findByIdAndUpdate(id, { order, date })
      )
    );
    res.json({ message: 'Reordered' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
