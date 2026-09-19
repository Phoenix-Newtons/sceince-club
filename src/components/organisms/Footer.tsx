import { Atom, Github, Heart, Instagram, Linkedin, Mail, MapPin, Phone, Youtube, type LucideIcon } from 'lucide-react';
import { FEATURES } from '../../data/features';
import { NAV_LINKS } from '../../data/navigation';
import { Container } from '../atoms/Container';
import { NewsletterForm } from '../molecules/NewsletterForm';

interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

const SOCIALS: SocialLink[] = [
  { id: 'github', label: 'Nucleus on GitHub', href: 'https://github.com/nucleus-bssm', icon: Github },
  { id: 'instagram', label: 'Nucleus on Instagram', href: 'https://instagram.com/nucleus.bssm', icon: Instagram },
  { id: 'youtube', label: 'Nucleus on YouTube', href: 'https://youtube.com/@nucleusbssm', icon: Youtube },
  { id: 'linkedin', label: 'Nucleus on LinkedIn', href: 'https://linkedin.com/company/nucleus-bssm', icon: Linkedin },
];

const FOOTNOTES = ['Privacy', 'Terms', 'Code of Conduct'];

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <a href="#home" className="inline-flex items-center gap-2.5" aria-label="Nucleus — back to top">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white">
                <Atom className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <span className="block text-base font-extrabold tracking-tight text-white">Nucleus</span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  BSSM Science Club
                </span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              A student-run science club at BSSM. We run the labs, launch the rockets and publish the data —
              come build with us.
            </p>
            <div className="mt-6 flex gap-2">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 ring-1 ring-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Explore */}
          <nav className="lg:col-span-2" aria-label="Footer">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className="transition-colors duration-200 hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Programs */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Programs</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {FEATURES.map((feature) => (
                <li key={feature.id}>
                  <a href="#features" className="transition-colors duration-200 hover:text-white">
                    {feature.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                <span>
                  BSSM Campus · Building C, Lab 2
                  <span className="block text-xs text-slate-500">Open weekdays 15:30 – 18:00</span>
                </span>
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                <a href="mailto:hello@nucleus.science" className="transition-colors duration-200 hover:text-white">
                  hello@nucleus.science
                </a>
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                <a href="tel:+15550142026" className="transition-colors duration-200 hover:text-white">
                  (555) 014-2026
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 flex flex-col gap-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <h3 className="text-base font-bold text-white">Lab Notes — our monthly digest</h3>
            <p className="mt-1 text-sm leading-relaxed">
              Experiment recaps, upcoming sessions and one great science read. No spam, ever.
            </p>
          </div>
          <NewsletterForm />
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} Nucleus — BSSM Science Club. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {FOOTNOTES.map((item) => (
              <a key={item} href="#home" className="transition-colors duration-200 hover:text-slate-300">
                {item}
              </a>
            ))}
          </div>
          <p className="inline-flex items-center gap-1.5">
            Built with <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" aria-hidden="true" /> by students,
            for students
          </p>
        </div>
      </Container>
    </footer>
  );
}
