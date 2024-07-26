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
	"Mac:safari": {
		...macServer,
		capabilities: {
			"appium:automationName": "Safari",

			"platformName": "Mac",
			"browserName": "Safari",
		},
	},

	"iPhoneSE3:safari": {
		...macServer,
		capabilities: {
			"appium:automationName": "xcuitest",

			"platformName": "ios",
			"browserName": "safari",
			
			"appium:deviceName": "iPhone SE (3rd generation)",
		},
	},

	"iPhoneSE3:safari:safari-driver": {
		...macServer,
		capabilities: {
			"appium:automationName": "Safari",
			
			"platformName": "iOS",
			"browserName": "Safari",
			
			"safari:useSimulator": true,
			"safari:deviceName": "iPhone SE (3rd generation)",
		}
	},

	"iPad6:safari": {
		...macServer,
		capabilities: {
			"appium:automationName": "xcuitest",
			
			"platformName": "ios",
			"browserName": "safari",

			"appium:deviceName": "iPad (6th generation)",
		},
	},

	"iPad6:safari:safari-driver": {
		...macServer,
		capabilities: {
			"appium:automationName": "Safari",
			
			"platformName": "iOS",
			"browserName": "Safari",
			
			"safari:useSimulator": true,
			"safari:deviceName": "iPad (6th generation)",
		},
		"tcwdioappium:resizeStrategy": "rotateDevice"
	},

	"iPadRealDevice:safari:safari-driver": {
		...macServer,
		capabilities: {
			"appium:automationName": "Safari",
			
			"platformName": "iOS",
			"browserName": "Safari",
			
			"safari:useSimulator": false,
			"safari:deviceName": "my-ipad",
		},
	},

	"win:chrome": {
		...winServer,
		capabilities: {
			"appium:automationName": "Chromium",

			"platformName": "windows",
			"browserName": "chrome",
		},
	},

	/** does not use Appium */
	"local:chrome": {
		capabilities: {
			browserName: "chrome",
		},
	},
	/** does not use Appium */
	"local:chrome:headless": {
		capabilities: {
			"browserName": "chrome",
			"goog:chromeOptions": {
				args: ["headless"],
			},
		},
	},
};
