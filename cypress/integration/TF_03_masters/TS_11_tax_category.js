context('Tax Category', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Create a test out-state tax category', () => {
		cy.create_records({
            doctype: 'Tax Category',
            title: 'test out-state category'
        });
	});

	it('Create a test in-state tax category', () => {
		cy.create_records({
            doctype: 'Tax Category',
			title: 'test in-state category',
			is_inter_state: 0,
			is_reverse_charge: 0
		});
	});
});
