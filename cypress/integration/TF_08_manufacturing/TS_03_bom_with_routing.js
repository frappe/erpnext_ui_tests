context("Routing-based BOM", () => {
	before(() => {
		cy.login();
	});

	it('Routing-based BOM', () => {
		cy.new_doc("BOM");
		cy.set_link('item', 'Study Table');
		cy.get_field('with_operations', 'checkbox').check();
		cy.get_field('with_operations', 'checkbox').should('be.checked');
		cy.set_link('routing', 'Routing for Table Manufacturing');
		cy.get_select('transfer_material_against', 'Work Order');

		//Verify if correct operations have been fetched
		cy.grid_open_row('operations', '1');
		cy.get_field('operation').should('have.value', 'Attaching the table top with legs');
        cy.get_field('workstation').should('have.value', 'WB-0001');
		cy.close_grid_edit_modal();
		cy.grid_open_row('operations', '2');
		cy.get_field('operation').should('have.value', 'Sanding  the table');
        cy.get_field('workstation').should('have.value', 'WB-0002');
		cy.close_grid_edit_modal();
		cy.grid_open_row('operations', '3');
		cy.get_field('operation').should('have.value', 'Staining the table');
        cy.get_field('workstation').should('have.value', 'WB-0002');
		cy.close_grid_edit_modal();

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
		cy.submit_doc('Default');
		cy.wait(500);
		cy.get_page_title().should('contain', 'Default');
	});
});
