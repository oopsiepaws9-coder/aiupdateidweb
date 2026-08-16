import Link from "next/link";

export default function Page() {
  return (
    <main className="page">
      <section className="container content">
        <small>LEGAL</small>
        <h1>Kebijakan Privasi</h1>

        <p>
          Terakhir diperbarui:{" "}
          <time dateTime="2026-08-16">16 Agustus 2026</time>
        </p>

        <div
          style={{
            margin: "1.5rem 0",
            padding: "1.4rem",
            borderRadius: "18px",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            background: "rgba(37, 99, 235, 0.08)",
          }}
        >
          <strong>Ringkasan privasi</strong>
          <p style={{ marginBottom: 0 }}>
            AIUpdateId hanya menggunakan data yang diperlukan untuk
            menjalankan layanan, menanggapi pesan, mengirimkan newsletter
            apabila diminta, menjaga keamanan, dan memperbaiki pengalaman
            pengguna. AIUpdateId tidak menjual data pribadi pengguna.
          </p>
        </div>

        <h2>1. Tentang kebijakan ini</h2>

        <p>
          Kebijakan ini menjelaskan jenis data yang dapat diproses ketika Anda
          mengunjungi AIUpdateId, berlangganan newsletter, atau menghubungi
          redaksi. Kebijakan ini disusun dengan memperhatikan prinsip
          pelindungan data yang berlaku di Indonesia.
        </p>

        <h2>2. Data yang dapat diproses</h2>

        <ul>
          <li>
            <strong>Data yang Anda berikan:</strong> alamat email newsletter,
            alamat email pengirim, nama jika dicantumkan, serta isi pesan yang
            dikirimkan kepada redaksi.
          </li>
          <li>
            <strong>Data teknis:</strong> alamat IP, jenis perangkat, browser,
            waktu akses, halaman yang dikunjungi, dan catatan keamanan yang
            dapat diproses otomatis oleh layanan hosting.
          </li>
          <li>
            <strong>Data performa:</strong> informasi teknis mengenai kecepatan
            dan kestabilan halaman apabila fitur pengukuran performa diaktifkan.
          </li>
        </ul>

        <p>
          AIUpdateId tidak meminta pengguna mengirimkan kata sandi, kode OTP,
          API key, data keuangan, atau dokumen identitas.
        </p>

        <h2>3. Tujuan penggunaan data</h2>

        <ul>
          <li>Mengirimkan newsletter yang diminta pengguna.</li>
          <li>Menanggapi pertanyaan, koreksi, dan permintaan pengguna.</li>
          <li>Menjaga keamanan dan mencegah penyalahgunaan situs.</li>
          <li>Menganalisis serta meningkatkan performa dan kualitas layanan.</li>
          <li>Memenuhi kewajiban hukum yang berlaku.</li>
        </ul>

        <h2>4. Dasar pemrosesan</h2>

        <p>
          Data diproses berdasarkan persetujuan pengguna, kebutuhan untuk
          memberikan layanan yang diminta, kepentingan yang sah dan
          proporsional dalam menjaga keamanan situs, atau dasar lain yang
          diperbolehkan oleh peraturan yang berlaku.
        </p>

        <h2>5. Layanan pihak ketiga</h2>

        <p>
          AIUpdateId menggunakan penyedia teknologi untuk menjalankan situs,
          termasuk:
        </p>

        <ul>
          <li>
            <strong>Vercel</strong> untuk hosting, jaringan pengiriman konten,
            log teknis, dan pengukuran performa.
          </li>
          <li>
            <strong>Supabase</strong> untuk database, penyimpanan media, dan
            data layanan seperti langganan newsletter.
          </li>
        </ul>

        <p>
          Penyedia tersebut dapat memproses data teknis sesuai kebijakan
          privasi dan ketentuan layanan masing-masing, termasuk melalui
          infrastruktur yang berada di luar Indonesia.
        </p>

        <h2>6. Cookie dan penyimpanan browser</h2>

        <p>
          Situs dapat menggunakan cookie atau penyimpanan browser yang
          diperlukan untuk fungsi dasar, preferensi tampilan, keamanan, serta
          pengukuran performa. Pengaturan tertentu dapat dihapus atau dibatasi
          melalui browser Anda.
        </p>

        <h2>7. Penyimpanan dan keamanan data</h2>

        <p>
          Data disimpan selama masih diperlukan untuk tujuan pengumpulannya,
          keamanan, penyelesaian permintaan, atau kewajiban hukum. AIUpdateId
          menerapkan langkah teknis dan administratif yang wajar, tetapi tidak
          ada sistem internet yang dapat menjamin keamanan mutlak.
        </p>

        <h2>8. Hak pengguna</h2>

        <p>
          Sesuai ketentuan yang berlaku, Anda dapat meminta akses, koreksi,
          pembaruan, penghentian pemrosesan, penarikan persetujuan, atau
          penghapusan data pribadi yang pernah Anda berikan.
        </p>

        <p>
          Kirim permintaan ke{" "}
          <a href="mailto:aiupdateid99@gmail.com?subject=Permintaan%20Privasi%20AIUpdateId">
            aiupdateid99@gmail.com
          </a>{" "}
          dengan subjek <strong>Permintaan Privasi AIUpdateId</strong>. Kami
          mungkin meminta informasi yang wajar untuk memastikan bahwa
          permintaan berasal dari pemilik data yang benar.
        </p>

        <h2>9. Data anak</h2>

        <p>
          AIUpdateId ditujukan untuk pembaca umum dan tidak secara sengaja
          meminta data pribadi sensitif anak. Pengguna yang belum berusia 18
          tahun sebaiknya didampingi orang tua atau wali ketika memberikan data
          pribadi atau menghubungi redaksi.
        </p>

        <h2>10. Tautan eksternal</h2>

        <p>
          Artikel AIUpdateId dapat memuat tautan ke situs lain. AIUpdateId tidak
          mengendalikan praktik privasi situs eksternal tersebut. Periksa
          kebijakan privasi situs tujuan sebelum memberikan data.
        </p>

        <h2>11. Perubahan kebijakan</h2>

        <p>
          Kebijakan ini dapat diperbarui mengikuti perubahan layanan,
          teknologi, atau peraturan. Tanggal pembaruan terbaru akan dicantumkan
          pada bagian atas halaman.
        </p>

        <h2>12. Referensi dan kontak</h2>

        <p>
          Informasi resmi mengenai Undang-Undang Nomor 27 Tahun 2022 tentang
          Pelindungan Data Pribadi tersedia melalui{" "}
          <a
            href="https://jdih.komdigi.go.id/produk_hukum/view/id/832/t/Undang-Undang%2BNomor%2B27%2BTahun%2B2022"
            target="_blank"
            rel="noreferrer"
          >
            JDIH Kementerian Komunikasi dan Digital
          </a>
          .
        </p>

        <p>
          Untuk pertanyaan lain, kunjungi{" "}
          <Link href="/kontak">halaman Kontak AIUpdateId</Link>.
        </p>
      </section>
    </main>
  );
}
