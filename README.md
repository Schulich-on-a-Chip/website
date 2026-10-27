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

The workflow builds and publishes `_site/`. Keep `schulichonachip.ca` configured
in Pages settings and its DNS pointed at GitHub Pages to use the existing custom
domain. Relative links also support the default repository URL.
