context('Payment Reconciliation', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Create customer which do not have any other transaction', () => {

		// Creating customer which do not have any other transactions
		cy.insert_doc(
			"Customer",
			{
				customer_name: "Jennifer Robinson",
				customer_group: "All Customer Groups",
				territory: "All Territories",
				default_currency: "INR",
				default_price_list: "Standard Selling",
			},
			true
		)
	});

	it('Create transactions and check Payment reconciliation tool', () => {
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

		// Creating a payment entry of type 'Receive' for this customer
		cy.insert_doc(
			"Payment Entry",
			{
				"naming_series": "ACC-PAY-.YYYY.-",
				"payment_type": "Receive",
				"posting_date": date,
				"party_type": "Customer",
				"party": "Jennifer Robinson",
				"party_name": "Jennifer Robinson",
				"paid_from": "Debtors - TQ",  // name
				"paid_from_account_type": "Receivable",
				"paid_from_account_currency": "INR",
				"paid_to": "Cash - TQ",  // name
				"paid_to_account_currency": "INR",
				"paid_amount": 40000,
				"received_amount": 40000,
			},
			true
		).then((payment)=>{
			console.log(payment);
			cy.visit('app/payment-entry/'+ payment.name);
			cy.submit('Submitted');

			// Creating a sales invoice for this customer
			cy.insert_doc(
				"Sales Invoice",
				{
					naming_series: "SINV-.YY.-",
					posting_date: date,
					customer: "Jennifer Robinson",
					due_date: date,
					items: [{item_code: "Apple iPhone 13 Pro Max1", qty: 1, rate: 110000, amount: 110000}]  // name
				},
				true
			).then((SI)=>{
				cy.visit('app/sales-invoice/'+ SI.name);
				cy.submit('Unpaid');

				cy.wait(200);
				cy.set_input_awesomebar(' Payment Reconciliation');
				cy.set_link('party_type', "customer");
				cy.set_link('party', "Jennifer Robinson");
				cy.get_input('receivable_payable_account').should('have.value', 'Debtors - TQ');

				cy.set_today('from_invoice_date');
				cy.set_today('to_invoice_date');
				cy.set_today('from_payment_date');
				cy.set_today('to_payment_date');
				cy.set_link('bank_cash_account', 'Cash - TQ');
				cy.click_toolbar_button('Get Unreconciled Entries');

				cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > .frappe-control > .form-grid > .grid-body > .rows > .grid-row > .data-row > .row-check > .grid-row-check').click();
				cy.get(':nth-child(2) > form > .frappe-control > .form-grid > .grid-body > .rows > .grid-row > .data-row > .row-check > .grid-row-check').click();
				//cy.click_listview_row_item(0);
				//cy.select_listview_row_checkbox(0);
				//cy.click_listview_checkbox(0);

				cy.click_toolbar_button('Allocate');
				cy.get_input('allocation.reference_name').should('have.value', payment.name);
				cy.get_input('allocation.invoice_number').should('have.value', SI.name);
				cy.get_input('allocation.allocated_amount').should('have.value', '40,000.00');

				cy.click_toolbar_button('Reconcile');
				cy.get_open_dialog().should('contain', 'Message');
				cy.get('.msgprint').invoke('text').should('match', /Successfully Reconciled/);
			});
		});
	});
});
