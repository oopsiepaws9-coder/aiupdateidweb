export const portalCategories = [
  { name: "Berita AI", slug: "berita-ai", description: "Perkembangan terbaru dari industri kecerdasan buatan." },
  { name: "Tools AI", slug: "tools-ai", description: "Pilihan alat AI untuk berbagai kebutuhan." },
  { name: "Tutorial", slug: "tutorial", description: "Panduan praktis menggunakan teknologi AI." },
  { name: "Review", slug: "review", description: "Ulasan jujur layanan dan produk AI." },
  { name: "Prompt AI", slug: "prompt-ai", description: "Kumpulan prompt siap pakai." }
];

export const aiTools = [
  { slug:"chatgpt", name:"ChatGPT", category:"Chatbot", pricing:"Gratis & Berbayar", rating:4.8, description:"Asisten AI serbaguna untuk menulis, belajar, riset, dan coding.", featured:true },
  { slug:"claude", name:"Claude", category:"Chatbot", pricing:"Gratis & Berbayar", rating:4.7, description:"Asisten AI untuk analisis dokumen, penulisan, dan penalaran panjang.", featured:true },
  { slug:"gemini", name:"Gemini", category:"Chatbot", pricing:"Gratis & Berbayar", rating:4.6, description:"Asisten AI Google yang terhubung dengan berbagai layanan produktivitas.", featured:true },
  { slug:"midjourney", name:"Midjourney", category:"Gambar", pricing:"Berbayar", rating:4.7, description:"Generator gambar AI untuk ilustrasi dan konsep visual.", featured:false },
  { slug:"perplexity", name:"Perplexity", category:"Riset", pricing:"Gratis & Berbayar", rating:4.6, description:"Mesin pencarian berbasis AI dengan sumber dan ringkasan.", featured:false },
  { slug:"github-copilot", name:"GitHub Copilot", category:"Coding", pricing:"Berbayar", rating:4.7, description:"Asisten coding untuk membantu menulis dan memahami kode.", featured:false }
];

export const promptLibrary = [
  { slug:"artikel-seo", title:"Prompt Artikel SEO", category:"Penulisan", prompt:"Buat artikel SEO tentang [TOPIK] untuk pembaca [TARGET], gunakan bahasa Indonesia yang jelas, sertakan struktur H2/H3, contoh, FAQ, dan kesimpulan.", description:"Membuat kerangka dan draf artikel SEO." },
  { slug:"ringkasan-dokumen", title:"Prompt Ringkasan Dokumen", category:"Produktivitas", prompt:"Ringkas dokumen berikut menjadi: inti pembahasan, fakta penting, keputusan, risiko, dan tindak lanjut. Jangan menambahkan informasi yang tidak ada.", description:"Meringkas dokumen panjang secara terstruktur." },
  { slug:"ide-konten", title:"Prompt Ide Konten 30 Hari", category:"Marketing", prompt:"Buat kalender konten 30 hari untuk bisnis [JENIS BISNIS], target audiens [AUDIENS], dengan format, ide hook, CTA, dan tujuan setiap konten.", description:"Menyusun kalender konten bulanan." },
  { slug:"belajar-topik", title:"Prompt Belajar Bertahap", category:"Pendidikan", prompt:"Ajarkan saya [TOPIK] dari tingkat pemula hingga menengah. Gunakan analogi sederhana, contoh, latihan, dan kuis singkat di setiap tahap.", description:"Belajar konsep secara bertahap." },
  { slug:"analisis-bisnis", title:"Prompt Analisis Bisnis", category:"Bisnis", prompt:"Analisis ide bisnis [IDE] berdasarkan target pasar, masalah pelanggan, solusi, pesaing, sumber pendapatan, biaya, risiko, dan langkah validasi.", description:"Mengevaluasi ide bisnis secara sistematis." },
  { slug:"perbaikan-tulisan", title:"Prompt Editor Profesional", category:"Penulisan", prompt:"Perbaiki teks berikut agar lebih jelas, profesional, ringkas, dan alami. Pertahankan makna, hindari klaim berlebihan, lalu jelaskan perubahan utama.", description:"Mengedit tulisan menjadi lebih profesional." }
];
