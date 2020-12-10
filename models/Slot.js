const mongoose = require("mongoose");
const tableSchema = require("./Table").schema;

const slotSchema = new mongoose.Schema({
	date: { type: Date, required: true },
	// day: { type: Date, required: true },
	time: { type: String, required: true },
	tables: [tableSchema],
});

const Slot = mongoose.model("Slot", slotSchema);

module.exports.model = Slot;
module.exports.schema = slotSchema;
