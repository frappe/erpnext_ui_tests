context('Exchange Rate Creation Check', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Check accounts settings', () => {
		cy.visit('/app/accounts-settings');
		cy.get_input('allow_stale', 'checkbox').should('be.checked');
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

	it('Create quotation with different currency and fetch created currency exchange rate', () => {
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

		cy.insert_doc(
			"Quotation",
				{
					naming_series: 'SAL-QTN-.YYYY.-',
					quotation_to: 'Customer',
					party_name: 'William Harris',
					transaction_date: date,
					order_type: 'Sales',
					currency: 'INR',
					items: [{item_code: 'Apple iPhone 13 Pro Max', qty: 1, rate: 110000}]
				},
			true
		).then((c)=>{
			console.log(c);
			cy.visit('app/quotation/'+ c.name);
			cy.get_input('quotation_to').should('have.value', 'Customer');
			cy.get_input('party_name').should('have.value', 'William Harris');
			cy.wait(200);

			cy.click_section('Currency and Price List');
			cy.set_link('currency', 'USD');
			cy.wait(400);

			cy.click_section('Currency and Price List');
			cy.get_input('conversion_rate').should('have.value', '80.000000000');

			cy.get_input('items.item_code').should('have.value', 'Apple iPhone 13 Pro Max');
			cy.get_input('qty').should('have.value', "1.000");
			cy.get_input('rate').should('have.value', '1,375.00'); // 110000 / 80
			cy.get_input('amount').should('have.value', '1,375.00');

			cy.get_read_only('total_qty').should('contain', "1");
			cy.get_read_only('total').should('contain', '$ 1,375.00');
			cy.get_read_only('base_total').should('contain', '₹ 1,10,000.00'); // 1375 * 80

			cy.get_read_only('base_grand_total').should('contain', '₹ 1,10,000.00');
			cy.get_read_only('grand_total').should('contain', '$ 1,375.00');
			cy.get_read_only('base_rounded_total').should('contain', '₹ 1,10,000.00');
			cy.get_read_only('rounded_total').should('contain', '$ 1,375.00');

			cy.click_toolbar_button('Save');
			cy.get_page_title().should('contain', 'Draft');
			cy.click_toolbar_button('Submit');
			cy.click_modal_primary_button('Yes');
			cy.get_page_title().should('contain', 'Open');
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
