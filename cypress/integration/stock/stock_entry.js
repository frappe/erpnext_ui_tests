context('Create Stock Entry', () => {
    before(() => {
    cy.login();
        });

		it('Create an item', () => {
			cy.new_doc('Item');
			cy.set_input('item_code', 'T-shirt');
			cy.set_link('item_group','All Item Groups');
			cy.set_input('opening_stock','100');
			cy.set_input('standard_rate','100');
 			cy.set_input('valuation_rate', '8000');
 			cy.set_link('stock_uom', 'Nos');

			cy.get('.frappe-control[data-fieldname="item_defaults"]').as('table');
			cy.get('@table').findByRole('button', {name: 'Add Row'}).click();
			cy.get('@table').find('[data-idx="1"]').as('row1');
			cy.get('@row1').find('.btn-open-row').click();
			cy.set_link('company', 'Wind Power LLC');
			cy.get_input('company', 'Link').should('have.value','Wind Power LLC');
			cy.get('.grid-collapse-row').click();
			cy.save();
			cy.wait(500);

			cy.get_page_title().should('contain', 'T-shirt');
 			cy.get_page_title().should('contain',  'Enabled');

			cy.compare_document({
				item_name: 'T-shirt',
				standard_rate: '100',
				item_group: 'All Item Groups',
				stock_uom: 'Nos',
				is_stock_item: 1,
			});
		});

			it('Set Item Table in Material Request', () => {
			cy.new_doc('Stock Entry');
			cy.location("pathname").should("eq","/app/stock-entry/new-stock-entry-1");
			cy.get_field('naming_series', 'Select').select('MAT-STE-.YYYY.-');

			//Set purpose
			cy.set_link('stock_entry_type', 'Material Receipt')

			//Set company
			cy.set_link('company', 'Wind Power LLC');

			//Set warehouse
			cy.set_link('to_warehouse', 'Finished Goods - WP');

			//Set items table attributes
			cy.get('.rows > .grid-row > .data-row > [data-fieldname="s_warehouse"]').click();
			cy.set_input('item_code', 'T-shirt');
			cy.get_field('item_code', 'Link').should('have.value', 'T-shirt');

			cy.get('.frappe-control[data-fieldname="items"]').as('table');
			cy.get('@table').find('[data-idx="1"]').as('row1');
			cy.get('@row1').find('.btn-open-row').click();
			cy.set_input('qty', '23.000');
			cy.get_field('qty', 'Float').should('have.value','23.000');
			cy.get('.grid-collapse-row').click();
			cy.wait(500);

			cy.findByRole('button', {name: 'Update Rate and Availability'}).trigger('click', {force: true});
			cy.save();
			cy.wait(500);
			cy.get('[data-fieldname="total_incoming_value"]').should('not.have.value','0');

			cy.click_toolbar_button('Submit');
			cy.click_modal_primary_button('Yes');
            cy.get_open_dialog().find('.btn-modal-close').click();
			cy.get('.modal:visible').should('not.exist');
			cy.get_page_title().should('contain',  'Submitted');

			//View Stock Ledger and verify if correct stock ledger entries are correct
			cy.url().then((url) => {
				cy.click_dropdown_action('View', 'Stock Ledger')
				cy.location("pathname").should("eq","/app/query-report/Stock%20Ledger");
				const name = url.split('/').pop();
    			cy.get_field('voucher_no', 'Data').should('have.value', name);
			});
		});
    });
