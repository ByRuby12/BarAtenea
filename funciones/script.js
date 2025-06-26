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

function inicializarInfoBar() {
  fetch('datos/info-bar.json')
    .then(r => r.json())
    .then(info => {
      if (document.getElementById('bar-nombre'))
        document.getElementById('bar-nombre').textContent = info.nombreBar || '';
      if (document.getElementById('bar-direccion'))
        document.getElementById('bar-direccion').textContent = info.direccion || '';
      if (document.getElementById('logo-img')) {
        document.getElementById('logo-img').src = info.logo || 'imagenes/logo-bar.png';
        document.getElementById('logo-img').alt = 'Logo ' + (info.nombreBar || '');
      }
      if (document.getElementById('banner-img')) {
        document.getElementById('banner-img').src = info.banner || 'imagenes/banner-bar.jpg';
        document.getElementById('banner-img').alt = 'Banner ' + (info.nombreBar || '');
      }
      if (info.colores) {
        const root = document.documentElement;
        Object.entries(info.colores).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value);
        });
      }
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
        <div style="margin-top:1.2rem; text-align:center;">
          <a href="tel:${info.telefono || ''}" class="btn-contactar">📞 Contactar ahora</a>
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
  categoriaObj.productos.forEach((producto, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.opacity = 0;
    card.style.transform = 'translateY(30px) scale(0.98)';
    card.innerHTML = `
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <div class="price">${producto.precio}</div>
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

window.addEventListener('DOMContentLoaded', () => {
  inicializarInfoBar();
  cargarInfoBar(() => {
    cargarMenuYNavDesdeJSON();
  });
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
  stickyHeader = document.createElement('div');
  stickyHeader.className = 'sticky-header';
  stickyHeader.innerHTML = `
    <div class="sticky-banner-bg"><img src='imagenes/banner-bar.jpg' alt='Banner Bar Atenea'></div>
    <div class="sticky-header-row" style="display:flex;align-items:center;gap:0.7rem;z-index:2;position:relative;">
      <div class="sticky-logo"><img src="imagenes/logo-bar.png" alt="Logo Bar Atenea"></div>
      <div class="sticky-title">Bar Atenea</div>
    </div>
    <nav class="nav-scroll-wrapper sticky-nav">
      <ul class="nav-list"></ul>
    </nav>
  `;
  document.body.appendChild(stickyHeader);
  // Copiar categorías actuales
  const navList = stickyHeader.querySelector('.nav-list');
  document.querySelectorAll('.nav-list li').forEach(li => {
    const clone = li.cloneNode(true);
    clone.classList.remove('active');
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
    mostrarStickyHeader(true);
  } else {
    mostrarStickyHeader(false);
  }
});
