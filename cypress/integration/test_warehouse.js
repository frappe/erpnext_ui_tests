
context('Warehouse', () => {
	before(() => {
		cy.login();
	});

	it('Vist the warehouse tree view page', () => {
	cy.visit(`app/warehouse/`);
        cy.get('.custom-btn-group > .btn').click();
        cy.get('[data-view="Tree"] > .grey-link').click();
        cy.location("pathname").should("eq","/app/warehouse/view/tree");
    });

    it('Check if Expand Tree works', () => {
	cy.visit(`app/warehouse/view/tree`);
        cy.get('.custom-actions > .btn').click();
        cy.location("pathname").should("eq","/app/warehouse/view/tree");
    });

    it('Check if able to view list through menu', () => {
	cy.visit(`app/warehouse/view/tree`);
        cy.get('.custom-actions > .btn').click();
        cy.get('.menu-btn-group > .btn').click();
        cy.get(':nth-child(1) > .grey-link').click(); //Check if redirects to list view 
        cy.location("pathname").should("eq","/app/warehouse");
    });

    it('Check if print option in Menu button works', () => {
	cy.visit(`app/warehouse/view/tree`);
        cy.get('.custom-actions > .btn').click();
        cy.get('.menu-btn-group > .btn').click();
        cy.get(':nth-child(2) > .grey-link').click(); //Check if redirects to print
        cy.visit(`app/warehouse/view/tree`);
        cy.location("pathname").should("eq","/app/warehouse/view/tree");
    });

    it('Check if refresh option in Menu button works', () => {
	    cy.visit(`app/warehouse/view/tree`);
        cy.get('.custom-actions > .btn').click();
        cy.get('.menu-btn-group > .btn').click();
        cy.get(':nth-child(4) > .grey-link').click(); //Check if redirects to unexpand tree 
        cy.location("pathname").should("eq","/app/warehouse/view/tree");
    });

    it('Check if new button works', () => {
        cy.findByRole('button', {name: 'New'}).trigger('click', {force: true});
        cy.visit(`app/warehouse/view/tree`);
        cy.location("pathname").should("eq","/app/warehouse/view/tree");
    });
});
