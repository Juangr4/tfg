describe("Permission Tests", () => {
  beforeEach(() => {
    cy.task("db:seed");
    cy.visit("");
    cy.contains("Login").click();
  });

  it("Should not access to the panel", () => {
    cy.get("#email").clear();
    cy.get("#email").type("prueba@gmail.com");
    cy.get("#password").clear();
    cy.get("#password").type("Prueba123");
    cy.get(".inline-flex").click();

    cy.contains("Admin panel").click();

    cy.url().should("include", "/dashboard");
    cy.contains(
      "Your don't have enought permission to access to that page."
    ).should("be.visible");
  });

  it("Should access to the panel", () => {
    cy.get("#email").clear();
    cy.get("#email").type("admin@gmail.com");
    cy.get("#password").clear();
    cy.get("#password").type("admin");
    cy.get(".inline-flex").click();

    cy.contains("Admin panel").click();
    cy.url().should("include", "/dashboard");
    cy.contains("Dashboard Homepage").should("be.visible");
  });
});
