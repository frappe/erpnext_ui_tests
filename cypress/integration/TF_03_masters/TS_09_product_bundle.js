context("Product Bundle", () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it("Create Parent Item", () => {
		let item_code = 'Single Seater Sofa Set With Table Set of 3'
		cy.create_records({
            doctype: 'Item',
            item_code: item_code,
            item_group: 'All Item Groups',
			is_stock_item: 0,
			standard_rate: '40000',
			stock_uom: 'Nos'
        });
		cy.go_to_list('Item');
		cy.list_open_row(item_code);
		cy.get_page_title().should('contain', item_code);
		cy.get_page_title().should('contain',  'Enabled');
	});

	it("Create child item 1", () => {
		let item_code = 'Pristine White Single Seater Sofa Set'
		cy.call(
			"erpnext_ui_tests.test_utils.product_bundle.create_child_item"
		);
		cy.go_to_list('Item');
		cy.list_open_row(item_code);
		cy.get_page_title().should('contain', item_code);
		cy.get_page_title().should('contain',  'Enabled');
	});

	it("Create child item 2", () => {
		let item_code = 'Coffee Table'
		cy.create_records({
            doctype: 'Item',
            item_code: item_code,
            item_group: 'All Item Groups',
			opening_stock: '1000',
			valuation_rate: '20000',
			standard_rate: '20000',
			stock_uom: 'Nos'
        });
		cy.go_to_list('Item');
		cy.list_open_row(item_code);
		cy.get_page_title().should('contain', item_code);
		cy.get_page_title().should('contain',  'Enabled');
	});

	it("Create Product Bundle", () => {
			cy.call(
				"erpnext_ui_tests.test_utils.product_bundle.create_product_bundle1"
			);
	});
});
