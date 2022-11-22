context('Puchase Invoice Payment', () => {
	before(() => {
		cy.login();
	});

	it('Creating Purchase Invoice Payment from the submitted invoice', () => {
		cy.visit('app/purchase-invoice');
		cy.click_listview_row_item(0);
		cy.get_page_title().should('contain', 'Unpaid');
		cy.click_dropdown_action('Create', 'Payment');

		cy.url().should('include', '/app/payment-entry/new-payment-entry');

		cy.get_select('naming_series').should('have.value', 'ACC-PAY-.YYYY.-');
		cy.get_select('payment_type').should('have.value', 'Pay');
		cy.get_input('posting_date').should('not.have.value', 0);
		cy.get_input('company').should('not.have.value', 0);

		cy.get_input('party_type').should('have.value', 'Supplier');
		cy.get_input('party').should('have.value', 'Lisa Davis');
		cy.get_input('party_name').should('have.value', 'Lisa Davis');

		cy.get_input('paid_amount').should('have.value', '2,50,000.00');

		cy.get_input('references.reference_doctype').should('have.value', 'Purchase Invoice');
		cy.get_input('allocated_amount').should('have.value', '2,50,000.000');

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

		cy.get_input('reference_no').scrollIntoView().click({force: true});
		cy.get_field('reference_no', 'Data').type('PI-pay-123');
		//cy.set_input('reference_no', 'ABC-123');
		cy.set_today('reference_date');

		cy.save();
		cy.get_page_title().should('contain', 'Draft');
		cy.submit_doc('Submitted');

		cy.visit('app/purchase-invoice');
		cy.click_listview_row_item(0);
		cy.get_page_title().should('contain', 'Paid');
	})
})
