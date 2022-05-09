context('Material Request', () => {
	before(() => {
		cy.login();
	});

	it('Create Material Request', () => {
		cy.new_doc('Material Request');
        var today = new Date();
        var date = '22-'+(today.getMonth()+4)+'-'+today.getFullYear();
		cy.set_input('schedule_date', date);
		cy.set_link('set_warehouse', 'Stores - WP');
		cy.set_link('items.item_code', 'Birch Ply');
		cy.set_input('items.qty', 10);
		cy.grid_add_row('items');
		cy.set_link('items.item_code', 'WB-001');
		cy.set_input('items.qty', 40);
		cy.save();

		cy.compare_document({
			material_request_type: 'Purchase',
			items: [{ item_code: "Birch Ply", item_name: 'Birch Ply'}],
		});

		cy.submit('Pending');
		cy.cancel('Cancelled');
	});
});
