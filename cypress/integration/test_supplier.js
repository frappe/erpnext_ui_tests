context('Supplier', () => {
	before(() => {
		cy.login();
	});
  
	it('Insert a Supplier', () => {
		cy.visit(`app/supplier/`);
		cy.get('.primary-action').click();
		cy.get('.custom-actions > .btn').click();
        cy.get_field('supplier_group', 'Link').type('All Supplier Groups').focus();
		cy.get_field('supplier_name', 'Link').type("Medlink International Suppliers");
		cy.findByRole('button', {name: 'Save'}).click();
		cy.get_field('supplier_name', 'Link').should('have.value', 'Medlink International Suppliers');
		cy.get_field('supplier_group', 'Link').should('have.value', 'All Supplier Groups');	
        cy.location("pathname").should("not.be","/app/lead/new");
        cy.get('.page-title').should('contain', 'Medlink International Suppliers');
		cy.remove_doc('Supplier', 'Medlink International Suppliers');
	});
});
