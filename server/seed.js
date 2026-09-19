import { randomUUID } from 'node:crypto';
import { hashPassword } from './passwords.js';

/**
 * Seed content for a fresh database. The frontend contains no hardcoded
 * content — everything below is editable/deletable from the admin panel
 * once the app is running.
 */
export function seed() {
  const admin = {
    id: randomUUID(),
    name: 'Luwangula Alpha',
    email: 'alphaluwangula@proton.me',
    role: 'admin',
    createdAt: new Date().toISOString(),
    ...hashPassword(process.env.ADMIN_PASSWORD || 'Nucleus-2026!'),
  };

  const projects = [
    {
      id: randomUUID(),
      title: 'Rover Mk-III — Mars Yard Prototype',
      category: 'robotics',
      categoryLabel: 'Robotics',
      status: 'In Progress',
      progress: 68,
      summary:
        'A six-wheeled rover with autonomous waypoint navigation, being built for the national planetary-rover challenge.',
      lead: { name: 'Aarav Mehta', role: 'Mechanical Lead' },
      team: [
        { name: 'Aarav Mehta', role: 'Mechanical Lead' },
        { name: 'Sofia Ramirez', role: 'Embedded Systems' },
        { name: 'Kenji Tanaka', role: 'CAD & 3D Printing' },
        { name: 'Amara Okafor', role: 'Autonomy Software' },
      ],
      milestones: [
        { label: 'Design', date: 'May 12', done: true },
        { label: 'Build', date: 'Jul 03', done: true },
        { label: 'Autonomy', date: 'Sep 28', done: false, current: true },
        { label: 'Field test', date: 'Oct 19', done: false },
      ],
      tags: ['ROS 2', 'Computer vision', '3D-printed chassis'],
      updatedAt: '2 hours ago',
      createdBy: admin.id,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      title: 'Swarm Line-Followers for Nationals',
      category: 'robotics',
      categoryLabel: 'Robotics',
      status: 'Peer Review',
      progress: 85,
      summary:
        'A fleet of six palm-sized line-followers racing relay-style — final tuning logs are under team review before the write-up.',
      lead: { name: 'Priya Nair', role: 'Team Captain' },
      team: [
        { name: 'Priya Nair', role: 'Team Captain' },
        { name: 'Daniel Adeyemi', role: 'Electronics' },
        { name: 'Yuki Mori', role: 'Telemetry' },
      ],
      milestones: [
        { label: 'Design', date: 'Apr 20', done: true },
        { label: 'Build', date: 'Jun 14', done: true },
        { label: 'Tune', date: 'Sep 05', done: true },
        { label: 'Post-mortem', date: 'Oct 20', done: false, current: true },
      ],
      tags: ['IR sensors', 'PID tuning', 'Custom PCBs'],
      updatedAt: 'yesterday',
      createdBy: admin.id,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      title: 'Microplastics Census of Miller Creek',
      category: 'eco',
      categoryLabel: 'Eco-Science',
      status: 'In Progress',
      progress: 42,
      summary:
        'Monthly sampling runs mapping microplastic density along the creek, filtered and analysed with a home-built imaging rig.',
      lead: { name: 'Isabella Rossi', role: 'Field Lead' },
      team: [
        { name: 'Isabella Rossi', role: 'Field Lead' },
        { name: 'Omar Haddad', role: 'Chemistry' },
        { name: 'Noah Kim', role: 'Data Analysis' },
      ],
      milestones: [
        { label: 'Protocol', date: 'Aug 08', done: true },
        { label: 'Sampling', date: 'Sep–Nov', done: false, current: true },
        { label: 'Analysis', date: 'Dec 10', done: false },
        { label: 'Report', date: 'Jan 16', done: false },
      ],
      tags: ['Field sampling', 'Open data', 'Imaging'],
      updatedAt: '3 days ago',
      createdBy: admin.id,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      title: 'Solar Dehydrator for Riverside Farms',
      category: 'eco',
      categoryLabel: 'Eco-Science',
      status: 'Completed',
      progress: 100,
      summary:
        'A passive solar dehydrator designed and built with local farmers — plans and food-safety notes published for the community.',
      lead: { name: 'Omar Haddad', role: 'Chemistry' },
      team: [
        { name: 'Omar Haddad', role: 'Chemistry' },
        { name: 'Mateo Silva', role: 'Fabrication' },
        { name: 'Noah Kim', role: 'Data Analysis' },
      ],
      milestones: [
        { label: 'Design', date: 'Mar 02', done: true },
        { label: 'Build', date: 'Apr 26', done: true },
        { label: 'Pilot', date: 'Jul 18', done: true },
        { label: 'Publish', date: 'Sep 02', done: true },
      ],
      tags: ['Solar thermal', 'CAD', 'Community build'],
      updatedAt: 'Sep 02',
      createdBy: admin.id,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      title: 'Exoplanet Transit Watch — TOI-1452 b',
      category: 'space',
      categoryLabel: 'Space',
      status: 'In Progress',
      progress: 81,
      summary:
        'Photometry of a super-Earth candidate using our 11-inch scope — three transits captured, light curves now in refinement.',
      lead: { name: 'Grace Liu', role: 'Observatory Lead' },
      team: [
        { name: 'Grace Liu', role: 'Observatory Lead' },
        { name: 'Clara Fontaine', role: 'Optics' },
        { name: 'Yuki Mori', role: 'Telemetry' },
      ],
      milestones: [
        { label: 'Calibrate', date: 'Jun 07', done: true },
        { label: 'Transit 1', date: 'Jul 02', done: true },
        { label: 'Transit 2', date: 'Aug 11', done: true },
        { label: 'Draft', date: 'Oct 15', done: false, current: true },
      ],
      tags: ['Photometry', 'Light curves', 'AstroImageJ'],
      updatedAt: '6 hours ago',
      createdBy: admin.id,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      title: 'Hybrid Rocket Motor “Aurora-I”',
      category: 'space',
      categoryLabel: 'Space',
      status: 'Recruiting',
      progress: 25,
      summary:
        'A 500 N-class hybrid motor heading for a spring static fire — currently recruiting propulsion and telemetry members.',
      lead: { name: 'Daniel Adeyemi', role: 'Electronics' },
      team: [
        { name: 'Daniel Adeyemi', role: 'Electronics' },
        { name: 'Mateo Silva', role: 'Fabrication' },
        { name: 'Sofia Ramirez', role: 'Embedded Systems' },
      ],
      milestones: [
        { label: 'Literature', date: 'Sep 09', done: true },
        { label: 'Sizing', date: 'Oct 30', done: false, current: true },
        { label: 'Static fire', date: 'Feb 21', done: false },
        { label: 'Launch', date: 'May 09', done: false },
      ],
      tags: ['Hybrid propulsion', 'Thermodynamics', 'Telemetry'],
      updatedAt: '1 hour ago',
      createdBy: admin.id,
      createdAt: new Date().toISOString(),
    },
  ];

  const notices = [
    {
      id: randomUUID(),
      featured: true,
      status: 'registration',
      title: 'Annual Science & Innovation Fair',
      description:
        'Forty-two teams, nine judging categories and a live expo in the main atrium. Registration closes October 10 — reserve a bench before the slots run out.',
      dateLabel: 'Oct 24',
      timeLabel: '9:00 AM – 4:00 PM',
      location: 'Main Atrium',
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      status: 'live',
      title: 'Guest speaker: hunting gravitational waves',
      description:
        'Dr. Elena Vasquez (LIGO) walks us through chirp signals and mirror suspensions. Live Q&A until 5 pm.',
      dateLabel: 'Today',
      timeLabel: '4:00 – 5:00 PM',
      location: 'Auditorium + live stream',
      watching: 23,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      status: 'registration',
      title: 'Workshop: PCR & gel electrophoresis 101',
      description:
        'Extract, amplify and visualise your own DNA sample under mentor supervision. Complete beginners welcome.',
      dateLabel: 'Thu, Oct 8',
      timeLabel: '4:00 – 6:00 PM',
      location: 'Bio Lab 3',
      seatsLeft: 8,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      status: 'upcoming',
      title: 'Star party: Saturn at opposition',
      description:
        'Rings wide open — the 11-inch SCT will be primed on the ridge. Dress warm and bring red torches.',
      dateLabel: 'Fri, Oct 16',
      timeLabel: '8:30 – 11:00 PM',
      location: 'Ridge Observatory',
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      status: 'upcoming',
      title: 'Robotics regionals send-off & demo day',
      description:
        'The swarm fleet and Rover Mk-III run their final public demonstrations before regionals. Bleachers open to all.',
      dateLabel: 'Sat, Nov 7',
      timeLabel: '10:00 AM – 1:00 PM',
      location: 'Main Gymnasium',
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      status: 'upcoming',
      title: 'Creek cleanup & water sampling',
      description:
        'Monthly Miller Creek survey — waders provided, data sheets on us. Counts toward field-hours credit.',
      dateLabel: 'Sat, Nov 14',
      timeLabel: '9:00 AM – 12:00 PM',
      location: 'Miller Creek trailhead',
      createdAt: new Date().toISOString(),
    },
  ];

  const quotes = [
    {
      id: randomUUID(),
      text: 'The best experiments start with a question nobody in the room has asked yet. Our job is to keep the room full of those questions.',
      author: 'Dr. Hannah Cho',
      role: 'Faculty Advisor · Physics',
      active: true,
      createdBy: admin.id,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      text: 'Somewhere, something incredible is waiting to be known.',
      author: 'Carl Sagan',
      role: 'Astronomer & Science Communicator',
      active: false,
      createdBy: admin.id,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      text: 'Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.',
      author: 'Marie Curie',
      role: 'Pioneer of Radioactivity',
      active: false,
      createdBy: admin.id,
      createdAt: new Date().toISOString(),
    },
  ];

  const facts = [
    {
      id: randomUUID(),
      topic: 'Quantum Physics',
      fact: "Entangled particles violate Bell's inequalities — no local hidden-variable theory can explain the correlations, a result so foundational it won the 2022 Nobel Prize in Physics.",
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      topic: 'Molecular Biology',
      fact: 'Alternative splicing lets humans stretch ~20,000 protein-coding genes into 100,000+ distinct proteins — most multi-exon human genes are spliced in more than one way.',
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      topic: 'Theoretical Physics',
      fact: "Noether's theorem proves that every continuous symmetry produces a conservation law — time-translation symmetry alone is why energy is conserved.",
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      topic: 'Physical Chemistry',
      fact: 'Water hits maximum density at 3.98 °C, not 0 °C — so lakes freeze from the top down and fish survive the winter under an insulating lid of ice.',
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      topic: 'Astrophysics',
      fact: 'A single teaspoon of neutron-star matter outweighs Mount Everest — roughly a billion tonnes, squeezed to nuclear density inside a city-sized star.',
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      topic: 'Quantum Computing',
      fact: "Shor's algorithm factors large integers in polynomial time — a sufficiently large fault-tolerant quantum computer would break RSA encryption as we know it.",
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      topic: 'Aerospace Engineering',
      fact: "The SR-71 Blackbird's titanium skin reached ~300 °C in flight and stretched several inches — it was deliberately built with gaps that only sealed at cruise speed.",
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      topic: 'Mathematics',
      fact: 'The Green–Tao theorem (2004) proves the primes contain arithmetic progressions of every finite length — infinitely long sequences sitting inside the "random" primes.',
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    members: [admin],
    sessions: {},
    projects,
    notices,
    quotes,
    facts,
    applications: [],
    subscribers: [],
  };
}
