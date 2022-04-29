context("Stock Settings", () => {
	before(() => {
		cy.login();
	});

	it("Set Item Defaults", () => {
		cy.new_doc('Stock Settings');
		cy.get_field('item_naming_by', 'Select').select('Item Code');
		cy.get_field('item_naming_by', 'Select').should('have.value', 'Item Code');
		cy.set_link('default_warehouse', 'Stores - WP');
		cy.set_link('item_group', 'All Item Groups');
        cy.get_input('item_group', 'Link').should('have.value', 'Nos');
		cy.set_link('stock_uom', 'Nos');
	    cy.get_input('uom', 'Data').should('have.value', 'Nos');
		cy.contains('Stock Validations').click();
		cy.get_field('show_barcode_field', 'checkbox').check();
		cy.get_input('show_barcode_field', 'checkbox').should('be.checked');
		cy.wait(500);
		cy.save();
	});

	it("Check if all options set under item defaults are working", () => {
	    cy.new_doc('Item');
		cy.set_input('item_code', 'Teak 3-Sides Glass Cabinet');

		//Check if Item Group is set as per item defaults in stock settings
		cy.get_input('item_group', 'Link').should('have.value','All Item Groups');

		//Check if Stock UOM is set as per item defaults in stock settings
		cy.get_input('stock_uom', 'Link').should('have.value','Nos');
		cy.set_input('standard_rate', '123.000');

		//Check for default warehouse : if it's the same as set as per Stock Settings
		cy.get('.frappe-control[data-fieldname="item_defaults"]').as('table');
		cy.get('@table').findByRole('button', {name: 'Add Row'}).click();
 		cy.get('@table').find('[data-idx="1"]').as('row1');
 		cy.get('@row1').find('.btn-open-row').click();

		//cy.get_field('company', 'Link').clear().type('Wind Power LLC', {delay: 200});
		cy.get_input('company', 'Link').should('have.value','Wind Power LLC');
		cy.set_input('default_warehouse', 'Stores - WP');
		cy.get_input('default_warehouse', 'Link').should('have.value','Stores - WP');
        cy.get('.grid-collapse-row').click();
		cy.save();

		//Check if item naming is done as per Item Code
		cy.get_page_title().should('contain', 'Teak 3-Sides Glass Cabinet');
 		cy.get_page_title().should('contain',  'Enabled');
	});

	it("Check if Item Price has been inserted as per standard selling rate as auto insert price list option was unchecked", () => {
	    cy.new_doc('Item Price');
        cy.click_listview_row_item(0);
	    cy.get_input('price_list_rate', 'Currency').should('not.have.value','0');
	    cy.remove_doc("Item", "Pen");
	});

	it("Check if barcode field appears in stock transactions ", () => {
			cy.new_doc
			cy.get('.frappe-control[data-fieldname="items"]').as('table');
        	cy.get('@table').find('[data-idx="1"]').as('row1');
        	cy.get('@row1').find('.btn-open-row').click();
			cy.get_field('barcode', 'Link').should('be.visible');
	});
});
