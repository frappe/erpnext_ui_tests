
context('Quotation Creation', () => {
	before(() => {
		cy.login();
		cy.visit('/app');

		cy.insert_doc(
			"Item",
			{
				item_code: "Apple iPhone 13 Pro",
				item_group: "All Item Groups",
				valuation_rate: 110000,
				stock_uom: "Nos",
			},
			true
		)

		cy.insert_doc(
			"Customer",
			{
				customer_name: "Maria Garcia",
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
				address_title: "Maria's Address",
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
						link_name: "Maria Garcia",
						link_title: "Maria Garcia",
						parent: "Maria's Address-Billing",
						parentfield: "links",
						parenttype: "Address",
						doctype: "Dynamic Link"
					}
				]
			},
			true
		)
	});

	it('Create Quotation', () => {
		cy.new_doc('Quotation');
		cy.url().should('include', '/quotation/new-quotation');

		var today = new Date();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1; // Months start at 0!
		let nextMonth = today.getMonth() + 2; //Validiy till next month
		let dd = today.getDate();
		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
		if (nextMonth < 10) nextMonth = '0' + nextMonth;
		var today = dd + '-' + mm + '-' + yyyy;
		var validTill = dd + '-' + nextMonth + '-' + yyyy;

		cy.get_select('naming_series').should('have.value', 'SAL-QTN-.YYYY.-');
		cy.get_input('transaction_date').should('have.value', today);
		cy.get_input('quotation_to').should('have.value', 'Customer');
		cy.get_input('valid_till').should('have.value', validTill);
		cy.set_link('party_name', 'Maria Garcia');
		cy.get_select('order_type').should('have.value', 'Sales');
		cy.get_read_only('customer_name').should('contain', 'Maria Garcia');

		cy.click_section('Address and Contact');
		cy.get_read_only('customer_address').should('contain', "Maria's Address-Billing");
		cy.get_read_only('shipping_address_name').should('contain', "Maria's Address-Billing");
		cy.get_read_only('territory').should('contain', 'All Territories');

		cy.click_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('selling_price_list').should('have.value', 'Standard Selling');

		cy.get('.rows > .grid-row > .data-row > .col-xs-4').trigger('click', {force: true});
		cy.set_link('item_code', 'Apple iPhone 13 Pro');
		cy.get_input('qty').should('have.value', "1.000");
		cy.set_input('rate', '110000');
		cy.get_read_only('amount').should('contain', '1,10,000.00');

		cy.get_read_only('total_qty').should('contain', "1");
		cy.get_read_only('total').should('contain', "₹ 1,10,000.00");
		cy.get_read_only('grand_total').should('contain', "₹ 1,10,000.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 1,10,000.00");

		cy.click_toolbar_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'Open');
	});
});
