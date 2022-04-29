context('Create Stock Entry', () => {
    before(() => {
    cy.login();
        });

			it.only('Set Item Table in Material Request', () => {
			cy.new_doc('Stock Entry');
			cy.location("pathname").should("eq","/app/stock-entry/new-stock-entry-1");
			cy.get_field('naming_series', 'Select').select('MAT-STE-.YYYY.-');

			//Set purpose
			cy.set_link('stock_entry_type', 'Material Receipt')

			//Set company
			cy.set_link('company', 'Wind Power LLC');

			//Set warehouse
			cy.set_link('to_warehouse', 'Finished Goods - WP');

			cy.set_link('items.item_code', 'Birch Ply');
			cy.set_input('items.qty', 10);
			cy.grid_add_row('items');
			cy.set_link('items.item_code', 'WB-001');
			cy.set_input('items.qty', 40);
			cy.save();
			cy.wait(500);
			cy.submit('Submitted');
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
