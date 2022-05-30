context('Employee', () => {
	before(() => {
		cy.login();
	});

	it('Create Employee', () => {
		cy.new_form('Employee');
		cy.set_input('first_name', 'John');
		cy.set_input('last_name', 'Mayer');
		cy.get_field('date_of_birth', 'Data').focus().type("11-05-1985", {delay: 800});
		cy.set_link('company', 'Wind Power LLC');
		cy.set_select('status', 'Active');
		cy.get_select('status', 'Active');
		cy.set_link('gender', 'Male');
		cy.set_today('date_of_joining');
		cy.save();
		cy.wait(500);
		cy.get_page_title().should('contain', 'Active');
	});
});
