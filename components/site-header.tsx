import Link from "next/link";

export function SiteHeader() {
  return <>
    <div className="topbar"><div className="container"><span>Based in India · Serving worldwide</span><span>+91 99907 77716 · attriassociates99@gmail.com</span></div></div>
    <header className="header"><nav className="container nav" aria-label="Main navigation">
      <Link href="/" className="brand"><span className="brand-mark"><span>AA</span></span><span>ATTRI ASSOCIATES<small>& VASTU CONSULTANTS</small></span></Link>
      <div className="navlinks"><Link href="/about">About</Link><Link href="/services">Services</Link><Link href="/projects">Projects</Link><Link href="/consultants">Consultants</Link><Link href="/blog">Insights</Link></div>
      <Link className="btn" href="/book-consultation">Book consultation</Link>
    </nav></header>
  </>;
}
