context('Item Tax Template Creation', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Create a test item tax template - GST 12%', () => {
		cy.call(
			"erpnext_ui_tests.test_utils.tax_template.create_item_tax_template1"
		);
	});

	it('Create a test item tax template - GST 5%', () => {
		cy.call(
			"erpnext_ui_tests.test_utils.tax_template.create_item_tax_template"
		);
	});
});
