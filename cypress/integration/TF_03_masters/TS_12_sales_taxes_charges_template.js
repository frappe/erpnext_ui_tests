context('Sales Taxes and Charges Tax Template', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Create test Output Tax IGST, CGST and SGST Accounts', () => {
		// test Output Tax IGST account creation
		cy.insert_doc(
			"Account",
			{
				"account_name": "test Output Tax IGST",
				"is_group": 0,
				"root_type": "Liability",
				"report_type": "Balance Sheet",
				"parent_account": "Duties and Taxes - WP",   // name
				"account_type": "Tax",
				"tax_rate": 18,
			},
			true
		)

		// test Output Tax SGST account creation
		cy.insert_doc(
			"Account",
			{
				"account_name": "test Output Tax SGST",
				"is_group": 0,
				"root_type": "Liability",
				"report_type": "Balance Sheet",
				"parent_account": "Duties and Taxes - WP",   // name
				"account_type": "Tax",
				"tax_rate": 9,
			},
			true
		)

		// test Output Tax CGST account creation
		cy.insert_doc(
			"Account",
			{
				"account_name": "test Output Tax CGST",
				"is_group": 0,
				"root_type": "Liability",
				"report_type": "Balance Sheet",
				"parent_account": "Duties and Taxes - WP",   // name
				"account_type": "Tax",
				"tax_rate": 9,
			},
			true
		)
	});

	it('Create a test Output GST Out-state - Sales taxes & charges template', () => {
		cy.visit('/app/sales-taxes-and-charges-template');
		cy.new_doc("Sales Taxes and Charges Template");
		cy.set_input('title','test Output GST Out-state');
		cy.set_link('tax_category','test out-state category');
		cy.grid_add_row('taxes');
		cy.grid_open_row('taxes', 1);
		cy.set_select('charge_type', 'On Net Total');
		cy.set_link('account_head', 'test Output Tax IGST -');
		cy.get_input('rate').should('have.value', '18.000');
		cy.close_grid_edit_modal();
		cy.save();
	});

	it('Create a test Output GST In-state - Sales taxes & charges template', () => {
		cy.insert_doc(
			"Sales Taxes and Charges Template",
			{
				"title": "test Output GST In-state",
				"tax_category": "test in-state category",
				"taxes": [
					{
						"charge_type": "On Net Total",
						"account_head": "test Output Tax SGST - WP",  //name
						"description": "Output Tax SGST @ 9.0",
						"rate": 9,
					},
					{
						"charge_type": "On Net Total",
						"account_head": "test Output Tax CGST - WP",  //name
						"description": "Output Tax CGST @ 9.0",
						"rate": 9,
					}
				]
			},
			true
		)
	});
});
