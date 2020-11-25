require("./../config/dbConnection");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// import models
const foodModel = require("../models/Food");
const userModel = require("../models/User");
// import seeds
const foodList = require("./foodSeeds");
const usersList = require("./usersSeeds");

async function generateSeeds() {
	mongoose.connection.dropDatabase();

	try {
		// Create meals from foodList
		const allFoods = await foodModel.create(foodList);

		// Create users from usersList
		usersList.forEach((user) => {
			const salt = bcrypt.genSaltSync((saltRounds = 10));
			const hash = bcrypt.hashSync(user.password, salt);
			user.password = hash;
		});
		const allUsers = await userModel.create(usersList);

		//
		console.log("DB has been reinitialized with fresh seeds!");
	} catch (error) {
		console.log("DB error trying to generate all seeds => ", error);
	}
}

generateSeeds();
