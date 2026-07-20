// Route transition (motion pass 2026-07-20): a template re-mounts on every
// navigation, so each page enters with a soft opacity fade — no transform,
// which would break position:fixed descendants (nav, corner CTAs).
// Reduced-motion disables it in globals.css.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="rb-page-enter">{children}</div>;
}
