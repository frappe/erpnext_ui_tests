context('Accounts Payable', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Verifying Accounts Payable report', () => {
		//Creating a new Supplier
		cy.insert_doc(
			"Supplier",
			{
				supplier_name: "Jacob Williams",
				supplier_group: "All Supplier Groups",
				default_currency: "INR",
				default_price_list: "Standard Buying",
			},
			true
		)

		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

		//Creating a purchase invoice against the supplier
		cy.insert_doc(
			"Purchase Invoice",
			{
					naming_series: "PINV-.YY.-",
					posting_date: date,
					supplier: "Jacob Williams",
					due_date: date,
					items: [{"item_code": "Apple iPhone 13 Pro Max", "qty": 1, "rate": 110000, "amount": 110000}]
			},
			true
		).then((a)=>{
			console.log(a);
			cy.visit('app/purchase-invoice/'+ a.name);
			cy.submit_doc('Unpaid');

			cy.visit('/app/query-report/Accounts%20Payable');
			cy.location('pathname').should('eq', '/app/query-report/Accounts%20Payable');

			//Checking if the accounts receivable report have customer filter
			cy.get_input('supplier').should('be.visible');
			cy.set_link('supplier', 'Jacob Williams');

			//Checking the headers and the values in the report
			cy.get_report_header().should('contain', 'Supplier')
				.and('contain', 'Payable Account')
				.and('contain', 'Voucher Type')
				.and('contain', 'Voucher No')
				.and('contain', 'Invoiced Amount')
				.and('contain','Outstanding Amount')
				.and('contain', 'Currency')
				.and('contain','Supplier Group');
			cy.window()
				.its("moment")
				.then((moment) => {
					const todaysDate = moment().format('DD-MM-YYYY');
					cy.get_report_cell().should('contain', 'Jacob Williams')
					.and('contain', 'Purchase Invoice')
					.and('contain', 'Creditors - WP')
					.and('contain', '₹ 1,10,000.00')
					.and('contain', todaysDate);
			});

			//Creating a payment entry against the purchase invoice
			cy.visit('app/purchase-invoice/'+ a.name);
			cy.click_dropdown_action('Create', 'Payment');
			cy.set_input('reference_no', 'ABC-1234');
			cy.set_today('reference_date');
			cy.save();
			cy.submit_doc();

			//Checking that the report should not contain the customer entry as payment has been done
			cy.visit('/app/query-report/Accounts%20Payable');
			cy.get_report_cell().should('not.have.value', a.name);
		});
	});

	it('Checking for basic filters, Add Column and Edit functionality', () => {
		//Checking for basic filters like company, date, ageing are present
		cy.visit('/app/query-report/Accounts%20Payable');
		cy.get_input('company').should('not.be.empty');
		cy.get_input('report_date').should('not.be.empty');
		cy.window()
				.its("moment")
				.then((moment) => {
					const todaysDate = moment().format('DD-MM-YYYY');
					cy.get_input('report_date').should('have.value', todaysDate);
		});
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
		cy.set_select('insert_after', 'Supplier');
		cy.click_modal_primary_button('Submit');
		cy.get_report_header().should('contain', 'Account Type');
		cy.get_report_cell().should('contain', 'Payable');

		//Checking for Edit functionality
		cy.click_menu_button();
		cy.get('.menu-item-label[data-label="Edit"]').click({force: true});
		cy.location('pathname').should('eq', '/app/report/Accounts%20Payable');
		cy.get_read_only('is_standard').should('contain', 'Yes');
		cy.get_read_only('ref_doctype').should('contain', 'Purchase Invoice');
	});
});  