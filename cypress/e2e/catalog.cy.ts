describe("Catalog Tests", () => {
  beforeEach(() => {
    cy.task("db:seed");
    cy.visit("");
    cy.contains("Products").click();
  });

  const getCategories = () => cy.contains("Categories").parent().children();

  it("Products default view Test", () => {
    getCategories().should("have.length", 4);

    cy.get(".grid-cols-1").children().should("have.length", 5);

    // Check that all products are correct
    cy.contains("Prueba 1.1").should("exist");
    cy.contains("Prueba 1.1").parent().contains("1.99");
    cy.contains("Prueba 1.2").should("not.exist");
    cy.contains("Prueba 1.3").should("exist");
    cy.contains("Prueba 1.3").parent().contains("3.99");
    cy.contains("Prueba 2.1").should("exist");
    cy.contains("Prueba 2.1").parent().contains("29");
    cy.contains("Prueba 2.2").should("exist");
    cy.contains("Prueba 2.2").parent().contains("39.98");
    cy.contains("Prueba 3.1").should("exist");
    cy.contains("Prueba 3.1").parent().contains("99.99");
  });

  it("Products filter Test", () => {
    // ONLY CATEGORY 1
    getCategories().contains("Prueba 1").click();

    cy.get(".grid-cols-1").children().should("have.length", 2);

    // Check that all products are correct
    cy.contains("Prueba 1.1").should("exist");
    cy.contains("Prueba 1.2").should("not.exist");
    cy.contains("Prueba 1.3").should("exist");
    cy.contains("Prueba 2.1").should("not.exist");
    cy.contains("Prueba 2.2").should("not.exist");
    cy.contains("Prueba 3.1").should("not.exist");

    // CATEGORIES 1 and 2
    getCategories().contains("Prueba 2").click();

    cy.get(".grid-cols-1").children().should("have.length", 4);

    // Check that all products are correct
    cy.contains("Prueba 1.1").should("exist");
    cy.contains("Prueba 1.2").should("not.exist");
    cy.contains("Prueba 1.3").should("exist");
    cy.contains("Prueba 2.1").should("exist");
    cy.contains("Prueba 2.2").should("exist");
    cy.contains("Prueba 3.1").should("not.exist");

    // ONLY CATEGORY 2
    getCategories().contains("Prueba 1").click();

    cy.get(".grid-cols-1").children().should("have.length", 2);

    // Check that all products are correct
    cy.contains("Prueba 1.1").should("not.exist");
    cy.contains("Prueba 1.2").should("not.exist");
    cy.contains("Prueba 1.3").should("not.exist");
    cy.contains("Prueba 2.1").should("exist");
    cy.contains("Prueba 2.2").should("exist");
    cy.contains("Prueba 3.1").should("not.exist");

    // PRODUCT SEARCH -> Prueba 1 & CATEGORY 2 ACTIVE
    cy.get(".md\\:w-\\[50\\%\\] > .flex").clear();
    cy.get(".md\\:w-\\[50\\%\\] > .flex").type("Prueba 1");

    cy.get(".grid-cols-1").children().should("have.length", 0);

    cy.contains("Prueba 1.1").should("not.exist");
    cy.contains("Prueba 1.2").should("not.exist");
    cy.contains("Prueba 1.3").should("not.exist");
    cy.contains("Prueba 2.1").should("not.exist");
    cy.contains("Prueba 2.2").should("not.exist");
    cy.contains("Prueba 3.1").should("not.exist");

    // PRODUCT SEARCH -> Prueba 1 & ALL CATEGORIES DISABLED
    getCategories().contains("Prueba 2").click();

    cy.get(".grid-cols-1").children().should("have.length", 2);

    cy.contains("Prueba 1.1").should("exist");
    cy.contains("Prueba 1.2").should("not.exist");
    cy.contains("Prueba 1.3").should("exist");
    cy.contains("Prueba 2.1").should("not.exist");
    cy.contains("Prueba 2.2").should("not.exist");
    cy.contains("Prueba 3.1").should("not.exist");

    // PRODUCTS WITH PRICE GREATER THAN 50$ & SEARCH BAR -> Prueba 1
    cy.get("#price > .relative > .absolute").click();

    cy.get(".grid-cols-1").children().should("have.length", 0);

    cy.contains("Prueba 1.1").should("not.exist");
    cy.contains("Prueba 1.2").should("not.exist");
    cy.contains("Prueba 1.3").should("not.exist");
    cy.contains("Prueba 2.1").should("not.exist");
    cy.contains("Prueba 2.2").should("not.exist");
    cy.contains("Prueba 3.1").should("not.exist");

    // PRODUCTS WITH PRICE GREATER THAN 50$
    cy.get(".md\\:w-\\[50\\%\\] > .flex").clear();

    cy.get(".grid-cols-1").children().should("have.length", 1);

    cy.contains("Prueba 1.1").should("not.exist");
    cy.contains("Prueba 1.2").should("not.exist");
    cy.contains("Prueba 1.3").should("not.exist");
    cy.contains("Prueba 2.1").should("not.exist");
    cy.contains("Prueba 2.2").should("not.exist");
    cy.contains("Prueba 3.1").should("exist");
  });
});
