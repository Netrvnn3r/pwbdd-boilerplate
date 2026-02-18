@regression @cart
Feature: Búsqueda y Agregar al Carrito
  Como cliente
  Quiero buscar productos y agregarlos a mi carrito
  Para poder comprarlos más adelante

  Scenario Outline: Buscar un producto específico y agregarlo al carrito
    Given I am on the home page
    When I search for "<Product>"
    And I select the product "<Product>" from search results
    And I set the quantity to "<Quantity>"
    And I click add to cart
    Then I should see a success message "Success: You have added <Product>"

    Examples:
      | Product | Quantity |
      | iPhone  |        2 |
      | iPhone  |        1 |
