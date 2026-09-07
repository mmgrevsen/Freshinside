import { bookingAnchor } from "@/config/site";

export function StickyMobileBookButton() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 p-3 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <a
        href={bookingAnchor}
        className="flex w-full items-center justify-center rounded-full bg-ink px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-ink/20 transition-transform active:scale-[0.98]"
      >
        BOOK NU
      </a>
    </div>
  );
}
