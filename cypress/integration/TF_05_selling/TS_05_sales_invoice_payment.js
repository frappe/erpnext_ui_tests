context('Sales Invoice Payment', () => {
	before(() => {
		cy.login();
	});

	it('Create Sales Invoice', () => {
		cy.visit('app/sales-invoice');
		var today = new Date();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1; // Months start at 0!
		let dd = today.getDate();
		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
		var today_date = dd + '-' + mm + '-' + yyyy;

		cy.visit('app/sales-invoice');
		cy.click_listview_row_item(0);
		cy.get_page_title().should('contain', 'Unpaid');
		cy.click_dropdown_action('Create', 'Payment');
		cy.url().should('include', '/app/payment-entry/new-payment-entry');

		cy.get_select('naming_series').should('have.value', 'ACC-PAY-.YYYY.-');
		cy.get_select('payment_type').should('have.value', 'Receive');
		cy.get_input('posting_date').should('have.value', today_date);

		cy.get_input('party_type').should('have.value', 'Customer');
		cy.get_input('party').should('have.value', 'William Harris');
		cy.get_input('paid_amount').should('have.value', '1,10,000.00');

		cy.get_input('references.reference_doctype').should('have.value', 'Sales Invoice');
		cy.get_input('allocated_amount').should('have.value', '1,10,000.000');

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

		cy.set_input('reference_no', 'ABC-123');
		cy.set_today('reference_date');

		cy.save();
		cy.get_page_title().should('contain', 'Draft');
		cy.submit('Submitted');
	});
});
