const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: 'Name, email, and message required' });
    const contacts = req.readJSON('contacts.json');
    contacts.push({ id: Date.now().toString(), name, email, subject: subject || 'General', message, submittedAt: new Date().toISOString() });
    req.writeJSON('contacts.json', contacts);
    res.status(201).json({ message: 'Message sent successfully!' });
});

module.exports = router;