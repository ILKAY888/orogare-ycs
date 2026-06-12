const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json(req.readJSON('members.json')));

router.post('/', (req, res) => {
    const { fullName, course, yearOfStudy, phone, email, message } = req.body;
    if (!fullName || !course || !yearOfStudy || !phone) {
        return res.status(400).json({ message: 'Required fields missing' });
    }
    const members = req.readJSON('members.json');
    if (members.find(m => m.phone === phone)) {
        return res.status(400).json({ message: 'Phone already registered' });
    }
    const member = { id: Date.now().toString(), fullName, course, yearOfStudy, phone, email: email || '', message: message || '', registeredAt: new Date().toISOString() };
    members.push(member);
    req.writeJSON('members.json', members);
    res.status(201).json({ message: 'Registration successful! Welcome to YCS!', member });
});

module.exports = router;