
context('Quotation Creation', () => {
	before(() => {
		cy.login();
	});

	it('Create Quotation', () => {
		cy.new_doc('Quotation');
		cy.location('pathname').should('include', '/app/quotation/new-quotation');

		var today = new Date();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1; // Months start at 0!
		let dd = today.getDate();
		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
		var todaydate = dd + '-' + mm + '-' + yyyy;

		cy.get_select('naming_series').should('have.value', 'SAL-QTN-.YYYY.-');
		cy.get_input('transaction_date').should('have.value', todaydate);
		cy.get_input('quotation_to').should('have.value', 'Customer');
		//cy.get_input('valid_till').should('have.value', validTill);
		cy.get_input('valid_till').should('not.have.value', 0);
		cy.set_link('party_name', 'William Harris');
		cy.get_select('order_type').should('have.value', 'Sales');
		cy.get_read_only('customer_name').should('contain', 'William Harris');

		cy.open_section('Address and Contact');
		cy.get_read_only('customer_address').should('contain', "William's Address-Billing");
		cy.get_read_only('shipping_address_name').should('contain', "William's Address-Billing");
		cy.get_read_only('territory').should('contain', 'All Territories');

		cy.click_section('Currency and Price List');
		cy.open_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('selling_price_list').should('have.value', 'Standard Selling');

		cy.set_link('items.item_code', 'Apple iPhone 13 Pro Max');
		cy.get_input('qty').should('have.value', "1.000");
		cy.get_input('rate').clear();
		cy.set_input('rate', '110000');
		cy.get_input('rate').blur();
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
