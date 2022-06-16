import doctype_location from '../../fixtures/doctype_location';

context('Tree View', () => {
	before(() => {
		cy.login();
		cy.go_to_list('DocType');
		cy.insert_doc('DocType', doctype_location, true);
	});

	it('Enabling "is_tree" for doctype and creating and verifying tree view', () => {
		//Enabling tree for location doctype
		cy.list_open_row('Test Location');
		cy.get_field('is_tree', 'checkbox').check();
		cy.save();
		cy.new_doc('Test Location');
		cy.set_input('location_name', 'Mumbai');
		cy.set_input('latitude', '17.632');
		cy.set_input('longitude', '19.632');
		cy.save();
		cy.go_to_list('Test Location');

		//Verifying the paths for the views
		cy.location('pathname').should('eq', '/app/test-location');
		cy.get_page_title().should('contain', 'Test Location');
		cy.click_custom_toolbar_button('List View');
		cy.click_toolbar_dropdown('Tree');
		cy.location('pathname').should('eq', '/app/test-location/view/tree');
		cy.get_page_title().should('contain', 'Test Location Tree');

		//Adding child to the parent node
		cy.get('.tree-link').should('contain', 'LOCATION00001');
		cy.get('.tree-link[data-label="LOCATION00001"]').click();
		cy.get('.tree-toolbar-button').should('contain', 'Add Child');
		cy.get('.tree-toolbar-button').contains('Add Child').click();
		cy.get_field('is_group', 'Check').check();
		cy.click_modal_primary_button('Create New');
		cy.get('.tree-children').find('li').should('have.length', 1);
		cy.get('.tree-children .tree-link').contains(/LOCATION/);
		cy.get('.tree-children .tree-link').click();

		//Verifying if the children node consists of the required actions buttons
		cy.get('.tree-node .tree-node-toolbar button').should('contain', 'Edit')
		.and('contain', 'Add Child')
		.and('contain', 'Rename')
		.and('contain', 'Delete');
		cy.get('.custom-actions button').should('contain', 'Expand All');

		//Verifying if the menu button consists of the required menu's
		cy.click_menu_button();
		cy.get('.dropdown-menu:visible .dropdown-item').should('have.length', 4);
		cy.get('.dropdown-menu:visible .dropdown-item').should('contain', 'View List')
		.and('contain', 'Print')
		.and('contain', 'Refresh')
		.and('contain', 'Rebuild Tree');
	});

	it('Verifying edit, delete and rename functions', () => {
		//Editing the children node
		cy.get('.tree-node .tree-node-toolbar button').contains('Edit').click();
		cy.set_input('location_name', 'Mumbai');
		cy.save();

		//Adding child
		cy.visit('/app/test-location/view/tree');
		cy.get('.tree-children .tree-link').click();
		cy.get('.tree-node .tree-node-toolbar button').contains('Add Child').click();
		cy.get_field('is_group', 'Check').check();
		cy.click_modal_primary_button('Create New');
		cy.get('.tree-link[data-label="LOCATION00001"]').click();
		cy.get('.custom-actions button').contains('Expand All').click();
		cy.get('.tree .tree-link').should('have.length', 3);
		cy.get('.tree-children ul:visible li.tree-node:last-child .tree-link').click({force: true});
		cy.get('.tree-node .tree-node-toolbar button:visible').contains('Delete').click();
		cy.get('.modal-footer > .standard-actions > button.btn-primary:visible').contains('Yes').click({force: true});
		cy.hide_dialog();
		cy.wait(5000);

		//Renaming the children node
		cy.get('.tree-children .tree-link').click();
		cy.get('.tree-node .tree-node-toolbar button').contains('Rename').click();
		cy.get('.modal-footer > .standard-actions > button.btn-primary:visible').contains('Rename').click({force: true});
		cy.get('.msgprint').should('contain', 'No changes made because old and new name are the same.');
		cy.get('.modal-actions button.btn-modal-close').click({force: true, multiple: true});
		cy.get('#navbar-search').type('test location list', {delay: 200});
		cy.get('#navbar-search').type('{enter}');
		cy.click_custom_toolbar_button('List View');
		cy.click_toolbar_dropdown('Tree');
		cy.findByRole('button', {name: 'Rename'}).click();
		cy.set_input('new_name', 'LOCATION23456');
		cy.intercept('/api').as('api');
		cy.get('.modal-footer > .standard-actions > button.btn-primary:visible').contains('Rename').click({force: true});
		cy.wait('@api');
		cy.get('.tree-children .tree-link').should('contain', 'LOCATION23456');

		//Deleting the children node
		cy.get('.tree-children .tree-link[data-label="LOCATION23456"]').click({force: true});
		cy.get('.tree-node .tree-node-toolbar button').contains('Delete').click();
		cy.wait(500);
		cy.reload();
	});

	it('Deleting the created doctype', () => {
		cy.get('#navbar-search').type('doctype list', {delay: 200});
		cy.get('#navbar-search').type('{enter}');
		cy.click_listview_checkbox(0);
		cy.click_action_button('Actions');
		cy.click_toolbar_dropdown('Delete');
		cy.click_modal_primary_button('Yes', {multiple: true});		
	});	
});