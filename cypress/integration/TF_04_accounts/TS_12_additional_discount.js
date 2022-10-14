context('Additional Discount', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Create item to check additional discount cases', () => {
		cy.insert_doc(
			"Item",
				{
					item_code: "Vintage Green Classic Photo Frame",		//name
					item_group: "All Item Groups",
					stock_uom: "Nos",
					is_stock_item: 1,
					standard_rate: 100,
				},
			true
		)
	});

	it('Checking additional discount on net total in sales order', () => {
		cy.new_doc("Sales Order");
		cy.url().should('include', '/app/sales-order/new-sales-order');
		cy.get_select('naming_series').should('have.value', 'SAL-ORD-.YYYY.-');
		cy.get_input('company').should('not.have.value', 0);
		cy.get_input('transaction_date').should('not.have.value', 0);
		cy.set_link('customer', 'William Harris');
		cy.get_select('order_type').should('have.value', 'Sales');
		cy.set_today('delivery_date');

		cy.click_section('Currency and Price List');
		cy.open_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('selling_price_list').should('have.value', 'Standard Selling');

		cy.set_link('items.item_code', 'Vintage Green Classic Photo Frame');  // name
		cy.get_input('delivery_date').should('not.have.value', 0);
		cy.get_input('qty').should('have.value', "1.000");
		cy.get_input('rate').should('have.value', "100.00");
		cy.get_read_only('amount').should('contain', "100.00");
		cy.get_read_only('total_qty').should('contain', "1");
		cy.get_read_only('total').should('contain', "₹ 100.00");

		// Checking values without applying additional discount
		cy.set_link('taxes_and_charges', 'test Output GST Out-state');
		cy.get_input('taxes.tax_amount').should('have.value', '18.00');
		cy.get_read_only('total').should('contain', "118.00");
		cy.get_read_only('total_taxes_and_charges').should('contain', "₹ 18.00");
		cy.get_read_only('grand_total').should('contain', "₹ 118.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 118.00");

		// Applying additional discount on net total
		cy.click_section('Additional Discount');
		cy.wait(500);
		cy.open_section('Additional Discount');
		cy.set_select('apply_discount_on', 'Net Total');
		cy.open_section('Additional Discount');
		cy.set_input('additional_discount_percentage', '5');
		cy.get_input('additional_discount_percentage').blur();
		cy.click_section('Additional Discount');
		cy.get_input('discount_amount').should('have.value', '5.00');

		// Validating values after applying additional discount
		cy.get_read_only('total').should('contain', "₹ 100.00");
		cy.get_read_only('net_total').should('contain', "₹ 95.00");
		cy.get_input('taxes.tax_amount').should('have.value', '17.10');
		cy.get_read_only('total').should('contain', "112.10");
		cy.get_read_only('total_taxes_and_charges').should('contain', "₹ 17.10");
		cy.get_read_only('grand_total').should('contain', "₹ 112.10");
		cy.get_read_only('rounded_total').should('contain', "₹ 112.00");

		cy.click_toolbar_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'To Deliver and Bill');
	});

	it('Checking additional discount on grand total in sales invoice', () => {
		cy.new_doc("Sales Invoice");
		cy.url().should('include', '/app/sales-invoice/new-sales-invoice');
		cy.get_select('naming_series').should('have.value', 'ACC-SINV-.YYYY.-');
		cy.get_input('company').should('not.have.value', 0);
		cy.get_input('posting_date').should('not.have.value', 0);
		cy.wait(500);
		cy.get_input('customer').click();
		cy.set_link('customer', 'William Harris');
		cy.set_today('due_date');

		cy.click_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('selling_price_list').should('have.value', 'Standard Selling');

		cy.set_link('items.item_code', 'Vintage Green Classic Photo Frame');  // name
		cy.get_input('qty').should('have.value', "1.000");
		cy.get_input('rate').should('have.value', "100.00");
		cy.get_read_only('amount').should('contain', "100.00");
		cy.get_read_only('total_qty').should('contain', "1");
		cy.get_read_only('total').should('contain', "₹ 100.00");

		// Checking values without applying additional discount
		cy.set_link('taxes_and_charges', 'test Output GST Out-state');
		cy.get_input('taxes.tax_amount').should('have.value', '18.00');
		cy.get_read_only('total').should('contain', "118.00");
		cy.get_read_only('total_taxes_and_charges').should('contain', "₹ 18.00");
		cy.get_read_only('grand_total').should('contain', "₹ 118.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 118.00");

		// Applying additional discount on grand total
		cy.click_section('Additional Discount');
		cy.wait(500);
		cy.open_section('Additional Discount');
		cy.get_select('apply_discount_on').should('have.value', "Grand Total");
		cy.set_input('additional_discount_percentage', '5');
		cy.get_input('additional_discount_percentage').blur();
		cy.click_section('Additional Discount');
		cy.get_input('discount_amount').should('have.value', '5.90');

		// Validating values after applying additional discount
		cy.get_read_only('total').should('contain', "₹ 100.00");
		cy.get_read_only('net_total').should('contain', "₹ 95.00");
		cy.get_input('taxes.tax_amount').should('have.value', '18.00');
		cy.get_read_only('total').should('contain', "112.10");
		cy.get_read_only('total_taxes_and_charges').should('contain', "₹ 17.10");
		cy.get_read_only('grand_total').should('contain', "₹ 112.10");
		cy.get_read_only('rounded_total').should('contain', "₹ 112.00");

		cy.click_toolbar_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'Unpaid');
	});
});
