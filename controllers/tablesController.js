const tableModel = require("../models/Table");
const slotModel = require("../models/Slot");
const reservationModel = require("../models/Reservation");

module.exports.availability = async function (req, res, next) {
	try {
		return;
		res.status(200).json();
	} catch (error) {
		res
			.status(500)
			.json({ error: err, message: "Error checking table availability" });
	}
};
