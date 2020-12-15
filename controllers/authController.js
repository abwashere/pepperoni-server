const userModel = require("../models/User");
const func = require("./../utils/capitalizedName");
const calc = require("./../utils/getRandomInt");

/* Errors handler */
const handleErrors = (err) => {
	console.log("err : ", err);
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
	// signup - incorrect password formats
	if (err.message === "incorrect password length") {
		errors.password =
			"Le mot de passe doit contenir au moins 6 caractères dont 1 lettre et 1 chiffre";
	}
	if (err.message === "incorrect password string") {
		errors.password =
			"Le mot de passe doit contenir au moins 1 lettre et 1 chiffre.";
	}

	// signup - validation errors
	if (err._message && err._message.includes("User validation failed")) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}

	console.log("all errors :::", errors);

	return errors;
};

/* Controllers */

module.exports.post_signup = async (req, res) => {
	const newUser = req.body;
	try {
		// Format name
		newUser.lastName = func.capitalizeWord(newUser.lastName);
		newUser.firstName = func.capitalizeWord(newUser.firstName);

		// Create pseudo
		newUser.pseudo = (
			newUser.firstName.slice(0, 2) + newUser.lastName.slice(0, 9)
		).toLowerCase();
		// Check if pseudo already exists
		const pseudoInDb = await userModel.findOne({ pseudo: newUser.pseudo });
		// ... and modify if needed
		if (pseudoInDb)
			newUser.pseudo = newUser.pseudo + calc.getRandomInt(100).toString();

		// Save new user
		const user = await userModel.create(newUser);
		res.status(201).json({
			successMessage: `${user.firstName} ${user.lastName} a bien été ajouté(e) au staff.`,
		});
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};

module.exports.post_login = async (req, res) => {
	const { pseudo, password } = req.body;
	try {
		const user = await userModel.login(pseudo, password);

		req.session.currentUser = user;
		console.log("JUST LOGGED IN === ", req.session.currentUser.firstName);

		return res.status(200).json({
			cookie: req.session.cookie,
			user,
			successMessage: `Connexion réussie. Buongiorno ${user.firstName} !`,
		});
	} catch (err) {
		const errors = handleErrors(err);
		res.status(401).json({ errors });
	}
};

module.exports.get_logout = (req, res) => {
	req.session.destroy(function (error) {
		if (error) {
			const errors = handleErrors(err);
			res.status(401).json({ errors });
		} else {
			res.status(200).json({ successMessage: "Vous n'êtes plus connecté(e)." });
		}
	});
};
module.exports.get_isLoggedIn = (req, res) => {
	if (
		req.session.currentUser &&
		req.session.currentUser._id === req.params.userID
	) {
		res.status(200).json({ user: req.session.currentUser });
	} else {
		res.status(401).json({ invalidCredentials: "Unauthorized" });
	}
};
