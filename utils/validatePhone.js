module.exports = (num) => {
	// eslint-disable-next-line
	const regex = /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/;
	return regex.test(num) ? true : false;
};
