const { defineConfig } = require("cypress");

const spec_patterns = {
	"1": [
		"./cypress/integration/TF_01_smoke/*",
		"./cypress/integration/TF_02_framework/*",
	],
	"2": [
		"./cypress/integration/TF_03_masters/*",
		"./cypress/integration/TF_04_accounts/*",
		"./cypress/integration/TF_09_reports/*",
	],
	"3": [
		"./cypress/integration/TF_03_masters/*",
		"./cypress/integration/TF_05_selling/*",
		"./cypress/integration/TF_09_reports/*",
	],
	"4": [
		"./cypress/integration/TF_03_masters/*",
		"./cypress/integration/TF_06_buying/*",
	],
	"5": [
		"./cypress/integration/TF_03_masters/*",
		"./cypress/integration/TF_07_stock/*",
		"./cypress/integration/TF_08_manufacturing/*",
	],
};

const get_spec_list = () => {
	if (process.env.RUNNER_NUMBER) {
		// in CI return only requested group of tests
		return spec_patterns[process.env.RUNNER_NUMBER];
	} else {
		// return all tests
		return [].concat(...Object.values(spec_patterns));
	}
};

module.exports = defineConfig({
	projectId: "da59y9",
	defaultCommandTimeout: 20000,
	pageLoadTimeout: 30000,
	video: true,
	videoUploadOnPasses: false,
	retries: {
		runMode: 2,
		openMode: 0,
	},
	e2e: {
		setupNodeEvents(on, config) {
			return require("./cypress/plugins/index.js")(on, config);
		},
		baseUrl: "http://test_site:8000/",
		specPattern: get_spec_list(),
	},
});
