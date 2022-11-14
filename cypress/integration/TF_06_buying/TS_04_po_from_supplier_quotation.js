context('Purchase Order from Supplier Quotation', () => {
	before(() => {
		cy.login();
	});

	it('Create Purchase Order from Supplier Quotation', () => {
		cy.visit('app/supplier-quotation');
		cy.click_listview_row_item(0);
		cy.click_dropdown_action('Create', 'Purchase Order');

		cy.url().should('include', '/app/purchase-order/new-purchase-order');

		cy.get_select('naming_series').should('have.value', 'PUR-ORD-.YYYY.-');
		cy.get_input('transaction_date').should('not.have.value', 0);
		cy.get_input('supplier').should('have.value', 'Lisa Davis');
		cy.set_today('schedule_date');

		cy.set_link('set_warehouse', 'Stores - WP');

		cy.get_input('items.item_code').should('have.value', 'Apple Macbook Pro 16 inch');
		cy.get_input('schedule_date').should('not.have.value', 0);
		cy.get_input('qty').should('have.value', "10.000");
		cy.get_input('qty').focus().clear();
		cy.wait(200);
		cy.set_input('qty', '1');
		cy.get_input('qty').blur();
		cy.get_input('uom').should('have.value', "Nos");
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
		cy.get_page_title().should('contain', 'To Receive and Bill');

		cy.visit('app/material-request/');
		cy.click_listview_row_item(0);
		cy.get_page_title().should('contain', 'Partially ordered');
	});
});
