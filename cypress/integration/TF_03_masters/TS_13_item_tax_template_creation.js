context('Item Tax Template Creation', () => {
	before(() => {
		cy.login();
	});

	it('Create a test item tax template - GST 12%', () => {
		cy.visit('/app/item-tax-template');
		cy.new_doc("Item Tax Template");
		cy.set_input('title','test GST 12%');
		cy.set_link('taxes.tax_type', 'test Output Tax CGST - ');
		cy.set_input('tax_rate', '6');
		cy.grid_add_row('taxes');
		cy.set_link('taxes.tax_type', 'test Output Tax SGST - ');
		cy.set_input('tax_rate', '6');
		cy.grid_add_row('taxes');
		cy.set_link('taxes.tax_type', 'test Output Tax IGST - ');
		cy.set_input('tax_rate', '12');
		cy.save();
	});

	it('Create a test item tax template - GST 5%', () => {
		cy.insert_doc(
			"Item Tax Template",
			{
				"title": "test GST 5%",
				"taxes": [
					{
						"tax_type": "test Output Tax SGST - WP",   // name
						"tax_rate": 2.5
					},
					{
						"tax_type": "test Output Tax CGST - WP",   // name
						"tax_rate": 2.5
					},
					{
						"tax_type": "test Output Tax IGST - WP",   // name
						"tax_rate": 5
					}
				]
			},
			true
		)
	});
});
