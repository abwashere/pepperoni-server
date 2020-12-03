const foodModel = require("../models/Food");

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

module.exports.get_allFood = async function (req, res, next) {
	try {
		const allFood = await foodModel.find().sort("category foodName");
		res.status(200).json(allFood);
	} catch (error) {
		res.status(500).json({ error: err, message: "Error getting the menu" });
	}
};

module.exports.post_food = async function (req, res, next) {
	try {
		const newFood = await foodModel.create(req.body);
		res.status(201).json(newFood);
	} catch (error) {
		res.status(500).json({ error: err, message: "Error creating meal" });
	}
};

module.exports.get_food = async function (req, res, next) {
	try {
		const food = await foodModel.findById(req.params.id);
		res.status(200).json(food);
	} catch (error) {
		res.status(500).json({ error: err, message: "Error getting one meal" });
	}
};

module.exports.delete_food = async function (req, res, next) {
	try {
		const food = await foodModel.findByIdAndRemove(req.params.id);
		res.status(200).send(food.foodName + " has been deleted");
	} catch (error) {
		res.status(500).json({ error: err, message: "Error deleting one meal" });
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
	} catch (error) {
		res.status(500).json({ error: err, message: "Error editing a meal" });
	}
};
