context('Material Transfer for Manufacturing', () => {
	before(() => {
        cy.login();
    });

	it("Start Work Order", () => {
		cy.visit('/app/work-order');
		cy.click_listview_row_item(0);
		cy.click_toolbar_button('Start');
		cy.on('window:alert',  (str) =>  {
            expect(str).to.equal(`Select Quantity`)});
		cy.set_input('qty', '1');
		cy.click_modal_primary_button('Create');
		cy.get_field('stock_entry_type').should('have.value', 'Material Transfer for Manufacture');
		cy.get_field('from_bom', 'checkbox').should('be.checked');
		cy.get_input('fg_completed_qty', '1');
		cy.save();
		cy.wait(500);
		cy.submit('Submitted');
		cy.wait(500);
		cy.get_page_title().should('contain', 'Submitted');

		//View stock ledger entries are made against correct voucher
		cy.url().then((url) => {
			cy.click_dropdown_action('View', 'Stock Ledger')
			cy.location("pathname").should("eq","/app/query-report/Stock%20Ledger");
			const name = url.split('/').pop();
			cy.get_field('voucher_no', 'Data').should('have.value', name);
		});
	});
});
