context('Work Order', () => {
	before(() => {
		cy.login();
	});

		it('Create Work Order from BOM', () => {
			cy.visit('app/bom');
			cy.click_listview_row_item(0);
			cy.click_dropdown_action('Create', 'Work Order');
			cy.on('window:alert',  (str) =>  {
            	expect(str).to.equal(`Work Order`)});
			cy.set_input('qty', '1');
			cy.click_modal_primary_button('Create');
			cy.get_field('production_item').should('have.value', 'Hutch table with cabinet and bookshelf');
			cy.get_input('qty', '1');
			cy.set_link('source_warehouse', 'Stores - WP');
			cy.set_link('fg_warehouse', 'Finished Goods - WP');
			cy.set_link('wip_warehouse', 'Work In Progress - WP');

			//Setting operations against raw materials
			cy.grid_open_row('required_items', 1);
			cy.set_link('operation', 'Staining the table');
			cy.close_grid_edit_modal();
			cy.save();
			cy.wait(500);
			cy.submit('Not Started');
			cy.get_page_title().should('contain', 'Not Started');
			cy.visit('app/job-card/view/list');
			cy.click_listview_row_item(0);
			cy.get_page_title().should('contain', 'Open');
		});
});
