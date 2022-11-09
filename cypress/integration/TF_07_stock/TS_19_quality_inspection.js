context("Quality Inspection", () => {
	before(() => {
		cy.login();
	});

	it("Create an item with quality inspection enabled", () => {
		let item_code = 'Study Table'
		cy.new_doc("Item");
		cy.set_input('item_code', item_code);
		cy.set_link('item_group','All Item Groups');
		cy.set_input('opening_stock', '1000');
		cy.set_input('valuation_rate', '11000');
		cy.set_input('standard_rate', '11999');
		cy.set_link('stock_uom', 'Nos');
		cy.click_tab('Quality');
		cy.set_link('quality_inspection_template', 'Quality Inspection Template - I');
		cy.get_field('inspection_required_before_delivery').check();
		cy.save();
		cy.get_page_title().should('contain', item_code);
		cy.get_page_title().should('contain',  'Enabled');
	});

	it("Create a DN and check Quality Inspection behaviour", () => {
		cy.new_doc("Delivery Note");
		cy.set_link('customer', 'William Harris');
		cy.grid_open_row('items', 1);
		cy.set_link('item_code', 'Study Table');
		cy.set_input('qty', '1');
		cy.set_link('warehouse', 'Stores - WP');
		cy.close_grid_edit_modal();
		cy.save();
		//cy.wait(500);
		//cy.click_toolbar_button('Submit');
		//cy.click_modal_primary_button('Yes');
		cy.on('window:alert',  (str) =>  {
			expect(str).to.equal(`Inspection Required`)
		});
 		cy.get('.msgprint').invoke('text').should('contain', 'Row #1: Quality Inspection is required for Item Study Table');
	});

	it("Create Quality Inspection", () => {
		cy.visit('app/delivery-note');
		cy.click_listview_row_item(0);
		cy.click_dropdown_action('Create', 'Quality Inspection(s)');
		cy.click_modal_primary_button('Create');
		cy.get_select('inspection_type', 'Incoming');
		cy.get_select('reference_type', 'Delivery Note');
		cy.set_input('sample_size', '1');
		cy.get_field('quality_inspection_template').should('have.value', 'Quality Inspection Template - I');

		//Setting Readings for QI
		cy.grid_open_row('readings', 1);
		cy.get_input('specification').should('have.value', 'Weight check');
		cy.get_select('status').should('contain', 'Accepted');
		cy.set_input('reading_1', '330');
		cy.close_grid_edit_modal();
		cy.grid_open_row('readings', 2);
		cy.get_input('specification').should('have.value', 'Loading test with 80 kg force');
		cy.get_select('status').should('contain', 'Accepted');
		cy.set_input('reading_1', '310');
		cy.close_grid_edit_modal();
		cy.grid_open_row('readings', 3);
		cy.get_input('specification').should('have.value', 'Bending strength');
		cy.get_select('status').should('contain', 'Accepted');
		cy.set_input('reading_1', '12000');
		cy.close_grid_edit_modal();
		cy.grid_open_row('readings', 4);
		cy.get_input('specification').should('have.value', 'Compressive strength');
		cy.get_select('status').should('contain', 'Accepted');
		cy.set_input('reading_1', '7830');
		cy.close_grid_edit_modal();
		cy.save();
		cy.wait(500);
		cy.submit_doc('Submitted');

		//Now try submitting DN
		cy.visit('app/delivery-note');
		cy.click_listview_row_item(0);
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
	});
});

