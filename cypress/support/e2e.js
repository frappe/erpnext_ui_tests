// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "../../../frappe/cypress/support/commands"; // eslint-disable-line
import "./commands";
import "@cypress/code-coverage/support";

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.Cookies.defaults({
	preserve: "sid",
});

// spy on error and warnings
Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'error');
  cy.spy(win.console, 'log');
  cy.spy(win.console, 'warn');
});

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

// taken from https://github.com/cypress-io/cypress/issues/5302#issuecomment-543959807
let timeout_id;

const test_timeout = 5 * 60 * 1000; // 5 minutes

beforeEach(() => {
  timeout_id = setTimeout(() => {
    throw new Error("Test took too long time.")
  }, test_timeout);
})

afterEach(() => {
  clearTimeout(timeout_id)
})
