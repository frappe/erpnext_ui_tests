const TEST_RATE = 110000;
const TEST_EXCHANGE_VALUE = 75.00;

context('Currency and Exchange Rate Check', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
		cy.intercept('POST', '/api/method/erpnext.setup.utils.get_exchange_rate', {"message": TEST_EXCHANGE_VALUE});
	});

	it('Create quotation with different currency and fetching currency exchange rate', () => {
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
					items: [{item_code: 'Apple iPhone 13 Pro Max', qty: 1, rate: TEST_RATE}]
				},
			true
		).then((c)=>{
			console.log(c);
			cy.visit('app/quotation/'+ c.name);
			cy.get_input('quotation_to').should('have.value', 'Customer');
			cy.get_input('party_name').should('have.value', 'William Harris');

			cy.click_section('Currency and Price List');
			cy.set_link('currency', 'EUR');

			cy.get_input('items.item_code').should('have.value', 'Apple iPhone 13 Pro Max');
			cy.get_input('qty').should('have.value', "1.000");
			cy.get_input('rate').should('have.value', '1,466.67'); // 110000 / 75
			cy.get_input('amount').should('have.value', '1,466.67'); // 110000 / 75

			cy.get_read_only('total_qty').should('contain', "1");
			cy.get_read_only('total').should('contain', "€ 1,466.67");
			cy.get_read_only('base_total').should('contain', '₹ 1,10,000.25'); // 1466.67 * 75

			cy.get_read_only('base_grand_total').should('contain', '₹ 1,10,000.25'); // 1466.67 * 75
			cy.get_read_only('grand_total').should('contain', "€ 1,466.67");
			cy.get_read_only('base_rounded_total').should('contain', '₹ 1,10,000.25');
			cy.get_read_only('rounded_total').should('contain', "€ 1,466.67");

			cy.click_toolbar_button('Save');
			cy.get_page_title().should('contain', 'Draft');
			cy.click_toolbar_button('Submit');
			cy.click_modal_primary_button('Yes');
			cy.get_page_title().should('contain', 'Open');
		});
	});
});
