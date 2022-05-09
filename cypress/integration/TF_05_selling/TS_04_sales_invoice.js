context('Sales Invoice Creation', () => {
	before(() => {
		cy.login();
	});

	it('Create Sales Invoice via SO', () => {
		var today = new Date();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1; // Months start at 0!
		let dd = today.getDate();
		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
		var today_date = dd + '-' + mm + '-' + yyyy;

		cy.visit('/app/sales-order');
		cy.click_listview_row_item(0);
		cy.get_page_title().should('contain', 'To Deliver and Bill');
		cy.click_dropdown_action('Create', 'Sales Invoice');
		cy.url().should('include', '/app/sales-invoice/new-sales-invoice');

		cy.get_select('naming_series').should('have.value', 'SINV-.YY.-');
		cy.get_input('customer').should('have.value', 'William Harris');
		cy.get_input('posting_date').should('have.value', today_date);
		cy.get_input('due_date').should('have.value', today_date);

		cy.click_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('selling_price_list').should('have.value', 'Standard Selling');

		cy.get_input('items.item_code').should('have.value', 'Apple iPhone 13 Pro Max');
		cy.get_input('qty').should('have.value', "1.000");
		cy.get_input('rate').should('have.value', "1,10,000.00");
		cy.get_read_only('amount').should('contain', "1,10,000.00");

		cy.get_read_only('total_qty').should('contain', "1");
		cy.get_read_only('total').should('contain', "₹ 1,10,000.00");
		cy.get_read_only('grand_total').should('contain', "₹ 1,10,000.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 1,10,000.00");

		cy.click_listview_primary_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'Unpaid');
	});
});
