require("dotenv").config();
var express = require("express");
var app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

require("./config/dbConnection");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const MongoStore = require("connect-mongo")(session);

/* Middlewares */
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

var corsOptions = {
	origin: process.env.CLIENT_URL,
	credentials: true,
};
app.use(cors(corsOptions));

/* User Session */
// app.use(
// 	session({
// 		secret: process.env.SESSION_SECRET,
// 		resave: false,
// 		saveUninitialized: false,
// 		store: new MongoStore({
// 			mongooseConnection: mongoose.connection,
// 			touchAfter: 12 * 3600, // session is updated only one time in 12 hours, no matter how many requests are made (except those that change something on the session data)
// 			ttl: 01 * 24 * 60 * 60, // in hours, session expiration = 1 days
// 		}),
// 		cookie: { httpOnly: true, maxAge: 1000 * 60 * 30 * 1 }, // in msec, user connection = 30 minutes
// 	})
// );

/* Dev mode */
const devMode = false; //TODO: change when needed
if (devMode === true) {
	app.use(require("./middlewares/devMode"));
}

// FIXME: currentUser is undefined here ! USER IS KICKED OUT OF SESSION ON PAGE REFRESH
/* User in session tracking */
// app.use(function (req, res, next) {
// 	// console.log(
// 	// 	"============================\nCurrent user in session :",
// 	// 	req.session.currentUser
// 	// );
// 	next();
// });

const { checkCurrentUser } = require("./middlewares/authMiddlewares");

/* Routing */
var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var usersRouter = require("./routes/users");
var foodRouter = require("./routes/food");
var tablesRouter = require("./routes/tables");

app.get("*", checkCurrentUser);
app.use("/api", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/food", foodRouter);
app.use("/api/tables", tablesRouter);

module.exports = app;
