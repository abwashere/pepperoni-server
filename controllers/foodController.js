const foodModel = require("../models/Food");

/* Errors handler */

const handleErrors = (err) => {
	let errors = {};

	// create - duplicate meal error
	if (err.code === 11000 && err.keyValue.foodName !== null) {
		errors.foodName = `${err.keyValue.foodName} existe déjà sur la carte. Choisissez un autre nom.`;
		return errors;
	}

	// create food - validation errors
	if (err._message && err._message.includes("Food validation failed")) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}

	return errors;
};

/* Controllers */

module.exports.get_allFood = async function (req, res, next) {
	try {
		const allFood = await foodModel.find().sort("category foodName");
		res.status(200).json(allFood);
	} catch (error) {
		res.status(401).json({ message: "Error getting the menu" });
	}
};

module.exports.post_food = async function (req, res, next) {
	try {
		const newFood = await foodModel.create(req.body);
		res.status(201).json(newFood);
	} catch (err) {
		const errors = handleErrors(err);
		res.status(401).json({ errors });
	}
};

module.exports.get_food = async function (req, res, next) {
	try {
		const food = await foodModel.findById(req.params.id);
		res.status(200).json(food);
	} catch (err) {
		const errors = handleErrors(err);
		res.status(401).json({ errors });
	}
};

module.exports.delete_food = async function (req, res, next) {
	try {
		const food = await foodModel.findByIdAndRemove(req.params.id);
		res.status(200).json(food);
	} catch (err) {
		const errors = handleErrors(err);
		res.status(401).json({ errors });
	}
};

module.exports.patch_food = async function (req, res, next) {
	try {
		const modifiedFood = await foodModel.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		res.status(201).json(modifiedFood);
	} catch (err) {
		const errors = handleErrors(err);
		res.status(401).json({ errors });
	}
};
