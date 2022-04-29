context('Gantt View', () => {
	before(() => {
		cy.login();
		cy.go_to_list('Website');
	});

	it('Checking for the gantt view in todo', () => {
		cy.create_records({
			doctype: 'ToDo',
			priority: 'High',
			description: 'This is a test todo'
		}).as('todos');
		cy.go_to_list('ToDo');
		cy.click_listview_row_item(0);
		cy.findByPlaceholderText('Choose a color').click();
		cy.get('.swatches > [style="background-color: rgb(203, 41, 41);"]:visible').click();
		cy.save();
		cy.go_to_list('ToDo');

		//Checking if the dropdown button contains list view and gantt view option to select from
		cy.click_custom_toolbar_button('List View');
		cy.get_toolbar_button('Gantt');
		cy.click_toolbar_dropdown('Gantt');

		//Checking if the label of the dropdown button has now changed to 'Gantt view'
		cy.get('.custom-btn-group-label').should('contain', 'Gantt View');
		cy.set_select('status','');
		cy.set_select('priority','');

		//Checking if the gantt bar has the color and the description which was set in the todo
		cy.get('.bar > .bar-wrapper').should('have.class', 'color-CB2929');
		cy.get('.bar').contains(/This is a test todo/);

		//Checking if the footer button works and also their width changes
		cy.click_list_paging_button('Quarter Day');
		cy.get('.gantt').should('have.attr', 'width', '2622');
		cy.click_list_paging_button('Half Day');
		cy.get('.gantt').should('have.attr', 'width', '1330');
		cy.click_list_paging_button('Week');
		cy.get('.gantt').should('have.attr', 'width', '1540');
		cy.click_list_paging_button('Month');
		cy.get('.gantt').should('have.attr', 'width', '2040');
		cy.click_list_paging_button('Year');
		cy.get('.gantt').should('have.attr', 'width', '100%');

	});

	it('Checking for the gantt view in todo along with filters "Priority" and "Status"', () => {
		cy.create_records({
			doctype: 'ToDo',
			status: 'Closed',
			color: '#29CD42',
			priority: 'Medium',
			description: 'This is a test todo1'
		});
		cy.create_records({
			doctype: 'ToDo',
			status: 'Cancelled',
			color: '#ECAD4B',
			priority: 'Low',
			description: 'This is a test todo2'
		});

		//Checking if the correct bar for the todo shows up in the gantt when the status and priority is set
		cy.set_select('status', '');
		cy.set_select('priority', '');
		cy.get('.bar > .bar-wrapper').should('have.class', 'color-CB2929');
		cy.get('.bar > .bar-wrapper').should('have.class', 'color-29CD42');
		cy.get('.bar > .bar-wrapper').should('have.class', 'color-ECAD4B');
		cy.set_select('status', 'Open');
		cy.set_select('priority', 'High');
		cy.get('.bar > .bar-wrapper').should('have.class', 'color-CB2929');
		cy.get('.bar > .bar-wrapper').should('not.have.class', 'color-29CD42');
		cy.get('.bar > .bar-wrapper').should('not.have.class', 'color-ECAD4B');
		cy.set_select('status', 'Closed');
		cy.set_select('priority', 'Medium');
		cy.get('.bar > .bar-wrapper').should('have.class', 'color-29CD42');
		cy.get('.bar > .bar-wrapper').should('not.have.class', 'color-CB2929');
		cy.get('.bar > .bar-wrapper').should('not.have.class', 'color-ECAD4B');
		cy.set_select('status', 'Cancelled');
		cy.set_select('priority', 'Low');
		cy.get('.bar > .bar-wrapper').should('have.class', 'color-ECAD4B');
		cy.get('.bar > .bar-wrapper').should('not.have.class', 'color-CB2929');
		cy.get('.bar > .bar-wrapper').should('not.have.class', 'color-29CD42');
	});
});