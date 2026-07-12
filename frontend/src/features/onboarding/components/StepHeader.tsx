interface StepHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function StepHeader({
  eyebrow,
  title,
  description,
}: StepHeaderProps) {
  return (
    <header>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
        {eyebrow}
      </p>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h1>

      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
        {description}
      </p>
    </header>
  );
}
