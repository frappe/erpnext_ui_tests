
context('Material Request', () => {
	before(() => {
		cy.login();
	});

	it('Create Material Request', () => {
		cy.new_doc('Material Request');

		cy.set_today('schedule_date');
		cy.set_link('items.item_code', 'Birch Ply');
		cy.set_input('items.qty', 10);
		cy.grid_add_row('items');
		cy.set_link('items.item_code', 'WB-001');
		cy.set_input('items.qty', 40);
		cy.save();

		cy.compare_document({
			material_request_type: 'Purchase',
			items: [{ item_code: "Birch Ply", item_name: 'Birch Ply', warehouse: 'Stores - WP' }],
		});
	});
});
