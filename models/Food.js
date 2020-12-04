const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
	foodName: {
		type: String,
		unique: true,
		required: [true, "Champs obligatoire"],
	},
	category: {
		type: String,
		enum: ["antipasti", "principal", "dessert"],
		required: [true, "Champs obligatoire"],
	},
	price: {
		type: Number || String,
		required: [true, "Champs obligatoire"],
	},
	description: {
		type: String,
		required: false,
	},
});

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
