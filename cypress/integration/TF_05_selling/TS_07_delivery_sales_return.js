context('Delivery Return Check', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Create item and SO', () => {
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

		//Not adding item in master as stock consumption in other scripts can impact this case
		cy.insert_doc(
			"Item",
			{
				item_code: 'Sleepy Owl Coffee Mug',
				item_group: 'Products',
				valuation_rate: 500,
				opening_stock: 5,
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
					items: [{item_code: 'Sleepy Owl Coffee Mug', delivery_date: date, qty: 1, rate: 500}]
				},
			true
		).then((c)=>{
			console.log(c);
			cy.visit('app/sales-order/'+ c.name);
			cy.submit('To Deliver and Bill');
		});
	});

	it('Create delivery note', () => {
		cy.visit('app/sales-order/');
		cy.click_listview_row_item(0);
		cy.click_dropdown_action('Create', 'Delivery');
		cy.url().should('include', '/app/delivery-note/new-delivery-note');
		cy.click_toolbar_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		//cy.submit('To Bill');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'To Bill');

		cy.click_dropdown_action('View', 'Stock Ledger');
		cy.get('.dt-cell__content > span > div').should('contain', "-1.000");
	});

	it('Create sales return from DN', () => {
		cy.visit('app/delivery-note');
		cy.click_listview_row_item(0);
		cy.click_dropdown_action('Create', 'Sales Return');
		cy.url().should('include', '/app/delivery-note/new-delivery-note');

		cy.compare_document({
			customer: "William Harris",
			is_return: true,
			items: [{item_code: 'Sleepy Owl Coffee Mug', qty: '-1', rate: 500, amount: '-500'}]
		});

		cy.save();
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'Return');

		cy.click_dropdown_action('View', 'Stock Ledger');
		cy.get('.dt-cell__content > span > div').should('contain', '1.000');

		cy.visit('app/sales-order');
		cy.click_listview_row_item(0);
		cy.get_page_title().should('contain', 'To Deliver and Bill');
	});
});
