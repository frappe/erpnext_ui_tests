context('Trial Balance Report', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Verifying debit and credit values for trial balance report', () => {
		//Visiting the "Trial Balance" report
		cy.visit('/app/query-report/Trial%20Balance');
		cy.location('pathname').should('eq', '/app/query-report/Trial%20Balance');

		//Checking company, fiscal year, from date and to date fields should not be empty
		cy.get_input('company').should('not.be.empty');
		cy.get_input('fiscal_year').should('not.be.empty');
		cy.get_input('from_date').should('not.be.empty');
		cy.get_input('to_date').should('not.be.empty');

		//Checking if the from date starts with 1st of April
		let fromdate;
		cy.get_input('from_date').invoke('val').then(val => {
			fromdate = val.substring(0, val.length -5);
			expect(fromdate).to.contain('01-04');
		});

		//Checking if the to date is 31st of March
		let todate;
		cy.get_input('to_date').invoke('val').then(val => {
			todate = val.substring(0, val.length -5);
			expect(todate).to.contain('31-03');
		});

		//Checks the header of the report
		cy.get_report_header().should('contain', 'Account')
		.and('contain', 'Opening (Dr)')
		.and('contain', 'Opening (Cr)')
		.and('contain', 'Debit')
		.and('contain', 'Credit')
		.and('contain', 'Closing (Dr)')
		.and('contain', 'Closing (Cr)');

		//Checking if all the account heads are present in the report
		cy.get_field('show_zero_values', 'Check').check();
		cy.wait(2000);
		cy.get_report_cell().should('contain', 'Application of Funds (Assets)');
		cy.set_input_report('Source of Funds (Liabilities)');
		cy.get_report_cell().should('contain', 'Source of Funds (Liabilities)');
		cy.set_input_report('Income');
		cy.get_report_cell().should('contain', 'Income');
		cy.set_input_report('Expenses');
		cy.get_report_cell().should('contain', 'Expenses');

		//Checking if the total debit and credit values is equal in the report
		let debit_col = '';
		let debit = '';
		cy.get_report_header().each(($cell) => {
			if($cell.text().indexOf('Debit')!= -1){
				debit_col = $cell.attr('data-col-index');
				cy.set_input_report('Total');
				cy.get(`.dt-row:last .dt-cell--col-${debit_col} span`)
				.invoke('text').then((text) => {
					debit = text;
				});
			}
		})

		let credit_col = '';
		cy.get_report_header().each(($cell) => {
			if($cell.text().indexOf('Credit')!= -1){
				credit_col = $cell.attr('data-col-index');
				cy.get(`.dt-row:last .dt-cell--col-${credit_col} span`)
				.invoke('text').then((text) => {
					expect(text.trim()).equal(debit)
				});
			}
		})
	});
});