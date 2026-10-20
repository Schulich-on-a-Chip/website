let navigation;

async function fadeContent(element, from, to, duration, signal) {
  signal.throwIfAborted();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const animation = element.animate(
    [{ opacity: from }, { opacity: to }],
    { duration, easing: "ease-in-out", fill: "both" },
  );
  const cancel = () => animation.cancel();
  signal.addEventListener("abort", cancel, { once: true });
  try {
    await animation.finished;
  } finally {
    signal.removeEventListener("abort", cancel);
    animation.cancel();
  }
}

async function navigate(url, push = true) {
  navigation?.abort();
  navigation = new AbortController();
  const controller = navigation;
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error("Navigation failed");
    const page = new DOMParser().parseFromString(
      await response.text(),
      "text/html",
    );
    if (!page.querySelector("main") || !page.body.dataset.page)
      throw new Error("Unknown page");
    const currentContent = document.querySelector("main");
    const nextContent = page.querySelector("main");
    await fadeContent(
      currentContent,
      getComputedStyle(currentContent).opacity,
      0,
      160,
      controller.signal,
    );
    controller.signal.throwIfAborted();
    currentContent.replaceWith(nextContent);
    document.title = page.title;
    document.body.dataset.page = page.body.dataset.page;
    document.querySelector('meta[name="theme-color"]').content =
      page.querySelector('meta[name="theme-color"]').content;
    document.querySelectorAll("nav a").forEach((a) => {
      a.removeAttribute("aria-current");
      if (new URL(a.href).pathname === url.pathname)
        a.setAttribute("aria-current", "page");
    });
    if (push) history.pushState({}, "", url);
    window.scrollTo({ top: 0, behavior: "instant" });
    nextContent.focus({ preventScroll: true });
    await fadeContent(nextContent, 0, 1, 320, controller.signal);
  } catch (error) {
    if (error.name !== "AbortError") location.assign(url);
  }
}
document.addEventListener("click", (event) => {
  const a = event.target.closest("a");
  if (
    !a ||
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    a.target ||
    a.download
  )
    return;
  const url = new URL(a.href);
  if (
    url.origin !== location.origin ||
    url.hash ||
    ![
      "/",
      "/team",
      "/about",
      "/projects",
      "/events",
      "/support",
      "/recruitment",
      "/activity",
    ].includes(url.pathname)
  )
    return;
  event.preventDefault();
  if (url.pathname === location.pathname) {
    return;
  }
  navigate(url);
});
window.addEventListener("popstate", () =>
  navigate(new URL(location.href), false),
);
