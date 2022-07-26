context('Text Editor Control', () => {
	before(() => {
		cy.login();
		cy.visit('/app/doctype');
		//Creating a new doctype with text editor field type
		return cy.window().its('frappe').then(frappe => {
			return frappe.xcall('frappe.tests.ui_test_helpers.create_doctype', {
				name: 'Test Text Editor Control',
				fields: [
					{
						"label": "Input Text",
						"fieldname": "inptext",
						"fieldtype": "Text Editor",
						"in_list_view": 1,
					},
				]
			});
		});
	});
	it('Checking different editors available in text editor', () => {
		cy.new_form('Test Text Editor Control');
		cy.location("pathname").should('eq','/app/test-text-editor-control/new-test-text-editor-control-1');
		
		//Checking for the title and indicator is correct
		cy.get_page_title().should('contain','New Test Text Editor Control');
		cy.get_page_indicator().should('have.text','Not Saved');

		//Checking various heading options available in the text editor
		cy.fill_field('inptext','Test text editor control','Text Editor');
		cy.set_heading_text_editor(1);
		cy.get('h1').should('be.visible');
		cy.set_heading_text_editor(2);
		cy.get('h2').should('be.visible');
		cy.set_heading_text_editor(3);
		cy.get('h3').should('be.visible');
		cy.get('[aria-controls="ql-picker-options-1"]').click();
		cy.get('#ql-picker-options-1 > :nth-child(4)').click();

		//Checking for bold formatting
		cy.get_field('inptext','Text Editor').type('{selectall}');
		cy.get('button.ql-bold').first().click();
		cy.get('strong').should('be.visible');
		cy.get('button.ql-bold').first().click();

		//Checking for italic formatting
		cy.get_field('inptext','Text Editor').type('{selectall}');
		cy.get('button.ql-italic').first().click();
		cy.get('em').should('be.visible');
		cy.get('button.ql-italic').first().click();

		//Checking for underline formatting
		cy.get_field('inptext','Text Editor').type('{selectall}');
		cy.get('button.ql-underline').first().click();
		cy.get('u').should('be.visible');
		cy.get('button.ql-underline').first().click();

		//Verifying blockquote 
		cy.get_field('inptext','Text Editor').type('{selectall}');
		cy.get('button.ql-blockquote').first().click();
		cy.get('blockquote').should('be.visible');
		cy.get('button.ql-blockquote').first().click();

		//Verifying code block
		cy.get_field('inptext','Text Editor').type('{selectall}');
		cy.get('button.ql-code-block').first().click();
		cy.get('pre').should('be.visible');
		cy.get('button.ql-code-block').first().click();

		//Verifying if the text to the right direction
		cy.get_field('inptext','Text Editor').type('{selectall}');
		cy.get('button.ql-direction').first().click();
		cy.get('.ql-direction-rtl').should('have.css','text-align','right');
		cy.get('button.ql-direction').first().click();

		//Verifying Ordered list
		cy.get_field('inptext','Text Editor').clear();
		cy.fill_field('inptext','Test1','Text Editor').type('{enter}');
		cy.fill_field('inptext','Test2','Text Editor').type('{enter}');
		cy.fill_field('inptext','Test3','Text Editor').type('{enter}');
		cy.get_field('inptext','Text Editor').type('{selectall}');
		cy.get('[value="ordered"]').first().click();
		cy.get('ol').should('be.visible');
		cy.get('ol').should('have.length',2);
		cy.get('ol > li').should('have.attr', 'data-list', 'ordered');
		cy.get('ol > li').eq(0).should('have.text','Test1');
		cy.get('ol > li').eq(1).should('have.text','Test2');
		cy.get('ol > li').eq(2).should('have.text','Test3');
		cy.get_field('inptext','Text Editor').type('{selectall}');
		cy.get('[value="ordered"]').first().click();
		cy.get('ol').should('not.be.visible');

		//Verifying Bulleted list
		cy.get('[value="bullet"]').first().click();
		cy.get('ol').should('be.visible');
		cy.get('ol').should('have.length',2);
		cy.get('ol > li').should('have.attr', 'data-list', 'bullet');
		cy.get('ol > li').eq(0).should('have.text','Test1');
		cy.get('ol > li').eq(1).should('have.text','Test2');
		cy.get('ol > li').eq(2).should('have.text','Test3');
		cy.get_field('inptext','Text Editor').type('{selectall}');
		cy.get('[value="bullet"]').first().click();
		cy.get('ol').should('not.be.visible');

		//Verifying Check list
		cy.get('[value="check"]').first().click();
		cy.get('ol').should('be.visible');
		cy.get('ol').should('have.length',2);
		cy.get('ol > li').should('have.attr', 'data-list', 'unchecked');
		cy.get('ol > li').eq(0).should('have.text','Test1');
		cy.get('ol > li').eq(1).should('have.text','Test2');
		cy.get('ol > li').eq(2).should('have.text','Test3');
		cy.get_field('inptext','Text Editor').type('{selectall}');
		cy.get('[value="check"]').first().click();
		cy.get('ol').should('not.be.visible');

		//Verifying center alignment formatting
		cy.get_field('inptext','Text Editor').clear();
		cy.fill_field('inptext','Test text editor control','Text Editor');
		cy.set_alignment_text_editor('center');
		cy.get('.ql-editor > p').should('have.css','text-align','center');

		//Verifying right alignment formatting
		cy.set_alignment_text_editor('right');
		cy.get('.ql-editor > p').should('have.css','text-align','right');

		//Verifying justify alignment formatting
		cy.set_alignment_text_editor('justify');
		cy.get('.ql-editor > p').should('have.css','text-align','justify');
	});
}); 