context('Image View', () => {
	before(() => {
		cy.login();
		cy.go_to_list('User');
	});

	it('Gets all the Users in the list view and the image view', () => {
		//Gets the users in the list view
		cy.get_list('User').then(body => body.data.forEach(user => {
			cy.get_doc('User', user.name);
		}));

		//Goes to the image view of the user
		cy.click_custom_toolbar_button('List View');
		cy.click_toolbar_dropdown('Image');
		cy.get_input('full_name').clear();

		//Gets the users in the image view
		cy.get_list('User').then(body => body.data.forEach(user => {
			cy.get_doc('User', user.name);
		}));
	});

	it('Creates new user and checks if it visible in both list view and image view', () => {
		cy.go_to_list('User');
		cy.click_custom_toolbar_button('List View');
		cy.click_toolbar_dropdown('Image');

		//Creates a new user record
		cy.create_records({
			doctype: 'User',
			email: 'test_user123@example.com',
			first_name: 'Test Website User'
		});
		cy.go_to_list('User');
		cy.get_input('full_name').clear();
		cy.click_custom_toolbar_button('List View');
		cy.location('pathname').should('eq', '/app/user');
		cy.click_toolbar_dropdown('Image');
		cy.get_input('full_name').clear();

		//Checks the URL after the visiting the Image view
		cy.location('pathname').should('eq', '/app/user/view/image');
		cy.get('.image-view-container').should('contain', 'Test Website User');

		//Visits the created user
		cy.get('.image-view-footer').contains('Test Website User').click();

		//Uploads an image for the user
		cy.get('.sidebar-image-actions > .dropdown > .dropdown-toggle').contains('Change').click({force: true});
		cy.get('.dropdown-item').contains('Upload').click({force: true});
		cy.findByRole('button', {name: 'Link'}).click();
		cy.findByPlaceholderText('Attach a web link').type('https://wallpaperplay.com/walls/full/8/2/b/72402.jpg');
		cy.intercept("POST", "/api/method/upload_file").as("upload_image");
		cy.get('.modal-footer').findByRole("button", {name: "Upload"}).click({delay: 500});
		cy.wait("@upload_image");
		cy.click_toolbar_button('Save');

		//Checks if the added image is visible in the image view
		cy.visit('/app/user/view/image');
		cy.get('.image-field > img[data-name="test_user123@example.com"]').should('have.attr', 'src', 'https://wallpaperplay.com/walls/full/8/2/b/72402.jpg');

		//Clicking the like button and checks if the "liked" class is active
		cy.get('.like-action[data-name="test_user123@example.com"]').should('not.have.class', 'liked');
		cy.get('.like-action[data-name="test_user123@example.com"]').click({force: true});
		cy.get('.like-action[data-name="test_user123@example.com"]').should('have.class', 'liked');

		//Applying the filter for full name and checking if it gives "Test Website User" as result
		cy.get_input('full_name').clear();
		cy.set_input('full_name','Test Website User');
		cy.get('.image-view-container').should('contain', 'Test Website User');

		//Deleting the user record
		cy.go_to_list('User');
		cy.click_listview_checkbox(0);
		cy.click_action_button('Actions');
		cy.click_toolbar_dropdown('Delete');
		cy.click_modal_primary_button('Yes');
		cy.click_modal_close_button();

		//Checking if the deleted record also gets deleted from the image view
		cy.click_custom_toolbar_button('List View');
		cy.click_toolbar_dropdown('Image');
		cy.get_input('full_name').clear();
		cy.get('.image-view-container').should('not.contain', 'Test Website User');
	});
}); 