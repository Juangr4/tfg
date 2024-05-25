describe("Product Tests", () => {
  beforeEach(() => {
    cy.task("db:seed");
    cy.login();
    cy.contains("Admin panel").click();

    cy.get('[href="/dashboard/products"]').click();
  });

  it("Should create a product", () => {
    cy.contains("New Product").click();

    cy.get('input[placeholder="Product name"]').type("Producto de prueba");

    cy.get('input[placeholder="Product description"]').type(
      "Este producto fue creado en el panel de administrador"
    );

    cy.get('input[placeholder="Product price"]').type("3.99");

    cy.contains("Select category").click();

    cy.get("body").type("{enter}");

    cy.get(".flex-col-reverse > .inline-flex").click();

    cy.wait(500).reload(true);

    cy.get(".space-x-2 > :nth-child(3)").click();

    cy.contains("Producto de prueba").should("be.visible");
  });

  it("Should not create a product", () => {
    cy.contains("New Product").click();

    cy.get(".flex-col-reverse > .inline-flex").click();

    cy.contains("Required").should("be.visible");

    cy.contains("Expected number, received nan").should("be.visible");

    cy.get('input[placeholder="Product price"]').type("-2");

    cy.get(".flex-col-reverse > .inline-flex").click();

    cy.contains("Number must be greater than 0").should("be.visible");
  });

  it("Should edit a product", () => {
    cy.get(":nth-child(1) > :nth-child(4) > div > a.inline-flex").click();

    cy.contains("Edit").trigger("click");

    cy.get('input[value="Prueba 1.1"]').clear().type("Prueba 1.1 Edited");

    cy.get('input[value="Producto de prueba 1 de la categoria 1"]')
      .clear()
      .type("Nuevo texto para el producto 1.1");

    cy.get('input[value="1.99"]').clear().type("4.99");

    cy.contains("Save").click();

    cy.contains("Prueba 1.1 Edited").should("be.visible");

    cy.contains("Nuevo texto para el producto 1.1").should("be.visible");

    cy.contains("4.99$").should("be.visible");
  });
});
