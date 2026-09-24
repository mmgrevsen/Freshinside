/**
 * SMÅ TEGNINGER TIL "SÅDAN FUNGERER DET"
 * ------------------------------------------------
 * Tre scener, tegnet i kode i stedet for som billedfiler. Fordelen er,
 * at de vejer næsten ingenting, altid er knivskarpe på enhver skærm,
 * og at de bruger hjemmesidens egne farver automatisk.
 *
 * De er BEVIDST tegninger og ikke fotos: et lånt foto af en ren bil
 * ville se ud, som om det var Marcus' eget arbejde. Når han har taget
 * sine egne billeder, kan de her byttes ud.
 *
 * Alle tre er 160x120 og deler samme formsprog, så de ser ud som et
 * sæt frem for tre tilfældige tegninger.
 */

type SceneProps = { className?: string };

const shared = {
  ink: "var(--color-ink)",
  soft: "var(--color-ink-soft)",
  brand: "var(--color-brand-500)",
  brandDeep: "var(--color-brand-700)",
  brandSoft: "var(--color-brand-100)",
  brandPale: "var(--color-brand-50)",
};

/** Trin 1: du vælger en tid i kalenderen. */
export function ChooseTimeScene({ className = "" }: SceneProps) {
  return (
    <svg
      viewBox="0 0 160 120"
      className={className}
      role="img"
      aria-label="En kalender hvor en tid bliver valgt"
    >
      {/* Telefon */}
      <rect x="44" y="12" width="72" height="96" rx="12" fill="#fff" stroke={shared.ink} strokeOpacity="0.12" strokeWidth="2" />
      <rect x="52" y="22" width="56" height="10" rx="5" fill={shared.brandPale} />

      {/* Kalenderfelter */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => {
          const x = 53 + col * 14;
          const y = 42 + row * 16;
          const isChosen = row === 1 && col === 2;
          return (
            <rect
              key={`${row}-${col}`}
              x={x}
              y={y}
              width="11"
              height="11"
              rx="3"
              fill={isChosen ? shared.brand : shared.brandSoft}
              opacity={isChosen ? 1 : 0.7}
            />
          );
        })
      )}

      {/* Markering af den valgte tid */}
      <circle
        cx="86.5"
        cy="63.5"
        r="12"
        fill="none"
        stroke={shared.brand}
        strokeWidth="2"
        strokeDasharray="3 4"
        className="animate-spin-slow"
      />

      {/* Bekræft-knap */}
      <rect x="53" y="90" width="54" height="10" rx="5" fill={shared.ink} />
    </svg>
  );
}

/** Trin 2: Marcus kommer hen til bilen. */
export function WeComeToYouScene({ className = "" }: SceneProps) {
  return (
    <svg
      viewBox="0 0 160 120"
      className={className}
      role="img"
      aria-label="En bil der holder foran et hus"
    >
      {/* Hus i baggrunden */}
      <path d="M18 62 L38 46 L58 62 V92 H18 Z" fill={shared.brandSoft} opacity="0.8" />
      <rect x="32" y="72" width="12" height="20" rx="2" fill={shared.brandPale} />

      {/* Vej */}
      <rect x="0" y="92" width="160" height="3" rx="1.5" fill={shared.ink} opacity="0.12" />

      {/* Bil */}
      <g>
        <path
          d="M66 88 V76 C66 72 69 69 73 69 H84 L92 60 H112 L120 69 H128 C132 69 135 72 135 76 V88 Z"
          fill="#fff"
          stroke={shared.ink}
          strokeOpacity="0.15"
          strokeWidth="2"
        />
        {/* Ruder */}
        <path d="M95 68 L100 62 H110 L115 68 Z" fill={shared.brandPale} />
        {/* Hjul */}
        <circle cx="82" cy="88" r="7" fill={shared.ink} />
        <circle cx="82" cy="88" r="3" fill="#fff" />
        <circle cx="122" cy="88" r="7" fill={shared.ink} />
        <circle cx="122" cy="88" r="3" fill="#fff" />
      </g>

      {/* Kortnål over bilen */}
      <g className="animate-float">
        <path
          d="M102 34 C102 28 106 24 111 24 C116 24 120 28 120 34 C120 41 111 50 111 50 C111 50 102 41 102 34 Z"
          fill={shared.brand}
        />
        <circle cx="111" cy="33" r="4" fill="#fff" />
      </g>
    </svg>
  );
}

/** Trin 3: bilen er ren igen. */
export function FreshCarScene({ className = "" }: SceneProps) {
  return (
    <svg
      viewBox="0 0 160 120"
      className={className}
      role="img"
      aria-label="Et rent bilsæde der skinner"
    >
      {/* Sæde */}
      <path
        d="M52 96 V66 C52 52 60 42 74 42 H84 C98 42 106 52 106 66 V96 Z"
        fill="#fff"
        stroke={shared.ink}
        strokeOpacity="0.12"
        strokeWidth="2"
      />
      {/* Ryglæn-syninger */}
      <path d="M68 54 V92" stroke={shared.brandSoft} strokeWidth="3" strokeLinecap="round" />
      <path d="M90 54 V92" stroke={shared.brandSoft} strokeWidth="3" strokeLinecap="round" />
      {/* Nakkestøtte */}
      <rect x="66" y="24" width="26" height="13" rx="6" fill="#fff" stroke={shared.ink} strokeOpacity="0.12" strokeWidth="2" />

      {/* Sædehynde */}
      <rect x="44" y="92" width="70" height="14" rx="7" fill={shared.brandPale} />

      {/* Gnistre */}
      <g fill={shared.brand}>
        <path
          d="M34 44 L36.5 51 L43 53.5 L36.5 56 L34 63 L31.5 56 L25 53.5 L31.5 51 Z"
          className="animate-twinkle"
        />
        <path
          d="M122 62 L124 67.5 L129 69.5 L124 71.5 L122 77 L120 71.5 L115 69.5 L120 67.5 Z"
          className="animate-twinkle"
          style={{ animationDelay: "1.1s" }}
        />
        <path
          d="M114 30 L115.5 34 L119 35.5 L115.5 37 L114 41 L112.5 37 L109 35.5 L112.5 34 Z"
          className="animate-twinkle"
          style={{ animationDelay: "2.2s" }}
        />
      </g>
    </svg>
  );
}

export const stepScenes = [ChooseTimeScene, WeComeToYouScene, FreshCarScene];
