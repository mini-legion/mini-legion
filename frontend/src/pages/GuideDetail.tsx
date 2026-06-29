import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGuide } from "../lib/hooks";
import { storage } from "../lib/api";
import type { GuideSection } from "../lib/database.types";

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
      <p className="text-slate-400">Loading guide...</p>
    </div>
  </div>
);

const ErrorState = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="text-2xl font-bold text-slate-200 mb-2">Error Loading Guide</h2>
      <p className="text-slate-400 mb-6">There was a problem loading this guide.</p>
      <Link to="/guides" className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all">Back to Guides</Link>
    </div>
  </div>
);

const NotFoundState = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="text-6xl mb-4">📚</div>
      <h2 className="text-2xl font-bold text-slate-200 mb-2">Guide Not Found</h2>
      <p className="text-slate-400 mb-6">The guide you're looking for doesn't exist.</p>
      <Link to="/guides" className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all">Back to Guides</Link>
    </div>
  </div>
);

const getYouTubeVideoId = (url?: string) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{6,})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{6,})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{6,})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{6,})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
};

const getYouTubeEmbedUrl = (url?: string) => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null;
};

const getYouTubeWatchUrl = (url?: string) => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url || '#';
};

const isVideoSection = (section: GuideSection) => section.type === 'video' || Boolean(section.videoUrl);

const VideoEmbed = ({ section, index }: { section: GuideSection; index: number }) => {
  const sourceUrl = section.videoUrl || section.content;
  const embedUrl = getYouTubeEmbedUrl(sourceUrl);
  const watchUrl = getYouTubeWatchUrl(sourceUrl);
  if (!embedUrl) return null;

  return (
    <div key={`video-${index}`} className="guide-section" style={{ marginBottom: '2.5rem' }}>
      {section.title && <h2 className="guide-heading">{section.title}</h2>}
      <div
        style={{
          width: '100%',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '1rem',
          background: 'linear-gradient(135deg, #0f172a, #020617)',
          padding: '1rem',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            minHeight: 260,
            overflow: 'hidden',
            borderRadius: '0.75rem',
            background: '#000',
            border: '1px solid rgba(51, 65, 85, 0.9)',
          }}
        >
          <iframe
            src={embedUrl}
            title={section.videoTitle || section.title || 'Guide video'}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {section.videoTitle && <h3 className="text-lg font-black text-slate-100">{section.videoTitle}</h3>}
            {section.videoCreator && (
              <p className="mt-1 text-sm text-slate-400">
                Video by{' '}
                {section.videoCreatorUrl ? <a href={section.videoCreatorUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-amber-400 hover:text-amber-300">{section.videoCreator}</a> : <span className="font-bold text-amber-400">{section.videoCreator}</span>}
              </p>
            )}
          </div>
          <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl bg-red-500 px-4 py-2 text-sm font-black text-white hover:bg-red-400 transition-colors">▶ Open on YouTube</a>
        </div>
      </div>
    </div>
  );
};

export const GuideDetail = () => {
  const { guideId } = useParams();
  const { data: guide, loading, error } = useGuide(guideId || '');
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string; } | null>(null);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!guide) return <NotFoundState />;

  const videoSections = guide.sections.filter(isVideoSection);
  const contentSections = guide.sections.filter((section) => !isVideoSection(section));

  const renderSection = (section: GuideSection, index: number) => {
    switch (section.type) {
      case "note":
        return <div key={index} className="guide-section"><div className="guide-callout guide-callout--info"><div className="guide-callout__icon">💡</div><div className="guide-callout__content">{section.title && <h3 className="guide-callout__title">{section.title}</h3>}<p>{section.content}</p></div></div></div>;
      case "warning":
        return <div key={index} className="guide-section"><div className="guide-callout guide-callout--warning"><div className="guide-callout__icon">⚠️</div><div className="guide-callout__content">{section.title && <h3 className="guide-callout__title">{section.title}</h3>}<p>{section.content}</p></div></div></div>;
      case "tips":
        return <div key={index} className="guide-section">{section.title && <h2 className="guide-heading">{section.title}</h2>}<div className="guide-tips">{section.tips?.map((tip, tipIndex) => <div key={tipIndex} className="guide-tip"><span className="guide-tip__icon">{tip.title?.charAt(0) || '💡'}</span><div className="guide-tip__content"><h4 className="guide-tip__title">{tip.title}</h4><p>{tip.description}</p></div></div>)}</div></div>;
      case "steps":
        return <div key={index} className="guide-section">{section.title && <h2 className="guide-heading">{section.title}</h2>}<div className="guide-steps">{section.steps?.map((step) => <div key={step.step} className="guide-step"><div className="guide-step__number">{step.step}</div><div className="guide-step__content"><h4 className="guide-step__title">{step.title}</h4><p>{step.description}</p></div></div>)}</div></div>;
      case "video":
        return <VideoEmbed key={index} section={section} index={index} />;
      case "image":
        return <div key={index} className="guide-section guide-section--image">{section.title && <h2 className="guide-heading">{section.title}</h2>}<figure className="guide-figure"><button onClick={(e) => { e.stopPropagation(); setLightboxImage({ src: storage.getUrl(section.image) || "", alt: section.imageCaption || "Guide image" }); }} className="guide-figure__button"><img src={storage.getUrl(section.image) || ''} alt={section.imageCaption || "Guide image"} className="guide-figure__img" /><div className="guide-figure__overlay"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg><span>Tap to zoom</span></div></button>{section.imageCaption && <figcaption className="guide-figure__caption">{section.imageCaption}</figcaption>}</figure></div>;
      case "text":
        return <div key={index} className="guide-section">{section.title && <h2 className="guide-heading">{section.title}</h2>}<p className="guide-text">{section.content}</p></div>;
      case "table":
        return <div key={index} className="guide-section">{section.title && <h2 className="guide-heading">{section.title}</h2>}<div className="guide-table-wrapper"><table className="guide-table">{section.tableHeaders && <thead><tr>{section.tableHeaders.map((header, hIndex) => <th key={hIndex}>{header}</th>)}</tr></thead>}<tbody>{section.tableRows?.map((row, rIndex) => <tr key={rIndex}>{row.map((cell, cIndex) => <td key={cIndex}>{cell}</td>)}</tr>)}</tbody></table></div></div>;
      default:
        return null;
    }
  };

  return (
    <div className="guide-detail">
      <div className="guide-hero">
        <div className="guide-hero__bg"><img src={storage.getUrl(guide.image) || ''} alt="" className="guide-hero__bg-img" /><div className="guide-hero__gradient" /></div>
        <div className="guide-hero__content"><nav className="guide-breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/guides">Guides</Link><span>/</span><span className="active">{guide.title}</span></nav><div className="guide-hero__title-area"><div className="guide-hero__meta"><span className="guide-hero__read-time">📖 {guide.read_time || '5 min'} read</span><span className="guide-hero__author">By {guide.author}</span></div><h1 className="guide-hero__title">{guide.title}</h1>{guide.subtitle && <p className="guide-hero__subtitle">{guide.subtitle}</p>}{guide.tags && guide.tags.length > 0 && <div className="guide-hero__tags">{guide.tags.map((tag) => <span key={tag} className="guide-tag">#{tag}</span>)}</div>}</div></div>
      </div>
      <div className="guide-body"><div className="guide-intro"><p>{guide.description}</p></div><div className="guide-content">{videoSections.map((section, index) => <VideoEmbed key={`top-video-${index}`} section={section} index={index} />)}{contentSections.map((section, index) => renderSection(section, index))}</div><div className="guide-footer"><Link to="/guides" className="guide-back-btn"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>Back to Guides</Link></div></div>
      {lightboxImage && <div className="guide-lightbox" onClick={() => setLightboxImage(null)}><button onClick={() => setLightboxImage(null)} className="guide-lightbox__close" aria-label="Close"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button><div className="guide-lightbox__content" onClick={(e) => e.stopPropagation()}><img src={lightboxImage.src} alt={lightboxImage.alt} className="guide-lightbox__img" />{lightboxImage.alt && lightboxImage.alt !== "Guide image" && <p className="guide-lightbox__caption">{lightboxImage.alt}</p>}</div></div>}
    </div>
  );
};
