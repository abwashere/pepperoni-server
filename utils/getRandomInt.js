//integer between 0 and va
function getRandomInt(maxVal) {
	return Math.floor(Math.random() * Math.floor(maxVal));
}

//integer between minVal and maxVal
function getRandomIntWithInterval(minVal, maxVal) {
	result = Math.floor(minVal + Math.random() * Math.floor(maxVal));
	if (minVal < maxVal) return result;
	else
		throw new Error(
			"First argument of the function must be smaller than the second argument."
		);
}
module.exports.getRandomInt = getRandomInt;
module.exports.getRandomIntWithInterval = getRandomIntWithInterval;
