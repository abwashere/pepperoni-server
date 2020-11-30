require("dotenv").config();

const jwt = require("jsonwebtoken");
const userModel = require("../models/User");

const requireAuth = (req, res, next) => {
	const token = req.cookies.jwt;

	// check json web token exists & is verified
	if (token) {
		jwt.verify(token, process.env.SESSION_SECRET, (err, decodedToken) => {
			if (err) {
				console.log(err.message);
				res.redirect("/");
			} else {
				console.log(decodedToken);
				next();
			}
		});
	} else {
		res.redirect("/");
	}
};

// check current user
const checkCurrentUser = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, process.env.SESSION_SECRET, async (err, decodedToken) => {
			if (err) {
				res.locals.currentUser = null;
				next();
			} else {
				let userInDB = await userModel.findById(decodedToken.id);
				// delete password before showing user in session
				const user = userInDB.toObject();
				delete user.password;

				res.locals.currentUser = user;
				console.log(
					"-----------CURRENT USER CONNECTED----------\n",
					res.locals.currentUser
				);
				next();
			}
		});
	} else {
		res.locals.currentUser = null;
		console.log("-----------NOT CONNECTED !----------");
		next();
	}
};

module.exports = { requireAuth, checkCurrentUser };

// function protectPrivateRoute(req, res, next) {
//   if (req.session.currentUser) next();
//   else res.redirect("/");
// };
