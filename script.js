// =====================================
// SMOOTH SCROLL - Desplazamiento suave
// =====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =====================================
// INTERSECTION OBSERVER - Animaciones al scroll
// =====================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos que deben animarse
document.querySelectorAll('.feature-card, .product-card').forEach(el => {
    observer.observe(el);
});

// =====================================
// HEADER SCROLL EFFECT
// =====================================
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// =====================================
// BUTTON CLICK HANDLERS
// =====================================
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        // Log para debugging
        console.log('Botón clickeado:', this.textContent.trim());
        
        // Aquí puedes agregar la lógica de navegación o redirección
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            // Ya manejado por smooth scroll
        }
    });
});

// =====================================
// FEATURE CARDS - Hover interactivo
// =====================================
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// =====================================
// PRODUCT CARDS - Interactividad mejorada
// =====================================
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.product-image');
        icon.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.product-image');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// =====================================
// NAV LINKS - Highlight activo
// =====================================
window.addEventListener('scroll', function() {
    let current = '';
    
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// =====================================
// FORM VALIDATION (si es necesario)
// =====================================
function validateForm(formData) {
    let errors = [];
    
    if (!formData.name || formData.name.trim() === '') {
        errors.push('El nombre es requerido');
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
        errors.push('El email no es válido');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// =====================================
// LAZY LOADING DE IMÁGENES (si es necesario)
// =====================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// =====================================
// MOBILE MENU (si es necesario agregar después)
// =====================================
function setupMobileMenu() {
    const nav = document.querySelector('nav ul');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
}

// =====================================
// UTILITY FUNCTIONS
// =====================================

// Función para animar números
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Función para copiar al portapapeles
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Texto copiado al portapapeles');
    }).catch(err => {
        console.error('Error al copiar:', err);
    });
}

// =====================================
// INICIALIZACIÓN AL CARGAR
// =====================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🐕 Special Dog - Special Cat Landing Page Cargada');
    
    // Iniciar animaciones personalizadas
    setupMobileMenu();
    
    // Agregar evento de carga completada
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });
});

// =====================================
// ANALYTICS Y TRACKING (opcional)
// =====================================
function trackEvent(eventName, eventData = {}) {
    console.log(`📊 Evento: ${eventName}`, eventData);
    // Aquí puedes enviar datos a Google Analytics o tu servicio de tracking
}

// Track clicks en botones principales
document.querySelectorAll('.btn-primary, .btn-secondary, .cta-button').forEach(btn => {
    btn.addEventListener('click', function() {
        trackEvent('button_click', {
            button_text: this.textContent.trim(),
            timestamp: new Date()
        });
    });
});

// =====================================
// MANEJO DE ERRORES
// =====================================
window.addEventListener('error', function(event) {
    console.error('Error en la página:', event.error);
});

// =====================================
// FIN DEL SCRIPT
// =====================================
