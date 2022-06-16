context('Create Stock Entry', () => {
    before(() => {
    cy.login();
        });

	it.only("Create a serialized & batched item", () => {
		let item_code = 'Solid Wood Armchair In Honey Oak Finish'
		cy.new_doc('Item');
		cy.set_input('item_code', item_code);
		cy.set_link('item_group','All Item Groups');
		cy.set_input('valuation_rate', '10000');
        cy.set_input('standard_rate', '12000');
		cy.set_link('stock_uom', 'Nos');
		cy.click_tab('Inventory');
		cy.get_section('Serial Nos and Batches');
		cy.click_section('Serial Nos and Batches');
		cy.open_section('Serial Nos and Batches');
        cy.get_field('has_batch_no', 'checkbox').check();
        cy.get_field('create_new_batch', 'checkbox').check();
        cy.set_input('batch_number_series', 'BA.##');
        cy.get_field('has_serial_no', 'checkbox').check();
        cy.set_input('serial_no_series', 'SE.##');
		cy.save();
        cy.wait(500);
	});

	it('Create opening stock entry for serialized and batched item', () => {
		cy.new_doc('Stock Entry');
		cy.location("pathname").should("eq","/app/stock-entry/new-stock-entry-1");
		cy.set_link('stock_entry_type', 'Material Receipt');
		cy.set_link('to_warehouse', 'Stores - WP');
		cy.grid_open_row('items', 1);
		cy.set_link('item_code', 'Solid Wood Armchair In Honey Oak Finish');
		cy.get_field('qty').clear();
		cy.set_input('qty', 5);
		cy.close_grid_edit_modal();
		cy.save();
		cy.wait(500);
		cy.submit('Submitted');
		cy.wait(500);

		//Check if a pop appears indicating creation of serial numbers and batch numbers
		cy.on('window:alert',  (str) =>  {
        	expect(str).to.equal(`Stock Entry Created`)});


        //Verify if serial numbers are created against correct stock entry
		cy.visit('app/serial-no');
		cy.click_listview_row_item(0);
		cy.get_read_only('item_code').should('contain', 'Solid Wood Armchair In Honey Oak Finish');
		cy.get_read_only('purchase_document_type').should('contain', 'Stock Entry');

        //Verify if batches are created against correct stock entry
        cy.visit('app/batch');
		cy.click_listview_row_item(0);
		cy.get_input('item', 'Link').should('have.value','Solid Wood Armchair In Honey Oak Finish');
		cy.get_read_only('batch_qty').should('contain','5');
	});
});
