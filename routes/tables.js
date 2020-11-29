var express = require("express");
var router = express.Router();
const tablesController = require("./../controllers/tablesController");

// ==> /api/tables

/**
 * Check table availability
 */
router.get("/availability", tablesController.availability);

/**
 * Book a table
 */
// router.get("/book/:slot_id", tablesController.book);

module.exports = router;
