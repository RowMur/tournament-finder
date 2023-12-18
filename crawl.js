const { JSDOM } = require("jsdom");

const crawlPage = async (
	baseURL,
	pathsToCrawl,
	pathsToOnlyCollect,
	currentURL,
	pages,
) => {
	const baseURLObj = new URL(baseURL);
	const currentURLObj = new URL(currentURL);

	const acceptablePaths = pathsToCrawl.concat(pathsToOnlyCollect);

	let isOnAcceptablePath = false;
	for (const acceptablePath of acceptablePaths) {
		if (currentURLObj.pathname.startsWith(acceptablePath)) {
			isOnAcceptablePath = true;
			break;
		}
	}

	const shouldCrawl =
		baseURLObj.hostname === currentURLObj.hostname && isOnAcceptablePath;

	if (!shouldCrawl) {
		return pages;
	}

	const normalizedCurrentURL = normalizeURL(currentURL);
	if (pages[normalizedCurrentURL] > 0) {
		pages[normalizedCurrentURL]++;
		return pages;
	}

	pages[normalizedCurrentURL] = 1;

	let isOnCollectOnlyPath = false;
	for (const pathToOnlyCollect of pathsToOnlyCollect) {
		if (currentURLObj.pathname.startsWith(pathToOnlyCollect)) {
			isOnCollectOnlyPath = true;
			break;
		}
	}

	if (isOnCollectOnlyPath) {
		return pages;
	}

	console.log(`actively crawling: ${currentURL}`);

	try {
		const resp = await fetch(currentURL);

		if (resp.status > 399) {
			console.log(
				`error in fetch with status code: ${resp.status} on page: ${currentURL}`,
			);
			return pages;
		}

		const contentType = resp.headers.get("content-type");
		if (!contentType.includes("text/html")) {
			console.log(
				`non html response, content type: ${contentType}, on page: ${currentURL}`,
			);
			return pages;
		}

		const htmlBody = await resp.text();
		const nextURLs = getURLsFromHTML(htmlBody, baseURLObj.origin);

		for (const nextURL of nextURLs) {
			pages = await crawlPage(
				baseURL,
				pathsToCrawl,
				pathsToOnlyCollect,
				nextURL,
				pages,
			);
		}
	} catch (err) {
		console.log(`error in fetch: ${err.message}, on page: ${currentURL}`);
	}

	return pages;
};

const getURLsFromHTML = (htmlBody, originURL) => {
	const urls = [];
	const dom = new JSDOM(htmlBody);
	const linkElements = dom.window.document.querySelectorAll("a");
	for (const linkElement of linkElements) {
		let urlObj;
		if (linkElement.href.slice(0, 1) === "/") {
			try {
				urlObj = new URL(`${originURL}${linkElement.href}`);
			} catch (err) {
				console.log(
					`error with relative url: ${err.message}, URL: ${linkElement.href}`,
				);
			}
		} else {
			try {
				urlObj = new URL(linkElement.href);
			} catch (err) {
				console.log(
					`error with absolute url: ${err.message}, URL: ${linkElement.href}`,
				);
			}
		}
		urls.push(urlObj.href);
	}

	return urls;
};

const normalizeURL = (urlString) => {
	const urlObj = new URL(urlString);
	const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
	if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
		return hostPath.slice(0, -1);
	}
	return hostPath;
};

module.exports = {
	crawlPage,
	getURLsFromHTML,
	normalizeURL,
};
