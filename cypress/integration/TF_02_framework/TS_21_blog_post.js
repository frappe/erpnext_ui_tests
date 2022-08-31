context('Blog Post', () => {
    before(() => {
        cy.login();
        cy.visit('/app');
    });

    it('Creates Blog Category and Blogger', () => {
		//Creating a Blog Category
		cy.insert_doc(
			"Blog Category",
				{
					title: 'Environment'
				},
		);
		cy.go_to_list('Blog Category');
		cy.list_open_row('Environment');

		//Checking if the default fields are set correctly for Blog Category
		cy.get_field('published').should('be.checked');
		cy.get_read_only('route').should('contain', 'blog/environment');

		//Creating a Blogger
		cy.insert_doc(
			"Blogger",
				{
					short_name: 'Bethy',
					full_name: 'Beth Terry',
					bio: 'MD(San Francisco Bay Area)',
					avatar: 'https://myplasticfreelife.com/wp-content/uploads/2013/07/Beth-Terry-East-Bay-Express-cover-900x1200-1.jpg'
				},
		);
		cy.go_to_list('Blogger');
		cy.list_open_row('Beth Terry');

		//Checking if the default fields are set correctly for Blogger
		cy.get('.form-dashboard').should('exist');
		cy.get('.form-dashboard-section').find('.section-body .document-link').should('have.attr', 'data-doctype', 'Blog Post');
		cy.get('.sidebar-image').should('exist');
	});

	it('Creates Blog Post', () => {
		cy.new_form('Blog Post');
		cy.click_toolbar_button('Save');
		cy.get_open_dialog().should('contain', 'Missing Fields')
			.and('contain', 'Mandatory fields required in Blog Post');
		cy.get_error_msg().find('li').should('contain', 'Title')
			.and('contain', 'Blog Category')
			.and('contain', 'Blogger');
		cy.reload();

		//Setting the title, blog category and blogger
		cy.set_input('title', 'My Plastic Free Life');
		cy.set_link('blog_category', 'Environment');
		cy.set_link('blogger', 'Beth Terry');
		cy.get_field('route').should('have.value', 'blog/environment/my-plastic-free-life');
		cy.get_field('published').check();
		
		//Setting the intro and content for blog
		cy.set_textarea('blog_intro', 'Building a plastic free environment and saving the world');
		
		//Clicking on different content type from the dropdown and checking if they result in correct editors
		cy.get_select('content_type').should('contain', 'Rich Text');
		cy.get('[data-fieldname="content"]').should('have.attr', 'data-fieldtype', 'Text Editor');
		cy.set_select('content_type', 'Markdown');
		cy.get('[data-fieldname="content_md"]').should('have.attr', 'data-fieldtype', 'Markdown Editor');
		cy.set_select('content_type', 'HTML');
		cy.get('[data-fieldname="content_html"]').should('have.attr', 'data-fieldtype', 'HTML Editor');
		cy.set_select('content_type', 'Rich Text');
		cy.fill_field('content', 'Here are my top steps to get started on a plastic-free journey. Choose a few to begin with', 'Text Editor')
			.type('{enter}', {scrollBehavior: false});
		cy.fill_field('content', 'Carry reusable shopping bags.', 'Text Editor').type('{enter}', {scrollBehavior: false});
		cy.fill_field('content', 'Give up bottled water.', 'Text Editor').type('{enter}', {scrollBehavior: false});
		cy.fill_field('content', 'Shop your local farmers market.', 'Text Editor').type('{enter}', {scrollBehavior: false});
		cy.fill_field('content', 'Say no to plastic produce bags.', 'Text Editor').type('{enter}', {scrollBehavior: false});
		cy.fill_field('content', 'Buy from bulk bins as often as possible.', 'Text Editor').type('{enter}', {scrollBehavior: false});
		cy.get_field('content','Text Editor').type('{selectall}', {scrollBehavior: false});
		cy.get('[value="ordered"]').first().click({scrollBehavior: false});
		
		//Checking if correct preview is visible
		cy.get_read_only('google_preview').scrollIntoView().should('contain', 'My Plastic Free Life');
		cy.save();

		//Checking if the published date is today's and the indicator shows published
		const todaysDate = Cypress.moment().format('DD-MM-YYYY');
		cy.get_input('published_on').should('have.value', todaysDate);
		cy.get_page_indicator().should('have.text','Published');
		cy.visit('/blog/environment/my-plastic-free-life');

		//Removing the created docs
		// cy.remove_doc('Blog Category', 'environment');
		// cy.remove_doc('Blogger', 'Bethy');
		// cy.remove_doc('Blog Post', 'my-plastic-free-life');
	});
});
