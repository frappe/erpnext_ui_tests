
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
				},
				true
			)
	});

	it('Create Sales Invoice', () => {
		cy.visit('app/sales-invoice');
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
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
			cy.findByRole('button', {name: 'Submit'}).click();
			cy.findByRole('button', {name: 'Yes'}).click();
			cy.get('.page-title').should('contain', 'Unpaid');

			cy.findByRole('button', {name: 'Create'}).click();
			cy.get('[data-label="Payment"]').click();
			cy.get_field('payment_type', 'Select').should('have.value', 'Receive');
			cy.get_field('paid_amount', 'Currency').should('have.value', '400.00');
			//cy.get_table_field('references', 1, 'reference_name', 'Dynamic Link').should('have.value', d.name);
			cy.get_field('reference_no', 'Data').type('ABC-123');
			cy.get_field('reference_date', 'Date').click();  //Opens calendar
			cy.get('.datepicker.active > .datepicker--buttons > .datepicker--button').click();
			cy.findByRole('button', {name: 'Save'}).click();
			cy.get('.page-title').should('contain', 'Draft');
			cy.findByRole('button', {name: 'Submit'}).click();
			cy.findByRole('button', {name: 'Yes'}).click();
			cy.get('.page-title').should('contain', 'Submitted');
		});
	});
});