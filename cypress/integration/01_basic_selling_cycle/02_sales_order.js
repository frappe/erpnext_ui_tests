context('Create Sales Order', () => {
	before(() => {
		cy.login();
		cy.visit('/app');

			cy.insert_doc(
			 "Item",
			 {
				item_code: "Wireless Bluetooth Headphones - Black",
				item_group: "All Item Groups",
				valuation_rate: 4000,
				stock_uom: "Nos",
			 },
			 true
			)

			cy.insert_doc(
			 "Customer",
			 {
				customer_name: "Mihir Sharma",
				customer_group: "All Customer Groups",
				territory: "All Territories",
				default_currency: "INR",
				default_price_list: "Standard Selling",
			 },
			 true
			)
	});

	it.only('Create Sales Order', () => {
		var today = new Date();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1; // Months start at 0!
		let dd = today.getDate();
		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
		var today = dd + '-' + mm + '-' + yyyy;

		cy.visit('app/sales-order');
		cy.click_listview_primary_button('Add Sales Order');
		cy.url().should('include', '/app/sales-order/new-sales-order');

		cy.get_field('naming_series', 'Select').should('have.value', 'SAL-ORD-.YYYY.-');

		cy.get_field('customer', 'Link').focus().trigger('click', {force: true});
		cy.wait(200);
		cy.get_field('customer', 'Link').focus();
		cy.get_field('customer', 'Link').click();
		cy.fill_field('customer', 'Mihir Sharma ', 'Link'), {delay:200}, "{downarrow}{enter}";
		cy.wait(200);
		cy.get('[aria-selected="true"] > a > p > strong').findByText('Mihir Sharma').click();
		cy.get_field('customer', 'Link').should('have.value', 'Mihir Sharma');

		cy.get_field('transaction_date', 'Date').should('have.value', today);
		cy.get_field('order_type', 'Select').should('have.value', "Sales");
		cy.get_field('delivery_date', 'Date').click();  //Opens calendar
		cy.get('.datepicker.active > .datepicker--buttons > .datepicker--button').click();  //Click on 'Today' on calendar view

		cy.findByText('Currency and Price List').trigger('click', {force: true});
		cy.get_field('currency', 'Link').should('have.value', "INR");
		cy.get_field('selling_price_list', 'Link').should('have.value', "Standard Selling");

		cy.get('.rows > .grid-row > .data-row > .col-xs-3').trigger('click', {force: true});
		cy.get_field('item_code', 'Link').focus().trigger('click', {force: true});
		cy.wait(500);
		cy.fill_field('item_code', 'Wireless Bluetooth Headphones - Black', 'Link'), {delay:200}, "{downarrow}{enter}";
		cy.get('#awesomplete_list_32 > [aria-selected="true"] > a > p > strong').findByText('Wireless Bluetooth Headphones - Black').click();
		//cy.get('#awesomplete_list_32 > [aria-selected="true"] > a > p').click();
		cy.get_field('delivery_date', 'Date').should('have.value', today);
		cy.get_field('qty', 'Float').should('have.value', "1.000");
		cy.get_field('rate', 'Float').clear();
		cy.fill_field('rate', '4000', 'Float'), {delay:200}, "{enter}";
		cy.get_field('rate', 'Float').should('have.value', "4000");
		cy.get('[data-fieldname="amount"]').should('contain', "4,000");

		cy.get('[data-fieldname="total_qty"]').should('contain', "1");
		cy.get('[data-fieldname="total"]').should('contain', "₹ 4,000.00");

		cy.get('[data-fieldname="grand_total"]').should('contain', "₹ 4,000.00");
		cy.get('[data-fieldname="rounded_total"]').should('contain', "₹ 4,000.00");

		cy.findByRole('button', {name: 'Save'}).trigger('click', {force: true});
		cy.get('.page-title').should('contain', 'Draft');
		cy.findByRole('button', {name: 'Submit'}).click();
		cy.findByRole('button', {name: 'Yes'}).click();
		cy.get('.page-title').should('contain', 'To Deliver and Bill');
	});
});
