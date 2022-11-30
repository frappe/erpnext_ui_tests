context('Cretid Note Creation', () => {
	before(() => {
		cy.login();
	});

	it('Credit Note Creation for Invoice without Payment', () => {
		cy.visit('app/sales-invoice');
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		cy.insert_doc(
			"Sales Invoice",
			{
				naming_series: "ACC-SINV-.YYYY.-",
				posting_date: date,
				customer: "William Harris",
				due_date: date,
				items: [{item_code: "Apple iPhone 13 Pro Max", qty: 1, rate: 110000, amount: 110000}]
			},
			true
		).then((d)=>{
			cy.visit('app/sales-invoice/'+ d.name);
			cy.submit_doc();
			cy.get_page_title().should('contain', 'Unpaid');
			cy.get_read_only('outstanding_amount').invoke('text').should('match', /₹ 1,10,000.00/);
			cy.click_dropdown_action('View', 'Accounting Ledger');
			cy.get('.dt-row-1 > .dt-cell--col-5 > .dt-cell__content > div').should('contain', "1,10,000.000");

			cy.visit('app/sales-invoice/'+ d.name);
			cy.click_dropdown_action('Create', 'Return / Credit Note');
			cy.url().should('include', '/app/sales-invoice/new-sales-invoice');
			cy.get_select('naming_series').should('have.value', 'ACC-SINV-.YYYY.-');
			cy.get_input('customer').should('have.value', 'William Harris');
			cy.get_input('is_return', 'checkbox').should('be.checked');
			cy.get_read_only('return_against').should('contain', d.name);

			cy.get_field('set_posting_time', 'Check').check();
			cy.get_input('posting_date').should('not.have.value', 0);
			// cy.set_today('due_date');
			// cy.wait(400);
			// cy.click_modal_close_button();

			cy.get_input('items.item_code').should('have.value', 'Apple iPhone 13 Pro Max');
			cy.get_input('qty').should('have.value', "-1.000");
			cy.get_input('rate').should('have.value', "1,10,000.00");
			cy.get_read_only('amount').should('contain', "-1,10,000.00");

			cy.get_read_only('total_qty').should('contain', "-1");
			cy.get_read_only('total').should('contain', "₹ -1,10,000.00");
			cy.get_read_only('grand_total').should('contain', "₹ -1,10,000.00");
			cy.get_read_only('rounded_total').should('contain', "₹ -1,10,000.00");

			cy.save();
			cy.get_page_title().should('contain', 'Draft');
			cy.click_toolbar_button('Submit');
			cy.click_modal_primary_button('Yes');
			cy.get_page_title().should('contain', 'Return');
			cy.click_dropdown_action('View', 'Accounting Ledger');
			cy.get('.dt-row-1 > .dt-cell--col-5 > .dt-cell__content > div').should('contain', "-1,10,000.000");

			cy.visit('app/sales-invoice/'+ d.name);
			cy.get_page_title().should('contain', 'Credit Note Issued');
		});
	})

	it('Credit Note Creation for Invoice with Payment', () => {

	})
})
