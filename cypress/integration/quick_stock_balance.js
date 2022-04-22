context('Quick Stock Balance', () => {
	before(() => {
		cy.login();
	});

	it('Create an item', () => {
		cy.new_doc_view('Item');
		cy.get_field('item_code', 'Data').type('ITM-0018');
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
		cy.get_field('default_warehouse', 'Link').should('have.value','Stores - WPL');
        cy.get('.grid-collapse-row').click();
		cy.findByRole("button", { name: "Save" }).click();
		cy.wait(500);

		cy.get(".page-title").should("contain", "ITM-0018");
		cy.get(".page-title").should("contain", "Enabled");

		cy.compare_document({
			item_name: 'ITM-0018',
			standard_rate: '100',
			item_group: 'All Item Groups',
			description: 'ITM-0018',
			stock_uom: 'Nos',
			is_stock_item: 1,
	});
});

	it('Should show correct data on Quick Stock balance', () => {
		cy.visit('app/quick-stock-balance/Quick%20Stock%20Balance');
		cy.get_field('warehouse', 'Link').type('Stores - WPL',"{downarrow}{enter}");

 		cy.get_field('date', 'Date').click();
		 cy.get('.datepicker--button').click({ force: true }, { multiple: true });
		 //Picking up the todays date
		 const todays_date = Cypress.moment().format('MM-DD-YYYY');

 	 	cy.get_field('item', 'Link').type('ITM-0018', {delay: 100},"{downarrow}{enter}");
		//cy.get('[data-fieldname="qty"]').should('have.value','100');
		//cy.get('[data-fieldname="item_name"]').should('have.value','100');
		//cy.get('[data-fieldname="item_description"]').should('have.value','100');
		//cy.get_field('qty', 'Float').should('be.visible');
		//cy.get_field('qty', 'Float').should('have.value','100');
		//cy.get_field('item_name', 'Data').should('be.visible');
		//cy.get_field('item_name', 'Data').should('have.value','ITM-0018',"{downarrow}{enter}");
		//cy.get_field('item_description', 'Small Text').should('be.visible');
		//cy.get_field('item_description', 'Small Text').should('have.value','ITM-0018');
		//cy.get_field('value', 'Currency').should('not.have.value','0');

});
});
