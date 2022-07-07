context('Accounts Receivable', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	const todaysDate = Cypress.moment().format('DD-MM-YYYY');

	it('Verifying Accounts Receivable report', () => {
		//Creating a new Customer
		cy.insert_doc(
			"Customer",
			{
				customer_name: "Jacob Williams",
				customer_group: "All Customer Groups",
				territory: "All Territories",
				default_currency: "INR",
				default_price_list: "Standard Selling",
			},
			true
		)

		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

		//Creating a sales invoice against the customer
		cy.insert_doc(
			"Sales Invoice",
			{
					naming_series: "SINV-.YY.-",
					posting_date: date,
					customer: "Jacob Williams",
					due_date: date,
					items: [{"item_code": "Apple iPhone 13 Pro Max", "qty": 1, "rate": 110000, "amount": 110000}]
			},
			true
		).then((a)=>{
			console.log(a);
			cy.visit('app/sales-invoice/'+ a.name);
			cy.submit('Unpaid');

			cy.visit('/app/query-report/Accounts%20Receivable');
			cy.location('pathname').should('eq', '/app/query-report/Accounts%20Receivable');

			//Checking if the accounts receivable report have customer filter
			cy.get_input('customer').should('be.visible');
			cy.set_link('customer', 'Jacob Williams');

			//Checking the headers and the values in the report
			cy.get_report_header().should('contain', 'Customer')
				.and('contain', 'Receivable Account')
				.and('contain', 'Voucher Type')
				.and('contain', 'Voucher No')
				.and('contain', 'Invoiced Amount')
				.and('contain','Outstanding Amount')
				.and('contain','Territory')
				.and('contain','Customer Group');
			cy.get_report_cell().should('contain', 'Jacob Williams')
				.and('contain', 'Sales Invoice')
				.and('contain', 'Debtors - WP')
				.and('contain', '₹ 1,10,000.00')
				.and('contain', todaysDate);

			//Creating a payment entry against the sales invoice
			cy.visit('app/sales-invoice/'+ a.name);
			cy.click_dropdown_action('Create', 'Payment');
			cy.set_input('reference_no', 'ABC-1234');
			cy.set_today('reference_date');
			cy.save();
			cy.submit();

			//Checking that the report should not contain the customer entry as payment has been done
			cy.visit('/app/query-report/Accounts%20Receivable');
			cy.get_report_cell().should('not.have.value', a.name);
		});
	});

	it('Checking for basic filters, Add Column and Edit functionality', () => {
		//Checking for basic filters like company, date, ageing are present
		cy.visit('/app/query-report/Accounts%20Receivable');
		cy.get_input('company').should('not.be.empty');
		cy.get_input('report_date').should('not.be.empty');
		cy.get_input('report_date').should('have.value', todaysDate);
		cy.get_select('ageing_based_on').should('not.be.empty')
			.and('contain', 'Posting Date');
		cy.get_input('range1').should('have.value', '30');
		cy.get_input('range2').should('have.value', '60');
		cy.get_input('range3').should('have.value', '90');
		cy.get_input('range4').should('have.value', '120');

		//Checking for Add Column functionality
		cy.click_menu_button();
		cy.get('.menu-item-label[data-label="Add%20Column"]').click({force: true});
		cy.set_select('doctype', 'Account');
		cy.set_select('field', 'Account Type');
		cy.set_select('insert_after', 'Customer');
		cy.click_modal_primary_button('Submit');
		cy.get_report_header().should('contain', 'Account Type');
		cy.get_report_cell().should('contain', 'Receivable');

		//Checking for Edit functionality
		cy.click_menu_button();
		cy.get('.menu-item-label[data-label="Edit"]').click({force: true});
		cy.location('pathname').should('eq', '/app/report/Accounts%20Receivable');
		cy.get_read_only('is_standard').should('contain', 'Yes');
		cy.get_read_only('ref_doctype').should('contain', 'Sales Invoice');
	});
}); 