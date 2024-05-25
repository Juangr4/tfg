describe("Category Tests", () => {
  beforeEach(() => {
    cy.task("db:seed");
    cy.login();
    cy.contains("Admin panel").click();

    cy.get('[href="/dashboard/categories"]').click();
  });

  it("Should create a category", () => {
    cy.contains("New Category").click();

    cy.get('input[placeholder="Category name"]').type("Prueba 4");

    cy.get(".flex-col-reverse > .inline-flex").click();

    cy.contains("Prueba 4").should("be.visible");
  });

  it("Should not create a category", () => {
    cy.contains("New Category").click();

    cy.get(".flex-col-reverse > .inline-flex").click();

    cy.contains("String must contain at least 1 character").should(
      "be.visible"
    );
  });

  it("Should edit a category", () => {
    cy.get(":nth-child(1) > :nth-child(2) > div > a.inline-flex").click();

    cy.contains("Edit").trigger("click");

    cy.get('input[value="Prueba 1"]').clear().type("Prueba 1 Edited");

    cy.contains("Save").click();

    cy.contains("Prueba 1 Edited").should("be.visible");
  });
});
