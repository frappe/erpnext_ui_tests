context('Material Request', () => {
    before(() => {
    cy.login();
        });

		it('Create an item', () => {
			cy.new_doc('Item');

			cy.set_input('item_code', 'Wooden Chair');
			cy.set_link('item_group', 'All Item Groups');
			cy.set_input('opening_stock', '100');
			cy.set_input('standard_rate', '100');
			cy.set_link('stock_uom', 'Nos');
 			cy.save();
			cy.wait(500);

			cy.get('.frappe-control[data-fieldname="item_defaults"]').as('table');
			cy.get('@table').findByRole('button', {name: 'Add Row'}).click();
			cy.get('@table').find('[data-idx="1"]').as('row1');
			cy.get('@row1').find('.btn-open-row').click();
			cy.set_link('company', 'Wind Power LLC');
			cy.set_link('default_warehouse', 'Stores - WP');
			cy.get_field('default_warehouse', 'Link').should('have.value','Stores - WP');
			cy.get('.grid-collapse-row').click();
			cy.click_toolbar_button('Save');
			cy.wait(500);
			cy.get_page_title().should('contain', 'Coffee');
 			cy.get_page_title().should('contain',  'Enabled');

			cy.compare_document({
				item_name: 'Wooden Chair',
				standard_rate: '100',
				item_group: 'All Item Groups',
				stock_uom: 'Nos',
				is_stock_item: 1,
			});
		});

		it('Set appropriate field values', () => {
			cy.new_doc('Material Request');
            cy.location("pathname").should("eq","/app/material-request/new-material-request-1");
            cy.set_select('material_request_type', 'Purchase');
			cy.get_select('material_request_type').should('have.value', 'Purchase');
			cy.get_field('transaction_date', 'Date').should('not.have.value', '');

			//Setting Required By field
			var today = new Date();
            var date = '01-'+(today.getMonth()+4)+'-'+today.getFullYear();
			cy.get_field('schedule_date', 'Date').wait(500).clear().type(date, {delay: 200});
			cy.set_link('company', 'Wind Power LLC');
			cy.get('.rows > .grid-row > .data-row > [data-fieldname="item_code"]').click();
			cy.set_input('item_code', 'Wooden Chair');
			cy.get_field('schedule_date', 'Date').should('not.have.value','');
			cy.set_input('qty','23.000');
			cy.get_input('uom', 'Data').should('have.value', 'Nos');
			cy.wait(500);
			cy.get('.frappe-control[data-fieldname="items"]').as('table');
			cy.get('@table').find('[data-idx="1"]').as('row1');
			cy.get('@row1').find('.btn-open-row').click();

			//check amount and totals
			cy.get_input('rate', '0');

			//cy.get('.grid-collapse-row').click();
			cy.save();
			cy.wait(500);
			cy.get_page_title().should('contain',  'Draft');
			cy.click_toolbar_button('Submit');
			cy.click
			cy.click_modal_primary_button('Yes');
			cy.get_open_dialog().find('.btn-modal-close').click();
			cy.get('.modal:visible').should('not.exist');
			cy.get_page_title().should('contain',  'Pending');
			});
    	});
