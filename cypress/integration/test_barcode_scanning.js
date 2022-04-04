const input_scan = (scan_string) => {
	cy.get_field("scan_barcode", "Data")
		.invoke("val", scan_string)
		.trigger("input");
	cy.wait(1500);
};

// assert partially supplied item attributes with actual frm object.
const assert_items = (item_list) => {
	cy.window()
		.its("cur_frm")
		.then((frm) => {
			item_list.forEach((expected_item, idx) => {
				const actual_item = frm.doc.items[idx];
				for (const prop in expected_item) {
					assert.equal(
						expected_item[prop],
						actual_item[prop],
						`Expected :${JSON.stringify(expected_item, null, 2)}
						 Actual: ${JSON.stringify(actual_item, null, 2)}`
					);
				}
			});
		});
};

context("Barcode scanning", () => {
	before(() => {
		cy.login();
		cy.visit("/app");

		cy.call(
			"erpnext_ui_tests.test_utils.barcode.create_barcode_scan_test_docs"
		);
	});

	beforeEach(() => {
		cy.new_doc_view("Stock Entry");

		cy.window()
			.its("cur_frm")
			.then((frm) => {
				frm.clear_table("items");
			});
	});

	it("should scan normal item", () => {
		input_scan("12399");
		assert_items([{ item_code: "ScanNormalItem", qty: 1 }]);

		input_scan("12399");
		assert_items([{ item_code: "ScanNormalItem", qty: 2 }]);
	});

	it("should scan batched item", () => {
		input_scan("ScanBatchItem1");

		assert_items([
			{ item_code: "ScanBatchItem", qty: 1, batch_no: "ScanBatchItem1" },
		]);

		input_scan("ScanBatchItem1");
		assert_items([
			{ item_code: "ScanBatchItem", qty: 2, batch_no: "ScanBatchItem1" },
		]);

		// second batch should be in second row
		input_scan("ScanBatchItem2");
		assert_items([
			{ item_code: "ScanBatchItem", qty: 2, batch_no: "ScanBatchItem1" },
			{ item_code: "ScanBatchItem", qty: 1, batch_no: "ScanBatchItem2" },
		]);

		input_scan("ScanBatchItem2");
		assert_items([
			{ item_code: "ScanBatchItem", qty: 2, batch_no: "ScanBatchItem1" },
			{ item_code: "ScanBatchItem", qty: 2, batch_no: "ScanBatchItem2" },
		]);
	});

	it("should scan serial items", () => {
		input_scan("ScanSerialItem1");
		assert_items([
			{
				item_code: "ScanSerialItem",
				qty: 1,
				serial_no: "ScanSerialItem1",
			},
		]);

		// duplicates shouldnt do anything
		input_scan("ScanSerialItem1");
		assert_items([
			{
				item_code: "ScanSerialItem",
				qty: 1,
				serial_no: "ScanSerialItem1",
			},
		]);

		// same item serial no should get merged in same row
		input_scan("ScanSerialItem2");
		assert_items([
			{
				item_code: "ScanSerialItem",
				qty: 2,
				serial_no: "ScanSerialItem1\nScanSerialItem2",
			},
		]);
	});
});
