const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

module.exports = session({
	secret: process.env.SESSION_SECRET,
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
	}),
	resave: false, // don't create session until something is stored
	saveUninitialized: false, //don't save session if unmodified
	cookie: {
		maxAge: 1000 * 60 * 30, // 30 min
	},
});
