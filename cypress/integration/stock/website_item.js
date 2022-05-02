context('Website Item', () => {
	before(() => {
        cy.login();
    });

        //Creating an item and publishing it
      	 it('Create an item and publish as website item', () => {
			cy.new_doc('Item');
			cy.set_input('item_code', 'Teak Shoe Rack');
			cy.set_link('item_group', 'All Item Groups');
			cy.set_input('standard_rate', '22300.00');
			cy.set_input('opening_stock', '100');
			cy.set_link('stock_uom', 'Nos');
			cy.save();
			cy.wait(500);

			cy.compare_document({
				item_name: 'Teak Shoe Rack',
				standard_rate: '22300.00',
				item_group: 'All Item Groups',
				stock_uom: 'Nos',
				is_stock_item: 1,
			});
		});

		cy.get_page_title().should('contain', 'Teak Shoe Rack');
		cy.get_page_title().should('contain',  'Enabled');
		cy.click_dropdown_action('Actions', 'Publish in Website');

        //Checking if dialog box opens upon publishing and redirecting to website item record created
        cy.on('window:alert',  (str) =>  {
            expect(str).to.equal(`Published`)});
		cy.visit(`app/website-item`);
		cy.click_listview_row_item(0);
        cy.get_field('web_item_name', 'Data').should('have.value','Teak Shoe Rack');
        cy.get_field('published', 'checkbox').should('be.checked');

        //Checking if redirects appropriately to the web page of the published item
        cy.contains('See on Website').should('be.visible').click();
        cy.visit(`app/website-item`);
        cy.get('.list-row-checkbox').eq(0).click();
		cy.click_dropdown_action('Actions', 'Delete');
 		cy.click_modal_primary_button('Yes');
    });

