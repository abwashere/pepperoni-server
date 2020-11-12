const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
	foodName: { type: String, required: true },
	category: {
		type: String,
		enum: ["antipasti", "principal", "dessert"],
		required: true,
	},
	description: { type: String },
	price: { type: Number || String, required: true },
});

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
