context("Report Builder", () => {
	before(() => {
		cy.login();
		cy.visit("/app");

		cy.call(
			"erpnext_ui_tests.test_utils.todo.create_todo_test_docs"
		);
	});

	it('Creates a report with type report builder and checks "Pick Column" functionality', () => {
		//Creating a new report named "Test Report Builder" with type "Report Builder"
		cy.new_doc('Report');
		cy.set_input('report_name', 'Test Report Builder');
		cy.set_select('report_type', 'Report Builder');
		cy.set_link('ref_doctype', 'ToDo');
		cy.save();
		cy.get_field('module', 'Link').should('have.value', 'Desk');

		//Checks if creating a new report with the same name throws error
		cy.new_doc('Report');
		cy.set_input('report_name', 'Test Report Builder');
		cy.get('.help-box').should('contain', 'Test Report Builder already exists. Select another name');
		cy.set_link('ref_doctype', 'todo');
		cy.set_select('report_type', 'Report Builder');
		cy.save();
		cy.get_open_dialog().should('contain', 'Duplicate Name')
		.and('contain', 'Report Test Report Builder already exists');
		cy.get('.modal').type('{esc}');

		//Visiting the created report "Test Report Builder" and checks if the table is created
		cy.go_to_list('Report');
		cy.list_open_row('Test Report Builder');
		cy.click_toolbar_button('Show Report');
		cy.location('pathname').should('eq', '/app/todo/view/report/Test%20Report%20Builder');
		cy.get_page_title().should('contain', 'Test Report Builder');
		cy.get('.datatable').should('exist');
		cy.get('.datatable .dt-header .dt-cell--header').should('contain', 'ID')
		.and('contain', 'Description')
		.and('contain', 'Status')
		.and('contain', 'Priority')
		.and('contain', 'Due Date')
		.and('contain', 'Allocated To')
		.and('contain', 'Reference Type')
		.and('contain', 'Reference Name');

		//Checks "Pick Columns" functionality and checks if the choosed column gets added to the existing table structure
		cy.click_menu_button();
		cy.click_toolbar_dropdown('Pick%20Columns');
		cy.get('.modal-content .checkbox-options input[data-unit="assigned_by"]:visible')
			.click({force: true});
		cy.click_modal_primary_button('Submit');
		cy.get('.datatable .dt-header .dt-cell--header').should('contain', 'Assigned By');
	});

	it('Save as functionality', () => {
		cy.visit('/app/todo/view/report/Test%20Report%20Builder');
		cy.get_page_title().should('contain', 'Test Report Builder');
		cy.click_menu_button();
		cy.click_toolbar_dropdown('Save%20As');
		cy.wait(1000);

		//Changes the name of the report from "Test Report Builder" to "Open Todos"
		cy.get('.modal-dialog input[data-fieldname="name"]:visible').type('Open Todos');
		cy.intercept('/api/method/frappe.desk.reportview.save_report').as('submit');
		cy.click_modal_primary_button('Submit');
		cy.wait('@submit');

		//Checks if the title of the report gets renamed
		cy.get_page_title().should('contain', 'Open Todos');
	});

	after(() => {
		//Deletes the report "Test Report Builder"
		cy.delete_doc('Report', 'Test Report Builder');
    });
});
