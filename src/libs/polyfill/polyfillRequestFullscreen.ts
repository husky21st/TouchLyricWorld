const polyfillRequestFullscreen = () => {
  // for SSR
  if (typeof window === "undefined") {
    return;
  }

  // for well-supported browser
  if (Element.prototype.requestFullscreen !== undefined) {
    return;
  }

  // @ts-expect-error
  if (Element.prototype.webkitRequestFullscreen !== undefined) {
    Element.prototype.requestFullscreen =
      // @ts-expect-error
      Element.prototype.webkitRequestFullscreen;
    return;
  }

  // @ts-expect-error
  if (Element.prototype.mozRequestFullscreen !== undefined) {
    Element.prototype.requestFullscreen =
      // @ts-expect-error
      Element.prototype.mozRequestFullscreen;
    return;
  }
};

polyfillRequestFullscreen();

export{}