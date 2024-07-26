import { fixture, test } from "testcafe";
import {
	getWindowInnerDimensions,
	landscapeDimensions,
	resizeToLandscape,
	resizeToSomethingElse
} from "./tools";

fixture("resize windowed")
	.meta({viewPort: "variable"})
	.page("about:blank")
	.afterEach(resizeToSomethingElse);

test("resizeWindow()", async t => {
	await resizeToLandscape(t);

	await t.expect(getWindowInnerDimensions()).eql(landscapeDimensions, "Window not resized properly!");
});

test("maximizeWindow()", async t => {
	const initialDimensions = await getWindowInnerDimensions();

	await t.maximizeWindow();

	await t.expect(getWindowInnerDimensions()).notEql(initialDimensions, "Window not resized!");
	const maximizedDimensions = await getWindowInnerDimensions();
	await t.expect(maximizedDimensions.width).gt(initialDimensions.width, "Width did not increase!");
	await t.expect(maximizedDimensions.height).gt(initialDimensions.height, "Height did not increase!");
});

test("maximizeWindow() then resizeWindow()", async t => {
	await t.maximizeWindow();

	await resizeToLandscape(t);

	await t.expect(getWindowInnerDimensions()).eql(landscapeDimensions, "Window not resized properly!");
});

