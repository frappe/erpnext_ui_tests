context('Create POS Profile', () => {
    before(() => {
    cy.login();
        });

        it('Create POS Profile', () => {
            cy.visit(`app/pos-profile`);
            cy.wait(200);
            cy.click_listview_primary_button('Add POS Profile');
            cy.location("pathname").should("eq","/app/pos-profile/new-pos-profile-1");
            cy.set_input('__newname', 'Test Profile');
			cy.get_input('__newname', 'Data').should('have.value', 'Test Profile');
			cy.set_link('company', 'Wind Power LLC');
			cy.set_link('warehouse', 'Stores - WP');
			cy.get_field('warehouse', 'Link').should('have.value', 'Stores - WP');

			cy.grid_add_row('applicable_for_users');
			cy.grid_open_row('applicable_for_users', 1);
			cy.get_field('default', 'Check').check();
			cy.get_field('default', 'checkbox').should('be.checked');
			cy.set_link('user', 'frappe@example.com');
			cy.close_grid_edit_modal();

			//Select Mode of Payment
			cy.grid_open_row('payments', 1);
			cy.get_field('default', 'Check').check();
			cy.get_field('default', 'checkbox').should('be.checked');
			cy.set_link('payments.mode_of_payment', 'Wire Transfer');
			cy.get_field('mode_of_payment', 'Link').should('have.value', 'Wire Transfer');
			cy.close_grid_edit_modal();

			//Set POS Configurations
			cy.get_field('allow_rate_change').check();
			cy.get_field('allow_rate_change', 'checkbox').should('be.checked');
			cy.get_field('allow_discount_change').check();
			cy.get_field('allow_discount_change', 'checkbox').should('be.checked');

			//SeleWP Item Group

			//Set necessary accounts
			cy.set_link('write_off_account', 'Write Off - WP');
			cy.get_field('write_off_account', 'Link').should('have.value', 'Write Off - WP');
			cy.set_link('write_off_cost_center', 'Main - WP');
			cy.get_field('write_off_cost_center', 'Link').should('have.value', 'Main - WP');
			cy.set_select('apply_discount_on', 'Grand Total');
            cy.save();
			cy.get_input('selling_price_list', 'Link').should('have.value', 'Standard Selling');
			cy.location("pathname").should("not.be","/app/pos-profile/new-pos-profile-1");
        });
    });
