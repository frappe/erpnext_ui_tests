context('Create POS Profile', () => {
    before(() => {
    cy.login();
        });

			//Set mode of payment first
			it('Sets appropriate account for mode of payment', () => {
			cy.visit('app/mode-of-payment/Wire%20Transfer');
			cy.findByRole('button', {name: 'Add Row'}).trigger('click', {force: true});
			cy.get('.rows > .grid-row > .data-row > .row-index').click();
			cy.get_field('default_account', 'Link').clear().type('Cash - CT', {delay: 200});
			cy.get('.grid-collapse-row').click();
			cy.wait(500);
			cy.findByRole('button', {name: 'Save'}).trigger('click', {force: true});
		});

        	it('Create POS Profile', () => {
            cy.visit(`app/pos-profile`);
            cy.wait(200);
            cy.click_listview_primary_button('Add POS Profile');
            cy.location("pathname").should("eq","/app/pos-profile/new-pos-profile-1");
            cy.get_field('__newname', 'Data').type('Test Profile', {delay: 200});
			cy.get_field('__newname', 'Data').should('have.value', 'Test Profile');
			cy.get_field('warehouse', 'Link').focus();
            cy.get_field('warehouse', 'Link').clear().type('Stores - CT');
			cy.get_field('warehouse', 'Link').should('have.value', 'Stores - CT');

			//Select Mode of Payment
			cy.get('.rows > .grid-row > .data-row > .col-xs-8').trigger('click', {force:true});
			cy.get_field('mode_of_payment', 'Link').focus().trigger('click', {force:true}).should('be.visible');
			cy.get_field('mode_of_payment', 'Link').type('Wire Transfer');
			cy.get_field('mode_of_payment', 'Link').should('have.value', 'Wire Transfer');
			cy.get_field('default').check();
			cy.get_field('default', 'checkbox').should('be.checked');

			//Set POS Configurations
			cy.get_field('allow_rate_change').check();
			cy.get_field('allow_rate_change', 'checkbox').should('be.checked');
			cy.get_field('allow_discount_change').check();
			cy.get_field('allow_discount_change', 'checkbox').should('be.checked');

			//Select Item Group

			//Set necessary accounts
			cy.get_field('write_off_account', 'Link').focus();
			cy.get_field('write_off_account', 'Link').clear().type('Write Off - CT', {delay: 200});
			cy.get_field('write_off_account', 'Link').should('have.value', 'Write Off - CT');
			cy.get_field('write_off_cost_center', 'Link').focus();
			cy.get_field('write_off_cost_center', 'Link').clear().type('Main - CT', {delay: 200});
			cy.get_field('write_off_cost_center', 'Link').should('have.value', 'Main - CT');
			cy.get_field('apply_discount_on', 'Select').select('Grand Total');
            cy.findByRole('button', {name: 'Save'}).trigger('click', {force: true});
			cy.get_field('selling_price_list', 'Link').should('have.value', 'Standard Selling');
			//cy.get_field('currency', 'Link').focus();
			//cy.get_field('currency', 'Link').clear().type('INR' , {delay: 200});
			//cy.get_field('currency', 'Link').should('have.value', 'INR');
			cy.findByRole('button', {name: 'Save'}).trigger('click', {force: true});

			//Validate page title
			cy.get('.page-title').should('contain', 'Test Profile');
            cy.get('.page-title').should('contain', 'Enabled');
			cy.location("pathname").should("not.be","/app/pos-profile/new-pos-profile-1");
			cy.remove_doc('POS Profile', 'Test Profile');

        });
    });
