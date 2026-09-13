export type ClaimStatus = "TERVERIFIKASI" | "DIDUKUNG SEBAGIAN" | "BERTENTANGAN" | "BELUM TERVERIFIKASI";
export type SourceType = "Dokumentasi resmi" | "Situs/perusahaan resmi" | "Paper/riset" | "Pemerintah/regulator/universitas" | "Laporan riset" | "Media kredibel" | "Komunitas";

export type SourceItem = {
  id: string;
  title: string;
  sourceType: SourceType;
  tier: number;
  freshness: string;
  note: string;
};

export type ClaimItem = {
  id: string;
  claim: string;
  status: ClaimStatus;
  evidence: string;
  sourceId?: string;
  explanation: string;
  humanReview: boolean;
};

export type ResearchReport = {
  question: string;
  summary: string;
  sources: SourceItem[];
  claims: ClaimItem[];
  contradictions: string[];
  unverified: string[];
  freshnessWarnings: string[];
  humanReview: string[];
  finalNotes: string;
  demoOnly: boolean;
};

const demoSources: SourceItem[] = [
  {id:"s1",title:"Sample official model documentation",sourceType:"Dokumentasi resmi",tier:1,freshness:"Contoh data — bukan sumber live",note:"Placeholder untuk menunjukkan bagaimana dokumentasi resmi akan diprioritaskan."},
  {id:"s2",title:"Sample vendor product documentation",sourceType:"Situs/perusahaan resmi",tier:2,freshness:"Contoh data — bukan sumber live",note:"Placeholder untuk membandingkan klaim produk dari vendor."},
  {id:"s3",title:"Sample independent benchmark report",sourceType:"Laporan riset",tier:5,freshness:"Contoh data — bukan sumber live",note:"Placeholder untuk bukti independen dan keterbatasan benchmark."},
];

export const defaultReport: ResearchReport = {
  question:"Apakah Gemini lebih baik daripada ChatGPT untuk membaca dokumen panjang?",
  summary:"Demo ini menunjukkan struktur verifikasi, bukan kesimpulan faktual tentang Gemini atau ChatGPT. Tidak ada klaim produk di bawah yang boleh diperlakukan sebagai fakta tanpa sumber live yang diperiksa ulang.",
  demoOnly:true,
  sources:demoSources,
  claims:[
    {id:"c1",claim:"Model A memiliki kapasitas konteks lebih besar daripada Model B.",status:"BELUM TERVERIFIKASI",evidence:"Belum ada sumber live di prototype ini.",explanation:"Klaim kuantitatif harus diperiksa pada dokumentasi resmi terbaru karena limit model dapat berubah.",humanReview:true},
    {id:"c2",claim:"Kapasitas konteks yang lebih besar otomatis berarti pemahaman dokumen lebih baik.",status:"BERTENTANGAN",evidence:"Kapasitas input dan kualitas penalaran adalah dua hal berbeda; prototype belum memiliki benchmark live yang cukup untuk menyimpulkan hubungan langsung.",sourceId:"s3",explanation:"Perlu benchmark yang relevan dengan tugas nyata, bukan hanya panjang konteks.",humanReview:true},
    {id:"c3",claim:"Pilihan terbaik bergantung pada jenis dokumen, kebutuhan kutipan, workflow, dan kualitas reasoning.",status:"DIDUKUNG SEBAGIAN",evidence:"Ini adalah hipotesis produk yang masuk akal, tetapi tetap harus dibuktikan lewat skenario uji yang terdefinisi.",sourceId:"s3",explanation:"Status sengaja konservatif karena data demo tidak cukup untuk verifikasi penuh.",humanReview:true},
  ],
  contradictions:["Klaim pemasaran tentang context window tidak boleh disamakan dengan kualitas ekstraksi, sitasi, atau reasoning pada dokumen panjang."],
  unverified:["Limit konteks aktual setiap model", "Kualitas citation pada dokumen panjang", "Performa pada multi-hop reasoning", "Perbedaan perilaku pada PDF, spreadsheet, dan dokumen campuran"],
  freshnessWarnings:["Semua data pada demo ini adalah sample/mock. Fitur, model, limit, dan paket harus diverifikasi ulang sebelum publikasi."],
  humanReview:["Buka dokumentasi resmi terbaru kedua vendor", "Uji file yang sama pada model yang dibandingkan", "Catat kegagalan ekstraksi, sitasi, dan reasoning", "Pisahkan pengalaman pengguna dari klaim teknis"],
  finalNotes:"Prototype ini memvalidasi alur Claim → Evidence → Source → Status → Human Review. Tahap berikutnya baru boleh menghubungkan sumber live atau model AI setelah UX terbukti berguna.",
};

export function buildCustomReport(question: string, sourceText: string): ResearchReport {
  const cleanQuestion = question.trim() || "Pertanyaan belum diisi";
  const cleanSource = sourceText.trim();
  return {
    question:cleanQuestion,
    summary: cleanSource ? "Sumber manual telah ditambahkan, tetapi prototype deterministik ini tidak menganggap isi sumber sebagai fakta. Klaim tetap menunggu verifikasi manusia." : "Belum ada sumber yang dapat diperiksa. Tambahkan sumber sebelum menarik kesimpulan.",
    demoOnly:true,
    sources: cleanSource ? [{id:"custom-1",title:"Sumber manual pengguna",sourceType:"Dokumentasi resmi",tier:1,freshness:"Tanggal tidak tersedia",note:"Teks/URL dimasukkan manual. Jenis sumber perlu dikonfirmasi manusia."}] : [],
    claims:[{id:"custom-claim",claim:cleanQuestion,status:"BELUM TERVERIFIKASI",evidence:cleanSource ? "Ada bahan sumber, tetapi belum dianalisis atau diverifikasi oleh sistem live." : "Tidak ada bukti yang tersedia.",sourceId:cleanSource?"custom-1":undefined,explanation:"Prototype tahap pertama sengaja tidak membuat klaim otomatis dari teks pengguna untuk menghindari ilusi verifikasi.",humanReview:true}],
    contradictions:[],
    unverified:[cleanQuestion],
    freshnessWarnings:["Tanggal publikasi, perubahan fitur, dan konteks sumber belum diverifikasi."],
    humanReview:["Konfirmasi identitas dan tanggal sumber", "Tentukan klaim spesifik yang benar-benar didukung", "Cari sumber primer pembanding", "Tandai bagian yang berupa opini atau pengalaman"],
    finalNotes:"Belum ada kesimpulan faktual. Status tetap BELUM TERVERIFIKASI sampai bukti dan sumber diperiksa.",
  };
}
