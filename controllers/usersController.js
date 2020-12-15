const userModel = require("../models/User");

/* Errors handler */

const handleErrors = (err) => {
	let errors = {};

	// create user - validation errors
	if (err._message && err._message.includes("User validation failed")) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}
	console.log("errors :::", errors);
	return errors;
};

/* Controllers */

module.exports.get_allUsers = async function (req, res, next) {
	try {
		const allUsers = await userModel.find().sort("privileges lastName");
		res.status(200).json(allUsers);
	} catch (err) {
		const errors = handleErrors(err);
		res.status(401).json({ errors });
	}
};

module.exports.get_user = async function (req, res, next) {
	try {
		const user = await userModel.findById(req.params.id);
		res.status(200).json(user);
	} catch (err) {
		const errors = handleErrors(err);
		res.status(401).json({ errors });
	}
};

module.exports.delete_user = async function (req, res, next) {
	try {
		const user = await userModel.findByIdAndRemove(req.params.id);
		res.status(200).send(user.userName);
	} catch (err) {
		const errors = handleErrors(err);
		res.status(401).json({ errors });
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
	} catch (err) {
		const errors = handleErrors(err);
		res.status(401).json({ errors });
	}
};
