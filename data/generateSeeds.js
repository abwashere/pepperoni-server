require("./../config/dbConnection");
const mongoose = require("mongoose");
// import models
const foodModel = require("../models/Food");
// import seeds
const foodList = require("./foodSeeds");

async function generateSeeds() {
	mongoose.connection.dropDatabase();

	try {
		const allFoods = await foodModel.create(foodList);
		console.log("DB has been reinitialized with fresh seeds!");
	} catch (error) {
		console.log("error trying to generate all seeds => ", error);
	}
}

generateSeeds();
