
context('Quotation Creation', () => {
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

			cy.insert_doc(
				"Address",
				{
					address_title: "Maria's Address",
					address_type: "Billing",
					address_line1: "18th Floor, ",
					address_line2: "Prabhat Bldg Off Sitladevi Temple Road, Vile Parle West, ",
					city: "Mumbai ",
					country: "India",
					"is_primary_address": 1,
					"is_shipping_address": 1,
					"links": [
						{
							"link_doctype": "Customer",
							"link_name": "Maria Garcia",
							"link_title": "Maria Garcia",
							"parent": "Maria's Address-Billing",
							"parentfield": "links",
							"parenttype": "Address",
							"doctype": "Dynamic Link"
						}
					]
				},
				true
			)
	});

	it('Create Quotation', () => {
		cy.visit('app/quotation');

		var today = new Date();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1; // Months start at 0!
		let nextMonth = today.getMonth() + 2; //Validiy till next month
		let dd = today.getDate();
		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
		if (nextMonth < 10) nextMonth = '0' + nextMonth;
		var today = dd + '-' + mm + '-' + yyyy;
		var validTill = dd + '-' + nextMonth + '-' + yyyy;

		cy.click_listview_primary_button('Add Quotation');
		cy.url().should('include', '/quotation/new-quotation');

		cy.get_field('naming_series', 'Select').should('have.value', 'SAL-QTN-.YYYY.-');
		cy.get_field('transaction_date', 'Date').should('have.value', today);
		cy.get_field('quotation_to', 'Link').should('have.value', "Customer");
		cy.get_field('valid_till', 'Date').should('have.value', validTill);
		cy.get_field('party_name', 'Dynamic Link').focus().trigger('click', {force: true});
		cy.wait(500);
		cy.get_field('party_name', 'Dynamic Link').focus();
		cy.fill_field('party_name', 'Maria Garcia ', 'Dynamic Link'), {delay:200}, "{downarrow}{enter}";
		cy.get('#awesomplete_list_6 > [aria-selected="true"]').first().click();
		cy.get_field('order_type', 'Select').should('have.value', "Sales");
		cy.get('[data-fieldname="customer_name"]').should('contain', "Maria Garcia");

		cy.findByText('Address and Contact').click();
		cy.findByText('Currency and Price List').click();
		cy.get_field('currency', 'Link').should('have.value', "INR");
		cy.get_field('selling_price_list', 'Link').should('have.value', "Standard Selling");

		cy.get('.rows > .grid-row > .data-row > .col-xs-4').trigger('click', {force: true});
		cy.get_field('item_code', 'Link').focus().trigger('click', {force: true});
		cy.wait(500);
		cy.fill_field('item_code', 'Apple iPhone 13 Pro', 'Link'), {delay:200}, "{downarrow}{enter}";
		cy.get_field('qty', 'Float').click();
		cy.get_field('qty', 'Float').should('have.value', "1.000");
		cy.get_field('rate', 'Float').clear();
		cy.fill_field('rate', '110000', 'Float'), {delay:200}, "{enter}";
		cy.get_field('rate', 'Float').blur();
		cy.get('[data-fieldname="amount"]').should('contain', "1,10,000.00");
		cy.get('[data-fieldname="total_qty"]').should('contain', "1");
		cy.get('[data-fieldname="total"]').should('contain', "₹ 1,10,000.00");

		cy.get('[data-fieldname="grand_total"]').should('contain', "₹ 1,10,000.00");
		cy.get('[data-fieldname="rounded_total"]').should('contain', "₹ 1,10,000.00");

		cy.findByRole('button', {name: 'Save'}).trigger('click', {force: true});
		cy.get('.page-title').should('contain', 'Draft');
		cy.findByRole('button', {name: 'Submit'}).click();
		cy.findByRole('button', {name: 'Yes'}).click();
		cy.get('.page-title').should('contain', 'Open');

	});
});
