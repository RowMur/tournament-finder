const { crawlPage } = require("./crawl");
const jsonDump = require("./jsonDump");

const main = async () => {
	if (process.argv.length < 3) {
		console.log("no website provided");
		process.exit(1);
	}

	const baseURL = process.argv[2];
	const acceptablePaths = process.argv.slice(3);

	const baseURLObj = new URL(baseURL);
	acceptablePaths.push(baseURLObj.pathname);

	console.log(`starting crawl of ${baseURL}`);
	const pages = await crawlPage(baseURL, acceptablePaths, baseURL, {});

	jsonDump("crawled-page", pages);
};

main();
