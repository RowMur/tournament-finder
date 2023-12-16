const fs = require("fs");

const jsonDump = (filename, object) => {
	const json = JSON.stringify(object);
	let endFilename = "";
	if (filename.split(".")[1] == "json") {
		endFilename = filename;
	} else {
		endFilename = `${filename}.json`;
	}
	fs.writeFileSync(endFilename, json);
};

module.exports = jsonDump;
