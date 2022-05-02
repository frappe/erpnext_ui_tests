context('Website Item', () => {
	before(() => {
        cy.login();
    });

		it("Create an item", () => {
			cy.new_doc("Item");
			cy.set_input('item_code', 'Teak Shoe Rack');
			cy.set_link('item_group','All Item Groups');
			cy.set_input('opening_stock', '1000');
			cy.set_input('valuation_rate', '1000');
			cy.set_input('standard_rate', '12300.000');
			cy.set_link('stock_uom', 'Nos');
			cy.save();
			cy.wait(500);

        //Creating an item and publishing it
		cy.click_dropdown_action('Actions', 'Publish in Website');

        //Checking if dialog box opens upon publishing and redirecting to website item record created
        cy.on('window:alert',  (str) =>  {
            expect(str).to.equal(`Published`)});
		cy.visit(`app/website-item`);
		cy.click_listview_row_item(0);
        cy.get_input('web_item_name', 'Data').should('have.value','Teak Shoe Rack');
        cy.get_field('published', 'checkbox').should('be.checked');

        //Checking if redirects appropriately to the web page of the published item
        cy.contains('See on Website').should('be.visible').click();
        cy.visit(`app/website-item`);
        cy.get('.list-row-checkbox').eq(0).click();
		cy.click_dropdown_action('Actions', 'Delete');
 		cy.click_modal_primary_button('Yes');
    });
});
