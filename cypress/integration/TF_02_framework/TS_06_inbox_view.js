context('Inbox View', () => {
	before(() => {
		cy.login();
		cy.go_to_list('User');
	});

	it('Setting Email and enabling default email account', () => {
		//Setting Email account for user administrator
		cy.list_open_row('Administrator');
		cy.wait(500);
		cy.click_tab('Settings');
		cy.click_section_head('email_settings');
		cy.grid_add_row('user_emails');
		cy.set_link('user_emails.email_account','Notifications');
		cy.save();
		cy.reload();

		//Setting default outgoing email account
		cy.go_to_list('Email Account');
		cy.list_open_row('Notifications');
		cy.get_field('awaiting_password', 'checkbox').check();
		cy.get_field('enable_outgoing', 'checkbox').check();
		cy.get_field('default_outgoing', 'checkbox').check();
		cy.save();
	});

	it('Checking if the Inbox view has been enabled and sending one email using the email account', () => {
		//Verifying if the Inbox view has been enabled
		cy.go_to_list('Communication');
		cy.location('pathname').should('eq', '/app/communication');
		cy.reload();
		cy.get_page_title().should('contain', 'Communication');
		cy.click_custom_toolbar_button('List View');
		cy.click_toolbar_dropdown('Inbox');
		cy.location('pathname').should('eq', '/app/communication/view/inbox/Notifications');
		cy.get_page_title().should('contain', 'Notifications');
		cy.get('.views-section:visible').should('contain', 'Inbox');
		cy.get('.views-section .selected-view:visible').should('contain', 'Notifications');
		cy.get('.views-section .selected-view:visible').click({force: true});
		cy.get('.views-section .list-link:visible').find('li').should('have.length', 3);

		//Checking if the notifications dropdown contains the required options
		cy.get('.views-section .list-link:visible').find('li').should('contain', 'Sent Mail')
			.and('contain', 'Spam')
			.and('contain','Trash');
		cy.get_filter_button().should('contain', '4 filters');
		cy.get_select('status').should('contain', 'Open');
		cy.get_select('sent_or_received').should('contain','Received');

		//Composing and sending an email
		cy.get('.frappe-list button.btn-new-doc:visible').should('contain', 'Compose Email')
			.click({force: true});
		cy._set_input('recipients', 'notifications@example.com');
		cy.get('.control-input input[data-fieldname="subject"]:visible').type('Test Mail', {scrollBehavior: false, force: true});
		cy.fill_field('content', 'Test Mail', 'Text Editor');
		cy.click_modal_primary_button('Send');
		cy.get('.list-row-head').should('contain','Subject')
			.and('contain','From');
	});

	it('Deleting the mail and reseting the email account configurations', () => {
		cy.click_custom_toolbar_button('Inbox View');
		cy.click_toolbar_dropdown('List');
		cy.location('pathname').should('eq', '/app/communication/view/list');
		cy.click_listview_checkbox(0);
		cy.click_action_button('Actions');
		cy.click_toolbar_dropdown('Delete');
		cy.get('.modal-footer > .standard-actions > button.btn-primary:visible').contains('Yes').click({force: true});
		cy.hide_dialog();
		cy.go_to_list('Email Account');
		cy.list_open_row('Notifications');
		cy.get_field('awaiting_password', 'checkbox').uncheck();
		cy.get_field('enable_outgoing', 'checkbox').uncheck();
		cy.save();
	});
});
