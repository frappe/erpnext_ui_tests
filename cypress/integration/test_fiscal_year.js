context('Create Fiscal Year', () => {
	before(() => {
		cy.login();
	});

	it('Create fiscal year', () => {
		cy.visit('app/fiscal-year');
		cy.click_listview_primary_button("Add Fiscal Year");
		cy.get_field('year', 'Data').type('2023');
		cy.get_field('year_start_date').should('have.value','01-01-2023');
		cy.get_field('year_end_date').should('have.value','12-31-2023');
		cy.findByRole('button', {name: 'Save'}).click();
		cy.get('.page-title').should('contain', '2023');
	});

	it('Deleting FE', () => {
		cy.visit('app/fiscal-year/2023-2024');
		cy.get('[title="disabled"] > .checkbox > label > .input-area').click();
		cy.findByRole('button', {name: 'Save'}).click();
		cy.wait(400);
		cy.visit('app/fiscal-year');
		cy.select_listview_row_checkbox(0);
		cy.findByRole('button', {name: 'Actions'}).click();
		cy.get('.actions-btn-group > .dropdown-menu > :nth-child(7) > .grey-link').click();
		cy.findByRole('button', {name: 'Yes'}).click();

	});

});
