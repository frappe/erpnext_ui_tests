context('Create Employee', () => {
	before(() => {
		cy.login();
	});

	it('Create Employee', () => {
		cy.visit(`app/employee`);
		cy.wait(200);
        cy.visit(`app/employee/`);
		cy.get('.primary-action').click();
		cy.location("pathname").should("eq","/app/employee/new-employee-1");
		cy.get_field('first_name', 'Data').type('Haris');
        cy.get_field('last_name', 'Data').type('Calvin');
		cy.get_field('gender', 'Link').clear().type('Male', {delay: 200});
		cy.get_field('date_of_birth', 'Data').focus();
        cy.wait(500);
        cy.get_field('date_of_birth', 'Data').focus().type("11-05-1985", {delay: 800});
        cy.wait(500);
        cy.get_field('date_of_joining', 'Data').focus();
        cy.wait(500);
        cy.get_field('date_of_joining', 'Data').focus().type("11-02-2019", {delay: 800});
        cy.get_field('employment_type', 'Link').type("Full-time");
		cy.findByRole('button', {name: 'Save'}).trigger('click', {force: true});
		cy.get('.page-title').should('contain', 'Haris Calvin');
		cy.get('.page-title').should('contain', 'Active');
		cy.get_field('first_name', 'Data').should('have.value', 'Haris');
        cy.get_field('last_name', 'Data').should('have.value', 'Calvin');
		cy.get_field('gender', 'Link').should('have.value', 'Male');
		cy.get_field('date_of_birth').should('have.value','11-05-1985');
        cy.get_field('date_of_joining').should('have.value','11-02-2019');
        cy.get_field('employment_type', 'Link').should('have.value','Full-time');
		cy.location("pathname").should("not.be","/app/employee/new");
        cy.remove_doc('Employee', 'HR-EMP-00004');
	});

	after(() => {
		cy.remove_doc('Employee', 'HR-EMP-00004');
	});
});