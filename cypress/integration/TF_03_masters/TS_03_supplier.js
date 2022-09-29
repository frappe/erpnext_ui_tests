context('Supplier', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Insert and verify attributes of a Supplier', () => {
		cy.create_records({
            doctype: 'Supplier',
            supplier_group: 'All Supplier Groups',
            supplier_name: 'Medlife International Suppliers'
        });
		cy.go_to_list('Supplier');
		cy.list_open_row('Medlife International Suppliers');
		cy.get_input('supplier_name').should('have.value', 'Medlife International Suppliers');
		cy.get_input('supplier_group').should('have.value', 'All Supplier Groups');
		cy.location("pathname").should("not.be","/app/supplier/new");
		cy.get_page_title().should('contain', 'Medlife International Suppliers');
		cy.get_page_title().should('contain', 'Enabled');
	});

	it('Adding supplier with address', () => {
		cy.create_records({
            doctype: 'Supplier',
			supplier_name: "Lisa Davis",
			supplier_group: "All Supplier Groups",
			default_currency: "INR",
			default_price_list: "Standard Buying"
        });

		cy.create_records({
            doctype: "Address",
			address_title: "Lisa's Address",
			address_type: "Billing",
			address_line1: "38,1 Flr Welfare Chmbs, ",
			address_line2: "Sec 17, Krishi Bazaar, Goregaon(e), ",
			city: "Mumbai ",
			country: "India",
			pincode: '400060',
			state: 'Maharashtra',
			is_primary_address: 1,
			is_shipping_address: 1
        });
		cy.go_to_list('Address');
		cy.list_open_row("Lisa's Address-Billing");
		cy.grid_add_row('links');
		cy.set_link('links.link_doctype', 'Supplier');
		cy.set_link('links.link_name', 'Lisa Davis');
		cy.save();
	});
});
