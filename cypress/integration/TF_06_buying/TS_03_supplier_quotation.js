context('Supplier Quotation', () => {
	before(() => {
		cy.login();
	});

	it('Create Supplier Quotation from the Request for Quotation', () => {
		cy.visit('app/request-for-quotation/');
		cy.click_listview_row_item(0);
		cy.click_dropdown_action('Create', 'Supplier Quotation');
		cy.set_link('supplier', 'Lisa Davis');
		cy.click_modal_primary_button('Create');

		cy.url().should('include', '/app/supplier-quotation/new-supplier-quotation');

		cy.get_select('naming_series').should('have.value', 'PUR-SQTN-.YYYY.-');
		cy.get_read_only('status').should('contain', "Draft");
		cy.get_input('supplier').should('have.value', 'Lisa Davis');
		cy.get_input('transaction_date').should('not.have.value', 0);
		cy.get_input('valid_till').should('not.have.value', 0);

		cy.get_input('items.item_code').should('have.value', 'Apple iPhone 13 Pro Max');
		cy.get_input('qty').should('have.value', "10.000");
		cy.get_input('uom').should('have.value', "Nos");
		cy.get_input('rate').should('have.value', "1,10,000.00");
		cy.get_read_only('amount').should('contain', "11,00,000.00");

		cy.get_read_only('total_qty').should('contain', "10");
		cy.get_read_only('total').should('contain', "₹ 11,00,000.00");
		cy.get_read_only('grand_total').should('contain', "₹ 11,00,000.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 11,00,000.00");

		cy.save();
		cy.get_page_title().should('contain', 'Draft');
		cy.submit_doc('Submitted');
	});
});
