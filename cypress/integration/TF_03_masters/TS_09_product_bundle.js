context("Product Bundle", () => {
	before(() => {
		cy.login();
	});

	it("Create Parent Item", () => {
		let item_code = 'Single Seater Sofa Set With Table Set of 3'
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
		let item_code = 'Pristine White Single Seater Sofa Set'
		cy.new_doc("Item");
		cy.set_input('item_code', item_code);
		cy.set_link('item_group', 'All Item Groups');
		cy.set_input('opening_stock', '1000');
		cy.set_input('valuation_rate', '20000');
		cy.set_input('standard_rate', '20000');
		cy.set_link('stock_uom', 'Nos');
		cy.click_tab('Inventory');
		cy.get_section('Units of Measure');
		cy.click_section('Units of Measure');
		cy.grid_add_row('uoms');
		cy.grid_open_row('uoms', 1);
		cy.set_link('uom', 'Set');
		cy.set_input('conversion_factor', '2');
		cy.close_grid_edit_modal();
		cy.save();
		cy.get_page_title().should('contain', item_code);
		cy.get_page_title().should('contain',  'Enabled');
	});

	it("Create child item 2", () => {
		let item_code = 'Coffee Table'
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
		cy.set_link('new_item_code','Single Seater Sofa Set With Table Set of 3');
		cy.set_input('description', 'Set of Coffee Table and Single Seater Sofa')
		cy.grid_add_row('items');
		cy.grid_open_row('items', 1);
		cy.set_link('item_code', 'Pristine White Single Seater Sofa Set');
		cy.set_input('qty', '2');
		cy.close_grid_edit_modal();
		cy.grid_add_row('items');
		cy.grid_open_row('items', 2);
		cy.set_link('item_code', 'Coffee Table');
		cy.set_input('qty', '1');
		cy.close_grid_edit_modal();
		cy.save();
	});

});
