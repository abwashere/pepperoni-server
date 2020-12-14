var express = require("express");
var router = express.Router();
const tablesController = require("./../controllers/tablesController");

// ==> /api/tables

router.get("/", tablesController.get_tables);
router.get("/slot/:id", tablesController.get_slot);
router.get("/reservations", tablesController.get_reservations);
router.post("/slot", tablesController.post_slot);
router.post("/reservation", tablesController.post_reservation);
router.patch("/cancelation", tablesController.patch_cancelation); //the slot document and the related table are not deleted but just modified

module.exports = router;
