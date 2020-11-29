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
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
	return jwt.sign({ id }, "xxx audwey vewy secret !& 987551564", {
		expiresIn: maxAge,
	});
};

/* Controllers */

module.exports.post_signup = async (req, res, next) => {
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
		console.log(newUser.pseudo + " ========already exist in db");
		if (pseudoInDb)
			newUser.pseudo = newUser.pseudo + calc.getRandomInt(100).toString();

		const newUserDocument = await userModel.create(newUser);

		// Add user with no password in session
		const user = newUserDocument.toObject();
		delete user.password;

		res.status(201).json({
			user,
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

		const token = createToken(user._id);
		res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

		res.status(200).json({
			user,
			successMessage: `Connexion réussie. Buongiorno ${user.firstName} !`,
		});

		req.session.currentUser = user; //FIXME:
		console.log("Logged in : ", user.firstName);
	} catch (err) {
		const errors = handleErrors(err);
		res.status(401).json({ errors });
	}
};

module.exports.get_isLoggedIn = (req, res) => {
	if (req.session.currentUser) {
		res
			.status(200)
			.json({ isLoggedIn: true, loggedUserId: req.session.currentUser._id });
	} else {
		res.status(401).json({ errors: "Unauthorized" });
	}
};

module.exports.get_logout = (req, res) => {
	req.session.destroy(function (error) {
		if (error)
			res.status(500).json({ errors: "Error trying to disconnect user" });
		else
			res.status(200).json({ successMessage: "Vous n'êtes plus connecté(e)." });
	});
};
