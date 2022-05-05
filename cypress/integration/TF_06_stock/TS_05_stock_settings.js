context("Stock Settings", () => {
	before(() => {
		cy.login();
	});

	it("Set Item Defaults", () => {
		cy.visit(`app/stock-settings`);
		cy.get_field('item_naming_by', 'Select').select('Item Code');
		cy.get_field('item_naming_by', 'Select').should('have.value', 'Item Code');
		cy.set_link('default_warehouse', 'Stores - WP');
		cy.set_link('item_group', 'All Item Groups');
		cy.get_input('item_group', 'Link').should('have.value', 'All Item Groups');
		cy.set_link('stock_uom', 'Nos');
		cy.get_input('stock_uom', 'Data').should('have.value', 'Nos');

		cy.contains('Stock Validations').click();
		cy.get_field('show_barcode_field', 'checkbox').check();
		cy.get_input('show_barcode_field', 'checkbox').should('be.checked');
		cy.wait(500);
		cy.save();
	});

	it("Check if all options set under item defaults are working", () => {
	    cy.new_doc('Item');
		cy.set_input('item_code', 'Scrapwood table top');

		//Check if Item Group is set as per item defaults in stock settings
		cy.get_input('item_group', 'Link').should('have.value','All Item Groups');

		//Check if Stock UOM is set as per item defaults in stock settings
		cy.get_input('stock_uom', 'Link').should('have.value','Nos');
		cy.set_input('standard_rate', '12300.00');
		cy.save();
		cy.wait(500);

		//Check if item naming is done as per Item Code
		cy.get_page_title().should('contain', 'Scrapwood table top');
 		cy.get_page_title().should('contain',  'Enabled');
	});

	it("Check if Item Price has been inserted as per standard selling rate as auto insert price list option was unchecked", () => {
		cy.visit(`app/item-price`);
        cy.click_listview_row_item(0);
	    cy.get_input('price_list_rate', 'Currency').should('not.have.value','0');
	});

	it("Check if barcode field appears in stock transactions ", () => {
		cy.new_doc('Delivery Note')

		cy.grid_open_row('items', 1);
		cy.get_input('barcode', 'Link').should('be.visible');
	});
});

