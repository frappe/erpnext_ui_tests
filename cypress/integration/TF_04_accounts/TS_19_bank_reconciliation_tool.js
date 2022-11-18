context('Semi-automatic Bank Reconciliation via Bank Reconciliation Tool', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Create bank account head, bank account and bank masters for clearance', () => {
		// Creating account head of type bank
		cy.insert_doc(
			"Account",
			{
				account_name: "ICICI Bank", // name
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
		cy.set_input('bank_name', 'ICICI');
		cy.save();

		// Creating Bank account for the bank created
		cy.new_doc('Bank Account');
		cy.get_field('is_company_account', 'checkbox').check();
		cy.set_input('account_name', 'ICICI Savings');
		cy.set_link('account', 'ICICI Bank - WP');   // name
		cy.set_link('bank', 'ICICI');
		cy.save();
	});

	it('Create JE and PE transactions', () => {

		//Creating JE of type Bank Entry and ref no as Ref-11
		cy.new_doc('Journal Entry');

		cy.set_select('voucher_type', 'Bank Entry');
		cy.get_select('naming_series').should('contain', 'ACC-JV-.YYYY.-');
		cy.get_input('company').should('not.have.value', '');
		cy.get_input('posting_date').should('not.have.value', '');

		cy.grid_delete_all();
		cy.grid_add_row('accounts');
		cy.set_link('accounts.account', 'Entertainment Expenses');
		cy.set_input('accounts.debit_in_account_currency', '5000');
		cy.grid_add_row('accounts');
		cy.set_link('accounts.account', 'ICICI Bank -');
		cy.set_input('accounts.credit_in_account_currency', '5000');
		//Adding bank account details in grid
		cy.grid_open_row('accounts', 2);
		cy.set_link('bank_account', 'ICICI Savings -');  // name
		cy.close_grid_edit_modal();
		cy.set_input('cheque_no', 'Ref-11');
		cy.set_today('cheque_date');
		cy.save();
		cy.submit_doc("Bank Entry");


		// Create PE having bank account linked to it, ref no saved as Ref-22
		cy.new_doc('Payment Entry');
		cy.url().should('include', '/app/payment-entry/new-payment-entry');

		cy.get_select('naming_series').should('have.value', 'ACC-PAY-.YYYY.-');
		cy.get_select('payment_type').should('have.value', 'Receive');
		cy.get_input('posting_date').should('not.have.value', 0);

		cy.set_link('party_type', 'Customer');
		cy.set_link('party', 'William Harris');
		cy.get_input('party_name').should('have.value', 'William Harris');
		cy.set_link('bank_account', 'ICICI Savings -');    // bank account name

		cy.set_input('paid_amount', '2500');
		cy.set_input('reference_no', 'Ref-22');
		cy.set_today('reference_date');

		cy.save();
		cy.get_page_title().should('contain', 'Draft');
		cy.submit_doc('Submitted');
	});

	it('Create JE and PE bank transactions and other bank transaction with no entry in ERPNext', () => {
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

		// Bank transaction with withdrawal amount for created JE with ref no Ref - 11
		cy.insert_doc(
			"Bank Transaction",
			{
				naming_series: "ACC-BTN-.YYYY.-",
				date: date,
				status: "Pending",
				bank_account: "ICICI Savings - ICICI",  // Name
				deposit: 0,
				withdrawal: 5000,
				reference_number: "Ref-11",
				allocated_amount: 0,
				unallocated_amount: 5000,
			},
			true
		).then((c)=>{
			console.log(c);
			cy.visit('/app/bank-transaction/'+ c.name);
			cy.submit_doc('Unreconciled');
		});

		// Bank transaction with deposit amount for created PE with ref no Ref - 22
		cy.insert_doc(
			"Bank Transaction",
			{
				naming_series: "ACC-BTN-.YYYY.-",
				date: date,
				status: "Pending",
				bank_account: "ICICI Savings - ICICI",  // Name
				deposit: 2500,
				withdrawal: 0,
				reference_number: "Ref-22",
				allocated_amount: 0,
				unallocated_amount: 2500,
			},
			true
		).then((c)=>{
			console.log(c);
			cy.visit('/app/bank-transaction/'+ c.name);
			cy.submit_doc('Unreconciled');
		});

		// Bank transaction with withdrawal amount with ref no Ref - 33 not having any entry in system
		cy.insert_doc(
			"Bank Transaction",
			{
				naming_series: "ACC-BTN-.YYYY.-",
				date: date,
				status: "Pending",
				bank_account: "ICICI Savings - ICICI",  // Name
				deposit: 0,
				withdrawal: 3000,
				reference_number: "Ref-33",
				allocated_amount: 0,
				unallocated_amount: 3000,
			},
			true
		).then((c)=>{
			console.log(c);
			cy.visit('/app/bank-transaction/'+ c.name);
			cy.submit_doc('Unreconciled');
		});

		// Bank transaction with deposit amount with ref no Ref - 44 not having any entry in system
		cy.insert_doc(
			"Bank Transaction",
			{
				naming_series: "ACC-BTN-.YYYY.-",
				date: date,
				status: "Pending",
				bank_account: "ICICI Savings - ICICI",  // Name
				deposit: 4000,
				withdrawal: 0,
				reference_number: "Ref-44",
				allocated_amount: 0,
				unallocated_amount: 4000,
			},
			true
		).then((c)=>{
			console.log(c);
			cy.visit('/app/bank-transaction/'+ c.name);
			cy.submit_doc('Unreconciled');
		});
	});

	it('Create transaction', () => {
		cy.visit('/app/bank-reconciliation-tool/Bank%20Reconciliation%20Tool');
		cy.set_link('company', 'Wind Power LLC');
		cy.set_link('bank_account', 'ICICI Savings - ');   // name
		cy.save();
		cy.set_today('bank_statement_from_date');
		cy.set_today('bank_statement_to_date');
		//cy.save();
		cy.get_input('bank_statement_closing_balance').scrollIntoView().should('be.visible');
		cy.get_input('bank_statement_closing_balance').click();
		let x = Math.floor((Math.random() * 10000) + 1);
		cy.set_input('bank_statement_closing_balance', x);
		//cy.set_input('bank_statement_closing_balance', '1500');
		cy.save();
		cy.wait(500);

		cy.click_grid_action_button('reconciliation_tool_dt', 1);
		cy.get_select('action').should('contain','Match Against Voucher');
		cy.get_input('payment_entry', 'checkbox').should('be.checked');
		cy.click_grid_checkbox('payment_proposals', 0);
		cy.click_modal_primary_button('Submit');
		cy.click_modal_close_button();
		cy.on('window:alert',  (str) =>  {
			expect(str).to.equal(/Bank Transaction ACC-.+ Matched/)});

		cy.set_input('bank_statement_closing_balance', '1000');
		cy.save();

		cy.click_grid_action_button('reconciliation_tool_dt', 0);
		cy.set_select('action','Match Against Voucher');
		cy.get_field('payment_entry', 'Check').check();
		cy.get_field('journal_entry', 'Check').check();
		cy.click_grid_checkbox('payment_proposals', 0);
		cy.click_modal_primary_button('Submit');
		cy.click_modal_close_button();
		cy.on('window:alert',  (str) =>  {
			expect(str).to.equal(/Bank Transaction ACC-.+ Matched/)});

		cy.wait(500);
		cy.set_input('bank_statement_closing_balance', '2000');
		cy.save();

		cy.click_grid_action_button('reconciliation_tool_dt', 1);
		cy.set_select('action', 'Create Voucher');
		cy.set_select('document_type', 'Journal Entry');
		cy.set_select('journal_entry_type', 'Journal Entry');
		cy.set_link('second_account', 'Cash - ');
		cy.click_modal_primary_button('Submit');
		cy.click_modal_close_button();
		cy.on('window:alert',  (str) =>  {
			expect(str).to.equal(/Bank Transaction ACC-.+ added as /)});

		cy.set_input('bank_statement_closing_balance', '1500');
		cy.save();

		cy.click_grid_action_button('reconciliation_tool_dt', 2);
		cy.get_select('action').scrollIntoView().should('be.visible').focus();
		cy.set_select('action', 'Create Voucher');
		cy.set_select('document_type', 'Payment Entry');
		cy.set_link('party_type', 'Customer');
		cy.set_link('party', 'William Harris');
		cy.click_modal_primary_button('Submit');
		cy.click_modal_close_button();
		cy.on('window:alert',  (str) =>  {
			expect(str).to.equal(/Bank Transaction ACC-.+ added as /)});
	});
});
