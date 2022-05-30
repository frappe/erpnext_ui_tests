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

	it('Adding supplier with address', () => {
		cy.insert_doc(
			"Supplier",
				{
					supplier_name: "Lisa Davis",
					supplier_group: "All Supplier Groups",
					default_currency: "INR",
					default_price_list: "Standard Buying",
				},
			true
		)

		cy.insert_doc(
			"Address",
			{
				address_title: "Lisa's Address",
				address_type: "Billing",
				address_line1: "38,1 Flr Welfare Chmbs, ",
				address_line2: "Sec 17, Krishi Bazaar, Goregaon(e), ",
				city: "Mumbai ",
				country: "India",
				is_primary_address: 1,
				is_shipping_address: 1,
				links: [
					{
						link_doctype: "Supplier",
						link_name: "Lisa Davis",
						link_title: "Lisa Davis",
						parent: "Lisa's Address-Billing",
						parentfield: "links",
						parenttype: "Address",
						doctype: "Dynamic Link"
					}
				]
			},
			true
		)
	});
});
