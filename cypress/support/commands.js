// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... });
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... });
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... });
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... });

const slug = (name) => name.toLowerCase().replaceAll(" ", "-");

const compare_document = (expected, actual) => {
	for (const prop in expected) {
		if (expected[prop] instanceof Array) {
			// recursively compare child documents.
			expected[prop].forEach((item, idx) => {
				compare_document(item, actual[prop][idx]);
			});
		} else {
			assert.equal(
				expected[prop],
				actual[prop],
				`${prop} should be equal.`
			);
		}
	}
};

Cypress.Commands.add("go_to_doc", (doctype, name) => {
	cy.visit(`/app/${slug(doctype)}/${encodeURIComponent(name)}`);
});

Cypress.Commands.add("new_doc", (doctype) => {
	cy.visit(`/app/${slug(doctype)}/new`);
});

Cypress.Commands.add("compare_document", (expected_document) => {
	cy.window()
		.its("cur_frm")
		.then((frm) => {
			compare_document(expected_document, frm.doc);
		});
});

Cypress.Commands.add("get_input", (fieldname) => {
	return cy.get(`[data-fieldname="${fieldname}"]:visible input`, {scrollBehavior: 'center'});
});

Cypress.Commands.add("set_input", (fieldname, value) => {
	cy.get_input(fieldname)
		.clear({scrollBehavior: 'center'})
		.type(value, {delay: 200, scrollBehavior: false})
	cy.wait(1000);
});

Cypress.Commands.add("set_link", (fieldname, value) => {
	cy.get_input(fieldname)
		.clear({scrollBehavior: 'center'})
		.type(value, {delay: 200, scrollBehavior: false})
		.wait(1000)
	cy.get(`[data-fieldname="${fieldname}"] ul:visible li:first-child`)
		.click({scrollBehavior: false});
	cy.wait(1000);
});

Cypress.Commands.add('click_toolbar_button', (text) => {
	cy.scrollTo('top');
	cy.get(`.page-head:visible [data-label="${encodeURIComponent(text)}"]`)
		.click({scrollBehavior: false, force:true});
});

Cypress.Commands.add('click_toolbar_dropdown', (text) => {
	cy.get(`.page-head:visible [data-label="${encodeURIComponent(text)}"]`)
		.click({scrollBehavior: false, force:true});
});

Cypress.Commands.add('get_page_title', () => {
	return cy.get('.page-title:visible', {timeout: 50000});
});

Cypress.Commands.add('click_section', (title) => {
	return cy.get('.section-head:visible').contains(title).click({scrollBehavior: false});
});

Cypress.Commands.add("datepicker_pick_today", (fieldname) => {
	cy.get_field(fieldname, 'Date')
		.click({scrollBehavior: false});  // Opens calendar
	cy.get('.datepicker.active > .datepicker--buttons > .datepicker--button')
		.click({scrollBehavior: false});  // Click on 'Today' on calendar view
});
