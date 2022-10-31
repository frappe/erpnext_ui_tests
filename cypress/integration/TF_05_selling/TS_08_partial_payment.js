context('Partial Payment', () => {
	before(() => {
		cy.login();
	});

	it('Create Sales Invoice', () => {
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
			cy.submit_doc()
			cy.get_page_title().should('contain', 'Unpaid');
			cy.get_read_only('outstanding_amount').invoke('text').should('match', /₹ 1,10,000.00/);
		});
	});

	it('Create First Payment against invoice', () => {
		cy.visit('app/sales-invoice');
		cy.click_listview_row_item(0);
		cy.click_dropdown_action('Create', 'Payment');
		cy.url().should('include', '/app/payment-entry/new-payment-entry');

		cy.get_input('party').should('have.value', 'William Harris');
		cy.get_input('paid_amount').should('have.value', '1,10,000.00');
		cy.set_input('paid_amount', '50000');
		cy.get_input('paid_amount').blur();
		cy.get_input('references.reference_doctype').should('have.value', 'Sales Invoice');
		cy.get_input('allocated_amount').should('have.value', '50,000.000');

		cy.get_read_only('difference_amount')
			.invoke('text')
			.then(text => {
				const diff_amount = text.split(' ').pop();
				cy.log(diff_amount);
				if (diff_amount == 0){
					cy.log('success');
				} else {
					cy.findByRole('button', {name: 'Set Exchange Gain / Loss'}).click();
				}
			});

		cy.set_input('reference_no', 'Ref-1');
		cy.set_today('reference_date');

		cy.click_toolbar_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'Submitted');

		cy.visit('app/sales-invoice/');
		cy.click_listview_row_item(0);
		cy.get_page_title().should('contain', 'Partly Paid');
		cy.get_read_only('outstanding_amount').invoke('text').should('match', /₹ 60,000.00/);
	});

	it('Create Second Payment against invoice', () => {
		cy.visit('app/sales-invoice');
		cy.click_listview_row_item(0);
		cy.click_dropdown_action('Create', 'Payment');
		cy.url().should('include', '/app/payment-entry/new-payment-entry');

		cy.get_input('party').should('have.value', 'William Harris');
		cy.get_input('paid_amount').should('have.value', '60,000.00');
		cy.get_input('references.reference_doctype').should('have.value', 'Sales Invoice');
		cy.get_input('allocated_amount').should('have.value', '60,000.000');

		cy.get_read_only('difference_amount')
			.invoke('text')
			.then(text => {
				const diff_amount = text.split(' ').pop();
				cy.log(diff_amount);
				if (diff_amount == 0){
					cy.log('success');
				} else {
					cy.findByRole('button', {name: 'Set Exchange Gain / Loss'}).click();
				}
			});

		cy.set_input('reference_no', 'Ref-2');
		cy.set_today('reference_date');

		cy.click_toolbar_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'Submitted');

		cy.visit('app/sales-invoice/');
		cy.click_listview_row_item(0);
		cy.get_page_title().should('contain', 'Paid');
		cy.get_read_only('outstanding_amount').invoke('text').should('match', /₹ 0.0/);
	});
});
