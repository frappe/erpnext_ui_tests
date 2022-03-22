
context('Lead', () => {
	before(() => {
		cy.login();
	});
	
	it('Insert and check attributes of a Lead ', () => {
		cy.visit(`app/lead/`);
		cy.get('.primary-action').click();
		cy.get_field('salutation', 'Link').type("Mr");
		cy.get_field('company_name', 'Link').type("Eleanor School of Music");
		cy.get_field('first_name', 'Link').type("Oliver");
		cy.get_field('last_name', 'Link').type("Eleanor");
		cy.get_field('gender', 'Link').type("Male");
		cy.get_field('email_id', 'Link').type("oliverel@gmail.com");
		cy.findByRole('button', {name: 'Save'}).click();
		cy.get_field('salutation', 'Link').should('have.value', 'Mr');
		cy.get_field('company_name', 'Link').should('have.value', 'Eleanor School of Music');
		cy.get_field('first_name', 'Link').should('have.value', 'Oliver');
		cy.get_field('last_name', 'Link').should('have.value', 'Eleanor');
		cy.get_field('email_id', 'Link').should('have.value', 'oliverel@gmail.com');
        cy.get('.page-title').should('contain', 'Lead');
        cy.location("pathname").should("not.be","/app/lead/new");
        cy.get('.page-title').should('contain', 'Eleanor School of Music');
		cy.remove_doc('Lead', 'CRM-LEAD-2022-00003');
	});
});
