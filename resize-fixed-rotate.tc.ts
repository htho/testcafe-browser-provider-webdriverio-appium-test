import { fixture, test } from "testcafe";
import {
	getWindowOrientation,
	Orientation,
	resizeToLandscape,
	resizeToPortrait
} from "./tools";

fixture("resize strategies for fixed sized browsers")
	.meta({viewPort: "fixed"})
	.page("about:blank");

test("rotate()", async t => {
	const isLandscape = await getWindowOrientation() === "LANDSCAPE";
	const expectedOrientation: Orientation = isLandscape ? "PORTRAIT" : "LANDSCAPE";
	
	if(isLandscape) await resizeToPortrait(t);
	else await resizeToLandscape(t);
	
	await t.expect(getWindowOrientation()).eql(expectedOrientation, "Orientation did not change!");
});

test("rotate() and back", async t => {
	const initialOrientation = await getWindowOrientation();
	const isLandscape = initialOrientation === "LANDSCAPE";
	const expectedOrientation: Orientation = isLandscape ? "PORTRAIT" : "LANDSCAPE";
	
	if(isLandscape) await resizeToPortrait(t);
	else await resizeToLandscape(t);
	
	await t.expect(getWindowOrientation()).eql(expectedOrientation, "Orientation did not change!");
	
	
	if(isLandscape) await resizeToLandscape(t);
	else await resizeToPortrait(t);
	
	await t.expect(getWindowOrientation()).eql(initialOrientation, "Orientation did not change!");
});

