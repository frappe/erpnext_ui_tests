context('Quality Inspection Template', () => {
	before(() => {
        cy.login();
    });

	it('Create Inspection Parameters', () => {
        cy.new_doc('Quality Inspection Parameter');
        cy.set_input('parameter', 'Weight check');
        cy.save();
		cy.wait(500);
		cy.new_doc('Quality Inspection Parameter');
        cy.set_input('parameter', 'Loading test with 80 kg force');
        cy.save();
		cy.new_doc('Quality Inspection Parameter');
        cy.set_input('parameter', 'Bending strength');
        cy.save();
		cy.new_doc('Quality Inspection Parameter');
        cy.set_input('parameter', 'Compressive strength');
        cy.save();
    });

    it('Create Quality Inspection Template', () => {
        cy.new_doc('Quality Inspection Template');
        cy.set_input('quality_inspection_template_name', 'Quality Inspection Template - I');

		cy.grid_open_row('item_quality_inspection_parameter', 1);
		cy.set_link('specification', 'Weight check');
		cy.get_field('numeric', 'checkbox').check();
		cy.set_input('min_value', '220');
		cy.set_input('max_value', '440');
		cy.close_grid_edit_modal();

		cy.grid_add_row('item_quality_inspection_parameter');
		cy.grid_open_row('item_quality_inspection_parameter', 2);
		cy.set_link('specification', 'Loading test with 80 kg force');
		cy.set_input('min_value', '300');
		cy.set_input('max_value', '440');
		cy.close_grid_edit_modal();

		cy.grid_add_row('item_quality_inspection_parameter');
		cy.grid_open_row('item_quality_inspection_parameter', 3);
		cy.set_link('specification', 'Bending strength');
		cy.set_input('min_value', '15000');
		cy.set_input('max_value', '17000');
		cy.close_grid_edit_modal();

		cy.grid_add_row('item_quality_inspection_parameter');
		cy.grid_open_row('item_quality_inspection_parameter', 4);
		cy.set_link('specification', 'Compressive strength');
		cy.set_input('min_value', '1000');
		cy.set_input('max_value', '8000');
		cy.close_grid_edit_modal();

		cy.save();
    });
});
