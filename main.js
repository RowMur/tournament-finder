const { crawlPage } = require("./crawl");
const { getEvents } = require("./events");
const { jsonLoad, jsonDump } = require("./jsonHandlers");
const { getRelevantEvents, logEventsReport } = require("./report");

const crawl = async () => {
	const baseURL = "https://www.tabletennisengland.co.uk/events";
	const acceptablePaths = ["/events", "/event"];

	console.log(`starting crawl of ${baseURL}`);

	const pages = await crawlPage(baseURL, acceptablePaths, baseURL, {});
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

const report = () => {
	console.log(`starting to generate report of events`);

	const events = jsonLoad("events");
	const acceptableAgeBands = ["Senior"];
	const acceptableTournamentTypes = [];
	const relevantEvents = getRelevantEvents(
		events,
		false,
		5,
		acceptableAgeBands,
		acceptableTournamentTypes,
	);
	logEventsReport(relevantEvents);

	console.log(`report of events complete`);
};

const main = async () => {
	// await crawl();
	// await scrape();
	report();
};

main();
