import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getGuideBySlug } from "../data";
import type { GuideSection } from "../data";

export const GuideDetail = () => {
  const { guideId } = useParams();
  const guide = guideId ? getGuideBySlug(guideId) : null;
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-slate-200 mb-2">
            Guide Not Found
          </h2>
          <p className="text-slate-400 mb-6">
            The guide you're looking for doesn't exist.
          </p>
          <Link
            to="/guides"
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
          >
            Back to Guides
          </Link>
        </div>
      </div>
    );
  }

  const renderSection = (section: GuideSection, index: number) => {
    switch (section.type) {
      case "note":
        return (
          <div key={index} className="guide-section">
            <div className="guide-callout guide-callout--info">
              <div className="guide-callout__icon">💡</div>
              <div className="guide-callout__content">
                {section.title && (
                  <h3 className="guide-callout__title">{section.title}</h3>
                )}
                <p>{section.content}</p>
              </div>
            </div>
          </div>
        );

      case "warning":
        return (
          <div key={index} className="guide-section">
            <div className="guide-callout guide-callout--warning">
              <div className="guide-callout__icon">⚠️</div>
              <div className="guide-callout__content">
                {section.title && (
                  <h3 className="guide-callout__title">{section.title}</h3>
                )}
                <p>{section.content}</p>
              </div>
            </div>
          </div>
        );

      case "tips":
        return (
          <div key={index} className="guide-section">
            {section.title && (
              <h2 className="guide-heading">{section.title}</h2>
            )}
            <div className="guide-tips">
              {section.tips?.map((tip, tipIndex) => (
                <div key={tipIndex} className="guide-tip">
                  <span className="guide-tip__icon">{tip.icon}</span>
                  <div className="guide-tip__content">
                    <h4 className="guide-tip__title">{tip.title}</h4>
                    <p>{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "steps":
        return (
          <div key={index} className="guide-section">
            {section.title && (
              <h2 className="guide-heading">{section.title}</h2>
            )}
            <div className="guide-steps">
              {section.steps?.map((step) => (
                <div key={step.stepNumber} className="guide-step">
                  <div className="guide-step__number">{step.stepNumber}</div>
                  <div className="guide-step__content">
                    <h4 className="guide-step__title">{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "image":
        return (
          <div key={index} className="guide-section guide-section--image">
            {section.title && (
              <h2 className="guide-heading">{section.title}</h2>
            )}
            <figure className="guide-figure">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage({
                    src: section.image || "",
                    alt: section.imageCaption || "Guide image",
                  });
                }}
                className="guide-figure__button"
              >
                <img
                  src={section.image}
                  alt={section.imageCaption || "Guide image"}
                  className="guide-figure__img"
                />
                <div className="guide-figure__overlay">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                  <span>Tap to zoom</span>
                </div>
              </button>
              {section.imageCaption && (
                <figcaption className="guide-figure__caption">
                  {section.imageCaption}
                </figcaption>
              )}
            </figure>
          </div>
        );

      case "text":
        return (
          <div key={index} className="guide-section">
            {section.title && (
              <h2 className="guide-heading">{section.title}</h2>
            )}
            <p className="guide-text">{section.content}</p>
          </div>
        );

      case "table":
        return (
          <div key={index} className="guide-section">
            {section.title && (
              <h2 className="guide-heading">{section.title}</h2>
            )}
            <div className="guide-table-wrapper">
              <table className="guide-table">
                {section.tableHeaders && (
                  <thead>
                    <tr>
                      {section.tableHeaders.map((header, hIndex) => (
                        <th key={hIndex}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {section.tableRows?.map((row, rIndex) => (
                    <tr key={rIndex}>
                      {row.map((cell, cIndex) => (
                        <td key={cIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="guide-detail">
      {/* Hero Banner */}
      <div className="guide-hero">
        <div className="guide-hero__bg">
          <img src={guide.image} alt="" className="guide-hero__bg-img" />
          <div className="guide-hero__gradient" />
        </div>

        <div className="guide-hero__content">
          {/* Breadcrumb */}
          <nav className="guide-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/guides">Guides</Link>
            <span>/</span>
            <span className="active">{guide.title}</span>
          </nav>

          {/* Title Area */}
          <div className="guide-hero__title-area">
            <div className="guide-hero__meta">
              <span className="guide-hero__read-time">
                📖 {guide.readTime} read
              </span>
              <span className="guide-hero__author">By {guide.author}</span>
            </div>
            <h1 className="guide-hero__title">{guide.title}</h1>
            {guide.subtitle && (
              <p className="guide-hero__subtitle">{guide.subtitle}</p>
            )}

            {guide.tags && (
              <div className="guide-hero__tags">
                {guide.tags.map((tag) => (
                  <span key={tag} className="guide-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guide Body */}
      <div className="guide-body">
        <div className="guide-intro">
          <p>{guide.description}</p>
        </div>

        <div className="guide-content">
          {guide.sections.map((section, index) =>
            renderSection(section, index)
          )}
        </div>

        {/* Back Button */}
        <div className="guide-footer">
          <Link to="/guides" className="guide-back-btn">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Guides
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="guide-lightbox" onClick={() => setLightboxImage(null)}>
          <button
            onClick={() => setLightboxImage(null)}
            className="guide-lightbox__close"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div
            className="guide-lightbox__content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="guide-lightbox__img"
            />
            {lightboxImage.alt && lightboxImage.alt !== "Guide image" && (
              <p className="guide-lightbox__caption">{lightboxImage.alt}</p>
            )}
          </div>

          <div className="guide-lightbox__hint">Tap anywhere to close</div>
        </div>
      )}

      {/* Scoped Styles */}
      <style>{`
        .guide-detail {
          min-height: 100vh;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
        }

        /* Hero Section */
        .guide-hero {
          position: relative;
          min-height: 340px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .guide-hero__bg {
          position: absolute;
          inset: 0;
        }

        .guide-hero__bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: blur(2px);
          transform: scale(1.1);
        }

        .guide-hero__gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(15, 23, 42, 0.4) 0%,
            rgba(15, 23, 42, 0.85) 60%,
            rgba(15, 23, 42, 1) 100%
          );
        }

        .guide-hero__content {
          position: relative;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1.25rem;
        }

        /* Breadcrumb */
        .guide-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .guide-breadcrumb a {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: color 0.2s;
        }

        .guide-breadcrumb a:hover {
          color: #fbbf24;
        }

        .guide-breadcrumb span {
          color: rgba(255,255,255,0.3);
        }

        .guide-breadcrumb .active {
          color: #fbbf24;
          font-weight: 500;
        }

        /* Hero Title */
        .guide-hero__title-area {
          text-align: left;
        }

        .guide-hero__meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
          margin-bottom: 0.75rem;
        }

        .guide-hero__read-time {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .guide-hero__author {
          color: #fbbf24;
        }

        .guide-hero__title {
          font-size: clamp(1.75rem, 6vw, 2.75rem);
          font-weight: 800;
          background: linear-gradient(135deg, #fbbf24, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.15;
          margin-bottom: 0.5rem;
        }

        .guide-hero__subtitle {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.75);
          margin-bottom: 1rem;
        }

        .guide-hero__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .guide-tag {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.08);
          padding: 0.25rem 0.6rem;
          border-radius: 100px;
          transition: all 0.2s;
        }

        .guide-tag:hover {
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
        }

        /* Guide Body */
        .guide-body {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1.25rem 3rem;
        }

        .guide-intro {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.7;
          padding: 1.5rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 1.5rem;
        }

        .guide-intro p {
          margin: 0;
        }

        /* Guide Content */
        .guide-content {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .guide-section {
          padding: 1.25rem 0;
        }

        .guide-section + .guide-section {
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .guide-section--image {
          padding: 1.5rem 0;
        }

        /* Headings */
        .guide-heading {
          font-size: 1.35rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 1rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .guide-heading::before {
          content: '';
          width: 4px;
          height: 1.2em;
          background: linear-gradient(135deg, #fbbf24, #f97316);
          border-radius: 4px;
        }

        /* Text */
        .guide-text {
          color: rgba(255,255,255,0.75);
          line-height: 1.75;
          margin: 0;
        }

        /* Callouts (Notes & Warnings) */
        .guide-callout {
          display: flex;
          gap: 0.85rem;
          padding: 1rem;
          border-radius: 12px;
          border-left: 3px solid;
        }

        .guide-callout--info {
          background: rgba(251, 191, 36, 0.08);
          border-color: #fbbf24;
        }

        .guide-callout--warning {
          background: rgba(239, 68, 68, 0.08);
          border-color: #ef4444;
        }

        .guide-callout__icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .guide-callout__content {
          flex: 1;
          min-width: 0;
        }

        .guide-callout__title {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.35rem;
        }

        .guide-callout--info .guide-callout__title {
          color: #fbbf24;
        }

        .guide-callout--warning .guide-callout__title {
          color: #ef4444;
        }

        .guide-callout__content p {
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
          margin: 0;
          font-size: 0.95rem;
        }

        /* Steps */
        .guide-steps {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .guide-step {
          display: flex;
          gap: 0.9rem;
          align-items: flex-start;
        }

        .guide-step__number {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .guide-step__content {
          flex: 1;
          min-width: 0;
        }

        .guide-step__title {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          margin: 0 0 0.25rem;
        }

        .guide-step__content p {
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
          margin: 0;
          font-size: 0.9rem;
        }

        /* Tips */
        .guide-tips {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .guide-tip {
          display: flex;
          gap: 0.85rem;
          align-items: flex-start;
          padding: 0.75rem;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          transition: background 0.2s;
        }

        .guide-tip:hover {
          background: rgba(255,255,255,0.05);
        }

        .guide-tip__icon {
          font-size: 1.35rem;
          flex-shrink: 0;
        }

        .guide-tip__content {
          flex: 1;
          min-width: 0;
        }

        .guide-tip__title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #fff;
          margin: 0 0 0.2rem;
        }

        .guide-tip__content p {
          color: rgba(255,255,255,0.6);
          line-height: 1.55;
          margin: 0;
          font-size: 0.875rem;
        }

        /* Images */
        .guide-figure {
          margin: 0;
          text-align: center;
        }

        .guide-figure__button {
          position: relative;
          display: inline-block;
          border: none;
          background: none;
          padding: 0;
          cursor: zoom-in;
          border-radius: 12px;
          overflow: hidden;
        }

        .guide-figure__button:focus {
          outline: 2px solid #fbbf24;
          outline-offset: 2px;
        }

        .guide-figure__img {
          display: block;
          max-width: 100%;
          height: auto;
          max-height: 400px;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          transition: transform 0.3s ease;
        }

        .guide-figure__button:hover .guide-figure__img {
          transform: scale(1.02);
        }

        .guide-figure__overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(0,0,0,0);
          color: #fff;
          opacity: 0;
          transition: all 0.3s ease;
          border-radius: 12px;
        }

        .guide-figure__button:hover .guide-figure__overlay {
          opacity: 1;
          background: rgba(0,0,0,0.5);
        }

        .guide-figure__overlay span {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .guide-figure__caption {
          margin-top: 0.75rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          font-style: italic;
        }

        /* Tables */
        .guide-table-wrapper {
          overflow-x: auto;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
        }

        .guide-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .guide-table th {
          text-align: left;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.05);
          color: #fbbf24;
          font-weight: 600;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .guide-table td {
          padding: 0.65rem 1rem;
          color: rgba(255,255,255,0.7);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .guide-table tr:last-child td {
          border-bottom: none;
        }

        .guide-table tr:hover td {
          background: rgba(255,255,255,0.02);
        }

        /* Footer */
        .guide-footer {
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          text-align: center;
        }

        .guide-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #fbbf24, #f97316);
          color: #0f172a;
          font-weight: 600;
          font-size: 0.95rem;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(251, 191, 36, 0.25);
        }

        .guide-back-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(251, 191, 36, 0.35);
        }

        /* Lightbox */
        .guide-lightbox {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.95);
          backdrop-filter: blur(8px);
          padding: 1rem;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .guide-lightbox__close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 40px;
          height: 40px;
          border: none;
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .guide-lightbox__close:hover {
          background: rgba(255,255,255,0.2);
        }

        .guide-lightbox__content {
          max-width: 95vw;
          max-height: 85vh;
          animation: zoomIn 0.2s ease;
        }

        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .guide-lightbox__img {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 8px;
        }

        .guide-lightbox__caption {
          text-align: center;
          color: rgba(255,255,255,0.6);
          margin-top: 1rem;
          font-size: 0.9rem;
        }

        .guide-lightbox__hint {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
          background: rgba(0,0,0,0.5);
          padding: 0.5rem 1rem;
          border-radius: 100px;
        }

        /* Responsive */
        @media (min-width: 768px) {
          .guide-hero {
            min-height: 400px;
          }

          .guide-hero__content {
            padding: 3rem 2rem;
          }

          .guide-body {
            padding: 0 2rem 4rem;
          }

          .guide-section {
            padding: 1.75rem 0;
          }

          .guide-heading {
            font-size: 1.5rem;
          }

          .guide-tips {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
          }

          .guide-figure__img {
            max-height: 500px;
          }
        }
      `}</style>
    </div>
  );
};
