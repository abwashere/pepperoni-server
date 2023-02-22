require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

require("./config/dbConnection");
const corsOptions = require("./config/corsOptions");
const sessionConfig = require("./config/session");

const devMode = false; // TODO: change as pleased in development

/* Middlewares */

app.use(logger("dev"));

app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(cors(corsOptions));

app.use(sessionConfig);

if (devMode) {
	app.use(require("./middlewares/devMode"));
}
if (process.env.NODE_ENV === "dev") {
	app.use(require("./middlewares/sessionLog"));
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
app.all("*", (req, res, next) => {
	const error = new Error("Ressource not found.");
	error.status = 404;
	next(error);
});

module.exports = app;
