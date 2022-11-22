context('Client Script', () => {
    before(() => {
        cy.login();
        cy.visit('/app');
    });

	it('Creating a client script and adding and verifying it on todo doctype', () => {
        //Creating a new client script to be applied on Todo doctype
        cy.new_form('Client Script');
        cy.set_input('__newname', 'Test Client Script');
        cy.set_link('dt', 'ToDo');
        cy.get_field('view', 'Select').should('contain', 'Form');
        cy.get_field('view', 'Select').select('List').should('contain', 'List');
        cy.get_field('view', 'Select').select('Form').should('contain', 'Form');
        cy.get_field('script', 'Code')
            .type('{selectAll}{backspace}', {force: true, scrollBehaviour: false})
            .clear({force: true, scrollBehaviour: false});
        cy.get_field('script','Code')
            .type('frappe.ui.form.on("ToDo", {refresh:function(frm) {if (frm.doc.date < get_today()) {msgprint("You can not select past date in Due Date");}}})', {force: true, scrollBehaviour: false, parseSpecialCharSequences: false});
        cy.wait(1000);
        cy.save();
        cy.get_page_indicator().should('contain', 'Disabled');
        cy.get_field('enabled', 'Check').check();
        cy.save();
        cy.get_page_indicator().should('contain', 'Enabled');
        
        //Checking for basic validation
        cy.new_form('Client Script');
        cy.set_input('__newname', 'Test Client Script');
        cy.get('.help-box').should('contain', 'Test Client Script already exists. Select another name');
        cy.set_link('dt', 'ToDo');
        cy.save();
        cy.get_open_dialog().should('contain', 'Duplicate Name')
			.and('contain', 'Client Script Test Client Script already exists');
		cy.hide_dialog();
        
        //Creating a new todo and checking if the validation set in the client script is working
        cy.new_form('ToDo');
        cy.fill_field('description', 'Test ToDo', 'Text Editor');
        cy.set_input('date', '2021-01-01');
        cy.save();
        cy.get_open_dialog().should('contain', 'Message')
            .and('contain', 'You can not select past date in Due Date');
        cy.hide_dialog();

        //Removing the client script and todo
        cy.remove_doc('Client Script', 'Test Client Script');
        cy.delete_first_record('ToDo');

        //Creating a new client script to be applied on ToDo doctype
        cy.new_form('Client Script');
        cy.set_input('__newname', 'Test Client Script1');
        cy.set_link('dt', 'ToDo');
        cy.get_field('script', 'Code')
            .type('{selectAll}{backspace}', {force: true, scrollBehaviour: false})
            .clear({force: true, scrollBehaviour: false});
        cy.get_field('script','Code')
            .type('frappe.ui.form.on("ToDo", {refresh:function(frm) {frm.set_df_property("assigned_by", "read_only", !frm.is_new());}})', {force: true, scrollBehaviour: false, parseSpecialCharSequences: false});
        cy.wait(1000);
        cy.save();
        cy.get_page_indicator().should('contain', 'Disabled');
        cy.get_field('enabled', 'Check').check();
        cy.save();
        cy.get_page_indicator().should('contain', 'Enabled');

        //Creating a new user to add it in the todo
        cy.create_records({
            doctype: 'User',
            email: 'test_client_script_user@test.com',
            first_name: 'Test Client Script User',
            send_welcome_email: 0
        }).as('users');
        cy.go_to_list('User');
        cy.list_open_row('Test Client Script User');
        cy.findByRole("tab", { name: "Roles & Permissions" }).click();
        cy.get('input[data-unit="System Manager"]').check({force: true});
        cy.save();

        //Creating a new todo and checking if the condition set in the client script is working
        cy.new_form('ToDo');
        cy.fill_field('description', 'Test ToDo', 'Text Editor');
        cy.set_link('assigned_by', 'Test Client Script User');
        cy.get_field('assigned_by', 'Link').should('not.have.class', 'like-disabled-input');
        cy.save();
        cy.wait(1000);
        cy.get_read_only('assigned_by').scrollIntoView().find('.control-value').should('have.class', 'like-disabled-input');

        //Removing the client script ,user and todo
        cy.remove_doc('User', 'test_client_script_user@test.com');
        cy.remove_doc('Client Script', 'Test Client Script1');
        cy.delete_first_record('ToDo');
	});
});
