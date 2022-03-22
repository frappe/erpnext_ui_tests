

context('Create Customer', () => {
	before(() => {
		cy.login();
	});

	it('Create Customer', () => {
		cy.visit(`app/customer`);
		cy.wait(200);
		cy.click_listview_primary_button('Add Customer');
		cy.contains('Edit in full page').click();
		cy.location("pathname").should("eq","/app/customer/new-customer-1");
		cy.get_field('customer_name', 'Data').type('Nidhi', {delay: 200});
		cy.get_field('customer_type', 'Select').should('have.value', 'Company');
		cy.get_field('customer_group', 'Link').type('All Customer Groups');
		cy.get_field('territory', 'Link').type('All Territories');
		cy.get('.form-page > :nth-child(5) > .section-head > .ml-2 > .icon > .mb-1').click(); //click to expand 'Currency and Price List' section
		cy.get_field('default_currency', 'Link').type('INR');
		cy.wait(200);
		cy.findByRole('button', {name: 'Save'}).trigger('click', {force: true});
	});

	it('Check customer form values', () => {
		cy.get('.page-title').should('contain', 'Nidhi');
		cy.get('.page-title').should('contain', 'Enabled');
		cy.get_field('customer_name', 'Data').should('have.value', 'Nidhi');
		cy.get_field('customer_group', 'Link').should('have.value', 'All Customer Groups');
		cy.get_field('territory', 'Link').should('have.value', 'All Territories');
		cy.location("pathname").should("not.be","/app/customer/new");
	});

	after(() => {
		cy.remove_doc('Customer', 'Nidhi');
	});
});
