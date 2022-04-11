
context('Create Sales Order', () => {
	before(() => {
	});

	it('Create Sales Order', () => {
		cy.findByRole('button', {name: 'Create'}).click();
		cy.get('[data-label="Sales%20Order"]').click();

	});
});
