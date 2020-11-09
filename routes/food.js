var express = require("express");
var router = express.Router();

const foodModel = require("../models/Food");

// ==> /api/food

/**
 * Get all
 */
router.get("/", async function (req, res, next) {
	try {
		const allFood = await foodModel.find().sort("category foodName");
		res.status(200).json(allFood);
	} catch (error) {
		res.status(500).json(error);
	}
});
/**
 * Create one
 */
router.post("/create", async function (req, res, next) {
	try {
		const newFood = await foodModel.create(req.body);
		res.status(201).json(newFood);
	} catch (error) {
		res.status(500).json(error);
	}
});
/**
 * Get one
 */
router.get("/:id", async function (req, res, next) {
	try {
		const food = await foodModel.findById(req.params.id);
		res.status(200).json(food);
	} catch (error) {
		res.status(500).json(error);
	}
});
/**
 * Delete one
 */
router.delete("/delete/:id", async function (req, res, next) {
	try {
		const food = await foodModel.findByIdAndRemove(req.params.id);
		res.status(204).json(food);
	} catch (error) {
		res.status(500).json(error);
	}
});
/**
 * Modify one
 */
router.patch("/edit/:id", async function (req, res, next) {
	try {
		const modifiedFood = await foodModel.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		res.status(204).json(modifiedFood);
	} catch (error) {
		res.status(500).json(error);
	}
});
module.exports = router;
