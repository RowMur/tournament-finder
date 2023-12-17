const { jsonDump } = require("./jsonHandlers");
const { expect, test } = require("@jest/globals");
const fs = require("fs");

test("jsonDump allows you to include .json", () => {
	const object = { test: 1 };
	const filename = "file.json";

	fs.writeFileSync = jest.fn();
	jsonDump(filename, object);

	expect(fs.writeFileSync).toHaveBeenCalledWith(
		filename,
		JSON.stringify(object),
	);
});

test("jsonDump allows you to not include .json", () => {
	const object = { test: 1 };
	const filename = "file";

	fs.writeFileSync = jest.fn();
	jsonDump(filename, object);

	expect(fs.writeFileSync).toHaveBeenCalledWith(
		`${filename}.json`,
		JSON.stringify(object),
	);
});
