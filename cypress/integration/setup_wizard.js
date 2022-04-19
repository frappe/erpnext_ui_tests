context('Setup Wizard', () => {
	before(() => {
		cy.login();
		cy.visit('/app/setup-wizard');
	});

	it('Verifying setup wizard with English language', () => {
		//Checking the URL/path, should be on 0 for the first screen
		cy.location("pathname").should("eq", "/app/setup-wizard/0");

		//Checking the title, labels, button labels and class in English language
		cy.get(".slide-title").should('have.text', 'Hello!');
		cy.get(".control-label").should('have.text', 'Your Language');
		cy.get(".control-label").should('have.class', 'reqd');
		cy.intercept("POST", "/api/method/frappe.desk.page.setup_wizard.setup_wizard.load_messages").as("load");
		cy.get('select').select('English');
		cy.wait("@load"); //if the required fields are not filled out to error throw karta h uska case likhana h
		cy.get('.next-btn').should('have.text', 'Next');
	});

	it('Verifying setup wizard with Spanish language', () => {
		cy.get('select:visible').select('Español');
		cy.wait("@load");

		//Checking the title, labels, button labels and class in Spanish language
		cy.get(".slide-title:visible").should('have.text', '¡Hola!');
		cy.get(".control-label").should('have.text', 'Tu Lenguaje');
		cy.get(".control-label").should('have.class', 'reqd');
		cy.get('.next-btn').should('have.text', 'Siguiente').click();
		cy.get(".slide-title:visible").should('have.text', 'Seleccione su Región');
		cy.get("[data-fieldname=country] > .form-group > .clearfix > .control-label:visible").should('have.text', 'Tu País');
		cy.get("[data-fieldname=timezone] > .form-group > .clearfix > .control-label:visible").should('have.text', 'Zona Horaria');
		cy.get("[data-fieldname=currency] > .form-group > .clearfix > .control-label:visible").should('have.text', 'Divisa / Moneda');
		cy.get('.complete-btn').should('have.text', 'Configuración completa');
		cy.get('.prev-btn').should('have.text', 'Anterior').click({force: true});
	});

	it('Verifying setup wizard with Russian language', () => {
		cy.get('select:visible').select('русский');
		cy.wait("@load");

		//Checking the title, labels, button labels and class in Russian language
		cy.get(".slide-title:visible").should('have.text', 'Здравствуйте!');
		cy.get(".control-label:visible").should('have.text', 'Ваш язык');
		cy.get(".control-label:visible").should('have.class', 'reqd');
		cy.get('.next-btn').should('have.text', 'Далее').click();
		cy.get(".slide-title:visible").should('have.text', 'Выберите регион');
		cy.get("[data-fieldname=country] > .form-group > .clearfix > .control-label:visible").should('have.text', 'Ваша страна');
		cy.get("[data-fieldname=timezone] > .form-group > .clearfix > .control-label:visible").should('have.text', 'Часовой пояс');
		cy.get("[data-fieldname=currency] > .form-group > .clearfix > .control-label:visible").should('have.text', 'Валюта');
		cy.get('.complete-btn').should('have.text', 'Завершение установки');
		cy.get('.prev-btn').should('have.text', 'Предыдущая').click({force: true});
	});

	it('Verifying setup wizard with German language', () => {
		cy.get('select:visible').select('Deutsch');
		cy.wait("@load");

		//Checking the title, labels, button labels and class in German language
		cy.get(".slide-title:visible").should('have.text', 'Hallo!');
		cy.get(".control-label:visible").should('have.text', 'Ihre Sprache');
		cy.get(".control-label:visible").should('have.class', 'reqd');
		cy.get('.next-btn').should('have.text','Weiter').click();
		cy.get(".slide-title:visible").should('have.text', 'Wählen Sie Ihre Region');
		cy.get("[data-fieldname=country] > .form-group > .clearfix > .control-label:visible").should('have.text', 'Ihr Land');
		cy.get("[data-fieldname=timezone] > .form-group > .clearfix > .control-label:visible").should('have.text', 'Zeitzone');
		cy.get("[data-fieldname=currency] > .form-group > .clearfix > .control-label:visible").should('have.text', 'Währung');
		cy.get('.complete-btn').should('have.text', 'Einrichtung abschliessen');
		cy.get('.prev-btn').should('have.text', 'Vorhergehende').click({force: true});
	});

	it('Verifying setup wizard by putting the required values and completing the setup', () => {
		cy.get('select:visible').select('English');
		cy.wait("@load");
		cy.findByRole('button', {name: 'Next'}).click();
		cy.location("pathname").should("eq", "/app/setup-wizard/1");
		cy.get(".slide-title:visible").should('have.text', 'Select Your Region');
		cy.get("[data-fieldname=country] > .form-group > .clearfix > .control-label:visible").should('have.text', 'Your Country');
		cy.get("[data-fieldname=timezone] > .form-group > .clearfix > .control-label:visible").should('have.text', 'Time Zone');
		cy.get("[data-fieldname=currency] > .form-group > .clearfix > .control-label:visible").should('have.text', 'Currency');
		cy.get_field('country', 'Autocomplete').should('have.attr', 'placeholder', 'Select Country');
		cy.get_field('timezone', 'Select').should('have.attr', 'placeholder', 'Select Time Zone');
		cy.get_field('currency', 'Select').should('have.attr', 'placeholder', 'Select Currency');

		//Inputing values in the second screen for completing the setup
		cy.fill_field('country', 'Afghanistan', 'Autocomplete');
		cy.get(".slides-wrapper").click();
		cy.get_field('timezone', 'Select').should('contain', 'Afghanistan Time - Asia/Kabul');
		cy.get_field('currency', 'Select').should('contain', 'Afghan Afghani');
		cy.get('.prev-btn').should('have.text', 'Previous');
		cy.get('.complete-btn').should('have.text', 'Complete Setup');

		//Checking if the Next and Previous buttons functions correctly and also if the URL is correct
		cy.location("pathname").should("eq", "/app/setup-wizard/1");
		cy.findByRole('button', {name: 'Previous'}).click();
		cy.location("pathname").should("eq", "/app/setup-wizard/0");
		cy.findByRole('button', {name: 'Next'}).click();
		cy.location("pathname").should("eq", "/app/setup-wizard/1");
		cy.findByRole('button', {name: 'Complete Setup'}).click();
		cy.location("pathname").should("eq", "/app/setup-wizard");
		cy.location("pathname").should("eq", "/app");
	});
});