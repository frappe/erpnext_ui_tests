context('Create Sales Order', () => {
	before(() => {
		cy.login();
		cy.visit('/app');

		cy.insert_doc(
			"Item",
				{
					item_code: "Wireless Bluetooth Headphones - Black",
					item_group: "All Item Groups",
					valuation_rate: 4000,
					stock_uom: "Nos",
				},
			true
		)

		cy.insert_doc(
			"Customer",
				{
					customer_name: "Mihir Sharma",
					customer_group: "All Customer Groups",
					territory: "All Territories",
					default_currency: "INR",
					default_price_list: "Standard Selling",
				},
			true
		)
	});

	it('Create Sales Order', () => {
		var today = new Date();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1; // Months start at 0!
		let dd = today.getDate();
		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
		var today = dd + '-' + mm + '-' + yyyy;

		cy.new_doc('Sales Order');
		cy.url().should('include', '/app/sales-order/new-sales-order');

		cy.get_select('naming_series').should('have.value', 'SAL-ORD-.YYYY.-');
		cy.set_link('customer', 'Mihir Sharma');
		cy.get_input('customer').should('have.value', 'Mihir Sharma');
		cy.get_input('transaction_date').should('have.value', today);
		cy.get_select('order_type').should('have.value', 'Sales');
		cy.get_input('customer').should('have.value', 'Mihir Sharma');
		cy.set_today('delivery_date');

		cy.click_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('selling_price_list').should('have.value', 'Standard Selling');

		cy.set_link('items.item_code', 'Wireless Bluetooth Headphones - Black');
		cy.get_input('item_code').should('have.value', 'Wireless Bluetooth Headphones - Black');

		cy.get_input('delivery_date').should('have.value', today);
		cy.get_input('qty').should('have.value', "1.000");
		cy.set_input('rate', '4000');
		cy.get_input('rate').blur();
		cy.get_read_only('amount').should('contain', "4,000");

		cy.get_read_only('total_qty').should('contain', "1");
		cy.get_read_only('total').should('contain', "₹ 4,000.00");
		cy.get_read_only('grand_total').should('contain', "₹ 4,000.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 4,000.00");

		cy.click_toolbar_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'To Deliver and Bill');
	});
});
