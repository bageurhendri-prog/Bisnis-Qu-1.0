import React, { useState } from 'react';
import { 
  Wrench, 
  Utensils, 
  Store, 
  ShoppingBag, 
  Users, 
  Megaphone, 
  BarChart3, 
  Settings, 
  Award, 
  Bell, 
  ChevronRight, 
  X, 
  Check, 
  Plus, 
  Printer, 
  Smartphone, 
  QrCode, 
  CreditCard, 
  DollarSign, 
  Clock, 
  Sparkles, 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  Share2,
  Minus,
  SlidersHorizontal,
  Receipt,
  RotateCcw
} from 'lucide-react';

interface BisnisQuDeviceSimulatorProps {
  onBuildApkClick?: () => void;
  onViewDartCode?: (file: 'dashboard' | 'pos') => void;
}

export const BisnisQuDeviceSimulator: React.FC<BisnisQuDeviceSimulatorProps> = ({
  onBuildApkClick,
  onViewDartCode
}) => {
  // Navigation Route State: 'dashboard' or 'pos'
  const [currentRoute, setCurrentRoute] = useState<'dashboard' | 'pos'>('dashboard');
  const [activeModuleTitle, setActiveModuleTitle] = useState<string>('Ritel');

  // Modal / Drawer State
  const [activeSheet, setActiveSheet] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProUser, setIsProUser] = useState(false);
  const [printerConnected, setPrinterConnected] = useState(false);
  const [deviceFrame, setDeviceFrame] = useState<'phone' | 'fluid'>('phone');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [cashTendered, setCashTendered] = useState<number | null>(null);

  // Products Dataset (matching POSPage)
  const initialProducts = [
    { id: '1', name: 'Oli Mesin Matic 0.8L', price: 45000, stock: 12, category: 'Ritel' },
    { id: '2', name: 'Busi Motor Standard', price: 15000, stock: 25, category: 'Ritel' },
    { id: '3', name: 'Nasi Goreng Spesial', price: 20000, stock: 50, category: 'Resto' },
    { id: '4', name: 'Es Teh Manis', price: 5000, stock: 100, category: 'Resto' },
    { id: '5', name: 'Kampas Rem Depan Vario', price: 55000, stock: 18, category: 'Bengkel' },
    { id: '6', name: 'Jasa Servis Tune-up', price: 65000, stock: 99, category: 'Bengkel' },
    { id: '7', name: 'Keripik Tempe Mak Ijah (Titip)', price: 15000, stock: 38, category: 'Collab / Titip' },
    { id: '8', name: 'Sambal Bawang Botol (Titip)', price: 28000, stock: 14, category: 'Collab / Titip' },
  ];

  const [products, setProducts] = useState(initialProducts);

  // POS Cart State: { [productId]: qty }
  const [cart, setCart] = useState<{ [id: string]: number }>({
    '1': 1, // Pre-seeded with 1 item so the bottom bar is easily discoverable!
  });

  // Cart operations
  const addToCart = (id: string) => {
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const next = { ...prev };
      if (!next[id]) return next;
      if (next[id] > 1) {
        next[id] = next[id] - 1;
      } else {
        delete next[id];
      }
      return next;
    });
  };

  const totalItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find(prod => prod.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  // Filter products by active module category or search
  const filteredProducts = products.filter(p => {
    const matchesModule = 
      activeModuleTitle === 'Semua' ||
      p.category.toLowerCase().includes(activeModuleTitle.toLowerCase()) ||
      activeModuleTitle.toLowerCase().includes(p.category.toLowerCase());
    
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  // Navigate to POS
  const navigateToPOS = (moduleName: string) => {
    setActiveModuleTitle(moduleName);
    setCurrentRoute('pos');
    setActiveSheet(null);
  };

  const navigateToDashboard = () => {
    setCurrentRoute('dashboard');
    setActiveSheet(null);
  };

  const handleCompletePayment = () => {
    setPaymentModalOpen(false);
    setShowPaymentSuccess(true);
    setCart({});
    setTimeout(() => {
      setShowPaymentSuccess(false);
    }, 3500);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Top Simulator Control Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">
            {currentRoute === 'dashboard' ? 'DashboardPage (lib/pages/dashboard_page.dart)' : `POSPage - Kasir ${activeModuleTitle} (lib/pages/pos_page.dart)`}
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-cyan-400 font-mono text-[11px]">
            {currentRoute === 'dashboard' ? 'Main Hub' : 'Live State & Cart'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Route Switcher */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={navigateToDashboard}
              className={`px-2.5 py-1 rounded transition ${currentRoute === 'dashboard' ? 'bg-slate-800 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigateToPOS('Ritel')}
              className={`px-2.5 py-1 rounded transition ${currentRoute === 'pos' && activeModuleTitle === 'Ritel' ? 'bg-slate-800 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              POS Ritel
            </button>
            <button
              onClick={() => navigateToPOS('Resto')}
              className={`px-2.5 py-1 rounded transition ${currentRoute === 'pos' && activeModuleTitle === 'Resto' ? 'bg-slate-800 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              POS Resto
            </button>
          </div>

          {/* Device Frame View */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs hidden sm:flex">
            <button
              onClick={() => setDeviceFrame('phone')}
              className={`px-2.5 py-1 rounded transition ${deviceFrame === 'phone' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              375px
            </button>
            <button
              onClick={() => setDeviceFrame('fluid')}
              className={`px-2.5 py-1 rounded transition ${deviceFrame === 'fluid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Tablet
            </button>
          </div>

          {onBuildApkClick && (
            <button
              onClick={onBuildApkClick}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <span>Build APK</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Flutter Phone Viewport */}
      <div className={`transition-all duration-300 ${
        deviceFrame === 'phone' ? 'w-[380px]' : 'w-full max-w-2xl'
      }`}>
        {/* Device Outer Frame */}
        <div className="bg-slate-900 p-2.5 sm:p-3 rounded-[36px] shadow-2xl border-4 border-slate-800 relative">
          {/* Phone Ear Speaker & Notch */}
          <div className="w-32 h-4 bg-slate-950 rounded-b-xl mx-auto mb-2 flex items-center justify-center gap-2">
            <div className="w-10 h-1 bg-slate-800 rounded-full" />
            <div className="w-2 h-2 rounded-full bg-slate-800" />
          </div>

          {/* Flutter Screen Frame */}
          <div className="bg-white rounded-[26px] overflow-hidden text-slate-900 shadow-inner min-h-[640px] flex flex-col relative select-none font-sans">
            {/* Android Status Bar */}
            <div className="bg-white px-4 pt-2 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-700">
              <span>09:41</span>
              <div className="flex items-center gap-1.5 text-slate-600 text-[10px]">
                <span>LTE</span>
                <span>📶</span>
                <span>🔋 98%</span>
              </div>
            </div>

            {/* ============================================================== */}
            {/* ROUTE 1: DASHBOARD PAGE (lib/pages/dashboard_page.dart)        */}
            {/* ============================================================== */}
            {currentRoute === 'dashboard' && (
              <>
                {/* Flutter AppBar */}
                <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-10 shadow-xs">
                  <div className="w-8" />
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                    BisnisQu
                  </h1>
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 transition"
                      aria-label="Notifikasi"
                    >
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                    </button>
                  </div>
                </header>

                {/* Flutter Body: SingleChildScrollView */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-800">
                  {/* Status Lisensi Ringkas */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-blue-100 text-blue-600">
                        <Award className="w-5 h-5 fill-blue-500/20" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          Status: {isProUser ? 'Paket Pro (Aktif)' : 'Free (Basic)'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {isProUser ? 'Masa aktif: 360 Hari tersisa' : 'Fitur POS standar 1 Cabang'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveSheet('upgrade')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition ${
                        isProUser 
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {isProUser ? 'Kelola' : 'Upgrade Pro'}
                    </button>
                  </div>

                  {/* Header Section 1: Pilih Modul Usaha */}
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-2.5">
                      Pilih Modul Usaha
                    </h2>

                    {/* Grid Menu Modul (2x2) */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Bengkel */}
                      <button
                        onClick={() => navigateToPOS('Bengkel')}
                        className="p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center group active:scale-95 bg-orange-50/70 border-orange-200 hover:bg-orange-100/60"
                      >
                        <div className="p-2.5 rounded-full bg-orange-500/10 text-orange-600 mb-1.5 group-hover:scale-105 transition">
                          <Wrench className="w-8 h-8" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          Bengkel
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          Buka Kasir WO & Servis
                        </span>
                      </button>

                      {/* Resto / Kedai */}
                      <button
                        onClick={() => navigateToPOS('Resto')}
                        className="p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center group active:scale-95 bg-red-50/70 border-red-200 hover:bg-red-100/60"
                      >
                        <div className="p-2.5 rounded-full bg-red-500/10 text-red-500 mb-1.5 group-hover:scale-105 transition">
                          <Utensils className="w-8 h-8" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          Resto / Kedai
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          Buka Kasir Meja & Makanan
                        </span>
                      </button>

                      {/* Collab / Titip */}
                      <button
                        onClick={() => navigateToPOS('Collab / Titip')}
                        className="p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center group active:scale-95 bg-purple-50/70 border-purple-200 hover:bg-purple-100/60"
                      >
                        <div className="p-2.5 rounded-full bg-purple-500/10 text-purple-600 mb-1.5 group-hover:scale-105 transition">
                          <Store className="w-8 h-8" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          Collab / Titip
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          Buka Kasir Konsinyasi
                        </span>
                      </button>

                      {/* Ritel / Toko */}
                      <button
                        onClick={() => navigateToPOS('Ritel')}
                        className="p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center group active:scale-95 bg-blue-50/70 border-blue-200 hover:bg-blue-100/60"
                      >
                        <div className="p-2.5 rounded-full bg-blue-500/10 text-blue-600 mb-1.5 group-hover:scale-105 transition">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          Ritel / Toko
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          Buka Kasir POS Barcode
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Header Section 2: Management Universal */}
                  <div className="pt-2">
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-2.5">
                      Management & Control
                    </h2>

                    <div className="space-y-2">
                      {/* Staff / Karyawan */}
                      <button
                        onClick={() => setActiveSheet('staff')}
                        className="w-full text-left p-3 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 transition flex items-center justify-between shadow-2xs group active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-800">
                              Staff / Karyawan
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Hak akses & kinerja staff
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>

                      {/* Marketing & Promo */}
                      <button
                        onClick={() => setActiveSheet('marketing')}
                        className="w-full text-left p-3 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 transition flex items-center justify-between shadow-2xs group active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition">
                            <Megaphone className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-800">
                              Marketing & Promo
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Voucher, diskon & pelanggan
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>

                      {/* Laporan Penjualan */}
                      <button
                        onClick={() => setActiveSheet('laporan')}
                        className="w-full text-left p-3 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 transition flex items-center justify-between shadow-2xs group active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition">
                            <BarChart3 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-800">
                              Laporan Penjualan
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Omzet harian, mingguan & bulanan
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                            Rp1.45Jt
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </button>

                      {/* Pengaturan (Setting) */}
                      <button
                        onClick={() => setActiveSheet('setting')}
                        className="w-full text-left p-3 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 transition flex items-center justify-between shadow-2xs group active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition">
                            <Settings className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-800">
                              Pengaturan (Setting)
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Printer, Cabang & Paket Pro (Rp1.000/hr)
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ============================================================== */}
            {/* ROUTE 2: POS PAGE (lib/pages/pos_page.dart)                     */}
            {/* ============================================================== */}
            {currentRoute === 'pos' && (
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {/* Flutter AppBar: Kasir - ${widget.moduleTitle} */}
                <header className="bg-white px-3 py-2.5 flex items-center justify-between border-b border-slate-100 sticky top-0 z-10 shadow-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={navigateToDashboard}
                      className="p-1 rounded-full hover:bg-slate-100 text-slate-700 transition"
                      title="Kembali ke Dashboard"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-base font-bold text-slate-900 truncate">
                      Kasir - {activeModuleTitle}
                    </h1>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowSearchInput(!showSearchInput)}
                      className={`p-1.5 rounded-full transition ${showSearchInput ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-700'}`}
                      title="Cari Produk"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </header>

                {/* Sub-Header: Filter Kategori / Search Bar Ringkas */}
                <div className="bg-slate-100 px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                    <span className="font-semibold text-slate-600">
                      Modul Aktif: {activeModuleTitle}
                    </span>
                  </div>

                  {/* Module Pill switcher within POS */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveModuleTitle(activeModuleTitle === 'Ritel' ? 'Resto' : 'Ritel')}
                      className="text-[10px] text-blue-600 font-semibold hover:underline"
                    >
                      Ganti Modul
                    </button>
                  </div>
                </div>

                {/* Search Input Bar (Expandable) */}
                {showSearchInput && (
                  <div className="px-3 py-2 bg-blue-50/50 border-b border-blue-100 flex items-center gap-2 animate-in slide-in-from-top-1">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder={`Cari nama produk di ${activeModuleTitle}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-xs text-slate-800"
                      autoFocus
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-slate-400 text-xs">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* ListView.builder: Product Cards */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {filteredProducts.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                      <ShoppingBag className="w-8 h-8 mx-auto opacity-40 text-slate-500" />
                      <p>Tidak ada produk yang sesuai filter "{searchQuery}".</p>
                      <button
                        onClick={() => { setSearchQuery(''); setActiveModuleTitle('Semua'); }}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 text-[11px]"
                      >
                        Tampilkan Semua Modul
                      </button>
                    </div>
                  ) : (
                    filteredProducts.map(product => {
                      const qty = cart[product.id] || 0;
                      return (
                        <div
                          key={product.id}
                          className="bg-white border border-slate-200 rounded-[10px] p-2.5 sm:p-3 flex items-center shadow-2xs hover:border-slate-300 transition"
                        >
                          {/* Icon Barang / Makanan */}
                          <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600 flex-shrink-0 mr-3">
                            {activeModuleTitle === 'Resto' || product.category === 'Resto' ? (
                              <Utensils className="w-5 h-5" />
                            ) : activeModuleTitle === 'Bengkel' ? (
                              <Wrench className="w-5 h-5 text-orange-600" />
                            ) : (
                              <ShoppingBag className="w-5 h-5" />
                            )}
                          </div>

                          {/* Detail Nama & Harga */}
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Rp {product.price.toLocaleString('id-ID')} • Stok: {product.stock}
                            </div>
                          </div>

                          {/* Tombol Aksi Tambah / Kurang Qty Minimalis */}
                          <div className="flex-shrink-0">
                            {qty === 0 ? (
                              <button
                                onClick={() => addToCart(product.id)}
                                className="px-3.5 py-1 border border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold transition active:scale-95"
                              >
                                Tambah
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-1 py-0.5">
                                <button
                                  onClick={() => removeFromCart(product.id)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded-full transition active:scale-90"
                                  title="Kurang"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="font-bold text-xs text-slate-900 w-5 text-center">
                                  {qty}
                                </span>
                                <button
                                  onClick={() => addToCart(product.id)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition active:scale-90"
                                  title="Tambah"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Bottom Bar Keranjang & Pembayaran (if _totalItemCount > 0) */}
                {totalItemCount > 0 && (
                  <div className="bg-white border-t border-slate-200/80 p-3.5 shadow-lg flex items-center justify-between sticky bottom-0 z-20">
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {totalItemCount} Item
                      </div>
                      <div className="text-base sm:text-lg font-bold text-blue-600 font-mono">
                        Rp {totalPrice.toLocaleString('id-ID')}
                      </div>
                    </div>

                    <button
                      onClick={() => setPaymentModalOpen(true)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
                    >
                      <span>Bayar Sekarang</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Nav Bar Pill Indicator */}
            <div className="py-2 flex justify-center bg-white border-t border-slate-100">
              <div className="w-28 h-1 bg-slate-300 rounded-full" />
            </div>

            {/* Payment Modal Sheet */}
            {paymentModalOpen && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-30 flex flex-col justify-end animate-in fade-in">
                <div className="bg-white rounded-t-3xl p-4 shadow-2xl max-h-[90%] flex flex-col animate-in slide-in-from-bottom duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-slate-900">Pembayaran Kasir</h3>
                        <span className="text-[10px] text-slate-500">{totalItemCount} Item · {activeModuleTitle}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setPaymentModalOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 overflow-y-auto text-xs">
                    {/* Ringkasan Tagihan */}
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 flex items-center justify-between">
                      <span className="font-medium text-slate-700">Total Tagihan:</span>
                      <span className="text-base font-bold text-blue-700 font-mono">
                        Rp {totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Metode Pembayaran */}
                    <div className="space-y-2">
                      <span className="font-semibold text-slate-800 text-[11px] block">
                        Pilih Metode Pembayaran:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setCashTendered(totalPrice)}
                          className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                            cashTendered !== null ? 'border-blue-500 bg-blue-50/50 text-blue-700' : 'border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                          <span className="font-bold text-xs">Tunai (Cash)</span>
                        </button>

                        <button
                          onClick={() => setCashTendered(null)}
                          className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                            cashTendered === null ? 'border-blue-500 bg-blue-50/50 text-blue-700' : 'border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          <QrCode className="w-5 h-5 text-purple-600" />
                          <span className="font-bold text-xs">QRIS Statis</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Cash Presets if cash chosen */}
                    {cashTendered !== null && (
                      <div className="space-y-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-medium block">Uang Diterima:</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setCashTendered(totalPrice)}
                            className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-medium hover:bg-slate-100"
                          >
                            Uang Pas
                          </button>
                          <button
                            onClick={() => setCashTendered(50000)}
                            className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-medium hover:bg-slate-100"
                          >
                            50.000
                          </button>
                          <button
                            onClick={() => setCashTendered(100000)}
                            className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-medium hover:bg-slate-100"
                          >
                            100.000
                          </button>
                        </div>
                        {cashTendered >= totalPrice && (
                          <div className="pt-1 text-[11px] text-emerald-700 font-semibold flex justify-between">
                            <span>Kembalian:</span>
                            <span>Rp {(cashTendered - totalPrice).toLocaleString('id-ID')}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Printer Struk toggle */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Printer className="w-4 h-4 text-slate-600" />
                        <span className="text-[11px] font-medium text-slate-700">Cetak Struk Thermal</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={printerConnected}
                        onChange={(e) => setPrinterConnected(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    {/* Selesaikan Transaksi */}
                    <button
                      onClick={handleCompletePayment}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesaikan & Simpan Transaksi</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Success Toast */}
            {showPaymentSuccess && (
              <div className="absolute top-12 left-4 right-4 bg-emerald-600 text-white rounded-xl p-3 shadow-xl z-40 flex items-center justify-between animate-in slide-in-from-top-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-xs">Transaksi Berhasil!</div>
                    <div className="text-[10px] text-emerald-100">
                      Struk tercetak {printerConnected ? '(Bluetooth Printer Aktif)' : '(Struk Digital Disimpan)'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowPaymentSuccess(false)}
                  className="p-1 text-emerald-200 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Dashboard Sub-Sheets (Staff, Marketing, Laporan, Setting, Upgrade Pro) */}
            {activeSheet && (
              <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs z-20 flex flex-col justify-end">
                <div className="bg-white rounded-t-3xl p-4 shadow-2xl max-h-[88%] flex flex-col animate-in slide-in-from-bottom duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveSheet(null)}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-600"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold text-slate-900 capitalize">
                        {activeSheet === 'staff' && 'Kelola Staff & Hak Akses'}
                        {activeSheet === 'marketing' && 'Marketing, Voucher & Promo'}
                        {activeSheet === 'laporan' && 'Laporan Omzet Penjualan'}
                        {activeSheet === 'setting' && 'Pengaturan BisnisQu'}
                        {activeSheet === 'upgrade' && 'Upgrade Paket Pro BisnisQu'}
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveSheet(null)}
                      className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="overflow-y-auto space-y-3 text-xs flex-1 pr-1">
                    {/* STAFF */}
                    {activeSheet === 'staff' && (
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-slate-900">Ahmad Fauzi (Kasir Utama)</div>
                            <div className="text-[10px] text-slate-500">PIN: **** · Akses: POS, Kasir, Cetak Struk</div>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium">Aktif</span>
                        </div>
                        <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-slate-900">Budi Santoso (Mekanik Kepala)</div>
                            <div className="text-[10px] text-slate-500">PIN: **** · Akses: Modul Bengkel, Work Order</div>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium">Aktif</span>
                        </div>
                      </div>
                    )}

                    {/* MARKETING */}
                    {activeSheet === 'marketing' && (
                      <div className="space-y-2">
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-amber-900">DISKON10</span>
                            <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.2 rounded font-semibold">10% OFF</span>
                          </div>
                          <p className="text-[11px] text-slate-600">Min. Belanja Rp50.000 · 84x Digunakan</p>
                        </div>
                      </div>
                    )}

                    {/* LAPORAN */}
                    {activeSheet === 'laporan' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                            <span className="text-[11px] text-slate-500 block">Omzet Hari Ini</span>
                            <span className="text-base font-bold text-emerald-700">Rp1.450.000</span>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                            <span className="text-[11px] text-slate-500 block">Total Transaksi</span>
                            <span className="text-base font-bold text-blue-700">28 Struk</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SETTING */}
                    {activeSheet === 'setting' && (
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Printer className="w-4 h-4 text-slate-700" />
                              <span className="font-semibold text-slate-800">Thermal Bluetooth Printer</span>
                            </div>
                            <button
                              onClick={() => setPrinterConnected(!printerConnected)}
                              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                                printerConnected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {printerConnected ? 'Terhubung (RPP02N)' : 'Sambungkan'}
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-500">Mendukung printer struk kasir 58mm & 80mm.</p>
                        </div>
                      </div>
                    )}

                    {/* UPGRADE PRO */}
                    {activeSheet === 'upgrade' && (
                      <div className="space-y-3 text-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">Paket BisnisQu Pro</h3>
                          <p className="text-blue-600 font-extrabold text-lg mt-0.5">
                            Rp30.000 <span className="text-xs font-normal text-slate-500">/ Bulan (Rp1.000/hari)</span>
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setIsProUser(true);
                            setActiveSheet(null);
                          }}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-200 transition"
                        >
                          Aktifkan Paket Pro Sekarang
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
