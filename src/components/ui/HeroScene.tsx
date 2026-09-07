/**
 * ANIMERET HERO-ILLUSTRATION
 * ------------------------------------------------
 * En tegnet bilkabine (SVG), som bruges øverst på forsiden i stedet for
 * et foto. Alt er tegnet i kode, så den loader lynhurtigt og altid ser
 * skarp ud – også på store skærme.
 *
 * Vil du senere bruge dit eget foto i stedet, kan denne komponent
 * erstattes med et <Image>-tag i src/components/sections/Hero.tsx.
 */

const sparkles = [
  { x: 150, y: 152, size: 15, delay: "0s" },
  { x: 646, y: 128, size: 11, delay: "0.7s" },
  { x: 556, y: 196, size: 8, delay: "1.4s" },
  { x: 224, y: 208, size: 9, delay: "2.1s" },
  { x: 704, y: 412, size: 13, delay: "1s" },
  { x: 92, y: 424, size: 10, delay: "2.6s" },
];

const dustMotes = [
  { x: 300, y: 300, r: 3.5, delay: "0s" },
  { x: 380, y: 288, r: 2.5, delay: "1.2s" },
  { x: 470, y: 302, r: 3, delay: "2.4s" },
  { x: 560, y: 292, r: 2, delay: "3.1s" },
  { x: 236, y: 296, r: 2.5, delay: "4s" },
];

function sparklePath(x: number, y: number, s: number) {
  return `M ${x} ${y - s} Q ${x} ${y} ${x + s} ${y} Q ${x} ${y} ${x} ${y + s} Q ${x} ${y} ${x - s} ${y} Q ${x} ${y} ${x} ${y - s} Z`;
}

export function HeroScene() {
  return (
    <svg
      viewBox="0 0 800 600"
      role="img"
      aria-label="Illustration af en nyrengjort bilkabine set fra førersædet"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d6f5ef" />
          <stop offset="55%" stopColor="#f2fffc" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="hs-dash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b2739" />
          <stop offset="100%" stopColor="#0b1220" />
        </linearGradient>
        <linearGradient id="hs-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#19bfaf" />
          <stop offset="100%" stopColor="#0b6e66" />
        </linearGradient>
        <radialGradient id="hs-glow">
          <stop offset="0%" stopColor="#62d9c9" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#62d9c9" stopOpacity="0" />
        </radialGradient>
        <clipPath id="hs-windshield">
          <path d="M 108 262 L 182 78 Q 400 56 618 78 L 692 262 Z" />
        </clipPath>
      </defs>

      <rect width="800" height="600" fill="#f7fdfc" />

      {/* Forrude med lys himmel og bløde lysprikker */}
      <g clipPath="url(#hs-windshield)">
        <rect x="100" y="50" width="600" height="220" fill="url(#hs-sky)" />
        <circle cx="250" cy="140" r="34" fill="#ffffff" opacity="0.75" className="animate-float-slow" />
        <circle cx="470" cy="112" r="22" fill="#ffffff" opacity="0.6" className="animate-float" />
        <circle cx="580" cy="170" r="28" fill="#b9f0e6" opacity="0.5" className="animate-float-slow" />
        <path d="M 100 232 Q 400 214 700 232 L 700 262 L 100 262 Z" fill="#cdf5ee" opacity="0.6" />
      </g>
      <path
        d="M 108 262 L 182 78 Q 400 56 618 78 L 692 262 Z"
        fill="none"
        stroke="#0b1220"
        strokeOpacity="0.12"
        strokeWidth="4"
      />

      {/* Bakspejl */}
      <rect x="348" y="60" width="104" height="32" rx="15" fill="#16202e" />
      <rect x="358" y="68" width="84" height="16" rx="8" fill="#22304a" opacity="0.7" />

      {/* Instrumentbord */}
      <path d="M 40 600 L 96 268 Q 400 232 704 268 L 760 600 Z" fill="url(#hs-dash)" />
      <path
        d="M 96 268 Q 400 232 704 268"
        fill="none"
        stroke="#33c2b2"
        strokeOpacity="0.35"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Blødt lysskær bag midterkonsollen */}
      <circle cx="535" cy="360" r="150" fill="url(#hs-glow)" className="animate-pulse-soft" />

      {/* Instrumentgruppe med to visere */}
      <rect x="196" y="300" width="212" height="122" rx="26" fill="#0f1826" />
      <g fill="none" strokeWidth="6" strokeLinecap="round">
        <circle cx="252" cy="361" r="34" stroke="#22304a" />
        <circle
          cx="252"
          cy="361"
          r="34"
          stroke="#33c2b2"
          pathLength={100}
          strokeDasharray="100"
          className="animate-gauge"
          transform="rotate(-90 252 361)"
        />
        <circle cx="352" cy="361" r="34" stroke="#22304a" />
        <circle
          cx="352"
          cy="361"
          r="34"
          stroke="#62d9c9"
          pathLength={100}
          strokeDasharray="100"
          className="animate-gauge"
          style={{ animationDelay: "0.75s" }}
          transform="rotate(-90 352 361)"
        />
      </g>

      {/* Midterskærm */}
      <rect x="442" y="298" width="188" height="124" rx="18" fill="url(#hs-screen)" />
      <rect x="462" y="322" width="96" height="9" rx="4.5" fill="#ffffff" opacity="0.65" />
      <rect x="462" y="344" width="140" height="7" rx="3.5" fill="#ffffff" opacity="0.35" />
      <rect x="462" y="362" width="112" height="7" rx="3.5" fill="#ffffff" opacity="0.25" />
      <path
        d={sparklePath(596, 392, 13)}
        fill="#ffffff"
        opacity="0.9"
        className="animate-twinkle"
        style={{ animationDelay: "0.4s" }}
      />

      {/* Luftdyser */}
      <g fill="#101a28">
        <rect x="112" y="318" width="72" height="34" rx="17" />
        <rect x="648" y="318" width="72" height="34" rx="17" />
      </g>
      <g stroke="#33c2b2" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round">
        <path d="M 130 328 V 342 M 148 328 V 342 M 166 328 V 342" />
        <path d="M 666 328 V 342 M 684 328 V 342 M 702 328 V 342" />
      </g>

      {/* Rat */}
      <g>
        <circle cx="296" cy="470" r="104" fill="none" stroke="#1c2836" strokeWidth="20" />
        <circle
          cx="296"
          cy="470"
          r="94"
          fill="none"
          stroke="#33c2b2"
          strokeOpacity="0.28"
          strokeWidth="3"
        />
        <g stroke="#1c2836" strokeWidth="17" strokeLinecap="round">
          <path d="M 268 466 L 200 460" />
          <path d="M 324 466 L 392 460" />
          <path d="M 296 496 L 296 566" />
        </g>
        <circle cx="296" cy="470" r="28" fill="#16202e" />
        <circle cx="296" cy="470" r="9" fill="#33c2b2" opacity="0.85" />
      </g>

      {/* Sæde-kanter i begge sider */}
      <rect x="-10" y="462" width="120" height="200" rx="44" fill="#131c2a" opacity="0.92" />
      <rect x="690" y="462" width="130" height="200" rx="44" fill="#131c2a" opacity="0.92" />

      {/* Støv der løftes væk fra instrumentbrættet */}
      <g fill="#9cebde">
        {dustMotes.map((mote) => (
          <circle
            key={`${mote.x}-${mote.y}`}
            cx={mote.x}
            cy={mote.y}
            r={mote.r}
            className="animate-rise"
            style={{ animationDelay: mote.delay }}
          />
        ))}
      </g>

      {/* Gnistre der viser, at kabinen er ren */}
      <g>
        {sparkles.map((sparkle) => (
          <path
            key={`${sparkle.x}-${sparkle.y}`}
            d={sparklePath(sparkle.x, sparkle.y, sparkle.size)}
            fill={sparkle.size > 11 ? "#14a79a" : "#33c2b2"}
            className="animate-twinkle"
            style={{ animationDelay: sparkle.delay }}
          />
        ))}
      </g>
    </svg>
  );
}
