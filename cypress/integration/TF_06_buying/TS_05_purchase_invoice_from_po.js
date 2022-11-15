context('Purchase Invoice from Purchase Order', () => {
	before(() => {
		cy.login();
	});

	it('Create Purchase Invoice from Purchase Order', () => {
		cy.visit('app/purchase-order');
		cy.click_listview_row_item(0);
		cy.get_page_title().should('contain', 'To Receive and Bill');
		cy.click_dropdown_action('Create', 'Purchase Invoice');

		cy.url().should('include', '/app/purchase-invoice/new-purchase-invoice');

		cy.get_select('naming_series').should('have.value', 'PINV-.YY.-');
		cy.get_input('supplier').should('have.value', 'Lisa Davis');
		cy.get_field('set_posting_time', 'Check').check();
		cy.get_input('posting_date').should('not.have.value', 0);
		cy.get_input('due_date').should('not.have.value', 0);

		cy.open_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('buying_price_list').should('have.value', 'Standard Buying');

		cy.get_input('items.item_code').should('have.value', 'Apple Macbook Pro 16 inch');
		cy.get_input('qty').should('have.value', "1.000");
		cy.get_input('rate').should('have.value', "2,50,000.00");
		cy.get_read_only('amount').should('contain', "2,50,000.00");

		cy.get_read_only('total_qty').should('contain', "1");
		cy.get_read_only('total').should('contain', "₹ 2,50,000.00");
		cy.get_read_only('grand_total').should('contain', "₹ 2,50,000.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 2,50,000.00");

		cy.save();
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'Unpaid');

		cy.visit('app/purchase-order');
		cy.click_listview_row_item(0);
		cy.get_page_title().should('contain', 'To Receive');
	});
});
