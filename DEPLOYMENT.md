# 🚀 Guía de Despliegue - Special Dog-Special Cat Landing Page

Esta guía te ayudará a desplegar tu landing page en diferentes plataformas.

## 📋 Tabla de Contenidos
1. [Netlify](#netlify)
2. [Vercel](#vercel)
3. [GitHub Pages](#github-pages)
4. [Firebase Hosting](#firebase-hosting)
5. [Heroku](#heroku)
6. [Servidor Propio](#servidor-propio)

---

## 🌐 Netlify

### Método 1: Drag & Drop (Más Fácil)
1. Ve a [netlify.com](https://netlify.com)
2. Crea una cuenta o inicia sesión
3. Arrastra la carpeta de tu proyecto al área designada
4. ¡Listo! Tu sitio estará en línea en segundos

### Método 2: Conectar GitHub
1. Sube tu proyecto a GitHub
2. En Netlify, selecciona "New site from Git"
3. Autoriza GitHub
4. Selecciona tu repositorio
5. Configuración automática
6. Deploy automático con cada push

### Configuración netlify.toml (Opcional)
```toml
[build]
  command = "echo 'Build complete'"
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production]
  command = "echo 'Production build'"
```

---

## ⚡ Vercel

### Método 1: CLI de Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Ir a tu carpeta del proyecto
cd special-dog-cat

# Desplegar
vercel
```

### Método 2: Conexión con GitHub
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Importa tu repositorio
4. Vercel detectará automáticamente la configuración
5. Click en "Deploy"

### vercel.json (Opcional)
```json
{
  "version": 2,
  "builds": [
    { "src": "index.html", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

---

## 📦 GitHub Pages

### Pasos
1. Sube tu proyecto a GitHub
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/usuario/special-dog-cat.git
   git push -u origin main
   ```

2. Ve a Settings > Pages de tu repositorio

3. En "Source", selecciona:
   - Branch: `main`
   - Folder: `/ (root)`

4. Click "Save"

5. Tu sitio estará en: `https://usuario.github.io/special-dog-cat`

### GitHub Actions (Opcional)
Crear archivo `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

---

## 🔥 Firebase Hosting

### Instalación
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Loguear en Firebase
firebase login

# Inicializar proyecto
firebase init hosting
```

### Responder las preguntas
- Project: Selecciona tu proyecto o crea uno nuevo
- Public directory: `.` (el directorio actual)
- Configure as single-page app: `Yes`
- File: `index.html`

### Desplegar
```bash
firebase deploy
```

### firebase.json
```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 🚀 Heroku

### Usando Buildpack Estático
```bash
# Instalar Heroku CLI
npm install -g heroku

# Loguear
heroku login

# Crear app
heroku create special-dog-cat

# Agregar buildpack estático
heroku buildpacks:set heroku/php

# Desplegar
git push heroku main
```

### Procfile
```
web: vendor/bin/heroku-php-apache2 public/
```

---

## 🖥️ Servidor Propio (VPS/Hosting Compartido)

### Opción 1: Hosting Compartido (Cpanel)
1. Sube archivos vía FTP
2. Asegúrate que `index.html` esté en la raíz
3. Configura dominios en Cpanel
4. ¡Listo!

### Opción 2: VPS Linux

#### Con Nginx
```bash
# Instalar Nginx
sudo apt update
sudo apt install nginx

# Crear directorio
sudo mkdir -p /var/www/special-dog-cat
cd /var/www/special-dog-cat

# Subir archivos aquí
# (vía FTP, Git o manual)

# Crear config
sudo nano /etc/nginx/sites-available/special-dog-cat
```

Contenido nginx.conf:
```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;
    
    root /var/www/special-dog-cat;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Activar:
```bash
sudo ln -s /etc/nginx/sites-available/special-dog-cat /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

#### Con Apache
```bash
# Instalar Apache
sudo apt install apache2

# Habilitar mod_rewrite
sudo a2enmod rewrite

# Crear .htaccess en raíz
```

.htaccess:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🔒 HTTPS/SSL

### Opción 1: Let's Encrypt (Gratuito)
```bash
# Con Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.com

# Auto-renovación
sudo systemctl enable certbot.timer
```

### Opción 2: CloudFlare (Gratuito)
1. Ve a [cloudflare.com](https://cloudflare.com)
2. Agrega tu dominio
3. Cambia nameservers en tu registrador
4. CloudFlare proporciona SSL automáticamente

---

## 🔧 Optimizaciones Pre-Despliegue

### 1. Minificación
```bash
# CSS
npm install -g uglifycss
uglifycss styles.css > styles.min.css

# JavaScript
npm install -g uglify-js
uglifyjs script.js > script.min.js
```

### 2. Optimizar Imágenes
```bash
# Instalar ImageMagick
sudo apt install imagemagick

# Convertir a WebP
convert imagen.jpg -quality 80 imagen.webp
```

### 3. Performance
- Minificar HTML/CSS/JS
- Usar WebP para imágenes
- Comprimir archivos gzip
- Implementar caching
- Lazy loading de imágenes

### 4. SEO
- Actualizar meta tags
- Agregar sitemap.xml
- Crear robots.txt

---

## 📊 Monitoreo Post-Despliegue

### Google Analytics
```javascript
// Agregar al final de script.js
gtag('config', 'GA_MEASUREMENT_ID');
```

### Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://pingdom.com)
- [StatusPage](https://www.statuspage.io/)

### Performance Monitoring
- [PageSpeed Insights](https://pagespeed.web.dev)
- [GTmetrix](https://gtmetrix.com)
- [WebPageTest](https://www.webpagetest.org)

---

## 🐛 Troubleshooting

### El sitio dice "Cannot GET /"
- Asegúrate que `index.html` esté en la raíz
- Configura redirecciones 404 → index.html

### Estilos no cargan
- Verifica rutas relativas en `index.html`
- Usa rutas absolutas: `/styles.css` en lugar de `styles.css`

### JavaScript no funciona
- Verifica que `script.js` esté correctamente vinculado
- Revisa la consola del navegador (F12) para errores

### CORS Errors
- Agrega headers CORS en tu servidor
```nginx
add_header "Access-Control-Allow-Origin" "*";
```

---

## 📞 Comandos Útiles

```bash
# Ver tamaño de archivos
du -sh *

# Comprimir con gzip
gzip -k styles.css
gzip -k script.js

# Validar HTML
npm install -g html-validator

# Servir localmente en producción
python -m http.server 8000

# Ver logs en tiempo real
tail -f /var/log/nginx/access.log
```

---

## ✅ Checklist Final

- [ ] Todos los links funcionan
- [ ] Imágenes se cargan correctamente
- [ ] Responsivo en móvil
- [ ] Formularios funcionan
- [ ] Analytics configurado
- [ ] SSL/HTTPS activo
- [ ] Metas tags correctas
- [ ] Favicon presente
- [ ] robots.txt creado
- [ ] sitemap.xml generado
- [ ] Performance optimizado
- [ ] Errores 404 redirigidos
- [ ] Cache configurado
- [ ] Dominio conectado

---

## 📞 Soporte

Para preguntas sobre despliegue:
- Documentación oficial de cada plataforma
- Stack Overflow
- Comunidades de desarrollo

---

**Última actualización**: 2024  
**Compatible con**: Todas las plataformas modernas
