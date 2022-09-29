context("Workstation", () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it("Create a workstation", () => {
		let name = 'WB-0001'
		cy.create_records({
            doctype: 'Workstation',
            workstation_name: name,
            production_capacity: '1000',
			hour_rate_electricity: '100',
			hour_rate_consumable: '500',
			hour_rate_rent: '100',
			hour_rate_labour: '100'
        });
		cy.go_to_list('Workstation');
		cy.list_open_row(name);
		cy.get_read_only('hour_rate').should('contain','800');
		cy.get_page_title().should('contain', name);

		cy.compare_document({
			workstation_name: name,
			production_capacity: "1000",
			hour_rate_electricity: "100",
			hour_rate_consumable: "500",
			hour_rate_rent: "100",
			hour_rate_labour: "100",
		});
	});

	it("Create another workstation", () => {
		let name = 'WB-0002'
		cy.create_records({
			doctype: 'Workstation',
			workstation_name: name,
			production_capacity: '1000',
			hour_rate_electricity: '200',
			hour_rate_consumable: '500',
			hour_rate_rent: '200',
			hour_rate_labour: '200'
		});
		cy.go_to_list('Workstation');
		cy.list_open_row(name);
		cy.get_page_title().should('contain', name);
	});
});
