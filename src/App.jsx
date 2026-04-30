import React, { useState, useEffect } from 'react';
import { Search, Apple, Smartphone, Shield, Maximize, BatteryCharging, PackageSearch, FileText, CalendarCheck, MessageCircle, Truck, MapPin, CalendarDays, X, Users, CreditCard, ShoppingBag } from 'lucide-react';
import logoMM from './assets/Logo.Empresa.png';
import './index.css';
import AdminPanel from './AdminPanel';

const iphones = [
  {
    id: 'ip13-black',
    name: 'iPhone 13 128GB',
    image: '/images/ip13_black.jpg',
    desc: 'Batería: 88%\nColor: Black',
    condition: 'Usado',
    batteryHealth: '88% de vida útil',
    specs: {
      pantalla: 'OLED de 6.1 pulgadas 2532 x 1170 píxeles a 460 ppi',
      procesador: 'Chip A15 Bionic',
      ram: '4 GB',
      almacenamiento: '128 GB',
      bateria: 'Capacidad de 3,227 mAh',
      camaraPrincipal: 'Principal: 12 MP con apertura de ƒ/1.6\nUltra Gran Angular: 12 MP con apertura de ƒ/2.4 y un campo de visión de 120°',
      video: 'Grabación en 4K Dolby Vision HDR hasta a 60 fps.',
      redes: 'Compatibilidad con tecnología 5G, Wi-Fi 6, Bluetooth 5.0'
    },
    colors: ['#333333'],
    isNew: false,
    sold: false,
  },
  {
    id: 'ip13-red',
    name: 'iPhone 13 128GB',
    image: '/images/ip13_red.jpg',
    desc: 'Batería: 100%\nColor: Red',
    condition: 'Usado',
    batteryHealth: '100% de vida útil',
    specs: {
      pantalla: 'OLED de 6.1 pulgadas 2532 x 1170 píxeles a 460 ppi',
      procesador: 'Chip A15 Bionic',
      ram: '4 GB',
      almacenamiento: '128 GB',
      bateria: 'Capacidad de 3,227 mAh',
      camaraPrincipal: 'Principal: 12 MP con apertura de ƒ/1.6\nUltra Gran Angular: 12 MP con apertura de ƒ/2.4 y un campo de visión de 120°',
      video: 'Grabación en 4K Dolby Vision HDR hasta a 60 fps.',
      redes: 'Compatibilidad con tecnología 5G, Wi-Fi 6, Bluetooth 5.0'
    },
    colors: ['#ff3b30'],
    isNew: false,
    sold: false,
  },
  {
    id: 'ip14-red',
    name: 'iPhone 14 128GB',
    image: '/images/ip14_red.jpg',
    desc: 'Batería: 85%\nColor: Red',
    condition: 'Usado',
    batteryHealth: '85% de vida útil',
    specs: {
      pantalla: 'OLED de 6.1 pulgadas 2532 x 1170 píxeles a 460 ppi',
      procesador: 'Chip A15 Bionic',
      ram: '6 GB',
      almacenamiento: '128 GB',
      bateria: 'Capacidad de 3,279 mAh',
      camaraPrincipal: 'Principal: 12 MP con apertura de ƒ/1.5\nUltra Gran Angular: 12 MP con apertura de ƒ/2.4',
      video: 'Grabación en 4K Dolby Vision HDR',
      redes: 'Compatibilidad con tecnología 5G, Wi-Fi 6, Bluetooth 5.3'
    },
    colors: ['#ff3b30'],
    isNew: false,
    sold: false,
  },
  {
    id: 'ip15-pro',
    name: 'iPhone 15 Pro 128GB',
    image: '/images/ip15_pro_gray.jpg',
    desc: 'Batería: 86%\nColor: Gray',
    condition: 'Usado',
    batteryHealth: '86% de vida útil',
    specs: {
      pantalla: 'OLED de 6.1 pulgadas 2556 x 1179 píxeles a 460 ppi con ProMotion',
      procesador: 'Chip A17 Pro',
      ram: '8 GB',
      almacenamiento: '128 GB',
      bateria: 'Capacidad de 3,274 mAh',
      camaraPrincipal: 'Principal: 48 MP\nUltra Gran Angular: 12 MP\nTeleobjetivo 3x: 12 MP',
      video: 'Grabación en 4K Dolby Vision HDR hasta 60 fps. ProRes',
      redes: 'Compatibilidad con tecnología 5G, Wi-Fi 6E, Bluetooth 5.3'
    },
    colors: ['#8c8c8c'],
    isNew: false,
    sold: false,
  },
  {
    id: 'ip16-pro',
    name: 'iPhone 16 Pro 128GB',
    image: '/images/ip16_pro_white.jpg',
    desc: 'Batería: 100%\nColor: White',
    condition: 'Usado',
    batteryHealth: '100% de vida útil',
    specs: {
      pantalla: 'OLED de 6.3 pulgadas con ProMotion',
      procesador: 'Chip A18 Pro',
      ram: '8 GB',
      almacenamiento: '128 GB',
      bateria: 'Batería mejorada',
      camaraPrincipal: 'Principal: 48 MP\nUltra Gran Angular: 48 MP\nTeleobjetivo 5x: 12 MP',
      video: 'Grabación en 4K Dolby Vision y Spatial Video',
      redes: 'Compatibilidad con tecnología 5G, Wi-Fi 7, Bluetooth 5.4'
    },
    colors: ['#f0f0f0'],
    isNew: false,
    sold: true,
  }
];

const initialProductsData = {
  iphones: iphones,
  fundas: [
    {
      id: 'funda-silicone',
      name: 'Funda de Silicona',
      image: '/images/funda.png',
      desc: 'Protección premium con\nun tacto suave y agradable.',
      colors: ['#333333', '#1FEDD2', '#F5F5F7'],
      isNew: true,
    }
  ],
  vidrios: [
    {
      id: 'vidrio-templado',
      name: 'Vidrio Templado 9H',
      image: '/images/vidrio.png',
      desc: 'Máxima resistencia contra\nrayones y caídas.',
      colors: ['#F5F5F7'],
      isNew: false,
    }
  ],
  cargadores: [
    {
      id: 'cargador-20w',
      name: 'Cargador Rápido 20W',
      image: '/images/cargador.png',
      desc: 'Carga tu dispositivo al 50%\nen solo 30 minutos.',
      colors: ['#FFFFFF'],
      isNew: false,
    }
  ]
};

const categoryTitles = {
  iphones: 'Modelos de iPhone disponibles en Córdoba',
  fundas: 'Fundas premium para proteger tu dispositivo',
  vidrios: 'Vidrios templados de alta resistencia',
  cargadores: 'Cargadores y accesorios de carga'
};

function App() {
  const [dbData, setDbData] = useState(() => {
    const saved = localStorage.getItem('montivero_db');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return initialProductsData;
  });

  const [activeCategory, setActiveCategory] = useState('iphones');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [view, setView] = useState('store'); // 'store' or 'admin'

  useEffect(() => {
    localStorage.setItem('montivero_db', JSON.stringify(dbData));
  }, [dbData]);

  if (view === 'admin') {
    return <AdminPanel dbData={dbData} setDbData={setDbData} onExit={() => setView('store')} />;
  }

  const currentProducts = dbData[activeCategory] || [];

  return (
    <>
      <nav className="global-nav">
        <div className="nav-content">
          <div className="nav-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logoMM} alt="Logo Montivero" className="nav-logo-img" />
            {/* <h2 style={{margin: 0, color: '#ffffff', fontWeight: 700, letterSpacing: '-0.02em', marginLeft: '0.8rem'}}>Montivero</h2> */}
          </div>
          <div className="nav-links">
            <span onClick={() => {
              const el = document.getElementById('productos');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>iPhones y accesorios</span>
            <span onClick={() => {
              const el = document.getElementById('nosotros');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>Nosotros</span>
            {/* <span>Garantía</span> */}
            <span onClick={() => {
              const el = document.getElementById('comprar');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>Cómo comprar</span>
            <span onClick={() => {
              const el = document.getElementById('envios');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>Envíos</span>
            <span onClick={() => {
              const el = document.getElementById('contacto');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>Contacto</span>
            <span onClick={() => setView('admin')} style={{ backgroundColor: 'var(--color-montivero-primary)', color: 'var(--color-montivero-dark)', fontWeight: 700 }}>
              Admin
            </span>
          </div>
          <div className="nav-search">
            <Search size={18} />
          </div>
        </div>
      </nav>

      <header className="page-header">
        <h1 className="page-title">Actualizá tu mundo.</h1>
        <div className="page-subtitle">
          Encontrá el iPhone perfecto para vos. Equipos en estado impecable y accesorios premium en Cruz del Eje, Córdoba.
        </div>
      </header>

      <section id="productos" className="category-container">
        <div className="category-nav">
          <div className={`category-item ${activeCategory === 'iphones' ? 'active' : ''}`} onClick={() => setActiveCategory('iphones')}>
            <Smartphone className="category-icon" size={32} strokeWidth={1.5} />
            <span className="category-name">iPhones</span>
          </div>
          <div className={`category-item ${activeCategory === 'fundas' ? 'active' : ''}`} onClick={() => setActiveCategory('fundas')}>
            <Shield className="category-icon" size={32} strokeWidth={1.5} />
            <span className="category-name">Fundas</span>
          </div>
          <div className={`category-item ${activeCategory === 'vidrios' ? 'active' : ''}`} onClick={() => setActiveCategory('vidrios')}>
            <Maximize className="category-icon" size={32} strokeWidth={1.5} />
            <span className="category-name">Vidrios</span>
          </div>
          <div className={`category-item ${activeCategory === 'cargadores' ? 'active' : ''}`} onClick={() => setActiveCategory('cargadores')}>
            <BatteryCharging className="category-icon" size={32} strokeWidth={1.5} />
            <span className="category-name">Cargadores</span>
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="products-header">
          <h2>{categoryTitles[activeCategory]}</h2>
          <p>Explora nuestra selección de {activeCategory === 'iphones' ? 'dispositivos' : 'accesorios'} disponibles.</p>
        </div>

        <div className="products-grid" style={{ justifyContent: currentProducts.length < 4 ? 'center' : 'space-between', gap: '3rem' }}>
          {currentProducts.map((product) => (
            <div className="product-card" key={product.id} style={{ flex: currentProducts.length < 4 ? '0 1 300px' : '1' }} onClick={() => setSelectedProduct(product)}>
              <div className="product-image-wrapper">
                <img src={product.image} alt={product.name} className="product-image" />
              </div>
              <div className="color-dots">
                {product.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="color-dot"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="product-badges">
                {product.isNew && <div className="product-new">Nuevo</div>}
                {product.sold && <div className="product-sold">Vendido</div>}
              </div>
              <h3 className="product-title">{product.name}</h3>
              <p className="product-desc">
                {product.desc.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="nosotros" className="about-section">
        <div className="about-container">
          <h2>Sobre Nosotros</h2>
          <p className="about-subtitle">M&G iPhones CdE.</p>

          <div className="about-content">
            <div className="about-icon-wrapper">
              <Users size={48} color="var(--color-montivero-primary)" strokeWidth={1.5} />
            </div>
            <p className="about-description">
              Somos una empresa dedicada a la <strong>venta de celulares Apple iPhone usados</strong>, ofreciendo equipos de excelente calidad y en óptimas condiciones. Además, contamos con una amplia variedad de accesorios esenciales para tu dispositivo, incluyendo <strong>fundas, vidrios templados y cargadores</strong>.
            </p>
          </div>
        </div>
      </section>

      <section id="comprar" className="how-to-buy-section">
        <div className="how-to-buy-container">
          <h2>Cómo Comprar</h2>
          <p>Un proceso simple y seguro para adquirir tu próximo dispositivo o accesorio.</p>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <Smartphone size={32} color="var(--color-montivero-dark)" strokeWidth={1.5} />
              </div>
              <h3>Elegí tu modelo</h3>
              <p>Explorá nuestro catálogo online y mira los modelos de iPhone o accesorios disponibles que más te gusten.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <MessageCircle size={32} color="var(--color-montivero-dark)" strokeWidth={1.5} />
              </div>
              <h3>Contactanos</h3>
              <p>Escribinos por WhatsApp o redes sociales indicando qué equipo o accesorio te interesa adquirir.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <CalendarCheck size={32} color="var(--color-montivero-dark)" strokeWidth={1.5} />
              </div>
              <h3>Coordinamos entrega</h3>
              <p>Acordamos una cita en un lugar público y seguro para que puedas ver y recibir tu producto personalmente.</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon">
                <CreditCard size={32} color="var(--color-montivero-dark)" strokeWidth={1.5} />
              </div>
              <h3>Pago seguro</h3>
              <p>Una vez que verifiques el equipo en persona, realizas el pago mediante el método acordado previamente.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="envios" className="shipping-section">
        <div className="shipping-container">
          <h2>Información de Envíos</h2>
          <p>Para brindarte mayor seguridad, hacemos entregas personalizadas. Así puedes recibir tus productos directo en tus manos.</p>

          <div className="shipping-grid">
            <div className="shipping-card">
              <div className="shipping-icon-wrapper">
                <Truck size={32} color="var(--color-montivero-primary)" strokeWidth={1.5} />
              </div>
              <h3>Entrega Personalizada</h3>
              <p>Entregamos tu pedido en persona (en un lugar público acordado, no a domicilio) para garantizar máxima seguridad de ambas partes. Alternativamente, realizamos envíos por correo OCA, Andreani, Vía Cargo o.</p>
            </div>

            <div className="shipping-card">
              <div className="shipping-icon-wrapper">
                <MapPin size={32} color="var(--color-montivero-primary)" strokeWidth={1.5} />
              </div>
              <h3>Costos y Zonas</h3>
              <p><strong>Envío personal:</strong> de $15.000 a $40.000 ARS (pago previo), hasta 150 km de Cruz del Eje.<br /><br /><strong>Por encomienda (OCA, Andreani, Vía Cargo):</strong> El costo se informa al despachar o se abona al recibir el paquete (según permita la empresa).</p>
            </div>

            <div className="shipping-card">
              <div className="shipping-icon-wrapper">
                <CalendarDays size={32} color="var(--color-montivero-primary)" strokeWidth={1.5} />
              </div>
              <h3>Disponibilidad</h3>
              <p>Los viajes de entrega se realizan principalmente los días martes. Consulta disponibilidad para coordinar la entrega de tu pedido.</p>
            </div>
          </div>
        </div>
      </section>


      <section id="contacto" className="contact-section">
        <div className="contact-container">
          <h2>Contáctanos</h2>
          <p>Estamos para ayudarte. Escríbenos y te responderemos a la brevedad.</p>

          <div className="contact-cards">
            <a href="https://wa.me/5493549597237" target="_blank" rel="noreferrer" className="contact-card whatsapp-card">
              <div className="contact-icon-wrapper">
                <MessageCircle size={32} color="#ffffff" strokeWidth={1.5} />
              </div>
              <div className="contact-info">
                <h3>WhatsApp</h3>
                <p>3549 59-7237</p>
              </div>
            </a>

            <a href="#" className="contact-card social-card">
              <div className="contact-icon-wrapper">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-montivero-dark)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </div>
              <div className="contact-info">
                <h3>Instagram</h3>
                <p>@Montivero</p>
              </div>
            </a>

            <a href="#" className="contact-card social-card">
              <div className="contact-icon-wrapper">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-montivero-dark)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </div>
              <div className="contact-info">
                <h3>Facebook</h3>
                <p>/Montivero</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>
              <X size={20} color="var(--color-montivero-dark)" strokeWidth={2} />
            </button>

            <div className="modal-body">
              <div className="modal-image-section">
                {selectedProduct.images?.length > 0 ? (
                  <div style={{ width: '100%' }}>
                    <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="modal-image" style={{ marginBottom: '1rem' }} />
                    {selectedProduct.images.length > 1 && (
                      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {selectedProduct.images.map((img, idx) => (
                          <img key={idx} src={img} alt="Miniatura" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: idx === 0 ? '2px solid var(--color-montivero-dark)' : '1px solid #eee' }} />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="modal-image" />
                )}
              </div>

              <div className="modal-info-section">
                <h2 className="modal-title">{selectedProduct.name}</h2>

                <div className="modal-badges">
                  {selectedProduct.condition && (
                    <div className="modal-badge">Estado: {selectedProduct.condition}</div>
                  )}
                  {selectedProduct.batteryHealth && (
                    <div className="modal-badge">Batería: {selectedProduct.batteryHealth}</div>
                  )}
                  {selectedProduct.sold && (
                    <div className="modal-badge" style={{ backgroundColor: 'rgba(217, 45, 32, 0.1)', color: '#d92d20', borderColor: 'transparent' }}>
                      VENDIDO
                    </div>
                  )}
                </div>

                {selectedProduct.specs ? (
                  <div className="modal-specs">
                    {selectedProduct.specs.pantalla && (
                      <div className="modal-spec-item">
                        <span className="modal-spec-label">Pantalla</span>
                        <span className="modal-spec-value">{selectedProduct.specs.pantalla}</span>
                      </div>
                    )}
                    {selectedProduct.specs.procesador && (
                      <div className="modal-spec-item">
                        <span className="modal-spec-label">Procesador</span>
                        <span className="modal-spec-value">{selectedProduct.specs.procesador}</span>
                      </div>
                    )}
                    {selectedProduct.specs.ram && (
                      <div className="modal-spec-item">
                        <span className="modal-spec-label">Memoria RAM</span>
                        <span className="modal-spec-value">{selectedProduct.specs.ram}</span>
                      </div>
                    )}
                    {selectedProduct.specs.almacenamiento && (
                      <div className="modal-spec-item">
                        <span className="modal-spec-label">Almacenamiento</span>
                        <span className="modal-spec-value">{selectedProduct.specs.almacenamiento}</span>
                      </div>
                    )}
                    {selectedProduct.specs.bateria && (
                      <div className="modal-spec-item">
                        <span className="modal-spec-label">Batería</span>
                        <span className="modal-spec-value">{selectedProduct.specs.bateria}</span>
                      </div>
                    )}
                    {selectedProduct.specs.camaraPrincipal && (
                      <div className="modal-spec-item">
                        <span className="modal-spec-label">Cámara Principal</span>
                        <span className="modal-spec-value">{selectedProduct.specs.camaraPrincipal}</span>
                      </div>
                    )}
                    {selectedProduct.specs.video && (
                      <div className="modal-spec-item">
                        <span className="modal-spec-label">Video</span>
                        <span className="modal-spec-value">{selectedProduct.specs.video}</span>
                      </div>
                    )}
                    {selectedProduct.specs.redes && (
                      <div className="modal-spec-item">
                        <span className="modal-spec-label">Redes</span>
                        <span className="modal-spec-value">{selectedProduct.specs.redes}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="modal-specs">
                    <p style={{ color: 'var(--text-secondary)' }}>{selectedProduct.desc}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
