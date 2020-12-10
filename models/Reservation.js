const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
	clientName: { type: String, required: true },
	clientPhone: { type: String, required: true },
	clientEmail: { type: String },
});

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports.model = Reservation;
module.exports.schema = reservationSchema;
