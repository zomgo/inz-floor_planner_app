const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

connectDB();

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.json({ msg: 'welcome to api' }));

app.use('/api/savedState', require('./routes/savedState'));

//prod
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static('client/buil'));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
