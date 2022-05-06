context('Opening Entry', () => {
	before(() => {
        cy.login();
    });


		it("Create an item", () => {
			cy.new_doc('Item');
			cy.set_input('item_code', 'Scrapwood table top');
			cy.set_link('item_group','All Item Groups');
			cy.set_input('valuation_rate', '1000');
			cy.set_input('standard_rate', '22300');
			cy.set_link('stock_uom', 'Nos');
			cy.save();
			cy.wait(500);
			cy.get_page_title().should('contain', 'Scrapwood table top');
			cy.get_page_title().should('contain',  'Enabled');
		});

		it("Create an opening entry for an item", () => {
			cy.new_doc('Stock Reconciliation');
			cy.set_select('purpose', 'Opening Stock');
			cy.set_link('items.item_code', 'Scrapwood table top');
			cy.set_link('items.warehouse', 'Stores - WP');
			cy.set_input('items.qty', '10');
			cy.set_input('items.valuation_rate', '1200');
			cy.set_link('expense_account', 'Temporary Opening - WP');
			cy.set_link('cost_center', 'Main - WP');
			cy.save();
			cy.wait(500);
			cy.submit('Submitted');
		});
});
