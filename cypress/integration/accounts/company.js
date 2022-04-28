context('Create Company', () => {
	before(() => {
		cy.login();
	});

	it('Create Company', () => {
		cy.new_doc('Company');
		cy.set_input('company_name', 'Frappe Tech');
		cy.get_field('abbr', 'Data').should('have.value', 'FT2');
		cy.set_link('default_currency', 'INR');
		cy.set_link('country', 'India');
		cy.save();
		cy.get_page_title().should('contain', 'Frappe Tech');
	});

	it("Check if appropriate Cost Centers are created", () => {
		cy.click_dropdown_action('View','Cost Centers');
		cy.location("pathname").should("eq", "/app/cost-center/view/tree");
	});

	it("Check if appropriate Chart of Accounts are created", () => {
		cy.visit(`app/company/Bernhardt%20Furnitures`);
		cy.click_dropdown_action('View','Chart of Accounts');
		cy.location("pathname").should("eq", "/app/account/view/tree");
	});
});

