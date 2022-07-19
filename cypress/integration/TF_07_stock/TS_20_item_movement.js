context("Item", () => {
	before(() => {
		cy.login();
	});

	it("Check Move Functionality", () => {
		cy.visit(`app/item/Study%20Table`);
		cy.click_tab('Dashboard');
		cy.click_move_or_add_button('Stores - WP', 'Move');
		cy.on('window:alert',  (str) =>  {
        	expect(str).to.equal(`Move Item`)});
		cy.set_input('qty', '11');
		cy.set_link('target', 'Work In Progress - WP');
		cy.click_modal_primary_button('Create Stock Entry');
		cy.url().should('include', '/app/stock-entry/new-stock-entry');
		cy.get_input('stock_entry_type', 'Material Transfer');
		cy.get_input('from_warehouse', 'Stores - WP');
		cy.get_input('to_warehouse', 'Work In Progress - WP');
		cy.grid_open_row('items', 1);
		cy.get_input('item_code', 'Study Table');
		cy.get_input('s_warehouse', 'Stores - WP');
		cy.get_input('t_warehouse', 'Work In Progress - WP');
		cy.get_input('qty', '11');
		cy.close_grid_edit_modal();
		cy.save();
		cy.submit('Submitted');
		cy.click_dropdown_action('View', 'Stock Ledger');
		cy.get('.dt-cell__content > span > div').should('contain', "-11.000");
	});

	it("Check Add Functionality", () => {
		cy.visit(`app/item/Study%20Table`);
		cy.click_tab('Dashboard');
		cy.click_move_or_add_button('Stores - WP', 'Add');
		cy.on('window:alert',  (str) =>  {
        	expect(str).to.equal(`Add Item`)});
		cy.set_input('qty', '5');
		cy.set_input('rate', '11100');
		cy.get_read_only('target').should('contain', 'Stores - WP');
		cy.click_modal_primary_button('Create Stock Entry');
		cy.url().should('include', '/app/stock-entry/new-stock-entry');
		cy.get_input('stock_entry_type', 'Material Request');
		cy.get_input('from_warehouse', 'Stores - WP');
		cy.get_input('to_warehouse', 'Work In Progress -WP');
		cy.grid_open_row('items', 1);
		cy.get_input('item_code', 'Study Table');
		cy.get_input('s_warehouse', 'Stores - WP');
		cy.get_input('t_warehouse', 'Work In Progress - WP');
		cy.get_input('qty', '11');
		cy.close_grid_edit_modal();
		cy.save();
		cy.submit('Submitted');
		cy.click_dropdown_action('View', 'Stock Ledger');
		cy.get('.dt-cell__content > span > div').should('contain', "5.000");
	});
});
