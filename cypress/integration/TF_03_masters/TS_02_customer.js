context('Create Customer', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Create Customer', () => {
		cy.create_records({
            doctype: 'Customer',
            customer_name: 'Marie',
            customer_group: 'Commercial',
			territory: 'All Territories',
			default_currency: 'INR'
        });

		cy.go_to_list('Customer');
		cy.list_open_row('Marie');
		cy.wait(5000);
		cy.get_field('customer_type', 'Select').should('have.value', 'Company');
		cy.get_page_title().should('contain', 'Marie');
		cy.get_page_title().should('contain', 'Enabled');
		cy.get_field('customer_name', 'Data').should('have.value', 'Marie');
		cy.get_field('customer_group', 'Link').should('have.value', 'Commercial');
		cy.get_field('territory', 'Link').should('have.value', 'All Territories');
		cy.location("pathname").should("not.be","/app/customer/new");
	});

	it('Customer with address', () => {
		cy.create_records({
            doctype: 'Customer',
            customer_name: 'William Harris',
            customer_group: 'All Customer Groups',
			territory: 'All Territories',
			default_currency: 'INR',
			default_price_list: 'Standard Selling'
        });

		cy.create_records({
			doctype: 'Address',
			address_title: "William's Address",
			address_type: 'Billing',
			address_line1: '18th Floor, ',
			address_line2: 'Prabhat Bldg Off Sitladevi Temple Road, Vile Parle West, ',
			city: 'Mumbai',
			country: 'India',
			pincode: '400047',
			state: 'Maharashtra',
			is_primary_address: '1',
			is_shipping_address: '1'
		});
		cy.go_to_list('Address');
		cy.list_open_row("William's Address-Billing");
		cy.grid_add_row('links');
		cy.set_link('links.link_doctype', 'Customer');
		cy.set_link('links.link_name', 'William Harris');
		cy.save();
	})
});
