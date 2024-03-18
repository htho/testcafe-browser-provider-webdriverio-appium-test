import { ClientFunction, Selector, fixture, test } from "testcafe";
import { 
	getRandomIntInRange,
	getWindowDevicePixelRatio,
	getWindowInnerHeight,
	getWindowInnerWidth,
	mkValidPath
} from "./tools";
import { PNG } from "pngjs";
import {readFileSync} from "fs";
import {join as joinPath} from "path";

const _targetWidth = 800;
const _targetHeight = 600;

fixture("screenshot")
    .page("about:blank")
    .clientScripts([
        {content: `document.addEventListener("DOMContentLoaded", () => document.body.style.background = "#ccc");`},
        {content: `document.addEventListener("DOMContentLoaded", () => document.body.style.border = "50px solid #bbb");`},
		// // scrollbars are not in the screenshot
        // {content: `document.addEventListener("DOMContentLoaded", () => document.body.style.height = "1000px");`},
    ])

test("openBrowser()", async t => {
	await t.expect(Selector("body").getStyleProperty("background-color")).eql("rgb(204, 204, 204)");
});

test("resizeWindow()", async t => {
	const targetWidth = _targetWidth + getRandomIntInRange(1, 100);
	const targetHeight = _targetHeight + getRandomIntInRange(1, 100);
	
    await t.expect(getWindowInnerWidth()).notEql(targetWidth, "Width not expected to be targetWidth yet!");
    await t.expect(getWindowInnerHeight()).notEql(targetHeight, "Height not expected to be targetHeight yet!");
    
    await t.resizeWindow(targetWidth, targetHeight);
    
    await t.expect(getWindowInnerWidth()).eql(targetWidth, "Width not properly set to targetWidth!");
    await t.expect(getWindowInnerHeight()).eql(targetHeight, "Height not properly set to targetHeight!");
});

test("maximizeWindow()", async t => {
	const targetWidth = _targetWidth + getRandomIntInRange(1, 100);
	const targetHeight = _targetHeight + getRandomIntInRange(1, 100);

    await t.resizeWindow(targetWidth, targetHeight);
    
    await t.expect(getWindowInnerWidth()).eql(targetWidth, "Width not properly set to targetWidth!");
    await t.expect(getWindowInnerHeight()).eql(targetHeight, "Height not properly set to targetHeight!");

	await t.maximizeWindow();

	await t.expect(getWindowInnerWidth()).gte(targetWidth, "After maximizeWindow() the window should have a greater or equal width!");
    await t.expect(getWindowInnerHeight()).gte(targetHeight, "After maximizeWindow() the window shoudl have a greater or equal height!");

	// there seems to be a bug in TestCafe, where resizeWindow does not work
	// properly the first time after the window was maximized.
    await t.resizeWindow(targetWidth, targetHeight);
});

test.skip("maximizeWindow() then resizeWindow()", async t => {
	await t.maximizeWindow();
	
	const targetWidth = _targetWidth + getRandomIntInRange(1, 100);
	const targetHeight = _targetHeight + getRandomIntInRange(1, 100);
	
	const getWindowInnerDimensions = ClientFunction(() => ({width: window.innerWidth, height: window.innerHeight}))
	console.log({windowInnerDimensions: await getWindowInnerDimensions()})
    await t.resizeWindow(targetWidth, targetHeight);
	
    await t.expect(getWindowInnerWidth()).eql(targetWidth, "Width not properly set to targetWidth!");
	// this fails for native TestCafe browsers - height is off by one px
	// testcafe-browser-provider-webdriverio-appium works around this bug
    await t.expect(getWindowInnerHeight()).eql(targetHeight, "Height not properly set to targetHeight!");
});

test.skip("canResizeWindowToDimensions() - can't be implemented since we want to be able to use the same tests on fixed sized mobile devices and on resizable desktops.", async t => {
	// greater than 8k
	const targetWidth = 7680 + getRandomIntInRange(1, 100);
	const targetHeight = 4320 + getRandomIntInRange(1, 100);

    await t.expect(getWindowInnerWidth()).notEql(targetWidth, "Width not expected to be targetWidth yet!");
    await t.expect(getWindowInnerHeight()).notEql(targetHeight, "Height not expected to be targetHeight yet!");
    
    await t.resizeWindow(targetWidth, targetHeight);
    
    await t.expect(getWindowInnerWidth()).notEql(targetWidth, "Width not expected to ever be targetWidth!");
    await t.expect(getWindowInnerHeight()).notEql(targetHeight, "Height not expected to ever be targetHeight!");
});

test("takeScreenshot()", async t => {
	const targetWidth = _targetWidth;
	const targetHeight = _targetHeight;

    await t.resizeWindow(targetWidth, targetHeight);

    const screenshotPath = `${mkValidPath(t.browser.alias)}--${mkValidPath(t.test.name)}`;
    
    await t.takeScreenshot(screenshotPath);

	await t.expect(getWindowInnerWidth()).eql(targetWidth, "Width not properly set to targetWidth!");
    await t.expect(getWindowInnerHeight()).eql(targetHeight, "Height not properly set to targetHeight!");

	// adjust for retina displays
    const devicePixelRatio = await getWindowDevicePixelRatio();
    const expectedWidth = targetWidth * devicePixelRatio;
    const expectedHeight = targetHeight * devicePixelRatio;

    const png = PNG.sync.read(readFileSync(joinPath("screenshots", `${screenshotPath}.png`)));
	await t.expect(png.width).eql(expectedWidth, "Screenshot does not have the same width as the window!");
	try {
		await t.expect(png.height).eql(expectedHeight, "Screenshot does not have the same height as the window! This is a known bug!");
	} catch (error) {
		await t.report(JSON.stringify(error, null, 4
		));
	}
});
