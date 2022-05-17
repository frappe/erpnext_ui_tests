context('Production Plan', () => {
	before(() => {
        cy.login();
    });

	it('Create a Sales Order', () => {
		cy.new_doc("Sales Order");
		cy.set_link('customer', 'William Harris');
		cy.set_select('order_type', 'Sales');
		cy.set_today('delivery_date');
		cy.set_link('items.item_code', 'Classic Dining Table-ACACIA');
		cy.set_input('items.qty', '1');
		cy.grid_open_row('items', 1);
		cy.set_link('warehouse', 'Stores - WP');
		cy.save();
		cy.wait(500);
		cy.submit('To Deliver and Bill');
		});

	it('Create Production Plan', () => {
		cy.new_doc("Production Plan");
		cy.set_select('get_items_from', 'Sales Order');

		//Set filters to find Sales Order
		cy.set_link('item_code', 'Classic Dining Table-ACACIA');
		cy.set_select('sales_order_status', 'To Deliver and Bill');
		cy.findByRole('button', {name: 'Get Sales Orders'}).click();
		cy.findByRole('button', {name: 'Get Finished Goods for Manufacture'}).click();

		//Setting items
		cy.grid_open_row('po_items', 1);
		cy.get_input('planned_qty', '1');
		cy.get_read_only('pending_qty').should('contain', '1');
		cy.close_grid_edit_modal();

		//Setting material requirements planning
		cy.get_field('ignore_existing_ordered_qty', 'checkbox').check();
		cy.get_field('ignore_existing_ordered_qty', 'checkbox').should('be.checked');
		cy.set_link('for_warehouse', 'Work in Progress - WP');
		cy.findByRole('button', {name: 'Get Raw Materials For Production'}).click();
		cy.save();
		cy.wait(500);
		cy.submit('Not Started');
		cy.get_page_title().should('contain', 'Not Started');
	});
});

