import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, ImagePlus, Lock, Eye, EyeOff, Package, Smartphone, Shield, Zap, Maximize, CheckCircle, AlertCircle, Database, Calculator, Table as TableIcon, TrendingUp, ExternalLink } from 'lucide-react';
import logoMM from './assets/logo-white-apple-removebg-preview.png';
import { supabase } from './supabase';



const defaultIphoneSpecs = {
  pantalla: '', procesador: '', ram: '', almacenamiento: '',
  bateria: '', camaraPrincipal: '', video: '', redes: ''
};

const IPHONE_CATALOG = {
  "iPhone 11": {
    specs: { pantalla: 'Liquid Retina HD LCD de 6.1"\nResolución de 1792 x 828', procesador: 'Chip A13 Bionic', ram: '4 GB', camaraPrincipal: 'Gran angular: 12 MP con apertura de ƒ/1.8\nUltra gran angular: 12 MP con apertura de ƒ/2.4', video: 'Grabación de video 4K a 60 cps', redes: '4G LTE' },
    almacenamientoOpciones: ['64 GB', '128 GB', '256 GB'], bateriaOpciones: ['3110 mAh (Li-Ion)'],
    colors: ['#000000', '#ffffff', '#ff0000', '#ffe680', '#e6e6fa', '#98fb98']
  },
  "iPhone 12": {
    specs: { pantalla: 'Super Retina XDR OLED de 6.1"\nResolución de 2532 x 1170', procesador: 'Chip A14 Bionic', ram: '4 GB', camaraPrincipal: 'Gran angular: 12 MP con apertura de ƒ/1.6\nUltra gran angular: 12 MP con apertura de ƒ/2.4', video: '4K HDR con Dolby Vision', redes: '5G' },
    almacenamientoOpciones: ['64 GB', '128 GB', '256 GB'], bateriaOpciones: ['2815 mAh (Li-Ion)'],
    colors: ['#000000', '#ffffff', '#ff0000', '#e6e6fa', '#0000ff', '#98fb98']
  },
  "iPhone 13": {
    specs: { pantalla: 'Super Retina XDR OLED de 6.1"\nResolución de 2532 x 1170', procesador: 'Chip A15 Bionic', ram: '4 GB', camaraPrincipal: 'Gran angular: 12 MP con apertura de ƒ/1.6\nUltra gran angular: 12 MP con apertura de ƒ/2.4', video: 'Modo Cine, 4K HDR', redes: '5G' },
    almacenamientoOpciones: ['128 GB', '256 GB', '512 GB'], bateriaOpciones: ['3227 mAh (Li-Ion)'],
    colors: ['#333333', '#f5f5f7', '#ff3b30', '#255c99', '#f2dcdb', '#1a3622']
  },
  "iPhone 13 Pro": {
    specs: { pantalla: 'Super Retina XDR OLED de 6.1" ProMotion 120Hz\nResolución de 2532 x 1170', procesador: 'Chip A15 Bionic', ram: '6 GB', camaraPrincipal: 'Gran angular: 12 MP con apertura de ƒ/1.5\nUltra gran angular: 12 MP con apertura de ƒ/1.8\nTeleobjetivo 3x: 12 MP con apertura de ƒ/2.8', video: 'ProRes 4K, Modo Cine', redes: '5G' },
    almacenamientoOpciones: ['128 GB', '256 GB', '512 GB', '1 TB'], bateriaOpciones: ['3095 mAh (Li-Ion)'],
    colors: ['#4b4b4b', '#f0f0f0', '#ebd8c0', '#a7c1d9', '#536d5c']
  },
  "iPhone 13 Pro Max": {
    specs: { pantalla: 'Super Retina XDR OLED de 6.7" ProMotion 120Hz\nResolución de 2778 x 1284', procesador: 'Chip A15 Bionic', ram: '6 GB', camaraPrincipal: 'Gran angular: 12 MP con apertura de ƒ/1.5\nUltra gran angular: 12 MP con apertura de ƒ/1.8\nTeleobjetivo 3x: 12 MP con apertura de ƒ/2.8', video: 'ProRes 4K, Modo Cine', redes: '5G' },
    almacenamientoOpciones: ['128 GB', '256 GB', '512 GB', '1 TB'], bateriaOpciones: ['4352 mAh (Li-Ion)'],
    colors: ['#4b4b4b', '#f0f0f0', '#ebd8c0', '#a7c1d9', '#536d5c']
  },
  "iPhone 14": {
    specs: { pantalla: 'Super Retina XDR OLED de 6.1"\nResolución de 2532 x 1170', procesador: 'Chip A15 Bionic', ram: '6 GB', camaraPrincipal: 'Gran angular: 12 MP con apertura de ƒ/1.5\nUltra gran angular: 12 MP con apertura de ƒ/2.4', video: 'Modo Acción, Modo Cine', redes: '5G' },
    almacenamientoOpciones: ['128 GB', '256 GB', '512 GB'], bateriaOpciones: ['3279 mAh (Li-Ion)'],
    colors: ['#333333', '#f5f5f7', '#ff3b30', '#a0b4c7', '#e2d3e1', '#f9e547']
  },
  "iPhone 14 Pro": {
    specs: { pantalla: 'Super Retina XDR OLED 6.1" ProMotion 120Hz (Dynamic Island)\nResolución de 2556 x 1179', procesador: 'Chip A16 Bionic', ram: '6 GB', camaraPrincipal: 'Principal: 48 MP con apertura de ƒ/1.78\nUltra gran angular: 12 MP con apertura de ƒ/2.2\nTeleobjetivo 3x: 12 MP con apertura de ƒ/2.8', video: 'ProRes 4K, Modo Cine', redes: '5G' },
    almacenamientoOpciones: ['128 GB', '256 GB', '512 GB', '1 TB'], bateriaOpciones: ['3200 mAh (Li-Ion)'],
    colors: ['#4b4b4b', '#f0f0f0', '#ebd8c0', '#594f63']
  },
  "iPhone 14 Pro Max": {
    specs: { pantalla: 'Super Retina XDR OLED 6.7" ProMotion 120Hz (Dynamic Island)\nResolución de 2796 x 1290', procesador: 'Chip A16 Bionic', ram: '6 GB', camaraPrincipal: 'Principal: 48 MP con apertura de ƒ/1.78\nUltra gran angular: 12 MP con apertura de ƒ/2.2\nTeleobjetivo 3x: 12 MP con apertura de ƒ/2.8', video: 'ProRes 4K, Modo Cine', redes: '5G' },
    almacenamientoOpciones: ['128 GB', '256 GB', '512 GB', '1 TB'], bateriaOpciones: ['4323 mAh (Li-Ion)'],
    colors: ['#4b4b4b', '#f0f0f0', '#ebd8c0', '#594f63']
  },
  "iPhone 15": {
    specs: { pantalla: 'Super Retina XDR OLED 6.1" (Dynamic Island)\nResolución de 2556 x 1179', procesador: 'Chip A16 Bionic', ram: '6 GB', camaraPrincipal: 'Principal: 48 MP con apertura de ƒ/1.6\nUltra gran angular: 12 MP con apertura de ƒ/2.4', video: 'Modo Cine 4K, Acción', redes: '5G, USB-C' },
    almacenamientoOpciones: ['128 GB', '256 GB', '512 GB'], bateriaOpciones: ['3349 mAh (Li-Ion)'],
    colors: ['#333333', '#e2ebf3', '#cfd9d0', '#fcebbd', '#f0cece']
  },
  "iPhone 15 Pro": {
    specs: { pantalla: 'Super Retina XDR OLED 6.1" ProMotion 120Hz (Dynamic Island)\nResolución de 2556 x 1179', procesador: 'Chip A17 Pro', ram: '8 GB', camaraPrincipal: 'Principal: 48 MP con apertura de ƒ/1.78\nUltra gran angular: 12 MP con apertura de ƒ/2.2\nTeleobjetivo 3x: 12 MP con apertura de ƒ/2.8', video: 'Video Espacial, ProRes 4K', redes: '5G, USB-C, Wi-Fi 6E' },
    almacenamientoOpciones: ['128 GB', '256 GB', '512 GB', '1 TB'], bateriaOpciones: ['3274 mAh (Li-Ion)'],
    colors: ['#3b3a38', '#f0f0f0', '#4a4e5c', '#8c8c8c']
  },
  "iPhone 15 Pro Max": {
    specs: { pantalla: 'Super Retina XDR OLED 6.7" ProMotion 120Hz (Dynamic Island)\nResolución de 2796 x 1290', procesador: 'Chip A17 Pro', ram: '8 GB', camaraPrincipal: 'Principal: 48 MP con apertura de ƒ/1.78\nUltra gran angular: 12 MP con apertura de ƒ/2.2\nTeleobjetivo 5x: 12 MP con apertura de ƒ/2.8', video: 'Video Espacial, ProRes 4K', redes: '5G, USB-C, Wi-Fi 6E' },
    almacenamientoOpciones: ['256 GB', '512 GB', '1 TB'], bateriaOpciones: ['4422 mAh (Li-Ion)'],
    colors: ['#3b3a38', '#f0f0f0', '#4a4e5c', '#8c8c8c']
  },
  "iPhone 16 Pro": {
    specs: { pantalla: 'Super Retina XDR OLED 6.3" ProMotion 120Hz\nResolución mejorada', procesador: 'Chip A18 Pro', ram: '8 GB', camaraPrincipal: 'Fusion: 48 MP\nUltra gran angular: 48 MP\nTeleobjetivo 5x: 12 MP', video: 'Spatial Video, 4K Dolby Vision', redes: '5G, Wi-Fi 7' },
    almacenamientoOpciones: ['128 GB', '256 GB', '512 GB', '1 TB'], bateriaOpciones: ['3582 mAh (Li-Ion)'],
    colors: ['#3b3a38', '#f0f0f0', '#8c8c8c', '#cba88c']
  }
};

const SPEC_LABELS = {
  pantalla: 'Pantalla', procesador: 'Procesador', ram: 'Memoria RAM',
  almacenamiento: 'Almacenamiento (GB)', bateria: 'Batería',
  camaraPrincipal: 'Cámara Principal', video: 'Video', redes: 'Conectividad'
};

const CATEGORY_ICONS = {
  iphones: Smartphone, fundas: Shield, vidrios: Maximize, cargadores: Zap
};

const CATEGORY_LABELS = {
  iphones: 'iPhones', fundas: 'Fundas', vidrios: 'Vidrios', cargadores: 'Cargadores'
};

const emptyProduct = () => ({
  id: `prod-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  name: '', image: '', images: [], desc: '',
  condition: 'Usado', batteryHealth: '', price: '',
  isNew: false, sold: false, colors: [], specs: { ...defaultIphoneSpecs }
});

// ── Toast Notification ───────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
      background: type === 'success' ? 'rgba(168, 85, 247,0.15)' : 'rgba(255,69,58,0.15)',
      border: `1px solid ${type === 'success' ? 'rgba(168, 85, 247,0.4)' : 'rgba(255,69,58,0.4)'}`,
      backdropFilter: 'blur(16px)', borderRadius: '16px',
      padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem',
      color: '#fff', fontFamily: 'Inter, sans-serif', minWidth: '280px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      animation: 'slideInToast 0.3s cubic-bezier(0.175,0.885,0.32,1.275)'
    }}>
      {type === 'success'
        ? <CheckCircle size={20} color="#A855F7" />
        : <AlertCircle size={20} color="#ff453a" />}
      <span style={{ fontWeight: 500 }}>{message}</span>
      <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0 }}>
        <X size={16} />
      </button>
    </div>
  );
}

// ── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onExit }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: pass
    });

    setLoading(false);

    if (error) {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setTimeout(() => setError(false), 3000);
    } else {
      onLogin();
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#050505', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(168, 85, 247,0.06) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: '400px', padding: '3rem',
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '32px', backdropFilter: 'blur(20px)', textAlign: 'center',
        transform: shake ? 'translateX(-8px)' : 'none',
        transition: shake ? 'none' : 'transform 0.1s',
        animation: shake ? 'shake 0.5s ease' : 'none'
      }}>
        <img
          src={logoMM}
          alt="M&G iPhones"
          style={{ height: '60px', marginBottom: '2rem', filter: 'brightness(0) invert(1)' }}
        />

        <div style={{ width: '64px', height: '64px', background: 'rgba(168, 85, 247,0.1)', border: '1px solid rgba(168, 85, 247,0.2)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Lock size={28} color="#A855F7" />
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>Panel Admin</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 2.5rem', fontSize: '0.95rem' }}>Ingresá la contraseña para continuar</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              required
              style={{
                width: '100%', padding: '1rem 1.2rem',
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${error ? 'rgba(255,69,58,0.5)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '14px', color: '#fff', fontSize: '1rem',
                outline: 'none', fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box', transition: 'border-color 0.3s'
              }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Contraseña"
              value={pass}
              onChange={e => setPass(e.target.value)}
              required
              style={{
                width: '100%', padding: '1rem 3rem 1rem 1.2rem',
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${error ? 'rgba(255,69,58,0.5)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '14px', color: '#fff', fontSize: '1rem',
                outline: 'none', fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box', transition: 'border-color 0.3s'
              }}
            />
            <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0, display: 'flex' }}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p style={{ margin: 0, color: '#ff453a', fontSize: '0.9rem', fontWeight: 500, background: 'rgba(255,69,58,0.1)', padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,69,58,0.2)' }}>
              Contraseña incorrecta. Intentá de nuevo.
            </p>
          )}

          <button type="submit" disabled={loading} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            background: '#A855F7', color: '#000', border: 'none',
            padding: '1rem', borderRadius: '14px', fontSize: '1rem', fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.02em', opacity: loading ? 0.7 : 1,
            boxShadow: '0 0 20px rgba(168, 85, 247,0.25)', transition: 'all 0.3s ease'
          }}>
            <Lock size={18} /> {loading ? 'Iniciando...' : 'Entrar al Panel'}
          </button>
        </form>

        <button onClick={onExit} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', marginTop: '2rem', fontSize: '0.9rem', textDecoration: 'underline', fontFamily: 'Inter, sans-serif', transition: 'color 0.2s' }}>
          ← Volver a la tienda
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        @keyframes slideInToast {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// ── Product Form ─────────────────────────────────────────────────────────────
function ProductForm({ product, activeCategory, onSave, onCancel }) {
  const [form, setForm] = useState(product);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const fileRef = useRef();

  const currentImages = form.images?.length > 0 ? form.images : (form.image ? [form.image] : []);

  const handleTemplateSelect = (e) => {
    const modelName = e.target.value;
    setSelectedTemplate(modelName);
    if (!modelName) return;

    const template = IPHONE_CATALOG[modelName];
    setForm(p => ({
      ...p,
      name: p.name || modelName,
      specs: { ...defaultIphoneSpecs, ...template.specs, bateria: p.specs?.bateria || '', almacenamiento: p.specs?.almacenamiento || '' },
      colors: [] // clear colors so they can pick one
    }));
  };

  const toggleColor = (color) => {
    setForm(p => {
      const current = p.colors || [];
      if (current.includes(color)) return { ...p, colors: current.filter(c => c !== color) };
      return { ...p, colors: [...current, color] };
    });
  };

  const set = (field, value) => setForm(p => ({ ...p, [field]: value }));
  const setSpec = (key, value) => setForm(p => ({ ...p, specs: { ...p.specs, [key]: value } }));

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (currentImages.length + files.length > 10) {
      alert('Máximo 10 fotos por producto.');
      return;
    }
    let updated = [...currentImages];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        updated = [...updated, reader.result];
        set('images', updated);
        set('image', updated[0]);
        setForm(p => ({ ...p, images: updated, image: updated[0] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    const imgs = [...currentImages];
    imgs.splice(idx, 1);
    setForm(p => ({ ...p, images: imgs, image: imgs[0] || '' }));
  };

  const handleDragStart = (e, idx) => e.dataTransfer.setData('imgIdx', idx);
  const handleDrop = (e, targetIdx) => {
    const srcIdx = Number(e.dataTransfer.getData('imgIdx'));
    if (srcIdx === targetIdx) return;
    const imgs = [...currentImages];
    const [moved] = imgs.splice(srcIdx, 1);
    imgs.splice(targetIdx, 0, moved);
    setForm(p => ({ ...p, images: imgs, image: imgs[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const inputStyle = {
    width: '100%', padding: '0.85rem 1rem',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', color: '#fff', fontSize: '0.95rem',
    outline: 'none', fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box', transition: 'all 0.2s'
  };
  const labelStyle = { display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>

      {/* Template Selector for iPhones */}
      {activeCategory === 'iphones' && (
        <div style={{ background: 'rgba(168, 85, 247,0.08)', border: '1px solid rgba(168, 85, 247,0.2)', padding: '1.2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A855F7', fontWeight: 800 }}>
            <Zap size={18} /> Rellenar datos automáticamente
          </div>
          <select style={{ ...inputStyle, background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(168, 85, 247,0.4)', color: '#fff', cursor: 'pointer' }} value={selectedTemplate} onChange={handleTemplateSelect}>
            <option value="">-- Seleccionar modelo base --</option>
            {Object.keys(IPHONE_CATALOG).map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
      )}

      {/* Image uploader */}
      <div>
        <label style={labelStyle}>Fotos del producto · {currentImages.length}/10</label>
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          {currentImages.map((img, idx) => (
            <div
              key={idx} draggable
              onDragStart={e => handleDragStart(e, idx)}
              onDrop={e => handleDrop(e, idx)}
              onDragOver={e => e.preventDefault()}
              style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '10px', overflow: 'hidden', cursor: 'grab', border: idx === 0 ? '2px solid #A855F7' : '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}
            >
              <img src={img} alt={`Foto ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: 3, right: 3, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                <X size={12} />
              </button>
              {idx === 0 && <span style={{ position: 'absolute', bottom: 3, left: 3, background: '#A855F7', color: '#000', fontSize: '0.6rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>PORTADA</span>}
            </div>
          ))}

          {currentImages.length < 10 && (
            <label style={{ width: currentImages.length === 0 ? '100%' : '90px', height: currentImages.length === 0 ? '140px' : '90px', border: '1px dashed rgba(168, 85, 247,0.3)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '0.4rem', background: 'rgba(168, 85, 247,0.03)', transition: 'background 0.2s', flexShrink: 0 }}>
              <ImagePlus size={22} color="#A855F7" />
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 1.3 }}>{currentImages.length === 0 ? 'Agregar fotos' : 'Más'}</span>
              <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          )}
        </div>
      </div>

      {/* Basic info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Nombre del producto</label>
          <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ej: iPhone 15 Pro 128GB" />
        </div>

        <div>
          <label style={labelStyle}>Precio (ARS)</label>
          <input style={inputStyle} value={form.price || ''} onChange={e => set('price', e.target.value)} placeholder="Ej: 1200000" type="number" />
        </div>

        <div>
          <label style={labelStyle}>Estado</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }}
            value={form.condition}
            onChange={e => { set('condition', e.target.value); set('isNew', e.target.value === 'Sellado'); }}>
            <option value="Usado">Usado</option>
            <option value="Sellado">Sellado</option>
          </select>
        </div>

        {form.condition !== 'Sellado' && (
          <div>
            <label style={labelStyle}>Salud de batería</label>
            <input style={inputStyle} value={form.batteryHealth} onChange={e => set('batteryHealth', e.target.value)} placeholder="Ej: 88% de vida útil" />
          </div>
        )}

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Colores disponibles en esta unidad</label>
          {selectedTemplate && IPHONE_CATALOG[selectedTemplate] ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
              {IPHONE_CATALOG[selectedTemplate].colors.map(color => {
                const isSelected = (form.colors || []).includes(color);
                return (
                  <button
                    key={color} type="button" onClick={() => toggleColor(color)}
                    style={{
                      width: '40px', height: '40px', borderRadius: '50%', backgroundColor: color, cursor: 'pointer',
                      border: isSelected ? '3px solid #A855F7' : '2px solid rgba(255,255,255,0.2)',
                      boxShadow: isSelected ? '0 0 15px rgba(168, 85, 247,0.6)' : 'none',
                      transform: isSelected ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.2s', position: 'relative'
                    }}
                  >
                    {isSelected && <CheckCircle size={16} color="#A855F7" style={{ position: 'absolute', bottom: -8, right: -8, background: '#000', borderRadius: '50%' }} />}
                  </button>
                );
              })}
            </div>
          ) : (
            <input style={inputStyle} value={form.colors?.join(', ') || ''} onChange={e => set('colors', e.target.value.split(',').map(c => c.trim()).filter(Boolean))} placeholder="#ffffff, #ff3b30" />
          )}
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Descripción corta</label>
          <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Breve descripción del producto..." />
        </div>
      </div>

      {/* iPhone specs */}
      {activeCategory === 'iphones' && (
        <div style={{ background: 'rgba(168, 85, 247,0.03)', border: '1px solid rgba(168, 85, 247,0.1)', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.5rem', color: '#A855F7', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>⚙️ Especificaciones Técnicas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            {Object.keys(defaultIphoneSpecs).map(key => {
              const template = selectedTemplate ? IPHONE_CATALOG[selectedTemplate] : null;
              return (
                <div key={key} style={key === 'camaraPrincipal' || key === 'pantalla' ? { gridColumn: '1 / -1' } : {}}>
                  <label style={labelStyle}>{SPEC_LABELS[key] || key}</label>
                  {key === 'almacenamiento' && template?.almacenamientoOpciones ? (
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.specs?.[key] || ''} onChange={e => setSpec(key, e.target.value)}>
                      <option value="">Seleccionar...</option>
                      {template.almacenamientoOpciones.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : key === 'bateria' && template?.bateriaOpciones ? (
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.specs?.[key] || ''} onChange={e => setSpec(key, e.target.value)}>
                      <option value="">Seleccionar...</option>
                      {template.bateriaOpciones.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : key === 'camaraPrincipal' || key === 'pantalla' ? (
                    <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', lineHeight: '1.4' }} value={form.specs?.[key] || ''} onChange={e => setSpec(key, e.target.value)} placeholder={`Ingresá ${SPEC_LABELS[key]?.toLowerCase()}`} />
                  ) : key === 'almacenamiento' ? (
                    <input style={inputStyle} value={form.specs?.[key] || ''} onChange={e => setSpec(key, e.target.value)} placeholder="Ej: 128 GB" />
                  ) : (
                    <input style={inputStyle} value={form.specs?.[key] || ''} onChange={e => setSpec(key, e.target.value)} placeholder={`Ingresá ${SPEC_LABELS[key]?.toLowerCase()}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sold toggle */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1rem 1.2rem', background: form.sold ? 'rgba(255,69,58,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${form.sold ? 'rgba(255,69,58,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '14px', transition: 'all 0.3s' }}>
        <div style={{ width: '44px', height: '24px', background: form.sold ? '#ff453a' : 'rgba(255,255,255,0.15)', borderRadius: '100px', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: '3px', left: form.sold ? '23px' : '3px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
          <input type="checkbox" checked={form.sold} onChange={e => set('sold', e.target.checked)} style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', margin: 0 }} />
        </div>
        <div>
          <div style={{ color: form.sold ? '#ff453a' : 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '0.95rem' }}>Marcar como VENDIDO</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>El producto aparecerá con la etiqueta "Vendido" en la tienda</div>
        </div>
      </label>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} style={{ padding: '0.9rem 1.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.95rem' }}>
          Cancelar
        </button>
        <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.9rem 2rem', borderRadius: '12px', border: 'none', background: '#A855F7', color: '#000', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1rem', boxShadow: '0 0 20px rgba(168, 85, 247,0.3)' }}>
          <Save size={18} /> Guardar Producto
        </button>
      </div>
    </form>
  );
}

// ── Trade-In Calculator ──────────────────────────────────────────────────────
const TRADE_IN_DATA = [
  { model: 'iPhone 11', buy: 110, sell: 175 },
  { model: 'iPhone 12', buy: 200, sell: 260 },
  { model: 'iPhone 13', buy: 310, sell: 380 },
  { model: 'iPhone 13 Pro', buy: 390, sell: 480 },
  { model: 'iPhone 13 Pro Max', buy: 450, sell: 530 },
  { model: 'iPhone 14', buy: 335, sell: 414 },
  { model: 'iPhone 14 Plus', buy: 310, sell: 400 },
  { model: 'iPhone 14 Pro', buy: 410, sell: 500 },
  { model: 'iPhone 15', buy: 450, sell: 520 },
  { model: 'iPhone 15 Pro', buy: 530, sell: 560 },
  { model: 'iPhone 16', buy: 620, sell: 700 },
  { model: 'iPhone 16 Pro', buy: 730, sell: 830 },
  { model: 'iPhone 17', buy: 820, sell: 900 },
  { model: 'iPhone 17 Pro', buy: 1235, sell: 1350 },
  { model: 'iPhone 17 Pro Max', buy: 1430, sell: 1550 },
];

const TRADE_IN_MARGIN = 20; // Seguro de margen (USD) sobre precio mayorista

function TradeInCalculator() {
  const [takeModel, setTakeModel] = useState('');
  const [takePrice, setTakePrice] = useState('');

  const [giveModel, setGiveModel] = useState('');
  const [givePrice, setGivePrice] = useState('');

  const [dollarPrice, setDollarPrice] = useState('');
  const [loadingDollar, setLoadingDollar] = useState(false);

  useEffect(() => {
    const fetchDollar = async () => {
      setLoadingDollar(true);
      try {
        const res = await fetch('https://dolarapi.com/v1/dolares/blue');
        const data = await res.json();
        if (data && data.venta) {
          setDollarPrice(Math.round(data.venta + 10).toString());
        }
      } catch (err) {
        console.error("Error fetching dollar:", err);
      } finally {
        setLoadingDollar(false);
      }
    };
    fetchDollar();
  }, []);

  const handleTakeChange = (e) => {
    const val = e.target.value;
    setTakeModel(val);
    const item = TRADE_IN_DATA.find(x => x.model === val);
    if (item) setTakePrice(item.sell.toString());
  };

  const handleGiveChange = (e) => {
    const val = e.target.value;
    setGiveModel(val);
    const item = TRADE_IN_DATA.find(x => x.model === val);
    if (item) {
      // Aplicamos el descuento de "seguro" sobre el precio de mayorista
      setGivePrice((item.buy - TRADE_IN_MARGIN).toString());
    }
  };

  const diff = (Number(takePrice) || 0) - (Number(givePrice) || 0);
  const diffArs = diff * (Number(dollarPrice) || 0);

  const inputStyle = {
    width: '100%', padding: '0.85rem 1rem',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', color: '#fff', fontSize: '0.95rem',
    outline: 'none', fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box', transition: 'all 0.2s'
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '3rem 2rem', maxWidth: '800px', margin: '0 auto', animation: 'slideInToast 0.4s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(168, 85, 247,0.1)', border: '1px solid rgba(168, 85, 247,0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calculator size={24} color="#A855F7" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.03em' }}>Calculadora de Canjes</h2>
        </div>

        {/* Cotización Dólar */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Cotización Dólar (CBA)</div>
            <div style={{ fontSize: '0.8rem', color: '#A855F7', fontWeight: 600 }}>{loadingDollar ? 'Cargando...' : 'Blue Actualizado'}</div>
          </div>
          <div style={{ position: 'relative', width: '100px' }}>
            <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontWeight: 800, fontSize: '0.9rem' }}>$</span>
            <input
              type="number"
              value={dollarPrice}
              onChange={e => setDollarPrice(e.target.value)}
              style={{ ...inputStyle, padding: '0.5rem 0.5rem 0.5rem 1.8rem', fontSize: '1rem', fontWeight: 800, color: '#fff', textAlign: 'center' }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Se lleva */}
        <div style={{ background: 'rgba(168, 85, 247,0.05)', border: '1px solid rgba(168, 85, 247,0.2)', padding: '1.5rem', borderRadius: '16px' }}>
          <h3 style={{ color: '#A855F7', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#A855F7', color: '#000', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.8rem' }}>1</span>
            El cliente SE LLEVA
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontWeight: 600 }}>Modelo (Precio Venta)</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={takeModel} onChange={handleTakeChange}>
                <option value="">-- Seleccionar equipo --</option>
                {TRADE_IN_DATA.map(x => <option key={`take-${x.model}`} value={x.model}>{x.model}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontWeight: 600 }}>Valor de venta (USD)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>$</span>
                <input type="number" style={{ ...inputStyle, paddingLeft: '2.5rem', color: '#A855F7', fontWeight: 800, fontSize: '1.1rem' }} value={takePrice} onChange={e => setTakePrice(e.target.value)} placeholder="0" />
              </div>
            </div>
          </div>
        </div>

        {/* Entrega */}
        <div style={{ background: 'rgba(255, 69, 58, 0.05)', border: '1px solid rgba(255, 69, 58, 0.2)', padding: '1.5rem', borderRadius: '16px' }}>
          <h3 style={{ color: '#ff453a', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#ff453a', color: '#fff', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.8rem' }}>2</span>
            El cliente ENTREGA
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontWeight: 600 }}>Modelo (Referencia Mayorista)</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={giveModel} onChange={handleGiveChange}>
                <option value="">-- Seleccionar equipo --</option>
                {TRADE_IN_DATA.map(x => <option key={`give-${x.model}`} value={x.model}>{x.model} (${x.buy} USD)</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontWeight: 600 }}>Valor de toma (Mayorista - ${TRADE_IN_MARGIN} USD)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>$</span>
                <input type="number" style={{ ...inputStyle, paddingLeft: '2.5rem', color: '#ff453a', fontWeight: 800, fontSize: '1.1rem' }} value={givePrice} onChange={e => setGivePrice(e.target.value)} placeholder="0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2.5rem 2rem', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
        {diff > 0 && <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(168, 85, 247,0.15) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />}

        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>Diferencia a cobrar</div>
        <div style={{ fontSize: '4.5rem', fontWeight: 900, color: diff > 0 ? '#A855F7' : (diff === 0 ? '#fff' : '#ff453a'), letterSpacing: '-0.04em', position: 'relative', zIndex: 1, lineHeight: 1 }}>
          {diff > 0 ? '+' : ''}{diff} <span style={{ fontSize: '2rem', fontWeight: 700, opacity: 0.8 }}>USD</span>
        </div>

        {diff !== 0 && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '0.8rem', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>En pesos:</span>
            <span style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
              $ {Math.round(diffArs).toLocaleString('es-AR')}
            </span>
          </div>
        )}

        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)', marginTop: '1.5rem', fontWeight: 500, position: 'relative', zIndex: 1 }}>
          Cálculo: ( {takePrice || 0} USD - {givePrice || 0} USD ) × ${dollarPrice || 0}
        </div>
      </div>
    </div>
  );
}


// ── Finances View (Excel Style) ──────────────────────────────────────────────
function FinancesView({ products, dollarPrice }) {
  const iphones = products.filter(p => !p.sold);
  
  const rows = iphones.map(p => {
    // Try to find matching catalog data for cost
    // We try to find the model name in the product name
    const catalogItem = TRADE_IN_DATA.find(item => p.name.toLowerCase().includes(item.model.toLowerCase()));
    
    const cost = catalogItem ? catalogItem.buy : 0;
    const sellArs = Number(p.price) || 0;
    const sellUsd = dollarPrice > 0 ? Math.round(sellArs / dollarPrice) : 0;
    
    // If we have a sell price in USD from the user's prompt examples, we might prefer it, 
    // but here we use the stored ARS price converted to USD.
    
    const profitUsd = sellUsd - cost;
    const profitMargin = cost > 0 ? ((profitUsd / cost) * 100).toFixed(1) : 0;

    return {
      ...p,
      cost,
      sellUsd,
      profitUsd,
      profitMargin
    };
  });

  const totalCost = rows.reduce((acc, r) => acc + r.cost, 0);
  const totalSell = rows.reduce((acc, r) => acc + r.sellUsd, 0);
  const totalProfit = rows.reduce((acc, r) => acc + r.profitUsd, 0);

  const thStyle = {
    padding: '1rem',
    textAlign: 'left',
    fontSize: '0.85rem',
    fontWeight: 800,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  };

  const tdStyle = {
    padding: '1rem',
    fontSize: '0.95rem',
    color: '#fff',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    fontWeight: 500
  };

  return (
    <div style={{ animation: 'slideInToast 0.4s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{ width: '48px', height: '48px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TableIcon size={24} color="#22c55e" />
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.03em' }}>Balance de Inventario</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>Cálculos aproximados basados en precio mayorista y cotización de hoy</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem', borderRadius: '20px' }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Inversión Total</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>{totalCost} <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.3)' }}>USD</span></div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem', borderRadius: '20px' }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Venta Proyectada</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>{totalSell} <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.3)' }}>USD</span></div>
        </div>
        <div style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '1.5rem', borderRadius: '20px' }}>
          <div style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Ganancia Neta</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#22c55e' }}>+{totalProfit} <span style={{ fontSize: '1rem', opacity: 0.6 }}>USD</span></div>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Producto</th>
                <th style={thStyle}>Detalle</th>
                <th style={thStyle}>Costo (USD)</th>
                <th style={thStyle}>Venta (USD)</th>
                <th style={thStyle}>Ganancia</th>
                <th style={thStyle}>% Margen</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} style={{ background: r.profitUsd < 0 ? 'rgba(255,69,58,0.05)' : (i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)') }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 700 }}>{r.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{r.condition}</div>
                  </td>
                  <td style={tdStyle}>
                    {r.batteryHealth ? <span style={{ color: 'rgba(255,255,255,0.5)' }}>🔋 {r.batteryHealth}</span> : '-'}
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: '#ff453a', fontWeight: 700 }}>${r.cost}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: '#A855F7', fontWeight: 700 }}>${r.sellUsd}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: r.profitUsd >= 0 ? '#22c55e' : '#ff453a', fontWeight: 800 }}>{r.profitUsd >= 0 ? '+' : ''}${r.profitUsd}</span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: r.profitUsd >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,69,58,0.1)', color: r.profitUsd >= 0 ? '#22c55e' : '#ff453a', padding: '2px 8px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800 }}>
                      <TrendingUp size={12} style={{ transform: r.profitUsd >= 0 ? 'none' : 'rotate(180deg)' }} /> {r.profitMargin}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// ── Main Admin Panel ──────────────────────────────────────────────────────────
export default function AdminPanel({ dbData, fetchProducts, onExit }) {
  const [authed, setAuthed] = useState(false);
   const [activeView, setActiveView] = useState('inventory'); // 'inventory', 'calculator', 'finances'
   const [activeCategory, setActiveCategory] = useState('iphones');
   const [dollarPrice, setDollarPrice] = useState('0');
  const [editing, setEditing] = useState(null);   // product obj or null
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // product id

  useEffect(() => {
    const fetchDollar = async () => {
      try {
        const res = await fetch('https://dolarapi.com/v1/dolares/blue');
        const data = await res.json();
        if (data && data.venta) {
          setDollarPrice(Math.round(data.venta + 10).toString());
        }
      } catch (err) {
        console.error("Error fetching dollar:", err);
      }
    };
    fetchDollar();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthed(false);
  };

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleSave = async (product) => {
    const payload = {
      id: product.id,
      category: activeCategory,
      name: product.name,
      image: product.image,
      images: product.images,
      description: product.desc,
      condition: product.condition,
      battery_health: product.batteryHealth,
      price: product.price ? parseFloat(product.price) : null,
      is_new: product.isNew,
      sold: product.sold,
      colors: product.colors,
      specs: product.specs
    };

    const { error } = await supabase.from('products').upsert(payload);
    if (error) {
      console.error('Error saving:', error);
      showToast(`Error: ${error.message || 'Error desconocido'}`, 'error');
      return;
    }

    await fetchProducts();
    setEditing(null);
    setCreating(false);
    showToast(creating ? '¡Producto creado exitosamente!' : '¡Producto actualizado!');
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Error deleting:', error);
      showToast('Error al eliminar', 'error');
      return;
    }

    await fetchProducts();
    setDeleteConfirm(null);
    showToast('Producto eliminado.', 'error');
  };



  const startEdit = async (product) => {
    setCreating(false);
    const { data, error } = await supabase.from('products').select('images').eq('id', product.id).single();
    if (error) {
      console.error('Error fetching images for edit:', error);
      setEditing(product);
    } else {
      setEditing({ ...product, images: data.images || [] });
    }
  };
  const startCreate = () => { setEditing(null); setCreating(true); };
  const cancelForm = () => { setEditing(null); setCreating(false); };

  const currentProducts = dbData[activeCategory] || [];
  const isFormOpen = editing || creating;

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} onExit={onExit} />;

  return (
    <div style={{ minHeight: '100vh', background: '#050505', fontFamily: 'Inter, sans-serif', color: '#fff' }}>
      <style>{`
        select option {
          background-color: #111 !important;
          color: white !important;
          padding: 10px;
        }
        select:focus {
          border-color: #A855F7 !important;
          background: rgba(168, 85, 247, 0.05) !important;
        }
      `}</style>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(168, 85, 247,0.05) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button onClick={onExit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.6rem 1.2rem', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s' }}>
              <ArrowLeft size={16} /> Tienda
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(168, 85, 247,0.1)', border: '1px solid rgba(168, 85, 247,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={18} color="#A855F7" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>Panel de Administración</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>M&G iPhones Cruz del Eje</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Pikachu GIF */}
            <div style={{ position: 'relative' }}>
              <img
                src="https://media.giphy.com/media/12Bpme5pTzGmg8/giphy.gif"
                alt="Pikachu sad"
                style={{
                  width: '64px',
                  height: '48px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 0 16px rgba(255,220,0,0.15)'
                }}
              />
            </div>

            {!isFormOpen && (
              <>
                 <button onClick={() => setActiveView(activeView === 'calculator' ? 'inventory' : 'calculator')} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: activeView === 'calculator' ? 'rgba(168, 85, 247, 0.15)' : 'transparent', color: activeView === 'calculator' ? '#A855F7' : 'rgba(255,255,255,0.7)', border: `1px solid ${activeView === 'calculator' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255,255,255,0.1)'}`, padding: '0.75rem 1.2rem', borderRadius: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = activeView === 'calculator' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = activeView === 'calculator' ? 'rgba(168, 85, 247, 0.15)' : 'transparent'}>
                   <Calculator size={18} /> {activeView === 'calculator' ? 'Inventario' : 'Calculadora'}
                 </button>
                 <button onClick={() => setActiveView(activeView === 'finances' ? 'inventory' : 'finances')} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: activeView === 'finances' ? 'rgba(34, 197, 94, 0.15)' : 'transparent', color: activeView === 'finances' ? '#22c55e' : 'rgba(255,255,255,0.7)', border: `1px solid ${activeView === 'finances' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255,255,255,0.1)'}`, padding: '0.75rem 1.2rem', borderRadius: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = activeView === 'finances' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = activeView === 'finances' ? 'rgba(34, 197, 94, 0.15)' : 'transparent'}>
                   <TableIcon size={18} /> {activeView === 'finances' ? 'Inventario' : 'Finanzas'}
                 </button>
                 <a href="https://docs.google.com/spreadsheets/d/1NxaPijnAiEpxu0HJOwBBuazuS66bDGHPym5uMy_xzyc/edit?usp=sharing" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                   <button style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1.2rem', borderRadius: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                     <ExternalLink size={18} /> Ver excel
                   </button>
                 </a>
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'transparent', color: '#ff453a', border: '1px solid rgba(255,69,58,0.3)', padding: '0.75rem 1.2rem', borderRadius: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.95rem', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,69,58,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                  Salir
                </button>
                {activeView === 'inventory' && (
                  <button onClick={startCreate} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#A855F7', color: '#000', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '0.95rem', boxShadow: '0 0 20px rgba(168, 85, 247,0.25)' }}>
                    <Plus size={18} /> Nuevo Producto
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem', position: 'relative', zIndex: 1 }}>
        {/* Main Content Area */}
         {activeView === 'calculator' ? (
           <TradeInCalculator />
         ) : activeView === 'finances' ? (
           <FinancesView products={dbData.iphones || []} dollarPrice={Number(dollarPrice)} />
         ) : (
          <>
            {/* Category Tabs */}
            {!isFormOpen && (
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '0.5rem', width: 'fit-content' }}>
                {Object.keys(dbData).map(cat => {
                  const Icon = CATEGORY_ICONS[cat] || Package;
                  const isActive = activeCategory === cat;
                  return (
                    <button key={cat} onClick={() => setActiveCategory(cat)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1.2rem', borderRadius: '14px', border: 'none', background: isActive ? '#A855F7' : 'transparent', color: isActive ? '#000' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.3s' }}>
                      <Icon size={16} />
                      <span>{CATEGORY_LABELS[cat] || cat}</span>
                      <span style={{ background: isActive ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.08)', borderRadius: '100px', padding: '1px 7px', fontSize: '0.75rem', fontWeight: 800 }}>
                        {(dbData[cat] || []).length}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Product Form */}
            {isFormOpen && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                    {creating ? '➕ Nuevo Producto' : '✏️ Editar Producto'}
                    <span style={{ marginLeft: '0.8rem', fontSize: '0.8rem', fontWeight: 600, color: '#A855F7', background: 'rgba(168, 85, 247,0.1)', padding: '3px 10px', borderRadius: '100px', verticalAlign: 'middle' }}>
                      {CATEGORY_LABELS[activeCategory]}
                    </span>
                  </h2>
                  <button onClick={cancelForm} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.5rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', transition: 'all 0.2s' }}>
                    <X size={20} />
                  </button>
                </div>
                <ProductForm
                  product={creating ? emptyProduct() : { ...editing }}
                  activeCategory={activeCategory}
                  onSave={handleSave}
                  onCancel={cancelForm}
                />
              </div>
            )}

            {/* Products Grid */}
            {!isFormOpen && (
              <>
                {currentProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '24px' }}>
                    <Package size={48} color="rgba(255,255,255,0.15)" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.1rem', margin: 0 }}>No hay productos en esta categoría.</p>
                    <button onClick={startCreate} style={{ marginTop: '1.5rem', background: '#A855F7', color: '#000', border: 'none', padding: '0.8rem 2rem', borderRadius: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                      Agregar el primero
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
                    {currentProducts.map(product => (
                      <div key={product.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden', transition: 'all 0.3s', position: 'relative' }}>
                        {/* Product Image */}
                        <div style={{ height: '180px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                          {product.image ? (
                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: product.sold ? 0.4 : 0.9 }} />
                          ) : (
                            <Package size={48} color="rgba(255,255,255,0.1)" />
                          )}
                          {product.sold && (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
                              <span style={{ background: '#ff453a', color: '#fff', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em' }}>VENDIDO</span>
                            </div>
                          )}
                          {product.isNew && !product.sold && (
                            <span style={{ position: 'absolute', top: '0.8rem', left: '0.8rem', background: '#A855F7', color: '#000', padding: '2px 8px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em' }}>NUEVO</span>
                          )}
                        </div>

                        {/* Product Info */}
                        <div style={{ padding: '1.2rem' }}>
                          <h3 style={{ margin: '0 0 0.4rem', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{product.name || 'Sin nombre'}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '100px' }}>{product.condition || 'Usado'}</span>
                            {product.batteryHealth && <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '100px' }}>🔋 {product.batteryHealth}</span>}
                            {product.price && <span style={{ fontSize: '0.8rem', color: '#A855F7', fontWeight: 700 }}>${Number(product.price).toLocaleString('es-AR')}</span>}
                          </div>

                          <div style={{ display: 'flex', gap: '0.6rem' }}>
                            <button onClick={() => startEdit(product)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.6rem', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}>
                              <Edit2 size={14} /> Editar
                            </button>
                            <button onClick={() => setDeleteConfirm(product.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: 'rgba(255,69,58,0.08)', border: '1px solid rgba(255,69,58,0.2)', borderRadius: '10px', padding: '0.6rem 1rem', color: '#ff453a', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '2.5rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(255,69,58,0.1)', border: '1px solid rgba(255,69,58,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Trash2 size={26} color="#ff453a" />
            </div>
            <h3 style={{ margin: '0 0 0.8rem', fontSize: '1.3rem', fontWeight: 800 }}>¿Eliminar producto?</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 2rem', lineHeight: 1.5 }}>Esta acción no se puede deshacer. El producto se eliminará permanentemente.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#fff', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                Cancelar
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', border: 'none', background: '#ff453a', color: '#fff', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
