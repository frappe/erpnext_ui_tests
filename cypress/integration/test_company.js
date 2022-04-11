context('Create Company', () => {
    before(() => {
    cy.login();
        });

        it('Create Company', () => {
            cy.visit(`app/company`);
            cy.wait(200);
            cy.click_listview_primary_button('Add Company');
            cy.get_field('company_name', 'Data').type('Frappe Tech', {delay: 200});
            cy.get_field('company_name', 'Data').should('have.value', 'Frappe Tech');
            cy.get_field('abbr', 'Data').should('have.value', 'FT');
            cy.get_field('default_currency', 'Link').clear().type('INR', {delay: 200});
			cy.get_field('country', 'Link').clear().type('India', {delay: 200});
            cy.get_field('country', 'Link').should('have.value', 'India');
            cy.findByRole('button', {name: 'Save'}).trigger('click', {force: true});
            cy.wait(500);
            cy.get('.page-title').should('contain', 'Frappe Tech');
        });
    });
