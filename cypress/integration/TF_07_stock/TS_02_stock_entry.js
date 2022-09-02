context('Stock Entry', () => {
	before(() => {
		cy.login();
	});

	it('Set Item Table in Material Request', () => {
		cy.new_doc('Stock Entry');
		cy.location("pathname").should("eq","/app/stock-entry/new-stock-entry-1");
		cy.get_field('naming_series', 'Select').select('MAT-STE-.YYYY.-');

		//Set purpose
		cy.set_link('stock_entry_type', 'Material Receipt')

		//Set company
		cy.set_link('company', 'Wind Power LLC');

		//Set warehouse
		cy.set_link('to_warehouse', 'Finished Goods - WP');
		cy.grid_open_row('items', 1);
		cy.set_link('item_code', 'Birch Ply');
		cy.set_input('qty', 10);
		cy.close_grid_edit_modal();
		cy.grid_add_row('items');
		cy.grid_open_row('items', 2);
		cy.set_link('item_code', 'WB-001');
		cy.set_input('qty', 40);
		cy.close_grid_edit_modal();
		cy.save();
		cy.wait(500);
		cy.submit_doc('Submitted');
		cy.wait(500);

		//View Stock Ledger and verify if correct stock ledger entries are correct
		cy.url().then((url) => {
			cy.click_dropdown_action('View', 'Stock Ledger')
			cy.location("pathname").should("eq","/app/query-report/Stock%20Ledger");
			const name = url.split('/').pop();
    		cy.get_field('voucher_no', 'Data').should('have.value', name);
		});
	});
});
