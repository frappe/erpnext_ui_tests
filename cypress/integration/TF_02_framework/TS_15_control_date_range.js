context('Control Date Range', () => {
    before(() => {
        cy.login();
        cy.visit('/app');
    });

    function get_dialog_with_date_range() {
		//Creating a dialog with date range field type
        return cy.dialog({
            title: 'Date Range',
            fields: [{
                label: 'Select Date Range',
                fieldname: 'date_range',
                fieldtype: 'Date Range',
            }]
        });
    }

    it('Checking the functionality of Date Range control in a modal dialog box', () => {
        get_dialog_with_date_range().as('dialog');

		//Checking if the title and the label of the field in the modal is correct
        cy.get('.modal-title').should('have.text','Date Range');
        cy.get('.control-label').should('have.text','Select Date Range');

		//Setting the first date in the Date Range field
        cy.get_field('date_range','Date Range').click();
		cy.set_date(2021, 0, 15);
		cy.get_field('date_range','Date Range').should('have.value','15-01-2021');
		//Setting second date in the Date Range field
		cy.set_date(2021, 0, 22);

		//Checking if the set value in the date range field is displayed correctly 
		cy.get_field('date_range','Date Range').should('have.value','15-01-2021 to 22-01-2021');
        cy.get_field('date_range','Date Range').clear();
        cy.get_field('date_range','Date Range').click();

		//Checking if first date selected is greater than the second date 
		//then also the field should display the date correctly
		cy.set_date(2021, 0, 22);
		cy.get_field('date_range','Date Range').should('have.value','22-01-2021');
		cy.set_date(2021, 0, 15);
        cy.get_field('date_range','Date Range').should('have.value','15-01-2021 to 22-01-2021');
    });

        it('Checking the functionality of Date Range control by using it in a filter', () => {
            cy.visit('/app/doctype');

			//Adding date range filter on the doctype list
            cy.add_filter();
            cy.get('.fieldname-select-area').type('Created{downarrow}{enter}');
            cy.get('select').should('have.value','Between');
            cy.get_field('creation','DateRange').click();

			//Setting the first date in the date range field
            cy.set_date(2021, 0, 15);
			cy.get_field('creation','DateRange').should('have.value','15-01-2021');
            //Setting second date in the date range field
            cy.set_date(2021, 0, 22);
			//Checking if the set date is displayed correctly
			cy.get_field('creation','DateRange').should('have.value','15-01-2021 to 22-01-2021');
            cy.get_field('creation','DateRange').clear();
            cy.get_field('creation','DateRange').click();
            
			//Checking if first date selected is greater than the second date 
		    //then also the field should display the date correctly
            cy.set_date(2021, 0, 22);
			cy.get_field('creation','DateRange').should('have.value','22-01-2021');
			cy.set_date(2021, 0, 15);
            cy.get_field('creation','DateRange').should('have.value','15-01-2021 to 22-01-2021');
			cy.get('.filter-button').click({force: true});
			cy.clear_filters();
		});
});
