context('Invoice Creation', () => {
	before(() => {
		cy.login();
	});

	it('Create POS Invoice from Sales Invoice', () => {
		cy.new_doc("Sales Invoice");
		cy.get_field('is_pos', 'checkbox').check();
		cy.get_field('is_pos', 'checkbox').should('be.checked');
		cy.set_link('customer', 'William Harris');
		cy.get_field('pos_profile').should('have.value', 'Test Profile');
		cy.get_field('update_stock', 'checkbox').should('be.checked');
		cy.click_section('Currency and Price List');
		cy.open_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('selling_price_list').should('have.value', 'Standard Selling');
		cy.grid_open_row('items', '1');
		cy.set_link('item_code', 'Scrapwood table top');q
		cy.set_input('qty', '1');
		cy.get_read_only('price_list_rate').should('contain', "₹ 12,300.00");
		cy.get_input('rate', '12,300.00');
		cy.get_read_only('amount').should('contain', "₹ 12,300.00");
		cy.close_grid_edit_modal();
		cy.get_read_only('total').should('contain', "₹ 12,300.00");
		cy.get_read_only('grand_total').should('contain', "₹ 12,300.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 12,300.00");
		cy.save();
		cy.wait(500);
		cy.submit('Paid');
		cy.click_dropdown_action('View', 'Stock Ledger');
		cy.get('.dt-cell__content > span > div').should('contain', "-1.000");
	});
});
