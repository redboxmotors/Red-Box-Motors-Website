import { ContactLink } from '@/components/contact/ContactModal';
import { ED, MArrow, mBtnRedCls } from './ui';

// Mobile footer (design_handoff, all screens): #0D0D0D band — TALK TO A
// PERSON eyebrow, CALL / EMAIL / INSTAGRAM stacked, red Contact button
// (opens the global contact modal, site convention), bottom brand strip.

export function MobileFooter({ phone, email }: { phone: string | null; email: string | null }) {
  const tel = (phone ?? '').replace(/[^+\d]/g, '');
  return (
    <footer className="flex flex-col gap-[26px] border-t border-white/[0.06] bg-rb-surface-3 px-5 pb-10 pt-11">
      <div className="flex items-center gap-2.5">
        <div className="h-2 w-2 bg-rb-red" />
        <div className="font-plex text-[10px] tracking-[0.3em] text-rb-red">TALK TO A PERSON</div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-[5px]">
          <div className="font-plex text-[9px] tracking-[0.28em]" style={{ color: ED(0.45) }}>
            CALL
          </div>
          <a href={`tel:${tel}`} className="text-[22px] font-bold text-white">
            {phone}
          </a>
        </div>
        <div className="flex flex-col gap-[5px]">
          <div className="font-plex text-[9px] tracking-[0.28em]" style={{ color: ED(0.45) }}>
            EMAIL
          </div>
          <a href={`mailto:${email}`} className="break-all text-[19px] font-bold text-white">
            {email}
          </a>
        </div>
        <div className="flex flex-col gap-[5px]">
          <div className="font-plex text-[9px] tracking-[0.28em]" style={{ color: ED(0.45) }}>
            INSTAGRAM
          </div>
          <a
            href="https://www.instagram.com/redboxmotors/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[19px] font-bold text-white"
          >
            @redboxmotors
          </a>
        </div>
      </div>
      <ContactLink className={mBtnRedCls}>
        <span>Contact Red Box Motors</span>
        <MArrow />
      </ContactLink>
      <div className="mt-1.5 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-[22px]">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/brand/rbm-logo-header.png" alt="" className="h-3.5 w-3.5" />
          <div className="font-plex text-[9px] tracking-[0.22em]" style={{ color: ED(0.45) }}>
            RED BOX MOTORS · AUSTIN, TX
          </div>
        </div>
        <div className="font-plex text-[9px] tracking-[0.15em]" style={{ color: ED(0.3) }}>
          SALES · RESTORATION
        </div>
      </div>
    </footer>
  );
}
