"use client";

import { useEffect, useRef, useState } from "react";

export default function ProductImageViewer({ image, number, onClose }: { image: string; number: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog ref={dialog} className="image-viewer" aria-label={`Product ${number} image viewer`} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="image-viewer-panel">
        <div className="image-viewer-toolbar">
          <span>Product {number}</span>
          <div className="image-viewer-controls">
            <button type="button" aria-label="Zoom out" disabled={zoom <= 50} onClick={() => setZoom(value => Math.max(50, value - 25))}>−</button>
            <button type="button" className="image-viewer-reset" aria-label="Reset zoom" onClick={() => setZoom(100)}>{zoom}%</button>
            <button type="button" aria-label="Zoom in" disabled={zoom >= 300} onClick={() => setZoom(value => Math.min(300, value + 25))}>+</button>
            <button type="button" aria-label="Close image viewer" onClick={onClose}>×</button>
          </div>
        </div>
        <div className="image-viewer-viewport" tabIndex={0} aria-label="Product image. Scroll to explore when zoomed in.">
          <div className="image-viewer-canvas" style={{ width: `max(100%, calc(var(--image-size) * ${zoom / 100}))`, height: `max(100%, calc(var(--image-size) * ${zoom / 100}))` }}>
            <img src={image} alt={`Product ${number}`} draggable={false} style={{ width: `calc(var(--image-size) * ${zoom / 100})`, height: `calc(var(--image-size) * ${zoom / 100})` }} />
          </div>
        </div>
        <p className="image-viewer-hint">Use + / − to zoom · Scroll to explore · Esc to close</p>
      </div>
    </dialog>
  );
}
