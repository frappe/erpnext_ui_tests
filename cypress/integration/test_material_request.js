
context('Material Request', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
			cy.insert_doc(
				"Item",
				{
					item_code: "ITM-0002",
					item_group: "All Item Groups",
					valuation_rate: 100,
					stock_uom: "Nos",
				},
				true
			)
	});

	it('Create Material Request', () => {
		cy.visit('app/material-request');
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		cy.insert_doc(
			"Material Request",
			{
				naming_series: "MAT-MAR-.YYYY.-",
				schedule_date: date,
				transaction_date: date,
				items: [{"item_code": "ITM-0002", "qty": 1, "rate": 100, "amount": 100}]
			},
			true
		).then((d)=>{ 
			console.log(d);
			cy.visit('app/material-request/new-material-request-1');
			cy.findByRole('button', {name: 'Save'}).click();
		});
	});
});
