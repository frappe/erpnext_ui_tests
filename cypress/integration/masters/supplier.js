context('Supplier', () => {
	before(() => {
		cy.login();
	});

	it('Insert and verify attributes of a Supplier', () => {
		cy.new_form('Supplier');
		cy.set_link('supplier_group','All Supplier Groups');
		cy.set_input('supplier_name', 'Medlife International Suppliers');
		cy.save();

		cy.get_field('supplier_name', 'Link').should('have.value', 'Medlife International Suppliers');
		cy.get_field('supplier_group', 'Link').should('have.value', 'All Supplier Groups');
        cy.location("pathname").should("not.be","/app/supplier/new");

		cy.get_page_title().should('contain', 'Medlife International Suppliers');
        cy.get_page_title().should('contain', 'Enabled');
	});
});
