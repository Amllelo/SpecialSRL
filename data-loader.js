// =====================================
// SCRIPT DE INTEGRACIÓN DE DATOS
// Carga dinámicamente datos desde config.json
// =====================================

class EmpresaDataLoader {
  constructor() {
    this.config = null;
    this.init();
  }

  /**
   * Inicializar y cargar datos
   */
  async init() {
    try {
      await this.loadConfig();
      this.populatePageData();
      console.log('✅ Datos de empresa cargados correctamente');
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    }
  }

  /**
   * Cargar configuración desde JSON
   */
  async loadConfig() {
    try {
      const response = await fetch('/config.json');
      if (!response.ok) {
        throw new Error('No se pudo cargar config.json');
      }
      this.config = await response.json();
      return this.config;
    } catch (error) {
      console.error('Error en loadConfig:', error);
      throw error;
    }
  }

  /**
   * Poblar datos en la página
   */
  populatePageData() {
    if (!this.config) return;

    // Actualizar meta tags dinámicamente
    this.updateMetaTags();

    // Actualizar información de empresa
    this.updateEmpresaInfo();

    // Actualizar productos
    this.updateProductos();

    // Actualizar características
    this.updateCaracteristicas();

    // Actualizar valores
    this.updateValores();

    // Actualizar footer
    this.updateFooter();
  }

  /**
   * Actualizar meta tags
   */
  updateMetaTags() {
    const meta = this.config.metadatos;

    // Title
    document.title = meta.titulo;

    // Description
    this.setOrCreateMetaTag('description', meta.descripcion);
    this.setOrCreateMetaTag('keywords', meta.keywords);
    this.setOrCreateMetaTag('author', meta.autor);

    // Open Graph
    this.setOrCreateMetaTag('og:title', meta.titulo, 'property');
    this.setOrCreateMetaTag('og:description', meta.descripcion, 'property');

    // Twitter Card
    this.setOrCreateMetaTag('twitter:title', meta.titulo);
  }

  /**
   * Crear o actualizar meta tag
   */
  setOrCreateMetaTag(name, content, attr = 'name') {
    let tag = document.querySelector(`meta[${attr}="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attr, name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  }

  /**
   * Actualizar información de empresa
   */
  updateEmpresaInfo() {
    const empresa = this.config.empresa;
    const contacto = this.config.contacto;

    // Logo/Nombre en header
    const logoElement = document.querySelector('.logo');
    if (logoElement) {
      logoElement.textContent = `${empresa.nombre.split(' ')[0]} Pet`;
    }

    // Footer información
    const footerText = document.querySelector('footer p:last-of-type');
    if (footerText) {
      footerText.textContent = `Cuidando a tus mascotas con nutrición premium desde ${empresa.pais}`;
    }

    // Redes sociales
    this.addSocialLinks(contacto.redes_sociales);
  }

  /**
   * Agregar links de redes sociales
   */
  addSocialLinks(redesSociales) {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const socialContainer = document.createElement('div');
    socialContainer.className = 'social-links';
    socialContainer.style.marginBottom = '1rem';

    for (const [red, url] of Object.entries(redesSociales)) {
      if (url && url.startsWith('http')) {
        const link = document.createElement('a');
        link.href = url;
        link.textContent = red;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.marginRight = '1rem';
        link.style.color = '#D97757';
        link.style.textDecoration = 'none';
        socialContainer.appendChild(link);
      }
    }

    footer.insertBefore(socialContainer, footer.lastElementChild);
  }

  /**
   * Actualizar productos dinámicamente
   */
  updateProductos() {
    const productGrid = document.querySelector('.products-grid');
    if (!productGrid || !this.config.productos) return;

    // Limpiar productos existentes (opcionales)
    // productGrid.innerHTML = '';

    this.config.productos.forEach((producto, index) => {
      // Actualizar o crear tarjeta de producto
      const existingCard = productGrid.children[index];
      if (existingCard) {
        this.updateProductCard(existingCard, producto);
      }
    });
  }

  /**
   * Actualizar tarjeta de producto individual
   */
  updateProductCard(card, producto) {
    const emoji = card.querySelector('.product-image');
    const name = card.querySelector('.product-info h3');
    const desc = card.querySelector('.product-info p');
    const badge = card.querySelector('.badge');

    if (emoji) emoji.textContent = producto.emoji;
    if (name) name.textContent = producto.nombre;
    if (desc) desc.textContent = producto.descripcion;
    if (badge) badge.textContent = producto.badge;
  }

  /**
   * Actualizar características dinámicamente
   */
  updateCaracteristicas() {
    const featuresGrid = document.querySelector('.features-grid');
    if (!featuresGrid || !this.config.caracteristicas) return;

    this.config.caracteristicas.forEach((feature, index) => {
      const card = featuresGrid.children[index];
      if (card) {
        this.updateFeatureCard(card, feature);
      }
    });
  }

  /**
   * Actualizar tarjeta de característica
   */
  updateFeatureCard(card, feature) {
    const icon = card.querySelector('.feature-icon');
    const title = card.querySelector('h3');
    const desc = card.querySelector('p');

    if (icon) icon.textContent = feature.icono;
    if (title) title.textContent = feature.titulo;
    if (desc) desc.textContent = feature.descripcion;
  }

  /**
   * Actualizar valores
   */
  updateValores() {
    const valoresGrid = document.querySelector('.values-grid');
    if (!valoresGrid || !this.config.valores) return;

    this.config.valores.forEach((valor, index) => {
      const item = valoresGrid.children[index];
      if (item) {
        this.updateValueItem(item, valor);
      }
    });
  }

  /**
   * Actualizar item de valor
   */
  updateValueItem(item, valor) {
    const icon = item.querySelector('.value-icon');
    const name = item.querySelector('h3');
    const desc = item.querySelector('p');

    if (icon) icon.textContent = valor.icono;
    if (name) name.textContent = valor.nombre;
    if (desc) desc.textContent = valor.descripcion;
  }

  /**
   * Actualizar footer
   */
  updateFooter() {
    const empresa = this.config.empresa;
    const year = new Date().getFullYear();

    const footerCopy = document.querySelector('footer p:first-of-type');
    if (footerCopy) {
      footerCopy.innerHTML = `&copy; ${year} ${empresa.nombre}. Todos los derechos reservados. 🐕🐱`;
    }
  }

  /**
   * Obtener datos de la empresa
   */
  getEmpresa() {
    return this.config?.empresa;
  }

  /**
   * Obtener productos
   */
  getProductos() {
    return this.config?.productos || [];
  }

  /**
   * Obtener valores
   */
  getValores() {
    return this.config?.valores || [];
  }

  /**
   * Obtener contacto
   */
  getContacto() {
    return this.config?.contacto;
  }

  /**
   * Buscar producto por ID
   */
  getProductoById(id) {
    return this.config?.productos.find(p => p.id === id);
  }

  /**
   * Buscar valor por nombre
   */
  getValorByName(nombre) {
    return this.config?.valores.find(v => v.nombre === nombre);
  }
}

// =====================================
// INICIALIZAR AL CARGAR LA PÁGINA
// =====================================

document.addEventListener('DOMContentLoaded', () => {
  // Crear instancia global
  window.empresaData = new EmpresaDataLoader();

  // Ejemplo de uso después de cargar:
  setTimeout(() => {
    if (window.empresaData.config) {
      console.log('Empresa:', window.empresaData.getEmpresa().nombre);
      console.log('Productos disponibles:', window.empresaData.getProductos().length);
      console.log('Contacto:', window.empresaData.getContacto().email);
    }
  }, 500);
});

// =====================================
// UTILIDADES ADICIONALES
// =====================================

/**
 * Exportar datos como JSON (para API)
 */
function exportarDatos() {
  if (!window.empresaData?.config) return null;
  return JSON.stringify(window.empresaData.config, null, 2);
}

/**
 * Actualizar datos en tiempo real
 */
async function actualizarDatos() {
  await window.empresaData.loadConfig();
  window.empresaData.populatePageData();
  console.log('Datos actualizados');
}

/**
 * Validar estructura de datos
 */
function validarConfiguracion() {
  const config = window.empresaData?.config;
  
  const campos_requeridos = ['empresa', 'contacto', 'productos', 'caracteristicas', 'valores'];
  const faltantes = campos_requeridos.filter(campo => !config?.[campo]);

  if (faltantes.length > 0) {
    console.warn('⚠️ Campos faltantes:', faltantes);
    return false;
  }

  console.log('✅ Configuración válida');
  return true;
}

/**
 * Obtener estadísticas de los datos
 */
function obtenerEstadisticas() {
  const config = window.empresaData?.config;
  
  return {
    empresa: config?.empresa.nombre,
    productos: config?.productos.length || 0,
    caracteristicas: config?.caracteristicas.length || 0,
    valores: config?.valores.length || 0,
    redes_sociales: Object.keys(config?.contacto.redes_sociales || {}).length
  };
}

/**
 * Generar reporte de empresa
 */
function generarReporte() {
  const config = window.empresaData?.config;
  if (!config) {
    console.error('No hay datos disponibles');
    return;
  }

  const reporte = `
    REPORTE DE EMPRESA
    ==================
    
    Empresa: ${config.empresa.nombre}
    Misión: ${config.mision}
    Visión: ${config.vision}
    
    CONTACTO:
    - Email: ${config.contacto.email}
    - Teléfono: ${config.contacto.telefonos.join(', ')}
    - Dirección: ${config.contacto.direccion}
    
    PRODUCTOS: ${config.productos.length}
    ${config.productos.map(p => `- ${p.nombre}: ${p.descripcion}`).join('\n')}
    
    VALORES: ${config.valores.length}
    ${config.valores.map(v => `- ${v.nombre}: ${v.descripcion}`).join('\n')}
    
    ==================
    Generado: ${new Date().toLocaleString()}
  `;

  console.log(reporte);
  return reporte;
}

// =====================================
// HACER FUNCIONES GLOBALES ACCESIBLES
// =====================================

window.exportarDatos = exportarDatos;
window.actualizarDatos = actualizarDatos;
window.validarConfiguracion = validarConfiguracion;
window.obtenerEstadisticas = obtenerEstadisticas;
window.generarReporte = generarReporte;

// Hacer disponibles en consola
console.log(`
  🐕 SPECIAL DOG-SPECIAL CAT DATA LOADER
  
  Funciones disponibles en consola:
  
  empresaData.getEmpresa()
  empresaData.getProductos()
  empresaData.getValores()
  empresaData.getContacto()
  
  exportarDatos()
  actualizarDatos()
  validarConfiguracion()
  obtenerEstadisticas()
  generarReporte()
  
  Prueba: empresaData.getEmpresa().nombre
`);
