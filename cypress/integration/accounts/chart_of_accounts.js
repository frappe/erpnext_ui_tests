context("Chart Of Accounts", () => {
	before(() => {
		cy.login();
	});

	beforeEach(() => {
		cy.visit(`app/account/view/tree`);
	});

	it("Check if Expand All works", () => {
		cy.click_toolbar_button('Expand All');
		cy.get(".tree-children").should("be.visible");
	});

	it("Check if Chart of Cost Center under View dropdown works", () => {
		cy.click_dropdown_action('View', 'Chart of Cost Centers');
		cy.location("pathname").should("eq", "/app/cost-center/view/tree");
	});

	it("Check if Opening Invoice Creation Tool under View dropdown works", () => {
		cy.click_dropdown_action('View', 'Opening Invoice Creation Tool');
		cy.location("pathname").should(
			"eq",
			"/app/opening-invoice-creation-tool"
		);
	});

	it("Check if Period Closing Voucher under View dropdown works", () => {
		cy.click_dropdown_action('View', 'Period Closing Voucher');
		cy.location("pathname").should("eq", "/app/period-closing-voucher");
	});

	it("Check if Journal Entry page visit in Create dropdown works", () => {
		cy.click_dropdown_action('Create', 'Journal Entry');
		cy.location("pathname").should(
			"eq",
			"/app/journal-entry/new-journal-entry-1"
		);
	});

	it("Check if Company page visit in Create dropdown works", () => {
		cy.click_dropdown_action('Create', 'Company');
		cy.location("pathname").should("eq", "/app/company/new-company-1");
	});

	it("Check Financial Statements : Trial Balance", () => {
		cy.click_dropdown_action('Financial Statements', 'Trial Balance');
		cy.location("pathname").should(
			"eq",
			"/app/query-report/Trial%20Balance"
		);
	});

	it("Check Financial Statements : General Ledger", () => {
		cy.click_dropdown_action('Financial Statements', 'General Ledger');
		cy.location("pathname").should(
			"eq",
			"/app/query-report/General%20Ledger"
		);
	});

	it("Check Financial Statements : Balance Sheet", () => {
		cy.click_dropdown_action('Financial Statements', 'Balance Sheet');
		cy.location("pathname").should(
			"eq",
			"/app/query-report/Balance%20Sheet"
		);
	});

	it("Check Financial Statements : P&L", () => {
		cy.click_dropdown_action('Financial Statements', 'Profit and Loss Statement');
		cy.location("pathname").should(
			"eq",
			"/app/query-report/Profit%20and%20Loss%20Statement"
		);
	});

	it("Check Financial Statements : Cash Flow Statement", () => {
		cy.click_dropdown_action('Financial Statements', 'Cash Flow Statement');
		cy.location("pathname").should(
			"eq",
			"/app/query-report/Cash%20Flow%20Statement"
		);
	});

	it("Check Financial Statements : Accounts Payable", () => {
		cy.click_dropdown_action('Financial Statements', 'Accounts Payable');
		cy.location("pathname").should(
			"eq",
			"/app/query-report/Accounts%20Payable"
		);
	});

	it("Check Financial Statements : Accounts Receivable", () => {
		cy.click_dropdown_action('Financial Statements', 'Accounts Receivable');
		cy.location("pathname").should(
			"eq",
			"/app/query-report/Accounts%20Receivable"
		);
	});

	it("Check if able to view list through menu", () => {
		cy.click_dropdown_action('Menu', 'Accounts Receivable');
		cy.location("pathname").should("eq", "/app/account");
	});

	it("Check if print option in Menu button works", () => {
		cy.click_menu_button();
		cy.click_toolbar_dropdown('Print');
		cy.visit(`app/account/view/tree`);
		cy.location("pathname").should("eq", "/app/account/view/tree");
	});

	it("Check if refresh option in Menu button works", () => {
		cy.click_menu_button();
		cy.click_toolbar_dropdown('Refresh');
		cy.location("pathname").should("eq", "/app/account/view/tree");
	});

	it("Check if Rebuild Tree option in Menu button works", () => {
		cy.click_menu_button();
		cy.click_toolbar_dropdown('Rebuild Tree');
		cy.location("pathname").should("eq", "/app/account/view/tree");
	});

	it("Check if New Company option in Menu button works", () => {
		cy.click_menu_button();
		cy.click_toolbar_dropdown('New Company');
		cy.location("pathname").should("eq", "/app/company/new-company-1");
	});

	it("Check if New button works", () => {
		cy.click_toolbar_button('New');
		cy.visit(`app/account/view/tree`);
		cy.location("pathname").should("eq", "/app/account/view/tree");
	});
});
