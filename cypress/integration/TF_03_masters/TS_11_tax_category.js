context('Tax Category', () => {
	before(() => {
		cy.login();
	});

	it('Create a test out-state tax category', () => {
		cy.visit('/app/tax-category');
		cy.new_doc("Tax Category");
		cy.set_input('title','test out-state category');
		cy.get_field('is_inter_state', 'checkbox').check();
		cy.save();
	});

	it('Create a test in-state tax category', () => {
		cy.insert_doc(
			"Tax Category",
				{
					"title": "test in-state category",
					"is_inter_state": 0,
					"is_reverse_charge": 0,
					"gst_state": "",
				},
			true
		)
	});
});
