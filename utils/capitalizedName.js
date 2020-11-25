function capitalizeWord(string) {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function capitalizeFamilyName(firstname, lastname) {
	return {
		firstname: capitalizeWord(firstname),
		lastname: capitalizeWord(lastname),
	};
}

module.exports.capitalizeWord = capitalizeWord;
module.exports.capitalizeFamilyName = capitalizeFamilyName;
