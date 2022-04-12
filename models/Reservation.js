const mongoose = require("mongoose");
const { isEmail, isMobilePhone } = require("validator");
const isFrenchPhone = require("../utils/validatePhone");

const reservationSchema = new mongoose.Schema({
	clientName: {
		type: String,
		required: [true, "Merci de fournir un nom pour la réservation."],
	},
	clientPhone: {
		type: String,
		required: [true, "Merci de fournir un numéro de téléphone."],
	},
	clientEmail: {
		type: String,
		lowercase: true,
		validate: [isEmail, "Cet email n'est pas valide."],
	},
});

reservationSchema.statics.checkFormat = async function ({
	clientName,
	clientPhone,
	clientEmail,
}) {
	if (clientName.length < 2) throw Error("invalid clientName field");
	if (!clientPhone.length) throw Error("missing clientPhone field");
	if (!isMobilePhone(clientPhone) || !isFrenchPhone(clientPhone))
		throw Error("invalid phone number");
	if (clientEmail && !isEmail(clientEmail)) throw Error("invalid email");
};

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports.model = Reservation;
module.exports.schema = reservationSchema;
