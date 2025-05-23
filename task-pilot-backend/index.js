require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const TASKS_FILE = './tasks.json';

// Load tasks from file
function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) return [];
  return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
}

// Save tasks to file
function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// Email transporter (use your Gmail credentials from .env)
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
  const { title, assignedToEmail, dueDate, reminderSettings, assignedByName } = req.body;
  const tasks = loadTasks();
  const newTask = {
    id: Date.now().toString(),
    title,
    assignedToEmail,
    dueDate,
    reminderSettings,
    assignedByName,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  saveTasks(tasks);

  // Send immediate email
  // await sendEmail(
  //   assignedToEmail,
  //   `New Task Assigned: ${title}`,
  //   `You have been assigned a new task: ${title}\nDue: ${dueDate}\nAssigned by: ${assignedByName}`
  // );

  res.json({ success: true, task: newTask });
});

// API: Mark task as completed
app.post('/api/tasks/:id/complete', (req, res) => {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === req.params.id);
  if (task) {
    task.completed = true;
    saveTasks(tasks);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// API: Mark task as incomplete
app.post('/api/tasks/:id/uncomplete', (req, res) => {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === req.params.id);
  if (task) {
    task.completed = false;
    saveTasks(tasks);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// API: Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(loadTasks());
});

// API: Send a reminder email for a task
app.post('/api/tasks/:id/remind', (req, res) => {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === req.params.id);
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
  
  sendEmail(
    email,
    `IntelliHer Task Reminder: ${task.title}`,
    emailBody
  ).then(() => {
    res.json({ success: true });
  }).catch((err) => {
    console.error('Failed to send email:', err);
    res.status(500).json({ error: 'Failed to send email', details: err.message });
  });
});

// API: Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    saveTasks(tasks);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// API: Update a task
app.put('/api/tasks/:id', (req, res) => {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  
  if (taskIndex === -1) {
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

  const updatedTask = {
    ...tasks[taskIndex],
    title: title || tasks[taskIndex].title,
    description: description || tasks[taskIndex].description,
    assignedToEmail: assignedToEmail || tasks[taskIndex].assignedToEmail,
    assignedByName: assignedByName || tasks[taskIndex].assignedByName,
    dueDate: dueDate || tasks[taskIndex].dueDate,
    reminderSettings: reminderSettings || tasks[taskIndex].reminderSettings,
    completed: completed !== undefined ? completed : tasks[taskIndex].completed,
    id: req.params.id,
    createdAt: tasks[taskIndex].createdAt
  };

  tasks[taskIndex] = updatedTask;
  saveTasks(tasks);
  res.json({ success: true, task: updatedTask });
});

// CRON: Check daily for reminders to send
cron.schedule('0 8 * * *', async () => {
  const tasks = loadTasks();
  const today = new Date();
  for (const task of tasks) {
    if (task.completed) continue;
    const due = new Date(task.dueDate);
    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (task.reminderSettings && Array.isArray(task.reminderSettings.daysBeforeDue)) {
      if (task.reminderSettings.daysBeforeDue.includes(daysUntilDue)) {
        await sendEmail(
          task.assignedToEmail,
          `Reminder: ${task.title} is due in ${daysUntilDue} day(s)`,
          `This is a reminder that your task "${task.title}" is due in ${daysUntilDue} day(s).\nDue: ${task.dueDate}`
        );
      }
    }
  }
  console.log('Daily reminder check complete');
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));