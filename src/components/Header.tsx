import { Link } from "@tanstack/react-router";
import { authClient } from "#/lib/auth-client";
import { ArrowUpRight, Menu, ShoppingBag, Store } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { data: session } = authClient.useSession();
  return <header className="site-header"><div className="page-wrap nav-wrap">
    <Link to="/" className="brand" aria-label="OnanAI beranda"><span className="brand-mark"><Store size={21}/></span><span><strong>OnanAI</strong><small>Pasar kreatif Samosir</small></span></Link>
    <nav className="main-nav" aria-label="Navigasi utama">
      <Link to="/" activeProps={{className:"nav-active"}}>Beranda</Link>
      <Link to="/products" activeProps={{className:"nav-active"}}>Jelajahi produk</Link>
      <Link to="/ai-assistant" activeProps={{className:"nav-active"}}>Bantuan AI <span className="ai-dot"/></Link>
      <Link to="/qr-partners" activeProps={{className:"nav-active"}}>Mitra wisata</Link>
    </nav>
    <div className="nav-actions"><ThemeToggle/>{session?.user ? <><Link className="nav-dashboard" to="/dashboard">Dasbor</Link><button type="button" className="avatar-button" title="Keluar" onClick={() => void authClient.signOut().then(()=>window.location.assign('/'))}>{(session.user.name || session.user.email || 'U').slice(0,1).toUpperCase()}</button></> : <><Link className="login-link" to="/login">Masuk</Link><Link className="button button-primary button-small" to="/register">Mulai jualan <ArrowUpRight size={16}/></Link></>}</div>
    <details className="mobile-nav"><summary aria-label="Buka menu"><Menu/></summary><div className="mobile-menu"><Link to="/">Beranda</Link><Link to="/products">Jelajahi produk</Link><Link to="/ai-assistant">Bantuan AI</Link><Link to="/qr-partners">Mitra wisata</Link><Link to="/dashboard">Dasbor penjual</Link><Link to="/login">Masuk</Link><Link to="/register">Daftar</Link></div></details>
  </div></header>;
}
