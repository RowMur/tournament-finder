const { getURLsFromHTML, normalizeURL, crawlPage } = require("./crawl");
const { expect, test } = require("@jest/globals");

const getMockFetchResponse = (statusCode, contentType, links) => ({
	status: statusCode,
	headers: new Headers({
		"content-type": contentType,
	}),
	text: () =>
		Promise.resolve(`
	        <div>
	            ${links.map(
					(link) => `
                        <a href="${link}">
                            ${link}
                        </a>
                    `,
				)}
	        </div>
        `),
});

const mockFetches = (responses) => {
	global.fetch = jest.fn();
	for (const response of responses) {
		global.fetch.mockResolvedValueOnce(
			getMockFetchResponse(
				response.statusCode,
				response.contentType,
				response.links,
			),
		);
	}
	global.fetch.mockResolvedValue(getMockFetchResponse(200, "text/html", []));
};

test("crawlPage basic", async () => {
	mockFetches([
		{
			statusCode: 200,
			contentType: "text/html",
			links: ["/1"],
		},
	]);

	const startingURL = "https://www.google.com";
	const actual = await crawlPage(startingURL, [""], startingURL, {});
	const expected = { "www.google.com": 1, "www.google.com/1": 1 };
	expect(actual).toStrictEqual(expected);
});

test("crawlPage only returns internal sub paths", async () => {
	mockFetches([
		{
			statusCode: 200,
			contentType: "text/html",
			links: ["/somePath", "https://www.bing.com"],
		},
	]);

	const startingURL = "https://www.google.com/anotherPath";
	const actual = await crawlPage(
		startingURL,
		["/anotherPath"],
		startingURL,
		{},
	);
	const expected = { [normalizeURL(startingURL)]: 1 };
	expect(actual).toStrictEqual(expected);
});

test("crawlPage adds to passed in pages", async () => {
	mockFetches([
		{
			statusCode: 200,
			contentType: "text/html",
			links: ["https://www.google.com/images"],
		},
	]);

	const startingURL = "https://www.google.com";
	const actual = await crawlPage(startingURL, [""], startingURL, {
		"www.google.com/images": 1,
	});
	const expected = { "www.google.com/images": 2, "www.google.com": 1 };
	expect(actual).toStrictEqual(expected);
});

test("crawlPage logs for bad status code", async () => {
	mockFetches([
		{
			statusCode: 400,
			contentType: "text/html",
			links: [],
		},
	]);

	global.console.log = jest.fn();

	const startingURL = "https://www.google.com";
	const actual = await crawlPage(startingURL, [""], startingURL, {});
	const expected = { "www.google.com": 1 };
	expect(actual).toStrictEqual(expected);

	const expectedLog =
		"error in fetch with status code: 400 on page: https://www.google.com";
	expect(global.console.log).toHaveBeenCalledWith(expectedLog);
});

test("crawlPage logs for wrong content type", async () => {
	mockFetches([
		{
			statusCode: 200,
			contentType: "text/xml",
			links: [],
		},
	]);

	global.console.log = jest.fn();

	const startingURL = "https://www.google.com";
	const actual = await crawlPage(startingURL, [""], startingURL, {});
	const expected = { "www.google.com": 1 };
	expect(actual).toStrictEqual(expected);

	const expectedLog =
		"non html response, content type: text/xml, on page: https://www.google.com";
	expect(global.console.log).toHaveBeenCalledWith(expectedLog);
});

const generateHTML = (links) => {
	return `
        <div>
            ${links.map(
				(link) => `
                <a href="${link}">
                    ${link}
                </a>
            `,
			)}
        </div>
    `;
};

test("getURLsFromHTML internal link", () => {
	const html = generateHTML(["/1"]);

	const expected = ["https://www.site.com/1"];
	const actual = getURLsFromHTML(html, "https://www.site.com");

	expect(actual).toStrictEqual(expected);
});

test("getURLsFromHTML external link", () => {
	const html = generateHTML(["https://www.google.com/"]);

	const expected = ["https://www.google.com/"];
	const actual = getURLsFromHTML(html, "https://www.site.com");

	expect(actual).toStrictEqual(expected);
});

const basicNormalizeURLTest = (urlString, expected) => {
	const actual = normalizeURL(urlString);
	expect(actual).toEqual(expected);
};

test("normalizeURL normalizes protocol", () => {
	basicNormalizeURLTest("http://www.google.com", "www.google.com");
});

test("normalizeURL normalizes query parameters", () => {
	basicNormalizeURLTest(
		"http://www.google.com?query-parameter=5",
		"www.google.com",
	);
});

test("normalizeURL normalizes trailing slash", () => {
	basicNormalizeURLTest("http://www.google.com/", "www.google.com");
});
