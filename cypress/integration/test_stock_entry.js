context('Create Stock Entry', () => {
    before(() => {
    cy.login();
        });

			it('Set Item Table', () => {
			cy.visit('app/stock-entry');
			cy.findByRole('button', {name: 'Add Stock Entry'}).trigger('click', {force: true});
			cy.location("pathname").should("eq","/app/stock-entry/new-stock-entry-1");
			cy.get_field('naming_series', 'Select').select('MAT-STE-.YYYY.-');

			//Set purpose
			cy.get_field('stock_entry_type', 'Link').focus().trigger('click', {force: true});
   			cy.wait(500);
   			cy.fill_field('stock_entry_type', 'Material Receipt', 'Link'), {delay:200}, "{downarrow}{enter}";

			//Set items table attributes
			cy.get('.frappe-control[data-fieldname="items"]').as('table');
			cy.get('@table').find('[data-idx="1"]').as('row1');
			cy.get('@row1').find('.btn-open-row').click();
			cy.get_field('s_warehouse', 'Link').scrollIntoView().should('be.visible').click({force:true});
			cy.get_field('s_warehouse', 'Link').focus();
			cy.get_field('s_warehouse', 'Link').type('Stores - CT', {delay: 100});
			cy.get_field('t_warehouse', 'Link').scrollIntoView().should('be.visible').click({force:true});
			cy.get_field('t_warehouse', 'Link').focus().type('Finished Goods - CT', {delay: 200});
			cy.get_field('item_code', 'Link').focus();
			cy.get_field('item_code', 'Link').type('ITM-0001', {delay: 200});
			cy.get_field('item_code', 'Link').should('have.value', 'ITM-0001');
			cy.get_field('qty', 'Link').focus();
			cy.get_field('qty', 'Link').scrollIntoView().should('be.visible').click({force:true});
			cy.get_field('qty', 'Float').clear().type('23.000');
			cy.get_field('uom', 'Link').clear().type('Nos');
			cy.get_field('uom', 'Link').should('have.value', 'Nos');
			cy.get_field('conversion_factor', 'Float').type('1', {delay: 100});
			cy.get_field('conversion_factor', 'Link').should('have.value', '1');
			cy.get('.form-area > .form-layout > .form-page > :nth-child(5)').click();

			//check amount and totals
			//cy.get('[data-fieldname="basic_amount"]').click({force:true});
			//cy.get('[data-fieldname="basic_amount"]').should('not.have.value','0');
			cy.get('.grid-collapse-row').click();
			cy.findByRole('button', {name: 'Update Rate and Availability'}).trigger('click', {force: true});
			cy.findByRole('button', {name: 'Save'}).trigger('click', {force: true});
			cy.get('[data-fieldname="total_incoming_value"]').should('not.have.value','0');
			cy.findByLabelText('Submit').click();
			cy.findByRole('button', {name: 'Yes'}).trigger('click', {force: true});
            cy.wait(500);
			//View Stock Ledger
			cy.findByRole("button", { name: "View" }).trigger('click', {force: true});
			cy.get('[data-label="Stock%20Ledger"]').click();
			cy.location("pathname").should("eq","/app/query-report/Stock%20Ledger");
			cy.get_field('voucher_no', 'Data').should('have.value', 'MAT-STE-2022-0001');
		});
    });
