import Link from "next/link";
import { Logo } from "./Header";
export default function Footer(){
  return <footer><div className="container footerGrid">
    <div><Logo/><p>Portal berita, tutorial, review, tools, dan prompt AI berbahasa Indonesia.</p></div>
    <div><h4>Konten</h4><Link href="/artikel">Semua Artikel</Link><Link href="/kategori/berita-ai">Berita AI</Link><Link href="/tools">Tools AI</Link><Link href="/kategori/tutorial">Tutorial</Link><Link href="/kategori/perbandingan-ai">Perbandingan AI</Link></div>
    <div><h4>Informasi</h4><Link href="/tentang">Tentang</Link><Link href="/kontak">Kontak</Link><Link href="/privasi">Privasi</Link><Link href="/disclaimer">Disclaimer</Link><Link href="/rss.xml">RSS Feed</Link><Link href="/search">Pencarian</Link><Link href="/tag">Tag</Link></div>
  </div><div className="container copyright">© 2026 AIUpdateId. Semua hak dilindungi.</div></footer>
}
