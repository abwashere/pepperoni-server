var express = require("express");
var router = express.Router();
const usersController = require("./../controllers/usersController");
const requireAuth = require("./../middlewares/requireAuth");

// ==> /api/users

router.get("/", requireAuth, usersController.get_allUsers);

router.get("/:id", requireAuth, usersController.get_user);

router.delete("/delete/:id", requireAuth, usersController.delete_user);

router.patch("/edit/:id", requireAuth, usersController.patch_user);

module.exports = router;
