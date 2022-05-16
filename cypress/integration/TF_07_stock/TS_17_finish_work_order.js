context('Executing Job Cards', () => {
	before(() => {
        cy.login();
    });

	it('Finish work order', () => {
		cy.visit('/app/work-order');
        cy.click_listview_row_item(0);
        cy.click_toolbar_button('Finish');
        cy.on('window:alert',  (str) =>  {
            expect(str).to.equal(`Select Quantity`)});
        cy.set_input('qty', '1');
        cy.click_modal_primary_button('Create');
        cy.get_field('stock_entry_type').should('have.value', 'Manufacture');
        cy.get_field('from_bom', 'checkbox').should('be.checked');
        cy.get_input('fg_completed_qty', '1');
        cy.save();
        cy.wait(500);
        cy.submit('Submitted');
    });

    it('Check status for work order', () => {
        cy.click_listview_row_item(0);
        cy.get_page_title().should('contain', 'Completed');
        cy.get_read_only('produced_qty').should('contain','1');
    });
});
