context('Delivery Note Creation', () => {
	before(() => {
		cy.login();
		cy.visit('/app');

		cy.insert_doc(
			"Item",
			{
				item_code: "Solid Wood Dinning Set",
				item_group: "All Item Groups",
				valuation_rate: 75000,
				opening_stock: 5,
				stock_uom: "Nos",
			},
			true
		)

		cy.insert_doc(
			"Customer",
			{
				customer_name: "William Harris",
				customer_group: "All Customer Groups",
				territory: "All Territories",
				default_currency: "INR",
				default_price_list: "Standard Selling",
			},
			true
		)
	});

	it('Create DN via SO>SI', () => {
		cy.visit('app/sales-order');
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1; // Months start at 0!
		let dd = today.getDate();
		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
		var today_date = dd + '-' + mm + '-' + yyyy;

		cy.insert_doc(
			"Sales Order",
			{
				naming_series: "SAL-ORD-.YYYY.-",
				transaction_date: date,
				delivery_date: date,
				customer: "William Harris",
				order_type: "Sales",
				items: [{"item_code": "Solid Wood Dinning Set", "delivery_date": date, "qty": 1, "rate": 75000}]
			},
			true
		).then((d)=>{ 
			console.log(d);
			cy.visit('app/sales-order/'+ d.name);
			cy.submit('To Deliver and Bill');
			cy.click_dropdown_action('Create', 'Sales Invoice');

			cy.save();
			cy.get_page_title().should('contain', 'Draft');
			cy.submit('Unpaid');
			cy.click_dropdown_action('Create', 'Delivery');

			cy.url().should('include', '/app/delivery-note/new-delivery-note');
			cy.get_select('naming_series').should('have.value', 'MAT-DN-.YYYY.-');
			cy.get_input('customer').should('have.value', 'William Harris');
			cy.get_input('posting_date').should('have.value', today_date);

			cy.click_section('Currency and Price List');
			cy.get_input('currency').should('have.value', 'INR');
			cy.get_input('selling_price_list').should('have.value', 'Standard Selling');

			cy.get_table_field('items', 1, 'item_code', 'Link').contains('Solid Wood Dinning Set');
			cy.get_read_only('total_qty').should('contain', "1");
			cy.get_read_only('total').should('contain', "₹ 75,000.00");
			cy.get_read_only('grand_total').should('contain', "₹ 75,000.00");
			cy.get_read_only('rounded_total').should('contain', "₹ 75,000.00");

			cy.save();
			cy.get_page_title().should('contain', 'Draft');
			cy.submit('Completed');
			cy.get_page_title().should('contain', 'William Harris');

			cy.click_dropdown_action('View', 'Stock Ledger');
			cy.get('.dt-cell__content > span > div').should('contain', "-1.000");

			cy.visit('app/sales-order/'+ d.name);
			cy.get_page_title().should('contain', 'Completed');
		});
	});
});
