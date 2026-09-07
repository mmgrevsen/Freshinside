/**
 * QUIZ: "HVILKEN PAKKE PASSER TIL MIN BIL?"
 * ------------------------------------------------
 * En kort quiz, der hjælper kunder, som ikke ved, hvad de skal vælge.
 *
 * SÅDAN VIRKER DET:
 * Hvert svar giver et antal point. Til sidst lægges pointene sammen:
 *   - Under "deepThreshold" point  -> anbefaler Fresh Clean
 *   - Fra "deepThreshold" og opefter -> anbefaler Fresh Deep
 *
 * Nogle svar foreslår også en ekstra service (add-on). Id'et skal
 * matche et id fra src/config/addons.ts.
 *
 * Vil du ændre quizzen, retter du bare i spørgsmålene herunder.
 */

export type QuizOption = {
  label: string;
  points: number;
  /** Foreslår denne ekstra service, hvis svaret vælges (valgfrit) */
  suggestsAddOn?: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  /** Viser farvede prikker (grøn/gul/rød) ud for svarene */
  visualScale?: boolean;
  options: QuizOption[];
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "tilstand",
    question: "Hvordan ser bilen ud indvendigt lige nu?",
    visualScale: true,
    options: [
      { label: "Let beskidt – mest lidt støv", points: 0 },
      { label: "Normalt brugt", points: 1 },
      {
        label: "Meget beskidt",
        points: 2,
        suggestsAddOn: "beskidte-saeder",
      },
    ],
  },
  {
    id: "passagerer",
    question: "Er der børn eller kæledyr med i bilen til daglig?",
    options: [
      { label: "Nej", points: 0 },
      { label: "Ja, børn", points: 1, suggestsAddOn: "pletbehandling" },
      { label: "Ja, kæledyr", points: 1, suggestsAddOn: "dyrehaar" },
      { label: "Ja, begge dele", points: 2, suggestsAddOn: "dyrehaar" },
    ],
  },
  {
    id: "sidst",
    question: "Hvornår blev bilen sidst gjort ren indvendigt?",
    options: [
      { label: "Inden for de sidste par måneder", points: 0 },
      { label: "For omkring et halvt år siden", points: 1 },
      {
        label: "Kan ikke huske det",
        points: 2,
        suggestsAddOn: "lugtfjernelse",
      },
    ],
  },
];

export const quizConfig = {
  /** Fra dette pointtal anbefales den store pakke */
  deepThreshold: 3,
  /** Pakke-id fra src/config/pricing.ts */
  lightPackageId: "fresh-clean",
  deepPackageId: "fresh-deep",
} as const;
