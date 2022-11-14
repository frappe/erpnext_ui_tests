context('Internal Customer', () => {
	before(() => {
		cy.login();
	});

	it('Create Company', () => {
		cy.new_doc('Company');
		cy.set_input('company_name', 'Windermere Furnitures');
		cy.get_field('abbr', 'Data').should('have.value', 'WF');
		cy.set_link('default_currency', 'INR');
		cy.set_link('country', 'India');
		cy.save();
 	});

	it('Create a Price List first', () => {
		cy.new_form('Price List');
		cy.set_input('price_list_name', 'Standard Price List : Buying & Selling');
		cy.get_field('buying', 'Check').check();
		cy.get_field('buying', 'checkbox').should('be.checked');
		cy.get_field('selling', 'Check').check();
		cy.get_field('selling', 'checkbox').should('be.checked');
		cy.grid_add_row('countries');
		// cy.grid_open_row('countries', '1');
		// cy.set_link('country', 'India');
		// cy.close_grid_edit_modal();
		cy.save();
	});

	it('Create an internal Customer', () => {
		cy.new_form('Customer');
		cy.set_input('customer_name', 'Windermere Furnitures');
		cy.get_field('customer_type', 'Select').should('have.value', 'Company');
		cy.set_link('customer_group', 'Commercial');
		cy.set_link('territory', 'All Territories');

		cy.click_section('Internal Customer');
		cy.get_field('is_internal_customer', 'check').check();
		cy.set_link('represents_company', 'Windermere Furnitures');
		cy.grid_add_row('companies');
		// cy.grid_open_row('companies', '1');
		// cy.set_link('company', 'Wind Power LLC');
		// cy.close_grid_edit_modal();

		//cy.click_section('Currency and Price List');
		cy.set_link('default_currency', 'INR');
		cy.set_link('default_price_list', 'Standard Price List : Buying & Selling');
		cy.save();
		cy.wait(5000);
		cy.get_page_title().should('contain', 'Windermere Furnitures');
		cy.get_page_title().should('contain', 'Enabled');
		cy.get_field('customer_name', 'Data').should('have.value', 'Windermere Furnitures');
		cy.get_field('customer_group', 'Link').should('have.value', 'Commercial');
		cy.get_field('territory', 'Link').should('have.value', 'All Territories');
		cy.get_field('is_internal_customer', 'checkbox').should('be.checked');
		cy.location("pathname").should("not.be","/app/customer/new");
	});
});
