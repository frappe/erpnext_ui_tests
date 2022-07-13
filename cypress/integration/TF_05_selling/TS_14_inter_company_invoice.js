context('Sales Invoice Creation', () => {
	before(() => {
		cy.login();
	});

	it('Create Sales Invoice', () => {
		cy.new_doc("Sales Invoice");
		cy.url().should('include', '/app/sales-invoice/new-sales-invoice');
		cy.get_select('naming_series').should('have.value', 'ACC-SINV-.YYYY.-');
		cy.set_input('customer', 'Bernhardt Furnitures');
		cy.get_field('company').should('have.value', 'Wind Power LLC');
		cy.grid_open_row('items', '1');
		cy.set_link('item_code', 'Marcel Coffee Table');
		cy.set_input('qty', '1');
		cy.click_section('Stock Details');
		cy.set_link('warehouse', 'Stores - WP')
		cy.close_grid_edit_modal();
		cy.save();
		cy.wait(500);
		cy.click_section('Currency and Price List');
		cy.open_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('selling_price_list').should('have.value', 'Standard Price List : Buying & Selling');
		cy.submit('Unpaid');
		cy.get_section('More Information');
		cy.click_section('More Information');
		cy.get_read_only('represents_company').should('contain', 'Bernhardt Furnitures');

		//Create Inter Company Purchase Invoice
		cy.click_dropdown_action('Create', 'Inter Company Purchase Invoice')
		cy.url().should('include', '/app/purchase-invoice/new-purchase-invoice');
		cy.get_field('company').should('have.value','Bernhardt Furnitures');
		cy.get_field('supplier').should('have.value', 'Wind Power LLC');
		cy.click_section('Currency and Price List');
		cy.open_section('Currency and Price List');
		cy.get_field('currency').should('have.value', 'INR');
		cy.get_field('buying_price_list').should('have.value', 'Standard Price List : Buying & Selling');
		cy.grid_open_row('items', '1');
		cy.get_field('item_code').should('have.value', 'Marcel Coffee Table');
		cy.get_input('qty').should('have.value', '1.000');
		cy.close_grid_edit_modal();
		cy.save();
		cy.submit('Unpaid');
		cy.get_section('More Information');
		cy.click_section('More Information');
		cy.get_read_only('represents_company').should('contain', 'Wind Power LLC');
	});
});
