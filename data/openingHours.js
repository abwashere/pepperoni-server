const amHours = ["11h30", "12h00", "12h30", "13h00", "13h30"];
const pmHours = ["19h30", "20h00", "20h30", "21h00", "21h30", "22h00"];
const dayHours = [...amHours, ...pmHours];

const openingHours = [
	{ day: "Wednesday", hours: pmHours },
	{ day: "Thursday", hours: dayHours },
	{ day: "Friday", hours: dayHours },
	{ day: "Saturday", hours: dayHours },
	{ day: "Sunday", hours: amHours },
	{ day: "Monday", hours: "fermé" },
	{ day: "Tuesday", hours: "fermé" },
];

//console.log(openingHours);

export { openingHours };
