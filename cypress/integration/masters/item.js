context("Item", () => {
	before(() => {
		cy.login();
	});

	it("Create an item", () => {
		let item_code = 'Birch Ply'
		cy.new_doc("Item");
		cy.set_input('item_code', item_code);
		cy.set_link('item_group','Raw Material');
		cy.set_input('valuation_rate', '1000');
		cy.set_link('stock_uom', 'Nos');
		cy.save();

		cy.get_page_title().should('contain', item_code);
		cy.get_page_title().should('contain',  'Enabled');

		cy.compare_document({
			item_name: item_code,
			valuation_rate: "1000",
			item_group: "Raw Material",
			stock_uom: "Nos",
			is_stock_item: 1,
			uoms: [{ uom: "Nos", conversion_factor: 1 }],
		});
	});

	it('Create another item', () => {
		let item_code = 'WB-001'
		cy.new_doc("Item");
		cy.set_input('item_code', item_code);
		cy.set_input('item_name', 'Wooden Bar 2in x 2in x 20in');
		cy.set_link('item_group','Raw Material');
		cy.set_input('valuation_rate', '400');
		cy.set_link('stock_uom', 'Nos');
		cy.save();
	})
});
