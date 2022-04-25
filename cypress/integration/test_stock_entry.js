context('Create Stock Entry', () => {
    before(() => {
    cy.login();
        });

		it('Create an item', () => {
			cy.new_doc_view('Item');
			cy.get_field('item_code', 'Data').type('ITM-0011');
			cy.get_field('item_group', 'Link').clear().type('All Item Groups');
			cy.get_field('opening_stock', 'Data').clear().type(100);
			cy.get_field('standard_rate', 'Data').clear().type(100);
			cy.get_field('stock_uom', 'Link').clear().type("Nos");

			cy.get('.frappe-control[data-fieldname="item_defaults"]').as('table');
			cy.get('@table').findByRole('button', {name: 'Add Row'}).click();
			cy.get('@table').find('[data-idx="1"]').as('row1');
			cy.get('@row1').find('.btn-open-row').click();
			cy.get_field('company', 'Link').clear().type('Wind Power LLC', {delay: 200});
			cy.get_field('company', 'Link').should('have.value','Wind Power LLC');
			cy.get('.form-area > .form-layout > .form-page > :nth-child(1)').click();
			//cy.get_field('default_warehouse', 'Link').should('have.value','Stores - WPL');
			cy.get('.grid-collapse-row').click();
			cy.findByRole("button", { name: "Save" }).click();
			cy.wait(500);

			cy.get(".page-title").should("contain", "ITM-0011");
			cy.get(".page-title").should("contain", "Enabled");

			cy.compare_document({
				item_name: 'ITM-0011',
				standard_rate: '100',
				item_group: 'All Item Groups',
				description: 'ITM-0011',
				stock_uom: 'Nos',
				is_stock_item: 1,
		});
	});

			it('Set Item Table in Material Request', () => {
			cy.visit('app/stock-entry');
			cy.findByRole('button', {name: 'Add Stock Entry'}).trigger('click', {force: true});
			cy.location("pathname").should("eq","/app/stock-entry/new-stock-entry-1");
			cy.get_field('naming_series', 'Select').select('MAT-STE-.YYYY.-');

			//Set purpose
			cy.get_field('stock_entry_type', 'Link').focus().trigger('click', {force: true});
   			cy.wait(500);
   			cy.fill_field('stock_entry_type', 'Material Receipt', 'Link'), {delay:200}, "{downarrow}{enter}";

			cy.get_field('company', 'Link').clear().type('Wind Power LLC', {delay: 200}, "{downarrow}{enter}");

			cy.get_field('to_warehouse', 'Link').type('Finished Goods - WP', {delay: 200}, "{downarrow}{enter}");
			//Set items table attributes
			cy.get('.rows > .grid-row > .data-row > [data-fieldname="s_warehouse"]').click();
			cy.get_field('item_code', 'Link').focus().trigger('click', {force: true});
			cy.wait(500);
			cy.fill_field('item_code', 'ITM-0011', 'Link'), {delay:200}, "{downarrow}{enter}";
			cy.findByText('ITM-0011').click();
			cy.get_field('item_code', 'Link').blur();
			cy.get_field('item_code', 'Link').should('have.value', 'ITM-0011');
			cy.get_field('qty', 'Float').scrollIntoView().should('be.visible')
				.click({force:true})
				.clear().type('23') ;
			//cy.get_field('qty', 'Float').should('have.value', "23.000");

			//cy.get('.form-area > .form-layout > .form-page > :nth-child(5)').click();

			//check amount and totals
			//cy.get('[data-fieldname="basic_amount"]').should('not.have.value','0');
			//cy.get('.grid-collapse-row').click();

			cy.findByRole('button', {name: 'Update Rate and Availability'}).trigger('click', {force: true});
			cy.findByRole('button', {name: 'Save'}).trigger('click', {force: true});
			cy.get('[data-fieldname="total_incoming_value"]').should('not.have.value','0');

			cy.findByRole('button', {name: 'Submit'}).trigger('click', {force: true});
			cy.findByRole('button', {name: 'Yes'}).trigger('click', {force: true});
            cy.wait(500);
			cy.get('.page-title').should('contain', 'Submitted');

			//View Stock Ledger
			cy.url().then((url) => {
				cy.findByRole("button", { name: "View" }).trigger('click', {force: true});
				cy.get('[data-label="Stock%20Ledger"]').first().click();
				cy.location("pathname").should("eq","/app/query-report/Stock%20Ledger");
				//const name = url.split('/')[-1];
				//cy.get_field('voucher_no', 'Data').should('have.value', name);
			});
		});
    });
