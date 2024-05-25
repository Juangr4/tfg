describe("Catalog Tests", () => {
  beforeEach(() => {
    cy.task("db:seed");

    cy.login();

    cy.visit("");
    cy.contains("Products").click();
    cy.contains("Prueba 1.1").click();
  });

  const getContentDiv = () => cy.contains("Prueba 1.1").parent();

  it("Product Main Details Test", () => {
    getContentDiv().contains("Prueba 1.1").should("be.visible");
    getContentDiv().contains("1.99").should("be.visible");
    getContentDiv()
      .contains("Producto de prueba 1 de la categoria 1")
      .should("be.visible");
    getContentDiv().contains("Category: Prueba 1").should("be.visible");
  });
});
