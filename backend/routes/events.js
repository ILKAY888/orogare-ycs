const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json(req.readJSON('events.json')));

router.get('/upcoming', (req, res) => {
    const events = req.readJSON('events.json').filter(e => new Date(e.date) >= new Date());
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(events);
});

router.post('/', (req, res) => {
    const { title, date, time, location, description } = req.body;
    if (!title || !date) return res.status(400).json({ message: 'Title and date required' });
    const events = req.readJSON('events.json');
    const event = { id: Date.now().toString(), title, date, time: time || '', location: location || '', description: description || '' };
    events.push(event);
    req.writeJSON('events.json', events);
    res.status(201).json({ message: 'Event added', event });
});

module.exports = router;