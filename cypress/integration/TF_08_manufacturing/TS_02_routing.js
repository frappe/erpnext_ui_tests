context('Routing', () => {
	before(() => {
        cy.login();
    });

	it('Create Routing', () => {
		cy.new_doc("Routing");
		cy.set_input('routing_name', 'Routing for Table Manufacturing');
		cy.grid_add_row('operations');
		cy.grid_open_row('operations', '1');
		cy.set_input('sequence_id', '1');
		cy.set_link('operation', 'Attaching the table top with legs');
		cy.set_input('time_in_mins', '1440');
		cy.close_grid_edit_modal();
		cy.grid_add_row('operations');
		cy.grid_open_row('operations', '2');
		cy.set_input('sequence_id', '2');
		cy.set_link('operation', 'Sanding the table');
		cy.set_input('time_in_mins', '2880');
		cy.close_grid_edit_modal();
		cy.grid_add_row('operations');
		cy.grid_open_row('operations', '3');
		cy.set_input('sequence_id', '3');
		cy.set_link('operation', 'Staining the table');
		cy.set_input('time_in_mins', '2880');
		cy.close_grid_edit_modal();
		cy.save();
		cy.get_page_title().should('contain', 'Enabled');
		cy.get_page_title().should('contain', 'Routing for Table Manufacturing');
	});
});
