context('Create Sales Order', () => {
	before(() => {
		cy.login();
	});

	it('Test Product Bundle in transaction', () => {
		cy.new_doc("Sales Order");
		cy.url().should('include', '/app/sales-order/new-sales-order');
		cy.set_link('customer', 'William Harris');
		cy.set_today('delivery_date');
		cy.click_section('Currency and Price List');
		cy.open_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('selling_price_list').should('have.value', 'Standard Selling');
		cy.grid_open_row('items', '1');
		cy.set_link('item_code', 'Single Seater Sofa Set With Table Set of 3');
		cy.set_input('qty', '1');
		cy.set_link('warehouse', 'Stores - WP')
		cy.close_grid_edit_modal();
		cy.save();

		//Check Packed Items and verify quantity
		cy.grid_open_row('packed_items', '1');
		cy.get_read_only('parent_item').should('contain', 'Single Seater Sofa Set With Table Set of 3');
		cy.get_read_only('item_code').should('contain' ,'Pristine White Single Seater Sofa Set');
		cy.get_read_only('qty', '2');
		cy.get_read_only('rate').should('contain', "₹ 20,000.00");
		cy.close_grid_edit_modal();
		cy.grid_open_row('packed_items', '2');
		cy.get_read_only('parent_item').should('contain', 'Single Seater Sofa Set With Table Set of 3');
		cy.get_read_only('item_code').should('contain' ,'Coffee Table');
		cy.get_read_only('qty', '1');
		cy.get_read_only('rate').should('contain', "₹ 20,000.00");
		cy.close_grid_edit_modal();
		cy.get_read_only('total_qty').should('contain', "1");
		cy.get_read_only('total').should('contain', "₹ 40,000.00");
		cy.get_read_only('grand_total').should('contain', "₹ 40,000.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 40,000.00");
		cy.submit('To Deliver and Bill');
	});
});
