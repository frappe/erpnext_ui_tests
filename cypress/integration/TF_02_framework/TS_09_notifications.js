context('Notifications', () => {
    before(() => {
        cy.login();
        cy.go_to_list('User');
    });

    it('Creating a new user and Todo', () => {
        //Creating a new user with all the roles assigned
        cy.new_doc('User');
        cy.set_input('email', 'test_notif_user@example.com');
        cy.set_input('first_name', 'Test Notification User');
        cy.get_field('send_welcome_email', 'Check').uncheck();
        cy.save();
		// cy.get('.modal-actions button.btn-modal-close').click({force: true, multiple: true});
		// //cy.get('.modal').type('{esc}');
		cy.reload();
        cy.set_input_awesomebar('User');
        cy.list_open_row('Test Notification User');
        cy.wait(1000);
        cy.get('.role-editor button.select-all').click({force: true});
        cy.wait(500);
        cy.click_section('Change Password');
        cy.set_input('new_password', 'password@12345');
        cy.save();
		cy.get('.modal').type('{esc}');
		
        //Creating a new todo
        cy.set_input_awesomebar('todo');
        cy.create_records({
            doctype: 'ToDo',
            priority: 'Low',
            description: 'This is a test notifications Todo'
        });
    });

    it('Login in into the new user and verifying if the notifications panel is initially empty', () => {
        //Login in into the new user
        cy.logout('Administrator');
        cy.user_login('test_notif_user@example.com', 'password@12345');
        cy.get('.navbar .nav-item .nav-link[data-original-title="Notifications"]').click({force: true});
        cy.get('.notification-list-header').should('exist');

        //Checking if the notifications panel has 2 tabs
        cy.get('.notification-list-header .nav-tabs').find('li').should('have.length', '2');
        cy.get('.notification-list-header .nav-tabs .notifications-category').should('contain', 'Notifications')
        .and('contain', "Today's Events");

        //Checking if the notifications tab is the active tab
        cy.get('#notifications:visible').should('have.class', 'active');

        //Checking if the notifications and events panel is empty
        cy.get('.notification-list-body .panel-notifications').should('contain', 'No New notifications');
        cy.get('#todays_events').click({force: true});
        cy.get('#todays_events:visible').should('have.class', 'active');
        cy.get('.notification-list-body .panel-events').should('contain', 'No Upcoming Events');
        cy.logout('Test Notification User');
        cy.user_login('administrator', 'admin');
        cy.wait(2000);
    });

    it('Assigning a todo to the new user using the admin login and verifying if the notification is sent to user', () => {
        cy.set_input_awesomebar('todo');
		cy.get_input('allocated_to').clear();
		cy.get_input('name').click();
        cy.list_open_row('This is a test notifications Todo');

        //Assigning todo to the new user Billy Jones
        cy.get('.form-sidebar button.add-assignment-btn').click({force: true});
        cy.set_input('assign_to', 'test_notif_user{enter}');
        cy.click_modal_primary_button('Add');
        cy.logout('Administrator');
        cy.user_login('test_notif_user@example.com', 'password@12345');
        cy.get('.navbar .nav-item .nav-link[data-original-title="Notifications"]').click({force: true});

        //Checking if the notification is sent and is visible in the notifications panel of the user Billy Jones
        cy.get('.message').should('exist');
        cy.get('.subject-title').should('have.text', 'This is a test notifications Todo');
    });

    it('Deleting user and todo', () => {
        cy.logout('Test Notification User');
        cy.user_login('administrator', 'admin');

        //Deleting the user Billy Jones
        cy.delete_first_record('user');
		cy.get('.modal').type('{esc}');

        //Deleting todo
        cy.set_input_awesomebar('todo');
		cy.get_input('allocated_to').clear();
		cy.get_input('name').click();
        cy.click_listview_checkbox(0);
        cy.click_action_button('Actions');
        cy.click_toolbar_dropdown('Delete');
        cy.click_modal_primary_button('Yes');
    });
});