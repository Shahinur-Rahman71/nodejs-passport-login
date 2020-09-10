const express = require('express');
const app = express();
const passport = require('passport');
const port = process.env.port || 5000
const expressLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
//The flash is a special area of the session used for storing messages. Messages are written to the flash and cleared after being displayed to the user.
const session = require('express-session');
//HTTP is stateless; in order to associate a request to any other request, you need a way to store user data between HTTP requests. Cookies and URL parameters are both suitable ways to transport data between the client and the server. But they are both readable and on the client side. Sessions solve exactly this problem.

//Passport config
require('./config/passport') (passport);

//db connection
require('./dbAndModel/db');

// Express Layout
app.use(expressLayout);

// Ejs Template
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//bodyParser
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect--Flash
app.use(flash());

//global Variabls
app.use((req, res, next) =>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

// All Router
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`)
});