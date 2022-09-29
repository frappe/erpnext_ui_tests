context('Contact', () => {
    before(() => {
        cy.login();
        cy.go_to_list('Website');
    });

    it('Creating a new contact', () => {
		//Creating contact
		cy.go_to_list('Contact');
		cy.location('pathname').should('eq', '/app/contact');
		cy.click_listview_primary_button('Add Contact');
		cy.click_listview_primary_button('Save');
		cy.get_open_dialog().should('contain', 'Missing Fields')
			.and('contain', 'Mandatory fields required in Contact');
		cy.get('.msgprint').find('li').should('contain', 'First Name');
		cy.reload();
		cy.set_input('first_name', 'Jenny Holmes');
		cy.get_select('status').should('contain', 'Passive')
			.and('contain', 'Open')
			.and('contain', 'Replied');
		cy.set_select('status', 'Open');
		cy.grid_add_row('email_ids');
		cy.set_grid_input('email_ids.email_id', 'jenny_holmes');
		cy.save();
		cy.get_open_dialog().should('contain', 'Message')
			.and('contain', 'jenny_holmes is not a valid Email Address');
		cy.get('.modal').type('{esc}');
		cy.get_input('email_ids.email_id').clear();
		cy.set_grid_input('email_ids.email_id', 'jenny_holmes@test.com');
		cy.grid_add_row('phone_nos');
		cy.set_grid_input('phone_nos.phone', 'jenny');
		cy.save();
		cy.get_open_dialog().should('contain', 'Message')
			.and('contain', 'jenny is not a valid Phone Number');
		cy.get('.modal').type('{esc}');
		cy.get_input('phone_nos.phone').clear();
		cy.set_grid_input('phone_nos.phone', '4455788992');
		cy.save();
    });

	it('Creating a customer and checking if the contact gets fetched automatically', () => {
		//Creating customer
		cy.new_doc('Customer');
		cy.set_input('customer_name', 'Test Customer Contact');
		cy.set_link('customer_group', 'Commercial');
		cy.set_link('territory', 'All Territories');
		cy.save();

		//Setting the customer in the reference of the contact
		cy.set_input_awesomebar('contact');
		cy.list_open_row('Jenny Holmes');
		cy.grid_add_row('links');
		cy.set_link('links.link_doctype', 'Customer');
		cy.set_link('links.link_name', 'Test Customer Contact');
		cy.get_field('is_primary_contact', 'Check').check();
		cy.get_field('is_billing_contact', 'Check').check();
		cy.save();

		//Creating a new sales order with the customer and checking if the contact is fetched automatically
		cy.new_doc('Sales Order');
		cy.get_input('customer').click({force: true});
		cy.set_link('customer', 'Test Customer Contact');
		//cy.click_section('Address and Contact');
		cy.get_section('Address and Contact').click();
		cy.get_field('contact_person', 'Link').should('have.value', 'Jenny Holmes');
		cy.get_read_only('contact_display').should('contain', 'Jenny Holmes');
	});

	it('Renaming the contact name', () => {
		cy.go_to_list('contact');
		cy.list_open_row('Jenny Holmes');
		cy.wait(3000);
		cy.get('.title-text:visible').click({force: true, scrollBehaviour: false});
		cy.set_input('name', 'Jenny');
		cy.intercept('/api/method/frappe.model.rename_doc.update_document_title').as('api');
		cy.click_modal_primary_button('Rename');
		cy.wait('@api');
		cy.get('.title-text:visible').should('contain', 'Jenny');
	});

	it('Deleting the addresses and customer', () => {
		cy.wait(5000);
		cy.remove_doc('Contact', 'Jenny');
		cy.remove_doc('Customer', 'Test Customer Contact');
	});
});