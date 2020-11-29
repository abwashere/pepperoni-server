const mongoose = require("mongoose");
const reservationSchema = require("./Reservation");

const tableSchema = new mongoose.Schema({
	tableName: { type: String, required: true },
	capacity: { type: Number, required: true },
	isAvailable: { type: Boolean, default: true, required: true },
	reservation: [reservationSchema],
});

// const Table = mongoose.model("Table", tableSchema);

// module.exports = Table;
module.exports = tableSchema;
