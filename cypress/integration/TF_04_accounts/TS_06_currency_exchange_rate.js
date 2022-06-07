const TEST_RATE = 110000;

context('Currency and Exchange Rate Check', () => {
	before(() => {
		cy.login();
		cy.visit('/app');
	});

	it('Create quotation with different currency and fetching currency exchange rate', () => {
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

		cy.insert_doc(
			"Quotation",
				{
					naming_series: 'SAL-QTN-.YYYY.-',
					quotation_to: 'Customer',
					party_name: 'William Harris',
					transaction_date: date,
					order_type: 'Sales',
					currency: 'INR',
					items: [{item_code: 'Apple iPhone 13 Pro Max', qty: 1, rate: TEST_RATE}]
				},
			true
		).then((c)=>{
			console.log(c);
			cy.visit('app/quotation/'+ c.name);
			cy.get_input('quotation_to').should('have.value', 'Customer');
			cy.get_input('party_name').should('have.value', 'William Harris');
			cy.wait(200);

			cy.click_section('Currency and Price List');
			cy.set_link('currency', 'EUR');
			cy.wait(400);

			cy.click_section('Currency and Price List');
			cy.get_input('conversion_rate')
 				.invoke('val')
				.then(val => {
					const exRate = val;
					cy.log("exchange rate " + exRate);
					const roundedExchRate = Number(exRate).toFixed(2);

					const rate = (110000/exRate);
					const roundedRate = Number(rate).toFixed(2);
					cy.log("rounded rate " + roundedRate);
					//const formattedRate = new Intl.NumberFormat().format(roundedRate);
					const formattedRate = Number(roundedRate).toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
					cy.log("formatted rate " + formattedRate);
					const rateInCurrency = ('€ '+formattedRate);

					cy.get_input('items.item_code').should('have.value', 'Apple iPhone 13 Pro Max');
					cy.get_input('qty').should('have.value', "1.000");
					cy.get_input('rate').should('have.value', formattedRate);
					cy.get_input('amount').should('have.value', formattedRate);

					const total = (roundedRate * roundedExchRate);
					const roundedTotal = Number(total).toFixed(2);
					const formattedTotal = Intl.NumberFormat('en-IN').format(roundedTotal);
					cy.log("total " + formattedTotal);
					const totalInCurrency = ('₹ '+formattedTotal);

					cy.get_read_only('total_qty').should('contain', "1");
					cy.get_read_only('total').should('contain', rateInCurrency);
					cy.get_read_only('base_total').should('contain', totalInCurrency);

					cy.get_read_only('base_grand_total').should('contain', totalInCurrency);
					cy.get_read_only('grand_total').should('contain', rateInCurrency);
					cy.get_read_only('base_rounded_total').should('contain', totalInCurrency);
					cy.get_read_only('rounded_total').should('contain', rateInCurrency);
				});

			cy.click_toolbar_button('Save');
			cy.get_page_title().should('contain', 'Draft');
			cy.click_toolbar_button('Submit');
			cy.click_modal_primary_button('Yes');
			cy.get_page_title().should('contain', 'Open');
		});
	});
});
