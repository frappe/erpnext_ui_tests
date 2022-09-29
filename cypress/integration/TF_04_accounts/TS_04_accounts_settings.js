context('Accounts Settings', () => {
	before(() => {
		cy.login();
	});

	it('Check unlinking of Payment on cancellation of Invoice', () => {
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

		cy.visit('/app/accounts-settings');
		cy.get_input('unlink_payment_on_cancellation_of_invoice', 'checkbox').should('be.checked');

		cy.insert_doc(
			"Sales Invoice",
			{
					naming_series: "ACC-SINV-.YYYY.-",
					posting_date: date,
					customer: "William Harris",
					due_date: date,
					items: [{"item_code": "Apple iPhone 13 Pro Max", "qty": 1, "rate": 110000, "amount": 110000}]
			},
			true
		).then((a)=>{
			console.log(a);
			cy.visit('app/sales-invoice/'+ a.name);
			cy.submit_doc('Unpaid');
			cy.click_dropdown_action('Create', 'Payment');
			cy.set_input('reference_no', 'ABC-1234');
			cy.set_today('reference_date');
			cy.save();
			cy.submit_doc();

			cy.visit('app/sales-invoice');
			cy.click_listview_row_item(0);
			cy.click_toolbar_button('Cancel');
			cy.findByRole('button', {name: 'Yes'}).click();
			cy.click_modal_close_button();

			cy.get('.modal-title:visible').should('contain', 'Message');
			cy.get('.msgprint').invoke('text').should('match', /Payment Entries ACC-PAY-.+ are un-linked/);
		});
	});
});
