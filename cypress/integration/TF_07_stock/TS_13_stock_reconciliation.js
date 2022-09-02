context('Stock Reconciliation', () => {
	before(() => {
        cy.login();
    });

		it("Create a stock reconciliation", () => {
			cy.new_doc('Stock Reconciliation');
			cy.set_select('purpose', 'Stock Reconciliation');
			cy.set_link('items.item_code', 'Teak Shoe Rack');
			cy.set_link('items.warehouse', 'Stores - WP');
			cy.set_input('items.qty', '10');
			cy.set_input('items.valuation_rate', '1200');
			cy.get_field('expense_account').should('have.value' , 'Stock Adjustment - WP');
			cy.get_field('cost_center').should('have.value' , 'Main - WP');
			cy.save();
			cy.wait(500);
			cy.submit_doc('Submitted');
		});
});
