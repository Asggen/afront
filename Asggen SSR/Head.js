const headHtml = (html, context) => {
  return html
    .replace(
      "<title>AFront</title>",
      `<title>${context.title || "AFront"}</title>`
    )
    .replace(
      /<meta name="title" content="[^"]*">/,
      context.description
        ? `<meta name="title" content="${context.title}">`
        : '<meta name="title" content="Default description">'
    )
    .replace(
      /<meta name="description" content="[^"]*">/,
      context.description
        ? `<meta name="description" content="${context.description}">`
        : '<meta name="description" content="Default description">'
    )
    .replace(
      /<meta name="keywords" content="[^"]*">/,
      context.keywords
        ? `<meta name="keywords" content="${context.keywords}">`
        : '<meta name="keywords" content="default, keywords">'
    );
};

module.exports = headHtml;
