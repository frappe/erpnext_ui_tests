context('Price List', () => {
	before(() => {
		cy.login();
	});

	it('Price List check - Different item prices in same currency', () => {
		cy.visit('/app/price-list');
		cy.new_doc('Price List');
		cy.url().should('include', '/app/price-list/new-price-list');

		cy.set_input('price_list_name', 'Platinum');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_field('selling', 'checkbox').check();
		cy.save();

		cy.new_doc('Price List');
		cy.set_input('price_list_name', 'Gold');
		cy.get_input('currency').should('have.value', 'INR');
		cy.get_field('selling', 'checkbox').check();
		cy.save();

		cy.new_doc('Item Price');
		cy.url().should('include', '/app/item-price/new-item-price');
		cy.set_link('item_code', 'Apple iPhone 13 Pro Max');
		cy.set_link('price_list', 'Standard Selling');
		cy.set_input('price_list_rate', '110000');
		cy.save();
		cy.wait(200);

		cy.new_doc('Item Price');
		cy.url().should('include', '/app/item-price/new-item-price');
		cy.set_link('item_code', 'Apple iPhone 13 Pro Max');
		cy.set_link('price_list', 'Platinum');
		cy.set_input('price_list_rate', '105000');
		cy.save();
		cy.wait(200);

		cy.new_doc('Item Price');
		cy.url().should('include', '/app/item-price/new-item-price');
		cy.set_link('item_code', 'Apple iPhone 13 Pro Max');
		cy.set_link('price_list', 'Gold');
		cy.set_input('price_list_rate', '108000');
		cy.save();
		cy.wait(200);

		cy.insert_doc(
			"Quotation",
				{
					naming_series: "SAL-QTN-.YYYY.-",
					quotation_to: "Customer",
					party_name: "William Harris",
					order_type: "Sales",
					selling_price_list: "Standard Selling",
					items: [{item_code: "Apple iPhone 13 Pro Max", qty: 1, rate: 110000}]
				},
			true
		).then((b)=>{
			console.log(b);
			cy.visit('app/quotation/'+ b.name);
			cy.compare_document({
				party_name: "William Harris",
				items: [{item_code: "Apple iPhone 13 Pro Max", rate: 110000}]
			});
		});
		cy.wait(200);

		cy.insert_doc(
			"Quotation",
				{
					naming_series: "SAL-QTN-.YYYY.-",
					quotation_to: "Customer",
					party_name: "William Harris",
					order_type: "Sales",
					selling_price_list: "Platinum",
					items: [{item_code: "Apple iPhone 13 Pro Max", qty: 1, rate: 105000}]
				},
			true
		).then((b)=>{
			console.log(b);
			cy.visit('app/quotation/'+ b.name);
			cy.compare_document({
				party_name: "William Harris",
				items: [{item_code: "Apple iPhone 13 Pro Max", rate: 105000}]
			});
		});
		cy.wait(200);

		cy.insert_doc(
			"Quotation",
				{
					naming_series: "SAL-QTN-.YYYY.-",
					quotation_to: "Customer",
					party_name: "William Harris",
					order_type: "Sales",
					selling_price_list: "Gold",
					items: [{item_code: "Apple iPhone 13 Pro Max", qty: 1, rate: 108000}]
				},
			true
		).then((b)=>{
			console.log(b);
			cy.visit('app/quotation/'+ b.name);
			cy.compare_document({
				party_name: "William Harris",
				items: [{item_code: "Apple iPhone 13 Pro Max", rate: 108000}]
			});
		});
	});
});
