context('Operations', () => {
	before(() => {
        cy.login();
		cy.visit('/app');
    });

		it("Create operation number 1", () => {
			cy.create_records({
				doctype: 'Operation',
				name: 'Attaching the table top with legs',
				workstation: 'WB-0001'
			});
		});

		it("Create operation number 2", () => {
			cy.create_records({
				doctype: 'Operation',
				name: 'Sanding the table',
				workstation: 'WB-0002'
			});
		});

		it("Create operation number 3", () => {
			cy.create_records({
				doctype: 'Operation',
				name: 'Staining the table',
				workstation: 'WB-0002'
			});
     	});
	});
