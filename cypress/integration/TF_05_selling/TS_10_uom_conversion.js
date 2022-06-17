context('Create Sales Order', () => {
	before(() => {
		cy.login();
	});

	it('Create UOM Conversion Factor first', () => {
		cy.new_doc("UOM Conversion Factor");
		cy.set_link('category', 'Mass');
		cy.set_link('from_uom', 'Box');
		cy.set_link('to_uom','Nos');
		cy.set_input('value', '5');
		cy.save();
	});

	it('Test UOM Conversion in transaction', () => {
		cy.new_doc("Sales Order");
		cy.url().should('include', '/app/sales-order/new-sales-order');
		cy.set_link('customer', 'William Harris');
		cy.set_today('delivery_date');
		cy.click_section('Currency and Price List');
		cy.open_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('selling_price_list').should('have.value', 'Standard Selling');
		cy.grid_open_row('items', '1');
		cy.set_link('item_code', 'Scrapwood table top');
		cy.set_input('qty', '1');
		cy.set_link('uom','Box');
		cy.get_read_only('conversion_factor').should('contain', '5');
		cy.get_read_only('stock_qty').should('contain', "5");
		cy.set_link('warehouse', 'Stores - CT')
		cy.close_grid_edit_modal();
		cy.save();
		cy.wait(500);
		cy.submit('To Deliver and Bill');
	});
});
