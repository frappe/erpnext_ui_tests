context('Gantt View', () => {
	before(() => {
		cy.login();
		cy.visit('/app/website');
	});

	it('Checking for the gantt view in todo', () => {
		cy.create_records({
			doctype: 'ToDo',
			priority: 'High',
			description: 'This is a test todo'
		}).as('todos');
		cy.visit('/app/todo');
		cy.click_listview_row_item(0);
		cy.findByPlaceholderText('Choose a color').click();
		cy.get('.swatches > [style="background-color: rgb(203, 41, 41);"]:visible').click();
		cy.findByRole('button', {name: 'Save'}).click();
		cy.visit('/app/todo');

		//Checking if the dropdown button contains list view and gantt view option to select from
		cy.get('.custom-btn-group-label').contains('List View').click();
		cy.get('.dropdown-menu').should('contain', 'Gantt');
		cy.get('[data-view="Gantt"]').click();

		//Checking if the label of the dropdown button has now changed to 'Gantt view'
		cy.get('.custom-btn-group-label').should('contain', 'Gantt View');
		cy.get_field('status', 'Select').select("");
		cy.get_field('priority', 'Select').select("");

		//Checking if the gantt bar has the color and the description which was set in the todo
		cy.get('.bar > .bar-wrapper').should('have.class', 'color-CB2929');
		cy.get('.bar').contains(/This is a test todo/);

		//Checking if the footer button works and also their width changes
		cy.get('button').contains('Quarter Day').click();
		cy.get('.gantt').should('have.attr', 'width', '2622');
		cy.get('button').contains('Half Day').click();
		cy.get('.gantt').should('have.attr', 'width', '1330');
		cy.get('button').contains('Day').click();
		cy.get('.gantt').should('have.attr', 'width', '2622');
		cy.get('button').contains('Week').click();
		cy.get('.gantt').should('have.attr', 'width', '1540');
		cy.get('button').contains('Month').click();
		cy.get('.gantt').should('have.attr', 'width', '2040');
		cy.get('button').contains('Year').click();
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
		cy.get_field('status', 'Select').select("");
		cy.get_field('priority', 'Select').select('');
		cy.get('.bar > .bar-wrapper').should('have.class', 'color-CB2929');
		cy.get('.bar > .bar-wrapper').should('have.class', 'color-29CD42');
		cy.get('.bar > .bar-wrapper').should('have.class', 'color-ECAD4B');
		cy.get_field('status', 'Select').select('Open');
		cy.get_field('priority', 'Select').select('High');
		cy.get('.bar > .bar-wrapper').should('have.class', 'color-CB2929');
		cy.get('.bar > .bar-wrapper').should('not.have.class', 'color-29CD42');
		cy.get('.bar > .bar-wrapper').should('not.have.class', 'color-ECAD4B');
		cy.get_field('status', 'Select').select('Closed');
		cy.get_field('priority', 'Select').select('Medium');
		cy.get('.bar > .bar-wrapper').should('have.class', 'color-29CD42');
		cy.get('.bar > .bar-wrapper').should('not.have.class', 'color-CB2929');
		cy.get('.bar > .bar-wrapper').should('not.have.class', 'color-ECAD4B');
		cy.get_field('status', 'Select').select('Cancelled');
		cy.get_field('priority', 'Select').select('Low');
		cy.get('.bar > .bar-wrapper').should('have.class', 'color-ECAD4B');
		cy.get('.bar > .bar-wrapper').should('not.have.class', 'color-CB2929');
		cy.get('.bar > .bar-wrapper').should('not.have.class', 'color-29CD42');
	});
});