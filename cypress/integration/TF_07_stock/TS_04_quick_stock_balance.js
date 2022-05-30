context('Quick Stock Balance', () => {
	before(() => {
		cy.login();
	});

	it('Should show correct data on Quick Stock balance', () => {

		cy.new_doc("Item");
		cy.set_input('item_code', 'Teak Shoe Rack');
		cy.set_link('item_group','All Item Groups');
		cy.set_input('opening_stock', '100');
		cy.set_input('valuation_rate', '1000');
		cy.set_input('standard_rate', '12300.000');
		cy.set_link('stock_uom', 'Nos');
		cy.save();
		cy.wait(500);

		cy.new_form('Quick Stock Balance');
		cy.set_link('warehouse', 'Stores - WP');
		cy.get_field('warehouse', 'Link').should('have.value','Stores - WP');
		cy.set_today('date');
		cy.set_link('item', 'Teak Shoe Rack');
		cy.get_read_only('qty').should('contain','100');
		cy.get_read_only('item_name').should('contain','Teak Shoe Rack');
		cy.get_read_only('item_description').should('contain','Teak Shoe Rack');
	});
});
