import ProductGallery from "./ProductGallery";
import HeroCarousel from "./HeroCarousel";
import products from "./products.json";

const categoryCards = [
  { id: "mp3", index: "01", title: "Motorcycle MP3", zh: "摩托车 MP3", description: "Bluetooth players, amplifiers and complete audio systems." },
  { id: "audio", index: "02", title: "Speakers & Horns", zh: "音响与喇叭", description: "Speakers, horns, sirens and PA solutions for every market." },
  { id: "phone", index: "03", title: "Phone Mounts", zh: "手机支架", description: "Handlebar and mirror mounts designed for everyday riding." },
  { id: "other", index: "04", title: "Accessories", zh: "其他配件", description: "Security, lighting, charging and practical motorcycle accessories." },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="CANAN home">
          <img src="/brand-canan.png" alt="CANAN" />
        </a>
        <nav aria-label="Main navigation">
          <a href="#collection">Collection</a>
          <a href="#about">About</a>
          <a href="#contact">Inquiry</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <HeroCarousel />
        <div className="hero-overlay" />
        <div className="hero-copy">
          <p className="kicker">Guangzhou · Motorcycle Accessories</p>
          <h1 className="hero-brand"><img src="/brand-hoperay.png" alt="Hoperay" /></h1>
          <p className="hero-intro">A focused collection of motorcycle audio, MP3 systems, phone mounts and accessories—sourced for global wholesale partners.</p>
          <div className="hero-actions">
            <a className="button light" href="#collection">View Collection</a>
            <a className="button outline" href="#contact">Wholesale Inquiry</a>
          </div>
        </div>
        <div className="hero-facts">
          <div><span>Products</span><strong>{products.length}+</strong></div>
          <div><span>Service</span><strong>Wholesale · OEM</strong></div>
          <div><span>Supply</span><strong>Partner factories</strong></div>
        </div>
      </section>

      <section className="category-section" aria-labelledby="categories-title">
        <div className="section-heading">
          <div><p className="kicker dark">Product families</p><h2 id="categories-title">Built for the ride.<br /><em>Ready for your market.</em></h2></div>
          <p>From individual components to complete sets, we help importers and distributors source practical, market-ready motorcycle accessories.</p>
        </div>
        <div className="category-grid">
          {categoryCards.map((category) => (
            <a href={`#collection?category=${category.id}`} className="category-card" data-filter-link={category.id} key={category.id}>
              <span>{category.index}</span>
              <div><small>{category.zh}</small><h3>{category.title}</h3><p>{category.description}</p></div>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </div>
      </section>

      <ProductGallery products={products} />

      <section className="about" id="about">
        <p className="kicker">Independent sourcing · Connected manufacturing</p>
        <div className="about-grid">
          <h2>One reliable partner.<br /><em>Multiple product lines.</em></h2>
          <div>
            <p>We operate from our own motorcycle accessories showroom and work closely with selected factories. This gives buyers a wider choice, flexible sourcing and one point of contact from selection to shipment.</p>
            <ul><li>Mixed-product sourcing</li><li>OEM colour and packaging</li><li>Quality inspection support</li><li>Export and shipment coordination</li></ul>
          </div>
        </div>
      </section>

      <footer id="contact">
        <div><p className="kicker">Start a conversation</p><h2>Tell us what<br />your market needs.</h2></div>
        <div className="contact-card">
          <p>Wholesale catalogue, quotations and product recommendations are available on request.</p>
          <span>WhatsApp / email details can be added here</span>
        </div>
        <small>© 2026 Hoperay · CANAN · Guangzhou, China</small>
      </footer>
    </main>
  );
}
