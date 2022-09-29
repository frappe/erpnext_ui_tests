context('Employee', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Create Employee', () => {
		let dob = "1985-05-11"
		cy.window()
			.its("moment")
			.then((moment) => {
				const todaysDate = moment().format('YYYY-MM-DD');
				cy.create_records({
					doctype: "Employee",
					first_name: "John",
					last_name: "Mayer",
					date_of_birth: dob,
					date_of_joining: todaysDate,
					company: "Wind Power LLC",
					status: "Active",
					gender: "Male"
				});
			});	
		cy.go_to_list('Employee');
		cy.list_open_row('John Mayer');
		cy.get_page_title().should('contain', 'Active');
	});
});
