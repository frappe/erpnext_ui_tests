import doctype_location from '../../fixtures/doctype_location';

context('Map View', () => {
	before(() => {
		cy.login();
		cy.go_to_list('DocType');
		cy.insert_doc('DocType', doctype_location, true);
	});
	it('Creating a record for the doctype and checking if the map view for the records works', () => {
		cy.go_to_list('DocType');
		cy.new_form('Test Location');	
		cy.get('#navbar-breadcrumbs').contains('Test Location').click();
		cy.click_listview_primary_button('Add Test Location');

		//Filling up the form for "Test Location" doctype
		cy.set_input('location_name','Mumbai');
		cy.set_input('latitude','19.09131');
		cy.set_input('longitude','72.91336');
		cy.get('.leaflet-draw-draw-marker').click();
		cy.get('#unique-0').click();
		cy.save();

		//Checking for the URL if the view is List View
		cy.go_to_list('Test Location');
		cy.get_page_title().should('contain', 'Test Location');
		cy.click_custom_toolbar_button('List View');
		cy.click_toolbar_dropdown('Map');

		//Checking for the URL if the view is Map View
		cy.location('pathname').should('eq', '/app/test-location/view/map');
		cy.get_page_title().should('contain', 'Test Location Map');

		//Checking if the map shows the location selected in the record in map view
		cy.get('.leaflet-marker-icon:visible').should('be.visible').click({multiple: true, force: true});
		cy.get('.leaflet-popup-content').contains(/LOCATION0000/);
		});

	it('Checking if removing the location from the map in the record also removes it from the map view', () => {
		cy.go_to_list('Test Location');
		cy.click_listview_row_item(0);
		cy.get('#navbar-breadcrumbs:visible').contains('Test Location').click({force: true});
		cy.wait(500);
		cy.click_listview_row_item(0);

		//Removing the location from the record
		cy.get('.leaflet-draw-edit-remove').click();
		cy.get('[title="Clear all layers"]').click({force: true});
		cy.save();
		cy.go_to_list('Test Location');
		cy.click_custom_toolbar_button('List View');
		cy.click_toolbar_dropdown('Map');

		//Checking if the location is still visible in the map view
		cy.get('.map-view-container').should('not.have.class', 'leaflet-marker-icon');
	});

	it('Removing the doc', () => {
		cy.go_to_list('Test Location');
		cy.click_listview_checkbox(0);
		cy.click_toolbar_button('Actions');
		cy.click_toolbar_dropdown('Delete');
		cy.click_modal_primary_button('Yes');
		cy.hide_dialog();
	});		
});