context("Item", () => {
	before(() => {
		cy.login();
	});

	it("Create finished item", () => {
		let item_code = 'Marcel Coffee Table'
		cy.new_doc("Item");
		cy.set_input('item_code', item_code);
		cy.set_link('item_group','All Item Groups');
		cy.set_input('opening_stock', '1000');
		cy.set_input('valuation_rate', '1000');
		cy.set_input('standard_rate', '22300');
		cy.set_link('stock_uom', 'Nos');
		cy.save();
		cy.get_page_title().should('contain', item_code);
		cy.get_page_title().should('contain',  'Enabled');
	});

	it.only("Create a raw material : 1", () => {
		let item_code = 'Wooden Furniture Legs 6 inch'
		cy.new_doc("Item");
		cy.set_input('item_code', item_code);
		cy.set_link('item_group', 'Raw Material');
		cy.set_input('opening_stock', '1000');
		cy.set_input('valuation_rate', '1000');
		cy.set_input('standard_rate', '1000');
		cy.set_link('stock_uom', 'Nos');
		cy.save();
		cy.get_page_title().should('contain', item_code);
		cy.get_page_title().should('contain',  'Enabled');
	});

	it("Create a raw material : 2", () => {
		let item_code = 'Pidilite Fevicol SR 998'
		cy.new_doc("Item");
		cy.set_input('item_code', item_code);
		cy.set_link('item_group','Raw Material');
		cy.set_input('valuation_rate', '1000');
		cy.set_input('standard_rate', '1000');
		cy.set_link('stock_uom', 'Nos');
		cy.save();
		cy.get_page_title().should('contain', item_code);
		cy.get_page_title().should('contain',  'Enabled');
	});

	it('Create a raw material : 3', () => {
		let item_code = '80-grit sandpaper'
		cy.new_doc("Item");
		cy.set_input('item_code', item_code);
		cy.set_link('item_group','Raw Material');
		cy.set_input('valuation_rate', '400');
		cy.set_input('standard_rate', '499');
		cy.set_link('stock_uom', 'Nos');
		cy.save();
	})

	it('Create a raw material : 4', () => {
		let item_code = 'Wood Stain'
		cy.new_doc("Item");
		cy.set_input('item_code', item_code);
		cy.set_input('item_name', 'Premium Wood Stain Fast Dry - 1L');
		cy.set_link('item_group','Raw Material');
		cy.set_input('valuation_rate', '1000');
		cy.set_input('standard_rate', '1499');
		cy.set_link('stock_uom', 'Nos');
		cy.save();
	})

	it('Create a raw material : 5', () => {
		let item_code = 'Paint brush'
		cy.new_doc("Item");
		cy.set_input('item_code', item_code);
		cy.set_input('item_name', 'Linzer 3121 Wood Stain Brush');
		cy.set_link('item_group','Raw Material');
		cy.set_input('valuation_rate', '599');
		cy.set_input('standard_rate', '599');
		cy.set_link('stock_uom', 'Nos');
		cy.save();
	})
});
