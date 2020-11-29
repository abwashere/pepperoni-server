const mongoose = require("mongoose");
const tableSchema = require("./Table");

const slotSchema = new mongoose.Schema({
	date: { type: Date, required: true },
	// day: { type: Date, required: true },
	// hour: { type: String, required: true },
	tables: [tableSchema],
});

const Slot = mongoose.model("Slot", slotSchema);

module.exports = Slot;
