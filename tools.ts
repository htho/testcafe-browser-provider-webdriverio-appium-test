import { ClientFunction } from "testcafe";

const allowedChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
export function mkValidPath(path: string): string {
	return path.split("").map(char => allowedChars.includes(char) ? char : "_").join("");
}

export function getRandomIntInRange(min: number, max: number) {
	return min + Math.floor(Math.random() * (max - min));
}

export const getWindowInnerWidth = ClientFunction(() => window.innerWidth);
export const getWindowInnerHeight = ClientFunction(() => window.innerHeight);
export const getWindowDevicePixelRatio = ClientFunction(() => window.devicePixelRatio);