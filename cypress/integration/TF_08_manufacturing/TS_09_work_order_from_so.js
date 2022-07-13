context('Create Sales Order', () => {
	before(() => {
		cy.login();
	});

	it('Create Sales Order', () => {
		cy.new_doc("Sales Order");
		cy.url().should('include', '/app/sales-order/new-sales-order');
		cy.get_select('naming_series').should('have.value', 'SAL-ORD-.YYYY.-');
		cy.set_link('customer', 'William Harris');
		cy.get_input('customer').should('have.value', 'William Harris');
		cy.get_select('order_type').should('have.value', 'Sales');
		cy.set_today('delivery_date');
		cy.click_section('Currency and Price List');
		cy.open_section('Currency and Price List');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_input('selling_price_list').should('have.value', 'Standard Selling');
		cy.grid_open_row('items', '1');
		cy.set_link('item_code', 'Marcel Coffee Table');
		cy.set_input('qty', '1');
		cy.set_link('warehouse', 'Stores - WP');
		cy.get_input('rate').should('have.value', "22,300.00");
		cy.get_input('qty').should('have.value', "1.000");
		cy.close_grid_edit_modal();
		cy.get_read_only('amount').should('contain', "22,300.00");
		cy.get_read_only('total_qty').should('contain', "1");
		cy.get_read_only('total').should('contain', "₹ 22,300.00");
		cy.save();
		cy.get_page_title().should('contain', 'Draft');
		cy.submit('To Deliver and Bill');
		cy.click_toolbar_button('Update Items');
		cy.set_input('trans_items.qty', '2');
		cy.grid_add_row('trans_items');
		cy.grid_delete_row('trans_items','2');
		cy.click_modal_primary_button('Update');
		cy.get_read_only('total_qty').should('contain', "2");
		cy.click_dropdown_action('Create', 'Work Order');
		cy.click_modal_grid_row_checkbox('items', 1);
		cy.click_modal_primary_button('Create');
		cy.on('window:alert',  (str) =>  {
            expect(str).to.equal(`Message`)});
 		cy.get_error_msg().should('contain', 'Work Orders Created:');
	});

	it('Check Work Order created', () => {
		cy.visit('app/work-order/view/list');
		cy.click_listview_row_item(0);
		cy.get_input('production_item').should('have.value', 'Marcel Coffee Table');
		cy.get_input('qty', '2');
		cy.get_input('fg_warehouse').should('have.value', 'Stores - WP');
		cy.get_read_only('status').should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.on('window:alert',  (str) =>  {
            expect(str).to.equal(`Missing Fields`)});
 		cy.get_error_msg().should('contain', 'Mandatory fields required in Work Order');
		cy.hide_dialog();
		cy.set_link('wip_warehouse', 'Work In Progress - WP');
		cy.click_toolbar_button('Save');
		cy.on('window:alert',  (str) =>  {
            expect(str).to.equal(`Missing Fields`)});
		cy.hide_dialog();
		cy.set_link('source_warehouse', 'Stores - WP');
		cy.save();
		cy.submit('Not Started');
});
});
