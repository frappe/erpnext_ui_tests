context('Create Delivery Note', () => {
	before(() => {
		cy.login();
	});

	it('Check for appropriate validation message when batch number is not selected', () => {
		cy.new_doc("Delivery Note");
		cy.url().should('include', '/app/delivery-note/new-delivery-note');
		cy.set_link('customer', 'William Harris');
		cy.click_section('Currency and Price List');
		cy.open_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('selling_price_list').should('have.value', 'Standard Selling');
		cy.grid_open_row('items', '1');
		cy.set_link('item_code', 'Book Storage Set');
		cy.set_input('qty', '1');
		cy.set_link('warehouse', 'Stores - WP')
		cy.close_grid_edit_modal();
		cy.save();
		cy.on('window:alert',  (str) =>  {
            expect(str).to.equal(`Message`)});
		cy.get_error_msg().should('contain', 'Please select a Batch for Item Alpine Book Shelves In Wenge Finish. Unable to find a single batch that fulfills this requirement');
		cy.hide_dialog();
	});

	it('Create Batches and serial numbers for product in product bundle', () => {
		cy.new_doc('Stock Entry');
		cy.location("pathname").should("eq","/app/stock-entry/new-stock-entry-1");
		cy.set_link('stock_entry_type', 'Material Receipt');
		cy.set_link('to_warehouse', 'Stores - WP');
		cy.grid_open_row('items', 1);
		cy.set_link('item_code', 'Alpine Book Shelves In Wenge Finish');
		cy.get_field('qty').clear();
		cy.set_input('qty', 10);
		cy.close_grid_edit_modal();
		cy.save();
		cy.wait(500);
		cy.submit('Submitted');
		cy.wait(500);

		//Check if a pop appears indicating creation of serial numbers and batch numbers
		cy.on('window:alert',  (str) =>  {
        	expect(str).to.equal(`Stock Entry Created`)});
	});

	it('Select serial number and submit DN now', () => {
		cy.new_doc("Delivery Note");
		cy.url().should('include', '/app/delivery-note/new-delivery-note');
		cy.set_link('customer', 'William Harris');
		cy.grid_open_row('items', '1');
		cy.set_link('item_code', 'Book Storage Set');
		cy.set_input('qty', '1');
		cy.set_link('warehouse', 'Stores - WP')
		cy.close_grid_edit_modal();
		cy.save();
		cy.grid_open_row('packed_items', '1');
		cy.get_read_only('parent_item').should('contain', 'Book Storage Set');
		cy.get_read_only('item_code').should('contain' ,'Alpine Book Shelves In Wenge Finish');
		cy.get_read_only('qty', '1');
		cy.get_read_only('rate').should('contain', "₹ 20,000.00");
		cy.set_link('warehouse', 'Stores - WP');
		cy.findByRole('button', {name: /Add Serial No/i}).click();
		cy.set_link('serial_no_select', 'SE01');
		cy.findByRole('button', {name: /Insert/i}).click();
		cy.close_grid_edit_modal();
		cy.grid_open_row('packed_items', '2');
		cy.get_read_only('parent_item').should('contain', 'Book Storage Set');
		cy.get_read_only('item_code').should('contain' ,'Mandarin Book Case In Wenge Finish');
		cy.get_read_only('qty', '1');
		cy.get_read_only('rate').should('contain', "₹ 20,000.00");
		cy.set_link('warehouse', 'Stores - WP')
		cy.close_grid_edit_modal();
		cy.get_read_only('total_qty').should('contain', "1");
		cy.get_read_only('total').should('contain', "₹ 40,000.00");
		cy.get_read_only('grand_total').should('contain', "₹ 40,000.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 40,000.00");
		cy.save();
		cy.submit('To Bill');
	});
});
