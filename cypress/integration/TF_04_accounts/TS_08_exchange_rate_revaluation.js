context('Exchange Rate Creation Check', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Create other currency bank account and unrealized exchange gain/loss account, and set in company', () => {
		cy.insert_doc(
			"Account",
			{
				account_name: "Bank of America", //change name
				is_group: 0,
				root_type: "Asset",
				report_type: "Balance Sheet",
				account_currency: "USD",
				parent_account: "Bank Accounts - WP", // - WP
				account_type: "Bank",
			},
			true
		)

		cy.insert_doc(
			"Account",
			{
				account_name: "Unrealized Exchange Gain/Loss", //change name
				is_group: 0,
				root_type: "Expense",
				report_type: "Profit and Loss",
				account_currency: "INR",
				parent_account: "Indirect Expenses - WP", // - WP
				account_type: "Expense Account",
			},
			true
		)

		cy.visit('/app/company');
		cy.click_listview_row_item(0);
		cy.set_link('unrealized_exchange_gain_loss_account', 'Unrealized Exchange Gain/Loss');
		cy.save();
	});

	it('Create Internal transfer payment entry from Cash to USD bank', () => {
		cy.new_doc("Payment Entry");
		cy.url().should('include', '/app/payment-entry/new-payment-entry');
		cy.get_select('naming_series').should('have.value', 'ACC-PAY-.YYYY.-');
		cy.set_select('payment_type', 'Internal Transfer');
		cy.set_link('paid_from', 'Cash - ');
		cy.set_link('paid_to', 'Bank of America ');
		cy.wait(600);

		cy.get_input('received_amount').click();
		cy.get_input('received_amount').clear();
		cy.set_input('received_amount', '500');
		cy.get_input('paid_amount').click();
		cy.get_input('target_exchange_rate')
 			.invoke('val')
			.then(val => {
				const exRate = val;
				cy.log(exRate);
				const paid = (500 * exRate);
				cy.set_input('paid_amount', paid);
			});

		cy.set_input('reference_no', 'A-111');
		cy.click_section('Accounting Dimension');
		cy.click_section('More Information');
		cy.get_input('reference_date').click();
		cy.get_read_only('status').should('contain', 'Draft');
		cy.set_today('reference_date');

		cy.save();
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'Submitted');
	});

	it('Create a currency exchange rate record', () => {
		cy.new_doc("Currency Exchange");
		cy.set_today('date');
		cy.set_link('from_currency', 'USD');
		cy.set_link('to_currency', 'INR');
		cy.set_input('exchange_rate', '80');
		cy.get_input('for_buying', 'checkbox').should('be.checked');
		cy.get_input('for_selling', 'checkbox').should('be.checked');
		cy.save();
	});

	it('Create an Exchange Rate Revaluation record', () => {
		cy.new_doc("Exchange Rate Revaluation");
		cy.set_today('posting_date');
		cy.findByRole('button', {name: 'Get Entries'}).click();

		cy.get_table_field('accounts', 1, 'account', 'Link').contains('Bank of America');
		cy.get_input('accounts.new_exchange_rate').should('have.value', '80');
		cy.get_input('gain_loss')
 			.invoke('val')
			.then(val => {
				const gain_loss = val;
				cy.log(gain_loss);

				cy.save();
				cy.click_toolbar_button('Submit');
				cy.click_modal_primary_button('Yes');
				//cy.hide_dialog();
				cy.get_page_title().should('contain', 'Submitted');

				cy.click_dropdown_action('Create', 'Journal Entry');
				cy.get_select('voucher_type').should('have.value', 'Exchange Rate Revaluation');

				cy.grid_open_row('accounts', 1);
				cy.get_input('debit_in_account_currency')
 					.invoke('val')
					.then(val => {
						const debit = val;
						cy.log(debit);
						cy.close_grid_edit_modal();
						cy.grid_open_row('accounts', 2);
						cy.get_input('credit_in_account_currency').should('have.value', debit);
						cy.close_grid_edit_modal();
					});
				cy.grid_open_row('accounts', 3);
				cy.get_input('credit_in_account_currency').should('have.value', gain_loss);
				cy.log(gain_loss);
				cy.close_grid_edit_modal();

				cy.get_read_only('total_debit')
					.invoke('text')
					.then(text => {
						const debit_in_base = text.split(' ').pop();
						cy.log(debit_in_base);

						cy.get_read_only('total_credit')
							.invoke('text')
							.then(text => {
								const credit_in_base = text.split(' ').pop();
								cy.log(credit_in_base);
								if (debit_in_base == credit_in_base){
									cy.log('success');
								} else {
									cy.findByRole('button', {name: 'Make Difference Entry'}).click();
									cy.set_link('accounts.account', 'Unrealized Exchange Gain/Loss');
								}

							cy.click_toolbar_button('Save');
							cy.get_page_title().should('contain', 'Draft');
							cy.wait(500);

							cy.visit('/app/journal-entry');
							cy.click_listview_row_item(0);

							cy.click_toolbar_button('Submit');
							cy.click_modal_primary_button('Yes');
							//cy.hide_dialog();
							cy.get_page_title().should('contain', 'Exchange Rate Revaluation');

							cy.click_dropdown_action('View', 'Ledger');
							cy.get('.dt-row-4 > .dt-cell--col-4 > .dt-cell__content > div').should('contain', gain_loss);
						});
					});
			});
	});
	it('Deletion of created currency exchange rate', () => {
		cy.visit('app/currency-exchange');
		cy.clear_filter();
		cy.click_listview_checkbox(0);
		cy.click_dropdown_action('Actions', 'Delete');
		cy.click_modal_primary_button('Yes');
	});
});
