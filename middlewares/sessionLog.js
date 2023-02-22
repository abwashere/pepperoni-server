module.exports = (req, res, next) => {
	console.log(
		"========= Session user :",
		req.session.currentUser ? req.session.currentUser.firstName : "No user connected"
	);
	next();
};
