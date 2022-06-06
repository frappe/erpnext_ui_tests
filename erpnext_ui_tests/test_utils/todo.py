import frappe

def create_test_todo(description, assigned_by="Administrator", priority="Medium"):
	return frappe.get_doc({
		"doctype": "ToDo",
		"description": description,
		"priority": priority,
		"assigned_by": assigned_by
	}).insert(ignore_permissions=True)


@frappe.whitelist()
def create_todo_test_docs():
	create_test_todo("test todo", priority="High")
	create_test_todo("test todo", priority="Medium")
