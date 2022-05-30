## ERPNext UI Tests

[![UI](https://github.com/erpnext/erpnext_ui_tests/actions/workflows/ui-tests.yml/badge.svg?branch=develop&event=schedule)](https://github.com/erpnext/erpnext_ui_tests/actions/workflows/ui-tests.yml)
[![UI Coverage](https://codecov.io/gh/erpnext/erpnext_ui_tests/branch/develop/graph/badge.svg?token=Y3X3T1Y04O)](https://codecov.io/gh/erpnext/erpnext_ui_tests)

This repository contains Integration tests for ERPNext features written in Cypress. These tests are run on GitHub Actions via cron every day.

## Local Setup

> Prerequisites: [Install and setup Frappe Framework](https://frappeframework.com/docs/v13/user/en/installation)

Follow these steps to set this up on your local machine:
1. Change directory into `frappe-bench`
   ```sh
   # replace ~/frappe-bench with the path where you have installed frappe-bench

   cd ~/frappe-bench
   ```

1. Fetch `erpnext` and `erpnext_ui_tests` (this app) on your `frappe-bench` installation
   ```sh
   bench get-app erpnext
   bench get-app erpnext_ui_tests
   ```

1. Create a new site and install these apps
   ```sh
   bench new-site erpnextui.test --install-app erpnext erpnext_ui_tests
   ```

1. Add to hosts so that the site is accessible via hostname on the browser
   ```sh
   bench --site erpnextui.test add-to-hosts
   ```

1. Complete setup wizard by running this command
   ```sh
   bench --site erpnextui.test execute erpnext.setup.utils.before_tests
   ```

1. Run the following command to open up the Cypress runner
   ```sh
   bench --site erpnextui.test run-ui-tests erpnext_ui_tests
   ```
#### License

GPL-v3.0
