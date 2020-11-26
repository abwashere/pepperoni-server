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

const devMode = true; // DEV MODE to change when needed

/* Server app */
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

var corsOptions = {
	origin: process.env.CLIENT_URL,
	optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

/* User Session */
app.use(
	session({
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
	})
);

/* Dev mode */
if (devMode === true) {
	app.use(require("./middlewares/devMode"));
}

/* User in session tracking */
app.use(function (req, res, next) {
	console.log(
		"=============\nCurrent user in session :",
		req.session.currentUser,
		"============="
	);
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
