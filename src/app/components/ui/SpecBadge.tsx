interface SpecBadgeProps {
  children: React.ReactNode;
}

export default function SpecBadge({ children }: SpecBadgeProps) {
  return (
    <span className="relative mx-0.5 inline-block font-medium text-[var(--accent-primary)] transition duration-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-center after:scale-x-40 after:bg-[color-mix(in_srgb,var(--accent-primary)_42%,transparent)] after:transition after:duration-300 hover:-translate-y-px hover:after:scale-x-100 hover:after:bg-[var(--accent-primary)]">
      {children}
    </span>
  );
}
