const express = require('express');
const { initializeDB, closeDB } = require('./db/db');
const { signIn, validateJsonWebToken, signOut } = require('./auth/auth');
const { getUser } = require('./user/user');
const { addProduct, getProducts, editProducts, deleteProducts } = require('./product/product');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT;

// App settings, set up cookie parse, 
// template engine and http data type
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize database connection
initializeDB();

//////// Add test data //////////
const { createUser } = require('./db/user');
createUser('Дмитрий М.', 'dima', 'test');
/////////////////////////////////


/////// App routes //////////////
app.get('/', (req, res) => {
  res.redirect('/signin');
});

app.get('/signin', (req, res) => {
  if (req.cookies.access_token) {
    res.redirect('/dashboard');
  } else {
    res.render('signin', { message: '' });
  }
});

app.post('/signin', signIn);

app.get('/signout', signOut);

app.get('/dashboard', validateJsonWebToken, getUser, getProducts, (req, res) => {
  res.render('dashboard', { name: req.name, username: req.username, items: req.items });
});

app.post('/dashboard', validateJsonWebToken, getUser, addProduct, getProducts, (req, res) => {
  res.render('dashboard', { name: req.name, username: req.username, items: req.items });
});

app.patch('/dashboard', validateJsonWebToken, getUser, editProducts, getProducts, (req, res) => {
  res.render('dashboard', { name: req.name, username: req.username, items: req.items });
});

app.delete('/dashboard', validateJsonWebToken, getUser, deleteProducts, getProducts, (req, res) => {
  res.render('dashboard', { name: req.name, username: req.username, items: req.items });
});

app.all('/*', (req, res) => {
  res.status(404).render('error', { code: 404, message: 'Ресурс не найден.' });
});
/////////////////////////////////


// Listen client connections on specified port.
app.listen(port, () => {
  console.log(`Server running at address: http://localhost:${port}/`);
});

// Close the database connection when the server is closed
process.on('SIGINT', () => {
  closeDB();
  process.exit();
});