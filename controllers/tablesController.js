const allTables = require("./../data/_tablesSeeds");
const reservationModel = require("../models/Reservation").model;
const tableModel = require("../models/Table").model;
const slotModel = require("../models/Slot").model;
const capitalize = require("./../utils/capitalizedName").capitalizeWord;

/* Errors handler */
const handleErrors = (err) => {
	console.log("err !!! ====> ", err.message);
	let errors = {};

	// availability
	if (err.message === "no tables available") {
		errors.unavailability =
			"Pas de tables disponibles sur ce créneau. Choisissez une autre plage horaire ou une autre date.";
	}
	// something is missing
	if (err.reason?.code === "ERR_ASSERTION") {
		errors[err.path] = "Données non valides.";
	}
	if (err.message === "invalid clientName field") {
		errors.clientName = "Veuillez renseigner un nom valide.";
	}
	if (err.message === "missing clientPhone field") {
		errors.clientPhone = "Veuillez renseigner un numéro de téléphone.";
	}
	// format error
	if (err.message === "invalid phone number") {
		errors.clientPhone = "Numéro invalide.";
	}
	if (err.message === "invalid email") {
		errors.clientEmail = "Email invalide.";
	}

	// validation errors
	if (err._message && err._message.includes("validation failed")) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}

	console.log("all errors :::", errors);

	return errors;
};

module.exports.post_slot = async function (req, res, next) {
	const { requestedDate, requestedTime } = req.body;

	try {
		const slot = await slotModel.find({
			date: requestedDate,
			time: requestedTime,
		});
		if (slot.length) {
			// a document already exist for the requested date
			res.status(200).json({ slot });
		} else {
			// no existing document for the requested date => create it
			const requestedSlot = {
				date: requestedDate,
				time: requestedTime,
				tables: allTables,
			};
			const newSlot = await slotModel.create(requestedSlot);
			res.status(200).json({ slot: newSlot });
		}
	} catch (error) {
		const errors = handleErrors(error);
		res.status(400).json({ errors });
	}
};

module.exports.post_reservation = async function (req, res, next) {
	console.log("trying to book :::", req.body);
	const { slotID, seats, client } = req.body;

	try {
		// Validation check
		await reservationModel.checkFormat(client);

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

			const day = updatedSlot.date.toLocaleString("fr-FR").slice(0, 10);

			res.status(200).json({
				successMessage: `Votre réservation du ${day} à ${updatedSlot.time} a bien été enregistrée.`,
				slot: updatedSlot,
			});
		} else {
			throw Error("no tables available");
		}
	} catch (error) {
		const errors = handleErrors(error);
		res.status(400).json({ errors });
	}
};

module.exports.get_reservations = async function (req, res, next) {
	try {
		const reservations = await slotModel
			.find()
			.populate("reservation")
			.sort("date");
		if (reservations.length) {
			reservations.map(
				(reservation) =>
					(reservation.tables = reservation.tables.filter(
						(table) => !table.isAvailable
					))
			);
			const bookedTables = reservations.filter(
				(reservation) => !!reservation.tables.length
			);
			if (bookedTables.length) res.status(200).json({ bookedTables });
			else res.status(401).json({ message: "Aucune réservation à venir." });
		} else {
			res.status(401).json({ message: "Aucune réservation à venir." });
		}
	} catch (error) {
		const errors = handleErrors(error);
		res.status(400).json({ errors });
	}
};

module.exports.patch_cancelation = async function (req, res, next) {
	const { slotID, tableID } = req.body;

	try {
		// Find the slot
		const slot = await slotModel.findById(slotID);

		// Find the table to cancel and update it
		const modifiedTables = slot.tables.map((table) => {
			if (table._id.toString() === tableID) {
				table.isAvailable = true;
				table.reservation = [];
				return table;
			} else {
				return table;
			}
		});

		const ind = modifiedTables.findIndex(
			(table) => table._id.toString() === tableID
		);
		const day = slot.date.toLocaleString("fr-FR").slice(0, 10);

		// Update slot
		const modifiedSlot = await slotModel
			.findByIdAndUpdate(slotID, { tables: modifiedTables }, { new: true })
			.populate("reservation");

		res.status(201).json({
			successMessage: `Table ${modifiedTables[ind].tableNum} : La réservation du ${day} à ${slot.time} a bien été annulée.`,
			slot: modifiedSlot,
		});
	} catch (error) {
		const errors = handleErrors(error);
		res.status(400).json({ errors });
	}
};

module.exports.get_slot = async function (req, res, next) {
	console.log("getting slot :::", req.params.id);
	try {
		const slot = await slotModel.findById(req.params.id);
		if (slot) return res.status(200).json(slot);
		else return res.status(401).send("the slot has not been documented yet");
	} catch (error) {
		const errors = handleErrors(error);
		res.status(400).json({ errors });
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
