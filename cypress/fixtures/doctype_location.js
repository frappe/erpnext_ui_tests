export default {
	name: "Test Location",
	actions: [],
	custom: 1,
	naming_rule: "Expression (old style)",
	autoname: "LOCATION.#####",
	creation: "2022-02-09 20:15:21.242213",
	doctype: "DocType",
	engine: "InnoDB",
	fields: [
		{
			"label": "Location Name",
			"fieldname": "location_name",
			"fieldtype": "Data",
			"in_list_view": 1,
		},
		{
			"label": "",
			"fieldname": "column_break_3",
			"fieldtype": "Column Break",
		},
		{
			"label": "Location Details",
			"fieldname": "location_details_section",
			"fieldtype": "Section Break",
		},
		{
			"label": "Latitude",
			"fieldname": "latitude",
			"fieldtype": "Float",
		},
		{
			"label": "Longitude",
			"fieldname": "longitude",
			"fieldtype": "Float",
		},
		{
			"label": "Location",
			"fieldname": "location",
			"fieldtype": "Geolocation",
		},
	],
	links: [],
	modified: "2022-02-10 12:03:12.603763",
	modified_by: "Administrator",
	module: "Custom",
	owner: "Administrator",
	permissions: [
		{
			create: 1,
			delete: 1,
			email: 1,
			print: 1,
			read: 1,
			role: 'System Manager',
			share: 1,
			write: 1
		}
	],
	sort_field: 'modified',
	sort_order: 'ASC',
	track_changes: 1
};