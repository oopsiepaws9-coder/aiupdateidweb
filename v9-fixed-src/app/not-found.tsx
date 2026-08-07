import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="page">
      <section className="container notFoundPage">
        <span>404</span>
        <h1>Halaman tidak ditemukan</h1>
        <p>Alamat mungkin berubah, dihapus, atau belum tersedia.</p>
        <div>
          <Link className="primary" href="/">
            <ArrowLeft size={18} /> Kembali ke beranda
          </Link>
          <Link className="secondary" href="/search">
            <Search size={18} /> Cari konten
          </Link>
        </div>
      </section>
    </main>
  );
}
