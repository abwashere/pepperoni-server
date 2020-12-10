const fs = require("fs");
const tablesAmount = Math.floor(Math.random() * 16) + 10; // 10 to 15 generated tables

let fakeTables = [];

for (i = 1; i < tablesAmount; i++) {
	const seats = Math.floor(Math.random() * 9) + 2; // 2 to 10 seats
	const name = `Table ${i}`;
	fakeTables.push({
		tableNum: i,
		tableName: name,
		capacity: seats,
		isAvailable: true,
	});
}

// Randomly generate a fake tablesSeeds JSON file
let data = JSON.stringify(
	{
		tables: fakeTables,
	},
	null,
	2
);
fs.writeFileSync(__dirname + "/tables.json", data);
