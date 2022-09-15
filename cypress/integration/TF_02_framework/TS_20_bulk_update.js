context('Bulk Update', () => {
    before(() => {
        cy.login();
        cy.visit('/app');
    });

    it('Bulk update status for todo', () => {
		//Creates 10 todos
		var genArr = Array.from({length:10},(v,k)=>k+1)
		cy.wrap(genArr).each((index) => {
				cy.create_records({
					doctype: 'ToDo',
					priority: 'High',
					description: 'This is a test todo for testing bulk update' 
					+index
				}).as('todos');
		});
		cy.go_to_list('ToDo');

		//Applying filter to check the created todos
		cy.add_filter();
		cy.get('.fieldname-select-area').type('Description{enter}');
		cy.get('.condition').select('Like');
		cy.get('.filter-field').type('%This is a test todo for testing bulk update%');
		cy.get('button.btn-primary').contains('Apply Filters').click();

		//Checking if 10 todos have been created
		cy.get('.list-count').should('contain', '10 of 10');
		
		//Bulk updating the status for todo from Open to Closed
		cy.go_to_list('Bulk Update');
		cy.click_toolbar_button('Update');
		cy.get_error_msg().should('contain', 'Field "value" is mandatory. Please specify value to be updated');
		cy.reload();
		cy.set_link('document_type', 'ToDo');
		cy.click_toolbar_button('Save');
		cy.get_open_dialog().should('contain', 'Missing Fields')
			.and('contain', 'Mandatory fields required in Bulk Update');
		cy.get_error_msg().find('li').should('contain', 'Field')
			.and('contain', 'Update Value');
		cy.hide_dialog();
		cy.set_select('field', 'status');
		cy.click_toolbar_button('Save');
		cy.get_open_dialog().should('contain', 'Missing Fields')
			.and('contain', 'Mandatory fields required in Bulk Update');
		cy.get_error_msg().find('li').should('contain', 'Update Value');
		cy.hide_dialog();
		cy.set_textarea('update_value', 'Closed');
		cy.set_textarea('condition', 'status="Open"');
		cy.save();
		cy.click_toolbar_button('Update');
		cy.wait(2000);
		
		//Checking if the status for all the created todos has been updated from Open to Closed 
		cy.go_to_list('ToDo');
		cy.set_select('status', 'Closed');
		cy.get_input('description').should('have.value', '%This is a test todo for testing bulk update%');
		cy.get('.list-count').should('contain', '10 of 10');

		//Deleting the bulk update doc
		cy.go_to_list('Bulk Update');
		cy.click_menu_button();
		cy.click_toolbar_dropdown('Delete');
		cy.get('.modal-footer > .standard-actions > button.btn-primary:visible')
			.contains('Yes')
			.click({force: true, multiple: true});
		cy.wait(1000);

		//Deleting all the created todos
		cy.go_to_list('ToDo');
		cy.get('.list-row .level-item .list-row-checkbox')
			.click({force: true, scrollBehavior: false, multiple: true});
		cy.click_action_button('Actions');
		cy.click_toolbar_dropdown('Delete');
		cy.get('.modal-footer > .standard-actions > button.btn-primary:visible')
			.contains('Yes')
			.click({force: true, multiple: true});
		cy.wait(3000);
		cy.reload();

		//Removing the filters set
		cy.set_select('status', '');
		cy.get_input('description').click({force: true}).clear();
    });
});
