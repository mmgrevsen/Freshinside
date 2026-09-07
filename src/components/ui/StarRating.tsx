export function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5 text-brand-500"
      role="img"
      aria-label={`${rating} ud af 5 stjerner`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          fill={index < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.59 5.25 5.8.84-4.2 4.09.99 5.77L10 14.9l-5.18 2.55.99-5.77-4.2-4.09 5.8-.84L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}
