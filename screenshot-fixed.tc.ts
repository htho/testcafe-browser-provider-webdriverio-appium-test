import { fixture, test } from "testcafe";
import { readFileSync } from "fs";
import { join as joinPath } from "path";
import { PNG } from "pngjs";
import {
	Dimensions,
	getOrientation,
	getWindowOrientation,
	mkValidPath,
	Orientation,
	resizeToLandscape,
	resizeToPortrait,
} from "./tools";

for (const withScollbars of [true, false]) {
	fixture(`screenshots on fixed sized browsers ${withScollbars ? "withScollbars" : "withoutScollbars"}`)
		.meta({viewPort: "fixed"})
		.page("about:blank")
		.clientScripts([
			{content: `document.addEventListener("DOMContentLoaded", () => document.body.style.background = "#ccc");`},
			{content: `document.addEventListener("DOMContentLoaded", () => document.body.style.border = "50px solid #bbb");`},
			{content: withScollbars ? `document.addEventListener("DOMContentLoaded", () => document.body.style.height = "1000px");` : "{}"},
		]);

	const orientations: Orientation[] = ["PORTRAIT", "LANDSCAPE"];

	for (const orientation of orientations) {
		test(`takeScreenshot() - ${orientation}`, async t => {
			if(orientation === "LANDSCAPE") await resizeToLandscape(t);
			else await resizeToPortrait(t);

			await t.expect(getWindowOrientation()).eql(orientation, "Did not change to the expected orientation!");
		
			const screenshotPath = `${mkValidPath(t.browser.alias)}--${mkValidPath(t.fixture.name)}--${mkValidPath(t.test.name)}`;
			await t.takeScreenshot(screenshotPath);
	
			const png = PNG.sync.read(readFileSync(joinPath("screenshots", `${screenshotPath}.png`)));
			const pngDimensions: Dimensions = {width: png.width, height: png.height};
			const pngOrientation = getOrientation(pngDimensions);
		
			await t.expect(pngOrientation).eql(orientation, "Screenshot does not have the same orientation as the window!");
		});
	}
}