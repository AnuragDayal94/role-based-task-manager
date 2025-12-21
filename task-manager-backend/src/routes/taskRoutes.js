const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

const router = express.Router();

// Create task (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    if (!title || !assignedTo) {
      return res.status(400).json({ message: 'Title and assigned user required' });
    }

    const task = await Task.create({
      title,
      description,    
      assignedTo,
      createdBy: req.user._id
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
});


// Get tasks (Admin: all tasks, User: assigned tasks)
router.get('/', protect, async (req, res) => {
  try {
    let tasks;

    if (req.user.role === 'admin') {
      // admin sees all tasks
      tasks = await Task.find()
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');
    } else {
      // user sees only assigned tasks
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');
    }

    res.status(200).json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});


// Update task status (Assigned user or Admin)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const taskId = req.params.id;

    const allowedStatus = ['pending', 'in-progress', 'completed'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Authorization check
    if (
      req.user.role !== 'admin' &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'You are not allowed to update this task' });
    }

    task.status = status;
    await task.save();

    res.status(200).json({
      message: 'Task status updated',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
});

// Delete task (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();

    res.status(200).json({
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
});


module.exports = router;
