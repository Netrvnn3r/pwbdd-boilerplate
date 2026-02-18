# Enfoque Técnico de Automatización — Playwright BDD Framework

---

## 🇪🇸 ESPAÑOL

---

### 1. ¿Por qué este enfoque de automatización?

Este framework combina **Playwright**, **Playwright-BDD** y el patrón **Page Object Model (POM)** con el objetivo de construir una suite de pruebas automatizadas que sea:

- **Legible** por personas no técnicas (analistas, product owners, clientes)
- **Mantenible** a largo plazo por el equipo de QA y desarrollo
- **Escalable** para crecer junto con el producto
- **Confiable** en entornos de integración continua (CI/CD)

La filosofía central es que las pruebas deben describir el **comportamiento del sistema desde la perspectiva del usuario**, no los detalles técnicos de implementación.

---

### 2. ¿Por qué elegimos estas pruebas?

Los escenarios implementados cubren los **flujos críticos de negocio** de una tienda en línea -- en este caso la website de abstracta:

| Feature | Justificación |
|---|---|
| **Health Check** | Verifica que el sitio esté operativo antes de ejecutar pruebas más complejas. Es la primera línea de defensa. |
| **Registro de Usuario** | El registro es la puerta de entrada a todas las funcionalidades de miembro. Si falla, el resto del sistema es inaccesible. |
| **Proceso de Pago** | El checkout es el flujo de mayor valor de negocio. Un error aquí impacta directamente en los ingresos. |
| **Búsqueda y Carrito** | La búsqueda y el carrito son los pasos previos al pago. Son usados por el 100% de los usuarios que compran. |

Esta selección sigue la **pirámide de pruebas**: se priorizan los flujos end-to-end de mayor impacto, dejando las pruebas unitarias y de componentes para las capas inferiores del stack.

---

### 3. ¿Por qué usar Scenario Outlines?

Los **Scenario Outlines** (Escenarios Parametrizados) permiten ejecutar el mismo flujo con múltiples conjuntos de datos sin duplicar código.

**Sin Scenario Outline:**
```gherkin
Scenario: Registro con usuario Juan
  Given I am on the home page
  When I fill in the registration details with "Juan", "Helldiver", "juan@test.com" ...
  Then I should see a success message

Scenario: Registro con usuario María
  Given I am on the home page
  When I fill in the registration details with "María", "Warhammer", "maria@test.com" ...
  Then I should see a success message
```

**Con Scenario Outline:**
```gherkin
Scenario Outline: Registro exitoso de nuevo usuario
  Given I am on the home page
  When I fill in the registration details with "<FirstName>", "<LastName>", "<Email>" ...
  Then I should see a success message

  Examples:
    | FirstName | LastName | Email           |
    | Juan      | Helldiver    | juan@test.com   |
    | María     | Warhammer    | maria@test.com  |
```

**Ventajas concretas:**
- **Reducción de duplicación:** Un solo escenario cubre N casos de prueba
- **Cobertura de datos:** Permite probar valores límite, datos válidos e inválidos en la misma estructura
- **Mantenimiento centralizado:** Si cambia el flujo, se modifica un solo lugar
- **Legibilidad:** Los datos están separados de la lógica, facilitando la revisión por parte de stakeholders
- **Escalabilidad:** Agregar un nuevo caso de prueba es tan simple como añadir una fila a la tabla de Examples

---

### 4. ¿Por qué usar Page Object Model con BDD/Gherkin?

El **Page Object Model** es un patrón de diseño que encapsula los locators y las acciones de cada página en una clase dedicada. Combinado con BDD, crea una separación clara en tres capas:

```
Feature (Gherkin)          →  QUÉ se prueba (lenguaje de negocio)
Step Definitions (TypeScript) →  CÓMO se ejecuta (lógica de orquestación)
Page Objects (TypeScript)  →  DÓNDE están los elementos (detalles técnicos)
```

**¿Por qué es buena práctica?**

**Separación de responsabilidades:**
Los archivos `.feature` describen el comportamiento esperado. Los page objects manejan los selectores CSS/XPath. Si la UI cambia (por ejemplo, el ID de un botón), solo se actualiza el page object — ningún archivo `.feature` ni step definition necesita cambiar.

**Reutilización:**
Un mismo page object puede ser usado por múltiples step definitions y features. Por ejemplo, `HomePage.ts` es utilizado por el health check, el registro, la búsqueda y el checkout.

**Facilidad de mantenimiento:**
Cuando el equipo de desarrollo cambia la interfaz, el equipo de QA solo necesita actualizar los locators en un lugar, no buscar y reemplazar en decenas de archivos de prueba.

**Legibilidad del código:**
```typescript
// Sin POM — difícil de entender y mantener
await page.locator('#input-payment-firstname').fill('Juan');
await page.locator('#button-guest').click();

// Con POM — claro y expresivo
await checkoutPage.fillBillingDetails(userData);
await checkoutPage.selectGuestCheckout();
```

**Colaboración entre equipos:**
Los archivos `.feature` pueden ser escritos o revisados por analistas de negocio, product owners o testers manuales sin conocimiento de código. Los page objects y steps son responsabilidad del equipo técnico de QA.

---

### 5. ¿Cómo extender este framework a largo plazo?

Este framework está diseñado para crecer de forma ordenada. A continuación se describen las extensiones más comunes:

#### 5.1 Agregar nuevas páginas y flujos
Cada nueva funcionalidad del producto se traduce en:
1. Un nuevo archivo `.feature` en `/features`
2. Un nuevo page object en `/pages`
3. Nuevas step definitions en `/steps` (reutilizando las existentes cuando sea posible)

#### 5.2 Integración con CI/CD
El framework ya está preparado para ejecutarse en pipelines de integración continua. Se puede integrar con:
- **GitHub Actions** — ejecutar pruebas en cada Pull Request
- **GitLab CI** — ejecutar pruebas en cada merge a main
- **Jenkins** — ejecutar pruebas programadas o por evento

Ejemplo de comando para CI:
```bash
npx bddgen && npx playwright test --reporter=html
```

#### 5.3 Pruebas de API
Playwright incluye soporte nativo para pruebas de API HTTP. Se puede agregar una carpeta `/api` con clientes de API y combinar pruebas de UI con validaciones de API en el mismo framework.

#### 5.4 Datos de prueba externos
Para escenarios más complejos, los datos de los `Examples` pueden ser generados dinámicamente desde:
- Archivos JSON o CSV
- Bases de datos de prueba
- Factories de datos (como `faker.js`)

#### 5.5 Ambientes múltiples
Agregar un archivo de configuración por ambiente (`config/staging.ts`, `config/production.ts`) permite ejecutar la misma suite contra diferentes entornos sin modificar el código de prueba.

#### 5.6 Reportes avanzados
Integrar reportes como **Allure Report** o **Cucumber HTML Reporter** para obtener dashboards visuales con historial de ejecuciones, tendencias de fallos y cobertura de escenarios.

#### 5.7 Pruebas de accesibilidad
Playwright permite integrar **axe-core** para ejecutar auditorías de accesibilidad (WCAG) como parte de los escenarios existentes, sin necesidad de un framework separado.

---

---

## 🇺🇸 ENGLISH

---

### 1. Why this automation approach?

This framework combines **Playwright**, **Playwright-BDD**, and the **Page Object Model (POM)** pattern with the goal of building an automated test suite that is:

- **Readable** by non-technical stakeholders (analysts, product owners, clients)
- **Maintainable** long-term by QA and development teams
- **Scalable** to grow alongside the product
- **Reliable** in continuous integration environments (CI/CD)

The core philosophy is that tests should describe the **behavior of the system from the user's perspective**, not the technical implementation details.

---

### 2. Why did we choose these tests?

The implemented scenarios cover the **critical business flows** of an e-commerce store:

| Feature | Justification |
|---|---|
| **Health Check** | Verifies the site is operational before running more complex tests. It is the first line of defense. |
| **User Registration** | Registration is the gateway to all member features. If it fails, the rest of the system is inaccessible. |
| **Checkout Process** | Checkout is the highest business-value flow. An error here directly impacts revenue. |
| **Search & Cart** | Search and cart are the steps before payment. They are used by 100% of purchasing users. |

This selection follows the **test pyramid**: end-to-end flows with the highest impact are prioritized, leaving unit and component tests to the lower layers of the stack.

---

### 3. Why use Scenario Outlines?

**Scenario Outlines** allow the same flow to be executed with multiple data sets without duplicating code.

**Without Scenario Outline:**
```gherkin
Scenario: Registration with user John
  Given I am on the home page
  When I fill in the registration details with "John", "Helldiver", "john@test.com" ...
  Then I should see a success message

Scenario: Registration with user Jane
  Given I am on the home page
  When I fill in the registration details with "Jane", "WarHammer", "jane@test.com" ...
  Then I should see a success message
```

**With Scenario Outline:**
```gherkin
Scenario Outline: Successful new user registration
  Given I am on the home page
  When I fill in the registration details with "<FirstName>", "<LastName>", "<Email>" ...
  Then I should see a success message

  Examples:
    | FirstName | LastName | Email           |
    | John      | Helldiver      | john@test.com   |
    | Jane      | WarHammer    | jane@test.com   |
```

**Concrete advantages:**
- **Reduced duplication:** A single scenario covers N test cases
- **Data coverage:** Allows testing boundary values, valid and invalid data within the same structure
- **Centralized maintenance:** If the flow changes, only one place needs to be modified
- **Readability:** Data is separated from logic, making it easier for stakeholders to review
- **Scalability:** Adding a new test case is as simple as adding a row to the Examples table

---

### 4. Why use Page Object Model with BDD/Gherkin?

The **Page Object Model** is a design pattern that encapsulates the locators and actions of each page in a dedicated class. Combined with BDD, it creates a clear three-layer separation:

```
Feature (Gherkin)             →  WHAT is tested (business language)
Step Definitions (TypeScript) →  HOW it is executed (orchestration logic)
Page Objects (TypeScript)     →  WHERE elements are (technical details)
```

**Why is this good practice?**

**Separation of concerns:**
`.feature` files describe expected behavior. Page objects handle CSS/XPath selectors. If the UI changes (e.g., a button ID changes), only the page object is updated — no `.feature` files or step definitions need to change.

**Reusability:**
The same page object can be used by multiple step definitions and features. For example, `HomePage.ts` is used by the health check, registration, search, and checkout features.

**Ease of maintenance:**
When the development team changes the interface, the QA team only needs to update locators in one place, not search and replace across dozens of test files.

**Code readability:**
```typescript
// Without POM — hard to understand and maintain
await page.locator('#input-payment-firstname').fill('John');
await page.locator('#button-guest').click();

// With POM — clear and expressive
await checkoutPage.fillBillingDetails(userData);
await checkoutPage.selectGuestCheckout();
```

**Cross-team collaboration:**
`.feature` files can be written or reviewed by business analysts, product owners, or manual testers without coding knowledge. Page objects and step definitions are the responsibility of the technical QA team.

---

### 5. How to extend this framework long-term?

This framework is designed to grow in an organized way. Below are the most common extensions:

#### 5.1 Adding new pages and flows
Each new product feature translates into:
1. A new `.feature` file in `/features`
2. A new page object in `/pages`
3. New step definitions in `/steps` (reusing existing ones whenever possible)

#### 5.2 CI/CD integration
The framework is already prepared to run in continuous integration pipelines. It can be integrated with:
- **GitHub Actions** — run tests on every Pull Request
- **GitLab CI** — run tests on every merge to main
- **Jenkins** — run tests on a schedule or triggered by events

Example CI command:
```bash
npx bddgen && npx playwright test --reporter=html
```

#### 5.3 API testing
Playwright includes native support for HTTP API testing. An `/api` folder can be added with API clients, combining UI tests with API validations in the same framework.

#### 5.4 External test data
For more complex scenarios, `Examples` data can be generated dynamically from:
- JSON or CSV files
- Test databases
- Data factories (such as `faker.js`)

#### 5.5 Multiple environments
Adding a configuration file per environment (`config/staging.ts`, `config/production.ts`) allows running the same suite against different environments without modifying test code.

#### 5.6 Advanced reporting
Integrating reports like **Allure Report** or **Cucumber HTML Reporter** to get visual dashboards with execution history, failure trends, and scenario coverage.

#### 5.7 Accessibility testing
Playwright allows integrating **axe-core** to run accessibility audits (WCAG) as part of existing scenarios, without needing a separate framework.
