module.exports = function devMode(req, res, next) {
	req.session.currentUser = {
		_id: "5ec3aaa1dda5ba14c2c72fe8",
		firstName: "Audrey",
		lastName: "Pepperonette",
		role: "admin",
		email: "audrey@pepperoni.com",
	};
	next();
};
