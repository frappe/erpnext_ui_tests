
context('Sales Invoice Creation', () => {
	before(() => {
		cy.login();
		it('Create Item', () => {
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
		});
	
		it('Create Customer', () => {
			cy.insert_doc(
				"Customer",
				{
					customer_name: "Anaya Kapoor",
					customer_group: "All Customer Groups",
					territory: "All Territories",
				},
				true
			)
		});
	});

	it('Create Sales Invoice via SO', () => {
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		cy.visit('app/sales-order');
		cy.insert_doc(
			"Sales Order",
			{
				naming_series: "SAL-ORD-.YYYY.-",
				transaction_date: date,
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
		});
		cy.findByRole('button', {name: 'Create'}).click();
		cy.get('[data-label="Sales%20Invoice"]').click();
		cy.findByRole('button', {name: 'Save'}).trigger('click', {force: true});
		cy.get('.page-title').should('contain', 'Draft');
		cy.findByRole('button', {name: 'Submit'}).trigger('click', {force: true});
		cy.findByRole('button', {name: 'Yes'}).trigger('click', {force: true});
		cy.get('.page-title').should('contain', 'Anaya Kapoor');
		cy.get('.page-title').should('contain', 'Unpaid');
	});
});