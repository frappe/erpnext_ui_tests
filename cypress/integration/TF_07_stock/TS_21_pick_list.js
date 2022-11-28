context('Pick List', () => {
    before(() => {
        cy.login();
        cy.visit('/app');
    });

	it('Creating items and pick list', () => {
        //Creating 2 items to be used in the pick list
        cy.create_records({
            doctype: 'Item',
            item_code: 'Flask - 1ltr',
            item_name: 'Flask - 1ltr',
            item_group: 'All Item Groups',
            opening_stock: 20,
            is_stock_item: 1,
            valuation_rate: 1000
        });
        cy.create_records({
            doctype: 'Item',
            item_code: 'Lunch Box',
            item_name: 'Lunch Box',
            item_group: 'All Item Groups',
            opening_stock: 20,
            is_stock_item: 1,
            valuation_rate: 1200
        });

        //Creating a pick list
        cy.new_form('Pick List');
        cy.get_field('naming_series', 'Select').should('contain', 'STO-PICK-.YYYY.-');
        cy.get_input('company').should('have.value', 'Wind Power LLC');

        //Checking ways for which the pick list can be created
        cy.get_field('purpose', 'Select').should('contain', 'Material Transfer for Manufacture');
        cy.get_field('purpose', 'Select').select('Delivery').should('contain', 'Delivery');
        cy.get_field('purpose', 'Select').select('Material Transfer').should('contain', 'Material Transfer');

        //Checking if "Material Transfer" is selected then the field "Material Request" should be visible
        cy.get_field('material_request', 'Link').should('be.visible');
        cy.set_link('parent_warehouse', 'All Warehouses - WP');

        //Adding items to the pick list
        cy.grid_add_row('locations');
        cy.set_link('locations.item_code', 'Flask - 1ltr');
        cy.set_input('locations.qty', '4');
        cy.grid_add_row('locations');
        cy.set_link('locations.item_code', 'Lunch Box');
        cy.set_input('locations.qty', '4');
        cy.save();
		cy.get_page_title().should('contain', 'Draft');

        //Deleting the pick list
        cy.delete_first_record('Pick List');
    });

    it('Creating pick list from material request', () => {
        //Pick list creation from Material Request
        cy.new_form('Material Request');
        cy.set_select('material_request_type', 'Material Transfer');
        cy.set_today('schedule_date');
        cy.grid_add_row('items');
        cy.set_link('items.item_code', 'Flask - 1ltr');
        cy.set_input('items.qty', '1');
        cy.grid_add_row('items');
        cy.set_link('items.item_code', 'Lunch Box');
        cy.set_input('items.qty', '1');
        cy.grid_delete_row('items', 1);
        cy.save();
        cy.get_page_title().should('contain', 'Draft');
        cy.submit_doc();
        cy.get_page_title().should('contain', 'Pending');

        //Creating a pick list from the material request
        cy.click_dropdown_action('Create', 'Pick List');
        cy.location('pathname').should('include', '/app/pick-list/new-pick-list');
        cy.get_field('purpose', 'Select').should('contain', 'Material Transfer');
        cy.get_field('material_request', 'Link').should('include.value', 'MAT-MR-');
        cy.grid_open_row('locations', 1);
        cy.get_input('item_code').should('have.value', 'Flask - 1ltr');
        cy.get_input('qty').should('have.value', '1.000');
        cy.close_grid_edit_modal();
        cy.grid_open_row('locations', 2);
        cy.get_input('item_code').should('have.value', 'Lunch Box');
        cy.get_input('qty').should('have.value', '1.000');
        cy.close_grid_edit_modal();
        cy.save();
        cy.get_page_title().should('contain', 'Draft');

        //Deleting the pick list
        cy.delete_first_record('Pick List');
	});
});
