const { test, expect } = require("@jest/globals");
const {
	filterEventsByDate,
	sortEventsByDate,
	filterEventsByCategories,
} = require("./report");

test("filterEventsByDate", () => {
	const events = [
		{
			title: "Tournament 1",
			date: new Date("2124"),
			closingDate: new Date("2124"),
		},
		{
			title: "Tournament 2",
			date: new Date("2014"),
			closingDate: new Date("2014"),
		},
	];

	const expected = [
		{
			title: "Tournament 1",
			date: new Date("2124"),
			closingDate: new Date("2124"),
		},
	];

	const actual = filterEventsByDate(events, "date");
	expect(actual).toStrictEqual(expected);
});

test("filterEventsByDate doesn't mind missing closingDate", () => {
	const events = [
		{
			title: "Tournament 1",
			date: new Date("2124"),
			closingDate: new Date("2014"),
		},
		{
			title: "Tournament 2",
			date: new Date("2114"),
		},
	];

	const expected = [
		{
			title: "Tournament 2",
			date: new Date("2114"),
		},
	];

	const actual = filterEventsByDate(events, "closingDate");
	expect(actual).toStrictEqual(expected);
});

test("sortEventsByDate", () => {
	const events = [
		{
			title: "Tournament 1",
			date: new Date("2016"),
			closingDate: new Date("2015"),
		},
		{
			title: "Tournament 2",
			date: new Date("2014"),
			closingDate: new Date("2013"),
		},
		{
			title: "Tournament 3",
			date: new Date("2015"),
			closingDate: new Date("2014"),
		},
	];

	const expected = [
		{
			title: "Tournament 2",
			date: new Date("2014"),
			closingDate: new Date("2013"),
		},
		{
			title: "Tournament 3",
			date: new Date("2015"),
			closingDate: new Date("2014"),
		},
		{
			title: "Tournament 1",
			date: new Date("2016"),
			closingDate: new Date("2015"),
		},
	];

	const actual = sortEventsByDate(events, "date");
	expect(actual).toStrictEqual(expected);
});

test("filterEventsByCategories filters for age categories", () => {
	const events = [
		{ title: "Tournament 1", categories: ["Senior", "Junior"] },
		{ title: "Tournament 2", categories: ["Veteran"] },
		{ title: "Tournament 3", categories: ["Junior", "Cadet"] },
	];

	const expected = [
		{ title: "Tournament 1", categories: ["Senior", "Junior"] },
	];

	const actual = filterEventsByCategories(events, ["Senior"], [], false);
	expect(actual).toStrictEqual(expected);
});

test("filterEventsByCategories filters for tournament categories", () => {
	const events = [
		{ title: "Tournament 1", categories: ["1* Event"] },
		{ title: "Tournament 2", categories: ["2* Event"] },
		{ title: "Tournament 3", categories: ["4* Event"] },
	];

	const expected = [{ title: "Tournament 3", categories: ["4* Event"] }];

	const actual = filterEventsByCategories(events, [], ["4* Event"], false);
	expect(actual).toStrictEqual(expected);
});

test("filterEventsByCategories filters for gendered tournaments", () => {
	const events = [
		{ title: "Tournament 1", categories: ["1* Event", "Women and Girls"] },
		{ title: "Tournament 2", categories: ["2* Event"] },
		{ title: "Tournament 3", categories: ["4* Event"] },
	];

	const expected = [
		{ title: "Tournament 2", categories: ["2* Event"] },
		{ title: "Tournament 3", categories: ["4* Event"] },
	];

	const actual = filterEventsByCategories(events, [], [], false);
	expect(actual).toStrictEqual(expected);
});
