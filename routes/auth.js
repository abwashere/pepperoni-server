var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");

const userModel = require("../models/User");
const func = require("./../utils/capitalizedName");

// ==> /api/auth

/**
 * Sign up TODO: only admin can create users
 */
router.post("/signup", async (req, res, next) => {
	try {
		// 1. check if user already exists
		const userInDB = await userModel.findOne({ email: req.body.email });

		if (!userInDB) {
			// 2. create new pseudo and formatted name
			const newUser = req.body;
			newUser.lastName = func.capitalizeWord(newUser.lastName);
			newUser.firstName = func.capitalizeWord(newUser.firstName);
			newUser.pseudo = (
				newUser.firstName.slice(0, 2) + newUser.lastName.slice(0, 10)
			).toLowerCase();

			// 3. create new user with hashed password
			const salt = bcrypt.genSaltSync((saltRounds = 10));
			const hash = bcrypt.hashSync(newUser.password, salt);
			newUser.password = hash;
			const newUserDocument = await userModel.create(newUser);

			// 4. add user with no password in session
			const createdUser = newUserDocument.toObject();
			delete createdUser.password;
			req.session.currentUser = createdUser;
			res.status(201).json(createdUser);
		} else {
			// user already exists
			return res.status(400).json({
				existingMail: `L'adresse ${req.body.email} est déjà prise. Veuillez recommencer.`,
			});
		}
	} catch (error) {
		res.status(500).json({ error, message: error.message });
	}
});

/**
 * Log in
 */
router.post("/login", async (req, res) => {
	try {
		// 1. check pseudo email
		const userInDB = await userModel.find(req.body.pseudo || req.body.email);
		if (userInDB) {
			// 2. check password
			const validPassword = compareSync(req.body.password, userInDB.password);
			if (validPassword) {
				req.session.currentUser = userInDB(-password);
				res.status(200).json({
					loggedUser: req.session.currentUser,
					message: "Connexion réussie",
				});
			} else {
				return res.status(400).json({ message: "Mot de passe erroné." });
			}
		} else {
			return res.status(400).json({ message: "Identifiant invalide." });
		}
	} catch (error) {
		res.status(500).json(error);
	}
});

/**
 * Current user in session
 */
router.get("/isLoggedIn", (req, res) => {
	if (req.session.currentUser) {
		res.status(200).json(req.session.currentUser);
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
});

/**
 * Log out
 */
router.get("/logout", (req, res) => {
	req.session.destroy(function (error) {
		if (error)
			res
				.status(500)
				.json({ error, message: "Error trying to disconnect user" });
		else res.status(200).json({ message: "User successfully disconnected." });
	});
});

module.exports = router;
