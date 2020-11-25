module.exports = function devMode(req, res, next) {
	req.session.currentUser = {
		_id: "5ec3aaa1ddb5ba14c2c72fe0",
		firstName: "Audrey",
		lastName: "Pepperonette",
		privileges: "admin",
		email: "audrey@pepperoni.com",
	};
	next();
};
