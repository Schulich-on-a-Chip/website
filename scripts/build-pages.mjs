import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { format, resolveConfig } from "prettier";

// Keep the shared layout here; page text and content metadata live in copy.md.
const copy = JSON.parse(
  readFileSync(new URL("../copy.md", import.meta.url), "utf8").match(
    /```json\s*([\s\S]*?)```/,
  )[1],
);
const outputDirectory = new URL("../public/", import.meta.url);
const htmlFormatOptions = {
  ...(await resolveConfig(
    fileURLToPath(new URL("../public/index.html", import.meta.url)),
  )),
  parser: "html",
};

// Shared markup helpers.
const escapeHtml = (s) =>
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
    ? /* HTML */ `
        <svg viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 6 9 7 9-7" />
        </svg>
      `
    : name === "instagram"
      ? /* HTML */ `
          <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <path d="M17 7h.01" />
          </svg>
        `
      : /* HTML */ `
          <svg
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 256"
            aria-hidden="true"
          >
            <path
              d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453"
              fill="currentColor"
              stroke="none"
            />
          </svg>
        `;
const arrow = /* HTML */ `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14m-5-5 5 5-5 5" />
  </svg>
`;
const link = (href, label, className = "") => /* HTML */ `
  <a class="${className}" href="${escapeHtml(href)}">
    ${escapeHtml(label)}${className.includes("button") ? arrow : ""}
  </a>
`;
const navLink = (key, current) => /* HTML */ `
  <a href="${url(key)}" ${key === current ? ' aria-current="page"' : ""}>
    ${escapeHtml(copy.navigation[key])}
  </a>
`;
const nav = (key) => /* HTML */ `
  <nav class="primary-nav" aria-label="${escapeHtml(copy.footer.links)}">
    <div class="nav-side">${navLink("team", key)}${navLink("about", key)}</div>
    <div class="nav-emblem">
      <a class="brand" href="/" aria-label="${escapeHtml(copy.brand)}">
        <img
          src="/images/logo.png"
          width="54"
          height="54"
          alt="${escapeHtml(copy.accessibility.logo)}"
        />
      </a>
      <a
        class="home-button"
        href="/"
        aria-label="${escapeHtml(copy.navigation.home)}"
        ${key === "home" ? ' aria-current="page"' : ""}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m3 10 9-7 9 7M5 9v11h14V9M9 20v-7h6v7" />
        </svg>
      </a>
    </div>
    <div class="nav-side">
      ${navLink("projects", key)}${navLink("events", key)}
    </div>
  </nav>
`;
const member = (person) => /* HTML */ `
  <article class="member">
    <img
      class="portrait"
      src="/${escapeHtml(person.image)}"
      alt="${escapeHtml(person.name)}"
      loading="lazy"
      width="120"
      height="120"
    />
    <div>
      <h3>${escapeHtml(person.name)}</h3>
      <p>${escapeHtml(person.role)}</p>
    </div>
    <a
      class="member-link"
      href="${escapeHtml(person.linkedin)}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="${escapeHtml(person.name)} · ${escapeHtml(copy.footer.linkedin)}"
    >
      ${icon("linkedin")}
    </a>
  </article>
`;
const heading = (title, sub = "") => /* HTML */ `
  <header class="page-heading">
    ${
      sub
        ? /* HTML */ `
            <p class="eyebrow">${escapeHtml(sub)}</p>
          `
        : ""
    }
    <h1>${escapeHtml(title)}</h1>
  </header>
`;
// Page layouts. Shared navigation, footer, and contact links are added below.
const pages = {
  home: /* HTML */ `
    <section class="home-hero">
      <h1>${escapeHtml(copy.home.title)}</h1>
      <h2>${escapeHtml(copy.home.subtitle)}</h2>
      ${link("/support#become-a-sponsor", copy.support.ctaLabel, "dock-support")}
    </section>
  `,
  about: /* HTML */ `
    ${heading(copy.about.title)}
    <section class="mission reading">
      <p>${escapeHtml(copy.about.body)}</p>
    </section>
  `,
  team: /* HTML */ `
    ${heading(copy.team.title)}
    <section class="team-section">
      <h2>${escapeHtml(copy.team.executives)}</h2>
      <div class="members executives">
        ${copy.team.members.slice(0, 3).map(member).join("")}
      </div>
      <h2>${escapeHtml(copy.team.membersTitle)}</h2>
      <div class="members">
        ${copy.team.members.slice(3).map(member).join("")}
      </div>
    </section>
  `,
  projects: /* HTML */ `
    ${heading(copy.projects.title)}
    <article class="feature">
      <div class="feature-copy">
        <h2>${escapeHtml(copy.projects.year)}</h2>
        <p>${escapeHtml(copy.projects.body)}</p>
      </div>
      <div class="chip-art" aria-hidden="true">
        <div class="chip-pins">
          <div class="chip-die"><img src="/images/logo.png" alt="" /></div>
        </div>
      </div>
    </article>
  `,
  events: /* HTML */ `
    ${heading(copy.events.title)}
    <article class="feature event">
      <div class="feature-copy">
        <h2>${escapeHtml(copy.events.name)}</h2>
        <p>${escapeHtml(copy.events.body)}</p>
      </div>
      <img
        class="event-photo"
        src="/images/our-club.JPG"
        alt=""
        width="500"
        height="500"
      />
    </article>
  `,
  support: /* HTML */ `
    ${heading(copy.support.title, copy.support.subtitle)}
    <section class="sponsors">
      ${copy.support.sponsors
        .map(
          (s) => /* HTML */ `
            <article class="sponsor">
              <div class="sponsor-image">
                <img
                  src="/${escapeHtml(s.image)}"
                  alt="${escapeHtml(s.name)}"
                />
              </div>
              <h2>${escapeHtml(s.name)}</h2>
            </article>
          `,
        )
        .join("")}
    </section>
    <section id="become-a-sponsor" class="support-contact reading">
      <p class="eyebrow">${escapeHtml(copy.support.ctaLabel)}</p>
      <h2>${escapeHtml(copy.support.ctaHeading)}</h2>
      <p>${escapeHtml(copy.support.body)}</p>
      ${link(`mailto:${copy.footer.email}`, copy.support.contact, "button")}
    </section>
  `,
  recruitment: /* HTML */ `
    ${heading(copy.recruitment.title, copy.recruitment.subtitle)}
    <section class="reading recruitment">
      <h2>${escapeHtml(copy.recruitment.label)}</h2>
      <p>${escapeHtml(copy.recruitment.body)}</p>
      ${link(`mailto:${copy.footer.email}`, copy.support.contact, "button")}
    </section>
  `,
};
// Decorative traces stay outside the content swapped during navigation.
const circuitPaths = {
  side: [
    "M0 25H28L52 49V176L76 200V320L108 352V430",
    "M0 120H16L36 140V274L60 298V455L88 483V590",
    "M0 375H20L44 399V540L68 564V690L100 722V805",
    "M0 610H16L36 630V760L60 784V870L90 900",
    "M0 850H16L28 838V710L12 694V500",
  ],
  cap: [
    "M0 16H130L156 42H285L310 67H390",
    "M0 35H105L133 63H240L265 88H320",
    "M900 18H755L730 43H625L600 68H520",
    "M900 39H790L762 67H680L656 91H590",
  ],
};
const circuits = `<div class="circuits" aria-hidden="true">${[
  ["left", "side"],
  ["right", "side"],
  ["top", "cap"],
  ["bottom", "cap"],
]
  .map(
    ([edge, shape]) =>
      `<svg class="circuit-panel circuit-${edge}" viewBox="${shape === "side" ? "0 0 120 900" : "0 0 900 100"}" preserveAspectRatio="none" focusable="false">${circuitPaths[
        shape
      ]
        .map(
          (d, i) =>
            `<path class="circuit-trace" d="${d}"/><path class="circuit-pulse" d="${d}" pathLength="1000" style="--pulse-delay: -${i * 3 + (edge === "right" || edge === "bottom" ? 5 : 0)}s; --pulse-duration: ${14 + i * 2}s"/>`,
        )
        .join("")}</svg>`,
  )
  .join("")}</div>`;

// Render each page inside the shared document layout.
for (const [key, content] of Object.entries(pages)) {
  const title = key === "home" ? copy.navigation.home : copy[key].title;
  const html = /* HTML */ `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#0a002c" />
        <title>${escapeHtml(title)} | ${escapeHtml(copy.brand)}</title>
        <link rel="icon" href="/images/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Exo:wght@400;500&amp;display=swap"
        />
        <link rel="stylesheet" href="/styles.css" />
        <script type="module" src="/site.js"></script>
      </head>
      <body data-page="${key}">
        <div class="wafer-field" aria-hidden="true">
          <div class="wafer-gradient" data-gradient="home"></div>
          <div class="wafer-gradient" data-gradient="about"></div>
          <div class="wafer-gradient" data-gradient="team"></div>
          <div class="wafer-gradient" data-gradient="projects"></div>
          <div class="wafer-gradient" data-gradient="events"></div>
          <div class="wafer-gradient" data-gradient="support"></div>
          <div class="wafer-gradient" data-gradient="recruitment"></div>
          <div class="wafer-gradient" data-gradient="activity"></div>
        </div>
        ${circuits}
        <div class="bottom-fade" aria-hidden="true">
          <div class="wafer-gradient" data-gradient="home"></div>
          <div class="wafer-gradient" data-gradient="about"></div>
          <div class="wafer-gradient" data-gradient="team"></div>
          <div class="wafer-gradient" data-gradient="projects"></div>
          <div class="wafer-gradient" data-gradient="events"></div>
          <div class="wafer-gradient" data-gradient="support"></div>
          <div class="wafer-gradient" data-gradient="recruitment"></div>
          <div class="wafer-gradient" data-gradient="activity"></div>
        </div>
        <header class="site-header">${nav(key)}</header>
        <main id="content" tabindex="-1">${content}</main>
        <footer class="site-footer">
          <a class="footer-brand" href="/">${escapeHtml(copy.brand)}</a>
          <div class="footer-links">
            ${link("/recruitment", copy.footer.recruitment)}
            <div class="footer-contact">
              ${link(`mailto:${copy.footer.email}`, copy.footer.contact)}${link(`mailto:${copy.footer.email}`, copy.footer.email)}
            </div>
          </div>
        </footer>
        <aside
          class="contact-dock"
          aria-label="${escapeHtml(copy.footer.contact)}"
        >
          <a
            href="https://www.linkedin.com/company/schulich-on-a-chip"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="${escapeHtml(copy.footer.linkedin)}"
          >
            ${icon("linkedin")}
          </a>
          <a
            href="https://www.instagram.com/soc.ucalgary"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="${escapeHtml(copy.footer.instagram)}"
          >
            ${icon("instagram")}
          </a>
          <a
            href="mailto:${escapeHtml(copy.footer.email)}"
            aria-label="${escapeHtml(copy.footer.email)}"
          >
            ${icon("mail")}
          </a>
          <span class="dock-divider"></span>
          ${link("/support", copy.navigation.support, "dock-support")}
        </aside>
      </body>
    </html>
  `;
  const formattedHtml = await format(html, htmlFormatOptions);
  writeFileSync(
    new URL(key === "home" ? "index.html" : `${key}.html`, outputDirectory),
    formattedHtml,
  );
}
// Keep old inbound Activity links working without retaining duplicate page copy.
writeFileSync(
  new URL("activity.html", outputDirectory),
  readFileSync(new URL("projects.html", outputDirectory), "utf8"),
);
console.log(`Generated ${Object.keys(pages).length} pages from copy.md`);
