context('Create Purchase Order', () => {
	before(() => {
		cy.login();
	});

	it('Create Purchase Order', () => {
		var today = new Date();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1; // Months start at 0!
		let dd = today.getDate();
		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
		var today = dd + '-' + mm + '-' + yyyy;

		cy.new_doc('Purchase Order');
		cy.url().should('include', '/app/purchase-order/new-purchase-order');

		cy.get_select('naming_series').should('have.value', 'PUR-ORD-.YYYY.-');
		cy.set_link('supplier', 'Lisa Davis');
		cy.get_input('supplier').should('have.value', 'Lisa Davis');
		cy.get_input('transaction_date').should('have.value', today);
		cy.set_today('schedule_date');

		cy.click_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('buying_price_list').should('have.value', 'Standard Buying');

		cy.set_link('items.item_code', 'Apple iPhone 13 Pro Max');
		cy.get_input('items.schedule_date').should('have.value', today);
		cy.get_input('qty').should('have.value', "1.000");
		cy.get_input('uom').should('have.value', "Nos");
		cy.set_input('rate', '110000');
		cy.get_input('rate').blur();
		cy.get_read_only('amount').should('contain', "1,10,000");

		cy.get_read_only('total_qty').should('contain', "1");
		cy.get_read_only('total').should('contain', "₹ 1,10,000.00");
		cy.get_read_only('grand_total').should('contain', "₹ 1,10,000.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 1,10,000.00");

		cy.click_toolbar_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		//cy.submit_doc('To Receive and Bill');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'To Receive and Bill');
	});
});
