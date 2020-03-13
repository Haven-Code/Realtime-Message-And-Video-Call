"use strict";

const express = require('express');
const app = express();
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const http = require("http").Server(app);
const io = require('socket.io')(http);
const socket = require("./module/socket")(io);
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const morgan = require('morgan');
const flash = require("connect-flash");
const { ExpressPeerServer } = require('peer');
// DB Connect

const mongoose = require("./db");

const options = {
	debug: true,
	path: '/peerserver'
}
const peerserver = ExpressPeerServer(http, options);
app.use('/peer', peerserver);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(flash());
//app.use(morgan('dev')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret: "daylapassword",
	resave: false,
	saveUninitialized: false,
	//store: new FileStore(),
	store: new MongoStore({ url: mongoose.dbUrl }),
	cookie: {
		maxAge: 31536000000,
	}

}));
app.use(passport.initialize());
app.use(passport.session());

http.listen(8000, () => {
	console.log("Server Running On Port: 8000");
});

const routers = require("./module/routes")(app, passport,io);

//Passport connect
const User = require("./schema/user");
passport.use(new LocalStrategy({
	passReqToCallback: true
}, (req, username, password, done) => {

	User.findOne({ username: username }, function (err, user) {
		if (err) {
			return done(err);
		} else if (!user) {
			console.log("Incorrect Username ", username);
			return done(null, false, req.flash('loginMessage', 'No user found.'));
		}

		bcrypt.compare(password, user.password, async (err, result) => {
			if (result === true) {
				let a = await User.findOneAndUpdate({
					username: user.username
				}, {
					is_online: 'true'
				})

				io.of('/user').emit('user-online',user._id)
				req.session.save();
				return done(null, user);
			} else {
				console.log("Incorrect password");
				return done(null, false, req.flash('loginMessage', 'Wrong Password !'));
			}
		})

	});
}

));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});