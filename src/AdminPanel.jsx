import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, ImagePlus, Lock, Eye, EyeOff, Package, Smartphone, Shield, Zap, Maximize, CheckCircle, AlertCircle, Database } from 'lucide-react';
import logoMM from './assets/logo-white-apple-removebg-preview.png';
import { supabase } from './supabase';

const ADMIN_PASSWORD = 'eleven';

const DB_KEY = 'mg_iphones_db';

const defaultIphoneSpecs = {
  pantalla: '', procesador: '', ram: '', almacenamiento: '',
  bateria: '', camaraPrincipal: '', video: '', redes: ''
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
      background: type === 'success' ? 'rgba(31,237,210,0.15)' : 'rgba(255,69,58,0.15)',
      border: `1px solid ${type === 'success' ? 'rgba(31,237,210,0.4)' : 'rgba(255,69,58,0.4)'}`,
      backdropFilter: 'blur(16px)', borderRadius: '16px',
      padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem',
      color: '#fff', fontFamily: 'Inter, sans-serif', minWidth: '280px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      animation: 'slideInToast 0.3s cubic-bezier(0.175,0.885,0.32,1.275)'
    }}>
      {type === 'success'
        ? <CheckCircle size={20} color="#1FEDD2" />
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
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#050505', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(31,237,210,0.06) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

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

        <div style={{ width: '64px', height: '64px', background: 'rgba(31,237,210,0.1)', border: '1px solid rgba(31,237,210,0.2)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Lock size={28} color="#1FEDD2" />
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>Panel Admin</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 2.5rem', fontSize: '0.95rem' }}>Ingresá la contraseña para continuar</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Contraseña"
              value={pass}
              onChange={e => setPass(e.target.value)}
              autoFocus
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

          <button type="submit" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            background: '#1FEDD2', color: '#000', border: 'none',
            padding: '1rem', borderRadius: '14px', fontSize: '1rem', fontWeight: 800,
            cursor: 'pointer', letterSpacing: '0.02em',
            boxShadow: '0 0 20px rgba(31,237,210,0.25)', transition: 'all 0.3s ease'
          }}>
            <Lock size={18} /> Entrar al Panel
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
  const fileRef = useRef();

  const currentImages = form.images?.length > 0 ? form.images : (form.image ? [form.image] : []);

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
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px', color: '#fff', fontSize: '0.95rem',
    outline: 'none', fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box', transition: 'border-color 0.2s'
  };
  const labelStyle = { display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>

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
              style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '10px', overflow: 'hidden', cursor: 'grab', border: idx === 0 ? '2px solid #1FEDD2' : '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}
            >
              <img src={img} alt={`Foto ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: 3, right: 3, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                <X size={12} />
              </button>
              {idx === 0 && <span style={{ position: 'absolute', bottom: 3, left: 3, background: '#1FEDD2', color: '#000', fontSize: '0.6rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>PORTADA</span>}
            </div>
          ))}

          {currentImages.length < 10 && (
            <label style={{ width: currentImages.length === 0 ? '100%' : '90px', height: currentImages.length === 0 ? '140px' : '90px', border: '1px dashed rgba(31,237,210,0.3)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '0.4rem', background: 'rgba(31,237,210,0.03)', transition: 'background 0.2s', flexShrink: 0 }}>
              <ImagePlus size={22} color="#1FEDD2" />
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

        <div>
          <label style={labelStyle}>Colores (hex, separados por coma)</label>
          <input style={inputStyle} value={form.colors?.join(', ') || ''} onChange={e => set('colors', e.target.value.split(',').map(c => c.trim()).filter(Boolean))} placeholder="#ffffff, #ff3b30" />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Descripción corta</label>
          <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Breve descripción del producto..." />
        </div>
      </div>

      {/* iPhone specs */}
      {activeCategory === 'iphones' && (
        <div style={{ background: 'rgba(31,237,210,0.03)', border: '1px solid rgba(31,237,210,0.1)', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.5rem', color: '#1FEDD2', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>⚙️ Especificaciones Técnicas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            {Object.keys(defaultIphoneSpecs).map(key => (
              <div key={key}>
                <label style={labelStyle}>{SPEC_LABELS[key] || key}</label>
                {key === 'almacenamiento' ? (
                  <input type="number" style={inputStyle} value={(form.specs?.[key] || '').replace(' GB', '')} onChange={e => setSpec(key, e.target.value ? `${e.target.value} GB` : '')} placeholder="128" />
                ) : (
                  <input style={inputStyle} value={form.specs?.[key] || ''} onChange={e => setSpec(key, e.target.value)} placeholder={`Ingresá ${SPEC_LABELS[key]?.toLowerCase()}`} />
                )}
              </div>
            ))}
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
        <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.9rem 2rem', borderRadius: '12px', border: 'none', background: '#1FEDD2', color: '#000', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1rem', boxShadow: '0 0 20px rgba(31,237,210,0.3)' }}>
          <Save size={18} /> Guardar Producto
        </button>
      </div>
    </form>
  );
}

// ── Main Admin Panel ──────────────────────────────────────────────────────────
export default function AdminPanel({ dbData, fetchProducts, onExit }) {
  const [authed, setAuthed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('iphones');
  const [editing, setEditing] = useState(null);   // product obj or null
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // product id

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

  const handleSeed = async () => {
    const allProducts = [];
    Object.keys(dbData).forEach(cat => {
      (dbData[cat] || []).forEach(prod => {
        allProducts.push({
          id: prod.id,
          category: cat,
          name: prod.name,
          image: prod.image,
          images: prod.images || [],
          description: prod.desc || '',
          condition: prod.condition,
          battery_health: prod.batteryHealth,
          price: prod.price ? parseFloat(prod.price) : null,
          is_new: prod.isNew || false,
          sold: prod.sold || false,
          colors: prod.colors || [],
          specs: prod.specs || {}
        });
      });
    });

    const { error } = await supabase.from('products').upsert(allProducts);
    if (error) {
      console.error(error);
      showToast(`Error iniciales: ${error.message || 'Desconocido'}`, 'error');
    } else {
      await fetchProducts();
      showToast('¡Todos tus productos fueron respaldados en la nube!');
    }
  };

  const startEdit = (product) => { setCreating(false); setEditing(product); };
  const startCreate = () => { setEditing(null); setCreating(true); };
  const cancelForm = () => { setEditing(null); setCreating(false); };

  const currentProducts = dbData[activeCategory] || [];
  const isFormOpen = editing || creating;

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} onExit={onExit} />;

  return (
    <div style={{ minHeight: '100vh', background: '#050505', fontFamily: 'Inter, sans-serif', color: '#fff' }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(31,237,210,0.05) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button onClick={onExit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.6rem 1.2rem', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s' }}>
              <ArrowLeft size={16} /> Tienda
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(31,237,210,0.1)', border: '1px solid rgba(31,237,210,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={18} color="#1FEDD2" />
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
              <button onClick={handleSeed} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1.5rem', borderRadius: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.95rem' }}>
                Actualizar DB
              </button>
              <button onClick={startCreate} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#1FEDD2', color: '#000', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '0.95rem', boxShadow: '0 0 20px rgba(31,237,210,0.25)' }}>
                <Plus size={18} /> Nuevo Producto rey
              </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem', position: 'relative', zIndex: 1 }}>

        {/* Category Tabs */}
        {!isFormOpen && (
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '0.5rem', width: 'fit-content' }}>
            {Object.keys(dbData).map(cat => {
              const Icon = CATEGORY_ICONS[cat] || Package;
              const isActive = activeCategory === cat;
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1.2rem', borderRadius: '14px', border: 'none', background: isActive ? '#1FEDD2' : 'transparent', color: isActive ? '#000' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.3s' }}>
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
                <span style={{ marginLeft: '0.8rem', fontSize: '0.8rem', fontWeight: 600, color: '#1FEDD2', background: 'rgba(31,237,210,0.1)', padding: '3px 10px', borderRadius: '100px', verticalAlign: 'middle' }}>
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
                <button onClick={startCreate} style={{ marginTop: '1.5rem', background: '#1FEDD2', color: '#000', border: 'none', padding: '0.8rem 2rem', borderRadius: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
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
                        <span style={{ position: 'absolute', top: '0.8rem', left: '0.8rem', background: '#1FEDD2', color: '#000', padding: '2px 8px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em' }}>NUEVO</span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div style={{ padding: '1.2rem' }}>
                      <h3 style={{ margin: '0 0 0.4rem', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{product.name || 'Sin nombre'}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '100px' }}>{product.condition || 'Usado'}</span>
                        {product.batteryHealth && <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '100px' }}>🔋 {product.batteryHealth}</span>}
                        {product.price && <span style={{ fontSize: '0.8rem', color: '#1FEDD2', fontWeight: 700 }}>${Number(product.price).toLocaleString('es-AR')}</span>}
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
