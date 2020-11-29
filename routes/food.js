var express = require("express");
var router = express.Router();
const foodController = require("./../controllers/foodController");

// ==> /api/food

router.get("/", foodController.get_allFood);

router.post("/create", foodController.post_food);

router.get("/:id", foodController.get_food);

router.delete("/delete/:id", foodController.delete_food);

router.patch("/edit/:id", foodController.patch_food);

module.exports = router;
