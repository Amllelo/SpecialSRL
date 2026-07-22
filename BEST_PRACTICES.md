# 📚 Guía de Mejores Prácticas - Special Dog-Special Cat Landing Page

## 🎯 Índice de Contenidos
1. [HTML Best Practices](#html-best-practices)
2. [CSS Best Practices](#css-best-practices)
3. [JavaScript Best Practices](#javascript-best-practices)
4. [Performance Optimization](#performance-optimization)
5. [SEO Guidelines](#seo-guidelines)
6. [Seguridad](#seguridad)
7. [Accesibilidad](#accesibilidad)
8. [Mobile First](#mobile-first)

---

## HTML Best Practices

### ✅ DO's

```html
<!-- Usar semántica HTML5 -->
<header>
  <nav>
    <ul>
      <li><a href="#productos">Productos</a></li>
    </ul>
  </nav>
</header>

<main>
  <section>
    <h1>Título principal</h1>
  </section>
</main>

<footer>
  <p>&copy; 2024</p>
</footer>

<!-- Meta tags completos -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Descripción clara">
<meta name="keywords" content="palabra1, palabra2">
<meta name="author" content="Special Dog-Special Cat">

<!-- Open Graph para redes sociales -->
<meta property="og:title" content="Special Dog-Special Cat">
<meta property="og:description" content="Descripción">
<meta property="og:image" content="imagen.png">
<meta property="og:type" content="website">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Special Dog-Special Cat">
```

### ❌ DONT's

```html
<!-- No usar divs para todo -->
<div id="header">
  <div id="nav">
    <div>Menú</div>
  </div>
</div>

<!-- No olvidar alt en imágenes -->
<img src="perro.jpg"> ❌
<img src="perro.jpg" alt="Perro adulto comiendo"> ✓

<!-- No usar atributos deprecated -->
<font color="red">Texto</font> ❌
<span style="color: red;">Texto</span> ✓
```

---

## CSS Best Practices

### ✅ Organización de CSS

```css
/* 1. VARIABLES Y RESET */
:root {
  --primary: #8B5A3C;
  --accent: #D97757;
}

/* 2. ESTILOS GENERALES */
* { box-sizing: border-box; }
body { font-family: sans-serif; }

/* 3. COMPONENTES */
.button { ... }
.card { ... }

/* 4. MEDIA QUERIES AL FINAL */
@media (max-width: 768px) { ... }
```

### ✅ DO's

```css
/* Usar variables CSS */
.button {
  background-color: var(--primary);
  transition: all 0.3s ease;
}

/* Usar clases en lugar de IDs */
.feature-card { ... }

/* Minificar en producción */
/* Usar preprocesadores (SASS, LESS) para proyectos grandes */

/* Utilizar flexbox y grid */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
```

### ❌ DONT's

```css
/* No usar !important */
.button { background: red !important; } ❌

/* No usar selectores muy específicos */
body div.container section.main article.post p.text { } ❌

/* No utilizar estilos inline */
<div style="color: red;">Texto</div> ❌
```

---

## JavaScript Best Practices

### ✅ Estructura

```javascript
// 1. CONSTANTES Y CONFIGURACIÓN
const CACHE_NAME = 'special-dog-cat-v1';
const API_URL = 'https://api.example.com';

// 2. FUNCIONES AUXILIARES
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// 3. GESTIÓN DE EVENTOS
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

// 4. MÓDULOS Y CLASES
class ProductManager {
  constructor() {
    this.products = [];
  }
  
  loadProducts() {
    // Código aquí
  }
}

// 5. EXPORTAR SI USAS MÓDULOS
export { ProductManager };
```

### ✅ DO's

```javascript
// Usar const y let en lugar de var
const name = 'Special Dog-Special Cat';
let counter = 0;

// Arrow functions modernas
const multiply = (a, b) => a * b;

// Template literals
const message = `Hola ${name}`;

// Async/Await para operaciones asincrónicas
async function fetchData() {
  try {
    const response = await fetch('/api/products');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Destructuring
const { name, price } = product;
const [first, second] = array;

// Spread operator
const newArray = [...oldArray, newElement];
const merged = { ...obj1, ...obj2 };

// Usar try/catch
try {
  riskyFunction();
} catch (error) {
  handleError(error);
}
```

### ❌ DONT's

```javascript
// No usar var
var oldVariable = 'viejo'; ❌

// No usar callback hell
function doSomething(callback) {
  setTimeout(() => {
    doSomethingElse(() => {
      doYetAnother(() => {
        // Demasiado anidado
      });
    });
  }, 1000);
}

// No modificar el DOM innecesariamente
for (let i = 0; i < 1000; i++) {
  document.body.innerHTML += '<div>Item</div>'; ❌
}

// No usar eval
eval('console.log("malo")'); ❌
```

---

## Performance Optimization

### 🚀 Velocidad de Carga

```javascript
// 1. LAZY LOADING DE IMÁGENES
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});
images.forEach(img => imageObserver.observe(img));

// 2. DEBOUNCE PARA EVENTOS FRECUENTES
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const handleResize = debounce(() => {
  console.log('Resize event');
}, 300);

window.addEventListener('resize', handleResize);

// 3. THROTTLE PARA SCROLL
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 4. CACHING DE DATOS
const cache = new Map();
async function getCachedData(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }
  
  const data = await fetch(url).then(r => r.json());
  cache.set(url, data);
  return data;
}
```

### 📦 Minificación

```bash
# CSS Minification
npx uglifycss styles.css > styles.min.css

# JavaScript Minification
npx uglify-js script.js > script.min.js

# HTML Minification
npx html-minifier index.html > index.min.html
```

---

## SEO Guidelines

### 🔍 Optimización de Búsqueda

```html
<!-- 1. Meta Tags Esenciales -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Una descripción clara y concisa (120-160 caracteres)">
<meta name="keywords" content="palabras clave relevantes">

<!-- 2. Estructura Heading Jerárquica -->
<h1>Único H1 por página - Tema principal</h1>
<h2>Subtemas</h2>
<h3>Detalles adicionales</h3>

<!-- 3. URLs Amigables -->
/productos/alimento-premium-perros ✓
/producto?id=123 ❌

<!-- 4. Alt Text en Imágenes -->
<img src="perro.jpg" alt="Perro adulto de raza labrador comiendo alimento premium">

<!-- 5. Schema.org Markup -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Special Dog-Special Cat",
  "url": "https://specialdogcat.com",
  "logo": "https://specialdogcat.com/logo.png"
}
</script>

<!-- 6. Canonical Tag -->
<link rel="canonical" href="https://specialdogcat.com/">

<!-- 7. Mobile Meta Tags -->
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
```

---

## Seguridad

### 🔒 Prácticas Seguras

```javascript
// 1. VALIDACIÓN DE ENTRADA
function validateInput(input) {
  // Sanitizar HTML
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// 2. PREVENIR XSS
// ❌ Malo
element.innerHTML = userInput;

// ✅ Bueno
element.textContent = userInput;

// 3. USAR HTTPS
// Siempre usa HTTPS en producción

// 4. HEADERS DE SEGURIDAD
// Content-Security-Policy: default-src 'self'
// X-Frame-Options: SAMEORIGIN
// X-Content-Type-Options: nosniff

// 5. NO EXPONER DATOS SENSIBLES
const API_KEY = process.env.REACT_APP_API_KEY; // No en el código
```

---

## Accesibilidad

### ♿ WCAG Compliance

```html
<!-- 1. ATRIBUTOS ARIA -->
<button aria-label="Cerrar menú" aria-expanded="false">✕</button>

<!-- 2. NAVEGACIÓN CON TECLADO -->
<a href="#main-content">Ir al contenido principal</a>

<!-- 3. CONTRASTE DE COLORES -->
<!-- Mínimo 4.5:1 para texto normal, 3:1 para texto grande -->

<!-- 4. FORMULARIOS ACCESIBLES -->
<label for="email">Correo Electrónico:</label>
<input type="email" id="email" name="email" required>

<!-- 5. IMÁGENES DESCRIPTIVAS -->
<img src="producto.jpg" alt="Alimento premium para perros adultos en bolsa de 5kg">

<!-- 6. VIDEO CON SUBTÍTULOS -->
<video>
  <source src="video.mp4" type="video/mp4">
  <track kind="captions" src="captions.vtt" srclang="es" label="Español">
</video>

<!-- 7. ESTRUCTURA SEMÁNTICA -->
<header>Encabezado</header>
<main>Contenido principal</main>
<aside>Contenido secundario</aside>
<footer>Pie de página</footer>
```

---

## Mobile First

### 📱 Diseño Responsivo

```css
/* Empezar con móvil (base) */
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.card {
  margin-bottom: 1rem;
  padding: 1rem;
}

/* Tablet y arriba */
@media (min-width: 768px) {
  .container {
    flex-direction: row;
    gap: 2rem;
  }
  
  .card {
    flex: 1;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Touch-Friendly

```css
/* Áreas de toque mínimo: 44x44 px */
.button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 16px;
}

/* Espaciado entre elementos interactivos */
.button + .button {
  margin-left: 8px;
}

/* Evitar hover-only interactions */
.menu {
  display: none;
}

.menu.open {
  display: block;
}
```

---

## 🧪 Testing Checklist

- [ ] Test en Chrome, Firefox, Safari, Edge
- [ ] Test en móvil (iPhone, Android)
- [ ] Test en tablet
- [ ] Verificar velocidad (PageSpeed Insights)
- [ ] Verificar accesibilidad (WAVE, Lighthouse)
- [ ] Verificar SEO (Google Search Console)
- [ ] Test offline con Service Worker
- [ ] Test con conexión lenta (3G)
- [ ] Test de seguridad (OWASP)
- [ ] Test de formularios

---

## 📊 Herramientas Recomendadas

### Análisis
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse

### SEO
- Google Search Console
- Ahrefs
- SEMrush

### Seguridad
- OWASP ZAP
- Snyk
- npm audit

### Accesibilidad
- WAVE
- AXLE
- Lighthouse

### Desarrollo
- Visual Studio Code
- DevTools del navegador
- Prettier (Formateador)
- ESLint (Linter JavaScript)

---

## 📚 Recursos Adicionales

- [MDN Web Docs](https://developer.mozilla.org)
- [Google Developers](https://developers.google.com)
- [W3C Standards](https://www.w3.org)
- [Can I Use](https://caniuse.com)
- [Web.dev](https://web.dev)

---

**Última actualización**: 2024  
**Compatibilidad**: Todos los navegadores modernos
