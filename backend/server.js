const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors());
app.use(express.json());

// Data directory
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// Initialize JSON files
['members.json', 'prayers.json', 'events.json', 'contacts.json'].forEach(file => {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]');
});

// Helpers
const readJSON = (f) => JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
const writeJSON = (f, d) => fs.writeFileSync(path.join(dataDir, f), JSON.stringify(d, null, 2));

// Make helpers available
app.use((req, res, next) => {
    req.readJSON = readJSON;
    req.writeJSON = writeJSON;
    next();
});

// Routes
app.use('/api/members', require('./routes/members'));
app.use('/api/prayers', require('./routes/prayers'));
app.use('/api/events', require('./routes/events'));
app.use('/api/contact', require('./routes/contact'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'YCS Orogare API running', timestamp: new Date().toISOString() });
});

// Stats
app.get('/api/stats', (req, res) => {
    res.json({
        totalMembers: readJSON('members.json').length,
        totalPrayers: readJSON('prayers.json').length,
        totalEvents: readJSON('events.json').length
    });
});

app.listen(PORT, () => console.log(`✅ YCS API running on port ${PORT}`));

module.exports = app;