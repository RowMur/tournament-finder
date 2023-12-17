const { getFilename } = require("./jsonHandlers");
const { expect, test } = require("@jest/globals");

test("getFilename works without file extension", () => {
	const input = "filename";
	const expected = "filename.json";
	const actual = getFilename(input);
	expect(actual).toEqual(expected);
});

test("getFilename works without file extension with dots", () => {
	const input = "google.com";
	const expected = "google.com.json";
	const actual = getFilename(input);
	expect(actual).toEqual(expected);
});

test("getFilename works without file extension", () => {
	const input = "filename.json";
	const expected = "filename.json";
	const actual = getFilename(input);
	expect(actual).toEqual(expected);
});
