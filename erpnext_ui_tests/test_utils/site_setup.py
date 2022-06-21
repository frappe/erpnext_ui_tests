# Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt

import frappe
from erpnext.setup.utils import _enable_all_roles_for_admin, set_defaults_for_tests


def execute():
	frappe.clear_cache()
	from frappe.desk.page.setup_wizard.setup_wizard import setup_complete

	if not frappe.db.a_row_exists("Company"):
		current_year = frappe.utils.now_datetime().year
		setup_complete(
			{
				"currency": "INR",
				"full_name": "Test User",
				"company_name": "Wind Power LLC",
				"timezone": "Asia/Kolkata",
				"company_abbr": "WP",
				"industry": "Manufacturing",
				"country": "India",
				"fy_start_date": f"{current_year}-04-01",
				"fy_end_date": f"{current_year + 1}-03-31",
				"language": "english",
				"company_tagline": "Testing",
				"email": "test@erpnext.com",
				"password": "test",
				"chart_of_accounts": "Standard",
				"domains": ["Manufacturing"],
			}
		)

	frappe.db.sql("delete from `tabLeave Allocation`")
	frappe.db.sql("delete from `tabLeave Application`")
	frappe.db.sql("delete from `tabSalary Slip`")
	frappe.db.sql("delete from `tabItem Price`")

	_enable_all_roles_for_admin()

	set_defaults_for_tests()
	create_default_user()

	frappe.db.commit()


def create_default_user():
	user = frappe.new_doc("User")
	user.email = "frappe@example.com"
	user.first_name = "Frappe"
	user.new_password = "l33t_entropy"
	user.send_welcome_email = 0
	user.insert(ignore_if_duplicate=True)

	user.reload()

	blocked_roles = {"Administrator", "Guest", "All"}
	all_roles = set(frappe.get_all("Role", pluck="name"))

	for role in all_roles - blocked_roles:
		user.append("roles", {"role": role})

	user.save()
