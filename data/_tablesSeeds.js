const fs = require("fs");

let tableData = fs.readFileSync(__dirname + "/tables.json");

module.exports = JSON.parse(tableData).tables;
