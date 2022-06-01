context("BOM with scrap management", () => {
	before(() => {
		cy.login();
	});

	it('Configure Scrap Warehouse', () => {
		cy.visit(`app/manufacturing-settings/Manufacturing%20Settings`);
		cy.set_link('default_scrap_warehouse', 'Work In Progress - CT');
	});

	it('Create an item', () => {
		let item_code = 'Hutch table with cabinet and bookshelf'
		cy.new_doc("Item");
		cy.set_input('item_code', item_code);
		cy.set_link('item_group','All Item Groups');
		cy.set_input('opening_stock', '1000');
		cy.set_input('valuation_rate', '1000');
		cy.set_input('standard_rate', '22300');
		cy.set_link('stock_uom', 'Nos');
		cy.save();
		cy.get_page_title().should('contain', item_code);
		cy.get_page_title().should('contain',  'Enabled');
	});

	it('Create a Bill of Materials with scrap', () => {
		cy.new_doc("BOM");
		cy.set_link('item', 'Hutch table with cabinet and bookshelf');
		cy.get_field('with_operations', 'checkbox').check();
		cy.get_field('with_operations', 'checkbox').should('be.checked');
		cy.get_select('transfer_material_against', 'Work Order');

		//Setting operations
		cy.grid_add_row('operations');
		cy.set_link('operations.operation', 'Attaching the table top with legs');
		cy.set_input('operations.time_in_mins', '1440');
		cy.grid_add_row('operations');
		cy.set_link('operations.operation', 'Sanding  the table');
		cy.set_input('operations.time_in_mins', '2880');
		cy.grid_add_row('operations');
		cy.set_link('operations.operation', 'Staining the table');
		cy.set_input('operations.time_in_mins', '2880');

		//Setting items
		cy.grid_add_row('items');
		cy.set_link('items.item_code', 'Scrapwood table top');
		cy.set_input('items.qty', '1');
		cy.grid_add_row('items');
		cy.set_link('items.item_code', 'Wooden Furniture Legs 6 inch');
		cy.set_input('items.qty', '1');
		cy.grid_add_row('items');
		cy.set_link('items.item_code', 'Pidilite Fevicol SR 998');
		cy.set_input('items.qty', '1');
		cy.grid_add_row('items');
		cy.set_link('items.item_code', '80-grit sandpaper');
		cy.set_input('items.qty', '1');
		cy.grid_add_row('items');
		cy.set_link('items.item_code', 'Paint brush');
		cy.set_input('items.qty', '1');
		cy.save();

		//set scrap item
		cy.click_section('Scrap');
		cy.open_section('Scrap');
		cy.grid_add_row('scrap_items');
		cy.grid_open_row('scrap_items', 1);
		cy.set_link('item_code', 'WB-001');
		cy.set_input('stock_qty', 1);
		cy.close_grid_edit_modal();
		cy.save();
		cy.wait(500);
		cy.submit('Default');
		cy.wait(500);
		cy.get_page_title().should('contain', 'Default');
	});
});
