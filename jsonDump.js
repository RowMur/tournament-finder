const fs = require("fs");

const jsonDump = (filename, object) => {
	const splitFilename = filename.split(".");
	let endFilename = "";
	if (splitFilename[splitFilename.length - 1] == "json") {
		endFilename = filename;
	} else {
		endFilename = `${filename}.json`;
	}

	const json = JSON.stringify(object);
	fs.writeFileSync(endFilename, json);
};

module.exports = jsonDump;
