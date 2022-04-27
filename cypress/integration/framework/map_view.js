context('Map View', () => {
	before(() => {
		cy.login();
		cy.visit('/app/doctype');
		return cy.window().its('frappe').then(frappe => {
			return frappe.xcall('frappe.tests.ui_test_helpers.create_doctype', {
				name: 'Test Location',
				fields: [
					{
						"label": "Location Name",
						"fieldname": "location_name",
						"fieldtype": "Data",
						"in_list_view": 1,
					},
					{
						"label": "",
						"fieldname": "column_break_3",
						"fieldtype": "Column Break",
					},
					{
						"label": "Location Details",
						"fieldname": "location_details_section",
						"fieldtype": "Section Break",
					},
					{
						"label": "Latitude",
						"fieldname": "latitude",
						"fieldtype": "Float",
					},
					{
						"label": "Longitude",
						"fieldname": "longitude",
						"fieldtype": "Float",
					},
					{
						"label": "Location",
						"fieldname": "location",
						"fieldtype": "Geolocation",
					},
				],
			});
		});
	});
	it('Creating a record for the doctype and checking if the map view for the records works', () => {
		cy.visit('/app/doctype');
		cy.click_listview_row_item(0);

		//Assigning autoname to the doctype
		cy.get_field('autoname', 'Data').clear().type('LOCATION.#####');
		cy.findByRole('button', {name: 'Save'}).click();
		cy.new_form('Test Location');	
		cy.get('#navbar-breadcrumbs').contains('Test Location').click();
		cy.click_listview_primary_button('Add Test Location');

		//Filling up the form for "Test Location" doctype
		cy.fill_field('location_name', 'Mumbai', 'Data');
		cy.get_field('latitude', 'float').clear().type('19.09131', {delay: 500});
		cy.get_field('longitude', 'float').clear().type('72.91336', {delay: 500});
		cy.get('.leaflet-draw-draw-marker').click();
		cy.get('#unique-0').click();
		cy.findByRole('button', {name: 'Save'}).click();

		//Checking for the URL if the view is List View
		cy.visit('/app/test-location/view/list');
		cy.get('.title-text').should('have.text', 'Test Location');
		cy.get('.custom-btn-group-label').contains('List View').click();
		cy.get('.dropdown-menu').should('contain', 'Map');
		cy.get('[data-view="Map"]').click();

		//Checking for the URL if the view is Map View
		cy.location('pathname').should('eq', '/app/test-location/view/map');
		cy.get('.title-text:visible').should('have.text', 'Test Location Map');

		//Checking if the map shows the location selected in the record in map view
		cy.get('.leaflet-marker-icon:visible').should('be.visible').click({multiple: true, force: true});
		cy.get('.leaflet-popup-content').contains(/LOCATION0000/);
		});

	it('Checking if removing the location from the map in the record also removes it from the map view', () => {
		cy.go_to_list('Test Location');
		cy.click_listview_row_item(0);
		cy.get('#navbar-breadcrumbs > :nth-child(1) > a').contains('Test Location').click({force: true});
		cy.wait(500);
		cy.click_listview_row_item(0);

		//Removing the location from the record
		cy.get('.leaflet-draw-edit-remove').click();
		cy.get('[title="Clear all layers"]').click({force: true});
		cy.findByRole('button', {name: 'Save'}).click();
		cy.go_to_list('Test Location');
		cy.get('.custom-btn-group-label').contains('List View').click();
		cy.get('[data-view="Map"]').click();

		//Checking if the location is still visible in the map view
		cy.get('.map-view-container').should('not.have.class', 'leaflet-marker-icon');
	});

	it('Removing the doc', () => {
		cy.go_to_list('Test Location');
		cy.get('.list-row-checkbox').eq(0).click();
		cy.get('.actions-btn-group > .btn').contains('Actions').click();
		cy.get('.actions-btn-group > .dropdown-menu [data-label="Delete"]').click();
		cy.click_modal_primary_button('Yes');
		cy.get('.btn-modal-close').click();
	});		
});