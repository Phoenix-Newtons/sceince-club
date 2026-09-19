interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, description, align = 'center' }: SectionHeadingProps) {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-700 ring-1 ring-primary-100">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-relaxed text-slate-500">{description}</p> : null}
    </div>
  );
}
