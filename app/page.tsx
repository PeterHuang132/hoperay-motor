import ProductGallery from "./ProductGallery";
import HeroCarousel from "./HeroCarousel";
import products from "./products.json";

const shopAddress = "广东省广州市增槎路新白云摩配B356";

const categoryCards = [
  { id: "mp3", index: "01", title: "MP3/Speaker", zh: "MP3 与音响", description: "Bluetooth players, amplifiers, speakers and complete audio systems." },
  { id: "horn", index: "02", title: "Horn", zh: "喇叭", description: "Motorcycle horns for every market." },
  { id: "phone", index: "03", title: "Phone Holder", zh: "手机支架", description: "Handlebar and mirror holders designed for everyday riding." },
  { id: "alarm", index: "04", title: "Alarm", zh: "报警器", description: "Motorcycle alarms and security accessories." },
  { id: "other", index: "05", title: "Other Accessories", zh: "其他配件", description: "Lighting, charging and practical motorcycle accessories." },
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
          <a href="#contact">About</a>
          <a href="#contact">Inquiry</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <HeroCarousel />
        <div className="hero-overlay" />
        <div className="hero-copy">
          <p className="kicker">Guangzhou · Motorcycle Accessories</p>
          <h1 className="hero-brand"><img src="/brand-hoperay-transparent.png" alt="Hoperay" /></h1>
          <p className="hero-intro">A focused collection of motorcycle audio, MP3 systems, phone holders and accessories—sourced for global wholesale partners.</p>
          <div className="hero-actions">
            <a className="button light" href="#collection">View Collection</a>
            <a className="button outline" href="#contact">Wholesale Inquiry</a>
          </div>
          <p className="hero-intro hero-address">Address：{shopAddress}</p>
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

      <section className="about" id="contact">
        <p className="kicker">Independent sourcing · Connected manufacturing</p>
        <div className="about-grid">
          <h2>One reliable partner.<br /><em>Multiple product lines.</em></h2>
          <div className="contact-panel">
            <p>Contact us for wholesale catalogues, quotations and product recommendations.</p>
            <ul className="contact-list" aria-label="Contact information">
              <li><img src="/social/whatsapp.svg" alt="" /><span>WhatsApp:</span><a href="https://wa.me/8615919655867" target="_blank" rel="noreferrer">15919655867</a></li>
              <li><img src="/social/tiktok.svg" alt="" /><span>TikTok:</span><a href="https://www.tiktok.com/@huang.peter2" target="_blank" rel="noreferrer">@huang.peter2</a></li>
              <li><img src="/social/wechat.svg" alt="" /><span>WeChat:</span><strong>hoperaymotor123</strong></li>
              <li><img src="/social/gmail.svg" alt="" /><span>Gmail:</span><a href="mailto:huangbide123@gmail.com">huangbide123@gmail.com</a></li>
              <li className="contact-address"><img src="/social/location.svg" alt="" /><span>Address:</span><strong>{shopAddress}</strong></li>
            </ul>
          </div>
        </div>
        <small className="site-credit">© 2026 Hoperay · CANAN · Guangzhou, China</small>
      </section>
    </main>
  );
}
