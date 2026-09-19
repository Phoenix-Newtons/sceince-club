import { ArrowUpRight, Users } from 'lucide-react';
import type { Feature } from '../../types';
import { ACCENTS } from '../../lib/accents';

export function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  const accent = ACCENTS[feature.accent];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-200/70 hover:shadow-lift">
      {/* gradient accent line, revealed on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 to-accent-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="flex items-start justify-between">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full ring-1 transition-transform duration-300 group-hover:scale-110 ${accent.wrap}`}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <ArrowUpRight
          className="h-5 w-5 text-slate-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-500"
          aria-hidden="true"
        />
      </div>
      <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900">{feature.title}</h3>
      <p className="mb-4 mt-2 text-sm leading-relaxed text-slate-500">{feature.description}</p>
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-400 [margin-top:auto]">
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-primary-500" aria-hidden="true" />
          {feature.membersActive} active members
        </span>
        <span>{feature.cadence}</span>
      </div>
    </article>
  );
}
