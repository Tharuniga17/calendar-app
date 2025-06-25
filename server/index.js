import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Added only this route below
app.get('/', (req, res) => {
  res.send('✅ Backend is live!');
});

// Read events
app.get('/events', (req, res) => {
  fs.readFile('events.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read file' });
    const events = data ? JSON.parse(data) : [];
    res.json(events);
  });
});

// Add event
app.post('/events', (req, res) => {
  fs.readFile('events.json', 'utf8', (err, data) => {
    const events = data ? JSON.parse(data) : [];
    events.push(req.body);

    fs.writeFile('events.json', JSON.stringify(events, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Failed to write file' });
      res.status(201).json({ message: 'Event saved' });
    });
  });
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:5000/events`));
