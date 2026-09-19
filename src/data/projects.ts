import type { Contributor, Project } from '../types';

const aarav: Contributor = { name: 'Aarav Mehta', role: 'Mechanical Lead' };
const sofia: Contributor = { name: 'Sofia Ramirez', role: 'Embedded Systems' };
const kenji: Contributor = { name: 'Kenji Tanaka', role: 'CAD & 3D Printing' };
const amara: Contributor = { name: 'Amara Okafor', role: 'Autonomy Software' };
const priya: Contributor = { name: 'Priya Nair', role: 'Team Captain' };
const daniel: Contributor = { name: 'Daniel Adeyemi', role: 'Electronics' };
const yuki: Contributor = { name: 'Yuki Mori', role: 'Telemetry' };
const isabella: Contributor = { name: 'Isabella Rossi', role: 'Field Lead' };
const omar: Contributor = { name: 'Omar Haddad', role: 'Chemistry' };
const noah: Contributor = { name: 'Noah Kim', role: 'Data Analysis' };
const grace: Contributor = { name: 'Grace Liu', role: 'Observatory Lead' };
const clara: Contributor = { name: 'Clara Fontaine', role: 'Optics' };
const mateo: Contributor = { name: 'Mateo Silva', role: 'Fabrication' };

export const PROJECTS: Project[] = [
  {
    id: 'rover-mk3',
    title: 'Rover Mk-III — Mars Yard Prototype',
    category: 'robotics',
    categoryLabel: 'Robotics',
    status: 'In Progress',
    progress: 68,
    summary:
      'A six-wheeled rover with autonomous waypoint navigation, being built for the national planetary-rover challenge.',
    lead: aarav,
    team: [aarav, sofia, kenji, amara],
    milestones: [
      { label: 'Design', date: 'May 12', done: true },
      { label: 'Build', date: 'Jul 03', done: true },
      { label: 'Autonomy', date: 'Sep 28', done: false, current: true },
      { label: 'Field test', date: 'Oct 19', done: false },
    ],
    tags: ['ROS 2', 'Computer vision', '3D-printed chassis'],
    updatedAt: '2 hours ago',
  },
  {
    id: 'swarm-line-followers',
    title: 'Swarm Line-Followers for Nationals',
    category: 'robotics',
    categoryLabel: 'Robotics',
    status: 'Peer Review',
    progress: 85,
    summary:
      'A fleet of six palm-sized line-followers racing relay-style — final tuning logs are under team review before the write-up.',
    lead: priya,
    team: [priya, daniel, yuki],
    milestones: [
      { label: 'Design', date: 'Apr 20', done: true },
      { label: 'Build', date: 'Jun 14', done: true },
      { label: 'Tune', date: 'Sep 05', done: true },
      { label: 'Post-mortem', date: 'Oct 20', done: false, current: true },
    ],
    tags: ['IR sensors', 'PID tuning', 'Custom PCBs'],
    updatedAt: 'yesterday',
  },
  {
    id: 'microplastics-census',
    title: 'Microplastics Census of Miller Creek',
    category: 'eco',
    categoryLabel: 'Eco-Science',
    status: 'In Progress',
    progress: 42,
    summary:
      'Monthly sampling runs mapping microplastic density along the creek, filtered and analysed with a home-built imaging rig.',
    lead: isabella,
    team: [isabella, omar, noah],
    milestones: [
      { label: 'Protocol', date: 'Aug 08', done: true },
      { label: 'Sampling', date: 'Sep–Nov', done: false, current: true },
      { label: 'Analysis', date: 'Dec 10', done: false },
      { label: 'Report', date: 'Jan 16', done: false },
    ],
    tags: ['Field sampling', 'Open data', 'Imaging'],
    updatedAt: '3 days ago',
  },
  {
    id: 'solar-dehydrator',
    title: 'Solar Dehydrator for Riverside Farms',
    category: 'eco',
    categoryLabel: 'Eco-Science',
    status: 'Completed',
    progress: 100,
    summary:
      'A passive solar dehydrator designed and built with local farmers — plans and food-safety notes published for the community.',
    lead: omar,
    team: [omar, mateo, noah],
    milestones: [
      { label: 'Design', date: 'Mar 02', done: true },
      { label: 'Build', date: 'Apr 26', done: true },
      { label: 'Pilot', date: 'Jul 18', done: true },
      { label: 'Publish', date: 'Sep 02', done: true },
    ],
    tags: ['Solar thermal', 'CAD', 'Community build'],
    updatedAt: 'Sep 02',
  },
  {
    id: 'exoplanet-transit',
    title: 'Exoplanet Transit Watch — TOI-1452 b',
    category: 'space',
    categoryLabel: 'Space',
    status: 'In Progress',
    progress: 81,
    summary:
      'Photometry of a super-Earth candidate using our 11-inch scope — three transits captured, light curves now in refinement.',
    lead: grace,
    team: [grace, clara, yuki],
    milestones: [
      { label: 'Calibrate', date: 'Jun 07', done: true },
      { label: 'Transit 1', date: 'Jul 02', done: true },
      { label: 'Transit 2', date: 'Aug 11', done: true },
      { label: 'Draft', date: 'Oct 15', done: false, current: true },
    ],
    tags: ['Photometry', 'Light curves', 'AstroImageJ'],
    updatedAt: '6 hours ago',
  },
  {
    id: 'aurora-rocket',
    title: 'Hybrid Rocket Motor “Aurora-I”',
    category: 'space',
    categoryLabel: 'Space',
    status: 'Recruiting',
    progress: 25,
    summary:
      'A 500 N-class hybrid motor heading for a spring static fire — currently recruiting propulsion and telemetry members.',
    lead: daniel,
    team: [daniel, mateo, sofia],
    milestones: [
      { label: 'Literature', date: 'Sep 09', done: true },
      { label: 'Sizing', date: 'Oct 30', done: false, current: true },
      { label: 'Static fire', date: 'Feb 21', done: false },
      { label: 'Launch', date: 'May 09', done: false },
    ],
    tags: ['Hybrid propulsion', 'Thermodynamics', 'Telemetry'],
    updatedAt: '1 hour ago',
  },
];
