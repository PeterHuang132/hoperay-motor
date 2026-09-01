"use client";

import { useEffect, useMemo, useState } from "react";
import ProductImageViewer from "./ProductImageViewer";

type Product = { id: number; name: string; category: string; image: string };

const labels: Record<string, string> = {
  all: "All Product",
  mp3: "MP3/Speaker",
  horn: "Horn",
  phone: "Phone Holder",
  alarm: "Alarm",
  other: "Other Accessories",
};

export default function ProductGallery({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(24);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const handleCategory = (event: Event) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-filter-link]");
      if (!target) return;
      event.preventDefault();
      setFilter(target.dataset.filterLink || "all");
      setVisible(24);
      document.querySelector("#collection")?.scrollIntoView({ behavior: "smooth" });
    };
    document.addEventListener("click", handleCategory);
    return () => document.removeEventListener("click", handleCategory);
  }, []);

  const filtered = useMemo(() => products.filter((product) => {
      const inCategory = filter === "all" || product.category === filter;
      return inCategory && product.name.toLowerCase().includes(query.toLowerCase().trim());
    }), [filter, products, query]);

  return (
    <section className="collection" id="collection">
      <div className="collection-top">
        <div><p className="kicker dark">Product index</p><h2>Explore the collection.</h2></div>
        <label className="search"><span>Search</span><input value={query} onChange={(e) => { setQuery(e.target.value); setVisible(24); }} placeholder="Model or product name" /></label>
      </div>
      <div className="filters" role="group" aria-label="Filter products">
        {Object.entries(labels).map(([key, label]) => <button className={filter === key ? "active" : ""} onClick={() => { setFilter(key); setVisible(24); }} key={key}>{label}</button>)}
      </div>
      <p className="results">{filtered.length} products · {labels[filter]}</p>
      <div className="product-grid">
        {filtered.slice(0, visible).map((product) => (
          <article className="product-card" key={product.id}>
            <button type="button" className="product-image" aria-label={`View product ${String(product.id).padStart(3, "0")} image`} onClick={() => setSelectedProduct(product)}><img src={product.image} alt={product.name} loading="lazy" /></button>
            <div className="product-meta"><small>{labels[product.category]}</small><span className="product-number" aria-label={`Product number ${String(product.id).padStart(3, "0")}`}>{String(product.id).padStart(3, "0")}</span></div>
          </article>
        ))}
      </div>
      {(visible < filtered.length || visible > 24) && <div className="collection-controls">
        {visible < filtered.length && <button className="load-more" onClick={() => setVisible((count) => count + 24)}>Load more <span>({filtered.length - visible} remaining)</span></button>}
        {visible > 24 && <button className="load-more" onClick={() => setVisible((count) => Math.max(24, count - 24))}>Load less</button>}
      </div>}
      {!filtered.length && <p className="empty">No matching products. Try another keyword or category.</p>}
      {selectedProduct && <ProductImageViewer image={selectedProduct.image} number={String(selectedProduct.id).padStart(3, "0")} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
}
