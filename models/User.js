const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	privileges: {
		type: String,
		enum: ["admin", "employee"],
		required: [true, "Merci de renseigner tous les champs."],
	},
	email: {
		type: String,
		unique: true,
		required: [true, "Merci de renseigner tous les champs."],
		lowercase: true,
		validate: [isEmail, "Cet email n'est pas valide."],
	},
	password: {
		type: String,
		required: [true, "Merci de renseigner tous les champs."],
		minLength: [6, "Le mot de passe doit contenir au moins 6 caractères."],
	},
	firstName: {
		type: String,
		required: [true, "Merci de renseigner tous les champs."],
	},
	lastName: {
		type: String,
		required: [true, "Merci de renseigner tous les champs."],
	},
	pseudo: { type: String, lowercase: true },
});

/* Mongoose hook for hashing password */
userSchema.pre("save", function (next) {
	//
	const salt = bcrypt.genSaltSync((saltRounds = 10));
	this.password = bcrypt.hashSync(this.password, salt);

	next();
});

/* Static method to log in user */
userSchema.statics.login = async function (pseudo, password) {
	// 1. check pseudo
	const userInDB = await this.findOne({ pseudo });
	if (userInDB) {
		// 2. check password
		const validPassword = await bcrypt.compare(password, userInDB.password);
		if (validPassword) {
			const user = userInDB.toObject();
			delete user.password;
			return user;
		}
		throw Error("incorrect password");
	}
	throw Error("incorrect pseudo");
};

const User = mongoose.model("User", userSchema);

module.exports = User;
