
context('Warehouse', () => {
	before(() => {
		cy.login();
	});

    it('Check if Expand Tree works', () => {
		cy.visit(`app/warehouse/view/tree`);
		cy.click_toolbar_button('Expand All');
		cy.get(".tree-children").should("be.visible");
        cy.location("pathname").should("eq","/app/warehouse/view/tree");
    });

    it('Check if able to view list through menu', () => {
		cy.visit(`app/warehouse/view/tree`);
        cy.click_menu_button();
        cy.click_toolbar_dropdown('View List');
        cy.location("pathname").should("eq","/app/warehouse");
    });

    it('Check if print option in Menu button works', () => {
		cy.visit(`app/warehouse/view/tree`);
        cy.click_menu_button();
        cy.click_toolbar_dropdown('Print');
        cy.visit(`app/warehouse/view/tree`);
        cy.location("pathname").should("eq","/app/warehouse/view/tree");
    });

    it('Check if refresh option in Menu button works', () => {
	    cy.visit(`app/warehouse/view/tree`);
        cy.click_menu_button();
        cy.click_toolbar_dropdown('Refresh');
        cy.location("pathname").should("eq","/app/warehouse/view/tree");
    });

    it('Check if new button works', () => {
        cy.click_listview_primary_button('New');
        cy.visit(`app/warehouse/view/tree`);
        cy.location("pathname").should("eq","/app/warehouse/view/tree");
    });
});
