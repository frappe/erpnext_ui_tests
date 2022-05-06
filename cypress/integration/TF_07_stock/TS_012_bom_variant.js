context("Bill of Materials", () => {
	before(() => {
		cy.login();
	});

	it('Enable item for having stock', () => {
		cy.visit('app/item/Classic%20Center%20Table');
		cy.get_field('is_stock_item', 'checkbox').check();
		cy.get_input('is_stock_item', 'checkbox').should('be.checked');
	});

	it('Create a BOM for a template item', () => {
		cy.new_doc("BOM");
		cy.set_link('item', 'Classic Center Table');
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

        cy.set_link('item', 'Classic Center Table-TEAK');
		cy.click_modal_primary_button('Create').click();
		cy.get_field('item', 'Link').should('have.value', 'Classic Center Table-TEAK');
		cy.save();
		cy.wait(500);
		cy.submit('Default');
		cy.wait(500);
		cy.get_page_title().should('contain', 'Default');
		cy.click_toolbar_button('Browse BOM');
		cy.location("pathname").should("eq","/app/bom/view/tree");
	});
});


