context('Create Company', () => {
	before(() => {
		cy.login();
	});

	it('Create Company', () => {
		cy.new_doc('Company');
		cy.set_input('company_name', 'Bernhardt Furnitures');
		cy.get_field('abbr', 'Data').should('have.value', 'BF');
		cy.set_link('default_currency', 'INR');
		cy.set_link('country', 'India');
		cy.click_toolbar_button('Save');
		cy.wait(5000);
		cy.get_page_title().should('contain', 'Bernhardt Furnitures');
	});

	it("Check if appropriate Cost Centers are created", () => {
		cy.click_dropdown_action('View','Cost Centers');
		cy.location("pathname").should("eq", "/app/cost-center/view/tree");
	});

	it("Check if appropriate Chart of Accounts are created", () => {
		cy.click_dropdown_action('View','Chart of Accounts');
		cy.location("pathname").should("eq", "/app/account/view/tree");
	});
});

