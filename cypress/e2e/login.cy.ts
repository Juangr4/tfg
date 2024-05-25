describe("Login Tests", () => {
  beforeEach(() => {
    cy.task("db:seed");
    cy.visit("");
    cy.contains("Login").click();
  });

  it("Invalid username and password", () => {
    cy.get("#email").clear();
    cy.get("#email").type("pruebamala@gmail.com");
    cy.get("#password").clear();
    cy.get("#password").type("pruebamala");
    cy.get(".inline-flex").click();

    cy.url().should("contain", "error=CredentialsSignin");
  });

  it("Invalid password", () => {
    cy.get("#email").clear();
    cy.get("#email").type("prueba@gmail.com");
    cy.get("#password").clear();
    cy.get("#password").type("PruebaMala");
    cy.get(".inline-flex").click();

    cy.url().should("contain", "error=CredentialsSignin");
  });

  it("Successful Username and password", () => {
    cy.get("#email").clear();
    cy.get("#email").type("prueba@gmail.com");
    cy.get("#password").clear();
    cy.get("#password").type("Prueba123");
    cy.get(".inline-flex").click();

    cy.url().should("equal", Cypress.config("baseUrl") + "/");

    cy.contains("prueba").should("exist").click();
    cy.contains("My Account").should("exist");

    cy.contains("Logout").click();

    cy.contains("Login").should("exist");
    cy.contains("prueba").should("not.exist");
  });
});
