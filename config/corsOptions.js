module.exports = {
	origin: (origin, callback) => {
		if (origin === process.env.CLIENT_URL || !origin) {
			// '!origin' is for Postman
			callback(null, true); // callback(error, allowed)
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true,
};
