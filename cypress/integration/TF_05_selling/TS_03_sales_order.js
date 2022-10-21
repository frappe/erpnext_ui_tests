context('Create Sales Order', () => {
	before(() => {
		cy.login();
	});

	it('Create Sales Order', () => {
		var today = new Date();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1; // Months start at 0!
		let dd = today.getDate();
		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
		var today = dd + '-' + mm + '-' + yyyy;

		cy.visit('/app/quotation');
		cy.click_listview_row_item(0);
		cy.click_dropdown_action('Create', 'Sales Order');
		cy.url().should('include', '/app/sales-order/new-sales-order');

		cy.get_select('naming_series').should('have.value', 'SAL-ORD-.YYYY.-');
		cy.get_input('customer').should('have.value', 'William Harris');
		cy.get_input('transaction_date').should('have.value', today);
		cy.get_select('order_type').should('have.value', 'Sales');
		cy.get_input('customer').should('have.value', 'William Harris');
		cy.set_today('delivery_date');

		cy.click_section('Currency and Price List');
		cy.open_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('selling_price_list').should('have.value', 'Standard Selling');

		cy.get_input('items.item_code').should('have.value', 'Apple iPhone 13 Pro Max');
		cy.get_input('delivery_date').should('have.value', today);
		cy.get_input('qty').should('have.value', "1.000");
		cy.get_input('rate').should('have.value', "1,10,000.00");
		cy.get_read_only('amount').should('contain', "1,10,000.00");

		cy.get_read_only('total_qty').should('contain', "1");
		cy.get_read_only('total').should('contain', "₹ 1,10,000.00");
		cy.get_read_only('grand_total').should('contain', "₹ 1,10,000.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 1,10,000.00");

		cy.click_toolbar_button('Save');
		cy.visit('/app/sales-order');
		cy.click_listview_row_item(0);
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'To Deliver and Bill');
	});
});
