//Doctypes for testing whether quick entry form opens for the respective doctypes
const test_quick_entry_doctypes = [
	"User",
	"Project",
	"Item", 
	"Customer", 
	"Supplier",
	"Role", 
	"Issue",
	"UOM", 
	"ToDo",
	"Bank",
	"Location",
	"Item Price",
	"Color",
	"Country",
	"Workstation",
	"Comment",
	"Batch"
];

describe("Test quick entry for doctypes", () => {
	before(() => {
		cy.login();
	});

	test_quick_entry_doctypes.forEach((doctype) => {
		it(`should open quick entry ${doctype} form without any errors`, () => {
			const slug = (name) => name.toLowerCase().replaceAll(" ", "-");
			cy.visit(`/app/${slug(doctype)}`);

			//Clicking on Add button to open the quick entry form 
			//Also checking if the dialog opens and heading of the dialog consists of the doctype name
			cy.get('.page-head button.primary-action')
				.contains('Add '+doctype)
				.click({force: true, scrollBehavior: false});
			cy.get('.modal-dialog').should('exist');
			cy.findByRole("heading", { level: 4 }).contains('New '+doctype);
		});
	});

	it('Creating quick entries for following doctypes: User, Item and Project', () => {
		cy.go_to_list('User');
		cy.click_listview_primary_button('Add User');
		cy.set_input('email', 'jenny_holmes@example.com');
		cy.set_input('first_name', 'Jenny Holmes');
		cy.get_field('send_welcome_email', 'Check').uncheck();
		cy.click_modal_primary_button('Save');
		// cy.get('.modal-footer .standard-actions button.btn-modal-primary')
		// 	.contains('Save')
		// 	.click({force: true});
		cy.reload();
		cy.get('.frappe-list').contains('Jenny Holmes');
		cy.remove_doc('User', 'jenny_holmes@example.com');

		cy.go_to_list('Item');
		cy.click_listview_primary_button('Add Item');
		cy.set_input('item_code', 'Table');
		cy.get('.modal-dialog [data-fieldname="item_group"] input:visible')
			.type('Products', {delay: 300});
		cy.wait(1000);
		cy.get('.modal-dialog [data-fieldname="item_group"] input:visible')
			.type('{enter}');	
		cy.click_modal_primary_button('Save');
		// cy.get('.modal-footer .standard-actions button.btn-modal-primary')
		// 	.contains('Save')
		// 	.click({force: true});
		cy.reload();
		cy.get('.frappe-list').contains('Table');
		cy.remove_doc('Item', 'Table');

		cy.go_to_list('Project');
		cy.click_listview_primary_button('Add Project');
		cy.get('.modal-dialog [data-fieldname="project_name"] input:visible')
			.type('Test Project', {delay: 200});
		cy.click_modal_primary_button('Save');
		// cy.get('.modal-footer .standard-actions button.btn-modal-primary')
		// 	.contains('Save')
		// 	.click({force: true});
		cy.wait(500);
		cy.reload();
		cy.get('.frappe-list').contains('Test Project');
		cy.remove_doc('Project', 'PROJ-0002');
	});
});
