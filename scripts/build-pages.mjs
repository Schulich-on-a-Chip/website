import { readFileSync, writeFileSync } from "node:fs";
const c = JSON.parse(
  readFileSync(new URL("../copy.md", import.meta.url), "utf8").match(
    /```json\s*([\s\S]*?)```/,
  )[1],
);
const out = new URL("../public/", import.meta.url);
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (x) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        x
      ],
  );
const url = (key) => (key === "home" ? "/" : `/${key}`);
const icon = (name) =>
  name === "mail"
    ? '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></svg>'
    : name === "instagram"
      ? '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17 7h.01"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M5 9v11M5 4v.01M10 20V9h4v2c3-4 6-2 6 2v7M14 20v-7"/></svg>';
const arrow =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>';
const link = (href, label, cl = "") =>
  `<a class="${cl}" href="${esc(href)}">${esc(label)}${cl.includes("button") ? arrow : ""}</a>`;
const navLink = (key, current) =>
  `<a href="${url(key)}"${key === current ? ' aria-current="page"' : ""}>${esc(c.navigation[key])}</a>`;
const nav = (key) =>
  `<nav class="primary-nav" aria-label="${esc(c.footer.links)}"><div class="nav-side">${navLink("team", key)}${navLink("about", key)}</div><div class="nav-emblem"><a class="brand" href="/" aria-label="${esc(c.brand)}"><img src="/images/logo.png" width="54" height="54" alt="${esc(c.accessibility.logo)}"></a><a class="home-button" href="/" aria-label="${esc(c.navigation.home)}"${key === "home" ? ' aria-current="page"' : ""}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7M5 9v11h14V9M9 20v-7h6v7"/></svg></a></div><div class="nav-side">${navLink("projects", key)}${navLink("events", key)}</div></nav>`;
const member = (m) =>
  `<article class="member"><img class="portrait" src="/${esc(m.image)}" alt="${esc(m.name)}" loading="lazy" width="120" height="120"><div><h3>${esc(m.name)}</h3><p>${esc(m.role)}</p></div><a class="member-link" href="${esc(m.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(m.name)} · ${esc(c.footer.linkedin)}">${icon("linkedin")}</a></article>`;
const heading = (title, sub = "") =>
  `<header class="page-heading">${sub ? `<p class="eyebrow">${esc(sub)}</p>` : ""}<h1>${esc(title)}</h1></header>`;
const pages = {
  home: `<section class="home-hero"><p class="eyebrow">${esc(c.school)}</p><h1>${esc(c.home.title)}</h1><div class="home-links">${link("/about", c.navigation.about, "button")}${link("/projects", c.navigation.projects, "text-button")}</div></section>`,
  about: `${heading(c.about.title, c.school)}<section class="mission reading"><p>${esc(c.about.body)}</p></section>`,
  team: `${heading(c.team.title, c.school)}<section class="team-section"><h2>${esc(c.team.executives)}</h2><div class="members executives">${c.team.members.slice(0, 3).map(member).join("")}</div><h2>${esc(c.team.membersTitle)}</h2><div class="members">${c.team.members.slice(3).map(member).join("")}</div></section>`,
  projects: `${heading(c.projects.title)}<article class="feature"><div class="feature-copy"><h2>${esc(c.projects.year)}</h2><p>${esc(c.projects.body)}</p></div><div class="chip-art" aria-hidden="true"><div class="chip-pins"><div class="chip-die"><img src="/images/logo.png" alt=""></div></div></div></article>`,
  events: `${heading(c.events.title)}<article class="feature event"><div class="feature-copy"><h2>${esc(c.events.name)}</h2><p>${esc(c.events.body)}</p></div><img class="event-photo" src="/images/our-club.JPG" alt="" width="500" height="500"></article>`,
  support: `${heading(c.support.title, c.support.subtitle)}<section class="sponsors">${c.support.sponsors.map((s) => `<article class="sponsor"><div class="sponsor-image"><img src="/${esc(s.image)}" alt="${esc(s.name)}"></div><h2>${esc(s.name)}</h2></article>`).join("")}</section><section class="support-contact reading"><p class="eyebrow">${esc(c.support.ctaLabel)}</p><h2>${esc(c.support.ctaHeading)}</h2><p>${esc(c.support.body)}</p>${link(`mailto:${c.footer.email}`, c.support.contact, "button")}</section>`,
  recruitment: `${heading(c.recruitment.title, c.recruitment.subtitle)}<section class="reading recruitment"><h2>${esc(c.recruitment.label)}</h2><p>${esc(c.recruitment.body)}</p>${link(`mailto:${c.footer.email}`, c.support.contact, "button")}</section>`,
};
for (const [key, content] of Object.entries(pages)) {
  const title = key === "home" ? c.navigation.home : c[key].title;
  const skyColor = ["projects", "events"].includes(key)
    ? "#080f24"
    : ["about", "team"].includes(key)
      ? "#64b0e3"
      : "#8b88b5";
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="${skyColor}"><title>${esc(title)} | ${esc(c.brand)}</title><link rel="icon" href="/images/logo.png"><link rel="stylesheet" href="/styles.css"><script src="/site.js" defer></script></head>
<body data-page="${key}"><div class="sky" aria-hidden="true"><div class="sky-day"></div><div class="sky-night"></div></div><div class="wafer" aria-hidden="true"></div><header class="site-header">${nav(key)}</header>
<main id="content" tabindex="-1">${content}</main>
<footer class="site-footer"><a class="footer-brand" href="/">${esc(c.brand)}</a><div class="footer-links">${link("/recruitment", c.footer.recruitment)}<div class="footer-contact">${link(`mailto:${c.footer.email}`, c.footer.contact)}${link(`mailto:${c.footer.email}`, c.footer.email)}</div></div></footer>
<aside class="contact-dock" aria-label="${esc(c.footer.contact)}"><a href="https://www.linkedin.com/company/schulich-on-a-chip" target="_blank" rel="noopener noreferrer" aria-label="${esc(c.footer.linkedin)}">${icon("linkedin")}</a><a href="https://www.instagram.com/soc.ucalgary" target="_blank" rel="noopener noreferrer" aria-label="${esc(c.footer.instagram)}">${icon("instagram")}</a><a href="mailto:${esc(c.footer.email)}" aria-label="${esc(c.footer.email)}">${icon("mail")}</a><span class="dock-divider"></span>${link("/support", c.navigation.support, "dock-support")}</aside></body></html>`;
  writeFileSync(
    new URL(key === "home" ? "index.html" : `${key}.html`, out),
    html,
  );
}
// Keep old inbound Activity links working without retaining duplicate page copy.
writeFileSync(
  new URL("activity.html", out),
  readFileSync(new URL("projects.html", out), "utf8"),
);
console.log(`Generated ${Object.keys(pages).length} pages from copy.md`);
