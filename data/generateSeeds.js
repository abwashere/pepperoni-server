require("./../config/dbConnection");
const mongoose = require("mongoose");
// import models
const foodModel = require("../models/Food");
const userModel = require("../models/User");
// import seeds
const foodList = require("./foodSeeds");
const usersList = require("./usersSeeds");

async function generateSeeds() {
	mongoose.connection.dropDatabase();

	try {
		// Create meals
		const allFoods = await foodModel.create(foodList);

		// Create users
		const allUsers = await userModel.create(usersList);

		//
		console.log("DB has been reinitialized with fresh seeds!");
	} catch (error) {
		console.log("DB error trying to generate all seeds => ", error);
	}
}

generateSeeds();
