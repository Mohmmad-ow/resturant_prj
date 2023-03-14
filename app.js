// required Modules and Packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var path = require('path');
require("dotenv").config();

// upload images to server
const files = require('express-fileupload')



// express application
const app = express()

// express session
const session = require('express-session')

// mongo store for sessions
const MongoStore = require('connect-mongo')

// User auth with passport
const passport = require('passport')
const passportLocal = require('passport-local')
require('./config/passport');

// using bodyParser to get data from submitted
app.use(bodyParser.urlencoded({extended: true}));

// using fileupload to upload files
app.use(files({
    limits: { fileSize: 50 * 1024 * 1024 },
  })) 
  
// use public for storing files
app.use(express.static(path.join(__dirname, 'public')));
// view engine first line to load images
app.use(express.static( "public" ) );
app.set("view engine", 'ejs');




const {router} = require('./router')



// Database settings
const {User, Product} = require("./config/database")




const DB_STRING = process.env.DB_STRING_DEV;

mongoose.connect(DB_STRING).then(() => {console.log('db online')}).catch((err) => {

        console.log(err)
})


const Store = MongoStore.create({mongoUrl: DB_STRING})

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: Store,
    cookie: {
        maxAge: 30 * 1000 * 24  * 60 * 60 * 2 /* This would be a month till it expires */
    }
}))


// initializing the express session
app.use(passport.initialize())
app.use(passport.session())


app.use('/', router)

app.listen(3000 || process.env.PORT, () => {
    console.log(`server is running on port 3000`)
})