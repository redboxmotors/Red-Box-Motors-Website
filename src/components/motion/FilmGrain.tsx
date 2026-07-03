// Fixed SVG-noise overlay, opacity .05, mix-blend-mode overlay — above
// content, below nothing interactive (pointer-events: none). Pure CSS;
// hidden for reduced motion is unnecessary (it's static).
export function FilmGrain() {
  return <div aria-hidden className="rb-grain" />;
}
