context('Operations', () => {
	before(() => {
        cy.login();
    });

		it("Create operation number 1", () => {
			cy.new_doc('Operation');
			cy.set_input('__newname', 'Attaching the table top with legs');
			cy.set_link('workstation', 'WB-0001');
			cy.save();
			cy.wait(500);
		});

		it("Create operation number 2", () => {
			cy.new_doc('Operation');
			cy.set_input('__newname', 'Sanding  the table');
			cy.set_link('workstation', 'WB-0002');
			cy.save();
			cy.wait(500);
		});

		it("Create operation number 3", () => {
			cy.new_doc('Operation');
			cy.set_input('__newname', 'Staining the table ');
			cy.set_link('workstation', 'WB-0002');
			cy.save();
			cy.wait(500);
     	});
	});
