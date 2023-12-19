const { getEvent } = require("./events");
const { expect, test } = require("@jest/globals");

const mockFetch = (
	statusCode,
	contentType,
	eventTitle,
	eventDate,
	eventCategories,
	closingDate,
	venuePostCode,
) => {
	global.fetch = jest.fn();
	global.fetch.mockResolvedValue({
		status: statusCode,
		headers: new Headers({
			"content-type": contentType,
		}),
		text: () =>
			Promise.resolve(`
            <div>
                ${
					eventTitle &&
					`
                        <div class="article-title">
                            <h3>${eventTitle}</h3>
                        </div>
                    `
				}
                ${
					eventDate &&
					`
                        <abbr title="${eventDate}">${eventDate}</abbr>
                    `
				}
                ${
					eventCategories &&
					`
                        <div class="tribe-events-event-categories">
                            ${eventCategories.map(
								(eventCategory) => `
                                <a>${eventCategory}</a>
                            `,
							)}
                        </div>
                    `
				}
                ${
					closingDate &&
					`
                        <div>
                            <strong>Closing date for entries:</strong> ${closingDate} 
                        </div>    
                    `
				}
                ${
					venuePostCode &&
					`
                        <div class="tribe-postal-code">${venuePostCode}</div>
                    `
				}
            </div>
        `),
	});
};

test("getEvent basic", async () => {
	mockFetch(
		200,
		"text/html",
		"Cambridge Tournament",
		"17 December 2023",
		["Senior", "1* event"],
		"10 December 2023",
		"CB1 1AA",
	);

	const url = "www.tabletennisengland.co.uk/event/cambridge-tournament";
	const actual = await getEvent(url);
	const expected = {
		title: "Cambridge Tournament",
		date: new Date("2023-12-17T00:00:00.000Z"),
		closingDate: new Date("2023-12-10T00:00:00.000Z"),
		categories: ["Senior", "1* event"],
		venuePostCode: "CB1 1AA",
		page: "http://www.tabletennisengland.co.uk/event/cambridge-tournament",
	};

	expect(actual).toStrictEqual(expected);
});

test("getEvent expired event", async () => {
	mockFetch(
		200,
		"text/html",
		"Cambridge Tournament",
		"17 December 2023",
		["Senior", "1* event"],
		undefined,
		"CB1 1AA",
	);

	const url = "www.tabletennisengland.co.uk/event/cambridge-tournament";
	const actual = await getEvent(url);
	const expected = {
		title: "Cambridge Tournament",
		date: new Date("2023-12-17T00:00:00.000Z"),
		closingDate: undefined,
		categories: ["Senior", "1* event"],
		venuePostCode: "CB1 1AA",
		page: "http://www.tabletennisengland.co.uk/event/cambridge-tournament",
	};

	expect(actual).toStrictEqual(expected);
});
