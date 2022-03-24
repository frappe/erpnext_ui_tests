context('Item', () => {
	before(() => {
        cy.login();
    });

    it('Create an item', () => {
        cy.visit(`app/item/`);
		cy.click_listview_primary_button('Add Item');
		cy.findByRole('button', {name: /Edit in full page/}).click();
        cy.get_field('item_code', 'Data').type("ITM-0018");
        cy.get_field('item_group', 'Link').type('All Item Groups');
		cy.get_field('valuation_rate', 'Data').clear().type('8000');
		cy.get_field('stock_uom', 'Link').clear().type('Nos');
        cy.wait(500);
		cy.findByRole('button', {name: 'Save'}).click();


		cy.get('.page-title').should('contain', 'ITM-0018');
		cy.get('.page-title').should('contain', 'Enabled');
        cy.get_field('item_name', 'Data').should('have.value','ITM-0018');
        cy.get_field('item_group', 'Link').should('have.value', 'All Item Groups');
		cy.get_field('is_stock_item', 'checkbox').should('be.checked');
		cy.get_field('valuation_rate', 'Data').should('have.value', '8,000.00');
		cy.get_field('stock_uom', 'Link').should('have.value','Nos');
        cy.remove_doc('Item', 'ITM-0018');
    });
});

