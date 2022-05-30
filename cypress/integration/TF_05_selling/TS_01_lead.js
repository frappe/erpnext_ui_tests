
context('Lead', () => {
	before(() => {
		cy.login();
	});

	it('Insert and check attributes of a Lead ', () => {
		cy.new_doc('Lead');
		cy.set_link('salutation', "Mr");
		cy.set_input('company_name', "Eleanor School of Music");
		cy.set_input('first_name', "Oliver");
		cy.set_input('last_name', "Eleanor");
		cy.set_link('gender', "Male");
		cy.set_input('email_id', "oliverel@gmail.com");
		cy.save();

		cy.get_field('salutation', 'Link').should('have.value', 'Mr');
		cy.get_field('company_name', 'Data').should('have.value', 'Eleanor School of Music');
		cy.get_field('first_name', 'Data').should('have.value', 'Oliver');
		cy.get_field('last_name', 'Data').should('have.value', 'Eleanor');
		cy.get_field('email_id', 'Data').should('have.value', 'oliverel@gmail.com');

        cy.location("pathname").should("not.be","/app/lead/new");
		cy.get_page_title().should('contain', 'Lead');
        cy.get_page_title().should('contain', 'Eleanor School of Music');
	});
});
