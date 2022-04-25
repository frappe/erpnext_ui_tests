context('Create Company', () => {
	before(() => {
		cy.login();
	});

	it('Create Company', () => {
		cy.new_doc('Company');
		cy.set_input('company_name', 'Data', 'Frappe Tech 4');
		cy.get_field('abbr', 'Data').should('have.value', 'FT4');
		cy.set_input('default_currency', 'Link', 'INR');
		cy.set_input('country', 'Link', 'India');
		cy.findByRole('button', {name: 'Save'}).trigger('click', {force: true});
		cy.wait(500);
		cy.get('.page-title').should('contain', 'Frappe Tech');
	});

	it("Check if appropriate Cost Centers are created", () => {
		cy.findByRole("button", { name: "View" }).trigger("click", {
			force: true,
		});
		cy.get('[data-label="Cost%20Centers"]').click({
			delay: 200,
		});
		cy.location("pathname").should("eq", "/app/cost-center/view/tree");
	});

	it("Check if appropriate Chart of Accounts are created", () => {
		cy.findByRole("button", { name: "View" }).trigger("click", {
			force: true,
		});
		cy.get('[data-label="Chart%20of%20Accounts"]').click({
			delay: 200,
		});
		cy.location("pathname").should("eq", "/app/account/view/tree");
	});
});

