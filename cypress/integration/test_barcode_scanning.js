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
		cy.get_field("scan_barcode", "Data").type("12399");
		cy.wait(2000);
		cy.window()
			.its("cur_frm")
			.then((frm) => {
				assert.equal(frm.doc.items[0].item_code, "ScanNormalItem");
				assert.equal(frm.doc.items[0].qty, 1);
			});

		cy.get_field("scan_barcode", "Data").type("12399");
		cy.wait(2000);
		cy.window()
			.its("cur_frm")
			.then((frm) => {
				assert.equal(frm.doc.items[0].qty, 2);
			});
	});

	it("should scan batched item", () => {
		cy.get_field("scan_barcode", "Data").type("ScanBatchItem1");
		cy.wait(2000);

		cy.window()
			.its("cur_frm")
			.then((frm) => {
				assert.equal(frm.doc.items[0].item_code, "ScanBatchItem");
				assert.equal(frm.doc.items[0].batch_no, "ScanBatchItem1");
				assert.equal(frm.doc.items[0].qty, 1);
			});

		cy.get_field("scan_barcode", "Data").type("ScanBatchItem1");
		cy.wait(2000);
		cy.window()
			.its("cur_frm")
			.then((frm) => {
				assert.equal(frm.doc.items[0].qty, 2);
			});

		// second batch should be in second row
		cy.get_field("scan_barcode", "Data").type("ScanBatchItem2");
		cy.wait(2000);
		cy.window()
			.its("cur_frm")
			.then((frm) => {
				assert.equal(frm.doc.items[1].item_code, "ScanBatchItem");
				assert.equal(frm.doc.items[1].batch_no, "ScanBatchItem2");
				assert.equal(frm.doc.items[1].qty, 1);
			});

		cy.get_field("scan_barcode", "Data").type("ScanBatchItem2");
		cy.wait(2000);
		cy.window()
			.its("cur_frm")
			.then((frm) => {
				assert.equal(frm.doc.items[1].qty, 2);
			});
	});

	it("should scan serial items", () => {
		cy.get_field("scan_barcode", "Data").type("ScanSerialItem1");
		cy.wait(2000);

		cy.window()
			.its("cur_frm")
			.then((frm) => {
				assert.equal(frm.doc.items[0].item_code, "ScanSerialItem");
				assert.equal(frm.doc.items[0].serial_no, "ScanSerialItem1");
				assert.equal(frm.doc.items[0].qty, 1);
			});

		// duplicates shouldnt do anything
		cy.get_field("scan_barcode", "Data").type("ScanSerialItem1");
		cy.wait(2000);

		cy.window()
			.its("cur_frm")
			.then((frm) => {
				assert.equal(frm.doc.items[0].serial_no, "ScanSerialItem1");
				assert.equal(frm.doc.items[0].qty, 1);
			});

		// same item serial no should get merged in same row
		cy.get_field("scan_barcode", "Data").type("ScanSerialItem2");
		cy.wait(2000);

		cy.window()
			.its("cur_frm")
			.then((frm) => {
				assert.equal(frm.doc.items[0].qty, 2);
				assert.equal(
					frm.doc.items[0].serial_no,
					"ScanSerialItem1\nScanSerialItem2"
				);
			});
	});
});
