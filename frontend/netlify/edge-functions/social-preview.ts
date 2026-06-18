declare const Netlify: any;
declare const Deno: any;

const SITE_URL = 'https://minilegionguides.com';
const DEFAULT_IMAGE = `${SITE_URL}/images/og/mini-legion-og.svg`;

const BOT_PATTERN = /(discordbot|twitterbot|facebookexternalhit|slackbot|telegrambot|whatsapp|linkedinbot|pinterest|embedly|quora link preview|vkshare|redditbot|skypeuripreview|applebot)/i;

type PreviewData = {
  title: string;
  description: string;
  image?: string | null;
  type?: string;
};

function getEnv(key: string) {
  try {
    if (typeof Netlify !== 'undefined' && Netlify?.env?.get) {
      return Netlify.env.get(key);
    }
  } catch {
    // Ignore and try Deno.
  }

  try {
    if (typeof Deno !== 'undefined' && Deno?.env?.get) {
      return Deno.env.get(key);
    }
  } catch {
    // Ignore missing env access.
  }

  return undefined;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function absoluteUrl(path?: string | null) {
  if (!path) return DEFAULT_IMAGE;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${SITE_URL}${path}`;
  return `${SITE_URL}/images/${path}`;
}

function cleanDescription(value?: string | null) {
  const fallback = 'Mini Legion Game Guide - comprehensive guides, builds, creators and strategies.';
  return (value || fallback).replace(/\s+/g, ' ').trim().slice(0, 240);
}

async function fetchSingle(table: string, id: string) {
  const supabaseUrl = getEnv('VITE_SUPABASE_URL');
  const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) return null;

  const url = `${supabaseUrl}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}&select=*`;
  const response = await fetch(url, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  });

  if (!response.ok) return null;

  const rows = await response.json();
  return Array.isArray(rows) ? rows[0] : null;
}

async function getPreviewData(pathname: string): Promise<PreviewData | null> {
  const guideMatch = pathname.match(/^\/guides\/detail\/([^/]+)/);
  if (guideMatch) {
    const guide = await fetchSingle('guides', decodeURIComponent(guideMatch[1]));
    if (!guide) return null;

    return {
      title: `${guide.title} | Mini Legion Guide`,
      description: cleanDescription(guide.description || guide.subtitle),
      image: absoluteUrl(guide.image),
      type: 'article',
    };
  }

  const buildMatch = pathname.match(/^\/builds\/detail\/([^/]+)/);
  if (buildMatch) {
    const build = await fetchSingle('builds', decodeURIComponent(buildMatch[1]));
    if (!build) return null;

    const role = build.role ? ` ${build.role}` : '';
    const spec = build.spec ? ` ${build.spec}` : '';

    return {
      title: `${build.title} | ${build.hero_class}${spec}${role} Build`,
      description: cleanDescription(build.description || `Mini Legion ${build.hero_class}${spec}${role} build by ${build.author}.`),
      image: absoluteUrl(build.image),
      type: 'article',
    };
  }

  const raidMatch = pathname.match(/^\/raids\/detail\/([^/]+)/);
  if (raidMatch) {
    const raid = await fetchSingle('raids', decodeURIComponent(raidMatch[1]));
    if (!raid) return null;

    return {
      title: `${raid.name} | Mini Legion Raid Guide`,
      description: cleanDescription(raid.description || `${raid.difficulty} raid guide for Mini Legion.`),
      image: absoluteUrl(raid.image),
      type: 'article',
    };
  }

  if (pathname === '/creators') {
    return {
      title: 'Mini Legion Creators | Latest Videos',
      description: 'Watch the latest Mini Legion videos from featured community creators.',
      image: DEFAULT_IMAGE,
      type: 'website',
    };
  }

  if (pathname === '/guides') {
    return {
      title: 'Mini Legion Guides | Beginner, Farming, Raids and Guilds',
      description: 'Browse Mini Legion guides for leveling, AFK farming, resources, dungeons, raids, guilds and progression.',
      image: DEFAULT_IMAGE,
      type: 'website',
    };
  }

  if (pathname === '/builds') {
    return {
      title: 'Mini Legion Builds | Community Builds and Class Guides',
      description: 'Browse Mini Legion builds by class, role, content type and community submissions.',
      image: DEFAULT_IMAGE,
      type: 'website',
    };
  }

  return null;
}

function renderPreviewHtml(url: string, data: PreviewData) {
  const title = escapeHtml(data.title);
  const description = escapeHtml(data.description);
  const image = escapeHtml(absoluteUrl(data.image));
  const pageUrl = escapeHtml(url);
  const type = escapeHtml(data.type || 'website');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="Mini Legion Guide">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:secure_url" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <p><a href="${pageUrl}">Open Mini Legion Guide</a></p>
</body>
</html>`;
}

export default async (request: Request, context: any) => {
  const userAgent = request.headers.get('user-agent') || '';

  if (!BOT_PATTERN.test(userAgent)) {
    return context.next();
  }

  const url = new URL(request.url);
  const preview = await getPreviewData(url.pathname);

  if (!preview) {
    return context.next();
  }

  return new Response(renderPreviewHtml(url.toString(), preview), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=3600',
    },
  });
};
