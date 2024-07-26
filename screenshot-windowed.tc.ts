import { fixture, test } from "testcafe";
import { readFileSync } from "fs";
import { join as joinPath } from "path";
import { PNG } from "pngjs";
import {
	Dimensions,
	getWindowDevicePixelRatio,
	getWindowInnerDimensions,
	landscapeDimensions,
	mkValidPath,
	Orientation,
	portraitDimensions,
	resizeTo,
} from "./tools";

for (const withScollbars of [true, false]) {
	fixture(`windowed screenshot ${withScollbars ? "withScollbars" : "withoutScollbars"}`)
		.meta({viewPort: "variable"})
		.page("about:blank")
		.clientScripts([
			{content: `document.addEventListener("DOMContentLoaded", () => document.body.style.background = "#ccc");`},
			{content: `document.addEventListener("DOMContentLoaded", () => document.body.style.border = "50px solid #bbb");`},
			{content: withScollbars ? `document.addEventListener("DOMContentLoaded", () => document.body.style.height = "1000px");` : "{}"},
		]);

	const orientations: Orientation[] = ["PORTRAIT", "LANDSCAPE"];

	for (const orientation of orientations) {
		test(`takeScreenshot() - ${orientation}`, async t => {
			const isLandscape = orientation === "LANDSCAPE";
			const targetDimensions = isLandscape ? landscapeDimensions : portraitDimensions;

			await resizeTo(t, targetDimensions);
	
			await t.expect(getWindowInnerDimensions()).eql(targetDimensions, "Did not change to the expected dimensions!");
			
			const screenshotPath = `${mkValidPath(t.browser.alias)}--${mkValidPath(t.fixture.name)}--${mkValidPath(t.test.name)}`;
			await t.takeScreenshot(screenshotPath);

			// adjust for retina displays
			const devicePixelRatio = await getWindowDevicePixelRatio();
			const adjustedDimensions: Dimensions = {
				width: targetDimensions.width * devicePixelRatio,
				height: targetDimensions.height * devicePixelRatio,
			};
	
			// adjust for cropped pixel
			adjustedDimensions.height--;
		
			const png = PNG.sync.read(readFileSync(joinPath("screenshots", `${screenshotPath}.png`)));
			const pngDimensions: Dimensions = {width: png.width, height: png.height};
			
			await t.expect(pngDimensions).eql(adjustedDimensions, "Screenshot does not have the same dimensions as the window!");
		});
	}
}