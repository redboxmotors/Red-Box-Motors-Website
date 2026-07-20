import { MobileHeader, type MobileNavKey } from './MobileHeader';

// Wrapper for every mobile screen: renders below md only, sets the mobile
// page canvas (#0A0A0A / #EDEDED) and mounts the mobile header.

export function MobileShell({
  current = '',
  children,
}: {
  current?: MobileNavKey;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-rb-surface text-[#EDEDED] md:hidden">
      <MobileHeader current={current} />
      {children}
    </div>
  );
}
