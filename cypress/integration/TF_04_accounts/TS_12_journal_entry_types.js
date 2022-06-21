context("Journal Entry Types", () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it("Bank Entry (Journal Entry)", () => {
		cy.new_doc('Journal Entry');

		//Setting the type as Bank Entry
		cy.set_select('voucher_type', 'Bank Entry');

		//Checking if naming series, posting date etc are not empty
		cy.get_select('naming_series').should('not.be.empty');
		cy.get_select('naming_series').should('contain', 'ACC-JV-.YYYY.-');
		cy.get_input('company').should('not.have.value', '');
		cy.get_input('posting_date').should('not.have.value', '');
		const todaysDate = Cypress.moment().format('DD-MM-YYYY');
		cy.get_input('posting_date').should('have.value', todaysDate);

		//Setting bank account and entertainment expenses in accounting entries table
		cy.scrollTo('top', {ensureScrollable: false});
		cy.grid_delete_all();
		cy.insert_doc(
            "Account",
            {
                account_name: "HDFC", // name
                is_group: 0,
                root_type: "Asset",
                report_type: "Balance Sheet",
                account_currency: "INR",
                parent_account: "Bank Accounts - WP", // - WP
                account_type: "Bank",
            },
            true
        )
		cy.grid_add_row('accounts');
		cy.set_link('accounts.account', 'HDFC');
		cy.set_input('accounts.credit_in_account_currency', '40000');
		cy.grid_add_row('accounts');
		cy.set_link('accounts.account', 'Entertainment Expenses');
		cy.set_input('accounts.debit_in_account_currency', '40000');
		cy.get_input('cheque_no').click({force: true});

		//Verifying if the credit=debit
		cy.get_read_only('total_credit').contains('₹ 40,000.00');
		cy.get_read_only('total_debit').contains('₹ 40,000.00');

		//Checking if "Is Opening" is set to "No"
		cy.click_section('More Information');
		cy.get_select('is_opening').should('contain', 'No');

		//Saving, Submitting and Cancelling the doc
		cy.click_toolbar_button('Save');
		cy.get_open_dialog().should('contain', 'Missing Fields')
			.and('contain', 'Mandatory fields required in Journal Entry');
		cy.get('.msgprint').find('li').should('contain', 'Reference Number')
			.and('contain', 'Reference Date');
		cy.hide_dialog();
		cy.set_input('cheque_no', '12345');
		cy.set_today('cheque_date');
		cy.save();
		cy.submit();
		cy.click_toolbar_button('Cancel');
		cy.click_modal_primary_button('Yes');
	});
});