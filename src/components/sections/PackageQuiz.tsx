"use client";

import { useState } from "react";
import { quizConfig, quizQuestions, type QuizOption } from "@/config/quiz";
import { pricingPackages } from "@/config/pricing";
import { addOns } from "@/config/addons";
import { bookingAnchor } from "@/config/site";
import { selectForBooking } from "@/lib/bookingSelection";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, CheckIcon, SparkleIcon } from "@/components/ui/icons";

const scaleColors = ["bg-emerald-400", "bg-amber-400", "bg-red-400"];

export function PackageQuiz() {
  const [answers, setAnswers] = useState<QuizOption[]>([]);

  const currentIndex = answers.length;
  const isDone = currentIndex >= quizQuestions.length;
  const currentQuestion = isDone ? null : quizQuestions[currentIndex];

  const totalPoints = answers.reduce((sum, answer) => sum + answer.points, 0);
  const recommendedId =
    totalPoints >= quizConfig.deepThreshold
      ? quizConfig.deepPackageId
      : quizConfig.lightPackageId;
  const recommended = pricingPackages.find((pkg) => pkg.id === recommendedId);

  const suggestedAddOnIds = Array.from(
    new Set(
      answers
        .map((answer) => answer.suggestsAddOn)
        .filter((id): id is string => Boolean(id))
    )
  );
  const suggestedAddOns = addOns.filter((addOn) =>
    suggestedAddOnIds.includes(addOn.id)
  );

  function saveChoiceAndBook() {
    selectForBooking({ packageId: recommendedId, addOnIds: suggestedAddOnIds });
  }

  return (
    <section id="quiz" className="py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="Hvilken pakke passer til mig?"
            title="Er du i tvivl? Svar på tre spørgsmål"
            description="Så foreslår vi den pakke, der passer bedst til din bil."
          />
        </Reveal>

        <Reveal className="w-full max-w-2xl">
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm shadow-ink/5 sm:p-10">
            {/* Fremdrift */}
            <div className="mb-8 flex items-center justify-center gap-2">
              {quizQuestions.map((question, index) => (
                <span
                  key={question.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index < currentIndex
                      ? "w-8 bg-brand-500"
                      : index === currentIndex
                        ? "w-8 bg-brand-300"
                        : "w-4 bg-ink/10"
                  }`}
                />
              ))}
            </div>

            {currentQuestion && (
              <div className="flex flex-col gap-5">
                <h3 className="text-center text-xl font-semibold text-ink">
                  {currentQuestion.question}
                </h3>

                <div className="flex flex-col gap-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setAnswers((current) => [...current, option])}
                      className="card-lift flex items-center gap-3 rounded-xl border border-ink/10 bg-white px-5 py-4 text-left text-sm font-medium text-ink"
                    >
                      {currentQuestion.visualScale && (
                        <span
                          aria-hidden="true"
                          className={`h-3 w-3 flex-shrink-0 rounded-full ${
                            scaleColors[option.points] ?? scaleColors[0]
                          }`}
                        />
                      )}
                      {option.label}
                    </button>
                  ))}
                </div>

                {currentIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setAnswers((current) => current.slice(0, -1))}
                    className="mx-auto text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
                  >
                    Tilbage
                  </button>
                )}
              </div>
            )}

            {isDone && recommended && (
              <div className="flex flex-col items-center gap-5 text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
                  <SparkleIcon className="h-4 w-4" />
                  Vi anbefaler
                </span>

                <div>
                  <p className="text-3xl font-bold tracking-tight text-ink">
                    {recommended.name}
                  </p>
                  <p className="mt-1 text-ink-soft">
                    {recommended.price} {recommended.priceSuffix} · {recommended.duration}
                  </p>
                </div>

                <p className="max-w-md text-sm leading-relaxed text-ink-soft">
                  {recommended.description}
                </p>

                {suggestedAddOns.length > 0 && (
                  <div className="w-full max-w-sm rounded-xl bg-paper-muted p-4 text-left">
                    <p className="text-sm font-semibold text-ink">
                      Ud fra dine svar kan disse være relevante:
                    </p>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {suggestedAddOns.map((addOn) => (
                        <li
                          key={addOn.id}
                          className="flex items-center gap-2 text-sm text-ink-soft"
                        >
                          <CheckIcon className="h-4 w-4 flex-shrink-0 text-brand-500" />
                          {addOn.name}
                          <span className="ml-auto font-medium text-ink">
                            +{addOn.price} kr.
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-ink-soft">
                      De er valgt på forhånd i booking-formularen – du kan altid fravælge dem.
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button as="a" href={bookingAnchor} size="lg" onClick={saveChoiceAndBook}>
                    Book {recommended.name}
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="lg" onClick={() => setAnswers([])}>
                    Prøv igen
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
