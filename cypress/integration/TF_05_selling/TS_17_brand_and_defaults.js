context('Brand', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Creating a brand and setting its defaults', () => {
		cy.new_doc('Brand');
		cy.set_input('brand', "Samsung");
		cy.set_textarea('description', 'A multinational electronics corporation');
		cy.grid_add_row('brand_defaults');
		cy.grid_open_row('brand_defaults', '1');
		cy.get_input('company').focus();
		cy.get_input('default_warehouse').should('have.value', "Stores - WP"); //WP
		cy.scrollTo('bottom', {ensureScrollable: false});
		cy.get('.grid-footer-toolbar > .btn').scrollIntoView();

		cy.get_input('selling_cost_center').scrollIntoView().click();
		cy.set_link('selling_cost_center', 'Main - WP'); //WP
		//cy.get_select('income_account').should('contain', 'Account Receivable')
		//	.and('contain', 'Bank Accounts');
		cy.set_link('income_account', 'Administrative Expenses - WP'); //WP
		cy.close_grid_edit_modal();
		cy.save();
	});

	it('Creating an item and linking the brand in it', () => {
		cy.create_records({
			doctype: 'Item',
			item_code: 'Samsung Galaxy Z Fold4',
			item_group: 'All Item Groups',
			opening_stock: '5',
			valuation_rate: '140000',
			stock_uom: 'Nos'
		});
		cy.go_to_list('Item');
		cy.list_open_row('Samsung Galaxy Z Fold4');
		cy.get_input('item_name').should('have.value', 'Samsung Galaxy Z Fold4');
		cy.open_section('Description');
		cy.get_input('brand').scrollIntoView().click();
		cy.set_link('brand', 'Samsung');
		cy.save();
	});

	it('Validating brand defaults in Sales Invoice', () => {
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

		cy.insert_doc(
			"Sales Invoice",
			{
				naming_series: "ACC-SINV-.YYYY.-",
				posting_date: date,
				customer: "William Harris",
				due_date: date,
				items: [{item_code: "Samsung Galaxy Z Fold4", qty: 1, rate: 140000, amount: 140000}]
			},
			true
		).then((SI)=>{
			cy.visit('app/sales-invoice/'+ SI.name);
			cy.grid_open_row('items', '1');
			cy.get_input('item_code').should('have.value', 'Samsung Galaxy Z Fold4');
			cy.get_section('Accounting Details').scrollIntoView().should('be.visible');
			cy.open_section('Accounting Details');
			cy.get_input('income_account').should('have.value', 'Administrative Expenses - WP'); // WP

			cy.get_section('Stock Details').click();
			cy.get_input('warehouse').should('have.value', 'Stores - WP'); // WP

			//cy.findByText('Accounting Dimensions').should('be.visible').click({force:true});
			//cy.get('.grid-form-body .form-page [data-fieldname="accounting_dimensions_section"] .section-head').click({force:true});
			cy.click_modal_section("accounting_dimensions_section");
			cy.get_input('cost_center').should('have.value', 'Main - WP'); // WP

			cy.close_grid_edit_modal();
			cy.submit_doc('Unpaid');
		});
	});
});
