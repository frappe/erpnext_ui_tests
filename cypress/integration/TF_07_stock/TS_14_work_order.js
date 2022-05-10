context('Material Request', () => {
	before(() => {
		cy.login();
	});

		it('Create Work Order from BOM', () => {
			cy.visit('app/bom');
			cy.click_listview_row_item(0);
		});
});
