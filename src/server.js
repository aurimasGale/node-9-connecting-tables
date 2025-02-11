const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const authorRoutes = require('./api/authorRoutes');
const booksRoutes = require('./api/booksRoutes');
const userRoutes = require('./api/usersRoutes');
const { PORT } = require('./config');
const caoUsersRoutes = require('./api/caoUsersRoutes');

const app = express();

// Global MiddleWare
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json('OK'));

// Routes
app.use('/api', userRoutes);
app.use('/api', booksRoutes);
app.use('/api', authorRoutes);
app.use('/api', caoUsersRoutes);

app.listen(PORT, () => console.log('server online, PORT', PORT));
