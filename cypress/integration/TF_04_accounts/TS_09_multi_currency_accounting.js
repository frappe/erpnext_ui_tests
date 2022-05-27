context('Multi Currency Accounting', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Create Account Receivable >> Debtors account in different currency (EUR) in COA and customer with linked debtor account', () => {
		cy.insert_doc(
			"Account",
			{
				account_name: "Debtor-EUR",
				is_group: 0,
				root_type: "Asset",
				report_type: "Balance Sheet",
				account_currency: "EUR",
				parent_account: "Accounts Receivable - WP", // - WP
				account_type: "Receivable",
			},
			true
		)

		cy.insert_doc(
			"Customer",
			{
				customer_name: "Martha Stewart",
				customer_group: "All Customer Groups",
				territory: "All Territories",
				default_currency: "EUR",
				accounts: [{account: "Debtor-EUR - WP",parent: "Martha Stewart"}] // - WP
			},
			true
		)
	});

	it('Multi-currency sales invoice and Payment creation and validation', () => {
		cy.new_doc("Sales Invoice");
		cy.url().should('include', '/app/sales-invoice/new-sales-invoice');
		cy.get_input('posting_date').should('not.be.empty');

		cy.get_select('naming_series').should('have.value', 'SINV-.YY.-');
		cy.wait(800);
		cy.get_input('customer').click();
		cy.set_link('customer', 'Martha Stewart');
		cy.set_today('due_date');

		cy.findByText('Currency and Price List').scrollIntoView().should('be.visible');
		cy.wait(400);
		cy.click_section('Currency and Price List');
		cy.open_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'EUR');
		cy.get_input('selling_price_list').should('have.value', 'Standard Selling');
		cy.get_input('conversion_rate')
 			.invoke('val')
			.then(val => {
				const exRate = val;
				cy.log(exRate);

				const roundedExchRate = Number(exRate).toFixed(2);

				const rate = (110000/exRate);
				const roundedRate = Number(rate).toFixed(2);
				const formattedRate = new Intl.NumberFormat().format(roundedRate);
				cy.log("formatted rate " + formattedRate);
				const rateInCurrency = ('€ '+formattedRate);

				cy.set_link('items.item_code', 'Apple iPhone 13 Pro Max');   // change
				cy.get_input('qty').should('have.value', "1.000");
				cy.get_input('rate').should('have.value', formattedRate);
				cy.get_input('amount').should('have.value', formattedRate);

				const total = (roundedRate * roundedExchRate);
				const roundedTotal = Number(total).toFixed(2);
				const formattedTotal = Intl.NumberFormat('en-IN').format(roundedTotal);
				cy.log("total " + formattedTotal);
				const totalInCurrency = ('₹ '+formattedTotal);

				cy.get_read_only('total_qty').should('contain', "1");
				cy.get_read_only('total').should('contain', rateInCurrency);
				cy.get_read_only('base_total').should('contain', totalInCurrency);

				cy.get_read_only('base_grand_total').should('contain', totalInCurrency);
				cy.get_read_only('grand_total').should('contain', rateInCurrency);
				cy.get_read_only('base_rounded_total').should('contain', totalInCurrency);
				cy.get_read_only('rounded_total').should('contain', rateInCurrency);

				cy.click_section('Write Off');

				cy.findByText('Accounting Details').scrollIntoView().should('be.visible');
				cy.wait(400);
				cy.click_section('Accounting Details');
				cy.open_section('Accounting Details');
				cy.get_input('debit_to').should('have.value', "Debtor-EUR - WP");  // - name change

				cy.click_listview_primary_button('Save');
				cy.get_page_title().should('contain', 'Draft');
				cy.click_toolbar_button('Submit');
				cy.click_modal_primary_button('Yes');
				cy.get_page_title().should('contain', 'Unpaid');

				cy.visit('app/sales-invoice');
				cy.wait(400);
				cy.click_listview_row_item(0);

				cy.click_dropdown_action('View', 'Accounting Ledger');
				cy.get('.dt-row-header > .dt-cell--col-3 > .dt-cell__content').should('contain', "Debit (INR)");
				cy.get('.dt-row-4 > .dt-cell--col-3 > .dt-cell__content > div').should('contain', formattedTotal);

				cy.get('[data-original-title="Account"] > .multiselect-list > .cursor-pointer > .status-text > .text-extra-muted').click();
				cy.get('[data-original-title="Account"] > .multiselect-list > .dropdown-menu > .dropdown-input-wrapper > .form-control').type('Debtor-EUR - WP', {delay: 200});   // - change name
				cy.get('[data-value="Debtor-EUR%20-%20WP"]').click();  // - change name

				cy.get('.dt-row-header > .dt-cell--col-3 > .dt-cell__content').should('contain', "Debit (EUR)");
				const debit = (formattedRate+'0');
				cy.get('.dt-row-3 > .dt-cell--col-3 > .dt-cell__content').should('contain', debit);

				cy.visit('/app/query-report/Accounts%20Receivable');
				cy.get('[data-original-title="Posting Date"] > .input-with-feedback').click();
				cy.findByText('Today').click();
				cy.get('[data-original-title="Customer"] > .link-field > .awesomplete > .input-with-feedback').click().type('Martha Stewart', {delay: 200});
				cy.wait(500);
				cy.get('[data-original-title="Ageing Range 1"] > .input-with-feedback').click().should('have.value', "30");
				// cy.get('.legend-dataset-value').should('contain', roundedRate); - need to check this via customr command

				cy.visit('app/sales-invoice');
				cy.click_listview_row_item(0);
				cy.get_page_title().should('contain', 'Unpaid');
				cy.click_dropdown_action('Create', 'Payment');
				cy.url().should('include', '/app/payment-entry/new-payment-entry');

				cy.get_select('naming_series').should('have.value', 'ACC-PAY-.YYYY.-');
				cy.get_select('payment_type').should('have.value', 'Receive');

				cy.get_input('party_type').should('have.value', 'Customer');
				cy.get_input('party').should('have.value', 'Martha Stewart');

				cy.get_input('paid_amount').should('have.value', formattedRate);
				cy.get_input('received_amount').should('have.value', formattedTotal);

				cy.get_input('references.reference_doctype').should('have.value', 'Sales Invoice');

				cy.get_read_only('total_allocated_amount').should('contain', rateInCurrency);
				cy.get_read_only('base_total_allocated_amount').should('contain', totalInCurrency);

				cy.set_input('reference_no', 'AB-01');
				cy.set_today('reference_date');

				cy.save();
				cy.get_page_title().should('contain', 'Draft');
				cy.submit('Submitted');

				cy.click_toolbar_button('Ledger');
				cy.get('.dt-row-header > .dt-cell--col-4 > .dt-cell__content').should('contain', "Credit (INR)");
				const credit = (formattedTotal+'0');
				cy.get('.dt-row-9 > .dt-cell--col-4 > .dt-cell__content').should('contain', credit);
			});
	});
});
