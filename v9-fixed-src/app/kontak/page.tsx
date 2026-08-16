import Link from "next/link";

const contactTopics = [
  {
    title: "Koreksi editorial",
    description: "Laporkan kesalahan fakta, tautan rusak, informasi kedaluwarsa, atau bagian artikel yang perlu diperjelas.",
  },
  {
    title: "Pertanyaan pembaca",
    description: "Sampaikan pertanyaan mengenai artikel, tools AI, model AI, glossary, atau panduan yang diterbitkan.",
  },
  {
    title: "Kerja sama",
    description: "Ajukan kolaborasi editorial, ulasan produk, kemitraan konten, atau peluang kerja sama yang relevan.",
  },
  {
    title: "Privasi dan data",
    description: "Ajukan pertanyaan, koreksi, atau permintaan penghapusan data pribadi yang pernah Anda berikan.",
  },
];

export default function Page() {
  return (
    <main className="page">
      <section className="container content">
        <small>KONTAK</small>
        <h1>Hubungi AIUpdateId</h1>

        <p>
          Punya koreksi, pertanyaan, masukan, atau usulan kerja sama? Hubungi
          tim AIUpdateId melalui alamat redaksi resmi berikut.
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
          <strong style={{ display: "block", marginBottom: "0.45rem" }}>
            EMAIL REDAKSI
          </strong>

          <a
            href="mailto:aiupdateid99@gmail.com?subject=Pesan%20untuk%20AIUpdateId"
            style={{
              display: "inline-block",
              padding: "0.85rem 1.1rem",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #1565d8, #2795ed)",
              color: "#ffffff",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            aiupdateid99@gmail.com
          </a>
        </div>

        <h2>Pesan yang dapat Anda kirimkan</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
            margin: "1rem 0 2rem",
          }}
        >
          {contactTopics.map((topic) => (
            <article
              key={topic.title}
              style={{
                padding: "1.2rem",
                borderRadius: "16px",
                border: "1px solid rgba(59, 130, 246, 0.22)",
                background: "rgba(59, 130, 246, 0.05)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>{topic.title}</h3>
              <p style={{ marginBottom: 0 }}>{topic.description}</p>
            </article>
          ))}
        </div>

        <h2>Agar pesan mudah ditindaklanjuti</h2>

        <ol>
          <li>Tuliskan subjek email yang jelas dan singkat.</li>
          <li>Sertakan URL halaman jika pesan berkaitan dengan konten tertentu.</li>
          <li>Jelaskan bagian yang perlu diperiksa atau diperbaiki.</li>
          <li>Sertakan sumber tepercaya apabila Anda mengajukan koreksi fakta.</li>
        </ol>

        <aside
          style={{
            margin: "1.5rem 0",
            padding: "1.2rem",
            borderLeft: "4px solid #f59e0b",
            borderRadius: "10px",
            background: "rgba(245, 158, 11, 0.09)",
          }}
        >
          <strong>Jaga keamanan data Anda.</strong>
          <p style={{ marginBottom: 0 }}>
            Jangan mengirimkan kata sandi, kode OTP, API key, data keuangan,
            atau dokumen identitas melalui email.
          </p>
        </aside>

        <h2>Waktu tanggapan</h2>

        <p>
          AIUpdateId berusaha membaca dan menanggapi pesan yang relevan dalam
          3–7 hari kerja. Waktu tanggapan dapat berbeda tergantung isi dan
          jumlah pesan yang diterima.
        </p>

        <p>
          Informasi mengenai penggunaan dan perlindungan data tersedia di{" "}
          <Link href="/privasi">Kebijakan Privasi AIUpdateId</Link>.
        </p>
      </section>
    </main>
  );
}
