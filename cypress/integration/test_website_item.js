context('Website Item', () => {
	before(() => {
        cy.login();
    });

    it('Create an item and publish as website item', () => {
        
        //Creating an item and publishing it 
        cy.visit(`app/item/`);
		cy.click_listview_primary_button('Add Item');
		cy.findByRole('button', {name: /Edit in full page/}).click();
        cy.get_field('item_code', 'Data').type("ITM-0001");
        cy.get_field('item_group', 'Link').type('All Item Groups');
		cy.get_field('valuation_rate', 'Data').clear().type('8000');
		cy.get_field('stock_uom', 'Link').clear().type('Nos');
        cy.wait(500);
		cy.findByRole('button', {name: 'Save'}).click();
		cy.get('.page-title').should('contain', 'ITM-0001');
		cy.get('.page-title').should('contain', 'Enabled');
        cy.get_field('item_name', 'Data').should('have.value','ITM-0001');
        cy.get_field('item_group', 'Link').should('have.value', 'All Item Groups');
		cy.get_field('is_stock_item', 'checkbox').should('be.checked');
		cy.get_field('valuation_rate', 'Data').should('have.value', '8,000.00');
		cy.get_field('stock_uom', 'Link').should('have.value','Nos');
        cy.get('[data-label="Actions"]:visible').click({force:true});
        cy.get('[data-label="Publish%20in%20Website"]').click({force:true});
        
        //Checking if dialog box opens upon publishing and redirecting to website item record created  
        cy.on('window:alert',  (str) =>  {
            expect(str).to.equal(`Published`)});
        cy.get('.modal.show > .modal-dialog > .modal-content > .modal-body').should('be.visible').contains("ITM-0001").click();
        cy.get_field('web_item_name', 'Data').should('have.value','ITM-0001');
        cy.get_field('published', 'checkbox').should('be.checked');
        
        //Checking if redirects appropriately to the web page of the published item 
        cy.contains('See on Website').should('be.visible').click();
        cy.visit(`app/website-item`);
        cy.get('.list-row-checkbox').eq(0).click();
 		cy.get('.actions-btn-group > .btn').contains('Actions').should('be.visible').click();
 		cy.get('.actions-btn-group > .dropdown-menu [data-label="Delete"]').should('be.visible').click({force:true});
 		cy.click_modal_primary_button('Yes');
    });
});

