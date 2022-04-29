context('Sales Invoice Creation', () => {
	before(() => {
		cy.login();
		cy.visit('/app');

		cy.insert_doc(
			"Item",
			{
				item_code: "Vintage Green Photo Frame",
				item_group: "All Item Groups",
				valuation_rate: 2000,
				stock_uom: "Nos",
			},
			true
		)

		cy.insert_doc(
			"Customer",
			{
				customer_name: "Anaya Kapoor",
				customer_group: "All Customer Groups",
				territory: "All Territories",
				default_currency: "INR",
				default_price_list: "Standard Selling",
			},
			true
		)
	});

	it('Create Sales Invoice via SO', () => {
		cy.new_doc('Sales Order');
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1; // Months start at 0!
		let dd = today.getDate();
		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
		var today_date = dd + '-' + mm + '-' + yyyy;

		cy.wait(500);
		cy.insert_doc(
			"Sales Order",
			{
				naming_series: "SAL-ORD-.YYYY.-",
				transaction_date: date,
				delivery_date: date,
				customer: "Anaya Kapoor",
				order_type: "Sales",
				items: [{"item_code": "Vintage Green Photo Frame", "delivery_date": date, "qty": 1, "rate": 2000}]
			},
			true
		).then((d)=>{ 
			console.log(d);
			cy.visit('app/sales-order/'+ d.name);
			cy.submit('To Deliver and Bill');
			cy.click_dropdown_action('Create', 'Sales Invoice');

			cy.url().should('include', '/app/sales-invoice/new-sales-invoice');
			cy.get_select('naming_series').should('have.value', 'SINV-.YY.-');
			cy.get_input('customer').should('have.value', 'Anaya Kapoor');
			cy.get_input('posting_date').should('have.value', today_date);
			cy.get_input('due_date').should('have.value', today_date);

			cy.click_section('Currency and Price List');
			cy.get_input('currency').should('have.value', 'INR');
			cy.get_input('selling_price_list').should('have.value', 'Standard Selling');

			cy.get('.rows > .grid-row > .data-row > .col-xs-4').click();
			cy.get_input('item_code').should('have.value', 'Vintage Green Photo Frame');
			cy.get_input('qty').should('have.value', "1.000");
			cy.get_input('rate').should('have.value', "2,000.00");
			cy.get_read_only('amount').should('contain', "2,000.00");

			cy.get_read_only('total_qty').should('contain', "1");
			cy.get_read_only('total').should('contain', "₹ 2,000.00");
			cy.get_read_only('grand_total').should('contain', "₹ 2,000.00");
			cy.get_read_only('rounded_total').should('contain', "₹ 2,000.00");
			cy.save();
			cy.get_page_title().should('contain', 'Draft');
			cy.submit('Unpaid');
		});
	});
});
