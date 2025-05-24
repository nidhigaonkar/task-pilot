require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is not set');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    console.log('Connection state:', mongoose.connection.readyState);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Error details:', err.message);
  });

// Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedToEmail: String,
  dueDate: Date,
  reminderSettings: {
    daysBeforeDue: [Number],
    reminderMessage: String
  },
  assignedByName: String,
  completed: Boolean,
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const Task = mongoose.model('Task', taskSchema);

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Send an email
function sendEmail(to, subject, text) {
  return transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    text
  });
}

// API: Add a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, assignedToEmail, dueDate, reminderSettings, assignedByName } = req.body;
    const newTask = new Task({
      title,
      description,
      assignedToEmail,
      dueDate,
      reminderSettings,
      assignedByName,
      completed: false
    });
    await newTask.save();
    res.json({ success: true, task: newTask });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Mark task as completed
app.post('/api/tasks/:id/complete', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      task.completed = true;
      await task.save();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Mark task as incomplete
app.post('/api/tasks/:id/uncomplete', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      task.completed = false;
      await task.save();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const {
      title,
      description,
      assignedToEmail,
      assignedByName,
      dueDate,
      reminderSettings,
      completed
    } = req.body;

    // Update task fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.assignedToEmail = assignedToEmail || task.assignedToEmail;
    task.assignedByName = assignedByName || task.assignedByName;
    task.dueDate = dueDate || task.dueDate;
    task.reminderSettings = reminderSettings || task.reminderSettings;
    task.completed = completed !== undefined ? completed : task.completed;

    await task.save();
    res.json({ success: true, task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Send a reminder email for a task
app.post('/api/tasks/:id/remind', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const email = (task.assignedToEmail || '').trim();
    console.log('Sending reminder to:', email);
    
    // Format the date to show only YYYY-MM-DD
    const dueDate = new Date(task.dueDate).toISOString().split('T')[0];
    
    // Build email body with default reminder message
    let emailBody = `This is a reminder for your task: ${task.title}\n`;
    if (task.description) {
      emailBody += `Description: ${task.description}\n`;
    }
    emailBody += `Reminder Message: ${task.reminderSettings?.reminderMessage || "Don't forget to complete your assigned task!"}\n`;
    emailBody += `Due: ${dueDate}`;
    
    await sendEmail(
      email,
      `Task Reminder: ${task.title}`,
      emailBody
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to send reminder:', error);
    res.status(500).json({ error: error.message });
  }
});

// CRON: Check daily for reminders to send
cron.schedule('0 8 * * *', async () => {
  try {
    const tasks = await Task.find({ completed: false });
    const today = new Date();
    
    for (const task of tasks) {
      const due = new Date(task.dueDate);
      const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
      
      if (task.reminderSettings?.daysBeforeDue?.includes(daysUntilDue)) {
        await sendEmail(
          task.assignedToEmail,
          `Reminder: ${task.title} is due in ${daysUntilDue} day(s)`,
          `This is a reminder that your task "${task.title}" is due in ${daysUntilDue} day(s).\nDue: ${task.dueDate}`
        );
      }
    }
    console.log('Daily reminder check complete');
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));