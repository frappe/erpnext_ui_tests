context("Item", () => {
	before(() => {
		cy.login();
	});

	it("Create an item", () => {
		cy.new_doc_view("Item");
		cy.get_field("item_code", "Data").type("ITM-0018");
		cy.get_field("item_group", "Link").clear().type("All Item Groups");
		cy.get_field("valuation_rate", "Data").clear().type("8000");
		cy.get_field("stock_uom", "Link").clear().type("Nos");
		cy.wait(500);
		cy.findByRole("button", { name: "Save" }).click();

		cy.get(".page-title").should("contain", "ITM-0018");
		cy.get(".page-title").should("contain", "Enabled");
		cy.get_field("item_name", "Data").should("have.value", "ITM-0018");
		cy.get_field("item_group", "Link").should(
			"have.value",
			"All Item Groups"
		);
		cy.get_field("is_stock_item", "checkbox").should("be.checked");
		cy.get_field("valuation_rate", "Data").should("have.value", "8,000.00");
		cy.get_field("stock_uom", "Link").should("have.value", "Nos");
		cy.remove_doc("Item", "ITM-0018");
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
