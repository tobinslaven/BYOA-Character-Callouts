const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'callouts.json');

// Ensure data directory exists
fs.ensureDirSync(path.dirname(DATA_FILE));

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
        callouts: [
            {
                id: '1',
                title: 'My Amazing Sister Sarah',
                person: 'Sarah',
                reason: 'she always knows how to make me laugh when I\'m feeling down',
                categories: ['Caring', 'Cheerful'],
                submitter: 'Emma Johnson',
                date: new Date(Date.now() - 86400000).toISOString(),
                views: 15
            },
            {
                id: '2',
                title: 'The Best Guide Ever',
                person: 'Mr. Rodriguez',
                reason: 'he made math fun and helped me understand concepts I never thought I could',
                categories: ['Patient', 'Encouraging'],
                submitter: 'Alex Chen',
                date: new Date(Date.now() - 172800000).toISOString(),
                views: 23
            },
            {
                id: '3',
                title: 'My Incredible Mom',
                person: 'Mom',
                reason: 'she works two jobs and still finds time to help me with my homework every night',
                categories: ['Dedicated', 'Loving'],
                submitter: 'David Kim',
                date: new Date(Date.now() - 259200000).toISOString(),
                views: 31
            },
            {
                id: '4',
                title: 'My Brave Friend Jake',
                person: 'Jake',
                reason: 'he stood up for a kid who was being bullied at lunch',
                categories: ['Brave', 'Courage'],
                submitter: 'Maya Patel',
                date: new Date(Date.now() - 345600000).toISOString(),
                views: 18
            },
            {
                id: '5',
                title: 'My Creative Art Guide',
                person: 'Ms. Williams',
                reason: 'she helped me discover my love for painting and never gave up on me',
                categories: ['Creative', 'Supportive'],
                submitter: 'Jordan Smith',
                date: new Date(Date.now() - 432000000).toISOString(),
                views: 27
            }
        ]
    };
    fs.writeJsonSync(DATA_FILE, initialData, { spaces: 2 });
}

// Helper function to read data
const readData = () => {
    try {
        return fs.readJsonSync(DATA_FILE);
    } catch (error) {
        console.error('Error reading data file:', error);
        return { callouts: [] };
    }
};

// Helper function to write data
const writeData = (data) => {
    try {
        fs.writeJsonSync(DATA_FILE, data, { spaces: 2 });
        return true;
    } catch (error) {
        console.error('Error writing data file:', error);
        return false;
    }
};

// Routes

// Get all callouts
app.get('/api/callouts', (req, res) => {
    const data = readData();
    res.json(data.callouts);
});

// Get recent callouts (top 5)
app.get('/api/callouts/recent', (req, res) => {
    const data = readData();
    const recent = data.callouts
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    res.json(recent);
});

// Get popular callouts (top 5 by views)
app.get('/api/callouts/popular', (req, res) => {
    const data = readData();
    const popular = data.callouts
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);
    res.json(popular);
});

// Get word cloud data
app.get('/api/wordcloud', (req, res) => {
    const data = readData();
    const wordFreq = {};
    
    data.callouts.forEach(callout => {
        callout.categories.forEach(category => {
            const words = category.toLowerCase().split(/\s+/);
            words.forEach(word => {
                if (word.length > 2) {
                    wordFreq[word] = (wordFreq[word] || 0) + 1;
                }
            });
        });
    });
    
    const sortedWords = Object.entries(wordFreq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
        .map(([word, freq]) => ({ word, freq }));
    
    res.json(sortedWords);
});

// Submit new callout
app.post('/api/callouts', (req, res) => {
    const { title, person, reason, categories, submitter } = req.body;
    
    if (!title || !person || !reason || !categories || !submitter) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const data = readData();
    const newCallout = {
        id: Date.now().toString(),
        title,
        person,
        reason,
        categories: Array.isArray(categories) ? categories : [categories],
        submitter,
        date: new Date().toISOString(),
        views: 0
    };
    
    data.callouts.unshift(newCallout);
    
    if (writeData(data)) {
        res.json({ success: true, callout: newCallout });
    } else {
        res.status(500).json({ error: 'Failed to save callout' });
    }
});

// Increment view count
app.post('/api/callouts/:id/view', (req, res) => {
    const { id } = req.params;
    const data = readData();
    
    const callout = data.callouts.find(c => c.id === id);
    if (callout) {
        callout.views = (callout.views || 0) + 1;
        if (writeData(data)) {
            res.json({ success: true, views: callout.views });
        } else {
            res.status(500).json({ error: 'Failed to update views' });
        }
    } else {
        res.status(404).json({ error: 'Callout not found' });
    }
});

// Contact form submission
app.post('/api/contact', (req, res) => {
    const { contactName, contactEmail, contactMessage } = req.body;
    
    if (!contactName || !contactEmail || !contactMessage) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    // In a real application, you would send an email or save to database
    console.log('Contact form submission:', {
        name: contactName,
        email: contactEmail,
        message: contactMessage,
        timestamp: new Date().toISOString()
    });
    
    res.json({ success: true, message: 'Thank you for your message! We\'ll get back to you soon.' });
});

// ConvertKit integration endpoint
app.post('/api/convertkit/subscribe', (req, res) => {
    const { email, firstName } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    
    // In a real application, you would integrate with ConvertKit API
    console.log('ConvertKit subscription:', {
        email,
        firstName,
        timestamp: new Date().toISOString()
    });
    
    res.json({ success: true, message: 'Successfully subscribed to our newsletter!' });
});

// Simple text formatting for K-12 learners
app.post('/api/format-text', (req, res) => {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({ error: 'Text content is required' });
    }
    
    // Simple text formatting - just basic line breaks and emphasis
    let formatted = text
        .replace(/\n/gim, '<br>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>');
    
    res.json({ formatted });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Character-Callouts server running on http://localhost:${PORT}`);
    console.log(`Data file: ${DATA_FILE}`);
});
