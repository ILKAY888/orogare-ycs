const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const prayers = req.readJSON('prayers.json').filter(p => p.isPublic);
    res.json(prayers);
});

router.post('/', (req, res) => {
    const { intention, isPublic } = req.body;
    if (!intention || intention.length < 5) {
        return res.status(400).json({ message: 'Prayer intention too short' });
    }
    const prayers = req.readJSON('prayers.json');
    const prayer = { id: Date.now().toString(), intention, isPublic: !!isPublic, submittedAt: new Date().toISOString() };
    prayers.push(prayer);
    req.writeJSON('prayers.json', prayers);
    res.status(201).json({ message: 'Prayer received. God bless!', prayer: isPublic ? prayer : { id: prayer.id } });
});

module.exports = router;