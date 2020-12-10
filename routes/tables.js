var express = require("express");
var router = express.Router();
const tablesController = require("./../controllers/tablesController");

// ==> /api/tables

router.get("/", tablesController.get_tables);
router.get("/slot_:id", tablesController.get_slot);
router.post("/availability", tablesController.post_availabilityCheck);
router.post("/reservation", tablesController.post_reservation);

module.exports = router;
