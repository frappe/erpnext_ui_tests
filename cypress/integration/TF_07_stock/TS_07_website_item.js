context("Website Item", () => {
	before(() => {
		cy.login();
	});

	it("Create an item", () => {
		cy.visit(`app/item/Teak Shoe Rack`);

		//Creating an item and publishing it
		cy.click_dropdown_action("Actions", "Publish in Website");

		//Checking if dialog box opens upon publishing and redirecting to website item record created
		cy.visit(`app/website-item`);
		cy.click_listview_row_item(0);
		cy.get_input("web_item_name", "Data").should(
			"have.value",
			"Teak Shoe Rack"
		);
		cy.get_field("published", "checkbox").should("be.checked");

		cy.get(".sidebar-menu")
			.contains("See on Website")
			.should("be.visible")
			.should('have.attr', 'target', '_blank')
			.should("have.attr", "href")
			.should("include", "/all-item-groups/teak-shoe-rack")

		cy.visit(`app/website-item`);
		cy.get(".list-row-checkbox").eq(0).click();
		cy.click_dropdown_action("Actions", "Delete");
		cy.click_modal_primary_button("Yes");
	});
});
