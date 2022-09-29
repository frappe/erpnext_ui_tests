import frappe
from frappe import _

@frappe.whitelist()
def create_sales_tax_template():
	if frappe.db.exists("Sales Taxes and Charges Template", {"name": "test Output GST In-state - WP"}):
		return

	template = frappe.get_doc(
		{
			"doctype": "Sales Taxes and Charges Template",
            "title": "test Output GST In-state",
            "tax_category": "test in-state category",
			"taxes": [
						{
							"charge_type": "On Net Total",
							"account_head": "test Output Tax SGST - WP", 
							"description": "Output Tax SGST @ 9.0",
							"rate": 9
						},
						{
							"charge_type": "On Net Total",
							"account_head": "test Output Tax CGST - WP",
							"description": "Output Tax CGST @ 9.0",
							"rate": 9
						}
				],
		}
	)
	template.insert()


@frappe.whitelist()
def create_item_tax_template():
	if frappe.db.exists("Item Tax Template", {"name": "test GST 5% - WP"}):
		return

	frappe.get_doc(
		{
			"doctype": "Item Tax Template",
            "title": "test GST 5%",
			"taxes": [
					{
						"tax_type": "test Output Tax SGST - WP",
						"tax_rate": 2.5
					},
					{
						"tax_type": "test Output Tax CGST - WP",
						"tax_rate": 2.5
					},
					{
						"tax_type": "test Output Tax IGST - WP",
						"tax_rate": 5
					}
				],
		}
	).insert()

@frappe.whitelist()
def create_item_tax_template1():
	if frappe.db.exists("Item Tax Template", {"name": "test GST 12% - WP"}):
		return

	frappe.get_doc(
		{
			"doctype": "Item Tax Template",
            "title": "test GST 12%",
			"taxes": [
					{
						"tax_type": "test Output Tax CGST - WP",
						"tax_rate": 6
					},
					{
						"tax_type": "test Output Tax SGST - WP",
						"tax_rate": 6
					},
					{
						"tax_type": "test Output Tax IGST - WP",
						"tax_rate": 12
					}
				],
		}
	).insert()