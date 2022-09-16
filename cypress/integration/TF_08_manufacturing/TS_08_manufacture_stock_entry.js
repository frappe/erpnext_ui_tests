context('Finish work order', () => {
	before(() => {
        cy.login();
    });

	it('Make manufacture entry for finished good and scrap item', () => {
		cy.visit('/app/work-order');
        cy.click_listview_row_item(0);
        cy.click_toolbar_button('Finish');
        cy.on('window:alert',  (str) =>  {
            expect(str).to.equal(`Select Quantity`)});
        cy.set_input('qty', '1');
        cy.click_modal_primary_button('Create');
        cy.get_field('stock_entry_type').should('have.value', 'Manufacture');
        cy.get_input('fg_completed_qty', '1');
        cy.save();
        cy.wait(500);
		cy.grid_open_row('items', 3);
		cy.get_field('t_warehouse').should('have.value' , 'Finished Goods - WP');
		cy.get_field('item_code').should('have.value' , 'WB-001');
		cy.get_input('is_scrap_item', 'checkbox').should('be.checked');
		cy.get_input('qty').should('have.value', '1.000');
		cy.close_grid_edit_modal();
        cy.submit_doc('Submitted');
    });

    it('Check status for work order', () => {
		cy.visit('/app/work-order');
        cy.click_listview_row_item(0);
        cy.get_page_title().should('contain', 'Completed');
        cy.get_read_only('produced_qty').should('contain','1');
    });
});
