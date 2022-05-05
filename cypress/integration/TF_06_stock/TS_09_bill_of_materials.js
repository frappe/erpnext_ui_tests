context("Bill of Materials", () => {
	before(() => {
		cy.login();
	});

	it('Create a Bill of Materials', () => {
		cy.new_doc("BOM");
		cy.set_link('item', 'Marcel Coffee Table');
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
		cy.wait(500);
		cy.submit('Default');
		cy.wait(500);
		cy.get_page_title().should('contain', 'Default');
	});
});
