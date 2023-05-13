const express = require('express');
const path = require('path');
const generateUniqueId = require('generate-unique-id')
// const api = require('./routes/index.js');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);

app.use(express.static('public'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './db/db.json'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


const { readAndAppend } = require('./helpers/fsUtils.js')

app.post('api/notes', (req, res) => {
  const { title, text } = req.body;
  const id = generateUniqueId({
    length: 3,
    useLetters: false
  })
  if (title && text) {
    const newNote = {
      title,
      text,
      id
    };
    readAndAppend(newNote, './db/db.json');
    const response = {
      status: 'success',
      body: newNote,
    };
    res.json(response);
  } else {
    console.error(err)
    res.json('Error posting new note.')
  }
});

app.listen(PORT, () =>
  console.log(`App listening at localhost:${PORT}`)
);