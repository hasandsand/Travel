import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Printer, 
  CheckCircle2, 
  AlertCircle,
  Luggage,
  Sparkles
} from 'lucide-react';
import { PackingItem } from '../types';
import { INITIAL_PACKING_ITEMS } from '../data/umrahData';

export const PackingChecklist: React.FC = () => {
  const [items, setItems] = useState<PackingItem[]>(() => {
    try {
      const saved = localStorage.getItem('umrah_packing_items');
      return saved ? JSON.parse(saved) : INITIAL_PACKING_ITEMS;
    } catch {
      return INITIAL_PACKING_ITEMS;
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [onlyMandatory, setOnlyMandatory] = useState<boolean>(false);
  const [newItemTitle, setNewItemTitle] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<PackingItem['category']>('Dokumen & Finansial');

  useEffect(() => {
    try {
      localStorage.setItem('umrah_packing_items', JSON.stringify(items));
    } catch {
      // Storage unavailable
    }
  }, [items]);

  const categories = [
    'Dokumen & Finansial',
    'Pakaian & Busana Ihram',
    'Kesehatan & Pribadi',
    'Ibadah & Doa',
    'Aksesoris & Elektronik'
  ];

  const toggleCheck = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    const newItem: PackingItem = {
      id: `custom-${Date.now()}`,
      category: newItemCategory,
      title: newItemTitle.trim(),
      description: 'Catatan tambahan pribadi jamaah',
      isMandatory: false,
      checked: false
    };
    setItems([...items, newItem]);
    setNewItemTitle('');
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleResetDefault = () => {
    if (confirm('Kembalikan daftar perlengkapan ke pengaturan standar?')) {
      setItems(INITIAL_PACKING_ITEMS);
    }
  };

  const filteredItems = items.filter(item => {
    if (onlyMandatory && !item.isMandatory) return false;
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    return true;
  });

  const totalCount = items.length;
  const checkedCount = items.filter(i => i.checked).length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3.5 py-1 rounded-full text-xs font-bold">
          <Luggage className="w-3.5 h-3.5 text-emerald-700" />
          Checklist Koper & Perlengkapan Jamaah
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Panduan Barang Bawaan & Kesiapan Koper Umrah
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Centang perlengkapan yang sudah masuk koper agar tidak ada dokumen, pakaian ihram, atau obat esensial yang tertinggal.
        </p>
      </div>

      {/* Progress Metric Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {progressPercent}%
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Kesiapan Perlengkapan Koper</h3>
              <p className="text-xs text-slate-500">
                {checkedCount} dari {totalCount} barang sudah siap dikemas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Checklist
            </button>
            <button
              onClick={handleResetDefault}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              title="Reset ke Default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="bg-gradient-to-r from-emerald-600 to-amber-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                activeCategory === 'all'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Semua Kategori ({items.length})
            </button>
            {categories.map((cat) => {
              const count = items.filter(i => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyMandatory}
              onChange={(e) => setOnlyMandatory(e.target.checked)}
              className="accent-emerald-700 w-4 h-4 rounded"
            />
            <span>Hanya Barang Wajib</span>
          </label>
        </div>
      </div>

      {/* Checklist Items List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs divide-y divide-slate-100">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className={`py-3.5 px-3 rounded-xl flex items-start justify-between gap-3 cursor-pointer transition-colors ${
              item.checked ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                className={`mt-0.5 shrink-0 ${item.checked ? 'text-emerald-700' : 'text-slate-400'}`}
                aria-label={item.checked ? 'Sudah dicentang' : 'Belum dicentang'}
              >
                {item.checked ? (
                  <CheckSquare className="w-5 h-5 fill-emerald-100" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>

              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs font-bold ${
                    item.checked ? 'text-slate-400 line-through' : 'text-slate-900'
                  }`}>
                    {item.title}
                  </span>
                  {item.isMandatory && (
                    <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded">
                      Wajib
                    </span>
                  )}
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-1.5 py-0.2 rounded">
                    {item.category}
                  </span>
                </div>
                <p className={`text-[11px] ${item.checked ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.description}
                </p>
              </div>
            </div>

            {item.id.startsWith('custom-') && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(item.id);
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Hapus item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-500">
            Tidak ada item perlengkapan pada kategori ini.
          </div>
        )}
      </div>

      {/* Add Custom Item Form */}
      <form
        onSubmit={handleAddItem}
        className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center"
      >
        <div className="w-full sm:w-1/3">
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value as PackingItem['category'])}
            className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="w-full sm:flex-1">
          <input
            type="text"
            placeholder="Tambah barang bawaan pribadi Anda..."
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Tambah Item
        </button>
      </form>
    </div>
  );
};
