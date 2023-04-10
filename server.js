// SERVER PAGE SCRIPTING

//SECRET_KEY CHECK 

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

// REQUIRED DEPENDENCIES
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

const passport = require("passport");
const initializePassport = require("./passport-config");

const flash = require("express-flash");
const session = require("express-session");

initializePassport (
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)



//DATABASE ARRAY FOR USER LOGIN DETAILS
const users = []

app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session()); 



//CONFIGURIG THE LOGIN PAGE FUCNTIONALITY
app.post("/login", passport.authenticate("local", {
    successRedirect: "/loggedIn",
    failureRedirect: "/login",
    failureFlash: true
}))

//CONFIGURING THE REGISTER PAGE  FUNCTIONALITY
app.post("/register", async(req,res) => {
    try {
        const encryptPassword = await bcrypt.hash(req.body.password, 10);

        //PUSHING THE USER CREDENTIALS INTO THE ARRAY DATABASE
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: encryptPassword
        })

        console.log(users);
        res.redirect("/login");

    } catch (e) {
        console.log(e);
        res.redirect("/register");
    }
})


// ROUTING THE FILES 
app.get('/', (req, res) => {
    res.render("index.ejs");
})

app.get('/login', (req,res) => {
    res.render("loginPage.ejs");
})

app.get('/register', (req,res) => {
    res.render("register.ejs");
})

app.get('/loggedIn', (req,res) => {
    res.render("logged-in.ejs", {name: req.user.name});
})
//END OF ROUTING PAGES


// PORT TO CONNET TO THE SERVER 
app.listen(8000);