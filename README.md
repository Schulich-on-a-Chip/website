# Schulich on a Chip website

## Build

Use Node.js 24, then run:

```sh
npm ci
npm run build
```

The static website is generated in `_site/`, including the compiled browser
emulator scripts. Express is only needed for the existing local server.

## GitHub Pages

In the repository's **Settings → Pages → Build and deployment**, select
**GitHub Actions** as the source. Push to `master` or manually run **Deploy to
GitHub Pages** from the Actions tab.

The workflow builds and publishes `_site/` to
`https://schulich-on-a-chip.github.io/website/`. To use `schulichonachip.ca`,
configure it in Pages settings and point its DNS at GitHub Pages. Relative links
support both addresses.
