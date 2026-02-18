@smoke @checkout @critical
Feature: Proceso de Pago
  Como usuario del sitio
  Quiero completar el proceso de pago
  Para poder comprar mis artículos

  Scenario Outline: Flujo de Pago como Invitado
    Given I have added a "<Product>" to my cart
    And I proceed to checkout from the cart page
    When I select Guest Checkout
    And I fill in the billing details with "<FirstName>", "<LastName>", "<Email>", "<Telephone>", "<Address>", "<City>", "<PostCode>", "<Country>", "<Region>"
    And I proceed through delivery details
    And I accept the terms and conditions
    And I verify the order details with "<SubTotal>", "<FlatShippingRate>", "<Total>"
    And I confirm the order
    Then I should see the order confirmation page

    Examples:
      | Product | FirstName | LastName | Email              | Telephone  | Address     | City   | PostCode | Country        | Region   | SubTotal | FlatShippingRate | Total   |
      | iPhone  | Jane      | Doe      | janedoe@test.com   | 1234567890 | 123 Test St | London | AB1 2CD  | United Kingdom | Aberdeen | $101.00  | $5.00            | $131.20 |
      | iPhone  | John      | Smith    | johnsmith@test.com | 0987654321 | 456 Fake Rd | London | AB1 2CD  | United Kingdom | Aberdeen | $101.00  | $5.00            | $131.20 |

  Scenario Outline: Flujo de Pago como Usuario Registrado
    Given I register a new account
    And I have added a "<Product>" to my cart
    And I proceed to checkout from the cart page
    When I fill in the billing details with "<FirstName>", "<LastName>", "<Email>", "<Telephone>", "<Address>", "<City>", "<PostCode>", "<Country>", "<Region>"
    And I proceed through delivery details
    And I accept the terms and conditions
    And I verify the order details with "<SubTotal>", "<FlatShippingRate>", "<Total>"
    And I confirm the order
    Then I should see the order confirmation page

    Examples:
      | Product | FirstName | LastName | Email | Telephone | Address     | City   | PostCode | Country        | Region   | SubTotal | FlatShippingRate | Total   |
      | iPhone  | Test      | User     | N/A   | N/A       | 123 Test St | London | AB1 2CD  | United Kingdom | Aberdeen | $101.00  | $5.00            | $131.20 |

  Scenario Outline: Validar mensaje cuando un artículo está agotado y no puede procesarse
    Given I am on the home page
    When I search for "<Product>"
    And I select the product "<Product>" from the results
    Then I should see the product availability as "<Availability>"
    When I add the product to the cart
    And I navigate to the cart page
    Then I should see the error message "<ErrorMessage>"
    And I should see the product "<Product>" marked with "***"
    And I verify the cart total is "<Total>"

    Examples:
      | Product | Availability | ErrorMessage                                                                        | Total   |
      | MacBook | Out Of Stock | Products marked with *** are not available in the desired quantity or not in stock! | $602.00 |
