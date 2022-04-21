context('Image View', () => {
	before(() => {
		cy.login();
		cy.visit('/app/user');
	});

	it('Gets all the Users in the list view and the image view', () => {
		//Gets the users in the list view
		cy.get_list('User').then(body => body.data.forEach(user => {
			cy.get_doc('User', user.name);
		}));

		//Goes to the image view of the user
		cy.get('.custom-btn-group-label').contains('List View').click();
		cy.get('[data-view="Image"]').click();
		cy.get_field('full_name', 'Data').clear();

		//Gets the users in the image view
		cy.get_list('User').then(body => body.data.forEach(user => {
			cy.get_doc('User', user.name);
		}));
	});

	it('Creates new user and checks if it visible in both list view and image view', () => {
		cy.visit('/app/user');
		cy.get('.custom-btn-group-label').contains('List View').click();
		cy.get('.dropdown-menu').should('contain', 'Image');
		cy.get('[data-view="Image"]').click();

		//Creates a new user record
		cy.create_records({
			doctype: 'User',
			email: 'test@example.com',
			first_name: 'Test User'
		});
		cy.visit('/app/user');
		cy.get_field('full_name', 'Data').clear();
		cy.get('.custom-btn-group-label').contains('List View').click();
		cy.location('pathname').should('eq', '/app/user');
		cy.get('[data-view="Image"]').click();
		cy.get_field('full_name', 'Data').clear();

		//Checks the URL after the visiting the Image view
		cy.location('pathname').should('eq', '/app/user/view/image');
		cy.get('.image-view-container').should('contain', 'Test User');

		//Visits the created user
		cy.get(':nth-child(1) > .image-view-footer > .image-title > span.ellipsis > .ellipsis').click();
		cy.location('pathname').should('eq', '/app/user/test@example.com');

		//Uploads an image for the user
		cy.get('.sidebar-image-actions > .dropdown > .dropdown-toggle').contains('Change').click({force: true});
		cy.get('.dropdown-item').contains('Upload').click({force: true});
		cy.findByRole('button', {name: 'Link'}).click();
		cy.findByPlaceholderText('Attach a web link').type('https://wallpaperplay.com/walls/full/8/2/b/72402.jpg');
		cy.intercept("POST", "/api/method/upload_file").as("upload_image");
		cy.get('.modal-footer').findByRole("button", {name: "Upload"}).click({delay: 500});
		cy.wait("@upload_image");
		cy.findByRole('button', {name: 'Save'}).click();

		//Checks if the added image is visible in the image view
		cy.visit('/app/user/view/image');
		cy.get('.image-field > img[data-name="test@example.com"]').should('have.attr', 'src', 'https://wallpaperplay.com/walls/full/8/2/b/72402.jpg');

		//Clicking the like button and checks if the "liked" class is active
		cy.get('.like-action[data-name="test@example.com"]').should('not.have.class', 'liked');
		cy.get('.like-action[data-name="test@example.com"]').click({force: true});
		cy.get('.like-action[data-name="test@example.com"]').should('have.class', 'liked');

		//Applying the filter for full name and checking if it gives "Test User" as result
		cy.get_field('full_name', 'Data').clear();
		cy.fill_field('full_name', 'Test User', 'Data');
		cy.get('.image-view-container').should('contain', 'Test User');

		//Deleting the user record
		cy.go_to_list('User');
		cy.get('.list-row-checkbox').eq(0).click();
		cy.get('.actions-btn-group > .btn').contains('Actions').click();
		cy.get('.actions-btn-group > .dropdown-menu [data-label="Delete"]').click();
		cy.click_modal_primary_button('Yes');
		cy.get('.btn-modal-close').click();

		//Checking if the deleted record also gets deleted from the image view
		cy.get('.custom-btn-group-label').contains('List View').click();
		cy.get('[data-view="Image"]').click();
		cy.get_field('full_name', 'Data').clear();
		cy.get('.image-view-container').should('not.contain', 'Test User');
	});
});