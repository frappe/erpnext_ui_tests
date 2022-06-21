context('Item Tax Template Check', () => {
	before(() => {
		cy.login();
	});

	it('Check and disable Account Settings', () => {
		cy.visit('/app/accounts-settings/Accounts%20Settings');
		cy.get_field('add_taxes_from_item_tax_template', 'checkbox').check();
		cy.get_field('add_taxes_from_item_tax_template', 'checkbox').uncheck();
		cy.save();
		cy.get_input('add_taxes_from_item_tax_template', 'checkbox').should('not.be.checked');
	});

	it('Item creation with and without item tax template', () => {
		cy.insert_doc(
			"Item",
				{
					item_code: "SanDisk Cruzer Blade 32GB USB Pendrive",   //name
					item_group: "All Item Groups",
					stock_uom: "Nos",
					is_stock_item: 1,
					//opening_stock: 5,
					valuation_rate: 100,
					taxes: [{item_tax_template: "GST 12% - WP", parent: "SanDisk Cruzer Blade 32GB USB Pendrive",}]   //both names
				},
			true
		)

		cy.insert_doc(
			"Item",
				{
					item_code: "SanDisk Ultra Dual Drive USB Type-C Pendrive",   //name
					item_group: "All Item Groups",
					stock_uom: "Nos",
					is_stock_item: 1,
					//opening_stock: 5,
					valuation_rate: 100,
				},
			true
		)
	});

	it('Check SO with item not having item tax linked', () => {
		cy.new_doc('Sales order');
		cy.get_select('naming_series').should('have.value', 'SAL-ORD-.YYYY.-');
		cy.get_input('transaction_date').should('not.have.value', 0);
		cy.wait(500);
		cy.get_input('customer').focus().click();
		cy.set_link('customer', 'William Harris');
		cy.get_select('order_type').should('have.value', 'Sales');
		cy.set_today('delivery_date');

		cy.set_link('items.item_code', 'SanDisk Ultra Dual Drive USB Type-C Pendrive');   // name
		cy.get_input('delivery_date').should('not.have.value', 0);
		cy.get_input('qty').should('have.value', "1.000");
		cy.get_input('rate').focus().click();
		cy.get_input('rate').clear();
		cy.set_input('rate', '100');
		cy.get_input('rate').blur();
		cy.get_read_only('amount').should('contain', "100.00");

		cy.set_link('taxes_and_charges', 'Output GST Out-state');
		cy.get_input('taxes.tax_amount').should('have.value', '18.00');
		cy.get_read_only('total').should('contain', "118.00");

		cy.get_read_only('total_taxes_and_charges').should('contain', "₹ 18.00");
		cy.get_read_only('grand_total').should('contain', "₹ 118.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 118.00");

		cy.click_toolbar_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'To Deliver and Bill');
	});

	it('Check SO with item having item tax template linked', () => {
		cy.new_doc('Sales order');
		cy.get_select('naming_series').should('have.value', 'SAL-ORD-.YYYY.-');
		cy.get_input('transaction_date').should('not.have.value', 0);
		cy.wait(500);
		cy.get_input('customer').focus().click();
		cy.set_link('customer', 'William Harris');
		cy.get_select('order_type').should('have.value', 'Sales');
		cy.set_today('delivery_date');

		cy.set_link('items.item_code', 'SanDisk Cruzer Blade 32GB USB Pendrive');   // name
		cy.get_input('delivery_date').should('not.have.value', 0);
		cy.get_input('qty').should('have.value', "1.000");
		cy.get_input('rate').focus().click();
		cy.get_input('rate').clear();
		cy.set_input('rate', '100');
		cy.get_input('rate').blur();
		cy.get_read_only('amount').should('contain', "100.00");

		cy.get_input('taxes_and_charges').click();
		cy.set_link('taxes_and_charges', 'Output GST Out-state');
		cy.get_input('taxes.tax_amount').should('have.value', '12.00');
		cy.get_read_only('total').should('contain', "112.00");

		cy.grid_open_row('items', 1);
		cy.get_input('item_tax_template').scrollIntoView().should('be.visible');
		cy.get_input('item_tax_template').should('have.value', 'GST 12% - WP'); // name
		cy.close_grid_edit_modal();

		cy.get_read_only('total_taxes_and_charges').should('contain', "₹ 12.00");
		cy.get_read_only('grand_total').should('contain', "₹ 112.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 112.00");

		cy.click_toolbar_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'To Deliver and Bill');
	});
});
