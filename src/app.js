const express = require('express');
const stats = require('./stats');

const app = express();
app.use(express.json());

const VERSION = process.env.APP_VERSION || require('../package.json').version;
const tasks = [];
let nextId = 1;

app.get('/', (req, res) => {
  res.json({ app: 'harness-demo-app', version: VERSION, message: 'Olá do Harness!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP', uptime: process.uptime() });
});

app.get('/version', (req, res) => {
  res.json({ version: VERSION });
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/stats', (req, res) => {
  res.json({ ...stats.summarize(tasks), longestTitle: stats.longestTitle(tasks) });
});

app.get('/tasks/search', (req, res) => {
  try {
    res.json(stats.search(tasks, req.query.q));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/tasks', (req, res) => {
  const { title } = req.body || {};
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'O campo "title" é obrigatório' });
  }
  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  return res.status(201).json(task);
});

app.patch('/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
  if (typeof req.body.done === 'boolean') task.done = req.body.done;
  if (typeof req.body.title === 'string') task.title = req.body.title;
  return res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const idx = tasks.findIndex((t) => t.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Tarefa não encontrada' });
  tasks.splice(idx, 1);
  return res.status(204).send();
});

module.exports = app;
