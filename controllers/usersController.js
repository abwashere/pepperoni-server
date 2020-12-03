const userModel = require("../models/User");

/* TODO: Errors handler */

const handleErrors = (err) => {
	console.log("err message & err code : ", err.message, err.code);
	let errors = {};

	// login - incorrect pseudo
	// if (err.message === "incorrect pseudo") {
	// 	errors.pseudo = "Identifiant invalide";
	// }

	// create food - validation errors
	if (err.message.includes("food validation failed")) {
		console.log("food validation failed-------------->", err);
		Object.values(err.errors).forEach(({ properties }) => {
			errors.properties.path = properties.message;
		});
	}
};

/* Controllers */

module.exports.get_allUsers = async function (req, res, next) {
	try {
		const allUsers = await userModel.find().sort("privileges lastName");
		res.status(200).json(allUsers);
	} catch (error) {
		res
			.status(500)
			.json({ error: err, message: "Error getting the users list" });
	}
};

module.exports.get_user = async function (req, res, next) {
	try {
		const user = await userModel.findById(req.params.id);
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: err, message: "Error getting one user" });
	}
};

module.exports.delete_user = async function (req, res, next) {
	try {
		const user = await userModel.findByIdAndRemove(req.params.id);
		res.status(200).send(user.userName);
	} catch (error) {
		res.status(500).json({ error: err, message: "Error deleting one user" });
	}
};

module.exports.patch_user = async function (req, res, next) {
	try {
		const modifiedUser = await userModel.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		res.status(201).json(modifiedUser);
	} catch (error) {
		res.status(500).json({ error: err, message: "Error editing the user" });
	}
};
