@smoke @health
Feature: Verificación de Salud del Sitio
  Como ingeniero de QA
  Quiero asegurarme de que los componentes principales del sitio web funcionen correctamente
  Para que los usuarios tengan una experiencia estable

  Scenario Outline: Verificación de Elementos Críticos
    Given I am on the home page
    Then the "<Element>" should be visible

    Examples:
      | Element          |
      | Search Bar       |
      | My Account       |
      | Shopping Cart    |
      | Navigation Menu  |
      | Hero Carousel    |
      | Featured Section |
      | Footer           |

  Scenario Outline: Verificación de Ítems del Menú de Navegación
    Given I am on the home page
    Then the navigation menu should contain "<Category>"

    Examples:
      | Category            |
      | Desktops            |
      | Laptops & Notebooks |
      | Components          |
      | Tablets             |
      | Software            |
      | Phones & PDAs       |
      | Cameras             |
      | MP3 Players         |

  Scenario: Validación de Productos Destacados en la Página Principal
    Given I am on the home page
    Then all featured products should display a name and price
    And each featured product should navigate to a valid product page with availability info

  Scenario: Validación de Hipervínculos del Pie de Página
    Given I am on the home page
    When I retrieve all footer hyperlinks
    Then all footer links should be valid and return a 200 OK status
