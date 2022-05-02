context('Sales Invoice Payment', () => {
	before(() => {
		cy.login();
		cy.visit('/app');

		cy.insert_doc(
			"Item",
			{
				item_code: "Sleepy Owl Coffee Mug",
				item_group: "All Item Groups",
				valuation_rate: 400,
				stock_uom: "Nos",
			},
			true
		)

		cy.insert_doc(
			"Customer",
			{
				customer_name: "Ankur Agarawal",
				customer_group: "All Customer Groups",
				territory: "All Territories",
				default_currency: "INR",
				default_price_list: "Standard Selling",
			},
			true
		)
	});

	it('Create Sales Invoice', () => {
		cy.visit('app/sales-invoice');
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1; // Months start at 0!
		let dd = today.getDate();
		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
		var today_date = dd + '-' + mm + '-' + yyyy;

		cy.insert_doc(
			"Sales Invoice",
			{
				naming_series: "SINV-.YY.-",
				posting_date: date,
				customer: "Ankur Agarawal",
				due_date: date,
				items: [{"item_code": "Sleepy Owl Coffee Mug", "qty": 1, "rate": 400, "amount": 400}]
			},
			true
		).then((d)=>{ 
			console.log(d);
			cy.visit('app/sales-invoice/'+ d.name);
			cy.submit('Unpaid');

			cy.click_dropdown_action('Create', 'Payment');
			cy.url().should('include', '/app/payment-entry/new-payment-entry');
			cy.get_select('naming_series').should('have.value', 'ACC-PAY-.YYYY.-');
			cy.get_select('payment_type').should('have.value', 'Receive');
			cy.get_input('posting_date').should('have.value', today_date);

			cy.get_input('party_type').should('have.value', 'Customer');
			cy.get_input('party').should('have.value', 'Ankur Agarawal');
			cy.get_input('paid_amount').should('have.value', '400.00');

			cy.get_input('references.reference_doctype').should('have.value', 'Sales Invoice');
			cy.get_input('reference_name').should('have.value', d.name);
			cy.get_input('allocated_amount').should('have.value', '400.000');

			cy.set_input('reference_no', 'ABC-123');
			cy.set_today('reference_date');

			cy.save();
			cy.get_page_title().should('contain', 'Draft');
			cy.submit('Submitted');
		});
	});
});
