import React, { useState, useEffect } from 'react';
import { Search, Apple, Smartphone, Shield, Maximize, BatteryCharging, PackageSearch, FileText, CalendarCheck, MessageCircle, Truck, MapPin, CalendarDays, X, Users, CreditCard, ShoppingBag, Palette, Sparkles, XCircle } from 'lucide-react';
import logoMM from './assets/logo-white-apple-removebg-preview.png';
import './index.css';
import AdminPanel from './AdminPanel';
import { supabase } from './supabase';
import { resolveAssetUrl } from './utils';



const categoryTitles = {
  iphones: 'Modelos de iPhone disponibles en Córdoba',
  fundas: 'Fundas premium para proteger tu dispositivo',
  vidrios: 'Vidrios templados de alta resistencia',
  cargadores: 'Cargadores y accesorios de carga'
};

const WhatsAppIcon = ({ size = 24, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

let logoClicks = 0;
let logoTimer = null;

function App() {
  const [dbData, setDbData] = useState({
    iphones: [],
    fundas: [],
    vidrios: [],
    cargadores: []
  });
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState('iphones');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [view, setView] = useState('store'); // 'store' or 'admin'
  const [showFloatingButton, setShowFloatingButton] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const isNearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300;
      setShowFloatingButton(!isNearBottom);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
      return;
    }

    const groupedData = {
      iphones: [],
      fundas: [],
      vidrios: [],
      cargadores: []
    };

    if (data && data.length > 0) {
      data.forEach(item => {
        const cat = item.category || 'iphones';
        if (!groupedData[cat]) groupedData[cat] = [];
        
        groupedData[cat].push({
          id: item.id,
          name: item.name,
          image: item.image,
          images: item.images || [],
          desc: item.description || '',
          condition: item.condition,
          batteryHealth: item.battery_health,
          price: item.price,
          isNew: item.is_new,
          sold: item.sold,
          colors: item.colors || [],
          specs: item.specs || {}
        });
      });
    }

    setDbData(groupedData);

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [view]); // Re-fetch when switching back from admin

  // Bloquear el scroll del fondo cuando el modal esté abierto
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Limpieza si el componente se desmonta mientras el modal está abierto
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProduct]);

  if (view === 'admin') {
    return <AdminPanel dbData={dbData} fetchProducts={fetchProducts} onExit={() => setView('store')} />;
  }

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        width: '100vw', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'var(--bg-color)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999
      }}>
        <img 
          src={logoMM} 
          alt="Cargando..." 
          style={{ 
            width: '120px', 
            animation: 'pulseGlow 1.5s infinite ease-in-out', 
            filter: 'brightness(0) invert(1)' 
          }} 
        />
        <div style={{ 
          marginTop: '2rem', 
          color: 'var(--text-secondary)', 
          fontSize: '0.9rem', 
          fontWeight: 600, 
          letterSpacing: '0.2em' 
        }}>
          CARGANDO
        </div>
      </div>
    );
  }

  const currentProducts = dbData[activeCategory] || [];

  const handleLogoClick = () => {
    logoClicks += 1;
    if (logoClicks >= 3) {
      setView('admin');
      logoClicks = 0;
      return;
    }
    if (logoTimer) clearTimeout(logoTimer);
    logoTimer = setTimeout(() => {
      logoClicks = 0;
    }, 1500);
  };

  return (
    <>
      <nav className="global-nav">
        <div className="nav-content">

          {/* Left: nav links */}
          <div className="nav-links">
            <span onClick={() => {
              const el = document.getElementById('productos');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>iPhones</span>
            <span onClick={() => {
              const el = document.getElementById('nosotros');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>Nosotros</span>
            <span onClick={() => {
              const el = document.getElementById('comprar');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>Cómo comprar</span>
            <span onClick={() => {
              const el = document.getElementById('envios');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>Envíos</span>
          </div>

          {/* Center: logo */}
          <div className="nav-logo">
            <img src={logoMM} alt="Logo M&G iPhones" className="nav-logo-img" onClick={handleLogoClick} />
          </div>

          {/* Right: actions */}
          <div className="nav-actions">
            <span onClick={() => {
              const el = document.getElementById('contacto');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>Contacto</span>
          </div>

        </div>
      </nav>

      <header className="page-header page-animate-in" style={{ animationDelay: '0.1s' }}>
        <h1 className="page-title">Actualizá tu mundo.</h1>
        <div className="page-subtitle">
          Encontrá el iPhone perfecto para vos. Equipos en estado impecable y accesorios premium en Cruz del Eje, Córdoba.
        </div>
      </header>

      <section id="productos" className="category-container page-animate-in" style={{ animationDelay: '0.2s' }}>
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

      <section className="products-section page-animate-in" style={{ animationDelay: '0.3s' }}>
        <div className="products-header">
          <h2>{categoryTitles[activeCategory]}</h2>
          <p>Explora nuestra selección de {activeCategory === 'iphones' ? 'dispositivos' : 'accesorios'} disponibles.</p>
        </div>

        <div className="products-grid" style={{ justifyContent: (currentProducts.length < 4) ? 'center' : 'space-between', gap: '3rem' }}>
          {currentProducts.map((product) => (
            <div className="product-card" key={product.id} style={{ flex: currentProducts.length < 4 ? '0 1 300px' : '1', '--card-color': (product.colors && product.colors.length > 0) ? product.colors[0] : 'var(--color-montivero-primary)' }} onClick={() => setSelectedProduct(product)}>
              <div className="product-image-wrapper">
                <img src={resolveAssetUrl(product.image)} alt={product.name} className="product-image" />
              </div>
              <div className="color-dots">
                {(product.colors || []).map((color, idx) => (
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
              {product.price ? (
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#A855F7', marginTop: '0.2rem' }}>
                  ${Number(product.price).toLocaleString('es-AR')}
                </div>
              ) : null}
              <div className="product-desc" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.5rem' }}>
                {(product.desc || '').split('\n').map((line, idx) => {
                  if (line.includes('Batería')) {
                    return (
                      <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <BatteryCharging size={14} color="#A855F7" /> {line}
                      </span>
                    );
                  }
                  if (line.includes('Color')) {
                    return (
                      <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Palette size={14} color="#A855F7" /> {line}
                      </span>
                    );
                  }
                  return (
                    <span key={idx} style={{ paddingLeft: '1.2rem' }}>
                      {line}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="nosotros" className="about-section page-animate-in" style={{ animationDelay: '0.4s' }}>
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

      <section id="comprar" className="how-to-buy-section page-animate-in" style={{ animationDelay: '0.5s' }}>
        <div className="how-to-buy-container">
          <h2>Cómo Comprar</h2>
          <p>Un proceso simple y seguro para adquirir tu próximo dispositivo o accesorio.</p>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <Smartphone size={32} color="var(--white)" strokeWidth={1.5} />
              </div>
              <h3>Elegí tu modelo</h3>
              <p>Explorá nuestro catálogo online y mira los modelos de iPhone o accesorios disponibles que más te gusten.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <MessageCircle size={32} color="var(--white)" strokeWidth={1.5} />
              </div>
              <h3>Contactanos</h3>
              <p>Escribinos por WhatsApp o redes sociales indicando qué equipo o accesorio te interesa adquirir.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <CalendarCheck size={32} color="var(--white)" strokeWidth={1.5} />
              </div>
              <h3>Coordinamos entrega</h3>
              <p>Acordamos una cita en un lugar público y seguro para que puedas ver y recibir tu producto personalmente.</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon">
                <CreditCard size={32} color="var(--white)" strokeWidth={1.5} />
              </div>
              <h3>Pago seguro</h3>
              <p>Una vez que verifiques el equipo en persona, realizas el pago mediante el método acordado previamente.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="envios" className="shipping-section page-animate-in" style={{ animationDelay: '0.6s' }}>
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


      <section id="contacto" className="contact-section page-animate-in" style={{ animationDelay: '0.7s' }}>
        <div className="contact-container">
          <h2>Contáctanos</h2>
          <p>Estamos para ayudarte. Escríbenos y te responderemos a la brevedad.</p>

          <div className="contact-cards">
            <a href="https://wa.me/5493549597237" target="_blank" rel="noreferrer" className="contact-card whatsapp-card">
              <div className="contact-icon-wrapper">
                <WhatsAppIcon size={32} color="#ffffff" />
              </div>
              <div className="contact-info">
                <h3>WhatsApp</h3>
                <p>3549 59-7237</p>
              </div>
            </a>

            <a href="https://www.instagram.com/mygiphone/" target="_blank" rel="noreferrer" className="contact-card social-card">
              <div className="contact-icon-wrapper">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-montivero-dark)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </div>
              <div className="contact-info">
                <h3>Instagram</h3>
                <p>@mygiphone</p>
              </div>
            </a>

            <div className="contact-card social-card" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
              <div className="contact-icon-wrapper">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-montivero-dark)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </div>
              <div className="contact-info">
                <h3>Facebook</h3>
                <p>M&GiPhone (Próximamente)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>
              <X size={20} color="var(--white)" strokeWidth={2} />
            </button>

            <div className="modal-body">
              <div className="modal-image-section">
                {selectedProduct.images?.length > 0 ? (
                  <div style={{ width: '100%' }}>
                    <img src={resolveAssetUrl(selectedProduct.images[0])} alt={selectedProduct.name} className="modal-image" style={{ marginBottom: '1rem' }} />
                    {selectedProduct.images.length > 1 && (
                      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {selectedProduct.images.map((img, idx) => (
                          <img key={idx} src={resolveAssetUrl(img)} alt="Miniatura" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: idx === 0 ? '2px solid var(--color-montivero-dark)' : '1px solid #eee' }} />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <img src={resolveAssetUrl(selectedProduct.image)} alt={selectedProduct.name} className="modal-image" />
                )}
              </div>

              <div className="modal-info-section">
                <h2 className="modal-title">{selectedProduct.name}</h2>

                {selectedProduct.price ? (
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#A855F7', marginBottom: '1rem', marginTop: '-0.5rem' }}>
                    ${Number(selectedProduct.price).toLocaleString('es-AR')}
                  </div>
                ) : null}

                <div className="modal-badges" style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {selectedProduct.condition && (
                    <div className="modal-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={14} color="#A855F7" /> Estado: {selectedProduct.condition}
                    </div>
                  )}
                  {selectedProduct.batteryHealth && (
                    <div className="modal-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <BatteryCharging size={14} color="#A855F7" /> {selectedProduct.batteryHealth}
                    </div>
                  )}
                  {selectedProduct.sold && (
                    <div className="modal-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(217, 45, 32, 0.1)', color: '#d92d20', borderColor: 'transparent' }}>
                      <XCircle size={14} /> VENDIDO
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

                <a 
                  href={`https://wa.me/5493549597237?text=Hola!%20Vengo%20de%20la%20página%20web.%20Me%20interesa%20el%20*${encodeURIComponent(selectedProduct.name)}*.%0A%0A*Detalles:*%0A-%20Condición:%20${encodeURIComponent(selectedProduct.condition || 'No especificada')}%0A-%20Batería:%20${encodeURIComponent(selectedProduct.batteryHealth || 'No especificada')}%0A%0A¿Sigue%20disponible?`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.8rem',
                    background: '#25D366',
                    color: '#fff',
                    padding: '1rem',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    marginTop: '2rem',
                    marginBottom: '1.5rem',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.05rem',
                    boxShadow: '0 4px 15px rgba(37,211,102,0.25)',
                    transition: 'transform 0.2s ease, opacity 0.2s ease'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <WhatsAppIcon size={24} color="#ffffff" />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      {view === 'store' && (
        <a 
          href="https://wa.me/5493549597237"
          target="_blank"
          rel="noreferrer"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '60px',
            height: '60px',
            backgroundColor: '#25D366',
            color: '#ffffff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(37,211,102,0.4)',
            zIndex: 900,
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: showFloatingButton ? 'scale(1) translateY(0)' : 'scale(0) translateY(20px)',
            opacity: showFloatingButton ? 1 : 0,
            pointerEvents: showFloatingButton ? 'auto' : 'none'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = showFloatingButton ? 'scale(1) translateY(0)' : 'scale(0) translateY(20px)'; }}
        >
          <WhatsAppIcon size={32} color="#ffffff" />
        </a>
      )}
    </>
  );
}

export default App;
