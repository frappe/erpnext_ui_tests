context('Chart Of Accounts', () => {
	before(() => {
		cy.login();
	});

    beforeEach(() => {
        cy.visit(`app/account/view/tree`);
	});

    it('Check if Expand All works', () => {
        cy.findByRole('button', {name: 'Expand All'}).trigger('click', {force: true});
        cy.get(".tree-children").should("be.visible")
    });

    it('Check if Chart of Cost Center under View dropdown works', () => {
        cy.findByRole('button', {name: 'View'}).trigger('click', {force: true});
        cy.get('[data-label="Chart%20of%20Cost%20Centers"]').click( {delay: 200});
        cy.location("pathname").should("eq","/app/cost-center/view/tree");
    });

    it('Check if Opening Invoice Creation Tool under View dropdown works', () => {
        cy.findByRole('button', {name: 'View'}).trigger('click', {force: true});
        cy.get('[data-label="Opening%20Invoice%20Creation%20Tool"]').click();
        cy.location("pathname").should("eq","/app/opening-invoice-creation-tool");
    });

    it('Check if Period Closing Voucher under View dropdown works', () => {
        cy.findByRole('button', {name: 'View'}).trigger('click', {force: true});
        cy.get('[data-label="Period%20Closing%20Voucher"]').click();
        cy.location("pathname").should("eq","/app/period-closing-voucher");
    });

    it('Check if Journal Entry page visit in Create dropdown works', () => {
        cy.findByRole('button', {name: 'Create'}).trigger('click', {force: true});
        cy.get('[data-label="Journal%20Entry"]').click();
        cy.location("pathname").should("eq","/app/journal-entry/new-journal-entry-1");
    });

    it('Check if Company page visit in Create dropdown works', () => {
        cy.findByRole('button', {name: 'Create'}).trigger('click', {force: true});
        cy.get('[data-label="Company"]').click();
        cy.location("pathname").should("eq","/app/company/new-company-1");
    });

    it('Check Financial Statements : Trial Balance', () => {
        cy.findByRole('button', {name: 'Financial Statements'}).trigger('click', {force: true});
        cy.get('[data-label="Trial%20Balance"]').click();
        cy.location("pathname").should("eq","/app/query-report/Trial%20Balance");
    });

    it('Check Financial Statements : General Ledger', () => {
        cy.findByRole('button', {name: 'Financial Statements'}).trigger('click', {force: true});
        cy.get('[data-label="General%20Ledger"]').click();
        cy.location("pathname").should("eq","/app/query-report/General%20Ledger");
    });

    it('Check Financial Statements : Balance Sheet', () => {
        cy.findByRole('button', {name: 'Financial Statements'}).trigger('click', {force: true});
        cy.get('[data-label="Balance%20Sheet"]').click();
        cy.location("pathname").should("eq","/app/query-report/Balance%20Sheet");
    });

    it('Check Financial Statements : P&L', () => {
        cy.findByRole('button', {name: 'Financial Statements'}).trigger('click', {force: true});
        cy.get('[data-label="Profit%20and%20Loss%20Statement"]').click();
        cy.location("pathname").should("eq","/app/query-report/Profit%20and%20Loss%20Statement");
    });

    it('Check Financial Statements : Cash Flow Statement', () => {
        cy.findByRole('button', {name: 'Financial Statements'}).trigger('click', {force: true});
        cy.get('[data-label="Cash%20Flow%20Statement"]').click();
        cy.location("pathname").should("eq","/app/query-report/Cash%20Flow%20Statement");
    });

    it('Check Financial Statements : Accounts Payable', () => {
        cy.findByRole('button', {name: 'Financial Statements'}).trigger('click', {force: true});
        cy.get('[data-label="Accounts%20Payable"]').click();
        cy.location("pathname").should("eq","/app/query-report/Accounts%20Payable");
    });

    it('Check Financial Statements : Accounts Receivable', () => {
        cy.findByRole('button', {name: 'Financial Statements'}).trigger('click', {force: true});
        cy.get('[data-label="Accounts%20Receivable"]').click();
        cy.location("pathname").should("eq","/app/query-report/Accounts%20Receivable");
    });

    it('Check if able to view list through menu', () => {
        cy.get('.custom-actions > .btn').click();
        cy.get('.menu-btn-group > .btn').click();
        cy.get(':nth-child(1) > .grey-link').click();
        cy.location("pathname").should("eq","/app/account");
    });

    it('Check if print option in Menu button works', () => {
        cy.get('.custom-actions > .btn').click();
        cy.get('.menu-btn-group > .btn').click();
        cy.get(':nth-child(2) > .grey-link').click();
        cy.visit(`app/account/view/tree`);
        cy.location("pathname").should("eq","/app/account/view/tree");
        });

    it('Check if refresh option in Menu button works', () => {
        cy.visit(`app/account/view/tree`);
        cy.get('.custom-actions > .btn').click();
        cy.get('.menu-btn-group > .btn').click();
        cy.get(':nth-child(3) > .grey-link').click();
        cy.location("pathname").should("eq","/app/account/view/tree");
    });

    it('Check if Rebuild Tree option in Menu button works', () => {
        cy.get('.custom-actions > .btn').click();
        cy.get('.menu-btn-group > .btn').click();
        cy.get(':nth-child(4) > .grey-link').click();
        cy.location("pathname").should("eq","/app/account/view/tree");
    });

    it('Check if New Company option in Menu button works', () => {
        cy.get('.custom-actions > .btn').click();
        cy.get('.menu-btn-group > .btn').click();
        cy.get(':nth-child(5) > .grey-link').click();
        cy.location("pathname").should("eq","/app/company/new-company-1");
    });

    it('Check if New button works', () => {
        cy.findByRole('button', {name: 'New'}).trigger('click', {force: true});
        cy.visit(`app/account/view/tree`);
        cy.location("pathname").should("eq","/app/account/view/tree");
    });
});
