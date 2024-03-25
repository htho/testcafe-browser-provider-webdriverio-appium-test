import { readFileSync } from "fs";
import { join as joinPath } from "path";
import { PNG } from "pngjs";
import { ClientFunction, fixture, Selector, test } from "testcafe";
import {
	getWindowDevicePixelRatio,
	getWindowInnerHeight,
	getWindowInnerWidth,
	mkValidPath,
} from "./tools";

const targetWidth = 640;
const targetHeight = 480;
const targetDimensions = {width: targetWidth, height: targetHeight};

const getWindowInnerDimensions = ClientFunction(() => ({width: window.innerWidth, height: window.innerHeight}));

// set size to something else so resize is necessary
const setSizeToSomethingElse = async (t: TestController) => t.resizeWindow(targetWidth + 13, targetHeight + 13);

fixture("screenshot")
	.page("about:blank")
	.clientScripts([
		{content: `document.addEventListener("DOMContentLoaded", () => document.body.style.background = "#ccc");`},
		{content: `document.addEventListener("DOMContentLoaded", () => document.body.style.border = "50px solid #bbb");`},
		// // scrollbars are not in the screenshot
		// {content: `document.addEventListener("DOMContentLoaded", () => document.body.style.height = "1000px");`},
	]);

test("openBrowser()", async t => {
	await t.expect(Selector("body").getStyleProperty("background-color")).eql("rgb(204, 204, 204)");
});

test("resizeWindow()", async t => {
	await t.expect(getWindowInnerDimensions()).notEql(
		targetDimensions,
		"Window not expected to be have targetDimensions yet!",
	);

	await t.resizeWindow(targetWidth, targetHeight);

	await t.expect(getWindowInnerDimensions()).eql(targetDimensions, "Window not resized properly!");
}).after(setSizeToSomethingElse);

test("maximizeWindow()", async t => {
	await t.resizeWindow(targetWidth, targetHeight);
	await t.expect(getWindowInnerDimensions()).notEql(targetDimensions, "Window not resized properly!");

	await t.maximizeWindow();

	await t.expect(getWindowInnerWidth()).gte(
		targetWidth,
		"After maximizeWindow() the window should have greater or equal width!",
	);
	await t.expect(getWindowInnerHeight()).gte(
		targetHeight,
		"After maximizeWindow() the window should have greater or equal height!",
	);
}).after(setSizeToSomethingElse);

test("maximizeWindow() then resizeWindow() - (see: https://github.com/DevExpress/testcafe/issues/8157)", async t => {
	await t.maximizeWindow();

	await t.resizeWindow(targetWidth, targetHeight);

	// this fails for native TestCafe browsers - height is off by one px
	// testcafe-browser-provider-webdriverio-appium works around this bug
	// (see: https://github.com/DevExpress/testcafe/issues/8157)
	await t.expect(getWindowInnerDimensions()).eql(targetDimensions, "Window not resized properly!");
}).after(setSizeToSomethingElse);

test("canResizeWindowToDimensions() - can't be implemented since we want to be able to use the same tests on fixed sized mobile devices and on resizable desktops.", async t => {
	// greater than 8k
	const targetWidth = 7680 + 7;
	const targetHeight = 4320 + 7;
	const targetDimensions = {width: targetWidth, height: targetHeight};

	await t.expect(getWindowInnerDimensions()).notEql(targetDimensions, "Window not expected to be resized!");

	await t.resizeWindow(targetWidth, targetHeight);

	await t.expect(getWindowInnerDimensions()).notEql(targetDimensions, "Window not expected to ever be resized!");
}).after(setSizeToSomethingElse);

test("takeScreenshot()", async t => {
	await t.resizeWindow(targetWidth, targetHeight);
	await t.expect(getWindowInnerDimensions()).eql(targetDimensions, "Window not resized properly!");

	const screenshotPath = `${mkValidPath(t.browser.alias)}--${mkValidPath(t.test.name)}`;
	await t.takeScreenshot(screenshotPath);

	// adjust for retina displays
	const devicePixelRatio = await getWindowDevicePixelRatio();
	const adjustedDimensions = {
		width: targetWidth * devicePixelRatio,
		height: targetHeight * devicePixelRatio,
	};

	const png = PNG.sync.read(readFileSync(joinPath("screenshots", `${screenshotPath}.png`)));
	const pngDimensions = {width: png.width, height: png.height};
	await t.expect(pngDimensions).eql(adjustedDimensions, "Screenshot does not have the same dimensions as the window!");
}).after(setSizeToSomethingElse);
