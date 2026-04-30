import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, ImagePlus, Lock } from 'lucide-react';
import './index.css';
import logoMM from './assets/Logo.Empresa.png';

const defaultIphoneSpecs = {
  pantalla: '', procesador: '', ram: '', almacenamiento: '', bateria: '', camaraPrincipal: '', video: '', redes: ''
};

export default function AdminPanel({ dbData, setDbData, onExit }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [activeCategory, setActiveCategory] = useState('iphones');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUser === '1111' && loginPass === '1111') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  useEffect(() => {
    if (editingProduct || isCreating) {
      setPreviewProduct(editingProduct || {
        id: `prod-${Date.now()}`,
        name: '',
        image: '',
        images: [],
        desc: '',
        condition: 'Nuevo',
        batteryHealth: '',
        isNew: false,
        sold: false,
        colors: [],
        specs: {}
      });
    } else {
      setPreviewProduct(null);
    }
  }, [editingProduct, isCreating]);

  const handleChange = (field, value) => {
    setPreviewProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (specKey, value) => {
    setPreviewProduct(prev => ({
      ...prev,
      specs: { ...(prev.specs || {}), [specKey]: value }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setDbData(prev => {
      const categoryList = [...prev[activeCategory]];
      if (editingProduct && !isCreating) {
        const index = categoryList.findIndex(p => p.id === editingProduct.id);
        if (index !== -1) categoryList[index] = previewProduct;
      } else {
        categoryList.push(previewProduct);
      }
      return { ...prev, [activeCategory]: categoryList };
    });
    setEditingProduct(null);
    setIsCreating(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;
    setDbData(prev => {
      return {
        ...prev,
        [activeCategory]: prev[activeCategory].filter(p => p.id !== id)
      };
    });
  };

  const currentImages = previewProduct?.images?.length > 0 ? previewProduct.images : (previewProduct?.image ? [previewProduct.image] : []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    let newImages = [...currentImages];

    if (newImages.length + files.length > 10) {
      alert('Puedes subir un máximo de 10 fotos.');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages = [...newImages, reader.result];
        handleChange('images', newImages);
        handleChange('image', newImages[0]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    handleChange('images', newImages);
    handleChange('image', newImages[0] || '');
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('imageIndex', index);
  };

  const handleDrop = (e, targetIndex) => {
    const sourceIndex = Number(e.dataTransfer.getData('imageIndex'));
    if (sourceIndex === targetIndex) return;

    const newImages = [...currentImages];
    const [removed] = newImages.splice(sourceIndex, 1);
    newImages.splice(targetIndex, 0, removed);
    handleChange('images', newImages);
    handleChange('image', newImages[0] || '');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f5f5f7', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <img src={logoMM} alt="Montivero Logo" style={{ width: '80px', marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 2rem 0', color: 'var(--color-montivero-dark)' }}>Acceso Administrativo</h2>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <input type="text" placeholder="Usuario" value={loginUser} onChange={e => setLoginUser(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem', outline: 'none' }} />
            </div>
            <div>
              <input type="password" placeholder="Contraseña" value={loginPass} onChange={e => setLoginPass(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem', outline: 'none' }} />
            </div>
            
            {loginError && <p style={{ color: '#d92d20', margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>Credenciales incorrectas.</p>}
            
            <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--color-montivero-dark)', color: 'white', border: 'none', padding: '1rem', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', marginTop: '1rem' }}>
              <Lock size={18} /> Iniciar Sesión
            </button>
          </form>

          <button onClick={onExit} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '2rem', fontSize: '0.9rem', textDecoration: 'underline' }}>
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '3rem', minHeight: '80px' }}>
        <button onClick={onExit} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-montivero-dark)', fontSize: '1.1rem', fontWeight: 600, padding: 0 }}>
          <ArrowLeft size={20} /> Volver a la Tienda
        </button>
        
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Panel de Administración Local</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Los cambios se guardan solo en este navegador (Local Storage).</p>
        </div>

        {!editingProduct && !isCreating && (
          <button
            onClick={() => { setEditingProduct(null); setIsCreating(true); }}
            style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-montivero-dark)', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            <Plus size={20} /> Nuevo Producto
          </button>
        )}
      </div>

      {!editingProduct && !isCreating ? (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            {Object.keys(dbData).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{ padding: '0.5rem 1.5rem', borderRadius: '20px', border: '1px solid #ccc', background: activeCategory === cat ? 'var(--color-montivero-primary)' : 'white', fontWeight: activeCategory === cat ? 700 : 500, cursor: 'pointer', textTransform: 'capitalize' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {dbData[activeCategory].map(product => (
              <div key={product.id} style={{ border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', background: 'white', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setEditingProduct(product)} style={{ background: '#f0f0f0', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(product.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'contain', marginBottom: '1rem' }} />
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{product.name}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{product.condition || 'Nuevo'} | {product.sold ? 'VENDIDO' : 'Disponible'}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>

          {/* LEFT: FORM */}
          <div style={{ flex: 1, background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '2rem', position: 'sticky', top: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>{isCreating ? 'Configurar Producto' : 'Editar Producto'}</h2>
              <button onClick={() => { setEditingProduct(null); setIsCreating(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Image Uploader */}
              <div style={{ background: '#242526', borderRadius: '8px', padding: '1rem', color: 'white' }}>
                <div style={{ fontSize: '0.85rem', color: '#b0b3b8', marginBottom: '0.8rem' }}>
                  Fotos · {currentImages.length}/10 - Puedes agregar un máximo de 10 fotos.
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {currentImages.map((img, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDrop={(e) => handleDrop(e, idx)}
                      onDragOver={handleDragOver}
                      style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', cursor: 'grab', border: '1px solid #3e4042' }}
                    >
                      <img src={img} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  {currentImages.length < 10 && (
                    <label style={{ width: currentImages.length === 0 ? '100%' : '100px', height: currentImages.length === 0 ? '180px' : '100px', border: '1px solid #3e4042', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#3a3b3c', transition: 'background 0.2s' }}>
                      <ImagePlus size={28} color="#b0b3b8" style={{ marginBottom: '0.5rem' }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e4e6eb' }}>Agregar {currentImages.length === 0 ? 'fotos' : 'foto'}</span>
                      {currentImages.length === 0 && <span style={{ fontSize: '0.8rem', color: '#b0b3b8' }}>o arrastra y suelta</span>}
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Nombre del producto *</label>
                <input required value={previewProduct?.name || ''} onChange={e => handleChange('name', e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Descripción Corta</label>
                <textarea value={previewProduct?.desc || ''} onChange={e => handleChange('desc', e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', minHeight: '80px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Estado</label>
                  <select
                    value={previewProduct?.condition || 'Usado'}
                    onChange={e => {
                      const val = e.target.value;
                      handleChange('condition', val);
                      handleChange('isNew', val === 'Sellado');
                    }}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', marginTop: 'auto' }}
                  >
                    <option value="Usado">Usado</option>
                    <option value="Sellado">Sellado</option>
                  </select>
                </div>
                {previewProduct?.condition !== 'Sellado' && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Batería (%)</label>
                    <input value={previewProduct?.batteryHealth || ''} onChange={e => handleChange('batteryHealth', e.target.value)} placeholder="Ej: 88%" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', marginTop: 'auto' }} />
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Colores (ej: white, black)</label>
                  <input value={previewProduct?.colors?.join(', ') || ''} onChange={e => handleChange('colors', e.target.value.split(',').map(c => c.trim()))} placeholder="white, black, red" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', marginTop: 'auto' }} />
                </div>
              </div>



              {activeCategory === 'iphones' && (
                <div style={{ marginTop: '1rem', padding: '1.5rem', border: '1px solid #eee', borderRadius: '8px' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Especificaciones Detalladas</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
                    {Object.keys(defaultIphoneSpecs).map(specKey => {
                      if (specKey === 'almacenamiento') {
                        return (
                          <div key={specKey} style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'capitalize' }}>Almacenamiento (Solo nros, ej: 128)</label>
                            <input
                              type="number"
                              value={(previewProduct?.specs?.[specKey] || '').replace(' GB', '')}
                              onChange={e => handleSpecChange(specKey, e.target.value ? `${e.target.value} GB` : '')}
                              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', marginTop: 'auto' }}
                            />
                          </div>
                        );
                      }
                      return (
                        <div key={specKey} style={{ display: 'flex', flexDirection: 'column' }}>
                          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'capitalize' }}>{specKey}</label>
                          <input value={previewProduct?.specs?.[specKey] || ''} onChange={e => handleSpecChange(specKey, e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', marginTop: 'auto' }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!isCreating && (
                <div style={{ padding: '1rem', background: 'rgba(217, 45, 32, 0.05)', border: '1px solid rgba(217, 45, 32, 0.2)', borderRadius: '8px', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#d92d20', fontWeight: 600 }}>
                    <input type="checkbox" checked={previewProduct?.sold || false} onChange={e => handleChange('sold', e.target.checked)} />
                    Marcar este producto como "Vendido"
                  </label>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-montivero-primary)', color: 'var(--color-montivero-dark)', border: 'none', padding: '1rem 2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem' }}>
                  <Save size={20} /> Guardar Producto
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: PREVIEW */}
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Vista Previa del Modal</h3>
            {previewProduct && (
              <div className="modal-content" style={{ position: 'relative', width: '100%', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', overflow: 'hidden', margin: 0, maxHeight: 'none' }}>
                <div className="modal-body">
                  <div className="modal-image-section">
                    {currentImages.length > 0 ? (
                      <div style={{ width: '100%' }}>
                        <img src={currentImages[0]} alt="Preview" className="modal-image" style={{ marginBottom: '1rem' }} />
                        {currentImages.length > 1 && (
                          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {currentImages.map((img, idx) => (
                              <img key={idx} src={img} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: idx === 0 ? '2px solid var(--color-montivero-dark)' : '1px solid #eee' }} />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>Sin Imagen</div>
                    )}
                  </div>

                  <div className="modal-info-section">
                    <h2 className="modal-title">{previewProduct.name || 'Título del Producto'}</h2>

                    <div className="modal-badges">
                      {previewProduct.condition && (
                        <div className="modal-badge">Estado: {previewProduct.condition}</div>
                      )}
                      {previewProduct.batteryHealth && previewProduct.condition !== 'Sellado' && (
                        <div className="modal-badge">Batería: {previewProduct.batteryHealth}</div>
                      )}
                      {previewProduct.sold && (
                        <div className="modal-badge" style={{ backgroundColor: 'rgba(217, 45, 32, 0.1)', color: '#d92d20', borderColor: 'transparent' }}>
                          VENDIDO
                        </div>
                      )}
                      {previewProduct.isNew && (
                        <div className="modal-badge" style={{ backgroundColor: 'rgba(191, 72, 0, 0.1)', color: '#bf4800', borderColor: 'transparent' }}>
                          NUEVO
                        </div>
                      )}
                    </div>

                    {activeCategory === 'iphones' && previewProduct.specs && Object.keys(previewProduct.specs).some(k => previewProduct.specs[k]) ? (
                      <div className="modal-specs">
                        {Object.keys(previewProduct.specs).filter(k => previewProduct.specs[k]).map(specKey => (
                          <div className="modal-spec-item" key={specKey}>
                            <span className="modal-spec-label">{specKey}</span>
                            <span className="modal-spec-value">{previewProduct.specs[specKey]}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="modal-specs">
                        <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>{previewProduct.desc || 'La descripción aparecerá aquí.'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
