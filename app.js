require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

require("./config/dbConnection");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

/* Server app */
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/* Front end permission */
var corsOptions = {
	origin: process.env.CLIENT_URL,
	credentials: true,
};
app.use(cors(corsOptions));

/* User Session */
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({
			mongooseConnection: mongoose.connection,
			touchAfter: 12 * 3600, // session is updated only one time in 12 hours, no matter how many requests are made (except those that change something on the session data)
			ttl: 01 * 24 * 60 * 60, // session expiration = 1 days
		}),
		cookie: { secure: true, maxAge: 1800000 }, // user connection = 30 minutes
	})
);

/* Dev mode */
const devMode = false; //TODO: change when needed
if (devMode === true) {
	app.use(require("./middlewares/devMode"));
}

//FIXME: currentUser is undefined here ! USER IS KICKED OUT OF SESSION ON PAGE REFRESH
/* User in session tracking */
app.use(function (req, res, next) {
	console.log(
		"============================\nCurrent user in session :",
		req.session.currentUser
	);
	console.log("session :", req.session);
	next();
});

/* Routing */
var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var usersRouter = require("./routes/users");
var foodRouter = require("./routes/food");

app.use("/api", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/food", foodRouter);

module.exports = app;
