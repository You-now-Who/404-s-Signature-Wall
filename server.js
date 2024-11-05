const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/message', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'leave_note.html'));
});

app.get('/submit.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'submit.html'));
});

app.post('/submit_note', async (req, res) => {
    const { name, message, font } = req.body;

    try {
        const { error } = await supabase
            .from('notes')
            .insert([{ name, message, font }]);

        if (error) {
            console.error('Error inserting data', error.message);
            res.status(500).send('An error occurred while saving your message.');
        } else {
            console.log('Message saved to database');
            res.redirect('/');
        }
    } catch (error) {
        console.error('Unexpected error', error.message);
        res.status(500).send('Unexpected error occurred.');
    }
});

app.get('/get_messages', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notes')
            .select('name, message, font');

        if (error) {
            console.error('Error fetching data', error.message);
            res.status(500).send('An error occurred while fetching messages.');
        } else {
            res.json(data);
        }
    } catch (error) {
        console.error('Unexpected error', error.message);
        res.status(500).send('Unexpected error occurred.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
