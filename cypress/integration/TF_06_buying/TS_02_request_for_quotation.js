context('Request for Quotation', () => {
	before(() => {
		cy.login();
	});

	it('Create Request for Quotation from a Material Request', () => {
		cy.visit('app/material-request/');
		cy.click_listview_row_item(0);
		cy.click_dropdown_action('Create', 'Request for Quotation');
		cy.url().should('include', '/app/request-for-quotation/new-request-for-quotation');

		cy.get_select('naming_series').should('have.value', 'PUR-RFQ-.YYYY.-');
		cy.get_input('transaction_date').should('not.have.value', 0);
		cy.get_read_only('status').should('contain', "Draft");

		cy.grid_add_row('suppliers');
		cy.set_link('suppliers.supplier', 'Lisa Davis');

		cy.get_input('items.item_code').should('have.value', 'Apple iPhone 13 Pro Max1');
		cy.get_input('schedule_date').should('not.have.value', 0);
		cy.get_input('qty').should('have.value', "10.000");
		cy.get_input('uom').should('have.value', "Nos");
		cy.get_input('warehouse').should('have.value', "Stores - TQ");

		cy.save();
		cy.get_page_title().should('contain', 'Draft');
		cy.submit_doc('Submitted');
	});
});
