const fs = require("fs");

const getFilename = (filename) => {
	const splitFilename = filename.split(".");
	let endFilename = "";
	if (splitFilename[splitFilename.length - 1] == "json") {
		endFilename = filename;
	} else {
		endFilename = `${filename}.json`;
	}
	return endFilename;
};

const jsonDump = (filename, object) => {
	const jsonFilename = getFilename(filename);
	const json = JSON.stringify(object);
	fs.writeFileSync(jsonFilename, json);
};

const jsonLoad = (filename) => {
	const jsonFilename = getFilename(filename);
	const jsonFile = fs.readFileSync(jsonFilename);
	return JSON.parse(jsonFile);
};

module.exports = { jsonDump, jsonLoad, getFilename };
