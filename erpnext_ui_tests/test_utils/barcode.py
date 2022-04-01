import frappe

from erpnext.stock.doctype.item.test_item import make_item

@frappe.whitelist()
def create_barcode_scan_test_docs():
	simple_item = make_item("ScanNormalItem", properties={"barcodes": [{"barcode": "12399"}]})

	batch_item = make_item("ScanBatchItem", properties={"has_batch_no": 1})
	for batch_no in ("ScanBatchItem1", "ScanBatchItem2"):
		frappe.get_doc(
				doctype="Batch",
				item=batch_item.name,
				batch_id=batch_no,
			).insert(ignore_if_duplicate=True)

	serial_item = make_item("ScanSerialItem", properties={"has_serial_no": 1})

	for serial_no in ("ScanSerialItem1", "ScanSerialItem1"):
		frappe.get_doc(
				doctype="Serial No",
				item_code=serial_item.name,
				serial_no=serial_no,
			).insert(ignore_if_duplicate=True)

