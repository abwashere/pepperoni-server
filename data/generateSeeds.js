require("./../config/dbConnection");
const mongoose = require("mongoose");
const fs = require("fs");
// import models
const foodModel = require("../models/Food");
const userModel = require("../models/User");
const tableModel = require("../models/Table").model;
// import seeds
const foodList = require("./_foodSeeds");
const usersList = require("./_usersSeeds");
const tablesList = require("./_tablesSeeds");

async function generateSeeds() {
	mongoose.connection.dropDatabase();

	try {
		// Create meals
		await foodModel.create(foodList);

		// Create users
		await userModel.create(usersList);

		// Create tables
		await tableModel.create(tablesList);

		console.log("DB has been reinitialized with fresh seeds!");

		mongoose.connection.close();
	} catch (error) {
		console.log("DB error trying to generate all seeds \n=> ", error);
	}
}

generateSeeds();
