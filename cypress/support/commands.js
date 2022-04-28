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

const get_field_parts = (fieldname) => {
	let field = { 'tablefield': null, 'fieldname': fieldname };
	if (fieldname.includes('.')) {
		// table field, split
		let parts = fieldname.split('.');
		field.tablefield = parts[0];
		field.fieldname = parts[1];
	}
	return field;
}

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

Cypress.Commands.add("click_listview_checkbox", (row_no) => {
	cy.get('.list-row-checkbox').eq(row_no).click();
});

Cypress.Commands.add("get_input", (fieldname) => {
	const field = get_field_parts(fieldname);

	// selector for the input
	let selector_string = `[data-fieldname="${field.fieldname}"] input:visible`;


	if (field.tablefield) {
		// is the last row activated (does the control exist)?
		if (Cypress.$(`[data-fieldname="${field.tablefield}"] .grid-body .row:last .frappe-control[data-fieldname="${field.fieldname}"]:visible`).length === 0) {

			// click on the box - this activates the row and creates controls
			cy.get(`[data-fieldname="${field.tablefield}"] .grid-body .row:last [data-fieldname="${field.fieldname}"]:visible`).click({scrollBehavior: 'center'});
		}

		// selector for input
		selector_string = `[data-fieldname="${field.tablefield}"] ${selector_string}`;
	}
	return cy.get(selector_string);
});

Cypress.Commands.add("get_select", (fieldname) => {
	return cy.get(`[data-fieldname="${fieldname}"]:visible select`, {scrollBehavior: 'center'});
});

Cypress.Commands.add("set_select", (fieldname, value) => {
	cy.get_select(fieldname)
		.select(value, {delay: 20, scrollBehavior: false})
	cy.wait(1000);
});

Cypress.Commands.add("_set_input", (fieldname, value) => {
	cy.get_input(fieldname)
		.clear({scrollBehavior: 'center'})
		.type(value, {delay: 20, scrollBehavior: false})
});

Cypress.Commands.add("set_input", (fieldname, value) => {
	cy._set_input(fieldname, value);
	cy.wait(1000);
});

Cypress.Commands.add("set_link", (fieldname, value) => {
	cy.intercept('/api/method/frappe.desk.search.search_link').as('search_query');

	cy._set_input(fieldname, value);
	cy.wait('@search_query');

	// select link value from dropdown
	const field = get_field_parts(fieldname);
	cy.get(`[data-fieldname="${field.fieldname}"] ul:visible li:first-child`)
		.click({scrollBehavior: false});
	cy.wait(1000);
});

Cypress.Commands.add('get_toolbar_button', (text) => {
	cy.scrollTo('top', {ensureScrollable: false});
	return cy.get(`.page-head [data-label="${encodeURIComponent(text)}"]:visible button`);
});

Cypress.Commands.add('click_toolbar_button', (text) => {
	cy.get_toolbar_button(text).click({scrollBehavior: false, force:true});
});

Cypress.Commands.add('click_toolbar_dropdown', (text) => {
	cy.get(`.page-head [data-label="${encodeURIComponent(text)}"]:visible`)
		.click({scrollBehavior: false, force:true});
});

Cypress.Commands.add('get_list_paging_button', (text) => {
	cy.scrollTo('top', {ensureScrollable: false});
	return cy.get(`.list-paging-area:visible [data-value="${text}"]`);
});

Cypress.Commands.add('click_list_paging_button', (text) => {
	cy.get_list_paging_button(text).click({scrollBehavior: false, force:true});
});

Cypress.Commands.add('get_custom_toolbar_button', (text) => {
	cy.scrollTo('top', {ensureScrollable: false});
	return cy.get(`.custom-btn-group:visible`).contains(text);
})

Cypress.Commands.add('click_custom_toolbar_button', (text) => {
	cy.get_custom_toolbar_button(text).click({scrollBehavior: false, force:true});
});

Cypress.Commands.add('click_modal_close_button', () => {
	cy.get('.btn-modal-close').click({scrollBehavior: false, force: true});
});

Cypress.Commands.add('save', () => {
	cy.intercept('/api').as('api');
	cy.get(`button[data-label="Save"]`).click({scrollBehavior: false, force:true});
	cy.wait('@api');
});

Cypress.Commands.add('get_page_indicator', () => {
	return cy.get('.page-head .indicator-pill:visible');
});

Cypress.Commands.add('submit', (indicator) => {
	cy.intercept('/api').as('api');
	cy.get(`button[data-label="Submit"]`).click({scrollBehavior: false, force:true});
	cy.get('.modal.show .btn-primary').click();
	cy.wait('@api');
	cy.get_page_indicator().contains(indicator);

});

Cypress.Commands.add('cancel', (indicator) => {
	cy.intercept('/api').as('api');
	cy.get(`button[data-label="Cancel"]`).click({scrollBehavior: false, force:true});
	cy.get('.modal.show .btn-primary').click();
	cy.wait('@api');
	cy.get_page_indicator().contains(indicator);
});

Cypress.Commands.add('get_page_title', () => {
	return cy.get('.page-title:visible');
});

Cypress.Commands.add('click_section', (title) => {
	return cy.get('.section-head:visible').contains(title).click({scrollBehavior: 'center'});
});

Cypress.Commands.add('grid_add_row', (fieldname) => {
	cy.get(`[data-fieldname="${fieldname}"] .grid-add-row:visible`).click({scrollBehavior: 'center'});
});

Cypress.Commands.add('grid_open_row', (fieldname, row_no) => {
	cy.get(`[data-fieldname="${fieldname}"] .grid-row[data-idx="${row_no}"] .row-index`).click({scrollBehavior: 'center'});
});

Cypress.Commands.add("set_today", (fieldname) => {
	cy.get(`[data-fieldname="${fieldname}"] input:visible`)
		.click({scrollBehavior: false}).wait(100);  // Opens calendar
	cy.get('.datepickers-container [data-action="today"]:visible')
		.click({scrollBehavior: false}).wait(100);  // Click on 'Today' on calendar view
});

Cypress.Commands.add("click_dropdown_action", (dropdown_name, action_name) => {
	cy.findByRole("button", { name: dropdown_name }).trigger('click', {force: true});
	cy.contains('.dropdown-item:visible', action_name).click();
});

Cypress.Commands.add('click_menu_button', () => {
	cy.scrollTo('top', {ensureScrollable: false});
	return cy.get(`.menu-btn-group:visible`).click({force: true});
});

Cypress.Commands.add("get_read_only", (fieldname) => {
    return cy.get(`[data-fieldname="${fieldname}"]:visible`, {scrollBehavior: 'center'});
});
