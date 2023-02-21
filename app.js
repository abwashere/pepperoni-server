require("dotenv").config();
require("./config/dbConnection");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const devMode = false; // TODO: change as pleased in development
const app = express();

/* Middlewares */
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "public/build")));
} else {
	app.use(express.static(path.join(__dirname, "public")));
}
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
);
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		store: new MongoStore({
			mongooseConnection: mongoose.connection,
		}),
		resave: false, // don't create session until something is stored
		saveUninitialized: false, //don't save session if unmodified
		cookie: {
			maxAge: 1000 * 60 * 30, // 30 min
		},
	})
);

if (process.env.NODE_ENV === "dev") {
	if (devMode) app.use(require("./middlewares/devMode"));

	/* User in session tracking */
	app.use((req, res, next) => {
		console.log(
			"========= Session user :",
			req.session
				? req.session.currentUser.firstName
				: "No user connected"
		);
		next();
	});
}

/* Routing */
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const foodRouter = require("./routes/food");
const tablesRouter = require("./routes/tables");

app.use("/api", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/food", foodRouter);
app.use("/api/tables", tablesRouter);

// 404 Middleware
app.use("/api/*", (req, res, next) => {
	const error = new Error("Ressource not found.");
	error.status = 404;
	next(error);
});

module.exports = app;
