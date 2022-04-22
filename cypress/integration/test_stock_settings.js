context("Stock Settings", () => {
	before(() => {
		cy.login();
	});

	it("Set Item Defaults", () => {
		cy.visit(`app/stock-settings`);
		cy.get_field('item_naming_by', 'Select').select('Item Code');
		cy.get_field('item_naming_by', 'Select').should('have.value', 'Item Code');
		cy.get_field('default_warehouse', 'Link').clear().type('Stores - WPL', {delay: 200});
		cy.get_field('default_warehouse', 'Link').should('have.value','Stores - WPL');
		cy.get_field('item_group', 'Link').clear().type('All Item Groups', {delay: 200});
		cy.get_field('item_group', 'Link').should('have.value','All Item Groups');
		cy.get_field('stock_uom', 'Link').clear().type('Nos', {delay: 200});
		cy.get_field('stock_uom', 'Link').should('have.value','Nos');
		cy.contains('Stock Validations').click();
		cy.get_field('show_barcode_field', 'checkbox').check();
		cy.get_field('show_barcode_field', 'checkbox').should('be.checked');
		cy.wait(500);
		cy.findByRole("button", { name: 'Save' }).trigger("click", {force: true});
	});

	it("Check if all options set under item defaults are working", () => {
	    cy.visit(`app/item/new-item-1`);
		cy.get_field("item_code", "Data").type('ITM-0005', {delay: 200});

		//Check if Item Group is set as per item defaults in stock settings
		cy.get_field('item_group', 'Link').should('have.value','All Item Groups');

		//Check if Stock UOM is set as per item defaults in stock settings
		cy.get_field('stock_uom', 'Link').should('have.value','Nos');
		cy.get_field('standard_rate', 'Currency').type('123.00', {delay: 200});

		//Check for default warehouse : if it's the same as set as per Stock Settings
		cy.get('.frappe-control[data-fieldname="item_defaults"]').as('table');
		cy.get('@table').findByRole('button', {name: 'Add Row'}).click();
 		cy.get('@table').find('[data-idx="1"]').as('row1');
 		cy.get('@row1').find('.btn-open-row').click();
		cy.get_field('company', 'Link').clear().type('Wind Power LLC', {delay: 200});
		cy.get_field('company', 'Link').should('have.value','Wind Power LLC');
		cy.get_field('default_warehouse', 'Link').should('have.value','Stores - WPL');
        cy.get('.grid-collapse-row').click();
		cy.findByRole("button", { name: "Save" }).click();

		//Check if item naming is done as per Item Code
		cy.get(".page-title").should("contain", "ITM-0005");
	});
		it("Check if Item Price has been inserted as per standad selling rate as auto insert price list option was unchecked", () => {
		cy.visit(`app/item-price`);
        cy.click_listview_row_item(0);
		cy.get_field('price_list_rate', 'Currency').should('not.have.value','0');
		cy.remove_doc("Item", "ITM-0005");
	});
		it("Check if barcode field appears in stock transactions ", () => {
			cy.visit(`app/purchase-receipt/new-purchase-receipt-1`);
			cy.get('.frappe-control[data-fieldname="items"]').as('table');
        	cy.get('@table').find('[data-idx="1"]').as('row1');
        	cy.get('@row1').find('.btn-open-row').click();
			cy.get_field('barcode', 'Link').should('be.visible');
});
});
