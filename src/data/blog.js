/** Club journal — articles written by members. Cover art in public/images/blog/. */

export const POSTS = [
  {
    id: 'fusion',
    title: "Fusion's hot streak: what 'net energy gain' really means",
    category: 'Physics · Energy',
    date: '2026-09-12',
    readTime: 5,
    author: 'Luwangula Alpha',
    cover: '/images/blog/fusion.jpg',
    tags: ['Fusion', 'Plasma', 'Energy policy'],
    excerpt:
      'Ignition was physics; the hard part is engineering. A student-friendly tour of what the fusion milestones actually measured — and what comes next.',
    body: [
      {
        p: 'Fusion is the process that powers the Sun: light nuclei squeezed until they merge, releasing energy. For decades the joke was that fusion is "always thirty years away". Recent results have shifted the mood — so it is worth being precise about what has, and has not, been achieved.',
      },
      {
        h: 'What ignition actually means',
        p: 'In December 2022, the National Ignition Facility (NIF) in California fired 2.05 megajoules of laser energy at a peppercorn-sized capsule of fuel — and got about 3.15 MJ of fusion energy out. That is "scientific breakeven": more energy from the fusion reactions than the laser light delivered to the target.',
      },
      {
        h: 'The catch nobody mentions',
        p: 'The lasers themselves drew roughly 300 MJ from the grid to deliver those 2 MJ to the target. Count the whole facility and the balance sheet is deeply negative. Ignition proved the physics; the engineering goal — a plant that produces net electricity — is a different, harder mountain.',
      },
      {
        h: 'Magnetic confinement, the other horse',
        p: 'Tokamaks like ITER and the growing family of private compact reactors hold hydrogen plasma at 150 million °C inside magnetic cages. Progress here is measured in "triple product" — density × temperature × confinement time — and it has doubled roughly every 1.8 years since the 1970s, a trend some call the fusion Moore’s law.',
      },
      {
        p: 'Why bother, when solar is cheap? Because fusion is the only energy source we know that offers solar-fuel density without weather dependence or long-lived waste. The fuel — deuterium from seawater and lithium-derived tritium — would last millions of years.',
      },
      {
        h: 'Our verdict in the club',
        p: 'Scepticism and hope can coexist. Any honest reading says commercial fusion is unlikely before the 2040s — but the plasma physics is now proven on two separate machines. That has never been true before. The thirty-year clock may finally have started.',
      },
    ],
  },
  {
    id: 'genes',
    title: 'Rewriting the book of life: CRISPR base editing goes clinical',
    category: 'Biology · Medicine',
    date: '2026-09-05',
    readTime: 6,
    author: 'Nabirye Sarah',
    cover: '/images/blog/genes.jpg',
    tags: ['CRISPR', 'Genetics', 'Medicine'],
    excerpt:
      'From cutting DNA to chemically rewriting single letters — base editing is quietly becoming one of medicine’s most precise tools. Here is how it works.',
    body: [
      {
        p: 'In 2012, scientists showed that a bacterial immune system called CRISPR-Cas9 could be repurposed to cut DNA at almost any chosen spot. It won a Nobel Prize in 2020. But cutting has a side effect: the cell repairs the break sloppily. Enter base editing — a way to rewrite single letters of DNA without cutting the strand at all.',
      },
      {
        h: 'From scissors to pencil',
        p: 'A base editor is a disabled Cas enzyme fused to a chemical machine that converts one DNA letter into another — for example, C•G into T•A. Because there is no double-strand break, the cell does not scramble the text while repairing it. Roughly half of all known disease-causing mutations are single-letter typos, which is exactly what base editors fix best.',
      },
      {
        h: 'The proof in patients',
        p: 'In 2022 a girl named Alyssa became the first person treated with base editing: immune cells were edited in three ways to hunt her leukaemia, and she has remained in remission. Trials for sickle-cell disease, beta thalassaemia and familial hypercholesterolaemia have followed, with most patients essentially cured in single treatments.',
      },
      {
        h: 'Prime editing: the search-and-replace function',
        p: 'A newer cousin, prime editing, writes new sequences of any length using an RNA "search string" — think find-and-replace for the genome. Combined, these tools can in principle correct about 90% of known pathogenic mutations.',
      },
      {
        h: 'The questions we still argue about',
        p: 'Editing blood or liver cells affects one patient; editing embryos, sperm or eggs changes every descendant forever. Most countries ban or tightly restrict heritable editing. The therapy also remains expensive — sickle-cell treatments have been priced near two million dollars — so the equity question is as hard as the biology.',
      },
      {
        p: 'Our club reading circle’s take: this is the decade biology stopped being a descriptive science and became an engineering one. The exam syllabus will catch up eventually.',
      },
    ],
  },
  {
    id: 'moon',
    title: 'Back to the Moon: the Artemis programme, explained',
    category: 'Space',
    date: '2026-08-28',
    readTime: 5,
    author: 'Ssekandi David',
    cover: '/images/blog/moon.jpg',
    tags: ['Artemis', 'NASA', 'Exploration'],
    excerpt:
      'Fifty years after Apollo, humanity is building a permanent presence around the Moon. A stargazer’s guide to who is going, how, and why it matters.',
    body: [
      {
        p: 'Apollo 17 left the Moon in December 1972, and for half a century nobody went back. Artemis — led by NASA with dozens of partner countries and companies — aims to change that, this time to stay.',
      },
      {
        h: 'The plan, in four moves',
        p: 'First, Orion (Artemis I, flown uncrewed in 2022) looped around the Moon and survived re-entry at 11 km/s. Second, Artemis II will carry four astronauts around the Moon and back — the first crewed lunar flight since 1972. Third, Artemis III lands two astronauts near the lunar south pole, where permanently shadowed craters hide water ice. Fourth, the Gateway station in lunar orbit gives the programme a permanent address.',
      },
      {
        h: 'Why the south pole?',
        p: 'Water ice means drinking water, oxygen to breathe, and — split by electricity — hydrogen and oxygen rocket propellant. The Moon’s first permanent base is effectively a fuel station and physics laboratory rolled into one. Permanently sunlit ridges nearby provide near-continuous solar power.',
      },
      {
        h: 'Not a Apollo rerun',
        p: 'Everything about Artemis is different: international crews (including, by plan, the first woman and first person of colour on the Moon), commercial landers delivering cargo, and the giant SLS rocket joined by Starship, which must demonstrate orbital refuelling — itself a first — before landing crews.',
      },
      {
        h: 'Why we care',
        p: 'The Moon is the only place humans can learn to live off-Earth while three days from home. Every kilogram launched from the Moon instead of Earth saves about twenty kilograms of rocket and fuel. If humanity ever becomes a spacefaring species, the first chapter is being written right now.',
      },
    ],
  },
  {
    id: 'qubits',
    title: 'Qubits 101: why a quantum computer is not just a faster PC',
    category: 'Computing',
    date: '2026-08-21',
    readTime: 6,
    author: 'Namutebi Fatima',
    cover: '/images/blog/qubits.jpg',
    tags: ['Quantum', 'Computing', 'Explainer'],
    excerpt:
      'Superposition, entanglement and interference without the hand-waving — and an honest look at what quantum computers will (and won’t) be good for.',
    body: [
      {
        p: 'Every few weeks an announcement claims quantum computers will "solve everything". They won’t. But what they can do is stranger and more interesting than the hype. Here is the club’s no-maths-required tour.',
      },
      {
        h: 'A bit that refuses to choose',
        p: 'A classical bit is a coin lying heads or tails. A qubit is a coin spinning on the table: until you look, it is in a superposition of both. One spinning coin is not impressive — the magic is that n qubits can hold a superposition of 2^n states at once, and entanglement ties those states together so they cannot be described separately.',
      },
      {
        h: 'Computing with waves',
        p: 'Quantum algorithms work by interference: wrong answers cancel out like noise-cancelling headphones, while right answers reinforce. Shor’s algorithm (1994) uses this trick to factor large numbers exponentially faster than any known classical method — which is why it threatens the encryption protecting your bank account.',
      },
      {
        h: 'The three big problems',
        p: 'Decoherence: qubits lose their quantum state in microseconds from the slightest disturbance, so machines run at temperatures colder than deep space. Errors: a million-qubit machine needs thousands of physical qubits to build one reliable "logical" qubit. And access: real machines are still rare, though cloud access lets anyone — including school clubs — run experiments free.',
      },
      {
        h: 'What they will actually be used for',
        p: 'Simulating molecules and materials (chemistry is quantum, so quantum computers speak it natively), certain optimisation problems, and cryptanalysis. What they won’t do: run your spreadsheets faster. For email and games, classical computers remain unbeatably good.',
      },
      {
        p: 'Our Quantum Physics Circle starts this November — come get your intuition politely broken.',
      },
    ],
  },
  {
    id: 'insects',
    title: 'The quiet countdown: what insect decline means for dinner',
    category: 'Ecology',
    date: '2026-08-14',
    readTime: 4,
    author: 'Achieng Grace',
    cover: '/images/blog/insects.jpg',
    tags: ['Biodiversity', 'Pollination', 'Ecology'],
    excerpt:
      'Roughly one in three bites of food depends on a pollinator. A student’s guide to the insect decline data — and the surprisingly hopeful fixes.',
    body: [
      {
        p: 'In 2017, a study of German nature reserves found flying-insect biomass had fallen by around 75% in under three decades. Similar patterns have since been reported across Europe and the Americas. Scientists have a name for it: "defaunation of the Anthropocene". Everyone else calls it the insect apocalypse — but the story is more nuanced than the headlines.',
      },
      {
        h: 'Why insects matter to you personally',
        p: 'About 75% of leading global food crops depend at least partly on animal pollination, and bees do most of that work. Insects also recycle nutrients, control pests, and form the base of food webs for birds and fish. Remove insects and ecosystems do not slowly decline — they reorganise, quickly, and not in our favour.',
      },
      {
        h: 'What the data actually says',
        p: 'Declines are real but uneven: some species (generalists like hoverflies) hold on, while specialists — bees that visit one flower, moths that mate by one moon phase — vanish first. The main drivers, in rough order: habitat loss, intensive agriculture and pesticides, light pollution, and climate change shifting seasons out of sync with insect life cycles.',
      },
      {
        h: 'The hopeful part',
        p: 'Insects breed fast, so populations can recover fast when conditions improve. England’s "wildbelt" rewilding strips, pesticide restrictions in the EU, and city pollinator corridors have all produced measurable rebounds within a few years. Even a school garden with native flowering plants becomes a measurable habitat island.',
      },
      {
        p: 'Which is exactly what our Green Energy & Ecology teams are doing: the biodiversity count behind the science block is a long-term dataset, and every species we log is a data point arguing for more wild corners on campus.',
      },
    ],
  },
  {
    id: 'ai-lab',
    title: 'AI in the lab: how machine learning is finding new antibiotics',
    category: 'AI · Biology',
    date: '2026-09-17',
    readTime: 5,
    author: 'Okello Emmanuel',
    cover: '/images/blog/ai-lab.jpg',
    tags: ['Machine learning', 'Antibiotics', 'Drug discovery'],
    excerpt:
      'Antimicrobial resistance could claim 10 million lives a year by 2050. Machine learning is now searching chemical space — and finding molecules no human would have tried.',
    body: [
      {
        p: 'Antibiotics are a 20th-century miracle leaking into the 21st. Overuse has bred resistant "superbugs"; the World Health Organization warns that by 2050 drug-resistant infections could kill 10 million people a year. Meanwhile, the pipeline of new antibiotics has nearly dried up — discovering them the old way is slow and commercially unattractive.',
      },
      {
        h: 'Enter the screening robots',
        p: 'In 2020, MIT researchers trained a neural network on ~2,500 molecules and asked it to search a library of 107 million compounds for ones that looked "antibiotic-like" but chemically unlike existing drugs. Within days it shortlisted candidates, and one — halicin, named after HAL from 2001: A Space Odyssey — killed resistant bacteria by a mechanism unlike any antibiotic in use.',
      },
      {
        h: 'Why AI changes the economics',
        p: 'Chemical space contains more small molecules than there are atoms in the observable universe. Classical screening explores it one plate at a time; a trained model explores it in bulk, learning the grammar of what makes a molecule bind a target. More candidates now reach the lab already pre-filtered for toxicity and synthesizability.',
      },
      {
        h: 'AlphaFold and the shape of everything',
        p: 'The same revolution helped solve a 50-year-old grand challenge: predicting protein structures. DeepMind’s AlphaFold has now predicted structures for over 200 million proteins, and drug designers use those shapes like maps of a lock while they craft the key.',
      },
      {
        h: 'Honest caveats',
        p: 'Models hallucinate plausible-looking molecules that cannot be synthesised; clinical trials still take years; and halicin itself is not yet a medicine. AI accelerates the search, it does not skip the science.',
      },
      {
        p: 'Still — our AI Circle is training a tiny model on the public drug-resistance dataset this term. Sometimes the future of medicine starts with a laptop and a question.',
      },
    ],
  },
]
