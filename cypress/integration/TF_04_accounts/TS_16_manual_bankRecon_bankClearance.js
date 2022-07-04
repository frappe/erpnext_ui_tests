context('Manual Bank Reconciliation via Bank Clearance', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Create bank account head, bank account and bank masters for clearance', () => {
		// Creating account head of type bank
		cy.insert_doc(
			"Account",
			{
				account_name: "Kotak Mahindra", // name
				is_group: 0,
				root_type: "Asset",
				report_type: "Balance Sheet",
				account_currency: "INR",
				parent_account: "Bank Accounts - WP", // - WP
				account_type: "Bank",
			},
			true
		)

		// Creating Bank master
		cy.new_doc('Bank');
		cy.set_input('bank_name', 'Kotak Mahindra');
		cy.save();

		// Creating Bank account for the bank created
		cy.new_doc('Bank Account');
		cy.get_field('is_company_account', 'checkbox').check();
		cy.set_input('account_name', 'Kotak Mahindra 123');
		cy.set_link('account', 'Kotak Mahindra - WP');   // name
		cy.set_link('bank', 'Kotak Mahindra');
		cy.save();

	});

	it('Create payment entry for clearance and check Bank Recon Statement', () => {
		cy.new_doc('Payment Entry');
		cy.url().should('include', '/app/payment-entry/new-payment-entry');

		cy.get_select('naming_series').should('have.value', 'ACC-PAY-.YYYY.-');
		cy.get_select('payment_type').should('have.value', 'Receive');
		cy.get_input('posting_date').should('not.have.value', 0);

		cy.set_link('party_type', 'Customer');
		cy.set_link('party', 'William Harris');
		cy.get_input('party_name').should('have.value', 'William Harris');
		cy.set_link('bank_account', 'Kotak Mahindra 123');

		cy.set_input('paid_amount', '15000');
		cy.set_input('reference_no', 'Ref-1');
		cy.set_today('reference_date');

		cy.save();
		cy.get_page_title().should('contain', 'Draft');
		cy.submit('Submitted');

		//Checking Bank Reconciliation Statement
		cy.set_input_awesomebar(' Bank Reconciliation Statement');
		cy.location('pathname').should('include', '/app/query-report/Bank%20Reconciliation%20Statement');
		cy.get_input('company').should('not.have.value', 0);

		cy.get_input('account').clear();
		cy.get_input('account').type('Kotak Mahindra - WP');
		cy.get_input('account').blur();
		//cy.set_link('account', 'Kotak Mahindra');
		cy.get('.dt-row-0 > .dt-cell--col-2 > .dt-cell__content').should('contain', 'Payment Entry');
		cy.get('.dt-row-0 > .dt-cell--col-4 > .dt-cell__content > div').should('contain', '₹ 15,000.00');
	});

	it('Manually reconciling PE via bank clearance', () => {
		cy.set_input_awesomebar(' Bank Clearance');
		cy.set_link('account', 'Kotak Mahindra');
		cy.get_input('from_date').should('not.have.value', 0);
		cy.get_input('to_date').should('not.have.value', 0);
		cy.set_link('bank_account', 'Kotak Mahindra 123 -');
		cy.findByRole('button', {name: 'Get Payment Entries'}).click();

		cy.get_input('payment_entries.amount').should('have.value', "₹ 15,000.00 Dr");
		cy.get_input('cheque_number').should('have.value', "Ref-1");
		cy.set_today('clearance_date');
		cy.findByRole('button', {name: 'Update Clearance Date'}).click();
		cy.get('.msgprint').should('contain', 'Clearance Date updated');
		cy.hide_dialog();
	});
});
