context("Bill of Materials", () => {
	before(() => {
		cy.login();
	});

	it("Create attributes first", () => {
		cy.new_doc('Item Attribute');
		cy.grid_add_row('item_attribute_values');
        cy.set_input('attribute_name', 'Wood Type');
		cy.set_input('item_attribute_values.attribute_value', 'Teak');
		cy.set_input('item_attribute_values.abbr', 'Teak');
		cy.grid_add_row('item_attribute_values');
        cy.set_input('attribute_name', 'Wood Type');
		cy.set_input('item_attribute_values.attribute_value', 'Sheesham');
		cy.set_input('item_attribute_values.abbr', 'Sheesham');
		cy.grid_add_row('item_attribute_values');
        cy.set_input('attribute_name', 'Wood Type');
		cy.set_input('item_attribute_values.attribute_value', 'Acacia');
		cy.set_input('item_attribute_values.abbr', 'Acacia');
		cy.save();
		cy.wait(500);
    });

	it("Create a template item", () => {
		cy.new_doc('Item');
        cy.set_input('item_code', 'Classic Dining Table');
		cy.set_link('item_group','All Item Groups');
		//cy.set_input('opening_stock', '100');
		cy.set_input('valuation_rate', '20000');
		cy.set_input('standard_rate', '24999');
		cy.set_link('stock_uom', 'Nos');
		cy.get_field('is_stock_item', 'checkbox').check();
		cy.get_input('is_stock_item', 'checkbox').should('be.checked');
		cy.click_section('Variants');
		cy.open_section('Variants');
		cy.get_field('has_variants', 'checkbox').check();
		cy.get_input('has_variants', 'checkbox').should('be.checked');
		cy.set_select('variant_based_on', 'Item Attribute');
		cy.grid_add_row('attributes');
        cy.set_input('attributes.attribute', 'Wood Type');
		cy.save();
		cy.wait(500);
		cy.get_page_title().should('contain', 'Classic Dining Table');
		cy.get_page_title().should('contain',  'Template');
	});

	it("Create item variants and verify", () => {
		cy.visit('app/item/Classic%20Dining%20Table');
		cy.click_dropdown_action('Create', 'Multiple Variants');
		cy.get_field('Teak', 'checkbox').check();
		cy.get_field('Sheesham', 'checkbox').check();
		cy.get_field('Acacia', 'checkbox').check();
		cy.findByRole('button', {name: 'Make 3 Variants'}).click();
		cy.click_dropdown_action('View', 'Show Variants');
		cy.location("pathname").should("eq","/app/item");
		cy.click_listview_row_item(0);
		cy.get_field('variant_of', 'Link').should('have.value', 'Classic Dining Table');
		cy.get_page_title().should('contain',  'Variant');
    });

	it('Create a BOM for a template item', () => {
		cy.new_doc("BOM");
		cy.set_link('item', 'Classic Dining Table');
		cy.get_field('with_operations', 'checkbox').check();
		cy.get_field('with_operations', 'checkbox').should('be.checked');
		cy.get_select('transfer_material_against', 'Work Order');

		//Setting operations
		cy.grid_add_row('operations');
		cy.set_link('operations.operation', 'Attaching the table top with legs');
		cy.set_input('operations.time_in_mins', '1440');
		cy.grid_add_row('operations');
		cy.set_link('operations.operation', 'Sanding  the table');
		cy.set_input('operations.time_in_mins', '2880');
		cy.grid_add_row('operations');
		cy.set_link('operations.operation', 'Staining the table');
		cy.set_input('operations.time_in_mins', '2880');

		//Setting items
		cy.grid_add_row('items');
		cy.set_link('items.item_code', 'Scrapwood table top');
		cy.set_input('items.qty', '1');
		cy.grid_add_row('items');
		cy.set_link('items.item_code', 'Wooden Furniture Legs 6 inch');
		cy.set_input('items.qty', '1');
		cy.grid_add_row('items');
		cy.set_link('items.item_code', 'Pidilite Fevicol SR 998');
		cy.set_input('items.qty', '1');
		cy.grid_add_row('items');
		cy.set_link('items.item_code', '80-grit sandpaper');
		cy.set_input('items.qty', '1');
		cy.grid_add_row('items');
		cy.set_link('items.item_code', 'Paint brush');
		cy.set_input('items.qty', '1');
		cy.save();
		cy.wait(500);
		cy.submit('Template');
		cy.wait(500);

        //Create Variant BOM
		cy.click_dropdown_action('Create', 'Variant BOM');
        cy.on('window:alert',  (str) =>  {
            expect(str).to.equal(`Variant BOM`)});

        cy.set_link('item', 'Classic Dining Table-TEAK');
		cy.click_modal_primary_button('Create');
		cy.get_field('item', 'Link').should('have.value', 'Classic Dining Table-TEAK');
		cy.save();
		cy.wait(500);
		cy.submit('Default');
		cy.wait(500);
		cy.get_page_title().should('contain', 'Default');
		cy.click_toolbar_button('Browse BOM');
		cy.location("pathname").should("eq","/app/bom/view/tree");
	});
});


