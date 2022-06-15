context('Terms and Condition', () => {
	before(() => {
		cy.login();
	});

	it('Creating a dummy terms and conditions from UI', () => {
		cy.new_doc('Terms and Conditions');
		cy.set_input('title','Dummy Terms');
		cy.get_input('selling', 'checkbox').should('be.checked');
		cy.get_input('buying', 'checkbox').should('be.checked');
		cy.get_input('hr', 'checkbox').should('be.checked');
		//cy.get_field('terms','This is Dummy Terms and Conditions');
		cy.get_field('terms', 'Text Editor').type('This is Dummy Terms and Conditions');
		cy.wait(500);
		cy.save();
	});

	it('Adding another terms and conditions record', () => {
		cy.visit('/app/terms-and-conditions');
		cy.insert_doc(
			"Terms and Conditions",
			{
				title: "Standard Terms and Condition",
				selling: 1,
				buying: 1,
				terms: "<div class=\"ql-editor read-mode\"><p>This is a sample term and conditions text - </p><p><br></p><p>Some common topics that Terms and Conditions should contain:</p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Validity of the offer.</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Payment Terms (In Advance, On Credit, part advance, etc).</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>What is extra (or payable by the Customer).</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Safety/usage warning.</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Warranty if any.</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Return Policy.</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Terms of shipping, if applicable.</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Ways of addressing disputes, indemnity, liability, etc.</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Address and Contact of your Company.</li></ol><p>Terms and conditions are the general and special arrangements, provisions, requirements, rules, specifications, and standards that a company follows. These specifications are an integral part of an agreement or contract that the company gets into with its customers, suppliers or partners.</p></div>",
			},
			true
		)
	});

	it('Deleting the dummy terms and conditions created above', () => {
		cy.remove_doc('Terms and Conditions', 'Dummy Terms');
	});
});
