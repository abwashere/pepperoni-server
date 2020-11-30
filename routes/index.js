var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
	res.render("index", { title: "Express" });
	res.status(200).send("Tout va bien sur /");
});

module.exports = router;
