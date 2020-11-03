const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
	category: {
		type: String,
		enum: ["starter", "main", "desert"],
		required: true,
	},
	dishName: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
});

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
