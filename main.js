const { crawlPage } = require("./utils/crawl");
const { getEvents } = require("./utils/events");
const { jsonLoad, jsonDump } = require("./utils/jsonHandlers");
const {
	getRelevantEvents,
	logEventsReport,
	sendEventsReport,
} = require("./utils/report");
const { getEventsWithJourneys } = require("./utils/routes");

const crawl = async () => {
	const baseURL = "https://www.tabletennisengland.co.uk/events";
	const acceptablePaths = ["/events"];
	const pathsToOnlyCollect = ["/event/"];

	console.log(`starting crawl of ${baseURL}`);

	const pages = await crawlPage(
		baseURL,
		acceptablePaths,
		pathsToOnlyCollect,
		baseURL,
		{},
	);
	jsonDump("crawled-page", pages);

	console.log(`crawl complete of ${baseURL}`);
};

const scrape = async () => {
	console.log(`starting to scrape events`);

	const pages = jsonLoad("crawled-page");
	const urls = Object.keys(pages);
	const eventURLs = urls.filter((url) => url.includes("/event/"));

	const events = await getEvents(eventURLs);
	jsonDump("events", events);

	console.log(`scrape of events complete`);
};

const report = async () => {
	console.log(`starting to generate report of events`);

	const events = jsonLoad("events");
	const acceptableAgeBands = ["Senior"];
	const acceptableTournamentTypes = [];
	const relevantEvents = getRelevantEvents(
		events,
		false,
		10,
		acceptableAgeBands,
		acceptableTournamentTypes,
		false,
	);

	const eventsWithJourneys = await getEventsWithJourneys(
		process.env.HOME_POST_CODE,
		relevantEvents,
	);

	logEventsReport(eventsWithJourneys);
	await sendEventsReport(eventsWithJourneys);

	console.log(`report of events complete`);
};

const main = async () => {
	await crawl();
	await scrape();
	await report();
};

main();
