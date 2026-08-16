import Link from "next/link";

const coverage = [
  {
    title: "Artikel dan penjelasan AI",
    description: "Membahas konsep, perkembangan, dan dampak AI dengan bahasa yang mudah dipahami.",
  },
  {
    title: "Tutorial praktis",
    description: "Panduan bertahap untuk menggunakan AI dalam belajar, bekerja, riset, dan produktivitas.",
  },
  {
    title: "Tools dan model AI",
    description: "Informasi fitur, kegunaan, keterbatasan, harga, dan konteks penggunaan layanan AI.",
  },
  {
    title: "Glossary dan perbandingan",
    description: "Penjelasan istilah serta perbandingan yang membantu pembaca mengambil keputusan.",
  },
  {
    title: "Prompt siap disesuaikan",
    description: "Contoh prompt yang dapat dikembangkan sesuai kebutuhan, bukan sekadar disalin.",
  },
  {
    title: "Penggunaan AI bertanggung jawab",
    description: "Mendorong verifikasi, keamanan data, transparansi, dan pemahaman terhadap risiko AI.",
  },
];

const principles = [
  {
    title: "Mengutamakan pembaca",
    description: "Konten dibuat untuk menjawab kebutuhan nyata pembaca, bukan hanya mengejar kata kunci.",
  },
  {
    title: "Jelas dan terstruktur",
    description: "Istilah teknis dijelaskan melalui konteks, contoh, langkah, serta batasan yang relevan.",
  },
  {
    title: "Berbasis sumber",
    description: "Informasi penting diupayakan merujuk dokumentasi resmi dan sumber yang dapat diperiksa.",
  },
  {
    title: "Transparan terhadap AI",
    description: "Alat AI dapat membantu proses editorial, tetapi hasilnya tetap perlu diperiksa secara kritis.",
  },
  {
    title: "Terbuka terhadap koreksi",
    description: "Konten dapat diperbarui ketika ditemukan kekeliruan atau tersedia informasi yang lebih baru.",
  },
  {
    title: "Independen dan bertanggung jawab",
    description: "Manfaat, kekurangan, risiko, dan konteks penggunaan disampaikan secara seimbang.",
  },
];

export default function Page() {
  return (
    <main className="page">
      <section className="container content">
        <small>TENTANG</small>
        <h1>Tentang AIUpdateId</h1>

        <p style={{ fontSize: "1.15rem" }}>
          AIUpdateId adalah portal informasi berbahasa Indonesia yang membantu
          pembaca memahami kecerdasan buatan secara jelas, praktis, kritis, dan
          bertanggung jawab.
        </p>

        <div
          style={{
            margin: "1.5rem 0",
            padding: "1.5rem",
            borderRadius: "18px",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            background: "rgba(37, 99, 235, 0.08)",
          }}
        >
          <strong>Misi AIUpdateId</strong>
          <p style={{ marginBottom: 0 }}>
            Membantu masyarakat Indonesia memahami cara kerja, manfaat,
            keterbatasan, dan dampak AI agar teknologi ini dapat digunakan
            dengan lebih tepat—bukan sekadar mengikuti tren.
          </p>
        </div>

        <h2>Mengapa AIUpdateId dibuat?</h2>

        <p>
          Informasi tentang AI berkembang sangat cepat, tetapi sering kali
          terlalu teknis, terlalu promosi, atau tidak memberikan konteks yang
          cukup bagi pengguna Indonesia.
        </p>

        <p>
          AIUpdateId hadir untuk menjembatani kesenjangan tersebut melalui
          penjelasan yang sederhana tanpa menghilangkan bagian penting seperti
          risiko, keterbatasan, privasi, biaya, dan kebutuhan verifikasi.
        </p>

        <h2>Apa yang diterbitkan?</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "1rem",
            margin: "1rem 0 2rem",
          }}
        >
          {coverage.map((item) => (
            <article
              key={item.title}
              style={{
                padding: "1.2rem",
                borderRadius: "16px",
                border: "1px solid rgba(59, 130, 246, 0.22)",
                background: "rgba(59, 130, 246, 0.05)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>{item.title}</h3>
              <p style={{ marginBottom: 0 }}>{item.description}</p>
            </article>
          ))}
        </div>

        <h2>Untuk siapa AIUpdateId?</h2>

        <ul>
          <li>Pemula yang baru mengenal AI dan membutuhkan fondasi yang jelas.</li>
          <li>Pelajar dan pendidik yang ingin menggunakan AI secara bertanggung jawab.</li>
          <li>Pekerja dan kreator yang mencari workflow praktis.</li>
          <li>Pelaku usaha yang ingin memahami peluang dan risiko tools AI.</li>
          <li>Pembaca yang ingin mengikuti perkembangan AI tanpa kehilangan konteks.</li>
        </ul>

        <h2>Prinsip editorial</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "1rem",
            margin: "1rem 0 2rem",
          }}
        >
          {principles.map((item) => (
            <article
              key={item.title}
              style={{
                padding: "1.2rem",
                borderRadius: "16px",
                border: "1px solid rgba(59, 130, 246, 0.22)",
                background: "rgba(59, 130, 246, 0.05)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>{item.title}</h3>
              <p style={{ marginBottom: 0 }}>{item.description}</p>
            </article>
          ))}
        </div>

        <h2>Bagaimana konten disusun?</h2>

        <ol>
          <li>Menentukan kebutuhan dan pertanyaan utama pembaca.</li>
          <li>Memeriksa informasi melalui dokumentasi dan sumber relevan.</li>
          <li>Menambahkan konteks, contoh, manfaat, keterbatasan, serta risiko.</li>
          <li>Menyusun informasi dalam bahasa Indonesia yang jelas dan terstruktur.</li>
          <li>Memperbarui konten ketika tersedia perubahan penting.</li>
        </ol>

        <h2>Transparansi penggunaan AI</h2>

        <p>
          AIUpdateId dapat menggunakan teknologi AI untuk membantu riset awal,
          penyusunan struktur, pemeriksaan bahasa, dan pembuatan ilustrasi.
          Namun, keluaran AI tidak seharusnya diterima tanpa pemeriksaan karena
          dapat mengandung kesalahan atau kehilangan konteks.
        </p>

        <h2>Koreksi dan kerja sama</h2>

        <p>
          AIUpdateId terbuka terhadap koreksi fakta, masukan pembaca, dan
          peluang kerja sama yang relevan. Informasi lengkap tersedia di{" "}
          <Link href="/kontak">halaman Kontak</Link>.
        </p>

        <div
          style={{
            marginTop: "2rem",
            padding: "1.4rem",
            borderRadius: "18px",
            background: "linear-gradient(135deg, rgba(21, 101, 216, 0.16), rgba(39, 149, 237, 0.08))",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Mulai menjelajahi AIUpdateId</h2>
          <p>
            Pelajari konsep dasar melalui artikel atau temukan layanan yang
            sesuai melalui direktori Tools AI.
          </p>
          <p style={{ marginBottom: 0 }}>
            <Link href="/artikel">Jelajahi artikel</Link>
            {" · "}
            <Link href="/tools">Lihat Tools AI</Link>
            {" · "}
            <Link href="/glossary">Buka Glossary AI</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
