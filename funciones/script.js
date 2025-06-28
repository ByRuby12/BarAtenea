function cargarMenuYNavDesdeJSON() {
  fetch('datos/menu.json')
    .then(response => response.json())
    .then(data => {
      window.menuData = data;
      generarNavegadorCategorias(data);
      // Seleccionar la primera categoría por defecto
      if (data.length > 0) {
        setActiveCategory(data[0].categoria);
        mostrarProductosPorCategoria(data[0].categoria);
      }
    });
}

function generarNavegadorCategorias(data) {
  const navList = document.querySelector('.nav-list');
  navList.innerHTML = '';
  data.forEach((cat, idx) => {
    const li = document.createElement('li');
    li.textContent = cat.categoria;
    if (idx === 0) li.classList.add('active');
    li.addEventListener('click', function () {
      document.querySelectorAll('.nav-list li').forEach(el => el.classList.remove('active'));
      this.classList.add('active');
      mostrarProductosPorCategoria(cat.categoria);
      // Centrar el botón seleccionado en móvil
      if (window.innerWidth <= 600) {
        const parent = navList.parentElement;
        const liRect = this.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        const scrollLeft = this.offsetLeft - (parentRect.width / 2) + (liRect.width / 2);
        parent.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    });
    navList.appendChild(li);
  });
}

function setActiveCategory(categoria) {
  document.querySelectorAll('.nav-list li').forEach(li => {
    if (li.textContent.trim() === categoria) {
      li.classList.add('active');
    } else {
      li.classList.remove('active');
    }
  });
}

function cargarInfoBar(callback) {
  fetch('datos/info-bar.json')
    .then(response => response.json())
    .then(data => {
      window.infoBar = data;
      if (typeof callback === 'function') callback();
    });
}

function inicializarInfoBarYMeta() {
  fetch('datos/info-bar.json')
    .then(r => r.json())
    .then(info => {
      // Inicializar infoBar global
      window.infoBar = info;

      // Actualizar elementos visuales
      if (document.getElementById('bar-nombre'))
        document.getElementById('bar-nombre').textContent = info.nombreBar || '';
      if (document.getElementById('bar-direccion'))
        document.getElementById('bar-direccion').textContent = info.direccion || '';
      if (document.getElementById('logo-img')) {
        document.getElementById('logo-img').src = info.logo || '';
        document.getElementById('logo-img').alt = 'Logo ' + (info.nombreBar || '');
      }
      if (document.getElementById('banner-img')) {
        document.getElementById('banner-img').src = info.banner || '';
        document.getElementById('banner-img').alt = 'Banner ' + (info.nombreBar || '');
      }
      if (info.colores) {
        const root = document.documentElement;
        Object.entries(info.colores).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value);
        });
      }

      // Actualizar meta y title
      document.title = info.nombreBar || '';
      const metaTitle = document.getElementById('meta-title');
      if (metaTitle) metaTitle.textContent = info.nombreBar || '';
      const metaDesc = document.getElementById('meta-description');
      if (metaDesc) metaDesc.setAttribute('content', info.descripcion || '');
      const metaKeywords = document.getElementById('meta-keywords');
      if (metaKeywords) metaKeywords.setAttribute('content', info.keywords || '');
      const metaAuthor = document.getElementById('meta-author');
      if (metaAuthor) metaAuthor.setAttribute('content', info.nombreBar || '');
    });
}

function renderContactoSection() {
  const info = window.infoBar || {};
  const menuContainer = document.getElementById('menu-container');
  menuContainer.innerHTML = `
    <section class="contacto-section animate-contacto contacto-simple">
      <div class="contacto-logo-nombre">
        <img src="${info.logo || 'imagenes/logo-bar.png'}" alt="Logo ${info.nombreBar || ''}" class="contacto-logo" />
        <h2 class="contacto-nombre">${info.nombreBar || ''}</h2>
      </div>
      <div class="contacto-datos-simples" style="margin-top:1.2rem;">
        <div>📍 ${info.direccion || ''}</div>
        <div>⏰ ${info.horario || ''}</div>
        <div>📧 ${info.email || ''}</div>
        <div class="enlace-google-maps">
          ${info.enlaceGoogleMaps ? `<a href="${info.enlaceGoogleMaps}" class="btn-reseña-google" target="_blank" rel="noopener">📱 Califícanos ahora</a><br>` : ''}
          ${info.telefono ? `<a href="tel:${info.telefono}" class="btn-contactar">📞 Contactar ahora</a>` : ''}
        </div>
      </div>
    </section>
  `;
}

function mostrarProductosPorCategoria(categoria) {
  if (categoria.toLowerCase() === 'contacto') {
    renderContactoSection();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const menuContainer = document.getElementById('menu-container');
  menuContainer.innerHTML = '';
  const categoriaObj = (window.menuData || []).find(cat => cat.categoria === categoria);
  if (!categoriaObj) return;
  (categoriaObj.productos || []).forEach((producto, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.opacity = 0;
    card.style.transform = 'translateY(30px) scale(0.98)';
    card.innerHTML = `
      <h3>${producto.nombre || ''}</h3>
      <p>${producto.descripcion || ''}</p>
      <div class="price">${producto.precio || ''}</div>
    `;
    menuContainer.appendChild(card);
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s cubic-bezier(.4,1.3,.5,1), transform 0.4s cubic-bezier(.4,1.3,.5,1)';
      card.style.opacity = 1;
      card.style.transform = 'translateY(0) scale(1)';
    }, 60 * idx);
  });
  // Subir arriba del todo al cambiar de categoría
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function inicializarWeb() {
  // Cargar info-bar.json y luego menu.json, y luego inicializar todo lo visual
  fetch('datos/info-bar.json')
    .then(r => r.json())
    .then(info => {
      window.infoBar = info;

      // Actualizar elementos visuales principales
      if (document.getElementById('bar-nombre'))
        document.getElementById('bar-nombre').textContent = info.nombreBar || '';
      if (document.getElementById('bar-direccion'))
        document.getElementById('bar-direccion').textContent = info.direccion || '';
      if (document.getElementById('logo-img')) {
        document.getElementById('logo-img').src = info.logo || '';
        document.getElementById('logo-img').alt = 'Logo ' + (info.nombreBar || '');
      }
      if (document.getElementById('banner-img')) {
        document.getElementById('banner-img').src = info.banner || '';
        document.getElementById('banner-img').alt = 'Banner ' + (info.nombreBar || '');
      }
      if (info.colores) {
        const root = document.documentElement;
        Object.entries(info.colores).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value);
        });
      }

      if (info.iconoFavicon) {
        let favicon = document.querySelector("link[rel~='icon']");
        if (!favicon) {
          favicon = document.createElement('link');
          favicon.rel = 'icon';
          document.head.appendChild(favicon);
        }
        favicon.href = info.iconoFavicon;
      }

      // Actualizar meta y title
      document.title = info.nombreBar || '';
      const metaTitle = document.getElementById('meta-title');
      if (metaTitle) metaTitle.textContent = info.nombreBar || '';
      const metaDesc = document.getElementById('meta-description');
      if (metaDesc) metaDesc.setAttribute('content', info.descripcion || '');
      const metaKeywords = document.getElementById('meta-keywords');
      if (metaKeywords) metaKeywords.setAttribute('content', info.keywords || '');
      const metaAuthor = document.getElementById('meta-author');
      if (metaAuthor) metaAuthor.setAttribute('content', info.nombreBar || '');

      // Footer: logo, enlaces y derechos reservados
      const logoFooter = document.getElementById('footer-logo');
      if (logoFooter) {
        logoFooter.src = info.logoFooter || info.logo || 'imagenes/logo-bar.png';
        logoFooter.alt = info.nombreBar || '';
      }
      const redes = info.redes || {};
      if (document.getElementById('footer-twitter')) {
        document.getElementById('footer-twitter').href = redes.twitter || "#";
      }
      if (document.getElementById('footer-tiktok')) {
        document.getElementById('footer-tiktok').href = redes.tiktok || "#";
      }
      if (document.getElementById('footer-youtube')) {
        document.getElementById('footer-youtube').href = redes.youtube || "#";
      }
      if (document.getElementById('footer-instagram')) {
        document.getElementById('footer-instagram').href = redes.instagram || "#";
      }
      const year = new Date().getFullYear();
      const derechos = document.getElementById('footer-derechos');
      if (derechos) {
        if (info.footerDerechos) {
          derechos.textContent = info.footerDerechos.replace('{year}', year).replace('{bar}', info.nombreBar || '');
        } else {
          derechos.textContent = `© ${year} ${info.nombreBar || ''}. Todos los derechos reservados.`;
        }
      }

      // Ahora cargar el menú y la navegación
      fetch('datos/menu.json')
        .then(response => response.json())
        .then(data => {
          window.menuData = data;
          generarNavegadorCategorias(data);
          // Seleccionar la primera categoría por defecto
          if (data.length > 0) {
            setActiveCategory(data[0].categoria);
            mostrarProductosPorCategoria(data[0].categoria);
          }
        });
    });
}

window.addEventListener('DOMContentLoaded', () => {
  inicializarWeb();
});

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.contacto-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.reset();
      alert('¡Gracias por tu mensaje! Nos pondremos en contacto pronto.');
    });
  }
});

const topBanner = document.querySelector('.top-banner-mix');
const navWrapper = document.querySelector('.nav-scroll-wrapper');
const barTitle = document.querySelector('.bar-title');
const bannerBg = document.querySelector('.banner-bg');

let stickyHeader = null;

function crearStickyHeader() {
  if (stickyHeader) return;
  // Obtener datos de info-bar.json si están cargados
  const info = window.infoBar || {};
  stickyHeader = document.createElement('div');
  stickyHeader.className = 'sticky-header';
  stickyHeader.innerHTML = `
    <div class="sticky-banner-bg">
      <img src="${info.banner || ''}" alt="Banner ${info.nombreBar || 'Bar'}">
    </div>
    <div class="sticky-header-row" style="display:flex;align-items:center;gap:0.7rem;z-index:2;position:relative;">
      <div class="sticky-logo">
        <img src="${info.logo || ''}" alt="Logo ${info.nombreBar || 'Bar'}">
      </div>
      <div class="sticky-title">${info.nombreBar || ''}</div>
    </div>
    <nav class="nav-scroll-wrapper sticky-nav">
      <ul class="nav-list"></ul>
    </nav>
  `;
  document.body.appendChild(stickyHeader);
}

function actualizarStickyNav() {
  if (!stickyHeader) return;
  const navList = stickyHeader.querySelector('.nav-list');
  navList.innerHTML = '';
  document.querySelectorAll('.nav-list li').forEach(li => {
    const clone = li.cloneNode(true);
    if (li.classList.contains('active')) clone.classList.add('active');
    clone.addEventListener('click', () => li.click());
    navList.appendChild(clone);
  });
}

function mostrarStickyHeader(show) {
  if (!stickyHeader) return;
  stickyHeader.style.display = show ? 'flex' : 'none';
}

window.addEventListener('scroll', () => {
  const trigger = (topBanner.offsetHeight || 120) - 30;
  if (window.scrollY > trigger) {
    crearStickyHeader();
    actualizarStickyNav();
    mostrarStickyHeader(true);
  } else {
    mostrarStickyHeader(false);
  }
});

// Actualizar sticky nav al cambiar categorías
document.addEventListener('click', function (e) {
  if (e.target.closest('.nav-list li')) {
    setTimeout(actualizarStickyNav, 0);
  }
});

console.log('¡Gracias por visitar Bar Atenea! Disfruta de nuestra comida y bebidas.');
console.log('Página Web realizada por: ByRuby12 - https://github.com/ByRuby12 ');
console.log('Contactame por email: byruby12.contacto@gmail.com');
