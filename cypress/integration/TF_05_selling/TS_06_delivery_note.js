context('Delivery Note Creation', () => {
	before(() => {
		cy.login();
	});

	it('Create DN via SI', () => {
		var today = new Date();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1; // Months start at 0!
		let dd = today.getDate();
		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
		var today_date = dd + '-' + mm + '-' + yyyy;

		cy.visit('app/sales-invoice');
		cy.click_listview_row_item(0);
		cy.click_dropdown_action('Create', 'Delivery');
		cy.url().should('include', '/app/delivery-note/new-delivery-note');

		cy.get_select('naming_series').should('have.value', 'MAT-DN-.YYYY.-');
		cy.get_input('customer').should('have.value', 'William Harris');
		cy.get_input('posting_date').should('have.value', today_date);

		cy.click_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('selling_price_list').should('have.value', 'Standard Selling');

		//cy.get_table_field('items', 1, 'item_code', 'Link').contains('Apple iPhone 13 Pro Max');
		cy.get_input('items.item_code').should('have.value', 'Apple iPhone 13 Pro Max');
		cy.get_input('qty').should('have.value', "1.000");
		cy.get_input('rate').should('have.value', "1,10,000.00");
		cy.get_read_only('amount').should('contain', "1,10,000.00");

		cy.get_read_only('total_qty').should('contain', "1");
		cy.get_read_only('total').should('contain', "₹ 1,10,000.00");
		cy.get_read_only('grand_total').should('contain', "₹ 1,10,000.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 1,10,000.00");

		cy.save();
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'Completed');
		cy.get_page_title().should('contain', 'William Harris');

		cy.click_dropdown_action('View', 'Stock Ledger');
		cy.get('.dt-cell__content > span > div').should('contain', "-1.000");

		cy.visit('app/sales-order');
		cy.click_listview_row_item(0);
		cy.get_page_title().should('contain', 'Completed');
	});
});
