var express = require("express");
var router = express.Router();
const foodController = require("./../controllers/foodController");
const requireAuth = require("./../middlewares/requireAuth");

// ==> /api/food

router.get("/", foodController.get_allFood);

router.post("/create", requireAuth, foodController.post_food);

router.get("/:id", foodController.get_food);

router.delete("/delete/:id", requireAuth, foodController.delete_food);

router.patch("/edit/:id", requireAuth, foodController.patch_food);

module.exports = router;
