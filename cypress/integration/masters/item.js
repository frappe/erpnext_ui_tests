context("Item", () => {
	before(() => {
		cy.login();
	});

	it("Create an item", () => {
		cy.new_doc("Item");
		cy.set_input('item_code', 'Fairylights');
		cy.set_link('item_group','All Item Groups');
		cy.set_input('valuation_rate', '8000');
		cy.set_link('stock_uom', 'Nos');
		cy.wait(500);
		cy.click_toolbar_button('Save');

		cy.get_page_title().should('contain', 'Fairylights');
		cy.get_page_title().should('contain',  'Enabled');

		cy.compare_document({
			item_name: "Fairylights",
			valuation_rate: "8000",
			item_group: "All Item Groups",
			stock_uom: "Nos",
			is_stock_item: 1,
			uoms: [{ uom: "Nos", conversion_factor: 1 }],
		});

		cy.remove_doc("Item", "Fairylights");
	});
});

context("Item dashboard", () => {
	before(() => {
		cy.login();
		cy.insert_doc(
			"Item",
			{
				item_code: "e2e_test_item",
				item_group: "All Item Groups",
				opening_stock: 42,
				valuation_rate: 100,
			},
			true
		);
		cy.go_to_doc("item", "e2e_test_item");
	});

	it("should show dashboard with correct data on first load", () => {
		cy.findByText("Stock Levels").should("be.visible");
		cy.get(".stock-levels").contains("e2e_test_item").should("exist");

		// reserved and available qty
		cy.get(".stock-levels .inline-graph-count")
			.eq(0)
			.contains("0")
			.should("exist");
		cy.get(".stock-levels .inline-graph-count")
			.eq(1)
			.contains("42")
			.should("exist");
	});

	it("should persist on field change", () => {
		cy.get('input[data-fieldname="disabled"]').check();
		cy.wait(500);
		cy.findByText("Stock Levels").should("be.visible");
		cy.get(".stock-levels").should("have.length", 1);
	});

	it("should persist on reload", () => {
		cy.reload();
		cy.findByText("Stock Levels").should("be.visible");
	});
});
