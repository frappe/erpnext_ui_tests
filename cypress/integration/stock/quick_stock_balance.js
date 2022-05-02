context('Quick Stock Balance', () => {
	before(() => {
		cy.login();
	});

	it('Should show correct data on Quick Stock balance', () => {
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
