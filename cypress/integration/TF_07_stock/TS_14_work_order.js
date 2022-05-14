context('Work Order', () => {
	before(() => {
		cy.login();
	});

		it('Create BOM', () => {
			cy.new_doc("BOM");
			cy.set_link('item', 'Classic Dining Table-ACACIA');
			cy.get_field('with_operations', 'checkbox').check();
			cy.get_field('with_operations', 'checkbox').should('be.checked');
			cy.get_select('transfer_material_against', 'Work Order');

			//Setting operations
			cy.grid_add_row('operations');
			cy.set_link('operations.operation', 'Staining the table');
			cy.set_input('operations.time_in_mins', '2880');

			//Setting items
			cy.grid_add_row('items');
			cy.set_link('items.item_code', 'Paint brush');
			cy.set_input('items.qty', '1');
			cy.save();
			cy.wait(500);
			cy.submit('Default');
			cy.wait(500);
			cy.get_page_title().should('contain', 'Default');
		});

		it('Create Work Order from BOM', () => {
			cy.visit('app/bom');
			cy.click_listview_row_item(0);
			cy.click_dropdown_action('Create', 'Work Order');
			cy.on('window:alert',  (str) =>  {
            	expect(str).to.equal(`Work Order`)});
			cy.set_input('qty', '1');
			cy.click_modal_primary_button('Create');
			cy.get_field('production_item').should('have.value', 'Classic Dining Table-ACACIA');
			cy.get_input('qty', '1');
			cy.set_link('source_warehouse', 'Stores - CT');
			cy.set_link('fg_warehouse', 'Finished Goods - CT');
			cy.set_link('wip_warehouse', 'Work In Progress - CT');

			//Setting operations against raw materials
			cy.grid_open_row('required_items', 1);
			cy.set_link('operation', 'Staining the table');
			cy.close_grid_edit_modal();
			cy.save();
			cy.wait(500);
			cy.submit('Not Started');
			cy.get_page_title().should('contain', 'Not Started');

			//View Job Cards created and verify they're in draft state

			cy.visit('app/job-card/view/list');
			cy.click_listview_row_item(0);
			cy.get_page_title().should('contain', 'Open');
		});
});
