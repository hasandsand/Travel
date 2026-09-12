import { UmrahPackage, ManasikStep, PackingItem, BookingRecord, TravelAnnouncement } from '../types';

export const KURS_SAR_TO_IDR = 4300; // 1 SAR = ~Rp 4.300

export const UMRAH_PACKAGES: UmrahPackage[] = [
  {
    id: 'pkg-reguler-9',
    name: 'Paket Umrah Reguler Berkah 9 Hari',
    category: 'reguler',
    badge: 'Paling Populer',
    durationDays: 9,
    departureDate: '2026-10-15',
    returnDate: '2026-10-23',
    departureCity: 'Jakarta (CGK)',
    airline: {
      name: 'Saudia Airlines',
      code: 'SV 817',
      flightType: 'Langsung (Direct)',
    },
    hotelMakkah: {
      name: 'Le Meridien Towers / Anjum Hotel',
      stars: 5,
      distance: '250m dari pelataran Masjidil Haram (Shuttle 24 Jam)',
    },
    hotelMadinah: {
      name: 'Rove Madinah / Frontel Al Harithia',
      stars: 5,
      distance: '150m ke Pintu Utama Masjid Nabawi',
    },
    priceQuad: 29500000,
    priceTriple: 31500000,
    priceDouble: 34500000,
    costBreakdown: {
      tiketPesawatPerPax: 13500000,
      visaTasrehPerPax: 3200000,
      hotelMakkahPerPax: 3800000,
      hotelMadinahPerPax: 2500000,
      busTransportPerPax: 850000,
      handlingPerlengkapanPerPax: 1200000,
      cateringPerPax: 1100000,
      muthawwifTourLeaderPerPax: 500000,
      operationalTravelPerPax: 450000
    },
    quotaTotal: 45,
    quotaRemaining: 8,
    inclusions: [
      'Tiket Pesawat PP Jakarta - Jeddah / Madinah (Direct)',
      'Visa Umrah Elektronik & Tasreh Raudhah Resmi',
      'Hotel Bintang 5 di Makkah & Madinah (Fullboard Buffet Menu Indonesia)',
      'Transportasi Bus Eksekutif AC Mercedes Benz',
      'Muthawwif (Pembimbing Ibadah) bersertifikat & Muthawwifah khusus jamaah wanita',
      'Air Zamzam 5 Liter (sesuai regulasi maskapai)',
      'Perlengkapan Umrah Eksklusif (Koper Fiber 24", Kain Ihram/Mukena, Tas Selempang, Buku Doa, Batik)',
      'Asuransi Perjalanan Umrah & Asuransi Kesehatan Saudi',
      'Handling Bandara Soekarno Hatta & Bandara Saudi'
    ],
    exclusions: [
      'Pembuatan / perpanjangan Paspor pribadi',
      'Vaksin Meningitis & Polio',
      'Pengeluaran pribadi (Laundry, telepon, kelebihan bagasi)',
      'Biaya ziarah atau tour di luar program resmi'
    ],
    highlights: [
      'Penerbangan Direct tanpa transit bersama Saudia Airlines',
      'Hotel Dekat & Nyaman bintang 5 dengan kuliner nusantara 3x sehari',
      'Bimbingan manasik intensif sebelum keberangkatan & di Tanah Suci',
      'Termasuk Tasreh resmi ziarah Raudhah Syarifah'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1000&q=80',
    itinerary: [
      {
        day: 1,
        title: 'Keberangkatan Jakarta menuju Madinah',
        city: 'Madinah Al-Munawwarah',
        activities: [
          'Berkumpul di Lounge Bandara Soekarno Hatta Terminal 3',
          'Briefing dan penyerahan boarding pass & paspor oleh tim handling',
          'Take-off menuju Bandara Prince Mohammad Bin Abdulaziz Madinah',
          'Tiba di Madinah, proses imigrasi & check-in hotel Madinah',
          'Istirahat dan pengenalan area sekitar Masjid Nabawi'
        ]
      },
      {
        day: 2,
        title: 'Ziarah Raudhah & Makam Rasulullah SAW',
        city: 'Madinah Al-Munawwarah',
        activities: [
          'Qiyamullail dan Shalat Shubuh berjamaah di Masjid Nabawi',
          'Ziarah ke Makam Rasulullah SAW, Abu Bakar Ash-Shiddiq, dan Umar bin Khattab RA',
          'Masuk ke Raudhah Syarifah (Taman Surga) dengan tasreh resmi',
          'Kajian fiqih umrah ba’da Ashar di aula hotel'
        ]
      },
      {
        day: 3,
        title: 'Ziarah Luar Kota Madinah',
        city: 'Madinah Al-Munawwarah',
        activities: [
          'Ziarah Masjid Quba (Shalat sunnah 2 rakaat berlipat pahala umrah)',
          'Mengunjungi Kebun Kurma Madinah & percetakan Al-Quran',
          'Ziarah Jabal Uhud & Makam Para Syuhada Uhud',
          'Melewati Masjid Qiblatain dan lokasi Perang Khandaq (Masjid Sab’ah)'
        ]
      },
      {
        day: 4,
        title: 'Perjalanan ke Makkah & Mengambil Miqat di Bir Ali',
        city: 'Makkah Al-Mukarramah',
        activities: [
          'Mandi sunnah ihram dan mengenakan pakaian ihram dari hotel Madinah',
          'Berangkat menuju Stasiun Kereta Cepat Haramain / Bus Eksekutif',
          'Singgah di Masjid Dzulhulaifah (Bir Ali) untuk berniat ihram Umrah',
          'Melafalkan Talbiyah sepanjang perjalanan menuju Makkah Al-Mukarramah',
          'Tiba di Makkah, check-in hotel, makan malam & persiapan fisik',
          'Pelaksanaan Thawaf, Sa’i, dan Tahallul (Umrah Perdana dipandu Muthawwif)'
        ]
      },
      {
        day: 5,
        title: 'Memperbanyak Ibadah di Masjidil Haram',
        city: 'Makkah Al-Mukarramah',
        activities: [
          'Shalat berjamaah 5 waktu di Masjidil Haram (Pahala 100.000x lipat)',
          'Tawaf sunnah dan i’tikaf di depan Ka’bah',
          'Konsultasi ibadah dan evaluasi pelaksanaan umrah perdana'
        ]
      },
      {
        day: 6,
        title: 'Ziarah Kota Makkah & Miqat Ji’ranah (Umrah Kedua)',
        city: 'Makkah Al-Mukarramah',
        activities: [
          'Ziarah napak tilas Jabal Tsur (Gua persembunyian Rasulullah SAW & Abu Bakar)',
          'Melewati Padang Arafah, Jabal Rahmah, Muzdalifah, dan Mina',
          'Menuju Masjid Ji’ranah bagi jamaah yang ingin berniat Umrah kedua (Badal/Pribadi)',
          'Kembali ke Masjidil Haram untuk menuntaskan Thawaf, Sa’i, Tahallul'
        ]
      },
      {
        day: 7,
        title: 'Ibadah Mandiri & Doa di Multazam',
        city: 'Makkah Al-Mukarramah',
        activities: [
          'Waktu leluasa bagi jamaah untuk tadarus Al-Quran dan doa mustajab di Hijir Ismail & Multazam',
          'Wisata belanja kurma, kismis, dan oleh-oleh di Pasar Kakiyah / Mall Safwah'
        ]
      },
      {
        day: 8,
        title: 'Thawaf Wada’ & Perjalanan ke Bandara Jeddah',
        city: 'Jeddah',
        activities: [
          'Pelaksanaan Thawaf Wada’ (Thawaf Perpisahan dengan Ka’bah)',
          'Check-out hotel Makkah dan perjalanan darat menuju Jeddah',
          'City tour Jeddah: Corniche Balad, Masjid Qisas, Laut Merah (tentatif)',
          'Menuju Bandara Internasional King Abdulaziz Jeddah, check-in & boarding'
        ]
      },
      {
        day: 9,
        title: 'Tiba Kembali di Tanah Air',
        city: 'Jakarta (CGK)',
        activities: [
          'Pesawat mendarat di Bandara Internasional Soekarno Hatta Cengkareng',
          'Pengambilan bagasi dan pembagian air zamzam 5 liter',
          'Selesai seluruh rangkaian perjalanan ibadah dengan predikat Umrah Maqbullah'
        ]
      }
    ]
  },
  {
    id: 'pkg-vip-12',
    name: 'Paket Umrah VIP Sultan 12 Hari (Kereta Cepat Haramain)',
    category: 'vip',
    badge: 'VIP Bintang 5',
    durationDays: 12,
    departureDate: '2026-11-05',
    returnDate: '2026-11-16',
    departureCity: 'Jakarta (CGK)',
    airline: {
      name: 'Garuda Indonesia',
      code: 'GA 980',
      flightType: 'Langsung (Direct)',
    },
    hotelMakkah: {
      name: 'Pullman Zamzam Makkah / Fairmont Clock Tower',
      stars: 5,
      distance: 'Pelataran Langsung (Nol Meter dari Ka’bah)',
    },
    hotelMadinah: {
      name: 'The Oberoi Madinah / Dar Al Taqwa',
      stars: 5,
      distance: 'Depan Pintu Utama Masjid Nabawi (Pintu Masuk Raudhah)',
    },
    priceQuad: 39500000,
    priceTriple: 42500000,
    priceDouble: 46500000,
    costBreakdown: {
      tiketPesawatPerPax: 17500000, // Garuda Indonesia Direct PP
      visaTasrehPerPax: 3400000,   // Visa Umrah & Tasreh Raudhah VIP
      hotelMakkahPerPax: 6200000,  // Fairmont Clock Tower Nol Meter
      hotelMadinahPerPax: 4200000, // The Oberoi Madinah depan gerbang
      busTransportPerPax: 1400000, // Kereta Cepat Haramain & Bus VIP
      handlingPerlengkapanPerPax: 1500000, // Koper Rimowa-style & Airport Lounge VIP
      cateringPerPax: 1600000,     // Fullboard buffet bintang 5
      muthawwifTourLeaderPerPax: 750000,  // Asatidz lulusan Madinah
      operationalTravelPerPax: 550000     // Operasional & bimbingan VIP
    },
    quotaTotal: 30,
    quotaRemaining: 4,
    inclusions: [
      'Tiket Pesawat Garuda Indonesia Direct Non-Stop PP (Free Bagasi 30kg + Kabin 7kg)',
      'Tiket Kereta Cepat Haramain High-Speed Train Madinah-Makkah (Hanya 2 Jam)',
      'Hotel Bintang 5 View Ka’bah / Pelataran Nol Meter',
      'Makan 3x sehari Fullboard Buffet Bintang 5 Internasional & Nusantara',
      'Muthawwif Lulusan Universitas Islam Madinah berpengalaman lebih dari 10 tahun',
      'Private Handling VIP Lounge di Bandara Soekarno Hatta & Saudi Arabia',
      'Perlengkapan Koper Rimowa-Style & Batik Sutera Eksklusif',
      'Asuransi Jiwa & Kesehatan Khusus VIP'
    ],
    exclusions: [
      'Pembuatan Paspor pribadi',
      'Vaksin Meningitis',
      'Belanja pribadi'
    ],
    highlights: [
      'Akses Nol Meter: Tinggal turun lift langsung shalat di pelataran Masjidil Haram & Nabawi',
      'Kereta Cepat Haramain Express: Perjalanan Makkah-Madinah bebas macet hanya 2 jam',
      'Dibimbing oleh Ulama & Asatidz terkemuka dengan rasio 1 muthawwif per 15 jamaah'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80',
    itinerary: [
      {
        day: 1,
        title: 'VIP Departure Jakarta menuju Madinah',
        city: 'Madinah Al-Munawwarah',
        activities: ['Pelayanan VIP Lounge di Bandara CGK', 'Penerbangan langsung Garuda Indonesia', 'Check in The Oberoi Madinah']
      },
      {
        day: 2,
        title: 'Ibadah Khusyuk & Ziarah Raudhah VIP',
        city: 'Madinah Al-Munawwarah',
        activities: ['Bimbingan ziarah Raudhah Syarifah khusus', 'Doa mustajab di Babussalam']
      },
      {
        day: 3,
        title: 'Ziarah Bersejarah Kota Madinah',
        city: 'Madinah Al-Munawwarah',
        activities: ['Masjid Quba, Jabal Uhud, Museum Rasulullah SAW']
      },
      {
        day: 4,
        title: 'Kereta Cepat Haramain ke Makkah & Umrah Perdana',
        city: 'Makkah Al-Mukarramah',
        activities: ['Naik Kereta Cepat Haramain Express', 'Miqat di Bir Ali', 'Thawaf, Sa’i, Tahallul di Makkah']
      },
      {
        day: 5,
        title: 'Ibadah Khidmat di Depan Ka’bah',
        city: 'Makkah Al-Mukarramah',
        activities: ['Shalat berjamaah di lantai pelataran', 'Kajian tafsir ayat haji & umrah']
      }
    ]
  },
  {
    id: 'pkg-plus-turki-12',
    name: 'Paket Umrah Plus Turki & Cappadocia 12 Hari',
    category: 'plus',
    badge: 'Wisata Muslim Pilihan',
    durationDays: 12,
    departureDate: '2026-11-20',
    returnDate: '2026-12-02',
    departureCity: 'Jakarta (CGK)',
    airline: {
      name: 'Turkish Airlines',
      code: 'TK 57',
      flightType: 'Transit',
    },
    hotelMakkah: {
      name: 'Swissotel Makkah (Clock Tower)',
      stars: 5,
      distance: 'Akses langsung pintu Masjidil Haram',
    },
    hotelMadinah: {
      name: 'Pullman Zamzam Madinah',
      stars: 5,
      distance: '150m ke pelataran Masjid Nabawi',
    },
    priceQuad: 36500000,
    priceTriple: 39000000,
    priceDouble: 42000000,
    costBreakdown: {
      tiketPesawatPerPax: 15500000, // Turkish Airlines multi-city PP
      visaTasrehPerPax: 3800000,   // Visa Umrah Saudi + Visa Turki
      hotelMakkahPerPax: 4500000,  // Swissotel Makkah
      hotelMadinahPerPax: 3000000, // Pullman Zamzam Madinah + Hotel Istanbul
      busTransportPerPax: 1200000, // Bus turki & transfer Saudi
      handlingPerlengkapanPerPax: 1300000, // Koper, asuransi, handling internasional
      cateringPerPax: 1400000,     // Fullboard buffet Turki & Saudi
      muthawwifTourLeaderPerPax: 650000,  // Tour Leader BNSP & Muthawwif
      operationalTravelPerPax: 500000     // Bosphorus Cruise & operasional
    },
    quotaTotal: 40,
    quotaRemaining: 12,
    inclusions: [
      'Tiket Turkish Airlines PP Jakarta - Istanbul - Madinah - Jeddah - Jakarta',
      'City Tour Istanbul 3 Hari: Blue Mosque, Hagia Sophia, Topkapi Palace, Bosphorus Cruise',
      'Hotel Bintang 5 di Istanbul, Makkah, dan Madinah',
      'Visa Turki & Visa Umrah Saudi Arabia',
      'Makan Fullboard Halal Turkish & Arabic Cuisine',
      'Muthawwif & Tour Leader tersertifikasi BNSP'
    ],
    exclusions: [
      'Hot Air Balloon di Cappadocia (Opsional)',
      'Tipping Guide & Driver Turki ($50)',
      'Pengeluaran pribadi'
    ],
    highlights: [
      'Perpaduan spiritualitas Ibadah Umrah dan jejak kejayaan Khilafah Utsmaniyah di Istanbul',
      'Bosphorus Private Cruise menikmati pemandangan benua Asia & Eropa',
      'Fasilitas hotel bintang 5 premium di seluruh destinasi'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1000&q=80',
    itinerary: [
      {
        day: 1,
        title: 'Jakarta menuju Istanbul, Turki',
        city: 'Istanbul',
        activities: ['Penerbangan internasional Turkish Airlines', 'Tiba di Bandara Istanbul & check in hotel']
      },
      {
        day: 2,
        title: 'Pesona Istanbul: Hagia Sophia & Blue Mosque',
        city: 'Istanbul',
        activities: ['Kunjungan Blue Mosque (Masjid Sultan Ahmed)', 'Museum Hagia Sophia & Istana Topkapi tempat peninggalan pedang Rasulullah SAW', 'Grand Bazaar Istanbul']
      },
      {
        day: 3,
        title: 'Bosphorus Cruise & Terbang ke Madinah',
        city: 'Madinah Al-Munawwarah',
        activities: ['Berlayar di Selat Bosphorus pemisah benua Asia-Eropa', 'Terbang menuju Madinah Al-Munawwarah', 'Tiba di Madinah, istirahat dan ziarah Masjid Nabawi']
      },
      {
        day: 4,
        title: 'Ziarah Raudhah & Masjid Quba',
        city: 'Madinah Al-Munawwarah',
        activities: ['Ziarah Raudhah Syarifah', 'Shalat di Masjid Quba', 'Belanja kurma di perkebunan kurma Madinah']
      }
    ]
  },
  {
    id: 'pkg-ramadhan-14',
    name: 'Paket Umrah Itikaf Ramadhan (10 Hari Terakhir Lailatul Qadar)',
    category: 'ramadhan',
    badge: 'Pahala Seperti Haji Bersama Rasulullah',
    durationDays: 14,
    departureDate: '2027-03-20',
    returnDate: '2027-04-03',
    departureCity: 'Jakarta (CGK)',
    airline: {
      name: 'Saudia Airlines',
      code: 'SV 825',
      flightType: 'Langsung (Direct)',
    },
    hotelMakkah: {
      name: 'Makkah Hotel & Towers (Eks Hilton)',
      stars: 5,
      distance: 'Pelataran Masjidil Haram (Nol Meter)',
    },
    hotelMadinah: {
      name: 'Anwar Al Madinah Mövenpick',
      stars: 5,
      distance: 'Depan Pelataran Masjid Nabawi',
    },
    priceQuad: 48500000,
    priceTriple: 52500000,
    priceDouble: 58500000,
    costBreakdown: {
      tiketPesawatPerPax: 19500000, // Peak season Ramadhan direct Saudia
      visaTasrehPerPax: 3600000,   // Visa Ramadhan & Tasreh Tarawih/Raudhah
      hotelMakkahPerPax: 9800000,  // Eks Hilton Makkah 10 hari akhir
      hotelMadinahPerPax: 4200000, // Anwar Al Madinah Mövenpick
      busTransportPerPax: 1100000, // Transportasi bus full AC
      handlingPerlengkapanPerPax: 1400000, // Handling & logistik Ramadhan
      cateringPerPax: 2200000,     // Sahur & Iftar buffet Ramadhan
      muthawwifTourLeaderPerPax: 850000,  // Asatidz pembimbing i'tikaf Lailatul Qadar
      operationalTravelPerPax: 650000     // Operasional & khataman Quran
    },
    quotaTotal: 35,
    quotaRemaining: 3,
    inclusions: [
      'Penerbangan Direct Saudia Airlines PP',
      'Hotel Bintang 5 Terdekat dengan Pelataran Masjid',
      'Menu Sahur & Iftar (Buka Puasa) Prasmanan Lengkap',
      'Program I’tikaf Khusus di Masjidil Haram mengejar malam Lailatul Qadar',
      'Khataman Al-Quran & Doa bersama Imam Masjidil Haram malam 27 & 29 Ramadhan',
      'Shalat Idul Fitri di Masjidil Haram Makkah'
    ],
    exclusions: [
      'Biaya paspor & vaksin',
      'Pengeluaran pribadi'
    ],
    highlights: [
      'Keutamaan hadits: "Umrah di bulan Ramadhan menyamai pahala haji bersamaku"',
      'Merasakan keagungan Shalat Tarawih, Tahajjud 1 juz/malam, dan Idul Fitri di depan Ka’bah',
      'Lokasi hotel nol meter memudahkan bolak-balik masjid untuk i’tikaf'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
    itinerary: [
      {
        day: 1,
        title: 'Keberangkatan Menuju Madinah Al-Munawwarah',
        city: 'Madinah Al-Munawwarah',
        activities: ['Penerbangan direct Jakarta - Madinah', 'Buka puasa di Masjid Nabawi dengan kurma ajwa dan kahwa']
      },
      {
        day: 2,
        title: 'I’tikaf & Qiyamullail di Masjid Nabawi',
        city: 'Madinah Al-Munawwarah',
        activities: ['Shalat Tarawih berjamaah dipimpin Syaikh Ali Hudhaifi', 'Shalat malam di Raudhah']
      }
    ]
  }
];

export const MANASIK_STEPS: ManasikStep[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    title: 'Ihram & Niat Umrah di Miqat',
    arabicTitle: 'الإحرام والنية من الميقات',
    category: 'Rukun Umrah',
    location: 'Masjid Dzulhulaifah (Bir Ali) / Qarnul Manazil / Yalamlam',
    description: 'Ihram adalah niat memasuki ibadah umrah dengan mengenakan pakaian ihram (bagi pria: dua lembar kain tanpa jahitan; wanita: busana muslimah syar’i menutup aurat kecuali wajah dan telapak tangan). Bersuci dengan mandi sunnah ihram, memakai wewangian di badan sebelum berniat, kemudian melafalkan niat umrah.',
    doaArab: 'لَبَّيْكَ اللَّهُمَّ عُمْرَةً',
    doaLatin: "Labbaika Allahumma 'umratan",
    doaArti: 'Aku penuhi panggilan-Mu ya Allah untuk melaksanakan Umrah.',
    guidelines: [
      'Pria dilarang memakai pakaian berjahit, celana dalam, sepatu menutupi mata kaki, dan penutup kepala.',
      'Wanita dilarang memakai cadar (niqab) dan sarung tangan yang menutupi jari.',
      'Dilarang memotong kuku, mencabut rambut/bulu, memakai wewangian setelah berniat, membunuh hewan buruan, dan bermesraan/berhubungan suami istri.',
      'Perbanyak membaca Talbiyah sepanjang perjalanan menuju Makkah.'
    ]
  },
  {
    id: 'step-2',
    stepNumber: 2,
    title: 'Melantunkan Talbiyah',
    arabicTitle: 'التلبية',
    category: 'Sunnah Umrah',
    location: 'Sepanjang perjalanan dari Miqat hingga memulai Thawaf',
    description: 'Disunnahkan memperbanyak talbiyah dengan suara lantang bagi pria dan suara pelan bagi wanita, diselingi sholawat dan doa.',
    doaArab: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
    doaLatin: "Labbaik Allahumma labbaik, labbaika laa syariika laka labbaik. Innal hamda wan ni'mata laka wal mulk, laa syariika lak.",
    doaArti: 'Aku penuhi panggilan-Mu ya Allah, aku penuhi panggilan-Mu. Tiada sekutu bagi-Mu, aku penuhi panggilan-Mu. Sesungguhnya segala puji, kenikmatan, dan kerajaan hanyalah milik-Mu, tiada sekutu bagi-Mu.',
    guidelines: [
      'Diucapkan terus-menerus saat menaiki kendaraan, mendaki bukit, atau bertemu rombongan lain.',
      'Talbiyah berhenti ketika hendak memulai putaran pertama Thawaf di Rukun Hajar Aswad.'
    ]
  },
  {
    id: 'step-3',
    stepNumber: 3,
    title: 'Thawaf 7 Putaran Mengelilingi Ka’bah',
    arabicTitle: 'طواف القدوم',
    category: 'Rukun Umrah',
    location: 'Mataf (Pelataran Thawaf) Masjidil Haram',
    description: 'Mengelilingi Ka’bah sebanyak 7 putaran berlawanan arah jarum jam (Ka’bah berada di sebelah kiri badan), dimulai dan diakhiri tepat sejajar garis Hajar Aswad.',
    doaArab: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، اللَّهُمَّ إِيمَانًا بِكَ وَتَصْدِيقًا بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ مُحَمَّدٍ ﷺ',
    doaLatin: "Bismillahi wallahu akbar. Allahumma imanan bika wa tashdiqan bikitabika wa wafa'an bi'ahdika wattiba'an lisunnati nabiyyika Muhammadin shallallahu 'alaihi wasallam.",
    doaArti: 'Dengan nama Allah dan Allah Maha Besar. Ya Allah, demi keimanan kepada-Mu, membenarkan kitab-Mu, menepati janji-Mu, dan mengikuti sunnah Nabi-Mu Muhammad ﷺ.',
    guidelines: [
      'Wajib suci dari hadats besar dan kecil (berwudhu). Jika batal di tengah putaran, berwudhu kembali lalu melanjutkan sisa putaran.',
      'Bagi pria, sunnah Idhthiba’ (membuka bahu kanan dan menutup bahu kiri dengan kain ihram) selama thawaf.',
      'Sunnah berlari-lari kecil (raml) pada 3 putaran pertama bagi pria, dan berjalan biasa pada 4 putaran berikutnya.',
      'Saat melintasi antara Rukun Yamani dan Hajar Aswad, disunnahkan membaca doa Sapu Jagad: "Rabbana aatina fiddunya hasanah wa fil akhirati hasanah wa qina \'adzabannar".'
    ]
  },
  {
    id: 'step-4',
    stepNumber: 4,
    title: 'Shalat Sunnah di Maqam Ibrahim & Minum Zamzam',
    arabicTitle: 'صلاة ركعتي الطواف وشرب ماء زمزم',
    category: 'Sunnah Umrah',
    location: 'Belakang Maqam Ibrahim / Seluruh sudut Masjidil Haram',
    description: 'Setelah menyelesaikan 7 putaran thawaf, rapikan kedua bahu (tutup kembali bahu kanan), lalu lakukan shalat sunnah 2 rakaat di belakang Maqam Ibrahim jika memungkinkan, atau di mana saja dalam masjid.',
    doaArab: 'وَاتَّخِذُوا مِن مَّقَامِ إِبْرَاهِيمَ مُصَلًّى',
    doaLatin: "Wattakhidzuu mim maqaami Ibraahiima mushallaa.",
    doaArti: 'Dan jadikanlah sebagian Maqam Ibrahim sebagai tempat shalat (QS. Al-Baqarah: 125).',
    guidelines: [
      'Rakaat pertama membaca Surat Al-Kafirun, rakaat kedua membaca Surat Al-Ikhlas.',
      'Berdoa dengan khusyuk, lalu menuju tempat minum air zamzam.',
      'Minum air zamzam dengan menghadap kiblat, membaca bismillah, bernapas tiga kali, dan membaca doa kesembuhan serta ilmu yang bermanfaat.'
    ]
  },
  {
    id: 'step-5',
    stepNumber: 5,
    title: 'Sa’i 7 Putaran antara Bukit Shafa dan Marwah',
    arabicTitle: 'السعي بين الصفا والمروة',
    category: 'Rukun Umrah',
    location: 'Mas’a (Jalur Sa’i) Masjidil Haram',
    description: 'Berjalan dari bukit Shafa ke Marwah dan sebaliknya sebanyak 7 kali perjalanan. Dimulai dari Shafa (dihitung 1 saat tiba di Marwah, dari Marwah ke Shafa dihitung 2, dan berakhir di Marwah pada hitungan ke-7).',
    doaArab: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ، أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ',
    doaLatin: "Innash shafaa wal marwata min sya'aa'irillaah. Abda'u bimaa bada'allaahu bih.",
    doaArti: 'Sesungguhnya Shafa dan Marwah adalah sebagian dari syiar-syiar Allah. Aku memulai dengan apa yang Allah mulai dengannya.',
    guidelines: [
      'Tidak disyaratkan suci dari hadats kecil/besar (wanita haid boleh melakukan Sa’i asalkan Thawafnya sudah selesai sebelumnya saat suci).',
      'Saat berada di atas bukit Shafa dan Marwah, menghadap ke arah Ka’bah, bertakbir 3 kali, dan mengangkat kedua tangan berdoa.',
      'Bagi pria, disunnahkan berlari-lari kecil di antara dua pilar lampu hijau (bathnul wadi).'
    ]
  },
  {
    id: 'step-6',
    stepNumber: 6,
    title: 'Tahallul (Mencukur / Memotong Rambut)',
    arabicTitle: 'التحلل بالحلق أو التقصير',
    category: 'Rukun Umrah',
    location: 'Bukit Marwah setelah putaran Sa’i ke-7',
    description: 'Mencukur habis (Gundul/Halq) atau memendekkan rambut (Taqshir) minimal 3 helai rambut kepala. Tahallul menandai selesainya seluruh rangkaian ibadah umrah dan gugurnya larangan-larangan ihram.',
    doaArab: 'اللَّهُمَّ اغْفِرْ لِلْمُحَلِّقِينَ، قَالُوا: وَلِلْمُقَصِّرِينَ يَا رَسُولَ اللَّهِ؟ قَالَ: اللَّهُمَّ اغْفِرْ لِلْمُحَلِّقِينَ، قَالُوا: وَلِلْمُقَصِّرِينَ؟ قَالَ: وَلِلْمُقَصِّرِينَ',
    doaLatin: "Allahummaghfir lil muhalliqiin... wa lil muqash-shiriin.",
    doaArti: 'Ya Allah, ampunilah mereka yang mencukur gundul kepalanya... dan juga bagi mereka yang memendekkan rambutnya.',
    guidelines: [
      'Bagi pria, mencukur gundul lebih utama (didoakan ampunan oleh Rasulullah SAW sebanyak 3 kali).',
      'Bagi wanita, cukup memotong ujung rambut sepanjang satu ruas jari telunjuk (sekitar 2 cm).',
      'Setelah tahallul, jamaah boleh mandi, mengenakan pakaian biasa, dan kembali bebas dari larangan ihram.'
    ]
  }
];

export const INITIAL_PACKING_ITEMS: PackingItem[] = [
  {
    id: 'pack-1',
    category: 'Dokumen & Finansial',
    title: 'Paspor Asli (Masa berlaku minimal 7 bulan)',
    description: 'Simpan di tas paspor leher yang selalu melekat di badan.',
    isMandatory: true,
    checked: true
  },
  {
    id: 'pack-2',
    category: 'Dokumen & Finansial',
    title: 'Buku Vaksin Meningitis / Sertifikat Vaksinasi',
    description: 'Diperlukan untuk verifikasi keberangkatan Kemenkes & Saudi.',
    isMandatory: true,
    checked: true
  },
  {
    id: 'pack-3',
    category: 'Dokumen & Finansial',
    title: 'Uang Saku Saudi Riyal (SAR) & Kartu ATM/Debit Visa/Mastercard',
    description: 'Disarankan membawa uang tunai SAR 500 - 1500 untuk infaq dan belanja kecil.',
    isMandatory: true,
    checked: false
  },
  {
    id: 'pack-4',
    category: 'Pakaian & Busana Ihram',
    title: 'Kain Ihram 2 Set (Khusus Pria)',
    description: 'Bahan handuk katun menyerap keringat + Sabuk ihram berkantong.',
    isMandatory: true,
    checked: false
  },
  {
    id: 'pack-5',
    category: 'Pakaian & Busana Ihram',
    title: 'Mukena & Busana Muslimah Syar’i (Khusus Wanita)',
    description: 'Bahan adem, tidak menerawang, kaos kaki wudhu, dan manset tangan.',
    isMandatory: true,
    checked: false
  },
  {
    id: 'pack-6',
    category: 'Pakaian & Busana Ihram',
    title: 'Sandal Jepit / Sandal Haji yang Tidak Menutupi Mata Kaki',
    description: 'Gunakan sandal yang nyaman dan bawa kantong kresek/serut untuk simpan sandal di masjid.',
    isMandatory: true,
    checked: false
  },
  {
    id: 'pack-7',
    category: 'Kesehatan & Pribadi',
    title: 'Obat Pribadi, Tolak Angin, dan Multivitamin',
    description: 'Obat batuk, flu, tetes mata (udara kering), plester, dan vitamin C/D.',
    isMandatory: true,
    checked: false
  },
  {
    id: 'pack-8',
    category: 'Kesehatan & Pribadi',
    title: 'Sunblock & Lip Balm Non-Parfum (Aman untuk Ihram)',
    description: 'Melindungi kulit dan bibir dari pecah-pecah akibat cuaca panas/kering.',
    isMandatory: false,
    checked: false
  },
  {
    id: 'pack-9',
    category: 'Aksesoris & Elektronik',
    title: 'Universal Plug Adapter (Colokan Kaki 3 Standar Saudi)',
    description: 'Konektor stop kontak tipe G standar Kerajaan Arab Saudi.',
    isMandatory: true,
    checked: false
  },
  {
    id: 'pack-10',
    category: 'Aksesoris & Elektronik',
    title: 'Powerbank (Maksimal 20.000 mAh - Dibawa ke Kabin)',
    description: 'Peraturan penerbangan: dilarang memasukkan powerbank ke dalam koper bagasi.',
    isMandatory: true,
    checked: false
  },
  {
    id: 'pack-11',
    category: 'Ibadah & Doa',
    title: 'Buku Doa Umrah & Al-Quran Kecil / Aplikasi Digital',
    description: 'Buku saku praktis panduan doa thawaf dan sa’i.',
    isMandatory: true,
    checked: true
  },
  {
    id: 'pack-12',
    category: 'Ibadah & Doa',
    title: 'Sajadah Tipis Travel & Semprotan Air Wudhu',
    description: 'Sangat berguna saat shalat di pelataran luar masjid atau saat menunggu waktu shalat.',
    isMandatory: false,
    checked: false
  }
];

export const DEMO_BOOKINGS: BookingRecord[] = [
  {
    bookingCode: 'UMR-2026-8941',
    createdAt: '2026-09-08',
    packageId: 'pkg-reguler-9',
    packageName: 'Paket Umrah Reguler Berkah 9 Hari',
    departureDate: '2026-10-15',
    roomType: 'quad',
    contactName: 'H. Ahmad Fauzan',
    contactEmail: 'ahmad.fauzan@gmail.com',
    contactPhone: '081298765432',
    totalPriceIdr: 59000000,
    totalPriceSar: 13720,
    status: 'Penerbitan Visa',
    paymentStatus: 'Lunas',
    paidAmountIdr: 59000000,
    muthawwif: {
      name: 'Ustadz Dr. Muhammad Faisal, Lc., M.A.',
      phone: '081288997711',
      title: 'Alumni Univ. Islam Madinah • Pembimbing Utama'
    },
    flightNumber: 'SV 817 (Saudia Direct CGK-JED)',
    pnrCode: 'KRM8812',
    visaNumber: 'VISA-E-8829104',
    logisticsStatus: {
      koper: 'Sudah Diterima',
      seragam: 'Sudah Diterima',
      bukuDoa: 'Sudah Diterima'
    },
    manasikSchedule: {
      date: '2026-10-04',
      time: '08:00 - 15:00 WIB',
      location: 'Asrama Haji Pondok Gede - Gedung Serbaguna 2',
      notes: 'Wajib membawa seragam batik dan hadir 15 menit sebelum pembukaan.'
    },
    adminNotes: 'Jamaah langganan keluarga besar, kamar lantai rendah dekat lift.',
    pilgrims: [
      {
        id: 'plg-1',
        fullName: 'Ahmad Fauzan',
        nikKtp: '3171021405820001',
        passportNumber: 'C8912344',
        passportExpiry: '2031-08-10',
        gender: 'L',
        birthDate: '1982-05-14',
        clothSize: 'XL',
        phone: '081298765432',
        documents: [
          {
            id: 'doc-1',
            type: 'passport',
            title: 'Scan Paspor Asli',
            fileName: 'Paspor_Ahmad_Fauzan.jpg',
            fileSize: 425000,
            fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
            uploadedAt: '08 Sep 2026 14:20',
            verificationStatus: 'Terverifikasi'
          },
          {
            id: 'doc-2',
            type: 'ktp',
            title: 'Foto e-KTP',
            fileName: 'KTP_Ahmad_Fauzan.jpg',
            fileSize: 310000,
            fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
            uploadedAt: '08 Sep 2026 14:21',
            verificationStatus: 'Terverifikasi'
          }
        ]
      },
      {
        id: 'plg-2',
        fullName: 'Siti Rahmawati',
        nikKtp: '3171025508850002',
        passportNumber: 'C8912345',
        passportExpiry: '2031-08-10',
        gender: 'P',
        birthDate: '1985-08-15',
        clothSize: 'M',
        phone: '081298765433',
        documents: [
          {
            id: 'doc-3',
            type: 'passport',
            title: 'Scan Paspor Asli',
            fileName: 'Paspor_Siti_Rahmawati.jpg',
            fileSize: 410000,
            fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
            uploadedAt: '08 Sep 2026 14:25',
            verificationStatus: 'Terverifikasi'
          },
          {
            id: 'doc-4',
            type: 'ktp',
            title: 'Foto e-KTP',
            fileName: 'KTP_Siti_Rahmawati.jpg',
            fileSize: 295000,
            fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
            uploadedAt: '08 Sep 2026 14:26',
            verificationStatus: 'Terverifikasi'
          }
        ]
      }
    ],
    notes: 'Koper dan seragam batik sudah diterima. Menunggu jadwal manasik tatap muka di Asrama Haji.'
  },
  {
    bookingCode: 'UMR-2026-9214',
    createdAt: '2026-09-10',
    packageId: 'pkg-vip-12',
    packageName: 'Paket Umrah VIP Sultan 12 Hari (Kereta Cepat Haramain)',
    departureDate: '2026-11-05',
    roomType: 'double',
    contactName: 'Ir. Budi Hendrawan',
    contactEmail: 'budi.hendrawan@yahoo.com',
    contactPhone: '08118822334',
    totalPriceIdr: 93000000,
    totalPriceSar: 21627,
    status: 'Verifikasi Dokumen',
    paymentStatus: 'DP Terverifikasi',
    paidAmountIdr: 20000000,
    muthawwif: {
      name: 'Ustadz Ahmad Zaki, Lc.',
      phone: '081377889900',
      title: 'Muthawwif Senior Berpengalaman 12 Tahun'
    },
    flightNumber: 'GA 980 (Garuda Indonesia Direct)',
    pnrCode: 'KRM9214',
    logisticsStatus: {
      koper: 'Siap Diambil',
      seragam: 'Siap Diambil',
      bukuDoa: 'Sudah Diterima'
    },
    manasikSchedule: {
      date: '2026-10-24',
      time: '09:00 - 15:30 WIB',
      location: 'Hotel Sahid Jaya Ballroom 1 - Jakarta Pusat',
      notes: 'Bimbingan khusus program VIP Sultan & simulasi tawaf sa’i indoor.'
    },
    adminNotes: 'Permintaan kursi roda standby untuk ziarah luar kota.',
    pilgrims: [
      {
        id: 'plg-3',
        fullName: 'Budi Hendrawan',
        nikKtp: '3273110906780004',
        passportNumber: 'B4412091',
        passportExpiry: '2030-12-05',
        gender: 'L',
        birthDate: '1978-06-09',
        clothSize: 'L',
        phone: '08118822334'
      },
      {
        id: 'plg-4',
        fullName: 'Dewi Lestari',
        nikKtp: '3273114510800003',
        passportNumber: 'B4412092',
        passportExpiry: '2030-12-05',
        gender: 'P',
        birthDate: '1980-10-05',
        clothSize: 'S',
        phone: '08118822335'
      }
    ],
    notes: 'Permintaan kamar double non-smoking dengan pemandangan menghadap pelataran.'
  },
  {
    bookingCode: 'UMR-2026-7330',
    createdAt: '2026-09-11',
    packageId: 'pkg-plus-turki-12',
    packageName: 'Paket Umrah Plus Turki 12 Hari (Bosphorus Cruise)',
    departureDate: '2026-11-20',
    roomType: 'triple',
    contactName: 'Hj. Nuraini Kusuma',
    contactEmail: 'nuraini.kusuma@gmail.com',
    contactPhone: '081399887766',
    totalPriceIdr: 124500000,
    totalPriceSar: 28953,
    status: 'Pendaftaran Diterima',
    paymentStatus: 'Menunggu DP',
    paidAmountIdr: 0,
    muthawwif: {
      name: 'Ustadz H. Syamsuddin, Lc.',
      phone: '081234567890',
      title: 'Tour Leader & Muthawwif Turki Specialist'
    },
    logisticsStatus: {
      koper: 'Belum Diambil',
      seragam: 'Belum Diambil',
      bukuDoa: 'Belum Diambil'
    },
    manasikSchedule: {
      date: '2026-11-08',
      time: '08:30 - 15:00 WIB',
      location: 'Grand Mercure Kemayoran Ballroom',
      notes: 'Briefing manasik dan persiapan musim dingin di Istanbul.'
    },
    adminNotes: 'Menunggu pembayaran DP via transfer Bank Syariah Indonesia.',
    pilgrims: [
      {
        id: 'plg-5',
        fullName: 'Nuraini Kusuma',
        nikKtp: '3174095509750001',
        passportNumber: 'X1029384',
        passportExpiry: '2029-04-12',
        gender: 'P',
        birthDate: '1975-09-15',
        clothSize: 'L',
        phone: '081399887766'
      },
      {
        id: 'plg-6',
        fullName: 'Rizky Pratama',
        nikKtp: '3174091204010002',
        passportNumber: 'X1029385',
        passportExpiry: '2030-01-20',
        gender: 'L',
        birthDate: '2001-04-12',
        clothSize: 'M',
        phone: '081399887767'
      },
      {
        id: 'plg-7',
        fullName: 'Aisyah Putri',
        nikKtp: '3174096008040003',
        passportNumber: 'X1029386',
        passportExpiry: '2030-06-15',
        gender: 'P',
        birthDate: '2004-08-20',
        clothSize: 'S',
        phone: '081399887768'
      }
    ],
    notes: 'Mohon info mengenai cuaca Turki bulan November.'
  },
  {
    bookingCode: 'UMR-2026-6490',
    createdAt: '2026-08-15',
    packageId: 'pkg-reguler-9',
    packageName: 'Paket Umrah Reguler Berkah 9 Hari',
    departureDate: '2026-10-15',
    roomType: 'triple',
    contactName: 'Drs. H. Subagyo',
    contactEmail: 'subagyo.h@gmail.com',
    contactPhone: '081512345678',
    totalPriceIdr: 94500000,
    totalPriceSar: 21976,
    status: 'Siap Berangkat',
    paymentStatus: 'Lunas',
    paidAmountIdr: 94500000,
    muthawwif: {
      name: 'Ustadz Dr. Muhammad Faisal, Lc., M.A.',
      phone: '081288997711',
      title: 'Pembimbing Utama PPIU'
    },
    flightNumber: 'SV 817 (Saudia Direct)',
    pnrCode: 'KRM6490',
    visaNumber: 'VISA-E-8831091',
    logisticsStatus: {
      koper: 'Sudah Diterima',
      seragam: 'Sudah Diterima',
      bukuDoa: 'Sudah Diterima'
    },
    pilgrims: [
      {
        id: 'plg-8',
        fullName: 'Subagyo Wibowo',
        nikKtp: '3374011203650001',
        passportNumber: 'E9120381',
        passportExpiry: '2031-04-10',
        gender: 'L',
        birthDate: '1965-03-12',
        clothSize: 'XL',
        phone: '081512345678'
      },
      {
        id: 'plg-9',
        fullName: 'Endang Sulistyowati',
        nikKtp: '3374015007680002',
        passportNumber: 'E9120382',
        passportExpiry: '2031-04-10',
        gender: 'P',
        birthDate: '1968-07-10',
        clothSize: 'L',
        phone: '081512345679'
      },
      {
        id: 'plg-10',
        fullName: 'Dimas Anugrah Subagyo',
        nikKtp: '3374012010990003',
        passportNumber: 'E9120383',
        passportExpiry: '2031-05-12',
        gender: 'L',
        birthDate: '1999-10-20',
        clothSize: 'L',
        phone: '081512345680'
      }
    ],
    notes: 'Keluarga jamaah repeat order dari program tahun 2024.'
  },
  {
    bookingCode: 'UMR-2026-5521',
    createdAt: '2026-09-02',
    packageId: 'pkg-vip-12',
    packageName: 'Paket Umrah VIP Sultan 12 Hari (Kereta Cepat Haramain)',
    departureDate: '2026-11-05',
    roomType: 'quad',
    contactName: 'Dr. Hendra Gunawan, Sp.PD',
    contactEmail: 'hendra.gunawan@hospital.co.id',
    contactPhone: '081822334455',
    totalPriceIdr: 158000000,
    totalPriceSar: 36744,
    status: 'Verifikasi Dokumen',
    paymentStatus: 'DP Terverifikasi',
    paidAmountIdr: 50000000,
    muthawwif: {
      name: 'Ustadz Ahmad Zaki, Lc.',
      phone: '081377889900',
      title: 'Muthawwif Senior VIP'
    },
    flightNumber: 'GA 980 (Garuda Direct)',
    pnrCode: 'KRM5521',
    logisticsStatus: {
      koper: 'Siap Diambil',
      seragam: 'Siap Diambil',
      bukuDoa: 'Sudah Diterima'
    },
    pilgrims: [
      {
        id: 'plg-11',
        fullName: 'Hendra Gunawan',
        nikKtp: '3172011502720001',
        passportNumber: 'B8821901',
        passportExpiry: '2031-09-15',
        gender: 'L',
        birthDate: '1972-02-15',
        clothSize: 'XL',
        phone: '081822334455'
      },
      {
        id: 'plg-12',
        fullName: 'Ratna Juwita',
        nikKtp: '3172015206750002',
        passportNumber: 'B8821902',
        passportExpiry: '2031-09-15',
        gender: 'P',
        birthDate: '1975-06-12',
        clothSize: 'M',
        phone: '081822334456'
      },
      {
        id: 'plg-13',
        fullName: 'Faris Gunawan',
        nikKtp: '3172012011030003',
        passportNumber: 'B8821903',
        passportExpiry: '2031-10-01',
        gender: 'L',
        birthDate: '2003-11-20',
        clothSize: 'L',
        phone: '081822334457'
      },
      {
        id: 'plg-14',
        fullName: 'Nabila Gunawan',
        nikKtp: '3172016508060004',
        passportNumber: 'B8821904',
        passportExpiry: '2031-10-01',
        gender: 'P',
        birthDate: '2006-08-25',
        clothSize: 'S',
        phone: '081822334458'
      }
    ],
    notes: 'Rombongan keluarga dokter, pelunasan dijadwalkan akhir September.'
  },
  {
    bookingCode: 'UMR-2027-3108',
    createdAt: '2026-09-05',
    packageId: 'pkg-ramadhan-14',
    packageName: 'Paket Umrah Itikaf Ramadhan (10 Hari Terakhir Lailatul Qadar)',
    departureDate: '2027-03-20',
    roomType: 'double',
    contactName: 'H. Mansyur Hidayat',
    contactEmail: 'mansyur.hidayat@pertamina.com',
    contactPhone: '08119988112',
    totalPriceIdr: 117000000,
    totalPriceSar: 27209,
    status: 'Verifikasi Dokumen',
    paymentStatus: 'DP Terverifikasi',
    paidAmountIdr: 40000000,
    muthawwif: {
      name: 'Ustadz Dr. Muhammad Faisal, Lc., M.A.',
      phone: '081288997711',
      title: 'Pembimbing Khusus I’tikaf Ramadhan'
    },
    flightNumber: 'SV 825 (Saudia Direct)',
    pnrCode: 'KRM3108',
    logisticsStatus: {
      koper: 'Belum Diambil',
      seragam: 'Belum Diambil',
      bukuDoa: 'Belum Diambil'
    },
    pilgrims: [
      {
        id: 'plg-15',
        fullName: 'Mansyur Hidayat',
        nikKtp: '3275011904670001',
        passportNumber: 'A7102911',
        passportExpiry: '2032-01-20',
        gender: 'L',
        birthDate: '1967-04-19',
        clothSize: 'XXL',
        phone: '08119988112'
      },
      {
        id: 'plg-16',
        fullName: 'Siti Maryam',
        nikKtp: '3275015509700002',
        passportNumber: 'A7102912',
        passportExpiry: '2032-01-20',
        gender: 'P',
        birthDate: '1970-09-15',
        clothSize: 'XL',
        phone: '08119988113'
      }
    ],
    notes: 'Program i’tikaf 10 hari terakhir Ramadhan di Masjidil Haram.'
  },
  {
    bookingCode: 'UMR-2026-4419',
    createdAt: '2026-08-28',
    packageId: 'pkg-plus-turki-12',
    packageName: 'Paket Umrah Plus Turki & Cappadocia 12 Hari',
    departureDate: '2026-11-20',
    roomType: 'double',
    contactName: 'Ferry Ardiansyah',
    contactEmail: 'ferry.ardiansyah@gmail.com',
    contactPhone: '081233441122',
    totalPriceIdr: 84000000,
    totalPriceSar: 19534,
    status: 'Penerbitan Visa',
    paymentStatus: 'Lunas',
    paidAmountIdr: 84000000,
    muthawwif: {
      name: 'Ustadz H. Syamsuddin, Lc.',
      phone: '081234567890',
      title: 'Tour Leader Turki & Muthawwif'
    },
    flightNumber: 'TK 57 (Turkish Airlines)',
    pnrCode: 'KRM4419',
    visaNumber: 'VISA-TR-99120',
    logisticsStatus: {
      koper: 'Sudah Diterima',
      seragam: 'Sudah Diterima',
      bukuDoa: 'Sudah Diterima'
    },
    pilgrims: [
      {
        id: 'plg-17',
        fullName: 'Ferry Ardiansyah',
        nikKtp: '3171092003880005',
        passportNumber: 'C1920391',
        passportExpiry: '2031-11-10',
        gender: 'L',
        birthDate: '1988-03-20',
        clothSize: 'L',
        phone: '081233441122'
      },
      {
        id: 'plg-18',
        fullName: 'Dina Safitri',
        nikKtp: '3171096105900006',
        passportNumber: 'C1920392',
        passportExpiry: '2031-11-10',
        gender: 'P',
        birthDate: '1990-05-21',
        clothSize: 'M',
        phone: '081233441123'
      }
    ],
    notes: 'Bulan madu & ibadah umrah, permohonan kamar view Bosphorus di Istanbul.'
  }
];

export const DEFAULT_ANNOUNCEMENTS: TravelAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Jadwal Manasik Akbar Keberangkatan Oktober & November 2026',
    category: 'Manasik',
    date: '10 Sep 2026',
    badge: 'Wajib Hadir',
    content: 'Diberitahukan kepada seluruh calon jamaah rombongan Oktober dan November, Manasik Akbar tatap muka akan dilaksanakan di Asrama Haji Pondok Gede. Silakan kenakan seragam batik resmi Wisata Islami Kareem.'
  },
  {
    id: 'ann-2',
    title: 'Pengambilan Koper & Perlengkapan di Kantor Pusat Travel',
    category: 'Logistik',
    date: '08 Sep 2026',
    badge: 'Logistik',
    content: 'Perlengkapan umrah (koper fiber 24", kain ihram/mukena, tas paspor, buku doa, dan seragam) sudah siap diambil di kantor cabang terdekat atau dikirimkan via ekspedisi khusus.'
  },
  {
    id: 'ann-3',
    title: 'Update Regulasi e-Visa & Tasreh Raudhah Kemenag Saudi',
    category: 'Penting',
    date: '05 Sep 2026',
    badge: 'Info Resmi',
    content: 'Seluruh Tasreh resmi kunjungan Raudhah Syarifah di Masjid Nabawi diterbitkan melalui sistem Nusuk / Kemenag RI oleh tim handling Saudi kami. Jamaah tidak perlu mendaftar mandiri.'
  }
];

export const TAWAF_ROUNDS = [
  {
    round: 1,
    title: 'Putaran ke-1 (Mulai dari Hajar Aswad)',
    doaArab: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، اللَّهُمَّ إِيمَانًا بِكَ وَتَصْدِيقًا بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ مُحَمَّدٍ ﷺ',
    doaLatin: "Bismillahi wallahu akbar. Allahumma imanan bika wa tashdiqan bikitabika wa wafa'an bi'ahdika wattiba'an lisunnati nabiyyika Muhammadin ﷺ.",
    arti: 'Dengan nama Allah, Allah Maha Besar. Ya Allah, demi keimanan kepada-Mu, membenarkan kitab-Mu, menepati janji-Mu, dan mengikuti sunnah Nabi-Mu Muhammad ﷺ.'
  },
  {
    round: 2,
    title: 'Putaran ke-2',
    doaArab: 'اللَّهُمَّ إِنَّ هَذَا الْبَيْتَ بَيْتُكَ، وَالْحَرَمَ حَرَمُكَ، وَالأَمْنَ أَمْنُكَ، وَهَذَا مَقَامُ الْعَائِذِ بِكَ مِنَ النَّارِ، فَحَرِّمْ لُحُومَنَا وَبَشَرَتَنَا عَلَى النَّارِ',
    doaLatin: "Allahumma inna hadzal baita baituka, wal harama haramuka, wal amna amnuka, wa hadza maqaamul 'a-idzi bika minan naar, faharrim luhuumanaa wa basyarotanaa 'alan naar.",
    arti: 'Ya Allah, sesungguhnya Bait ini adalah rumah-Mu, tanah haram ini tanah haram-Mu, ketenteraman ini ketenteraman-Mu, dan tempat ini tempat orang berlindung kepada-Mu dari siksa neraka. Haramkanlah daging dan kulit kami dari api neraka.'
  },
  {
    round: 3,
    title: 'Putaran ke-3',
    doaArab: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الشَّكِّ وَالشِّرْكِ وَالشِّقَاقِ وَالنِّفَاقِ وَسُوءِ الأَخْلاقِ، وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالأَهْلِ وَالْوَلَدِ',
    doaLatin: "Allahumma inni a'udzu bika minasy syakki wasy syirki wasy syiqaqi wan nifaaqi wa suu-il akhlaaq, wa suu-il munqalabi fil maali wal ahli wal walad.",
    arti: 'Ya Allah, aku berlindung kepada-Mu dari keraguan, kemusyrikan, perpecahan, kemunafikan, akhlak buruk, dan buruknya tempat kembali dalam urusan harta, keluarga, dan anak-anak.'
  },
  {
    round: 4,
    title: 'Putaran ke-4',
    doaArab: 'اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا، وَسَعْيًا مَشْكُورًا، وَذَنْبًا مَغْفُورًا، وَعَمَلاً صَالِحًا مَقْبُولاً، وَتِجَارَةً لَنْ تَبُورَ، يَا عَالِمَ مَا فِي الصُّدُورِ',
    doaLatin: "Allahummaj'alhu hajjan mabruuraa, wa sa'yan masjkuuraa, wa dzanban maghfuuraa, wa 'amalan shaalihan maqbuulaa, wa tijaaratan lan tabuur, yaa 'aalima maa fish shuduur.",
    arti: 'Ya Allah, jadikanlah ibadah ini haji/umrah yang mabrur, sa’i yang disyukuri, dosa yang diampuni, amal shalih yang diterima, dan perniagaan yang tiada merugi, wahai Dzat Yang Maha Mengetahui rahasia di dalam dada.'
  },
  {
    round: 5,
    title: 'Putaran ke-5',
    doaArab: 'اللَّهُمَّ أَظِلَّنِي تَحْتَ ظِلِّ عَرْشِكَ يَوْمَ لا ظِلَّ إِلاَّ ظِلُّكَ، وَلا بَاقِيَ إِلاَّ وَجْهُكَ، وَاسْقِنِي مِنْ حَوْضِ نَبِيِّكَ مُحَمَّدٍ ﷺ شَرْبَةً هَنِيئَةً لا أَظْمَأُ بَعْدَهَا أَبَدًا',
    doaLatin: "Allahumma adzillani tahta dzilli 'arsyika yauma laa dzilla illaa dzilluk, wa laa baaqiya illaa wajhuk, wasqini min haudhi nabiyyika Muhammadin ﷺ syarbatan hanii-atan laa adzma-u ba'dahaa abadaa.",
    arti: 'Ya Allah, naungilah aku di bawah naungan arsy-Mu pada hari yang tiada naungan selain naungan-Mu, dan berilah aku minum dari telaga Nabi-Mu Muhammad ﷺ dengan tegukan yang lezat sehingga aku tidak pernah haus lagi selamanya.'
  },
  {
    round: 6,
    title: 'Putaran ke-6',
    doaArab: 'اللَّهُمَّ إِنَّ لَكَ عَلَيَّ حُقُوقًا كَثِيرَةً فِيمَا بَيْنِي وَبَيْنَكَ، وَحُقُوقًا كَثِيرَةً فِيمَا بَيْنِي وَبَيْنَ خَلْقِكَ، اللَّهُمَّ مَا كَانَ لَكَ مِنْهَا فَاغْفِرْهُ لِي، وَمَا كَانَ لِخَلْقِكَ فَتَحَمَّلْهُ عَنِّي',
    doaLatin: "Allahumma inna laka 'alayya huquuqan katsiiratan fiimaa baini wa bainaka, wa huquuqan katsiiratan fiimaa baini wa baina khalqik, Allahumma maa kaana laka minhaa faghfirhu li, wa maa kaana likhalqika fatahammalhu 'anni.",
    arti: 'Ya Allah, sesungguhnya Engkau memiliki banyak hak atasku dalam hubungan antaraku dan Engkau, dan hak dalam hubungan antaraku dan makhluk-Mu. Ya Allah, apa yang menjadi hak-Mu maka ampunilah aku, dan apa yang menjadi hak makhluk-Mu maka tanggungkanlah dariku.'
  },
  {
    round: 7,
    title: 'Putaran ke-7 (Putaran Terakhir Menuju Maqam Ibrahim)',
    doaArab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ إِيمَانًا كَامِلاً، وَيَقِينًا صَادِقًا، وَرِزْقًا وَاسِعًا، وَقَلْبًا خَاشِعًا، وَلِسَانًا ذَاكِرًا، وَتَوْبَةً نَصُوحًا قَبْلَ الْمَوْتِ، وَرَاحَةً عِنْدَ الْمَوْتِ، وَمَغْفِرَةً بَعْدَ الْمَوْتِ',
    doaLatin: "Allahumma inni as-aluka iimaanan kaamilaa, wa yaqiinan shaadiqaa, wa rizqan waasi'aa, wa qalban khaasyi'aa, wa lisaanan dzaakiraa, wa taubatan nashuuhaa qablal maut, wa raahatan 'indal maut, wa maghfiratan ba'dal maut.",
    arti: 'Ya Allah, aku memohon kepada-Mu iman yang sempurna, keyakinan yang benar, rezeki yang luas, hati yang khusyuk, lisan yang senantiasa berdzikir, taubat nasuha sebelum ajal tiba, ketenangan di saat ajal menjemput, dan ampunan setelah kematian.'
  }
];

export const SAI_ROUNDS = [
  {
    round: 1,
    from: 'Shafa',
    to: 'Marwah',
    doaArab: 'اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    doaLatin: "Allahu Akbar, Allahu Akbar, Allahu Akbar, wa lillaahil hamd. Laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu yuhyii wa yumiitu wa Huwa 'alaa kulli syai-in qadiir.",
    arti: 'Allah Maha Besar, Allah Maha Besar, Allah Maha Besar, segala puji bagi Allah. Tiada sesembahan yang berhak disembah selain Allah semata tanpa sekutu, bagi-Nya kerajaan dan segala puji, Dia menghidupkan dan mematikan, dan Dia Maha Kuasa atas segala sesuatu.'
  },
  {
    round: 2,
    from: 'Marwah',
    to: 'Shafa',
    doaArab: 'رَبِّ اغْفِرْ وَارْحَمْ، وَاعْفُ وَتَكَرَّمْ، وَتَجَاوَزْ عَمَّا تَعْلَمُ، إِنَّكَ تَعْلَمُ مَا لا نَعْلَمُ، إِنَّكَ أَنْتَ اللَّهُ الأَعَزُّ الأَكْرَمُ',
    doaLatin: "Rabbighfir warham, wa'fu wa takarram, wa tajaawaz 'amma ta'lam, innaka ta'lamu maa laa na'lam, innaka antallaahul a'azzul akram.",
    arti: 'Wahai Tuhanku, ampunilah, sayangilah, maafkanlah, muliakanlah, dan hapuslah dosa-dosa yang Engkau ketahui. Sesungguhnya Engkau mengetahui apa yang kami tidak ketahui, sungguh Engkau adalah Allah Yang Maha Mulia dan Maha Pemurah.'
  },
  {
    round: 3,
    from: 'Shafa',
    to: 'Marwah',
    doaArab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِ مَا تَعْلَمُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا تَعْلَمُ، وَأَسْتَغْفِرُكَ مِنْ كُلِّ مَا تَعْلَمُ، إِنَّكَ أَنْتَ عَلاَّمُ الْغُيُوبِ',
    doaLatin: "Allahumma inni as-aluka min khairi maa ta'lam, wa a'udzu bika min syarri maa ta'lam, wa astaghfiruka min kulli maa ta'lam, innaka anta 'allaamul ghuyuub.",
    arti: 'Ya Allah, aku memohon kebaikan dari apa yang Engkau ketahui, berlindung kepada-Mu dari keburukan yang Engkau ketahui, dan memohon ampunan-Mu atas segala yang Engkau ketahui. Sungguh Engkau Maha Mengetahui perkara ghaib.'
  },
  {
    round: 4,
    from: 'Marwah',
    to: 'Shafa',
    doaArab: 'اللَّهُمَّ ثَبِّتْ قَلْبِي عَلَى دِينِكَ، وَطَاعَتِكَ، وَحُسْنِ عِبَادَتِكَ، وَأَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    doaLatin: "Allahumma tsabbit qalbi 'alaa diinika, wa thaa'atika, wa husni 'ibaadatika, wa a'inni 'alaa dzikrika wa syukrika wa husni 'ibaadatik.",
    arti: 'Ya Allah, tetapkanlah hatiku di atas agama-Mu, ketaatan kepada-Mu, dan kebagusan ibadah kepada-Mu, serta tolonglah aku untuk selalu berdzikir, bersyukur, dan beribadah dengan baik.'
  },
  {
    round: 5,
    from: 'Shafa',
    to: 'Marwah',
    doaArab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مُوجِبَاتِ رَحْمَتِكَ، وَعَزَائِمَ مَغْفِرَتِكَ، وَالسَّلامَةَ مِنْ كُلِّ إِثْمٍ، وَالْغَنِيمَةَ مِنْ كُلِّ بِرٍّ، وَالْفَوْزَ بِالْجَنَّةِ، وَالنَّجَاةَ مِنَ النَّارِ',
    doaLatin: "Allahumma inni as-aluka muujibaati rahmatik, wa 'azaa-ima maghfiratik, was salaamata min kulli itsm, wal ghaniimata min kulli birr, wal fauza bil jannah, wan najaata minan naar.",
    arti: 'Ya Allah, aku memohon hal-hal yang mendatangkan rahmat-Mu, kepastian ampunan-Mu, keselamatan dari segala dosa, perolehan segala kebajikan, keberuntungan meraih surga, dan keselamatan dari siksa api neraka.'
  },
  {
    round: 6,
    from: 'Marwah',
    to: 'Shafa',
    doaArab: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ، رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ',
    doaLatin: "Rabbanaa aatinaa fid dunyaa hasanah wa fil aakhirati hasanah wa qinaa 'adzaaban naar. Rabbanaa taqabbal minnaa innaka antas samii'ul 'aliim.",
    arti: 'Ya Tuhan kami, berikanlah kami kebaikan di dunia dan kebaikan di akhirat serta lindungilah kami dari siksa api neraka. Ya Tuhan kami terimalah dari kami amalan kami, sungguh Engkau Maha Mendengar lagi Maha Mengetahui.'
  },
  {
    round: 7,
    from: 'Shafa',
    to: 'Marwah (Selesai di Marwah Menuju Tahallul)',
    doaArab: 'اللَّهُمَّ حَبِّبْ إِلَيْنَا الإِيمَانَ وَزَيِّنْهُ فِي قُلُوبِنَا، وَكَرِّهْ إِلَيْنَا الْكُفْرَ وَالْفُسُوقَ وَالْعِصْيَانَ، وَاجْعَلْنَا مِنَ الرَّاشِدِينَ',
    doaLatin: "Allahumma habbib ilainal iimaana wa zayyinhu fii quluubinaa, wa karrih ilainal kufra wal fusuuqa wal 'ishyaan, waj'alnaa minar raasyidiin.",
    arti: 'Ya Allah, jadikanlah kami mencintai keimanan dan hiasilah keimanan itu dalam hati kami, serta bencilah kepada kami kekufuran, kefasikan, dan kedurhakaan, dan jadikanlah kami termasuk orang-orang yang mengikuti jalan yang lurus.'
  }
];
