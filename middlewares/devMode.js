module.exports = function devMode(req, res, next) {
	req.session.currentUser = {
		_id: "admin123",
		privileges: "admin",
		firstName: "Audrey",
		lastName: "Belson",
		pseudo: "aubelson",
		email: "audrey@pepperoni.com",
		type: "devMode",
	};
	req.session.cookie.maxAge = 1000 * 60 * 60 * 24; // 24 h
	next();
};
