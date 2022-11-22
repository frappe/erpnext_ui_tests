context('Assignment Rule', () => {
    before(() => {
        cy.login();
        cy.visit('/app');
    });

	it('Creating assigment rule, users and tasks', () => {
        //Creating 5 users
        var genArr = Array.from({length:5},(v,k)=>k+1)
		cy.wrap(genArr).each((index) => {
				cy.create_records({
					doctype: 'User',
					email: 'test' + index + '@test.com',
                    first_name: 'Test' + index,
                    send_welcome_email: 0
				}).as('users');
                cy.go_to_list('User');
                cy.list_open_row('Test' + index);
                cy.findByRole("tab", { name: "Roles & Permissions" }).click();
                cy.get('input[data-unit="System Manager"]').then((role) => {
                    if (role.is(':checked')) {
                        assert.isOk('OK', 'Role System Manager is checked');
                    }
                    else{
                        cy.get('input[data-unit="System Manager"]').check();
                        cy.save();
                    }
                });
                
		});
		cy.go_to_list('User');

        //Creating Assignment Rule
        cy.new_form('Assignment Rule');
        cy.set_input('__newname', 'Test Assignment Rule');
        cy.set_link('document_type', 'Task');
        cy.fill_field('assign_condition', 'status == "Open"','Code');

        // Assigning all days to the assignment rule
        var days = Array.from({length:6},(v,k)=>k+1)
		cy.wrap(days).each((index) => {
            cy.grid_add_row('assignment_days');
            cy.grid_open_row('assignment_days', index);
            cy.get_field('day', 'Select').select(index);
            cy.close_grid_edit_modal();
        });

        //Checking the options available to set the rule for assignment
        cy.get_field('rule', 'Select').should('have.value', 'Round Robin'); // Default value
        cy.get_field('rule', 'Select').select('Load Balancing').should('contain', 'Load Balancing');
        cy.get_field('rule', 'Select').select('Based on Field').should('contain', 'Based on Field');
        cy.get_field('rule', 'Select').select('Round Robin').should('contain', 'Round Robin');


        // Assigning users to the assignment rule
        cy.set_link('users', 'Test1');
        cy.set_link('users', 'Test2');
        cy.set_link('users', 'Test3');
        cy.set_link('users', 'Test4');
        cy.set_link('users', 'Test5');
        cy.save();

        // Creating a task
        var task = Array.from({length:5},(v,k)=>k+1)
		cy.wrap(task).each((index) => {
				cy.create_records({
					doctype: 'Task',
					subject: 'Test Task' + index
				}).as('tasks');
		});
		cy.go_to_list('Task');

        // Checking the assignment of the task
        var tasks_assigned_user = Array.from({length:5},(v,k)=>k+1)
		cy.wrap(tasks_assigned_user).each((index) => {
            cy.list_open_row('Test Task' + index);
            cy.get('.assignments .avatar').should('have.attr', 'title', 'Test' + index);
            cy.go_to_list('Task');
        });

        //Checking the last user assigned to the task
        cy.go_to_list('Assignment Rule');
        cy.list_open_row('Test Assignment Rule');
        cy.get_read_only('last_user').should('contain', 'test5@test.com');

        //Removing the assignment rule, users and tasks
        cy.remove_doc('Assignment Rule', 'Test Assignment Rule');
        var delete_records = Array.from({length:5},(v,k)=>k+1)
		cy.wrap(delete_records).each((index) => {
            cy.delete_first_record('Task');
            cy.reload();
            cy.remove_doc('User', 'test' + index + '@test.com');
		});
	});
});
