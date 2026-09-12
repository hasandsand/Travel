import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Trash2, 
  Eye, 
  AlertCircle, 
  X, 
  Sparkles, 
  FileCheck,
  Shield,
  FileSpreadsheet
} from 'lucide-react';
import { Pilgrim, PilgrimDocument } from '../types';

interface DocumentUploadZoneProps {
  pilgrim: Pilgrim;
  pilgrimIndex: number;
  onAddDocument: (pilgrimIndex: number, doc: PilgrimDocument) => void;
  onRemoveDocument: (pilgrimIndex: number, docId: string) => void;
}

const DOCUMENT_PRESETS: { type: PilgrimDocument['type']; title: string; required: boolean; desc: string }[] = [
  { 
    type: 'passport', 
    title: 'Scan / Foto Paspor Asli', 
    required: true, 
    desc: 'Halaman biodata paspor (masa berlaku min. 7 bulan sebelum berangkat)' 
  },
  { 
    type: 'ktp', 
    title: 'Foto e-KTP Asli', 
    required: true, 
    desc: 'Foto jelas e-KTP tanpa pantulan cahaya untuk verifikasi Kemenag RI' 
  },
  { 
    type: 'vaccine', 
    title: 'Sertifikat Vaksin Meningitis / Polio', 
    required: false, 
    desc: 'Buku kuning ICV atau sertifikat resmi SatuSehat' 
  },
  { 
    type: 'family_card', 
    title: 'Kartu Keluarga / Buku Nikah', 
    required: false, 
    desc: 'Diperlukan untuk pendaftaran jamaah keluarga / suami-istri' 
  }
];

export const DocumentUploadZone: React.FC<DocumentUploadZoneProps> = ({
  pilgrim,
  pilgrimIndex,
  onAddDocument,
  onRemoveDocument
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<PilgrimDocument['type']>('passport');
  const [previewModalDoc, setPreviewModalDoc] = useState<PilgrimDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const docs = pilgrim.documents || [];

  const handleFileProcess = (file: File) => {
    if (!file) return;

    // Check size limit: max 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const resultUrl = e.target?.result as string;
      const matchedPreset = DOCUMENT_PRESETS.find(p => p.type === selectedDocType);
      
      const newDoc: PilgrimDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        type: selectedDocType,
        title: matchedPreset ? matchedPreset.title : 'Dokumen Persyaratan',
        fileName: file.name,
        fileSize: file.size,
        fileUrl: resultUrl,
        uploadedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        verificationStatus: 'Menunggu Verifikasi'
      };

      onAddDocument(pilgrimIndex, newDoc);

      // Auto select next missing document type
      const currentTypes = [...docs.map(d => d.type), selectedDocType];
      const nextMissing = DOCUMENT_PRESETS.find(p => !currentTypes.includes(p.type));
      if (nextMissing) {
        setSelectedDocType(nextMissing.type);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileProcess(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
    // reset input so same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper demo document simulation for testing
  const handleSimulateDemoDoc = (type: PilgrimDocument['type']) => {
    const isPassport = type === 'passport';
    const isKtp = type === 'ktp';
    
    // Clean SVG mockup for passport or KTP
    const svgContent = isPassport 
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="#044d29">
          <rect width="600" height="400" rx="16" fill="#034827"/>
          <rect x="20" y="20" width="560" height="360" rx="10" fill="#fdfcf7" stroke="#e0d6b5" stroke-width="4"/>
          <text x="300" y="60" font-family="sans-serif" font-size="20" font-weight="bold" fill="#034827" text-anchor="middle">REPUBLIK INDONESIA</text>
          <text x="300" y="85" font-family="sans-serif" font-size="16" font-weight="bold" fill="#b08d35" text-anchor="middle">PASPOR / PASSPORT</text>
          <rect x="50" y="110" width="130" height="170" fill="#d1e7dd" rx="8" stroke="#0f5132" stroke-width="2"/>
          <circle cx="115" cy="170" r="35" fill="#0f5132"/>
          <path d="M75 250 Q115 210 155 250 Z" fill="#0f5132"/>
          <text x="210" y="140" font-family="sans-serif" font-size="13" font-weight="bold" fill="#333">NAMA / FULL NAME:</text>
          <text x="210" y="165" font-family="sans-serif" font-size="16" font-weight="bold" fill="#034827">${(pilgrim.fullName || 'AHMAD FAUZAN').toUpperCase()}</text>
          <text x="210" y="200" font-family="sans-serif" font-size="13" font-weight="bold" fill="#333">NO. PASPOR / PASSPORT NO:</text>
          <text x="210" y="225" font-family="sans-serif" font-size="16" font-weight="bold" fill="#034827">${pilgrim.passportNumber || 'C8912344'}</text>
          <text x="210" y="260" font-family="sans-serif" font-size="13" font-weight="bold" fill="#333">BERLAKU S/D / EXPIRY DATE:</text>
          <text x="210" y="285" font-family="sans-serif" font-size="14" font-weight="bold" fill="#034827">15 OKT 2034</text>
          <rect x="50" y="310" width="500" height="45" fill="#e9ecef" rx="4"/>
          <text x="60" y="338" font-family="monospace" font-size="15" fill="#212529">P&lt;IDN${(pilgrim.fullName || 'FAUZAN').replace(/\s+/g, '&lt;')}<<<<<<<<<<<<<<<<<<</text>
        </svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380" fill="#205493">
          <rect width="600" height="380" rx="16" fill="#1b4d89"/>
          <rect x="15" y="15" width="570" height="350" rx="12" fill="#d9e8f5" stroke="#90b8dc" stroke-width="3"/>
          <text x="300" y="55" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0d2e5c" text-anchor="middle">PROVINSI DKI JAKARTA</text>
          <text x="300" y="75" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0d2e5c" text-anchor="middle">KOTA JAKARTA SELATAN</text>
          <text x="50" y="115" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0d2e5c">NIK : ${pilgrim.nikKtp || '3171021405820001'}</text>
          <rect x="420" y="100" width="130" height="170" fill="#bee3f8" rx="8" stroke="#2b6cb0" stroke-width="2"/>
          <circle cx="485" cy="160" r="35" fill="#2b6cb0"/>
          <path d="M445 240 Q485 200 525 240 Z" fill="#2b6cb0"/>
          <text x="50" y="150" font-family="sans-serif" font-size="13" fill="#333">Nama : ${(pilgrim.fullName || 'AHMAD FAUZAN').toUpperCase()}</text>
          <text x="50" y="180" font-family="sans-serif" font-size="13" fill="#333">Tempat/Tgl Lahir : JAKARTA, 14-05-1982</text>
          <text x="50" y="210" font-family="sans-serif" font-size="13" fill="#333">Jenis Kelamin : LAKI-LAKI</text>
          <text x="50" y="240" font-family="sans-serif" font-size="13" fill="#333">Alamat : JL. TB SIMATUPANG NO. 18</text>
          <text x="50" y="270" font-family="sans-serif" font-size="13" fill="#333">Agama : ISLAM</text>
          <text x="50" y="300" font-family="sans-serif" font-size="13" fill="#333">Status Perkawinan : KAWIN</text>
          <text x="50" y="330" font-family="sans-serif" font-size="13" fill="#333">Kewarganegaraan : WNI</text>
        </svg>`;

    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
    const matchedPreset = DOCUMENT_PRESETS.find(p => p.type === type);

    const demoDoc: PilgrimDocument = {
      id: `doc-demo-${Date.now()}`,
      type,
      title: matchedPreset ? matchedPreset.title : 'Dokumen Terverifikasi',
      fileName: isPassport ? `Scan_Paspor_${(pilgrim.fullName || 'Jamaah').replace(/\s+/g, '_')}.jpg` : `eKTP_${(pilgrim.fullName || 'Jamaah').replace(/\s+/g, '_')}.jpg`,
      fileSize: 342 * 1024,
      fileUrl: dataUrl,
      uploadedAt: 'Baru saja (Simulasi Demo)',
      verificationStatus: 'Terverifikasi'
    };

    onAddDocument(pilgrimIndex, demoDoc);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const hasPassport = docs.some(d => d.type === 'passport');
  const hasKtp = docs.some(d => d.type === 'ktp');

  return (
    <div className="space-y-4">
      {/* Hidden native input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        id={`file-input-${pilgrimIndex}`}
      />

      {/* Upload Header & Checklist Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
        <div>
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-emerald-700" />
            Unggah Dokumen Persyaratan • {pilgrim.fullName || `Jamaah #${pilgrimIndex + 1}`}
          </h4>
          <p className="text-[11px] text-slate-500">
            Format file didukung: JPG, PNG, WEBP, atau PDF (Maks. 10 MB per berkas)
          </p>
        </div>

        {/* Status completion badges */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold">
          <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${
            hasPassport ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${hasPassport ? 'bg-emerald-600' : 'bg-rose-600'}`} />
            Paspor {hasPassport ? '✓' : '(Wajib)'}
          </span>
          <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${
            hasKtp ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${hasKtp ? 'bg-emerald-600' : 'bg-rose-600'}`} />
            KTP {hasKtp ? '✓' : '(Wajib)'}
          </span>
        </div>
      </div>

      {/* Target Document Selector Pills */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
          Pilih Jenis Dokumen yang Ingin Diunggah:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DOCUMENT_PRESETS.map((preset) => {
            const isAlreadyUploaded = docs.some(d => d.type === preset.type);
            const isSelected = selectedDocType === preset.type;
            return (
              <button
                key={preset.type}
                type="button"
                onClick={() => setSelectedDocType(preset.type)}
                className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                    preset.required ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {preset.required ? 'Wajib' : 'Opsional'}
                  </span>
                  {isAlreadyUploaded && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </div>
                <span className="text-xs line-clamp-1">{preset.title.replace('Scan / Foto ', '').replace('Foto ', '')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Drag & Drop Upload Zone Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all select-none ${
          isDragging
            ? 'border-emerald-600 bg-emerald-50/70 scale-[0.99]'
            : 'border-slate-300 bg-slate-50/60 hover:bg-slate-100/70 hover:border-emerald-500'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
            <UploadCloud className="w-6 h-6 animate-bounce" />
          </div>

          <div>
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              Tarik & Lepas file ke sini, atau <span className="text-emerald-700 underline underline-offset-2">Pilih Berkas dari Perangkat</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Untuk mengunggah: <strong className="text-emerald-900">{DOCUMENT_PRESETS.find(p => p.type === selectedDocType)?.title}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400">
            <span>Maksimal 10 MB</span>
            <span>•</span>
            <span>JPG, PNG, PDF</span>
          </div>
        </div>
      </div>

      {/* Quick Demo Simulator Buttons for Testing */}
      <div className="bg-slate-100 p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2 border border-slate-200">
        <span className="text-[11px] text-slate-600 flex items-center gap-1 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Uji Coba Cepat (Auto-Fill Demo):
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleSimulateDemoDoc('passport')}
            className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-300 text-slate-700 rounded-lg text-[11px] font-bold transition-colors"
          >
            + Paspor Demo
          </button>
          <button
            type="button"
            onClick={() => handleSimulateDemoDoc('ktp')}
            className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-300 text-slate-700 rounded-lg text-[11px] font-bold transition-colors"
          >
            + e-KTP Demo
          </button>
        </div>
      </div>

      {/* List of Uploaded Documents for this Pilgrim */}
      {docs.length > 0 && (
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Berkas Terunggah ({docs.length} Dokumen):
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {docs.map((doc) => {
              const isImage = doc.fileUrl.startsWith('data:image/') || doc.fileName.match(/\.(jpg|jpeg|png|webp)$/i);
              return (
                <div
                  key={doc.id}
                  className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Thumbnail / Icon */}
                    <div 
                      onClick={() => setPreviewModalDoc(doc)}
                      className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer group"
                    >
                      {isImage ? (
                        <img
                          src={doc.fileUrl}
                          alt={doc.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <FileText className="w-6 h-6 text-emerald-700" />
                      )}
                    </div>

                    <div className="overflow-hidden space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 block truncate" title={doc.fileName}>
                        {doc.title}
                      </span>
                      <p className="text-[10px] text-slate-500 truncate" title={doc.fileName}>
                        {doc.fileName} • {formatBytes(doc.fileSize)}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        {doc.verificationStatus}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewModalDoc(doc)}
                      className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Lihat Pratinjau Dokumen"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveDocument(pilgrimIndex, doc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Hapus Dokumen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Security & Verification Notice */}
      <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-3 text-[11px] text-emerald-950 flex items-start gap-2">
        <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Keamanan & Kerahasiaan Data Dokumen:</p>
          <p className="text-slate-600 leading-tight mt-0.5">
            Dokumen paspor & identitas jamaah dienkripsi secara aman dan hanya digunakan oleh tim biro untuk pengajuan Visa Umrah Muassasah Saudi serta pendaftaran manifest Siskopatuh Kemenag RI.
          </p>
        </div>
      </div>

      {/* Lightbox / Preview Modal */}
      {previewModalDoc && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h5 className="font-bold text-sm">{previewModalDoc.title}</h5>
                <p className="text-[11px] text-slate-400">{previewModalDoc.fileName} • {previewModalDoc.uploadedAt}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalDoc(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-auto flex items-center justify-center bg-slate-100 flex-1 min-h-[300px]">
              {previewModalDoc.fileUrl.startsWith('data:image/') || previewModalDoc.fileName.match(/\.(jpg|jpeg|png|webp|svg)$/i) ? (
                <img
                  src={previewModalDoc.fileUrl}
                  alt={previewModalDoc.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[65vh] max-w-full rounded-lg shadow-md object-contain"
                />
              ) : (
                <div className="text-center p-8 space-y-3">
                  <FileText className="w-16 h-16 text-emerald-700 mx-auto" />
                  <p className="font-bold text-slate-800 text-sm">{previewModalDoc.fileName}</p>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold">
                    File PDF Berhasil Diunggah
                  </span>
                </div>
              )}
            </div>

            <div className="p-3 bg-white border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewModalDoc(null)}
                className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
