context('Advance Payment Check', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it.only('Create sales order and advance payment from it', () => {
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		cy.log(date);

		cy.insert_doc(
			"Sales Order",
				{
					naming_series: 'SAL-ORD-.YYYY.-',
					transaction_date: date,
					delivery_date: date,
					customer: 'William Harris',
					order_type: 'Sales',
					items: [{item_code: 'Apple iPhone 13 Pro Max', delivery_date: date, qty: 1, rate: 110000}]
				}, // name change
			true
		).then((c)=>{
			console.log(c);
			cy.visit('app/sales-order/'+ c.name);
			cy.submit('To Deliver and Bill');

			cy.visit('app/sales-order');
			cy.click_listview_row_item(0);
			//cy.click_toolbar_button('Create');
			cy.click_dropdown_option('Create', 'Payment');
			cy.url().should('include', '/app/payment-entry/new-payment-entry');

			cy.get_select('naming_series').should('have.value', 'ACC-PAY-.YYYY.-');
			cy.get_select('payment_type').should('have.value', 'Receive');
			cy.get_input('posting_date').should('not.have.value', 0);

			cy.get_input('party_type').should('have.value', 'Customer');
			cy.get_input('party').should('have.value', 'William Harris');
			cy.get_input('paid_amount').should('have.value', '1,10,000.00');

			cy.get_input('paid_amount').click().clear();
			cy.set_input('paid_amount', '20000');
			cy.get_input('references.reference_doctype').should('have.value', 'Sales Order');
			cy.get_input('reference_name').should('have.value', c.name);
			cy.get_input('allocated_amount').should('have.value', '20,000.000');

			cy.get_read_only('difference_amount')
			.invoke('text')
			.then(text => {
				const diff_amount = text.split(' ').pop();
				cy.log(diff_amount);
				if (diff_amount == 0){
					cy.log('success');
				} else {
					cy.findByRole('button', {name: 'Set Exchange Gain / Loss'}).click();
				}
			});

			cy.set_input('reference_no', 'Ref-15');
			cy.set_today('reference_date');

			cy.click_toolbar_button('Save');
			cy.get_page_title().should('contain', 'Draft');
			cy.click_toolbar_button('Submit');
			cy.click_modal_primary_button('Yes');
			cy.get_page_title().should('contain', 'Submitted');
		});
	});

	it('Create sales invoice for advance paid order', () => {
		cy.visit('app/sales-order');
		cy.click_listview_row_item(0);
		cy.get_read_only('rounded_total').should('contain', "₹ 1,10,000.00");
		cy.get_read_only('advance_paid').should('contain', "₹ 20,000.00");

		cy.click_dropdown_action('Create', 'Sales Invoice');
		cy.url().should('include', '/app/sales-invoice/new-sales-invoice');

		cy.get_select('naming_series').should('have.value', 'SINV-.YY.-');
		cy.get_input('customer').should('have.value', 'William Harris');
		cy.get_input('posting_date').should('not.have.value', 0);
		cy.get_input('due_date').should('not.have.value', 0);

		cy.get_input('items.item_code').should('have.value', 'Apple iPhone 13 Pro Max'); // name
		cy.get_input('qty').should('have.value', "1.000");
		cy.get_input('rate').should('have.value', "1,10,000.00");
		cy.get_read_only('amount').should('contain', "1,10,000.00");
		cy.wait(500);

		cy.get_section('Write Off');
		cy.findByText('Advance Payments').scrollIntoView().should('be.visible');
		cy.get_section('Advance Payments');
		cy.open_section('Advance Payments');
		cy.findByRole('button', {name: 'Get Advances Received'}).click();

		cy.get_input('advances.allocated_amount').should('have.value', '20,000.00'); // name

		cy.click_listview_primary_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'Partly Paid');

		cy.get_read_only('rounded_total').should('contain', "₹ 1,10,000.00");
		cy.get_read_only('total_advance').should('contain', "₹ 20,000.00");
		cy.get_read_only('outstanding_amount').should('contain', "₹ 90,000.00");
	});
});
