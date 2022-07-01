context('Control Multiselect List', () => {
	before(() => {
		cy.login();
		cy.visit('/app/website');
	});

	function get_dialog_with_multiselect_list() {
		//Creating a dialog with field type as multiselect list
		return cy.dialog({
			title: 'Multiselect List',
			fields: [{
				"label": "Account",
    			"fieldname": "account",
    			"fieldtype": "MultiSelectList",
				"placeholder": "Account",
				"options": [
					"Administrative Expenses",
					"Buildings",
					"Cash in Hand",
					"Debtors",
					"Expenses",
					"Income",
					"Creditors",
					"Office Rent",
					"Salary",
					"Sales",
				],
			}],
		});
	}

	it('Checking if mutiple items can be selected from the multiselect dropdown list', () => {
		get_dialog_with_multiselect_list().as('dialog');

		//Checking the title and the label of the field in the modal
		cy.get('.modal-title').should('have.text','Multiselect List');
		cy.get('.control-label').should('have.text','Account');

		//Clicking on the field and selecting various options from the dropdown
		cy.get('.multiselect-list').click();
		cy.get('.status-text').should('have.text','Account');
		cy.get('[data-value="Administrative%20Expenses"]').click();
		cy.get('.multiselect-list').should('contain','Administrative Expenses');
		cy.get('[data-value="Administrative%20Expenses"]').should('have.class','selected');
		cy.get('[data-value="Buildings"]').click();
		cy.get('.multiselect-list').should('contain','2 values selected');
		cy.get('[data-value="Buildings"]').should('have.class','selected');
		cy.get('[data-value="Salary"]').click();

		//Checking if the values selected and the number shown in the field is same
		cy.get('.multiselect-list').should('contain','3 values selected');
		cy.get('[data-value="Salary"]').should('have.class','selected');


		//Deselecting the selected values and check if the number in the field decrease
		cy.get('[data-value="Administrative%20Expenses"]').click();
		cy.get('[data-value="Administrative%20Expenses"]').should('not.have.class','selected');
		cy.get('.multiselect-list').should('contain','2 values selected');
		cy.get('[data-value="Buildings"]').click();
		cy.get('[data-value="Buildings"]').should('not.have.class','selected');
		cy.get('.multiselect-list').should('contain','Salary');
		cy.get('[data-value="Salary"]').click();
		cy.get('[data-value="Salary"]').should('not.have.class','selected');
		cy.get('.multiselect-list').should('contain','Account');

		cy.get('[data-value="Administrative%20Expenses"]').click();
		cy.get('[data-value="Buildings"]').click();
		cy.get('[data-value="Salary"]').click();
		cy.get('.multiselect-list').should('contain','3 values selected');

		//Checking if the class of the field if it is empty
		cy.get('.multiselect-list').click();
		cy.get('.status-text').type('{selectall}{backspace}');
		cy.get('.multiselect-list').click();
		cy.get('.selectable-items').should('not.have.class','selected');
	});
});