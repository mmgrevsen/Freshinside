import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "btn-shine bg-ink text-white hover:bg-brand-700 focus-visible:outline-brand-500 shadow-sm shadow-ink/10 hover:shadow-lg hover:shadow-brand-500/25",
  secondary:
    "bg-white text-ink border border-ink/15 hover:border-brand-400 hover:text-brand-700 focus-visible:outline-brand-500",
  ghost: "text-ink hover:text-brand-700 focus-visible:outline-brand-500",
};

const sizeStyles: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type ButtonOwnProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps<T>>) {
  const Component = as || "button";
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
