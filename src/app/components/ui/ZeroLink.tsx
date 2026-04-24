interface ZeroLinkProps {
  children: React.ReactNode;
  theme?: string;
  href?: string;
  blank?: boolean;
}

const ZeroLink = ({
  children,
  theme = "--accent-primary",
  href,
  blank = false,
}: ZeroLinkProps) => {
  const commonStyle = {
    color: `var(${theme})`,
    "--spec-badge-line": `color-mix(in srgb, var(${theme}) 42%, transparent)`,
    "--spec-badge-line-hover": `var(${theme})`,
  } as React.CSSProperties;

  const commonClassName =
    "relative mx-0.5 inline-block font-medium transition duration-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-center after:scale-x-40 after:bg-[var(--spec-badge-line)] after:transition after:duration-300 hover:-translate-y-px hover:after:scale-x-100 hover:after:bg-[var(--spec-badge-line-hover)]";

  if (href) {
    return (
      <a
        href={href}
        target={blank ? "_blank" : undefined}
        rel={blank ? "noopener noreferrer" : undefined}
        style={commonStyle}
        className={commonClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <span style={commonStyle} className={commonClassName}>
      {children}
    </span>
  );
};

export default ZeroLink;
