import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  FilePdf,
  House
} from '@phosphor-icons/react';
import './presentation.css';

export function PresentationDeck() {
  const [slide, setSlide] = useState(0);
  const total = 8;

  const slideImages = [
    '/presentation/slide-1.png',
    '/presentation/slide-2.png',
    '/presentation/slide-3.png',
    '/presentation/slide-4.png',
    '/presentation/slide-5.png',
    '/presentation/slide-6.png',
    '/presentation/slide-7.png',
    '/presentation/slide-8.png',
  ];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === 'Space') {
        e.preventDefault();
        setSlide((s) => Math.min(total - 1, s + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setSlide((s) => Math.max(0, s - 1));
      } else if (e.key === 'Home') {
        setSlide(0);
      } else if (e.key === 'End') {
        setSlide(total - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="deck-wrapper">
      {/* Top Deck Navigation */}
      <div className="deck-navbar no-print">
        <div className="deck-nav-left">
          <a href="/" className="deck-back-btn">
            <House size={18} /> К продукту
          </a>
          <span className="deck-title-nav">Replica Team · UniPath AI (8 слайдов)</span>
        </div>
        <div className="deck-nav-center">
          <button
            className="deck-btn"
            disabled={slide === 0}
            onClick={() => setSlide((s) => Math.max(0, s - 1))}
            title="Предыдущий слайд"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="deck-page-indicator">
            {slide + 1} / {total}
          </span>
          <button
            className="deck-btn"
            disabled={slide === total - 1}
            onClick={() => setSlide((s) => Math.min(total - 1, s + 1))}
            title="Следующий слайд"
          >
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="deck-nav-right">
          <a
            href="/UniPathAI.presentation.pdf"
            download="UniPathAI.presentation.pdf"
            className="deck-print-btn"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <FilePdf size={18} /> Скачать UniPathAI.presentation.pdf
          </a>
        </div>
      </div>

      {/* Slide Screen View */}
      <div className="deck-screen-viewport no-print" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', background: '#0a0d14', minHeight: 'calc(100vh - 64px)' }}>
        <div style={{ maxWidth: '1280px', width: '100%', position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <img
            src={slideImages[slide]}
            alt={'Слайд ' + (slide + 1) + ' из ' + total}
            style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '16/9', objectFit: 'contain', background: '#000' }}
          />
        </div>
      </div>

      {/* Print View: renders ALL 8 slides for multi-page print-to-pdf */}
      <div className="deck-print-viewport print-only">
        {slideImages.map((src, idx) => (
          <div className="print-slide-page" key={idx} style={{ pageBreakAfter: 'always', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
            <img
              src={src}
              alt={'Слайд ' + (idx + 1)}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}