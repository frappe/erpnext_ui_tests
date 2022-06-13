context('Variant Item', () => {
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
        cy.set_input('item_code', 'Classic Center Table');
		cy.set_link('item_group','All Item Groups');
		cy.set_input('valuation_rate', '1000');
		cy.set_input('standard_rate', '14999');
		cy.set_link('stock_uom', 'Nos');
		cy.get_field('is_stock_item', 'checkbox').uncheck();
		cy.get_input('is_stock_item', 'checkbox').should('not.be.checked');
		cy.contains('Variants').click();
		cy.get_field('has_variants', 'checkbox').check();
		cy.get_input('has_variants', 'checkbox').should('be.checked');
		cy.set_select('variant_based_on', 'Item Attribute');
		cy.grid_add_row('attributes');
        cy.set_input('attributes.attribute', 'Wood Type');
		cy.save();
		cy.wait(500);
		cy.get_page_title().should('contain', 'Classic Center Table');
		cy.get_page_title().should('contain',  'Template');
	});

	it("Create item variants and verify", () => {
		cy.visit('app/item/Classic%20Center%20Table');
		cy.click_dropdown_action('Create', 'Multiple Variants');
		cy.get_field('Teak', 'checkbox').check();
		cy.get_field('Sheesham', 'checkbox').check();
		cy.get_field('Acacia', 'checkbox').check();
		cy.findByRole('button', {name: 'Make 3 Variants'}).click();
		cy.click_dropdown_action('View', 'Show Variants');
		cy.location("pathname").should("eq","/app/item");
		cy.click_listview_row_item(0);
		cy.get_field('variant_of', 'Link').should('have.value', 'Classic Center Table');
		cy.get_page_title().should('contain',  'Variant');
    });
});
