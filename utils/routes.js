require("dotenv").config();

const getCoordinates = async (query) => {
	const searchParams = new URLSearchParams({
		address: query,
		key: process.env.MAPS_KEY,
	});
	const url = `https://maps.googleapis.com/maps/api/geocode/json?${searchParams}`;
	const resp = await fetch(url);
	const data = await resp.json();

	return data.results[0].geometry.location;
};

const getRoute = async (originCoordinates, destinationCoordinates) => {
	const routesEndpoint =
		"https://routes.googleapis.com/directions/v2:computeRoutes";

	const resp = await fetch(routesEndpoint, {
		method: "POST",
		body: JSON.stringify({
			origin: {
				location: {
					latLng: {
						latitude: originCoordinates.lat,
						longitude: originCoordinates.lng,
					},
				},
			},
			destination: {
				location: {
					latLng: {
						latitude: destinationCoordinates.lat,
						longitude: destinationCoordinates.lng,
					},
				},
			},
			travelMode: "DRIVE",
			computeAlternativeRoutes: false,
			languageCode: "en-GB",
			units: "METRIC",
		}),
		headers: new Headers({
			"Content-type": "application/json",
			"X-Goog-Api-Key": process.env.MAPS_KEY,
			"X-Goog-FieldMask": "routes.distanceMeters,routes.staticDuration",
		}),
	});

	const data = await resp.json();
	return data.routes[0];
};

const getJourney = (meters, seconds) => {
	var h = Math.floor(seconds / 3600);
	var m = Math.floor((seconds % 3600) / 60);

	var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes") : "";

	const time = hDisplay + mDisplay;
	const miles = `${Math.floor(meters / 1609)} miles`;

	return `${miles} / ${time}`;
};

const getEventsWithJourneys = async (homePostCode, events) => {
	const homeCoordinates = await getCoordinates(homePostCode);

	const eventsWithJourneys = [];

	for (const event of events) {
		const eventCoordinates = await getCoordinates(event.venuePostCode);
		const route = await getRoute(homeCoordinates, eventCoordinates);
		const journey = getJourney(
			route.distanceMeters,
			Number(route.staticDuration.slice(0, -1)),
		);
		eventsWithJourneys.push({
			...event,
			journey: journey,
		});
	}

	return eventsWithJourneys;
};

module.exports = {
	getEventsWithJourneys,
};
