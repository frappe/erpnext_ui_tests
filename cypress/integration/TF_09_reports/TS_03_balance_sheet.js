context('Balance Sheet', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Verifying Balance Sheet', () => {
		cy.visit('/app/query-report/Balance%20Sheet');
		cy.location('pathname').should('eq', '/app/query-report/Balance%20Sheet');

		//Checking if company, fiscal year and year filters are not empty
		cy.get_input('company').should('not.be.empty');
		cy.get_select('filter_based_on').should('not.be.empty');
		cy.get_input('from_fiscal_year').should('not.be.empty');
		cy.get_input('to_fiscal_year').should('not.be.empty');
		cy.get_select('filter_based_on').should('contain', 'Fiscal Year');
		cy.get_select('periodicity').should('not.be.empty');
		cy.get_select('periodicity').should('contain', 'Yearly');
		cy.wait(1000);

		//Checking the columns when the filter is set as Yearly
		cy.get_report_header().should('have.length', 3);
		cy.get_report_header().should('contain', 'Account');

		//Checking the columns when the filter is set as Monthly
		cy.set_select('periodicity', 'Monthly');
		cy.get_report_header().should('have.length', 14);

		//Checking the columns when the filter is set as Half Yearly
		cy.set_select('periodicity', 'Half-Yearly');
		cy.get_report_header().should('have.length', 4);

		//Checking the columns when the filter is set as Quaterly
		cy.set_select('periodicity', 'Quarterly');
		cy.get_report_header().should('have.length', 6);

		//Checking if the account heads Income and Expenses are present
		cy.get_report_cell().should('contain', 'Application of Funds (Assets)');
		cy.set_input_report('Source of Funds (Liabilities)');
		cy.get_report_cell().should('contain', 'Source of Funds (Liabilities)');
		cy.set_input_report('Source of Funds (Liabilities)').clear();

		cy.set_select('filter_based_on', 'Date Range');

		//Checking if the from date starts with 1st of April
		let fromdate;
		cy.get_input('period_start_date').invoke('val').then(val => {
			fromdate = val.substring(0, val.length -5);
			expect(fromdate).to.contain('01-04');
		});

		//Checking if the to date is 31st of March
		let todate;
		cy.get_input('period_end_date').invoke('val').then(val => {
			todate = val.substring(0, val.length -5);
			expect(todate).to.contain('31-03');
		});

		//Checking for Add Column functionality
		cy.click_menu_button();
		cy.get('.menu-item-label[data-label="Add%20Column"]').click({force: true});
		cy.set_select('doctype', 'Account');
		cy.set_select('field', 'Account Type');
		cy.set_select('insert_after', 'Account');
		cy.click_modal_primary_button('Submit');
		cy.get_report_header().should('contain', 'Account Type');

		//Checking for Edit functionality
		cy.click_menu_button();
		cy.get('.menu-item-label[data-label="Edit"]').click({force: true});
		cy.location('pathname').should('eq', '/app/report/Balance%20Sheet');
		cy.get_read_only('is_standard').should('contain', 'Yes');
	});
}); 