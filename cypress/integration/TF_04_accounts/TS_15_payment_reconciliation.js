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
				naming_series: "ACC-PAY-.YYYY.-",
				payment_type: "Receive",
				posting_date: date,
				party_type: "Customer",
				party: "Jennifer Robinson",
				party_name: "Jennifer Robinson",
				paid_from: "Debtors - WP",  // name
				paid_from_account_type: "Receivable",
				paid_from_account_currency: "INR",
				paid_to: "Cash - WP",  // name
				paid_to_account_currency: "INR",
				paid_amount: 40000,
				received_amount: 40000,
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
					naming_series: "ACC-SINV-.YYYY.-",
					posting_date: date,
					customer: "Jennifer Robinson",
					due_date: date,
					items: [{item_code: "Apple iPhone 13 Pro Max", qty: 1, rate: 110000, amount: 110000}]  // name
				},
				true
			).then((SI)=>{
				cy.visit('app/sales-invoice/'+ SI.name);
				cy.submit('Unpaid');

				cy.wait(200);
				// Opening Payment Reconciliation tool and applying filters to get unreconcilied entries
				cy.set_input_awesomebar(' Payment Reconciliation');
				cy.set_link('party_type', "customer");
				cy.set_link('party', "Jennifer Robinson");
				cy.get_input('receivable_payable_account').should('have.value', 'Debtors - WP');  // NAME

				cy.set_today('from_invoice_date');
				cy.set_today('to_invoice_date');
				cy.set_today('from_payment_date');
				cy.set_today('to_payment_date');
				cy.set_link('bank_cash_account', 'Cash - WP'); // name
				cy.click_toolbar_button('Get Unreconciled Entries');

				cy.click_grid_row_checkbox('invoices', 1);
				cy.click_grid_row_checkbox('payments', 1);

				// Allocating and reconciling invoice and payment
				cy.click_toolbar_button('Allocate');
				cy.get_input('allocation.reference_name').should('have.value', payment.name);
				cy.get_input('allocation.invoice_number').should('have.value', SI.name);
				cy.get_input('allocation.allocated_amount').should('have.value', '40,000.00');

				cy.click_toolbar_button('Reconcile');
				cy.get_open_dialog().should('contain', 'Message');
				cy.get('.msgprint').invoke('text').should('match', /Successfully Reconciled/);

				// Validating sales invoice outstanding amount after reconiling
				cy.visit('app/sales-invoice/'+ SI.name);
				cy.get_page_title().should('contain', 'Partly Paid');
				cy.get_read_only('rounded_total').should('contain', "₹ 1,10,000.00");
				cy.get_read_only('outstanding_amount').should('contain', "₹ 70,000.00");
			});
		});
	});
});
