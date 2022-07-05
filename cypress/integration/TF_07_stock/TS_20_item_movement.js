context("Item", () => {
	before(() => {
		cy.login();
	});

	it("Check Move Functionality", () => {
		cy.visit(`app/item/Study%20Table`);
		cy.click_tab('Dashboard');
		cy.findByRole('button', {name: /Move/i}).click();
		cy.on('window:alert',  (str) =>  {
        	expect(str).to.equal(`Move Item`)});
		cy.set_link('target', 'Work In Progress - CT');
		cy.get_field('qty').clear();
		cy.set_input('qty', '5');
		cy.click_modal_primary_button('Create Stock Entry');
		cy.url().should('include', '/app/stock-entry/new-stock-entry');
		cy.get_input('stock_entry_type', 'Material Transfer');
		cy.get_input('from_warehouse', 'Stores - CT');
		cy.get_input('to_warehouse', 'Work In Progress - CT');
		cy.grid_open_row('items', 1);
		cy.get_input('item_code', 'Study Table');
		cy.get_input('s_warehouse', 'Stores - CT');
		cy.get_input('t_warehouse', 'Work In Progress - CT');
		cy.set_input('qty', 5);
		cy.close_grid_edit_modal();
		cy.save();
		cy.submit('Submitted');
		cy.click_dropdown_action('View', 'Stock Ledger');
		cy.get('.dt-cell__content > span > div').should('contain', "-5.000");
	});
});
