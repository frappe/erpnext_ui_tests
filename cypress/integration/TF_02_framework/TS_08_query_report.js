context('Query report', () => {
	before(() => {
		cy.login();
		cy.go_to_list('Report');
	});

	it('Creating a new report', () => {
		cy.new_doc('Report');
		cy.set_input('report_name', 'Test item query report');
		cy.set_link('ref_doctype', 'item');
		cy.set_select('report_type', 'Query Report');
		cy.save();
		cy.wait(500);

		//Checking if "Show Report" gives error when no query has been specified
		cy.click_toolbar_button('Show Report');
		cy.get_open_dialog().should('contain', 'Report Document Error')
		.and('contain', 'Must specify a Query to run');
		cy.hide_dialog();

		//Checking if creating a new report with existing name throws error
		cy.new_doc('Report');
		cy.set_input('report_name', 'Test item query report');
		cy.get('.help-box').should('contain', 'Test item query report already exists. Select another name');
		cy.set_link('ref_doctype', 'item');
		cy.set_select('report_type', 'Query Report');
		cy.save();
		cy.get_open_dialog().should('contain', 'Duplicate Name')
		.and('contain', 'Report Test item query report already exists');
		cy.hide_dialog();
	});

	it('Adding query and verifying the report', () => {
		cy.get('#navbar-search').type('report list', {delay: 200});
		cy.get('#navbar-search').type('{enter}');

		//Inoutting the query for generating the report
		cy.list_open_row('Test item query report');
		cy.fill_field('query', 'Select item_name, item_group, stock_uom from `tabitem`', 'Code');
		cy.wait(500);
		cy.save();
		cy.wait(800);
		cy.click_toolbar_button('Show Report');
		cy.reload();
		cy.location('pathname').should('eq', '/app/query-report/Test%20item%20query%20report');
		cy.get_page_title().should('contain', 'Test item query report');
		cy.get('.custom-actions').should('contain', 'Set Chart')
		.and('contain', 'Create Card');

		//Checking if the datatable is created after clicking on show report
		cy.get('.datatable').should('exist');

		//Checking if the headers are same as provided
		cy.get('.datatable .dt-header .dt-cell--header').should('contain', 'item_name')
		.and('contain', 'item_group')
		.and('contain', 'stock_uom');
	});

	it('Deleting the report', () => {
		cy.go_to_list('Report');
		cy.click_listview_checkbox(0);
		cy.click_action_button('Actions');
		cy.click_toolbar_dropdown('Delete');
		cy.click_modal_primary_button('Yes', {multiple: true});
	});
});