var express = require("express");
var router = express.Router();
const authController = require("./../controllers/authController");

// ==> /api/auth

router.post("/signup", authController.post_signup);

router.post("/login", authController.post_login);

router.get("/isLoggedIn/:userID", authController.get_isLoggedIn);

router.get("/logout", authController.get_logout);

module.exports = router;
