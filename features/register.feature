@regression @auth
Feature: Registro de Usuario
  Como nuevo usuario
  Quiero registrar una cuenta
  Para poder acceder a las funcionalidades de miembro

  Scenario Outline: Registro exitoso de nuevo usuario
    Given I am on the home page
    When I navigate to the Register page
    And I fill in the registration details with "<FirstName>", "<LastName>", "<Email>", "<Telephone>", "<Password>", "<Subscribe>"
    And I agree to the Privacy Policy
    And I submit the registration form
    Then I should see a success message indicating account creation

    Examples:
      | FirstName | LastName  | Email                   | Telephone  | Password      | Subscribe |
      | John      | HellDiver | random_email_1@test.com | 1234567890 | Password123!  | yes       |
      | Jane      | WarHammer | random_email_2@test.com | 0987654321 | SecurePass456 | no        |
