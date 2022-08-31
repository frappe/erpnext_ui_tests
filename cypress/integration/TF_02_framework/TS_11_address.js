context('Address', () => {
    before(() => {
        cy.login();
        cy.go_to_list('Website');
    });

    it('Creating Billing and Shipping address', () => {
		cy.go_to_list('Address');
		cy.location('pathname').should('eq', '/app/address');
		cy.click_listview_primary_button('Add Address');

		//Creating Billing address
		cy.set_input('address_title', 'Test Address Billing');

		//Checking the options available in the address type field
		cy.get_select('address_type').should('contain', 'Billing')
			.and('contain', 'Shipping')
			.and('contain', 'Office')
			.and('contain', 'Personal')
			.and('contain', 'Plant')
			.and('contain', 'Postal')
			.and('contain', 'Shop')
			.and('contain', 'Subsidiary')
			.and('contain', 'Warehouse')
			.and('contain', 'Current')
			.and('contain', 'Permanent')
			.and('contain', 'Other');
		cy.click_toolbar_button('Save');
		cy.get_open_dialog().should('contain', 'Missing Fields')
			.and('contain', 'Mandatory fields required in Address');
		cy.hide_dialog();
		cy.set_input('address_line1', 'Frappe Technologies Pvt. Ltd, Vidhyavihar');
		cy.set_input('city', 'Mumbai');
		cy.set_link('country', 'India');
		cy.set_input('email_id', 'test');
		cy.click_toolbar_button('Save');
		cy.get_open_dialog().should('contain', 'Message')
			.and('contain', 'test is not a valid Email Address');
		cy.hide_dialog();
		cy.set_input('email_id', 'test@example.com');
		cy.get_field('is_primary_address', 'Check').check();
		cy.save();
		cy.get_page_title().should('contain', 'Test Address Billing-Billing');
		cy.get('.indicator-pill').should('contain', 'Enabled');

		//Creating Shipping address and enabling "Preffered Shipping address"
		cy.go_to_list('Address');
		cy.click_listview_primary_button('Add Address');
		cy.set_input('address_title', 'Test Address Shipping');
		cy.set_select('address_type', 'Shipping');
		cy.set_input('address_line1', 'Frappe Technologies Pvt. Ltd, Vidhyavihar');
		cy.set_input('city', 'Mumbai');
		cy.set_link('country', 'India');
		cy.get_field('is_shipping_address', 'Check').check();
		cy.save();
		cy.get_page_title().should('contain', 'Test Address Shipping-Shipping');
		cy.get('.indicator-pill').should('contain', 'Enabled');
    });
	it('Creating a customer and checking if the billing and shipping address is fetched', () => {
		//Creating customer
		cy.new_doc('Customer');
		cy.set_input('customer_name', 'Test Customer Address');
		cy.set_link('customer_group', 'Commercial');
		cy.set_link('territory', 'All Territories');
		cy.save();

		//Adding customer reference in the billing address
		cy.set_input_awesomebar('address');
		cy.list_open_row('Test Address Billing-Billing');
		cy.grid_add_row('links');
		cy.set_link('links.link_doctype', 'Customer');
		cy.set_link('links.link_name', 'Test Customer Address');
		cy.save();

		//Adding customer reference in the shipping address
		cy.set_input_awesomebar('address');
		cy.list_open_row('Test Address Shipping-Shipping');
		cy.grid_add_row('links');
		cy.set_link('links.link_doctype', 'Customer');
		cy.set_link('links.link_name', 'Test Customer Address');
		cy.save();

		//Going into the sales order doc and checking if the billing and shipping address are automatically fetched
		cy.new_doc('Sales Order');
		cy.set_link('customer', 'Test Customer Address');
		cy.click_section('Address and Contact');
		cy.get_field('customer_address', 'Link').should('have.value', 'Test Address Billing-Billing');
		cy.get_field('shipping_address_name', 'Link').should('have.value', 'Test Address Shipping-Shipping');
	});

	it('Renaming the address title', () => {
		cy.go_to_list('address');
		cy.list_open_row('Test Address Billing-Billing');
		cy.wait(3000);
		cy.get('.title-text:visible').click({force: true, scrollBehaviour: false});
		cy.set_input('name', 'Test Billing');
		cy.intercept('/api**').as('api');
		cy.click_modal_primary_button('Rename');
		cy.wait('@api');
		cy.wait(8000);
	});

	it('Deleting the addresses and customer', () => {
		cy.wait(2000);
		cy.remove_doc('Address', 'Test Billing');
		cy.remove_doc('Address', 'Test Address Shipping-Shipping');
		cy.remove_doc('Customer', 'Test Customer Address');
	});
});
