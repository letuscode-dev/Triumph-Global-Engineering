export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2
        className={`mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            light ? "text-brand-100" : "text-slate-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
