const filterEventsByDate = (events, dateField) => {
	return events.filter((event) => {
		const date = event[dateField] || event.date;
		const eventDate = new Date(date);
		const today = new Date();
		return eventDate.getTime() > today.getTime();
	});
};

const sortEventsByDate = (events, dateField) => {
	events.sort((a, b) => {
		const aDate = a[dateField] || a.date;
		const aDateObj = new Date(aDate);
		const aEpoc = aDateObj.getTime();

		const bDate = b[dateField] || b.date;
		const bDateObj = new Date(bDate);
		const bEpoc = bDateObj.getTime();

		if (aEpoc > bEpoc) {
			return 1;
		} else if (aEpoc < bEpoc) {
			return -1;
		}
		return 0;
	});

	return events;
};

const filterEventsByCategories = (
	events,
	acceptableAgeBands,
	acceptableTournamentTypes,
	includeWomensOnlyEvents,
) => {
	return events.filter((event) => {
		const eventCategories = event.categories;

		if (eventCategories.includes("Grand Prix")) {
			return eventCategories.push("Senior");
		}

		let isAnAcceptableAgeBand = false;
		if (acceptableAgeBands.length == 0) {
			isAnAcceptableAgeBand = true;
		}
		for (const acceptableAgeBand of acceptableAgeBands) {
			if (eventCategories.includes(acceptableAgeBand)) {
				isAnAcceptableAgeBand = true;
			}
		}

		let isAnAcceptableTournamentType = false;
		if (acceptableTournamentTypes.length == 0) {
			isAnAcceptableTournamentType = true;
		}
		for (const acceptableTournamentType of acceptableTournamentTypes) {
			if (eventCategories.includes(acceptableTournamentType)) {
				isAnAcceptableTournamentType = true;
			}
		}

		let isAnAcceptableGender = true;
		if (
			!includeWomensOnlyEvents &&
			eventCategories.includes("Women and Girls")
		) {
			isAnAcceptableGender = false;
		}

		return (
			isAnAcceptableAgeBand &&
			isAnAcceptableTournamentType &&
			isAnAcceptableGender
		);
	});
};

const getRelevantEvents = (
	events,
	sortByEntryDate,
	nOfEvents,
	acceptableAgeBands,
	acceptableTournamentTypes,
	includeWomensOnlyEvents,
) => {
	let dateField;
	if (sortByEntryDate) {
		dateField = "closingDate";
	} else {
		dateField = "date";
	}

	events = filterEventsByDate(events, dateField);
	events = sortEventsByDate(events, dateField);
	events = filterEventsByCategories(
		events,
		acceptableAgeBands,
		acceptableTournamentTypes,
		includeWomensOnlyEvents,
	);

	return events.slice(0, nOfEvents);
};

const logEventsReport = (events) => {
	console.log("-------------------------------------------------");
	for (const event of events) {
		console.log();
		console.log(
			`${event.title} ----- ${new Date(event.date).toDateString()}`,
		);
		if (event.closingDate) {
			console.log(
				`Closing date for entrires: ${new Date(
					event.closingDate,
				).toDateString()}`,
			);
		}
		console.log(`Categories: ${event.categories.join(", ")}`);
		console.log(`Post code: ${event.venuePostCode}`);
		console.log(`Event page: ${event.page}`);
		console.log();
		console.log("-------------------------------------------------");
	}
};

module.exports = {
	filterEventsByDate,
	sortEventsByDate,
	filterEventsByCategories,
	getRelevantEvents,
	logEventsReport,
};
