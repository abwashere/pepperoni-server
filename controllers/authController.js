require("dotenv").config();

const userModel = require("../models/User");
const jwt = require("jsonwebtoken");
const func = require("./../utils/capitalizedName");
const calc = require("./../utils/getRandomInt");

/* Errors handler */
const handleErrors = (err) => {
	console.log("err : ", err);
	// console.log("err message: ", err.message, "err code : ", err.code);
	let errors = {};

	// login - incorrect pseudo
	if (err.message === "incorrect pseudo") {
		errors.pseudo = "Identifiant invalide";
	}

	// login - incorrect password
	if (err.message === "incorrect password") {
		errors.password = "Mot de passe incorrect";
	}

	// signup - duplicate email error
	if (err.code === 11000 && err.keyValue.email !== null) {
		errors.email = "Cet email est déjà pris. Veuillez recommencer.";
		return errors;
	}

	// signup - validation errors
	if (err._message?.includes("User validation failed")) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}

	console.log("ERROR MESSAGES FOR USER ----->", errors);

	return errors;
};

/* Json Web Token */
const maxAge = 1 * 1 * 30 * 60; // 30 minutes
const createToken = (user) => {
	return jwt.sign(user, process.env.SESSION_SECRET, {
		expiresIn: maxAge,
	});
};

/* Controllers */

module.exports.post_signup = async (req, res) => {
	const newUser = req.body;
	try {
		// Format name
		newUser.lastName = func.capitalizeWord(newUser.lastName);
		newUser.firstName = func.capitalizeWord(newUser.firstName);

		// Check if pseudo already exist
		newUser.pseudo = (
			newUser.firstName.slice(0, 2) + newUser.lastName.slice(0, 9)
		).toLowerCase();
		const pseudoInDb = await userModel.findOne({ pseudo: newUser.pseudo });

		if (pseudoInDb)
			newUser.pseudo = newUser.pseudo + calc.getRandomInt(100).toString();

		const user = await userModel.create(newUser);

		res.status(201).json({
			successMessage: `${user.firstName} ${user.lastName} a bien été ajouté au staff.`,
		});
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ invalidCredentials: errors });
	}
};

module.exports.post_login = async (req, res) => {
	const { pseudo, password } = req.body;
	try {
		const user = await userModel.login(pseudo, password);

		const token = createToken(user);

		return res
			.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
			.status(200)
			.json({
				token,
				successMessage: `Connexion réussie. Buongiorno ${user.firstName} !`,
			});
	} catch (err) {
		const errors = handleErrors(err);
		res.status(401).json({ errors });
	}
};

//TODO: KEEP ???
module.exports.get_isLoggedIn = (req, res) => {
	if (res.locals.currentUser) {
		console.log("isLoggedIn route found res.locals.currentUser");
		return res
			.status(200)
			.json({ isLoggedIn: true, loggedUserId: res.locals.currentUser._id });
	} else {
		return res.status(401).json({ errors: "Unauthorized" });
	}
};

module.exports.get_logout = (req, res) => {
	//TODO: KEEP ??
	res.cookie("jwt", "", { maxAge: 1 });
	return res
		.status(200)
		.json({ successMessage: "Vous n'êtes plus connecté(e)." });
};
