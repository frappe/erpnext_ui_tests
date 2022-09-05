context('Pricing Rule Check on Quotation', () => {
	before(() => {
		cy.login();
	});

	it('Create Pricing Rule Record', () => {
		cy.new_doc('Pricing Rule');
		cy.location('pathname').should('include', 'app/pricing-rule/new-pricing-rule');
		cy.get_select('naming_series').should('have.value', 'PRLE-.####');
		cy.set_input('title', 'Flat 10,000 off on Apple iPhone');
		cy.set_select('apply_on', 'Item Code');
		cy.set_select('price_or_product_discount', 'Price');
		cy.findByRole('button', {name: 'Add Row'}).click();
		cy.set_link('items.item_code', 'Apple iPhone 13 Pro Max'); // name
		cy.set_link('uom', 'Nos');

		cy.get_field('selling', 'checkbox').check();
		cy.set_select('applicable_for', 'Customer');
		cy.set_link('customer', 'William Harris');

		cy.set_input('min_qty', '5');
		cy.set_input('max_qty', '10');
		cy.set_select('rate_or_discount', 'Rate');
		cy.set_input('rate', '100000');
		cy.save();
	});

	it('Create Quotation without pricing rule', () => {
		cy.new_doc('Quotation');
		cy.location('pathname').should('include', '/app/quotation/new-quotation');

		cy.get_select('naming_series').should('have.value', 'SAL-QTN-.YYYY.-');
		cy.get_input('quotation_to').should('have.value', 'Customer');
		cy.set_link('party_name', 'William Harris');
		cy.get_select('order_type').should('have.value', 'Sales');
		cy.get_read_only('customer_name').should('contain', 'William Harris');

		cy.set_link('items.item_code', 'Apple iPhone 13 Pro Max');   //name
		cy.get_input('qty').should('have.value', "1.000");
		cy.get_input('rate').clear();
		cy.set_input('rate', '110000');
		cy.get_input('rate').blur();
		cy.get_read_only('amount').should('contain', '1,10,000.00');

		cy.get_read_only('total_qty').should('contain', "1");
		cy.get_read_only('total').should('contain', "₹ 1,10,000.00");
		cy.get_read_only('grand_total').should('contain', "₹ 1,10,000.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 1,10,000.00");

		cy.click_toolbar_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'Open');
	});

	it('Create another Quotation where pricing rule is applied', () => {
		cy.new_doc('Quotation');
		cy.location('pathname').should('include', '/app/quotation/new-quotation');

		cy.get_select('naming_series').should('have.value', 'SAL-QTN-.YYYY.-');
		cy.get_input('quotation_to').should('have.value', 'Customer');
		cy.set_link('party_name', 'William Harris');
		cy.get_select('order_type').should('have.value', 'Sales');
		cy.get_read_only('customer_name').should('contain', 'William Harris');

		cy.set_link('items.item_code', 'Apple iPhone 13 Pro Max');  // name
		cy.get_input('qty').focus().clear();
		cy.wait(500);
		cy.set_input('qty', '5');
		cy.get_input('qty').blur();
		cy.get_input('rate').should('have.value', '1,00,000.00');
		cy.get_read_only('amount').should('contain', '5,00,000.00');

		cy.get_read_only('total_qty').should('contain', "5");
		cy.get_read_only('total').should('contain', "₹ 5,00,000.00");
		cy.get_read_only('grand_total').should('contain', "₹ 5,00,000.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 5,00,000.00");

		cy.click_toolbar_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		cy.wait(500);

		cy.findByText('Pricing Rule').scrollIntoView().should('be.visible');
		cy.grid_open_row('pricing_rules', '1');
		cy.get_read_only('pricing_rule').should('not.have.value', 0);
		cy.get_read_only('item_code').should('contain', 'Apple iPhone 13 Pro Max');  // name
		cy.findByText('ESC').click({force: true});

		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'Open');
	});
});
