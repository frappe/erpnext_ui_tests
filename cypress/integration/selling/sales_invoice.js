
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
		cy.visit('app/sales-order');
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
			cy.findByRole('button', {name: 'Submit'}).trigger('click', {force: true});
			cy.findByRole('button', {name: 'Yes'}).trigger('click', {force: true});
			cy.get('.btn-modal-close > .icon').click();
			cy.get('.page-title').should('contain', 'To Deliver and Bill');
			cy.findByRole('button', {name: 'Create'}).click();
			cy.get('[data-label="Sales%20Invoice"]').click();

			cy.url().should('include', '/app/sales-invoice/new-sales-invoice');
			cy.get_field('naming_series', 'Select').should('have.value', 'SINV-.YY.-');
			cy.get_field('customer', 'Link').should('have.value', 'Anaya Kapoor');
			cy.get_field('posting_date', 'Date').should('have.value', today_date);
			cy.get_field('due_date', 'Date').should('have.value', today_date);

			cy.get(':nth-child(7) > .section-head').findByText('Currency and Price List').trigger('click', {force: true});
			cy.get_field('currency', 'Link').should('have.value', "INR");
			cy.get_field('selling_price_list', 'Link').should('have.value', "Standard Selling");

			cy.get('.rows > .grid-row > .data-row > .col-xs-4').click();
			cy.get_field('item_code', 'Link').should('have.value', 'Vintage Green Photo Frame');
			cy.get('[data-fieldname="total_qty"]').should('contain', "1");
			cy.get('[data-fieldname="total"]').should('contain', "₹ 2,000.00");
			cy.get('[data-fieldname="grand_total"]').should('contain', "₹ 2,000.00");
			cy.get('[data-fieldname="rounded_total"]').should('contain', "₹ 2,000.00");

			cy.findByRole('button', {name: 'Save'}).trigger('click', {force: true});
			cy.get('.page-title').should('contain', 'Draft');
			cy.findByRole('button', {name: 'Submit'}).trigger('click', {force: true});
			cy.findByRole('button', {name: 'Yes'}).trigger('click', {force: true});
			cy.get('.page-title').should('contain', 'Anaya Kapoor');
			cy.get('.page-title').should('contain', 'Unpaid');
		});
	});
});
