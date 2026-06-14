const escapeHtml = (str = "") => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

const headHtml = (html, context) => {
  const title = escapeHtml(
    context.title || "Afront"
  );

  const description = escapeHtml(
    context.description || "Default description"
  );

  const keywords = escapeHtml(
    context.keywords || "default, keywords"
  );

  const image = escapeHtml(
    context.image || "/logo512.png"
  );

  const url = escapeHtml(
    context.url || "https://asggen.com"
  );

  return html
    /* TITLE */
    .replace(
      /<title>.*?<\/title>/i,
      `<title>${title}</title>`
    )

    /* META TITLE */
    .replace(
      /<meta\s+name="title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="title" content="${title}">`
    )

    /* DESCRIPTION */
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${description}">`
    )

    /* KEYWORDS */
    .replace(
      /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="keywords" content="${keywords}">`
    )

    /* OG TITLE */
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${title}">`
    )

    /* OG DESCRIPTION */
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${description}">`
    )

    /* OG IMAGE */
    .replace(
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:image" content="${image}">`
    )

    /* OG URL */
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${url}">`
    )

    /* OG TYPE */
    .replace(
      /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:type" content="website">`
    );
};

module.exports = headHtml;
