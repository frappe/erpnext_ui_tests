context('Discount Accounting', () => {
	before(() => {
		cy.login();
	});

	it('Discount accounting at entire invoice level', () => {
		//Enabling option of discount accounting in selling settings
		cy.visit('/app/selling-settings/');
		cy.get_field('enable_discount_accounting', 'checkbox').check();
		cy.get_input('enable_discount_accounting','checkbox').should('be.checked');

		//Creating invoice with discount at invoice level
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

		cy.insert_doc(
			"Sales Invoice",
			{
					naming_series: "ACC-SINV-.YYYY.-",
					posting_date: date,
					customer: "William Harris",
					due_date: date,
					items: [{"item_code": "Apple iPhone 13 Pro Max", "qty": 1, "rate": 110000, "amount": 110000}]
			},
			true
		).then((a)=>{
			console.log(a);
			cy.visit('app/sales-invoice/'+ a.name);
			cy.click_section('Additional Discount');
			cy.get_select('apply_discount_on').should('have.value', "Grand Total");
			cy.set_input('additional_discount_percentage', '5');
		});
	});
});
