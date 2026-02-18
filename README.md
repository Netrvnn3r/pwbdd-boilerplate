# Framework de Automatización QA — Playwright BDD

Framework de pruebas automatizadas construido con **Playwright** y **Playwright-BDD** (Cucumber/Gherkin), usando el patrón **Page Object Model** y TypeScript.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) versión **18 o superior**
- [npm](https://www.npmjs.com/) (viene incluido con Node.js)
- Un editor de código como [VS Code](https://code.visualstudio.com/)

Para verificar tu instalación:

```bash
node --version
npm --version
```

---

## 🚀 Instalación

### 1. Clonar o descargar el proyecto

```bash
git clone <url-del-repositorio>
cd WallmartQA
```

### 2. Instalar las dependencias del proyecto

```bash
npm install
```

### 3. Instalar los navegadores de Playwright

```bash
npx playwright install
```

Esto descargará Chromium, Firefox y WebKit automáticamente.

---

## ▶️ Cómo Ejecutar las Pruebas

### Paso 1 — Generar los archivos de prueba desde los features

Este paso es **obligatorio** cada vez que modifiques un archivo `.feature`:

```bash
npx bddgen
```

### Paso 2 — Ejecutar todas las pruebas

```bash
npx playwright test
```

### Ejecutar un feature específico

```bash
npx playwright test features/health_check.feature
npx playwright test features/checkout.feature
npx playwright test features/register.feature
npx playwright test features/search_add_to_cart.feature
```

### Ejecutar por etiquetas (tags)

```bash
# Solo pruebas de humo
npx playwright test --grep "@smoke"

# Solo pruebas de salud del sitio
npx playwright test --grep "@health"

# Solo pruebas críticas de checkout
npx playwright test --grep "@critical"

# Solo pruebas de autenticación
npx playwright test --grep "@auth"
```

### Ver el reporte de resultados

```bash
npx playwright show-report
```

---

## 📁 Estructura del Proyecto

```
WallmartQA/
│
├── features/                        # Archivos Gherkin con los escenarios de prueba
│   ├── health_check.feature         # Verificación de salud del sitio
│   ├── checkout.feature             # Flujos de pago (invitado y registrado)
│   ├── register.feature             # Registro de nuevos usuarios
│   └── search_add_to_cart.feature   # Búsqueda y agregar al carrito
│
├── steps/                           # Definiciones de pasos (step definitions)
│   ├── common.steps.ts              # Pasos compartidos entre features
│   ├── health.steps.ts              # Pasos del health check
│   ├── checkout.steps.ts            # Pasos del proceso de pago
│   ├── register.steps.ts            # Pasos del registro
│   └── search.steps.ts              # Pasos de búsqueda y carrito
│
├── pages/                           # Page Object Model (POM)
│   ├── BasePage.ts                  # Clase base con métodos comunes
│   ├── HomePage.ts                  # Página principal
│   ├── ProductPage.ts               # Página de producto
│   ├── SearchPage.ts                # Página de resultados de búsqueda
│   ├── CartPage.ts                  # Página del carrito
│   ├── CheckoutPage.ts              # Página de checkout
│   └── RegisterPage.ts              # Página de registro
│
├── .features-gen/                   # Archivos generados automáticamente por bddgen (no editar)
├── test-results/                    # Resultados de las pruebas (generado automáticamente)
├── playwright-report/               # Reporte HTML de Playwright (generado automáticamente)
├── playwright.config.ts             # Configuración principal de Playwright
├── package.json                     # Dependencias y scripts del proyecto
└── README.md                        # Este archivo
```

---

## 🧪 Cómo Crear una Nueva Prueba

Crear una nueva prueba requiere tres pasos: el **feature**, los **pasos** y (si es necesario) el **page object**.

---

### Paso 1 — Crear el archivo Feature

Crea un nuevo archivo en la carpeta `features/` con extensión `.feature`.

**Ejemplo:** `features/wishlist.feature`

```gherkin
@regression @wishlist
Feature: Lista de Deseos
  Como usuario registrado
  Quiero agregar productos a mi lista de deseos
  Para guardarlos y comprarlos más adelante

  Scenario: Agregar un producto a la lista de deseos
    Given I am on the home page
    When I click on the featured product "iPhone"
    And I add the product to my wishlist
    Then I should see the product in my wishlist
```

> **Reglas importantes:**
> - Las palabras clave de Gherkin (`Feature`, `Scenario`, `Given`, `When`, `Then`, `And`) deben estar en **inglés**.
> - El texto de los pasos debe coincidir **exactamente** con lo definido en los archivos de steps.
> - Reutiliza pasos existentes siempre que sea posible.

---

### Paso 2 — Crear las Definiciones de Pasos

Crea un archivo en `steps/` para los pasos nuevos que no existan aún.

**Ejemplo:** `steps/wishlist.steps.ts`

```typescript
import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { WishlistPage } from '../pages/WishlistPage';

const { When, Then } = createBdd();

When('I add the product to my wishlist', async ({ page }) => {
  const wishlistPage = new WishlistPage(page);
  await wishlistPage.clickAddToWishlist();
});

Then('I should see the product in my wishlist', async ({ page }) => {
  const wishlistPage = new WishlistPage(page);
  await wishlistPage.verifyProductInWishlist('iPhone');
});
```

> **Reglas importantes:**
> - Importa `createBdd` de `playwright-bdd` y los page objects que necesites.
> - El texto del paso en el archivo `.ts` debe ser **idéntico** al texto en el `.feature`.
> - Usa `{string}` para capturar parámetros dinámicos (ejemplo: `When('I search for {string}', ...)`).
> - Reutiliza pasos de `common.steps.ts` para acciones comunes como navegar a la página principal.

---

### Paso 3 — Crear el Page Object (si es necesario)

Si tu prueba interactúa con una página nueva, crea su page object en `pages/`.

**Ejemplo:** `pages/WishlistPage.ts`

```typescript
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class WishlistPage extends BasePage {
    readonly addToWishlistButton: Locator;
    readonly wishlistItems: Locator;

    constructor(page: Page) {
        super(page);
        this.addToWishlistButton = page.locator('button[data-original-title="Add to Wish List"]');
        this.wishlistItems = page.locator('#wishlist-total');
    }

    async clickAddToWishlist() {
        await this.addToWishlistButton.click();
    }

    async verifyProductInWishlist(productName: string) {
        await expect(this.wishlistItems).toContainText(productName);
    }
}
```

> **Reglas importantes:**
> - Extiende siempre de `BasePage` para heredar métodos comunes (`navigateTo`, `getTitle`, `getFooterLinks`).
> - Define todos los locators como `readonly Locator` en el constructor.
> - Cada método debe representar **una acción** o **una verificación** clara.

---

### Paso 4 — Generar y ejecutar

```bash
# Regenerar los archivos de prueba
npx bddgen

# Ejecutar solo tu nuevo feature
npx playwright test features/wishlist.feature
```

---

## 🏷️ Etiquetas Disponibles

| Etiqueta      | Descripción                                      |
|---------------|--------------------------------------------------|
| `@smoke`      | Pruebas rápidas de funcionalidad crítica         |
| `@health`     | Verificación de salud del sitio                  |
| `@critical`   | Flujos de negocio más importantes                |
| `@regression` | Suite completa de regresión                      |
| `@auth`       | Pruebas de autenticación y registro              |
| `@checkout`   | Pruebas del proceso de pago                      |
| `@cart`       | Pruebas del carrito de compras                   |
| `@wishlist`   | Pruebas de lista de deseos (ejemplo)             |

---

## ❓ Preguntas Frecuentes

**¿Por qué mis pruebas no se ejecutan después de modificar un `.feature`?**
Debes ejecutar `npx bddgen` primero para regenerar los archivos de prueba.

**¿Puedo ejecutar las pruebas con interfaz gráfica (no headless)?**
Sí: `npx playwright test --headed`

**¿Cómo depuro una prueba que falla?**
Usa el modo UI de Playwright: `npx playwright test --ui`
