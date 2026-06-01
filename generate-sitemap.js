// Run: node generate-sitemap.js
const fs = require("fs");
const path = require("path");

const BASE = "https://zrov.dev";
const manifest = JSON.parse(fs.readFileSync("blogs/posts/manifest.json", "utf8"));

const staticPages = [
  { loc: `${BASE}/`, priority: "1.0", changefreq: "monthly" },
  { loc: `${BASE}/blogs/blogs.html`, priority: "0.8", changefreq: "monthly" },
  { loc: `${BASE}/tools/`, priority: "0.8", changefreq: "monthly" },
  { loc: `${BASE}/tools/it-paths/`, priority: "0.8", changefreq: "monthly" },
  { loc: `${BASE}/tools/ai-learn/`, priority: "0.8", changefreq: "monthly" },
];

const postPages = manifest.map((post) => ({
  loc: `${BASE}/blogs/${post.file.replace("./", "")}`,
  priority: "0.6",
}));

const allPages = [...staticPages, ...postPages];

const urlTags = allPages
  .map(({ loc, priority, changefreq }) => {
    const freq = changefreq ? `<changefreq>${changefreq}</changefreq>` : "";
    return `  <url><loc>${loc}</loc>${freq}<priority>${priority}</priority></url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTags}
</urlset>
`;

fs.writeFileSync("sitemap.xml", xml);
console.log(`Sitemap updated with ${allPages.length} URLs.`);
