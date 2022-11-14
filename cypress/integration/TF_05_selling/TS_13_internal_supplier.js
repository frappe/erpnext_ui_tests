context('Inter Company Stock Transfer', () => {
	before(() => {
		cy.login();
	});

	it('Create an internal Supplier', () => {
		cy.new_form('Supplier');
		cy.set_input('supplier_name', 'Wind Power LLC');
		cy.set_link('supplier_group','Distributor');
		cy.get_field('supplier_type', 'Select').should('have.value', 'Company');

		cy.click_section('Internal Supplier');
		cy.get_field('is_internal_supplier', 'check').check();
		cy.set_link('represents_company', 'Wind Power LLC');
		cy.grid_add_row('companies');
		// cy.grid_open_row('companies', '1');
		// cy.set_link('company', 'Windermere Furnitures');

		//cy.click_section('Currency and Price List');
		//cy.close_grid_edit_modal();
		cy.set_link('default_currency', 'INR');
		cy.set_link('default_price_list', 'Standard Price List : Buying & Selling');
		cy.save();
		cy.wait(5000);
		cy.get_page_title().should('contain', 'Wind Power LLC');
		cy.get_page_title().should('contain', 'Enabled');
		cy.get_field('supplier_name', 'Data').should('have.value', 'Wind Power LLC');
		cy.get_field('supplier_group', 'Link').should('have.value', 'Distributor');
		cy.click_section('Internal Supplier');
		cy.get_field('is_internal_supplier', 'checkbox').should('be.checked');
		cy.location("pathname").should("not.be","/app/supplier/new");
	});
});
