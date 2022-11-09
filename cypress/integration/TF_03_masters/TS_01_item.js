context("Item", () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it("Create an item", () => {
		let item_code = 'Birch Ply';

		cy.create_records({
            doctype: 'Item',
            item_code: item_code,
            item_group: 'Raw Material',
			valuation_rate: '1000',
			stock_uom: 'Nos'
        });
		cy.go_to_list('Item');
		cy.list_open_row('Birch Ply');
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
		let item_code = 'WB-001';

		cy.create_records({
            doctype: 'Item',
            item_code: item_code,
			item_name: 'Wooden Bar 2in x 2in x 20in',
            item_group: 'Raw Material',
			valuation_rate: '400',
			stock_uom: 'Nos'
        });
	});

	it('Create stock item', () => {
		cy.create_records({
			doctype: 'Item',
			item_code: 'Apple iPhone 13 Pro Max',
			item_group: 'All Item Groups',
			opening_stock: '10',
			valuation_rate: '110000',
			stock_uom: 'Nos'
		});
		cy.go_to_list('Item');
		cy.list_open_row('Apple iPhone 13 Pro Max');
		cy.get_input('item_name').should('have.value', 'Apple iPhone 13 Pro Max');
	})

	it('Create stock item and add price', () => {
		cy.create_records({
			doctype: 'Item',
			item_code: 'Apple Macbook Pro 16 inch',
			item_group: 'All Item Groups',
			opening_stock: '10',
			valuation_rate: '250000',
			stock_uom: 'Nos'
		});
		cy.go_to_list('Item');
		cy.list_open_row('Apple Macbook Pro 16 inch');
		cy.get_input('item_name').should('have.value', 'Apple Macbook Pro 16 inch');

		cy.new_doc('Item Price');
		cy.url().should('include', '/app/item-price/new-item-price');
		cy.set_link('item_code', 'Apple Macbook Pro 16 inch');
		cy.set_link('price_list', 'Standard Buying');
		cy.set_input('price_list_rate', '250000');
		cy.save();
	})
});
