var express = require("express");
var router = express.Router();
const userModel = require("../models/User");

// ==> /api/users

/**
 * Get all users
 */
router.get("/", async function (req, res, next) {
	try {
		const allUsers = await userModel.find().sort("privileges lastName");
		res.status(200).json(allUsers);
	} catch (error) {
		res
			.status(500)
			.json({ error: err, message: "Error getting the users list" });
	}
});

/**
 * Get one
 */
router.get("/:id", async function (req, res, next) {
	try {
		const user = await userModel.findById(req.params.id);
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: err, message: "Error getting one user" });
	}
});

/**
 * Delete one
 */
router.delete("/delete/:id", async function (req, res, next) {
	try {
		const user = await userModel.findByIdAndRemove(req.params.id);
		res.status(200).send(user.userName);
	} catch (error) {
		res.status(500).json({ error: err, message: "Error deleting one user" });
	}
});

/**
 * Modify one
 */
router.patch("/edit/:id", async function (req, res, next) {
	try {
		const modifiedUser = await userModel.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		res.status(201).json(modifiedUser);
	} catch (error) {
		res.status(500).json({ error: err, message: "Error editing the user" });
	}
});

module.exports = router;
