context('Material Request', () => {
    before(() => {
    cy.login();
        });

			//Set mode of payment first
			it('Set appropriate field values', () => {
            cy.visit(`app/material-request`);
            cy.click_listview_primary_button('Add Material Request');
            cy.location("pathname").should("eq","/app/material-request/new-material-request-1");
            cy.get_field('material_request_type', 'Select').select('Purchase');
			cy.get_field('material_request_type', 'Select').should('have.value', 'Purchase');
			cy.get_field('transaction_date', 'Date').should('not.have.value', '');

			//Setting Required By field
			var today = new Date();
            var date = '01-'+(today.getMonth()+2)+'-'+today.getFullYear();
			cy.get_field('schedule_date', 'Date').wait(500).clear().type(date, {delay: 200});

			//Set items table attributes
			cy.get('.frappe-control[data-fieldname="items"]').as('table');
			cy.get('@table').find('[data-idx="1"]').as('row1');
			cy.get('@row1').find('.btn-open-row').click();
			cy.get_field('item_code', 'Link').focus();
			cy.get_field('item_code', 'Link').type('ITM-0001', {delay: 200});
			cy.get_field('item_code', 'Link').should('have.value', 'ITM-0001');
			cy.get_field('description', 'Link').type('ITM-0001', {delay: 200});
			cy.get_field('schedule_date', 'Date').should('not.have.value','');
			cy.get_field('qty', 'Float').clear().type('23.000');
			cy.get_field('uom', 'Link').clear().type('Nos');
			cy.get_field('uom', 'Link').should('have.value', 'Nos');
			//cy.get_field('warehouse', 'Link').should('have.value', 'Stores - CT');
			cy.get_field('conversion_factor', 'Float').clear().type('1');
			cy.get_field('conversion_factor', 'Link').should('have.value', '1');

			//check amount and totals
			cy.get_field('rate', 'Link').focus();
			cy.get_field('rate', 'Link').scrollIntoView().should('be.visible').click({force:true});
			cy.get_field('rate', 'Link').type('100');
			cy.get_field('rate', 'Link').should('not.have.value','0');
			//cy.get_field('amount', 'Link').focus().trigger('click', {force: true});
			//cy.get_field('amount', 'Link').should('not.have.value','0');

			cy.get('.grid-collapse-row').click();
			cy.findByRole('button', {name: 'Save'}).trigger('click', {force: true});
			cy.findByRole('button', {name: 'Submit'}).trigger('click', {force: true});
			cy.findByRole('button', {name: 'Yes'}).trigger('click', {force: true});
		});
    });
