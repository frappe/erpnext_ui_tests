
context('Create Sales Order', () => {
	before(() => {
		cy.login();
		cy.visit('/app');

			cy.insert_doc(
				"Item",
				{
					item_code: "Apple iPhone 13 Pro",
					item_group: "All Item Groups",
					valuation_rate: 110000,
					stock_uom: "Nos",
				},
				true
			)

			cy.insert_doc(
				"Customer",
				{
					customer_name: "Maria Garcia",
					customer_group: "All Customer Groups",
					territory: "All Territories",
					default_currency: "INR",
					default_price_list: "Standard Selling",
				},
				true
				)
	});

	it('Create Sales Order', () => {
		cy.visit('app/sales-order');
		cy.click_listview_primary_button('Add Sales Order');
		cy.url().should('include', '/app/sales-order/new-sales-order');

		cy.get_field('naming_series', 'Select').should('have.value', 'SAL-ORD-.YYYY.-');
		cy.fill_field('customer', 'Maria Garcia ', 'Dynamic Link'), {delay:200}, "{downarrow}{enter}";
		cy.get('[aria-selected="true"]').click();


		//cy.findByRole('button', {name: 'Create'}).click();
		//cy.get('[data-label="Sales%20Order"]').click();

	});
});
