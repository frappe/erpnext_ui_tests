context('Partial Delivery Creation Check', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

	it('Create item and SO', () => {

		//Not adding item in master as stock consumption in other scripts can impact this case
		cy.insert_doc(
			"Item",
			{
				item_code: 'WP 7 ltr Water Purifier',
				item_group: 'Products',
				valuation_rate: 4000,
				opening_stock: 10,
				stock_uom: 'Nos',
			},
			true
		)

		cy.insert_doc(
			"Sales Order",
				{
					naming_series: 'SAL-ORD-.YYYY.-',
					transaction_date: date,
					delivery_date: date,
					customer: 'William Harris',
					order_type: 'Sales',
					items: [{item_code: 'WP 7 ltr Water Purifier', delivery_date: date, qty: 5, rate: 20000}]
				},
			true
		).then((c)=>{
			console.log(c);
			cy.visit('app/sales-order/'+ c.name);
			cy.get_page_title().should('contain', 'Draft');
			cy.submit_doc('To Deliver and Bill');
			//cy.submit('To Deliver and Bill');
		});
	});

	it('Create partial delivery note', () => {
		cy.visit('app/sales-order/');
		cy.click_listview_row_item(0);
		cy.click_dropdown_action('Create', 'Delivery Note');
		cy.url().should('include', '/app/delivery-note/new-delivery-note');

		cy.get_select('naming_series').should('have.value', 'MAT-DN-.YYYY.-');
		cy.get_input('customer').should('have.value', 'William Harris');
		cy.get_input('posting_date').should('not.have.value', 0);

		cy.get_input('items.item_code').should('have.value', 'WP 7 ltr Water Purifier');
		cy.get_input('qty').should('have.value', "5.000");
		cy.set_input('qty', '3');
		cy.get_input('qty').blur();
		cy.get_input('rate').should('have.value', "20,000.00");
		cy.get_read_only('amount').should('contain', "60,000.00");

		cy.click_toolbar_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'To Bill');

		cy.click_dropdown_action('View', 'Stock Ledger');
		cy.get('.dt-cell__content > span > div').should('contain', "-3.000");
	});

	it('Create another partial delivery note', () => {
		cy.visit('app/sales-order/');
		cy.click_listview_row_item(0);
		cy.click_dropdown_action('Create', 'Delivery Note');
		cy.url().should('include', '/app/delivery-note/new-delivery-note');

		cy.get_select('naming_series').should('have.value', 'MAT-DN-.YYYY.-');
		cy.get_input('customer').should('have.value', 'William Harris');
		cy.get_input('posting_date').should('not.have.value', 0);

		cy.get_input('items.item_code').should('have.value', 'WP 7 ltr Water Purifier');
		cy.get_input('qty').should('have.value', "2.000");
		cy.get_input('rate').should('have.value', "20,000.00");
		cy.get_read_only('amount').should('contain', "40,000.00");

		cy.click_toolbar_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.wait(200);
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'To Bill');

		cy.click_dropdown_action('View', 'Stock Ledger');
		cy.get('.dt-cell__content > span > div').should('contain', "-2.000");

		cy.visit('app/sales-order');
		cy.click_listview_row_item(0);
		cy.get_page_title().should('contain', 'To Bill');
	});
});
