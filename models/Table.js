const mongoose = require("mongoose");
const reservationSchema = require("./Reservation").schema;

const tableSchema = new mongoose.Schema({
	tableNum: { type: Number, required: true },
	tableName: { type: String, required: true },
	capacity: { type: Number, required: true },
	isAvailable: { type: Boolean, default: true, required: true },
	reservation: [reservationSchema],
});

module.exports.model = mongoose.model("Table", tableSchema);
module.exports.schema = tableSchema;
