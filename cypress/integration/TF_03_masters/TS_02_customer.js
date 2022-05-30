context('Create Customer', () => {
	before(() => {
		cy.login();
	});

	it('Create Customer', () => {
		cy.new_form('Customer');
		cy.set_input('customer_name', 'Marie');
		cy.get_field('customer_type', 'Select').should('have.value', 'Company');
		cy.set_link('customer_group', 'Commercial');
		cy.set_link('territory', 'All Territories');
		cy.click_section('Currency and Price List');
		cy.set_link('default_currency', 'INR');
		cy.click_toolbar_button('Save');
		cy.wait(5000);
		cy.get_page_title().should('contain', 'Marie');
		cy.get_page_title().should('contain', 'Enabled');
		cy.get_field('customer_name', 'Data').should('have.value', 'Marie');
		cy.get_field('customer_group', 'Link').should('have.value', 'Commercial');
		cy.get_field('territory', 'Link').should('have.value', 'All Territories');
		cy.location("pathname").should("not.be","/app/customer/new");
	});

	it('Customer with address', () => {
		cy.insert_doc(
			"Customer",
			{
				customer_name: "William Harris",
				customer_group: "All Customer Groups",
				territory: "All Territories",
				default_currency: "INR",
				default_price_list: "Standard Selling",
			},
			true
		)

		cy.insert_doc(
			"Address",
			{
				address_title: "William's Address",
				address_type: "Billing",
				address_line1: "18th Floor, ",
				address_line2: "Prabhat Bldg Off Sitladevi Temple Road, Vile Parle West, ",
				city: "Mumbai ",
				country: "India",
				is_primary_address: 1,
				is_shipping_address: 1,
				links: [
					{
						link_doctype: "Customer",
						link_name: "William Harris",
						link_title: "William Harris",
						parent: "William's Address-Billing",
						parentfield: "links",
						parenttype: "Address",
						doctype: "Dynamic Link"
					}
				]
			},
			true
		)
	})
});
