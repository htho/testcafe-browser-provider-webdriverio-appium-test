// @ts-check
const winServer = {
	hostname: process.env["APPIUM_MACOS_HOST"] ?? "localhost",
	port: 4723,
};
const macServer = {
	hostname: process.env["APPIUM_WIN_HOST"] ?? "localhost",
	port: 4723,
};

/** @type {import("testcafe-browser-provider-webdriverio-appium").TcWdioAppiumConfig} */
export default {
	"macOS:safari": {
		...macServer,
		capabilities: {
			"platformName": "Mac",
			"appium:automationName": "Safari",
			"browserName": "Safari",
		}
	},
	"iPhoneSE3:safari": {
		...macServer,
		capabilities: {
			"platformName": "iOS",
			"appium:automationName": "Safari",
			"browserName": "Safari",
			"safari:useSimulator": true,
			"safari:deviceName": "iPhone SE (3rd generation)",
		}
	},
	"win:chrome": {
		...winServer,
		capabilities: {
			"platformName": "windows",
			"browserName": "chrome",
			"appium:automationName": "Chromium",
		}
	},
	"local:chrome": {
		capabilities: {
			"browserName": "chrome",
		}
	},
	"local:chrome:headless": {
		capabilities: {
			"browserName": "chrome",
			"goog:chromeOptions": {
				args: ["headless"],
			}
		}
	},
};
