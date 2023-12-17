const { JSDOM } = require("jsdom");

const getEvents = async (urls) => {
	const events = [];
	for (const url of urls) {
		const event = await getEvent(url);
		if (event) {
			events.push(event);
		}
		events.push();
	}

	return events;
};

const getEvent = async (eventURL) => {
	try {
		let fullURL;
		if (eventURL.startsWith("http")) {
			fullURL = eventURL;
		} else {
			fullURL = `http://${eventURL}`;
		}
		console.log(`actively scraping: ${fullURL}`);

		const resp = await fetch(fullURL);

		if (resp.status > 399) {
			console.log(
				`error in fetch with status code: ${resp.status} on event with URL: ${eventURL}`,
			);
			return;
		}

		const contentType = resp.headers.get("content-type");
		if (!contentType.includes("text/html")) {
			console.log(
				`non html response, content type: ${contentType}, on event with URL: ${eventURL}`,
			);
			return;
		}

		const htmlBody = await resp.text();
		const { document } = new JSDOM(htmlBody).window;

		let eventTitle;
		try {
			eventTitle = document.querySelector(
				".article-title > h3",
			).textContent;
		} catch (err) {
			console.log(`error getting event title: ${err.message}`);
		}

		let eventDate;
		try {
			eventDate = new Date(document.querySelector("abbr").title);
		} catch (err) {
			console.log(`error getting event date: ${err.message}`);
		}

		const eventCategories = [];
		try {
			const eventCategoriesElements = document.querySelectorAll(
				".tribe-events-event-categories > a",
			);

			for (const element of eventCategoriesElements) {
				eventCategories.push(element.textContent);
			}
		} catch (err) {
			console.log(`error getting event categories: ${err.message}`);
		}

		let closingDate;
		try {
			const strongElements = document.querySelectorAll("strong");
			let closingDateTextElement;
			for (const strongElement of strongElements) {
				if (strongElement.textContent == "Closing date for entries:") {
					closingDateTextElement = strongElement;
				}
			}
			closingDate = new Date(
				closingDateTextElement.parentElement.textContent
					.replace("Closing date for entries:", "")
					.slice(1),
			);
		} catch (err) {
			console.log(`error getting event closing date: ${err.message}`);
		}

		let venuePostCode;
		try {
			venuePostCode =
				document.querySelector(".tribe-postal-code").textContent;
		} catch (err) {
			console.log(`error getting event venue post code: ${err.message}`);
		}

		const event = {
			title: eventTitle,
			date: eventDate,
			closingDate: closingDate,
			categories: eventCategories,
			venuePostCode: venuePostCode,
			page: fullURL,
		};

		return event;
	} catch (err) {
		console.log(
			`error in fetch: ${err.message}, on event with URL: ${eventURL}`,
		);
		return;
	}
};

module.exports = {
	getEvent,
	getEvents,
};
