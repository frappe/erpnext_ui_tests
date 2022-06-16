context('Advance Payment Check', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Create sales order and advance payment from it', () => {
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		cy.log(date);

		cy.insert_doc(
			"Sales Order",
				{
					naming_series: 'SAL-ORD-.YYYY.-',
					transaction_date: date,
					delivery_date: date,
					customer: 'William Harris',
					order_type: 'Sales',
					items: [{item_code: 'Apple iPhone 13 Pro Max', delivery_date: date, qty: 1, rate: 110000}]
				},
			true
		).then((c)=>{
			console.log(c);
			cy.visit('app/sales-order/'+ c.name);
			cy.submit('To Deliver and Bill');

			cy.visit('app/sales-order');
			cy.click_listview_row_item(0);
			cy.click_dropdown_action('Create', 'Payment');
			cy.url().should('include', '/app/payment-entry/new-payment-entry');

		});
	});
});

