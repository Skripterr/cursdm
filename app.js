const express = require('express');
const { initializeDB, closeDB } = require('./db/db');
const { signIn, validateJsonWebToken, signOut } = require('./auth/auth');
const { getUser } = require('./user/user');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT;

// App settings, set up cookie parse, 
// template engine and http data type
app.use(cookieParser());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize database connection
initializeDB();


//////// API routes /////////////
app.post('/api/signIn', signIn);

app.get('/api/user', validateJsonWebToken, getUser);
/*
app.get('/api/devices', validateJsonWebToken, getProduct);
app.put('/api/devices', validateJsonWebToken, addProduct);
app.post('/api/devices', validateJsonWebToken, editProduct);
app.delete('/api/devices', validateJsonWebToken, deleteProduct);
*/
// Handle all non-existent requests.
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: true, message: 'API method not found.' });
});
/////////////////////////////////


/////// App routes //////////////
app.get('/', (req, res) => {
  res.redirect('/signin');
});

app.get('/signin', (req, res) => {

  if (req.cookies.access_token) {
    res.redirect('/dashboard');
  } else {
    res.render('signin');
  }
});

app.get('/signout', signOut);

app.get('/dashboard', (req, res) => {

  if (req.cookies.access_token) {
    res.render('dashboard');
  } else {
    res.redirect('/signin');
  }
});
/////////////////////////////////


// Listen client connections on specified port.
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Close the database connection when the server is closed
process.on('SIGINT', () => {
  closeDB();
  process.exit();
});