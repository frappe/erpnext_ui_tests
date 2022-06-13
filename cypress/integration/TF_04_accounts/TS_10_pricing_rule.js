context('Pricing Rule Check on Quotation', () => {
	before(() => {
		cy.login();
	});

	it('Create Pricing Rule', () => {
		cy.new_doc('Pricing Rule');
	});

});
