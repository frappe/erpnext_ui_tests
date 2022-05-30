context("Workstation", () => {
	before(() => {
		cy.login();
	});

	it("Create a workstation", () => {
		let name = 'WB-0001'
		cy.new_doc("Workstation");
		cy.set_input('workstation_name', name);
		cy.set_input('production_capacity', '1000');
		cy.set_input('hour_rate_electricity', '100');
		cy.set_input('hour_rate_consumable', '500');
		cy.set_input('hour_rate_rent', '100');
		cy.set_input('hour_rate_labour', '100');
		cy.save();
		cy.wait(500);
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
			cy.new_doc("Workstation");
			cy.set_input('workstation_name', name);
			cy.set_input('production_capacity', '1000');
			cy.set_input('hour_rate_electricity', '200');
			cy.set_input('hour_rate_consumable', '500');
			cy.set_input('hour_rate_rent', '200');
			cy.set_input('hour_rate_labour', '200');
			cy.save();
			cy.wait(500);
			cy.get_page_title().should('contain', name);
		});
});
