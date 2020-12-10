const allTables = require("./../data/_tablesSeeds");
const tableModel = require("../models/Table").model;
const slotModel = require("../models/Slot").model;
const capitalize = require("./../utils/capitalizedName").capitalizeWord;

/* TODO: Errors handler */
/* 
const handleErrors = (err) => {
	console.log("err : ", err);
	let errors = {};

	// login - incorrect pseudo
	if (err.message === "incorrect pseudo") {
		errors.pseudo = "Identifiant invalide";
	}

	// login - incorrect password
	if (err.message === "incorrect password") {
		errors.password = "Mot de passe incorrect";
	}

	// signup - duplicate email error
	if (err.code === 11000 && err.keyValue.email !== null) {
		errors.email = "Cet email est déjà pris. Veuillez recommencer.";
		return errors;
	}
	// signup - incorrect password formats
	if (err.message === "incorrect password length") {
		errors.password =
			"Le mot de passe doit contenir au moins 6 caractères dont 1 lettre et 1 chiffre";
	}
	if (err.message === "incorrect password string") {
		errors.password =
			"Le mot de passe doit contenir au moins 1 lettre et 1 chiffre.";
	}

	// signup - validation errors
	if (err._message?.includes("User validation failed")) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}

	console.log("all errors :::", errors);

	return errors;
};
 */

module.exports.get_slot = async function (req, res, next) {
	console.log("getting slot :::", req.params.id);
	try {
		const slot = await slotModel.findById(req.params.id);
		if (slot) return res.status(200).json(slot);
		else return res.status(401).send("the slot has not been documented yet");
	} catch (error) {
		console.log("get slot error !!!\n===>", error);
		return res.status(401).json({ error });
	}
};

module.exports.get_tables = async function (req, res, next) {
	console.log("getting tables list");
	try {
		const tables = await tableModel.find().sort("tableNum");
		if (tables.length) return res.status(200).json(tables);
	} catch (error) {
		console.log("tables list error !!!\n===>", error);
		return res.status(401).json({ error });
	}
};

module.exports.post_availabilityCheck = async function (req, res, next) {
	console.log("Checking the availability of :::", req.body);
	const requestedDate = new Date(req.body.date);
	const requestedTime = req.body.time;

	try {
		const slot = await slotModel.find({
			date: requestedDate,
			time: requestedTime,
		});
		if (slot.length) {
			// a document already exist for the requested date
			console.log("Slot already exists");
			res.status(200).json({ message: "Slot already exists", slot });
		} else {
			// no existing document for the requested date => create it
			console.log("Slot does not exists. Trying to create it...");
			const requestedSlot = {
				date: requestedDate,
				time: requestedTime,
				tables: allTables,
			};

			const newSlot = await slotModel.create(requestedSlot);
			res.status(200).json({ message: "New slot created", slot: newSlot });
		}
	} catch (error) {
		console.log("availabilityCheck error !!!\n===>", error);
		res.status(401).json({ error });
	}
};

module.exports.post_reservation = async function (req, res, next) {
	console.log("trying to book :::", req.body);
	const { slotID, seats, client } = req.body;

	try {
		// Find the selected slot
		const slot = await slotModel.findById(slotID);

		// See if a table with the capacity needed is available
		const allTables = slot.tables;
		const neededTable =
			allTables.find(
				(table) => table.capacity === seats && table.isAvailable
			) ||
			allTables.find(
				(table) => table.capacity === seats + 1 && table.isAvailable
			);

		if (neededTable) {
			// A table is available : update the selected slot with new infos (format name first)
			let name = client.clientName
				.split(" ")
				.map((word) => capitalize(word))
				.join(" ");
			client.clientName = name;

			neededTable.isAvailable = false;
			neededTable.reservation = client;

			const ind = allTables.findIndex((table) => table._id === neededTable._id);
			allTables[ind] = neededTable;

			const updatedSlot = await slotModel
				.findByIdAndUpdate(slotID, { tables: allTables }, { new: true })
				.populate("reservation");

			res.status(200).json({
				message: "Slot has been modified.",
				reservation: neededTable,
				slot: updatedSlot,
			});
		} else {
			// There is no table of such capacity or the table is unavailable :
			res.status(200).json({ message: "No tables available." }); // TODO: THROW ERROR FOR ERROR HANDLER
		}
	} catch (error) {
		console.log("reservation error !!!\n===>", error);
		res.status(401).json({ error });
	}
};
