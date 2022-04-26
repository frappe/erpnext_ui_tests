context('Create Customer', () => {
    before(() => {
    cy.login();
        });

        it('Create Customer', () => {
            cy.new_form('Customer');
            cy.get_field('customer_name', 'Data').type('Nidhi', {delay: 200});
            cy.get_field('customer_type', 'Select').should('have.value', 'Company');
            cy.get_field('customer_group', 'Link').clear().type('All Customer Groups');
            cy.get_field('territory', 'Link').clear().type('All Territories');
            cy.findByText('Currency and Price List').click();
            cy.get_field('default_currency', 'Link').type('INR', {delay: 200});
            cy.findByRole('button', {name: 'Save'}).trigger('click', {force: true});
            cy.wait(500);
            cy.get('.page-title').should('contain', 'Nidhi');
            cy.get('.page-title').should('contain', 'Enabled');
            cy.get_field('customer_name', 'Data').should('have.value', 'Nidhi');
            cy.get_field('customer_group', 'Link').should('have.value', 'All Customer Groups');
            cy.get_field('territory', 'Link').should('have.value', 'All Territories');
            cy.location("pathname").should("not.be","/app/customer/new");
        });

        after(() => {
            cy.remove_doc('Customer', 'Nidhi');
        });
    });