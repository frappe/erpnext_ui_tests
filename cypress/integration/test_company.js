context('Company', () => {
	before(() => {
		cy.login();
	});

	it('Create Company and verify attributes', () => {
		cy.visit(`app/company`);
		cy.wait(200);
		cy.click_listview_primary_button('Add Company');
		cy.contains('Edit in full page').click();
		cy.location("pathname").should("eq","/app/company/new-company-1");
		cy.get_field('company_name', 'Data').type('Vector Inc.', {delay: 200});
        cy.get_field('default_currency', 'Link').type('INR', {delay: 200}).focus();
		cy.get_field('default_currency', 'Link').should('have.value', 'INR');
		cy.findByRole('button', {name: 'Save'}).trigger('click');
		cy.get('.page-title').should('contain', 'Vector Inc.');
		cy.get_field('company_name', 'Data').should('have.value', 'Vector Inc.');
        cy.remove_doc('Company','Vector Inc');
		cy.location("pathname").should("not.be","/app/company/new");
	});
});