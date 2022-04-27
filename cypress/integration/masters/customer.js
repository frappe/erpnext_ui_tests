context('Create Customer', () => {
    before(() => {
    cy.login();
        });

        it('Create Customer', () => {
            cy.new_form('Customer');
            cy.set_input('customer_name', 'Nidhi');
            cy.get_field('customer_type', 'Select').should('have.value', 'Company');
            cy.set_link('customer_group', 'Commercial');
            cy.set_link('territory', 'All Territories');
            cy.click_section('Currency and Price List');
            cy.set_link('default_currency', 'INR');
            cy.click_toolbar_button('Save');
            cy.wait(5000);
            cy.get_page_title().should('contain', 'Nidhi');
            cy.get_page_title().should('contain', 'Enabled');
            cy.get_field('customer_name', 'Data').should('have.value', 'Nidhi');
            cy.get_field('customer_group', 'Link').should('have.value', 'Commercial');
            cy.get_field('territory', 'Link').should('have.value', 'All Territories');
            cy.location("pathname").should("not.be","/app/customer/new");
        });

        after(() => {
            cy.remove_doc('Customer', 'Nidhi');
        });
    });
