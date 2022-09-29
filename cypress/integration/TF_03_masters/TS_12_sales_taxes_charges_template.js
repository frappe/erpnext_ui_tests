context('Sales Taxes and Charges Tax Template', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Create test Output Tax IGST, CGST and SGST Accounts', () => {
		// test Output Tax IGST account creation
		cy.create_records({
            doctype: 'Account',
			account_name: "test Output Tax IGST",
			is_group: 0,
			root_type: "Liability",
			report_type: "Balance Sheet",
			parent_account: "Duties and Taxes - WP",   // name
			account_type: "Tax",
			tax_rate: 18
		});

		// test Output Tax SGST account creation
		cy.create_records({
            doctype: 'Account',
			account_name: "test Output Tax SGST",
			is_group: 0,
			root_type: "Liability",
			report_type: "Balance Sheet",
			parent_account: "Duties and Taxes - WP",   // name
			account_type: "Tax",
			tax_rate: 9
		});

		// test Output Tax CGST account creation
		cy.create_records({
            doctype: 'Account',
			account_name: "test Output Tax CGST",
			is_group: 0,
			root_type: "Liability",
			report_type: "Balance Sheet",
			parent_account: "Duties and Taxes - WP",   // name
			account_type: "Tax",
			tax_rate: 9
		});
	});

	it('Create a test Output GST Out-state - Sales taxes & charges template', () => {
		cy.create_records({
            doctype: 'Sales Taxes and Charges Template',
			title: "test Output GST Out-state",
			tax_category: "test out-state category"
		});
		cy.go_to_list('Sales Taxes and Charges Template');
		cy.list_open_row('test Output GST Out-state');
		cy.grid_add_row('taxes');
		cy.grid_open_row('taxes', 1);
		cy.set_select('charge_type', 'On Net Total');
		cy.set_link('account_head', 'test Output Tax IGST -');
		cy.get_input('rate').should('have.value', '18.000');
		cy.close_grid_edit_modal();
		cy.save();
	});

	it('Create a test Output GST In-state - Sales taxes & charges template', () => {
		cy.call(
			"erpnext_ui_tests.test_utils.tax_template.create_sales_tax_template"
		);
	});
});
