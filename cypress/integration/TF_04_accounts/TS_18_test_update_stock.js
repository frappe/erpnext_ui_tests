context('Invoice Creation', () => {
	before(() => {
		cy.login();
	});

	it('Create Sales Invoice and test update stock', () => {
		cy.new_doc("Sales Invoice");
		cy.url().should('include', '/app/sales-invoice/new-sales-invoice');
		cy.get_select('naming_series').should('have.value', 'ACC-SINV-.YYYY.-');
		cy.get_input('customer').click();
		cy.wait(500);
		cy.set_link('customer', 'William Harris');
		cy.get_field('update_stock').check();
		cy.get_field('update_stock', 'checkbox').should('be.checked');
		cy.findByText('Currency and Price List').scrollIntoView().should('be.visible');
		cy.wait(400);
		cy.click_section('Currency and Price List');
		cy.open_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('selling_price_list').should('have.value', 'Standard Selling');
		cy.grid_open_row('items', '1');
		cy.set_link('item_code', 'Marcel Coffee Table');
		cy.set_input('qty', '1');
		cy.get_read_only('price_list_rate').should('contain', "₹ 22,300.00");
		cy.get_input('rate', '22,300.00');
		cy.get_read_only('amount').should('contain', "₹ 22,300.00");
		cy.get_section('Stock Details');
		cy.click_section('Stock Details');
		cy.set_link('warehouse', 'Stores - WP');
		cy.close_grid_edit_modal();
		cy.get_read_only('total').should('contain', "₹ 22,300.00");
		cy.get_read_only('grand_total').should('contain', "₹ 22,300.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 22,300.00");
		cy.save();
		cy.wait(500);
		cy.submit_doc('Unpaid');
		cy.click_dropdown_action('View', 'Stock Ledger');
		cy.get('.dt-cell__content > span > div').should('contain', "-1.000");
	});
});
