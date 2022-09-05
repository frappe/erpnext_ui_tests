context('HTML Editor Control', () => {
	before(() => {
		cy.login();
		cy.visit('/app/doctype');
		//Creating a new doctype for testing HTML editor
		return cy.window().its('frappe').then(frappe => {
			return frappe.xcall('frappe.tests.ui_test_helpers.create_doctype', {
				name: 'Test HTML Editor Control',
				fields: [
					{
						"label": "HTML",
						"fieldname": "html",
						"fieldtype": "HTML Editor",
						"in_list_view": 1,	
					},
				],
				autoname: "HTML.#####"
			});
		});
	});
	it('Checking HTML editor by using html tags', () => {
		cy.new_form('Test HTML Editor Control');
		cy.location("pathname").should('eq','/app/test-html-editor-control/new-test-html-editor-control-1');
		
		//Checking for the title and indicator is correct
		cy.get_page_title().should('contain','New Test HTML Editor Control');

		//Typing the code for creating radio buttons in the html editor field
		cy.set_input_html_editor('<input id="html" name="fav_language" type="radio" value="HTML">');
		cy.set_input_html_editor('<label for="html">HTML</label><br>');
		cy.set_input_html_editor('<input id="css" name="fav_language" type="radio" value="CSS">');
		cy.set_input_html_editor('<label for="css">CSS</label><br>');
		cy.set_input_html_editor('<input id="javascript" name="fav_language" type="radio" value="JavaScript">');
		cy.set_input_html_editor('<label for="javascript">JavaScript</label>');
		cy.get('button').should('contain','Preview');
		cy.get('button').contains('Preview').click();

		//Verifying if the radio buttons are previewed
		cy.get('.html-preview').should('be.visible');

		//Checking if the id and value of the radio buttons are correct when previewing the buttons
		cy.get('.html-preview > input').should('have.id','html');
		cy.get('.html-preview > input').should('have.value','HTML');
		cy.get('.html-preview > input').eq(1).should('have.id','css');
		cy.get('.html-preview > input').eq(1).should('have.value','CSS');
		cy.get('.html-preview > input').eq(2).should('have.id','javascript');
		cy.get('.html-preview > input').eq(2).should('have.value','JavaScript');

		//Checking if the edit functionality works for the html editor
		cy.get('button').should('contain','Edit');
		cy.get('button').contains('Edit').click();
		cy.get('.ace_content').should('be.visible');

		//Checking if the Expand and Collapse functionality works
		cy.get('button').should('contain','Expand');
		cy.get('button').contains('Expand').click();
		cy.get('button').should('contain','Collapse');
		cy.get('button').contains('Collapse').click();
		cy.save();
		cy.get('.indicator-pill').should('not.be.visible');
		cy.location("pathname").should('not.be','/app/test-html-editor-control/new-test-html-editor-control-1');
		
		//Deleting the record
		cy.delete_first_record('Test HTML Editor Control');
	});
});