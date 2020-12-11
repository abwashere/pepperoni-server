const mongoose = require("mongoose");
const tableSchema = require("./Table").schema;

const slotSchema = new mongoose.Schema({
	date: {
		type: Date,
		required: [true, "Sélectionnez une date."],
	},
	time: {
		type: String,
		required: [true, "Sélectionnez une heure."],
	},
	tables: [tableSchema],
});

const Slot = mongoose.model("Slot", slotSchema);

module.exports.model = Slot;
module.exports.schema = slotSchema;
