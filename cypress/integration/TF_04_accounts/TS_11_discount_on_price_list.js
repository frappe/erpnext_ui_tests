context('Discount Check on Price List Rate', () => {
	before(() => {
		cy.login();
	});

	it('Discount on price list rate applied as percentage', () => {
		cy.new_doc('Sales Order');
		cy.location('pathname').should('include', '/app/sales-order/new-sales-order');

		cy.get_select('naming_series').should('have.value', 'SAL-ORD-.YYYY.-');
		cy.get_input('company').should('not.have.value', 0);
		cy.get_input('transaction_date').should('not.have.value', 0);
		cy.wait(500);
		cy.get_input('customer').click();
		cy.set_link('customer', 'William Harris');
		cy.get_select('order_type').should('have.value', 'Sales');
		cy.set_today('delivery_date');

		cy.click_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('selling_price_list').should('have.value', 'Standard Selling');

		cy.set_link('items.item_code', 'Apple iPhone 13 Pro Max');
		cy.get_input('delivery_date').should('not.have.value', 0);
		cy.get_input('qty').should('have.value', "1.000");
		cy.get_input('rate').should('have.value', "1,10,000.00");
		cy.get_read_only('amount').should('contain', "1,10,000.00");

		cy.grid_open_row('items', 1);
		cy.get_read_only('price_list_rate').should('contain', "1,10,000.00");
		cy.findByText('Discount and Margin').scrollIntoView().should('be.visible');
		cy.click_section('Discount and Margin');
		cy.wait(600);

		cy.findByText('Discount and Margin').click({force: true});
		cy.open_section('Discount and Margin');
		cy.wait(600);
		cy.get_input('discount_percentage').click();
		cy.wait(500);
		cy.open_section('Discount and Margin');
		cy.set_input('discount_percentage', 5);
		cy.get_input('discount_percentage').blur();

		cy.findByText('Discount and Margin').click({force: true});
		cy.open_section('Discount and Margin');
		cy.get_input('discount_amount').should('have.value', "5,500.00");
		cy.close_grid_edit_modal();

		cy.get_read_only('total_qty').should('contain', "1");
		cy.get_read_only('total').should('contain', "₹ 1,04,500.00");
		cy.get_read_only('grand_total').should('contain', "₹ 1,04,500.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 1,04,500.00");

		cy.click_toolbar_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'To Deliver and Bill');
	});

	it('Discount on price list rate applied as amount', () => {
	});
});
