context('User Group', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Test', () => {
		// cy.insert_doc(
		// 	"User",
		// 	{
		// 		email: "beth_keil@test.com",
		// 		first_name: "Beth keil"
		// 	},
		// )
		cy.new_form('User');
		cy.set_input('email', 'beth_keil@test.com');
		cy.set_input('first_name', 'Beth keil');
		//cy.go_to_list('User');
		//cy.list_open_row('Beth keil');
		cy.wait(500);
		cy.click_toolbar_button('Save');
		cy.reload();
		cy.findByRole("tab", { name: "Roles & Permissions" }).click();
		cy.get('button.select-all').click();
		cy.wait(500);
		cy.click_tab('Settings');
		cy.get('#user-settings_tab .section-head').contains('Change Password').click();
		cy.set_input('new_password', 'password@12345');
		cy.save();

		// cy.insert_doc(
		// 	"User",
		// 	{
		// 		email: "beth_ketty@test.com",
		// 		first_name: "Beth Ketty"
		// 	},
		// )
		cy.new_form('User');
		cy.set_input('email', 'beth_ketty@test.com');
		cy.set_input('first_name', 'Beth Ketty');
		//cy.go_to_list('User');
		//cy.list_open_row('Beth Ketty');
		cy.wait(500);
		cy.click_toolbar_button('Save');
		cy.reload();
		cy.findByRole("tab", { name: "Roles & Permissions" }).click();
		cy.get('button.select-all').click();
		cy.wait(500);
		cy.click_tab('Settings');
		cy.get('#user-settings_tab .section-head').contains('Change Password').click();
		cy.set_input('new_password', 'password@12345');
		cy.save();

		cy.new_form('User Group');
		cy.click_toolbar_button('Save');
		cy.wait(1000);
		cy.get_open_dialog().should('contain', 'Missing Fields')
			.and('contain', 'Mandatory fields required in User Group');
		cy.get_error_msg().find('li').should('contain', 'Name')
			.and('contain', 'User Group Members');
		cy.hide_dialog();
		cy.set_input('__newname', 'Test User Group');
		cy.get_input('user_group_members').click();
		cy.get('.link-field').find('ul > li')
			.should('contain', 'beth_keil@test.com')
			.and('contain', 'beth_ketty@test.com');

		cy.get('.link-field li [title="beth_keil@test.com"]').click({force: true});
		cy.get_input('user_group_members').click();
		cy.get('.link-field li [title="beth_ketty@test.com"]').click({force: true});
		cy.save();

		cy.get('[data-fieldname="comment"]:visible').type('@Test User Group');
		cy.get('.ql-mention-list').find('li').should('contain', 'Test User Group');
		cy.get('.ql-mention-list').find('li').contains('Test User Group').click({force: true});
		cy.get('[data-fieldname="comment"]:visible').type('Test Comment');
		cy.get('.comment-box .btn-primary').contains('Comment').click({force: true});

		cy.new_form('User Group');
		cy.set_input('__newname', 'Test User Group');
		cy.get('.help-box').should('contain', 'Test User Group already exists. Select another name');
		cy.click_toolbar_button('Save');
		cy.get_open_dialog().should('contain', 'Missing Fields')
			.and('contain', 'Mandatory fields required in User Group');
		cy.get_error_msg().find('li').should('contain', 'User Group Members');
		cy.hide_dialog();
		cy.get_input('user_group_members').click();
		cy.get('.link-field li [title="beth_ketty@test.com"]').click({force: true});
		cy.save();
		cy.get_open_dialog().should('contain', 'Duplicate Name')
		.and('contain', 'User Group Test User Group already exists');
		
		cy.logout('Administrator');
        cy.user_login('beth_keil@test.com', 'password@12345');
        cy.get('.navbar .nav-item .nav-link[data-original-title="Notifications"]').click({force: true});
		cy.get('.subject-title').should('have.text', 'Test Comment');
		cy.logout('Beth keil');
		cy.user_login('beth_ketty@test.com', 'password@12345');
        cy.get('.navbar .nav-item .nav-link[data-original-title="Notifications"]').click({force: true});
		cy.get('.subject-title').should('have.text', 'Test Comment');
		cy.logout('Beth Ketty');
		cy.user_login('Administrator', 'admin');

		cy.remove_doc('User Group', 'Test User Group');
		cy.remove_doc('User', 'beth_keil@test.com');
		cy.remove_doc('User', 'beth_ketty@test.com');
	});
}); 