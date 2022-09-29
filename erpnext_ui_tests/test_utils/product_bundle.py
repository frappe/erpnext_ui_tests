import frappe
from frappe import _
from frappe.utils import add_to_date, now

@frappe.whitelist()
def create_product_bundle1():
	if frappe.db.exists("Product Bundle", {"name": "Single Seater Sofa Set With Table Set of 3"}):
		return

	bundle = frappe.get_doc(
		{
			"doctype": "Product Bundle",
            "new_item_code": "Single Seater Sofa Set With Table Set of 3",
            "description": "Set of Coffee Table and Single Seater Sofa",
			"items": [
						{
							'item_code': 'Pristine White Single Seater Sofa Set',
							'qty': 2
						},
						{
							'item_code': 'Coffee Table',
							'qty': 1
						},
					],
		}
	)
	bundle.insert()

@frappe.whitelist()
def create_product_bundle2():
	if frappe.db.exists("Product Bundle", {"name": "Book Storage Set"}):
		return

	bundle1 = frappe.get_doc(
		{
			"doctype": "Product Bundle",
            "new_item_code": "Book Storage Set",
            "description": "Set of Book Shelf and Book Case",
			"items": [
						{
							'item_code': 'Alpine Book Shelves In Wenge Finish',
							'qty': 1
						},
						{
							'item_code': 'Mandarin Book Case In Wenge Finish',
							'qty': 1
						},
					],
		}
	)
	bundle1.insert()

@frappe.whitelist()
def create_child_item():
	if frappe.db.exists("Item", {"name": "Pristine White Single Seater Sofa Set"}):
		return

	frappe.get_doc(
		{
			"doctype": "Item",
			"item_code": "Pristine White Single Seater Sofa Set",
            "item_group": 'All Item Groups',
			"opening_stock": '1000',
			"valuation_rate": '20000',
			"standard_rate": '20000',
			"stock_uom": 'Nos',
			"uoms": [
						{
							'uom': 'Set',
							'conversion_factor': 2
						},
					],
		}
	).insert()
