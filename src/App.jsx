import React, { useState, Suspense } from 'react';
import './index.css';
import ProductViewer3D from './ProductViewer3D';

// --- Icons (Minimal SVG) ---
const Icons = {
  Arch: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V10a8 8 0 0 1 16 0v12"/><path d="M2 22h20"/><path d="M4 10h16"/></svg>,
  Table: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h16"/><path d="M4 9v11"/><path d="M20 9v11"/><path d="M2 9h20"/><path d="M8 9v8"/><path d="M16 9v8"/></svg>,
  Chair: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4v16"/><path d="M19 12v8"/><path d="M5 12h14"/><path d="M5 20h14"/><path d="M9 12v8"/><path d="M15 12v8"/></svg>,
  Hose: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 8v4"/><path d="M12 12h4"/></svg>,
  Trash: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>,
  Check: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>,
  ArrowLeft: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Cart: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  ChevronRight: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Search: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Filter: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
};

const SHOWROOM_CATEGORIES = [
  { id: 'all', name: 'สินค้าทั้งหมด', icon: '✨' },
  { id: 'outdoor', name: 'จัดสวนกลางแจ้ง', icon: '🌿' },
  { id: 'seating', name: 'เก้าอี้และที่นั่ง', icon: '🪑' },
  { id: 'table', name: 'โต๊ะและโต๊ะข้าง', icon: '☕' },
  { id: 'accessories', name: 'อุปกรณ์เสริม', icon: '🗑️' }
];

const getCategoryForProduct = (id) => {
  if (id.includes('arch')) return 'outdoor';
  if (id.includes('table')) return 'table';
  if (id.includes('chair') || id.includes('daybed')) return 'seating';
  if (['trash', 'hose'].includes(id)) return 'accessories';
  return 'all';
};

// --- Data Models (Flattened Top-level Products) ---
const PRODUCTS = [
  { 
    id: 'arch', 
    code: 'GZ-001', 
    name: 'ซุ้ม (Gazebo Collection)', 
    icon: 'Arch',
    price: 25000, 
    desc: 'Signature architecture piece', 
    weight: '120 kg', 
    dimensions: '270 x 270 x 250 cm', 
    story: 'จุดเด่นของพื้นที่สีเขียวที่ออกแบบมาเพื่อสะท้อนความสง่างาม ผสานสัมผัสแห่งธรรมชาติเข้ากับเหล็กที่แข็งแกร่ง สามารถเลือกตกแต่งหลังคาหรือรูปแบบระแนงเพิ่มเติมได้ตามต้องการเพื่อสร้างร่มเงาที่สมบูรณ์แบบ', 
    baseImage: 'ซุ้ม.png',
    options: [
      { id: 'arch-roof', type: 'variant', name: 'เพิ่มหลังคากันแดด (Roof)', price: 5000, image: 'ออฟชั่นซุ้ม หลังคา.png' },
      { id: 'arch-lath', type: 'variant', name: 'เปลี่ยนเป็นหลังคาระแนง (Lath)', price: 3500, image: 'ออฟชั่นซุ้มระแนงตกแต่ง.png' },
      { id: 'arch-vine', type: 'variant', name: 'โครงระแนงปลูกไม้เลื้อย (Nature)', price: 2000, image: 'ออฟชั่นซุ้มไม้เลื่อย.png' }
    ],
    ergonomics: 'ergonomic_guide_1776686156605.png', 
    usageGuide: 'สามารถยึดฐานกับพื้นคอนกรีตได้โดยตรงเพื่อความมั่นคงสูงสุดในช่วงที่มีลมแรง', 
    relatedSets: ['daybed-1', 'chair-short', 'table-dining'] 
  },
  { 
    id: 'chair-short', code: 'CH-S01', name: 'เก้าอี้พักผ่อน (Armchair Collection)', icon: 'Chair', 
    price: 6000, desc: 'Ergonomic contemporary seating', weight: '8 kg', dimensions: '50 x 50 x 85 cm', 
    story: 'เก้าอี้ที่ถูกออกแบบโดยคำนึงถึงสรีระอย่างถ่องแท้ รองรับการใช้งานของทุกคนในครอบครัว มีให้เลือกทั้งแบบนั่งเดี่ยวและม้านั่งยาว', 
    baseImage: 'เก้าอี้สั้น.png', 
    options: [
      { id: 'chair-long', type: 'variant', name: 'เปลี่ยนเป็นประเภทม้านั่งยาว (Long Bench)', price: 3000, image: 'เก้าอี้ยาว.png' }
    ], 
    ergonomics: 'ergonomic_guide_1776686156605.png',
    usageGuide: 'โครงสร้างโลหะออกแบบให้กระจายน้ำหนักได้ดี รองรับน้ำหนักได้สูงสุด 120 kg', 
    relatedSets: ['table-side', 'table-dining'] 
  },
  { 
    id: 'chair-light', code: 'CH-E10', name: 'เก้าอี้เบา (Lightweight Series)', icon: 'Chair', 
    price: 5000, desc: 'Aerodynamic patio chair', weight: '4.5 kg', dimensions: '50 x 50 x 80 cm', 
    story: 'เบาหวิวแต่แข็งแรง ดึงเอาความเรียบหรูของสไตล์มินิมอลมาใช้ในดีไซน์ที่โปร่งสบายที่สุด', 
    baseImage: 'เก้าอี้เบา.png', 
    options: [
      { id: 'chair-light-v2', type: 'variant', name: 'เก้าอี้เบา V.2 (ปรับปรุงสรีระแบบ Aero)', price: 500, image: 'เก้าอี้เบา v.2.png' }
    ], 
    relatedSets: ['table-side', 'chair-flat'] 
  },
  { 
    id: 'chair-flat', code: 'CH-F01', name: 'เก้าอี้เหล็กแบน (Flat Steel)', icon: 'Chair', 
    price: 7500, desc: 'Industrial minimalist statement', weight: '12 kg', dimensions: '55 x 50 x 82 cm', 
    story: 'ดุดันแต่เรียบง่าย ใช้เหล็กแบนหนาพิเศษดัดโค้งด้วยเทคโนโลยีสูงเพื่อสร้างรูปทรงที่เป็นเอกลักษณ์', 
    baseImage: 'เก้าอี้เหล็กแบน.png', options: [], relatedSets: ['table-dining', 'daybed-1'] 
  },
  { 
    id: 'table-dining', code: 'TB-D01', name: 'โต๊ะมาตรฐาน (Dining Table)', icon: 'Table', 
    price: 12000, desc: 'Minimalist dining experience', weight: '35 kg', dimensions: '160 x 80 x 75 cm', 
    story: 'โต๊ะสำหรับพื้นที่กลางแจ้งที่มีพื้นที่ว่างใต้โต๊ะมากเป็นพิเศษ ทำให้มีระยะห่างให้ขานั่งได้อย่างสบายๆ ทนแดดทนฝน', 
    baseImage: 'โต๊ะ.png', options: [], ergonomics: 'ergonomic_guide_1776686156605.png', relatedSets: ['chair-flat', 'chair-short'] 
  },
  { 
    id: 'table-side', code: 'TB-S01', name: 'โต๊ะข้างโซฟา (Side Table)', icon: 'Table', 
    price: 8000, desc: 'Complementary surface', weight: '15 kg', dimensions: '60 x 60 x 45 cm', 
    story: 'โต๊ะเล็กข้างที่นอนหรือโซฟา ความสูงพอดีกับการวางแก้วกาแฟยามเช้าหรือหนังสือเล่มโปรด', 
    baseImage: 'โต๊ะข้างโซฟา.png', options: [], relatedSets: ['daybed-1', 'chair-light'] 
  },
  { 
    id: 'daybed-1', code: 'DB-001', name: 'แคร่พักผ่อน (Daybed Collection)', icon: 'Chair', 
    price: 18000, desc: 'Relaxing outdoor daybed', weight: '30 kg', dimensions: '180 x 80 x 40 cm', 
    story: 'ยกระดับการพักผ่อนด้วยแคร่ดีไซน์ร่วมสมัยที่ถูกออกแบบมาให้เข้ากับสวนโมเดิร์น', 
    baseImage: 'แคร่ draft1.png', 
    options: [
      { id: 'daybed-2', type: 'variant', name: 'แคร่ดีไซน์ 2 (เพิ่มระแนงกันตก)', price: 1000, image: 'แคร่ draft2.png' }
    ], 
    ergonomics: 'ergonomic_guide_1776686156605.png', relatedSets: ['table-side', 'arch'] 
  },
  { 
    id: 'trash', code: 'TR-005', name: 'ถังขยะ (Bin)', icon: 'Trash', 
    price: 4500, desc: 'Sleek waste management', weight: '18 kg', dimensions: '40 x 40 x 85 cm', 
    story: 'ถังขยะใบนี้ถูกออกแบบมาเพื่อความสะอาดและดูหรูหรา แมงจะตั้งอยู่กลางแจ้งก็ไม่ทำให้บรรยากาศเสียไป', 
    baseImage: 'ถังขยะ.png', options: [], ergonomics: 'trash_guide_1776686170798.png', 
    usageGuide: 'รองรับถุงขยะดำความจุ 40 ลิตร มีขอบห่วงด้านในสำหรับล็อคปากถุง', relatedSets: ['hose', 'chair-short'] 
  },
  { 
    id: 'hose', code: 'HR-004', name: 'ที่เก็บสายยาง (Hose Reel)', icon: 'Hose', 
    price: 8500, desc: 'Functional luxury', weight: '12 kg', dimensions: '30 x 30 x 110 cm', 
    story: 'ยกระดับอุปกรณ์ที่ดูรกรุงรังให้กลายเป็นงานประติมากรรมตกแต่งสวน', 
    baseImage: 'ที่เก็บสายยาง.png', options: [], usageGuide: 'หมุนเก็บสายยางได้อย่างสมูท เชื่อมหัวก๊อกได้ทันที', relatedSets: ['arch', 'trash'] 
  }
];

const COLORS = [
  { id: 'black', name: 'Midnight Black', hex: '#1a1a1a' }, 
  { id: 'white', name: 'Arctic White', hex: '#fdfcfb' }
];

const initialConfig = {
  color: 'black',
  hasAddon: false, // For future build-your-own modularity
};

// --- Main Components ---
const BouncyButton = ({ children, onClick, variant = 'primary', className = '' }) => {
  return (
    <button onClick={onClick} className={`bouncy-button btn-${variant} ${className}`}>
      {children}
    </button>
  );
};

// A conceptual simulated interactive 3D viewer built dynamically from 2D images
const Mock3DViewer = ({ product, config }) => {
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if(!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotation({ x: y * -0.05, y: x * 0.05 });
  };

  const resetRotation = () => setRotation({ x: 0, y: 0 });

  return (
    <div 
      className="mock-3d-container" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetRotation}
      style={{
        width: '100%', height: '100%', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        perspective: '1000px', cursor: 'grab', background: 'radial-gradient(circle at center, #ffffff 0%, #f0f0f0 100%)',
        overflow: 'hidden', borderRadius: '16px'
      }}
    >
      <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, background: 'rgba(255,255,255,0.8)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, color: '#000' }}>
        <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#2ecc71', borderRadius: '50%', boxShadow: '0 0 8px #2ecc71' }}></span>
        Concept 3D Configurator
      </div>
      
      {/* Fake Grid Floor */}
      <div style={{ position: 'absolute', bottom: '15%', width: '400px', height: '400px', background: 'repeating-linear-gradient(#ccc 0 1px, transparent 1px 100%), repeating-linear-gradient(90deg, #ccc 0 1px, transparent 1px 100%)', backgroundSize: '40px 40px', transform: 'rotateX(75deg)', opacity: 0.2 }} />

      <div style={{ 
         position: 'relative', width: '100%', maxWidth: '800px', aspectRatio: '4/3',
         transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
         transition: 'transform 0.1s ease-out'
      }}>
        {/* isolated base image replaces regular base image in Configurator! */}
        <img src={`/${product.baseImage.replace('.png', '_iso.png')}`} alt={product.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', zIndex: 1, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.1))' }} />
        
        {/* Layer the active addons dynamically! */}
        {(config.activeAddons || []).map(addonId => {
           const opt = product.options?.find(o => o.id === addonId);
           if (!opt) return null;
           const imageLayer = opt.image.replace('.png', '_iso.png');
           return (
             <img key={opt.id} src={`/${imageLayer}`} alt={opt.name} className="addon-layer slide-up" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', zIndex: 2 }} />
           );
        })}
      </div>
    </div>
  );
};

const calculatePrice = (product, config) => {
  let price = product.price;
  if (config?.activeAddons && product.options) {
    config.activeAddons.forEach(addonId => {
      const opt = product.options.find(o => o.id === addonId);
      if (opt && opt.price) price += opt.price;
    });
  }
  return price;
};

const getImageSrc = (product, config) => {
  // Return early if no addons
  if (!config?.activeAddons || config.activeAddons.length === 0) return `/${product.baseImage}`;
  
  // Find if there's a variant selected
  const variant = product.options?.find(o => config.activeAddons.includes(o.id) && o.type === 'variant');
  if(variant) return `/${variant.image}`;
  
  return `/${product.baseImage}`;
};

export default function App() {
  const [step, setStep] = useState('shop'); // shop, custom, summary
  const [currentProduct, setCurrentProduct] = useState(null);
  const [config, setConfig] = useState(initialConfig);
  const [cart, setCart] = useState([]);
  
  // Phase 3 UI States (IKEA Redesign)
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showroomFilters, setShowroomFilters] = useState({ sort: false, category: false, price: false });
  
  // Phase 2 UI States
  const [activeMedia, setActiveMedia] = useState('base'); 
  const [accordionState, setAccordionState] = useState({ 
    story: true, 
    specs: false, 
    guide: false 
  });
  const [isBYO, setIsBYO] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // --- Showroom View ---
  if (step === 'shop') {
    // Filter Products
    let filteredProducts = PRODUCTS.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === 'all' || getCategoryForProduct(p.id) === activeCategory;
      return matchSearch && matchCat;
    });

    return (
      <div className="shop-container" style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
        {/* Top Navbar */}
        <header className="shop-header" style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px', width: '100%' }}>
          <div className="brand-logo font-en">LUMINA</div>
          
          {/* Main Search Bar */}
          <div className="search-bar-wrapper">
            <Icons.Search />
            <input 
              type="text" 
              placeholder="คุณกำลังมองหาสินค้าอะไรอยู่..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input th-text"
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button className="option-btn no-border" onClick={() => setStep('summary')}>
              <Icons.Cart />
              <span className="th-text" style={{ fontSize: '14px' }}>ตะกร้าสินค้า ({cart.length})</span>
            </button>
          </div>
        </header>

        <div className="showroom-layout">
          
          {/* Left Sidebar Filters */}
          <aside className="showroom-sidebar slide-right delay-1">
            <h2 className="th-text" style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px' }}>ตัวกรอง</h2>
            
            <div className="accordion-item" style={{ border: 'none', borderBottom: '1px solid #f0f0f0' }}>
              <button className="accordion-header th-text" style={{ padding: '16px 0', fontSize: '15px' }} onClick={() => setShowroomFilters({...showroomFilters, sort: !showroomFilters.sort})}>
                เรียงลำดับ <span className={`accordion-icon ${showroomFilters.sort ? 'open' : ''}`}><Icons.ChevronRight /></span>
              </button>
              {showroomFilters.sort && <div style={{ paddingBottom: '16px' }} className="th-text filter-options">
                <label className="checkbox-line"><input type="radio" name="sort" defaultChecked /> สินค้าขายดี</label>
                <label className="checkbox-line"><input type="radio" name="sort" /> ราคา: ต่ำไปสูง</label>
                <label className="checkbox-line"><input type="radio" name="sort" /> ราคา: สูงไปต่ำ</label>
              </div>}
            </div>

            <div className="accordion-item" style={{ border: 'none', borderBottom: '1px solid #f0f0f0' }}>
              <button className="accordion-header th-text" style={{ padding: '16px 0', fontSize: '15px' }} onClick={() => setShowroomFilters({...showroomFilters, category: !showroomFilters.category})}>
                หมวดหมู่ <span className={`accordion-icon ${showroomFilters.category ? 'open' : ''}`}><Icons.ChevronRight /></span>
              </button>
              {showroomFilters.category && <div style={{ paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }} className="th-text">
                {SHOWROOM_CATEGORIES.map(cat => (
                  <button key={`side-${cat.id}`} className={`sidebar-cat-btn ${activeCategory === cat.id ? 'active' : ''}`} onClick={() => setActiveCategory(cat.id)}>
                     {cat.name}
                  </button>
                ))}
              </div>}
            </div>
            
            <div className="accordion-item" style={{ border: 'none', borderBottom: '1px solid #f0f0f0' }}>
              <button className="accordion-header th-text" style={{ padding: '16px 0', fontSize: '15px' }} onClick={() => setShowroomFilters({...showroomFilters, price: !showroomFilters.price})}>
                ราคา <span className={`accordion-icon ${showroomFilters.price ? 'open' : ''}`}><Icons.ChevronRight /></span>
              </button>
            </div>
          </aside>

          {/* Main Grid Area */}
          <main className="showroom-main slide-up delay-2" style={{ flex: 1 }}>
            
            {/* Horizontal Categories */}
            <div className="horizontal-categories-wrapper" style={{ marginBottom: '40px' }}>
               <div className="horizontal-scroll" style={{ paddingBottom: '16px', gap: '16px' }}>
                 {SHOWROOM_CATEGORIES.map(cat => (
                   <button 
                     key={`pill-${cat.id}`} 
                     className={`cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
                     onClick={() => setActiveCategory(cat.id)}
                   >
                     <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                     <span className="th-text">{cat.name}</span>
                   </button>
                 ))}
               </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
              {filteredProducts.map(product => {
                const Icon = Icons[product.icon];
                // Base image is isolated background (white/transparent), hover is the lifestyle original
                const isoImage = product.baseImage.replace('.png', '_iso.png');
                return (
                  <div key={product.id} className="ikea-card group" onClick={() => {
                    setCurrentProduct(product);
                    setConfig(initialConfig);
                    setStep('custom');
                  }}>
                    <div className="ikea-card-image" style={{ borderRadius: '8px', overflow: 'hidden', height: '320px', background: 'transparent', position: 'relative' }}>
                      <img src={`/${isoImage}`} className="img-front" alt={product.name} />
                      <img src={`/${product.baseImage}`} className="img-back" alt={product.name + " lifestyle"} />
                    </div>
                    <div className="card-info" style={{ padding: '16px 4px 0 4px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '8px', letterSpacing: '0.05em', fontWeight: 600 }} className="font-en">{product.code}</div>
                      <h3 className="th-text" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '4px', color: '#111' }}>{product.name}</h3>
                      <p className="font-en" style={{ fontSize: '0.85rem', color: '#555', marginBottom: '16px', height: '2.5rem', overflow: 'hidden' }}>{product.desc}</p>
                      <div className="font-en" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#000' }}>
                         <span style={{ fontSize: '0.8rem', verticalAlign: 'top', marginRight: '2px' }}>฿</span>
                         {product.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredProducts.length === 0 && (
              <div style={{ padding: '80px 0', textAlign: 'center', color: '#888' }} className="th-text">
                <h2>ไม่พบสินค้าที่ตรงกับการค้นหา</h2>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  // --- Product Details & BYO View ---
  if (step === 'custom' && currentProduct) {
    const ProductIcon = Icons[currentProduct.icon] || Icons['Chair']; // fallback
    
    // Check if we can show 3D for this product (actually from obj files provided by user)
    const has3DModel = ['chair-short', 'table-dining', 'hose'].includes(currentProduct.id);
    
    // Toggle Accordion wrapper
    const toggleAccordion = (section) => {
      setAccordionState(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
      <div className="app-container slide-up" style={{ backgroundColor: '#fcfcfc' }}>
        {/* Gallery Area (Left) */}
        <div className="visualizer-area" style={{ position: 'relative' }}>
          {/* Back Button */}
          <button 
            style={{ position: 'absolute', top: '24px', left: '32px', border: 'none', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#1a1a1a', zIndex: 100, padding: '12px 20px', borderRadius: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', fontWeight: 500 }}
            onClick={() => setStep('shop')}
          >
            <Icons.ArrowLeft /> <span className="font-en">Back to Collection</span>
          </button>
          
          {/* Thumbnail Gallery (Vertical) */}
          <div className="thumbnail-gallery">
            <div className={`thumbnail-item ${activeMedia === 'base' ? 'active' : ''}`} onClick={() => setActiveMedia('base')}>
               <img src={`/${currentProduct.baseImage}`} alt="Base" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
            {has3DModel && (
              <div className={`thumbnail-item ${activeMedia === '3d' ? 'active' : ''}`} onClick={() => setActiveMedia('3d')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '600' }} className="font-en">
                 3D View
              </div>
            )}
            {currentProduct.ergonomics && (
              <div className={`thumbnail-item ${activeMedia === 'ergo' ? 'active' : ''}`} onClick={() => setActiveMedia('ergo')}>
                 <img src={`/${currentProduct.ergonomics}`} alt="Ergo" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </div>
            )}
          </div>

          {/* Main Visualizer */}
          <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
            {isBYO ? (
              has3DModel ? (
                <Suspense fallback={<div className="spinner"></div>}>
                  <ProductViewer3D product={currentProduct} config={config} />
                </Suspense>
              ) : (
                <Mock3DViewer product={currentProduct} config={config} />
              )
            ) : activeMedia === '3d' && has3DModel ? (
              <Suspense fallback={<div className="spinner"></div>}>
                <ProductViewer3D product={currentProduct} config={config} />
              </Suspense>
            ) : activeMedia === 'ergo' ? (
              <img src={`/${currentProduct.ergonomics}`} alt="Ergonomics" style={{ width: '100%', maxWidth: '800px', maxHeight: '80vh', objectFit: 'contain', cursor: 'zoom-in' }} onClick={() => setSelectedImage(`/${currentProduct.ergonomics}`)} />
            ) : (
              <img src={`/${currentProduct.baseImage}`} alt={currentProduct.name} style={{ width: '100%', maxWidth: '800px', maxHeight: '80vh', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }} />
            )}
          </div>
        </div>

        {/* Data & Commerce Panel (Right) - Glassmorphism */}
        <div className="glass-panel no-scrollbar" style={{ overflowY: 'auto' }}>
          {/* Header Sticky */}
          <div style={{ padding: '40px', paddingBottom: '24px', borderBottom: '1px solid var(--color-divider)', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', zIndex: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }} className="font-en">{currentProduct.code}</div>
              <div className="glass-toggle" style={{ fontSize: '0.75rem', padding: '4px 12px' }}><Icons.Cart /> Save</div>
            </div>
            <h2 className="title th-text" style={{ fontSize: '2.2rem', marginBottom: '12px', fontWeight: 500 }}>{currentProduct.name}</h2>
            <div className="font-en" style={{ fontSize: '1.5rem', fontWeight: 400 }}>฿{currentProduct.price.toLocaleString()}</div>
            
            {/* Build Your Own mode button (Always available) */}
            <div className="byo-btn" onClick={() => setIsBYO(!isBYO)}>
              <span className="th-text">{isBYO ? 'ปิดโหมดปรับแต่ง' : 'ออกแบบสไตล์คุณเอง (Build Your Own)'}</span>
              <div className="glow-icon"><Icons.Check /></div>
            </div>
          </div>

          <div style={{ padding: '0 40px' }} className="th-text">
            
            {/* Build Your Own Controls */}
            {isBYO && (
              <div className="slide-up" style={{ padding: '32px 0', borderBottom: '1px solid var(--color-divider)' }}>
                {currentProduct.options && currentProduct.options.length > 0 && (
                  <>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '24px', fontWeight: 600 }}>เลือกส่วนเสริมและรุ่นย่อย</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '32px' }}>
                      {currentProduct.options.map(opt => (
                        <div key={opt.id} className="modern-checkbox slide-up delay-1" style={{ borderColor: config.activeAddons?.includes(opt.id) ? '#1a1a1a' : '#e6e6e6' }} onClick={() => {
                          let newAddons = [...(config.activeAddons || [])];
                          if(newAddons.includes(opt.id)) {
                            newAddons = newAddons.filter(id => id !== opt.id);
                          } else {
                            if(opt.type === 'variant') newAddons = [opt.id];
                            else newAddons.push(opt.id);
                          }
                          setConfig({...config, activeAddons: newAddons});
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                             <img src={`/${opt.image}`} style={{ width: '40px', height: '40px', objectFit: 'contain' }} alt={opt.name} />
                             <div>
                                <div style={{ fontWeight: 500 }}>{opt.name}</div>
                                <div className="font-en" style={{ fontSize: '12px', color: '#888' }}>{opt.price > 0 ? `+฿${opt.price.toLocaleString()}` : 'Included'}</div>
                             </div>
                          </div>
                          <div className={`checkbox-circle ${config.activeAddons?.includes(opt.id) ? 'active' : ''}`} style={{ background: config.activeAddons?.includes(opt.id) ? '#1a1a1a' : 'transparent', borderColor: config.activeAddons?.includes(opt.id) ? '#1a1a1a' : '#ccc' }}>
                             {config.activeAddons?.includes(opt.id) && <div style={{width: '10px', height: '10px', background: 'white', borderRadius: '50%'}}></div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 600 }}>เลือกสี (Base Color)</h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {COLORS.map(c => (
                    <button 
                      key={c.id} 
                      className="color-btn group" 
                      onClick={() => setConfig({...config, color: c.id})} 
                      style={{ 
                        padding: '8px', 
                        border: config.color === c.id ? `2px solid ${c.hex}` : '2px solid transparent', 
                        borderRadius: '50%', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' 
                      }}
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: c.hex, border: '1px solid #e0e0e0', boxShadow: config.color === c.id ? '0 4px 12px rgba(0,0,0,0.1)' : 'none' }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Accordion List */}
            <div className="accordion-item">
              <button className="accordion-header th-text" aria-expanded={accordionState.story} onClick={() => toggleAccordion('story')}>
                ข้อมูลผลิตภัณฑ์ 
                <span className="accordion-icon"><Icons.ChevronRight /></span>
              </button>
              <div className="accordion-content" aria-expanded={accordionState.story}>
                <div className="accordion-inner">
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>{currentProduct.story}</p>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <button className="accordion-header th-text" aria-expanded={accordionState.specs} onClick={() => toggleAccordion('specs')}>
                ขนาดและสัดส่วน 
                <span className="accordion-icon"><Icons.ChevronRight /></span>
              </button>
              <div className="accordion-content" aria-expanded={accordionState.specs}>
                <div className="accordion-inner font-en">
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f9f9f9' }}>
                    <span style={{ color: '#888' }}>Dimensions</span>
                    <span style={{ fontWeight: 500 }}>{currentProduct.dimensions}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                    <span style={{ color: '#888' }}>Weight</span>
                    <span style={{ fontWeight: 500 }}>{currentProduct.weight}</span>
                  </div>
                </div>
              </div>
            </div>

            {currentProduct.usageGuide && (
              <div className="accordion-item">
                <button className="accordion-header th-text" aria-expanded={accordionState.guide} onClick={() => toggleAccordion('guide')}>
                  การใช้งานและการดูแลรักษา 
                  <span className="accordion-icon"><Icons.ChevronRight /></span>
                </button>
                <div className="accordion-content" aria-expanded={accordionState.guide}>
                  <div className="accordion-inner">
                    <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>{currentProduct.usageGuide}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Cross-Selling / Related Sets */}
            {currentProduct.relatedSets && currentProduct.relatedSets.length > 0 && (
              <div style={{ paddingTop: '40px', paddingBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '24px', fontWeight: 600 }}>สินค้าน่าสนใจที่เข้าชุดกัน</h3>
                <div className="horizontal-scroll">
                  {currentProduct.relatedSets.map(rId => {
                    const rp = PRODUCTS.find(p => p.id === rId);
                    if(!rp) return null;
                    return (
                      <div key={rId} className="related-card" onClick={() => {
                        setCurrentProduct(rp);
                        setConfig(initialConfig);
                        setActiveMedia('base');
                        setIsBYO(false);
                      }}>
                        <img src={`/${rp.baseImage}`} alt={rp.name} style={{ width: '100%', height: '140px', objectFit: 'contain', marginBottom: '16px' }} />
                        <div className="th-text" style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{rp.name}</div>
                        <div className="font-en" style={{ fontSize: '13px', color: '#888' }}>฿{rp.price.toLocaleString()}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
          </div>

          {/* Checkout / Add to cart Stick bottom */}
          <div style={{ padding: '24px 40px', marginTop: 'auto', position: 'sticky', bottom: 0, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '16px' }}>
            <BouncyButton variant="primary" style={{ flex: 1 }} onClick={() => {
               setCart([...cart, { product: currentProduct, config }]);
               setStep('summary');
               window.scrollTo(0, 0);
            }}>
               เพิ่มลงตะกร้า <Icons.Cart />
            </BouncyButton>
          </div>
        </div>

        {/* Fullscreen Image Overlay (Preserved) */}
        {selectedImage && (
          <div 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', backdropFilter: 'blur(10px)', cursor: 'zoom-out' }}
            onClick={() => setSelectedImage(null)}
          >
            <div style={{ position: 'absolute', top: '24px', right: '32px', color: 'white', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }} className="font-en">
              Close <span style={{ fontSize: '24px', verticalAlign: 'middle', marginLeft: '8px' }}>&times;</span>
            </div>
            <img src={selectedImage} alt="Enlarged view" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', objectFit: 'contain' }} />
          </div>
        )}
      </div>
    );
  }

  // --- Summary View ---
  if (step === 'summary') {
    return (
      <div className="app-container slide-up" style={{ flexDirection: 'column', alignItems: 'center', paddingTop: '80px', paddingBottom: '80px', background: '#fdfcfb' }}>
         <div style={{ width: '100%', maxWidth: '1000px', padding: '0 32px' }}>
            <button 
              style={{ marginBottom: '48px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#666' }}
              onClick={() => setStep('shop')}
            >
              <Icons.ArrowLeft /> <span className="th-text" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}>กลับหน้ารวม</span>
            </button>

            <h1 className="title th-text" style={{ fontSize: '2.5rem', marginBottom: '48px' }}>ตะกร้าสินค้าและการจัดส่ง</h1>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', background: '#fff', border: '1px solid #f0f0f0', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                 <div style={{ color: '#ccc', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}><div style={{ transform: 'scale(2)' }}><Icons.Cart /></div></div>
                 <h2 className="th-text" style={{ fontSize: '1.25rem', marginBottom: '24px', color: '#666' }}>ยังไม่มีสินค้าในตะกร้า</h2>
                 <BouncyButton variant="outline" onClick={() => setStep('shop')}>กลับไปยังโชว์รูม</BouncyButton>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                 {/* Cart Items */}
                 <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {cart.map((item, index) => {
                       return (
                         <div key={index} style={{ background: '#fff', padding: '24px', border: '1px solid #f0f0f0', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
                            <div style={{ width: '120px', height: '120px', overflow: 'hidden', borderRadius: '12px', flexShrink: 0, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                               <img src={getImageSrc(item.product, item.config)} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="th-text" style={{ flex: 1 }}>
                               <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '4px' }}>{item.product.name}</h3>
                               
                               {item.config.activeAddons && item.config.activeAddons.length > 0 && (
                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', background: '#fcfcfc', padding: '16px', borderRadius: '6px', marginTop: '16px' }}>
                                    {item.config.activeAddons.map(id => {
                                      const mappedOpt = item.product.options?.find(o => o.id === id);
                                      if (!mappedOpt) return null;
                                      return (
                                        <div key={id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eaeaea', paddingBottom: '8px', marginBottom: '4px' }}>
                                          <span style={{ color: '#888' }}>{mappedOpt.type === 'variant' ? 'รุ่นย่อย :' : 'ส่วนเสริม :'} {mappedOpt.name}</span>
                                          <span className="font-en" style={{ textTransform: 'capitalize' }}>{mappedOpt.price > 0 ? `+฿${mappedOpt.price.toLocaleString()}` : ''}</span>
                                        </div>
                                      );
                                    })}
                                 </div>
                               )}
                            </div>
                            <div className="font-en" style={{ fontSize: '1.25rem', fontWeight: 500 }}>฿{calculatePrice(item.product, item.config).toLocaleString()}</div>
                         </div>
                       )
                    })}
                 </div>

                 {/* Order Summary & Form */}
                 <div style={{ width: '100%', maxWidth: '380px' }}>
                    <div style={{ background: '#fff', padding: '32px', border: '1px solid #1c1c1c', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', position: 'sticky', top: '40px' }}>
                       <h3 className="th-text" style={{ fontSize: '1.25rem', marginBottom: '24px', fontWeight: 500 }}>สรุปการสั่งซื้อ</h3>
                       <div className="font-en" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#666' }}>
                          <span>Subtotal</span>
                          <span>฿{cart.reduce((sum, item) => sum + calculatePrice(item.product, item.config), 0).toLocaleString()}</span>
                       </div>
                       <div className="font-en" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #f0f0f0', color: '#666' }}>
                          <span>Delivery</span>
                          <span>TBD</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center' }}>
                          <span className="th-text" style={{ fontWeight: 500 }}>ยอดชำระสุทธิ</span>
                          <span className="font-en" style={{ fontSize: '1.5rem', fontWeight: 500 }}>฿{cart.reduce((sum, item) => sum + calculatePrice(item.product, item.config), 0).toLocaleString()}</span>
                       </div>
                       
                       <BouncyButton variant="primary" style={{ width: '100%', padding: '20px' }}>ดำเนินการจอง (Checkout)</BouncyButton>
                    </div>
                 </div>
              </div>
            )}
         </div>
      </div>
    );
  }

  return null;
}
