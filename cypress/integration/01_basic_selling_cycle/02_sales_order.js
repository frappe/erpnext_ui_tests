
context('Create Sales Order', () => {
	before(() => {
		cy.login();
		cy.visit('/app');

			// cy.insert_doc(
			// 	"Item",
			// 	{
			// 		item_code: "Apple iPhone 13 Pro",
			// 		item_group: "All Item Groups",
			// 		valuation_rate: 110000,
			// 		stock_uom: "Nos",
			// 	},
			// 	true
			// )

			// cy.insert_doc(
			// 	"Customer",
			// 	{
			// 		customer_name: "Maria Garcia",
			// 		customer_group: "All Customer Groups",
			// 		territory: "All Territories",
			// 		default_currency: "INR",
			// 		default_price_list: "Standard Selling",
			// 	},
			// 	true
			// )
	});

	it.only('Create Sales Order', () => {
		var today = new Date();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1; // Months start at 0!
		let nextMonth = today.getMonth() + 2; //Validiy till next month
		let dd = today.getDate();
		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
		if (nextMonth < 10) nextMonth = '0' + nextMonth;
		var today = dd + '-' + mm + '-' + yyyy;
		var deliveryDate = dd + '-' + nextMonth + '-' + yyyy;

		cy.visit('app/sales-order');
		cy.click_listview_primary_button('Add Sales Order');
		cy.url().should('include', '/app/sales-order/new-sales-order');

	});
});
