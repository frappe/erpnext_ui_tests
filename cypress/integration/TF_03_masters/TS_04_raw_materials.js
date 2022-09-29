context("Item", () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it("Create finished item", () => {
		let item_code = 'Marcel Coffee Table'

		cy.create_records({
            doctype: 'Item',
            item_code: item_code,
            item_group: 'All Item Groups',
			opening_stock: '1000',
			valuation_rate: '1000',
			standard_rate: '22300',
			stock_uom: 'Nos'
        });
		cy.go_to_list('Item');
		cy.list_open_row('Marcel Coffee Table');
		cy.get_page_title().should('contain', item_code);
		cy.get_page_title().should('contain',  'Enabled');
	});

	it("Create a raw material : 1", () => {
		let item_code = 'Wooden Furniture Legs 6 inch'
		cy.create_records({
            doctype: 'Item',
            item_code: item_code,
            item_group: 'Raw Material',
			opening_stock: '1000',
			valuation_rate: '1000',
			standard_rate: '1000',
			stock_uom: 'Nos'
        });
		cy.go_to_list('Item');
		cy.list_open_row('Wooden Furniture Legs 6 inch');
		cy.get_page_title().should('contain', item_code);
		cy.get_page_title().should('contain',  'Enabled');
	});

	it("Create a raw material : 2", () => {
		let item_code = 'Pidilite Fevicol SR 998'
		cy.create_records({
            doctype: 'Item',
            item_code: item_code,
            item_group: 'Raw Material',
			opening_stock: '1000',
			valuation_rate: '1000',
			standard_rate: '1000',
			stock_uom: 'Nos'
        });
		cy.go_to_list('Item');
		cy.list_open_row('Pidilite Fevicol SR 998');
		cy.get_page_title().should('contain', item_code);
		cy.get_page_title().should('contain',  'Enabled');
	});

	it('Create a raw material : 3', () => {
		let item_code = '80-grit sandpaper'
		cy.create_records({
            doctype: 'Item',
            item_code: item_code,
            item_group: 'Raw Material',
			opening_stock: '1000',
			valuation_rate: '400',
			standard_rate: '499',
			stock_uom: 'Nos'
        });
	})

	it('Create a raw material : 4', () => {
		let item_code = 'Wood Stain'
		cy.create_records({
            doctype: 'Item',
            item_code: item_code,
			item_name: 'Premium Wood Stain Fast Dry - 1L',
            item_group: 'Raw Material',
			opening_stock: '1000',
			valuation_rate: '1000',
			standard_rate: '1499',
			stock_uom: 'Nos'
        });
	})

	it('Create a raw material : 5', () => {
		let item_code = 'Paint brush'
		cy.create_records({
            doctype: 'Item',
            item_code: item_code,
			item_name: 'Linzer 3121 Wood Stain Brush',
            item_group: 'Raw Material',
			opening_stock: '1000',
			valuation_rate: '599',
			standard_rate: '599',
			stock_uom: 'Nos'
        });
	})
});
