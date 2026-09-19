import type { GalleryTileData } from '../../types';

export function GalleryTile({ tile }: { tile: GalleryTileData }) {
  const Icon = tile.icon;
  return (
    <figure className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${tile.gradient} transition-transform duration-500 group-hover:scale-105`}
      />
      <div className="absolute inset-0 bg-dots-light opacity-60" aria-hidden="true" />
      <Icon
        className="absolute -bottom-7 -right-5 h-32 w-32 rotate-12 text-white/20 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
        aria-hidden="true"
      />
      <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white ring-1 ring-white/30 backdrop-blur-sm">
        {tile.category}
      </span>
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-4 pt-10">
        <p className="text-sm font-bold text-white">{tile.title}</p>
        <p className="mt-0.5 text-xs font-medium text-white/70">{tile.meta}</p>
      </figcaption>
    </figure>
  );
}
