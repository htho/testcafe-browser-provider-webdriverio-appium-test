import { ClientFunction } from "testcafe";

const allowedChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
export function mkValidPath(path: string): string {
	return path.split("").map(char => allowedChars.includes(char) ? char : "_").join("");
}

export function getRandomIntInRange(min: number, max: number) {
	return min + Math.floor(Math.random() * (max - min));
}

export const getWindowDevicePixelRatio = ClientFunction(() => window.devicePixelRatio);

const targetWidth = 640;
const targetHeight = 480;
export const landscapeDimensions = {width: targetWidth, height: targetHeight};
export const portraitDimensions = {width: targetHeight, height: targetWidth};

export type Dimensions = {width: number, height: number};
export const getWindowInnerDimensions = ClientFunction<Dimensions, []>(() => ({width: window.innerWidth, height: window.innerHeight}));
export type Orientation = "PORTRAIT" | "LANDSCAPE";
export const getWindowOrientation = ClientFunction<Orientation, []>(() => (window.innerWidth > window.innerHeight) ? "LANDSCAPE" : "PORTRAIT");

/** set size to something else so resize is necessary */
export const resizeToSomethingElse = async (t: TestController) => t.resizeWindow(targetWidth + 13, targetHeight + 13);
export const resizeTo = async (t: TestController, dimensions: Dimensions) => t.resizeWindow(dimensions.width, dimensions.height);
export const resizeToLandscape = async (t: TestController) => resizeTo(t, landscapeDimensions);
export const resizeToPortrait = async (t: TestController) => resizeTo(t, portraitDimensions);

export function getOrientation(dimensions: Dimensions): Orientation {
	if(dimensions.width > dimensions.height) return "LANDSCAPE";
	return "PORTRAIT";
}