context('Discount Accounting', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Discount accounting at entire invoice level', () => {
		// Creating account head for discount accounting
		cy.insert_doc(
			"Account",
			{
				account_name: "Discount Account", // name
				is_group: 0,
				root_type: "Expense",
				report_type: "Profit and Loss",
				account_currency: "INR",
				parent_account: "Direct Expenses - WP", // - TQ, WP", // name
			},
			true
		)

		//Enabling option of discount accounting in selling settings
		cy.visit('/app/selling-settings/');
		cy.get_field('enable_discount_accounting', 'checkbox').check();
		cy.get_input('enable_discount_accounting','checkbox').should('be.checked');
		cy.save();

		//Creating invoice with discount at invoice level
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

		cy.insert_doc(
			"Sales Invoice",
			{
					naming_series: "ACC-SINV-.YYYY.-",
					posting_date: date,
					customer: "William Harris",
					due_date: date,
					items: [{"item_code": "Apple iPhone 13 Pro Max", "qty": 1, "rate": 110000, "amount": 110000}]
			},
			true
		).then((a)=>{
			console.log(a);
			cy.visit('app/sales-invoice/'+ a.name);
			//cy.findByText('Accounting Dimensions').scrollIntoView().should('be.visible').click();

			//cy.click_section('Additional Discount');
			cy.findByText('Additional Discount').scrollIntoView().should('be.visible').click();
			cy.get_select('apply_discount_on').should('have.value', "Grand Total");
			cy.set_input('additional_discount_percentage', '5');
			cy.get_input('additional_discount_percentage').blur();
			cy.get_input('discount_amount').should('have.value', '5,500.00');
			cy.set_link('additional_discount_account', 'Discount Account - ');

			// Validating values after applying additional discount
			cy.get_read_only('total').should('contain', "₹ 1,10,000.00");
			cy.get_read_only('net_total').should('contain', "₹ 1,04,500.00");
			cy.get_read_only('grand_total').should('contain', "₹ 1,04,500.00");
			cy.get_read_only('rounded_total').should('contain', "₹ 1,04,500.00");

			cy.click_toolbar_button('Save');
			cy.get_page_title().should('contain', 'Draft');
			cy.click_toolbar_button('Submit');
			cy.click_modal_primary_button('Yes');
			cy.get_page_title().should('contain', 'Unpaid');

			//Validating accounting ledger impact
			cy.click_dropdown_action('View', 'Accounting Ledger');
			//cy.get('.dt-row-3 > .dt-cell--col-2 > .dt-cell__content > a')
			cy.get_report_cell().should('contain', 'Discount Account');
			cy.get_report_cell().should('contain', '5,500.000');

			//Disabling the discount accounting option again
			cy.visit('/app/selling-settings/');
			cy.get_field('enable_discount_accounting', 'checkbox').uncheck();
			cy.get_input('enable_discount_accounting','checkbox').should('be.unchecked');
		});
	});
});
