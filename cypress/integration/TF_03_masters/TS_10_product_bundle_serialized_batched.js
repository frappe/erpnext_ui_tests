context("Product Bundle", () => {
	before(() => {
		cy.login();
	});

	it("Create Parent Item", () => {
		let item_code = 'Book Storage Set'
		cy.new_doc("Item");
		cy.set_input('item_code', item_code);
		cy.set_link('item_group','All Item Groups');
		cy.get_field('is_stock_item').uncheck();
		cy.set_input('standard_rate', '40000');
		cy.set_link('stock_uom', 'Nos');
		cy.save();
		cy.get_page_title().should('contain', item_code);
		cy.get_page_title().should('contain',  'Enabled');
	});

	it("Create child item 1", () => {
		let item_code = 'Alpine Book Shelves In Wenge Finish'
		cy.new_doc("Item");
		cy.set_input('item_code', item_code);
		cy.set_link('item_group', 'All Item Groups');
		cy.set_input('opening_stock', '1000');
		cy.set_input('valuation_rate', '20000');
		cy.set_input('standard_rate', '20000');
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

	it("Create child item 2", () => {
		let item_code = 'Mandarin Book Case In Wenge Finish'
		cy.new_doc("Item");
		cy.set_input('item_code', item_code);
		cy.set_link('item_group','All Item Groups');
		cy.set_input('opening_stock', '1000');
		cy.set_input('valuation_rate', '20000');
		cy.set_input('standard_rate', '20000');
		cy.set_link('stock_uom', 'Nos');
		cy.save();
		cy.get_page_title().should('contain', item_code);
		cy.get_page_title().should('contain',  'Enabled');
	});

	it("Create Product Bundle", () => {
		cy.new_doc("Product Bundle");
		cy.set_link('new_item_code','Book Storage Set');
		cy.set_input('description', 'Set of Book Shelf and Book Case')
		cy.grid_add_row('items');
		cy.grid_open_row('items', 1);
		cy.set_link('item_code', 'Alpine Book Shelves In Wenge Finish');
		cy.set_input('qty', '1');
		cy.close_grid_edit_modal();
		cy.grid_add_row('items');
		cy.grid_open_row('items', 2);
		cy.set_link('item_code', 'Mandarin Book Case In Wenge Finish');
		cy.set_input('qty', '1');
		cy.close_grid_edit_modal();
		cy.save();
	});
});
