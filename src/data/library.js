/**
 * The Quotes & Facts Library — aggregates every data file into one browsable
 * collection. Add entries by editing the files in src/data/facts and
 * src/data/quotes; counts update automatically everywhere on the site.
 */
import { PHYSICS_FACTS } from './facts/physics.js'
import { CHEMISTRY_FACTS } from './facts/chemistry.js'
import { BIOLOGY_FACTS } from './facts/biology.js'
import { SPACE_FACTS } from './facts/space.js'
import { MATH_FACTS } from './facts/math.js'
import { COMPUTING_FACTS } from './facts/computing.js'
import { EARTH_FACTS } from './facts/earth.js'
import { MEDICINE_FACTS } from './facts/medicine.js'
import { ENGINEERING_FACTS } from './facts/engineering.js'
import { MIND_FACTS } from './facts/mind.js'

import { QUOTES_WISDOM } from './quotes/quotes1.js'
import { QUOTES_PHYSICS_SPACE_MATH } from './quotes/quotes2.js'
import { QUOTES_LIFE_EARTH } from './quotes/quotes3.js'
import { QUOTES_TECH_PIONEERS } from './quotes/quotes4.js'

const asFact = (category) => (text) => ({ type: 'fact', text, author: null, category })

export const FACTS = [
  ...PHYSICS_FACTS.map(asFact('Physics')),
  ...CHEMISTRY_FACTS.map(asFact('Chemistry')),
  ...BIOLOGY_FACTS.map(asFact('Biology')),
  ...SPACE_FACTS.map(asFact('Space')),
  ...MATH_FACTS.map(asFact('Mathematics')),
  ...COMPUTING_FACTS.map(asFact('Computing')),
  ...EARTH_FACTS.map(asFact('Earth & Climate')),
  ...MEDICINE_FACTS.map(asFact('Medicine')),
  ...ENGINEERING_FACTS.map(asFact('Engineering')),
  ...MIND_FACTS.map(asFact('Mind & Brain')),
]

const asQuote = ([text, author, category]) => ({ type: 'quote', text, author, category })

export const QUOTES = [
  ...QUOTES_WISDOM,
  ...QUOTES_PHYSICS_SPACE_MATH,
  ...QUOTES_LIFE_EARTH,
  ...QUOTES_TECH_PIONEERS,
].map(asQuote)

export const LIBRARY = [...QUOTES, ...FACTS]
LIBRARY.forEach((entry, i) => {
  entry.id = i
})

export const CATEGORIES = [
  'Physics',
  'Space',
  'Biology',
  'Chemistry',
  'Mathematics',
  'Computing',
  'Engineering',
  'Medicine',
  'Earth & Climate',
  'Mind & Brain',
  'Wisdom',
]

/** Deterministic "of the day" index — same all day, changes tomorrow. */
export function dailyIndex(len, salt = 0) {
  const day = Math.floor(Date.now() / 86400000)
  return (day * 37 + salt * 101) % Math.max(1, len)
}
