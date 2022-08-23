context('Rating Control', () => {
	before(() => {
		cy.login();
		cy.visit('/app/doctype');
		//Creating a new doctype with rating field type
		return cy.window().its('frappe').then(frappe => {
			return frappe.xcall('frappe.tests.ui_test_helpers.create_doctype', {
				name: 'Rating Control',
				fields: [
					{
						"label": "Rating",
						"fieldname": "rating",
						"fieldtype": "Rating",
						"in_list_view": 1,
					},
				]
			});
		});
	});
	it('Creating a new rating document and verifying if it works with full star rating', () => {
		cy.go_to_list('Doctype');
		cy.list_open_row('Rating Control');

		//Setting autoname for rating doctype
		cy.set_input('autoname', 'RATING.#####');
		cy.save();
		cy.new_form('Rating Control');
		cy.location("pathname").should('eq','/app/rating-control/new-rating-control-1');
		
		//Checking for the title and indicator is correct
		cy.get_page_title().should('contain','New Rating Control');
		cy.get_page_indicator().should('have.text','Not Saved');

		//Checking if by default there are 5 stars
		cy.get('.rating:visible').find('.icon').should('have.attr', 'data-rating');
		cy.get('.rating [data-rating="5"]:visible').should('exist');

		//Creating a new rating document and checking for full star rating
		cy.insert_doc(
			"Rating Control",
			{
				rating: "0.6"
			},
			true
		).then((RC)=>{
			cy.go_to_list('Rating Control');
			cy.wait(1000);
			cy.get('.list-row .ellipsis[title="Rating: 3"]:visible').should('exist');
			cy.delete_list_row('Rating Control', RC.name);
		});
	});

	it('Verifying half star rating', () => {
		cy.insert_doc(
			"Rating Control",
			{
				rating: "0.5"
			},
			true
		).then((RC)=>{
			cy.go_to_list('Rating Control');
			cy.wait(1000);
			cy.get('.list-row .ellipsis[title="Rating: 2.5"]:visible').should('exist');
			cy.delete_list_row('Rating Control', RC.name);
		});
	});

	it('Verifying if the filter works with the rating fieldtype', () => {	
		//Checking for full star rating in filters	
		cy.insert_doc(
			"Rating Control",
			{
				rating: "0.6"
			},
			true
		).then((RC)=>{
			cy.go_to_list('Rating Control');
			cy.add_filter();
			cy.get('.fieldname-select-area').type('Rating{enter}');
			cy.get('.filter-field .rating [data-rating="3"] .right-half').click();
			cy.get('button.btn-primary').contains('Apply Filters').click();
			cy.get('.list-row').should('contain', RC.name);
			cy.add_filter();
			cy.get('button.btn-secondary').contains('Clear Filters').click();
			cy.delete_list_row('Rating Control', RC.name);
		});

		//Checking for half star rating in the filters
		cy.insert_doc(
			"Rating Control",
			{
				rating: "0.5"
			},
			true
		).then((RC)=>{
			cy.go_to_list('Rating Control');
			cy.add_filter();
			cy.get('.fieldname-select-area').type('Rating{enter}');
			cy.get('.filter-field .rating [data-rating="3"] .left-half').click();
			cy.get('button.btn-primary').contains('Apply Filters').click();
			cy.get('.list-row').should('contain', RC.name);
			cy.add_filter();
			cy.get('button.btn-secondary').contains('Clear Filters').click();
			cy.delete_list_row('Rating Control', RC.name);
		});
	});

	function get_dialog_with_rating() {
		//Creating a dialog with rating field type
        return cy.dialog({
            title: 'Rating',
            fields: [{
                label: 'Rating',
                fieldname: 'rating',
                fieldtype: 'Rating',
				options: '7',
            }]
        });
    }

	it('Adding options in the doctype to make stars configurable in rating doctype', () => {
		cy.delete_list_row('Doctype', 'Rating%20Control');
		get_dialog_with_rating().as('dialog');

		//Checking if 7 stars are present in the ratings dialog
		cy.get('.rating:visible').find('.icon').should('have.attr', 'data-rating');
		cy.get('.rating [data-rating="7"]:visible').should('exist');

		//Checking for half and full star rating
		cy.get('.rating [data-rating="5"] .right-half:visible').click({force: true});
		cy.get('.rating [data-rating="5"] .left-half:visible').click({force: true});
	});
}); 