context('Material Request Creation', () => {
	before(() => {
		cy.login();
	});

	it('Create Material Request of type Purchase', () => {
		cy.new_doc('Material Request');

		cy.url().should('include', '/app/material-request/new-material-request');
		cy.get_select('naming_series').should('have.value', 'MAT-MR-.YYYY.-');
		cy.get_input('transaction_date').should('not.have.value', 0);
		cy.set_select('material_request_type', 'Purchase');
		cy.set_today('schedule_date');

		cy.set_link('set_warehouse', 'Stores - WP');

		cy.set_link('items.item_code', 'Apple Macbook Pro 16 inch');
		cy.get_input('qty').focus().clear();
		cy.set_input('items.qty', 10);
		cy.get_input('uom').should('have.value', "Nos");
		cy.save();
		cy.get_page_title().should('contain', 'Draft');

		cy.compare_document({
			material_request_type: 'Purchase',
			items: [{ item_code: "Apple Macbook Pro 16 inch", item_name: 'Apple Macbook Pro 16 inch'}],
		});

		cy.submit_doc('Pending');
	});
});
