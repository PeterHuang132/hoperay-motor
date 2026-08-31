"use client";

import { useEffect, useState } from "react";
import products from "./products.json";

const slides = ["mp3", "horn", "phone", "alarm", "other"]
  .map((category) => products.find((product) => product.category === category)?.image)
  .filter((image): image is string => Boolean(image));

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
