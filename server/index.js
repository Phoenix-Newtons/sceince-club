import express from 'express';
import { randomBytes, randomUUID } from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadDb, saveDb } from './db.js';
import { seed } from './seed.js';
import { hashPassword, verifyPassword } from './passwords.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4000);
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const db = loadDb(seed);
const app = express();
app.use(express.json());

/* ---------------- helpers ---------------- */

const publicMember = (m) => ({ id: m.id, name: m.name, email: m.email, role: m.role, createdAt: m.createdAt });

const pruneSessions = () => {
  const now = Date.now();
  for (const [token, session] of Object.entries(db.sessions)) {
    if (new Date(session.expiresAt).getTime() < now) delete db.sessions[token];
  }
};

function authMember(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  const session = db.sessions[token];
  if (!session || new Date(session.expiresAt).getTime() < Date.now()) return null;
  return db.members.find((m) => m.id === session.memberId) || null;
}

function requireAuth(req, res, next) {
  const member = authMember(req);
  if (!member) return res.status(401).json({ error: 'Please sign in to continue.' });
  req.member = member;
  next();
}

function requireAdmin(req, res, next) {
  if (req.member.role !== 'admin') return res.status(403).json({ error: 'Admin access required.' });
  next();
}

const str = (v, fallback = '') => (typeof v === 'string' ? v.trim() : fallback);

function issueToken(member) {
  pruneSessions();
  const token = randomBytes(24).toString('hex');
  db.sessions[token] = { memberId: member.id, expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString() };
  saveDb(db);
  return token;
}

const bad = (res, message, code = 400) => res.status(code).json({ error: message });

/* ---------------- auth ---------------- */

app.post('/api/auth/login', (req, res) => {
  const email = str(req.body?.email).toLowerCase();
  const password = str(req.body?.password);
  const member = db.members.find((m) => m.email.toLowerCase() === email);
  if (!member || !password || !verifyPassword(password, member.salt, member.hash)) {
    return bad(res, 'Invalid email or password.', 401);
  }
  const token = issueToken(member);
  res.json({ token, member: publicMember(member) });
});

app.post('/api/auth/logout', requireAuth, (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.slice(7);
  delete db.sessions[token];
  saveDb(db);
  res.status(204).end();
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json(publicMember(req.member));
});

/* ---------------- stats ---------------- */

app.get('/api/stats', (_req, res) => {
  res.json({
    members: db.members.length,
    projects: db.projects.length,
    facts: db.facts.length,
    notices: db.notices.length,
  });
});

/* ---------------- members (admin) ---------------- */

app.get('/api/members', requireAuth, requireAdmin, (_req, res) => {
  res.json(db.members.map(publicMember));
});

app.post('/api/members', requireAuth, requireAdmin, (req, res) => {
  const name = str(req.body?.name);
  const email = str(req.body?.email).toLowerCase();
  const password = str(req.body?.password);
  const role = req.body?.role === 'admin' ? 'admin' : 'member';
  if (name.length < 2) return bad(res, 'Name must be at least 2 characters.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad(res, 'Enter a valid email address.');
  if (password.length < 8) return bad(res, 'Password must be at least 8 characters.');
  if (db.members.some((m) => m.email.toLowerCase() === email)) return bad(res, 'A member with this email already exists.', 409);
  const member = { id: randomUUID(), name, email, role, createdAt: new Date().toISOString(), ...hashPassword(password) };
  db.members.push(member);
  saveDb(db);
  res.status(201).json(publicMember(member));
});

app.delete('/api/members/:id', requireAuth, requireAdmin, (req, res) => {
  if (req.params.id === req.member.id) return bad(res, 'You cannot remove your own account.');
  const index = db.members.findIndex((m) => m.id === req.params.id);
  if (index === -1) return bad(res, 'Member not found.', 404);
  db.members.splice(index, 1);
  saveDb(db);
  res.status(204).end();
});

/* ---------------- projects ---------------- */

app.get('/api/projects', (_req, res) => {
  res.json(db.projects);
});

app.post('/api/projects', requireAuth, (req, res) => {
  const title = str(req.body?.title);
  const summary = str(req.body?.summary);
  const leadName = str(req.body?.leadName) || req.member.name;
  const category = ['robotics', 'eco', 'space'].includes(req.body?.category) ? req.body.category : 'robotics';
  const categoryLabel = { robotics: 'Robotics', eco: 'Eco-Science', space: 'Space' }[category];
  const status = ['In Progress', 'Peer Review', 'Recruiting', 'Completed'].includes(req.body?.status)
    ? req.body.status
    : 'In Progress';
  const progress = Math.min(100, Math.max(0, Number(req.body?.progress) || 0));
  const tags = Array.isArray(req.body?.tags) ? req.body.tags.map((t) => str(t)).filter(Boolean).slice(0, 6) : [];
  if (title.length < 4) return bad(res, 'Give the project a title (at least 4 characters).');
  if (summary.length < 10) return bad(res, 'Add a short summary (at least 10 characters).');

  const project = {
    id: randomUUID(),
    title,
    category,
    categoryLabel,
    status,
    progress,
    summary,
    lead: { name: leadName, role: 'Project Lead' },
    team: [{ name: leadName, role: 'Project Lead' }],
    milestones: [
      { label: 'Kickoff', date: 'Done', done: true },
      { label: 'Build', date: 'Now', done: false, current: true },
      { label: 'Review', date: 'TBD', done: false },
      { label: 'Publish', date: 'TBD', done: false },
    ],
    tags,
    updatedAt: 'just now',
    createdBy: req.member.id,
    createdAt: new Date().toISOString(),
  };
  db.projects.unshift(project);
  saveDb(db);
  res.status(201).json(project);
});

app.delete('/api/projects/:id', requireAuth, (req, res) => {
  const project = db.projects.find((p) => p.id === req.params.id);
  if (!project) return bad(res, 'Project not found.', 404);
  if (req.member.role !== 'admin' && project.createdBy !== req.member.id) {
    return bad(res, 'Only admins (or the project creator) can remove projects.', 403);
  }
  db.projects = db.projects.filter((p) => p.id !== project.id);
  saveDb(db);
  res.status(204).end();
});

/* ---------------- quotes ---------------- */

app.get('/api/quotes', (_req, res) => {
  res.json(db.quotes);
});

app.post('/api/quotes', requireAuth, (req, res) => {
  const text = str(req.body?.text);
  const author = str(req.body?.author) || req.member.name;
  const role = str(req.body?.role) || 'Club Member';
  if (text.length < 10) return bad(res, 'A quote needs at least 10 characters.');
  const quote = { id: randomUUID(), text, author, role, active: false, createdBy: req.member.id, createdAt: new Date().toISOString() };
  db.quotes.unshift(quote);
  saveDb(db);
  res.status(201).json(quote);
});

app.post('/api/quotes/:id/activate', requireAuth, (req, res) => {
  const quote = db.quotes.find((q) => q.id === req.params.id);
  if (!quote) return bad(res, 'Quote not found.', 404);
  for (const q of db.quotes) q.active = q.id === quote.id;
  saveDb(db);
  res.json(quote);
});

app.delete('/api/quotes/:id', requireAuth, (req, res) => {
  const quote = db.quotes.find((q) => q.id === req.params.id);
  if (!quote) return bad(res, 'Quote not found.', 404);
  if (req.member.role !== 'admin' && quote.createdBy !== req.member.id) {
    return bad(res, 'Only admins (or the quote author) can remove quotes.', 403);
  }
  db.quotes = db.quotes.filter((q) => q.id !== quote.id);
  if (!db.quotes.some((q) => q.active) && db.quotes[0]) db.quotes[0].active = true;
  saveDb(db);
  res.status(204).end();
});

/* ---------------- did-you-know facts ---------------- */

app.get('/api/facts', (_req, res) => {
  res.json(db.facts);
});

app.post('/api/facts', requireAuth, (req, res) => {
  const fact = str(req.body?.fact);
  const topic = str(req.body?.topic) || 'General Science';
  if (fact.length < 20) return bad(res, 'Facts should be at least 20 characters — give us the detail!');
  const entry = { id: randomUUID(), fact, topic, createdBy: req.member.id, createdAt: new Date().toISOString() };
  db.facts.unshift(entry);
  saveDb(db);
  res.status(201).json(entry);
});

app.delete('/api/facts/:id', requireAuth, (req, res) => {
  const fact = db.facts.find((f) => f.id === req.params.id);
  if (!fact) return bad(res, 'Fact not found.', 404);
  if (req.member.role !== 'admin' && fact.createdBy !== req.member.id) {
    return bad(res, 'Only admins (or the fact author) can remove facts.', 403);
  }
  db.facts = db.facts.filter((f) => f.id !== fact.id);
  saveDb(db);
  res.status(204).end();
});

/* ---------------- notices / events ---------------- */

app.get('/api/notices', (_req, res) => {
  res.json(db.notices);
});

app.post('/api/notices', requireAuth, requireAdmin, (req, res) => {
  const title = str(req.body?.title);
  const description = str(req.body?.description);
  const status = ['live', 'upcoming', 'registration'].includes(req.body?.status) ? req.body.status : 'upcoming';
  if (title.length < 4) return bad(res, 'Give the notice a title.');
  if (description.length < 10) return bad(res, 'Add a short description.');
  const notice = {
    id: randomUUID(),
    featured: Boolean(req.body?.featured),
    status,
    title,
    description,
    dateLabel: str(req.body?.dateLabel) || 'TBA',
    timeLabel: str(req.body?.timeLabel) || 'TBA',
    location: str(req.body?.location) || 'TBA',
    createdAt: new Date().toISOString(),
  };
  if (notice.featured) for (const n of db.notices) n.featured = false;
  db.notices.unshift(notice);
  saveDb(db);
  res.status(201).json(notice);
});

app.delete('/api/notices/:id', requireAuth, requireAdmin, (req, res) => {
  const before = db.notices.length;
  db.notices = db.notices.filter((n) => n.id !== req.params.id);
  if (db.notices.length === before) return bad(res, 'Notice not found.', 404);
  saveDb(db);
  res.status(204).end();
});

/* ---------------- applications (public submit, admin manage) ---------------- */

app.post('/api/applications', (req, res) => {
  const name = str(req.body?.name);
  const email = str(req.body?.email).toLowerCase();
  const grade = str(req.body?.grade);
  const interest = str(req.body?.interest);
  const message = str(req.body?.message);
  if (name.length < 2) return bad(res, 'Please enter your full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad(res, 'Enter a valid school email address.');
  if (!grade || !interest) return bad(res, 'Grade and primary interest are required.');
  const application = {
    id: `APP-${randomUUID().slice(0, 8).toUpperCase()}`,
    name,
    email,
    grade,
    interest,
    message,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  db.applications.unshift(application);
  saveDb(db);
  res.status(201).json(application);
});

app.get('/api/applications', requireAuth, requireAdmin, (_req, res) => {
  res.json(db.applications);
});

app.post('/api/applications/:id/approve', requireAuth, requireAdmin, (req, res) => {
  const application = db.applications.find((a) => a.id === req.params.id);
  if (!application) return bad(res, 'Application not found.', 404);
  if (application.status !== 'pending') return bad(res, 'This application was already processed.');
  const email = application.email;
  if (db.members.some((m) => m.email.toLowerCase() === email)) {
    return bad(res, 'A member with this email already exists — reject the application instead.', 409);
  }
  const password = str(req.body?.password) || 'nucleus-club';
  if (password.length < 8) return bad(res, 'Choose a password of at least 8 characters.');
  const member = {
    id: randomUUID(),
    name: application.name,
    email,
    role: 'member',
    createdAt: new Date().toISOString(),
    ...hashPassword(password),
  };
  db.members.push(member);
  application.status = 'approved';
  saveDb(db);
  res.json({ member: publicMember(member), temporaryPassword: password });
});

app.post('/api/applications/:id/reject', requireAuth, requireAdmin, (req, res) => {
  const application = db.applications.find((a) => a.id === req.params.id);
  if (!application) return bad(res, 'Application not found.', 404);
  application.status = 'rejected';
  saveDb(db);
  res.json(application);
});

/* ---------------- newsletter subscribers ---------------- */

app.post('/api/subscribe', (req, res) => {
  const email = str(req.body?.email).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad(res, 'That email does not look right.');
  if (!db.subscribers.some((s) => s.email === email)) {
    db.subscribers.unshift({ id: randomUUID(), email, createdAt: new Date().toISOString() });
    saveDb(db);
  }
  res.status(201).json({ ok: true });
});

app.get('/api/subscribers', requireAuth, requireAdmin, (_req, res) => {
  res.json(db.subscribers);
});

app.use('/api', (_req, res) => bad(res, 'Not found.', 404));

/* ---------------- static frontend (production) ---------------- */

const DIST = path.join(__dirname, '..', 'dist');
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(DIST, 'index.html'));
    }
    next();
  });
}

app.use((err, _req, res, _next) => {
  console.error('[server]', err);
  bad(res, 'Unexpected server error.', 500);
});

app.listen(PORT, () => {
  console.log(`[server] Nucleus API listening on http://localhost:${PORT}`);
});
