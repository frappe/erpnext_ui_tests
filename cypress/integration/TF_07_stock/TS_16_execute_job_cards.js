context('Executing Job Cards', () => {
	before(() => {
        cy.login();
    });

	it.only('Check status of Work Order', () => {
		cy.visit('/app/work-order');
		cy.click_listview_row_item(0);
		cy.get_page_title().should('contain', 'In Process');
		cy.get_read_only('material_transferred_for_manufacturing').should('contain','1');
	});

	it('Complete Operations via Job Cards', () => {
		cy.visit('app/job-card/view/list');

		//Complete first operation
		cy.click_listview_row_item(0);
		cy.click_toolbar_button('Start Job');
		cy.on('window:alert',  (str) =>  {
			  expect(str).to.equal(`Assign Job to Employee`)});
		cy.get_field('employees', 'Table MultiSelect').clear().type('John Mayer', {delay: 200});
		cy.click_modal_primary_button('Submit');
		cy.wait(1000);
		cy.click_toolbar_button('Complete Job');
		cy.set_input('qty', '1');
		cy.click_modal_primary_button('Submit');
		cy.submit('Completed');

		//Complete second operation
		cy.click_listview_row_item(1);
		cy.click_toolbar_button('Start Job');
		cy.on('window:alert',  (str) =>  {
			  expect(str).to.equal(`Assign Job to Employee`)});
		cy.set_select('employees', 'Maya Menon');
		cy.click_modal_primary_button('Submit');
		cy.wait(1000);
		cy.click_toolbar_button('Complete Job');
		cy.set_input('qty', '1');
		cy.click_modal_primary_button('Submit');
		cy.submit('Completed');

		//Complete third operation
		cy.click_listview_row_item(2);
		cy.click_toolbar_button('Start Job');
		cy.on('window:alert',  (str) =>  {
			  expect(str).to.equal(`Assign Job to Employee`)});
		cy.set_select('employees', 'Maya Menon');
		cy.click_modal_primary_button('Submit');
		cy.wait(1000);
		cy.click_toolbar_button('Complete Job');
		cy.set_input('qty', '1');
		cy.click_modal_primary_button('Submit');
		cy.submit('Completed');
	});

	it('Finish work order', () => {
		cy.click_listview_row_item(0);
  		cy.click_toolbar_button('Finish');
  		cy.on('window:alert',  (str) =>  {
	   		expect(str).to.equal(`Select Quantity`)});
  		cy.set_input('qty', '1');
  		cy.click_modal_primary_button('Create');
  		cy.get_field('stock_entry_type').should('have.value', 'Manufacture');
  		cy.get_field('from_bom', 'checkbox').should('be.checked');
	  	cy.get_input('fg_completed_qty', '1');
	  	cy.save();
	  	cy.wait(500);
	  	cy.submit('Submitted');
	});

	it('Check status for work order', () => {
		cy.click_listview_row_item(0);
  		cy.get_page_title().should('contain', 'Completed');
		cy.get_read_only('produced_qty').should('contain','1');
});
});
