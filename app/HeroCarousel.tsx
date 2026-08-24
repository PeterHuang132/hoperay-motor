"use client";

import { useEffect, useState } from "react";

const slides = [
  "/catalog-v2/product-0194.webp",
  "/catalog-v2/product-0444.webp",
  "/catalog-v2/product-0460.webp",
  "/catalog-v2/product-0365.webp",
  "/catalog-v2/product-0098.webp",
  "/catalog-v2/product-0528.webp",
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 3000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="hero-carousel" aria-hidden="true">
      {slides.map((src, index) => (
        <img className={index === active ? "active" : ""} src={src} alt="" key={src} />
      ))}
    </div>
  );
}
