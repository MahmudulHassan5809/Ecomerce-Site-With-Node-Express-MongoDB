const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const engine = require('ejs-mate');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const connectMongo = require('connect-mongo');
const methodOverride = require('method-override');
const passport = require('passport');


const Category = require('./models/Category');

const cartLength = require('./helpers/middlewares');


const app = express();


//DB Config
const db = require('./config/database');
//Map Gloabal Promise -get rid of warning
mongoose.Promise = global.Promise;
//Connect To Mongoose
mongoose.connect(db.mongoURI,{
    useNewUrlParser: true,
    useCreateIndex: true
})
.then(() => { console.log('mongodb Connected');})
.catch(err => console.log(err));


// Mongo Store
const MongoStore = connectMongo(session);


//passport config
require('./config/passport')(passport);

//Static Folder
app.use(express.static(__dirname + '/public'));


//Morgan MiddleWare
app.use(morgan('dev'));

//Body parser MiddleWare
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Cookie parser MiddleWare
app.use(cookieParser());

//Session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
  	mongooseConnection: mongoose.connection
  })
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session())


//Global Variable
app.use((req,res,next) => {
	res.locals.user = req.user;
  next();
});

app.use(cartLength);

app.use((req,res,next) => {
  Category.find({})
      .then(categories => {
          res.locals.categories = categories;
          next();
      })
      .catch(err => console.log(err));
});

//Flash
app.use(flash());

//EJS MiddleWare
app.engine('ejs',engine);
app.set('view engine','ejs');


//Method Override
app.use(methodOverride('_method'))


//Load Routes
const pages = require('./routes/pages');
const users = require('./routes/users');
const admin = require('./routes/admin');

//Load Api Routes
const api = require('./api/api');
app.use('/api',api);

//Pages Routes
app.use('/',pages);
//Pages Routes
app.use('/users',users);
//Admin Routes
app.use('/admin',admin);


const port = process.env.PORT || 3000;
app.listen(port,() => {
	console.log(`Sever Started on port ${port}`);
});
