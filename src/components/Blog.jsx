import { useState } from 'react'
import { ArrowRight, Clock3, Newspaper } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'
import Modal from './Modal.jsx'
import { POSTS } from '../data/blog.js'
import { MEMBERS } from '../data/members.js'

function authorOf(name) {
  return MEMBERS.find((m) => m.name === name)
}

function fmtDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function BlogCard({ post, i, onOpen }) {
  const author = authorOf(post.author)
  return (
    <article
      className="blog-card"
      data-reveal
      style={{ '--rd': `${(i % 3) * 90}ms` }}
      onClick={() => onOpen(post)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(post)}
      role="button"
      tabIndex={0}
      aria-label={`Read article: ${post.title}`}
    >
      <div className="blog-cover">
        <img src={post.cover} alt="" loading="lazy" />
        <span className="blog-cat">{post.category}</span>
      </div>
      <div className="blog-body">
        <div className="blog-meta-top">
          <time dateTime={post.date}>{fmtDate(post.date)}</time>
          <span>
            <Clock3 size={12} /> {post.readTime} min read
          </span>
        </div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="blog-author">
          {author && <img src={author.avatar} alt="" loading="lazy" />}
          <span>{post.author}</span>
          <em className="blog-read">
            Read <ArrowRight size={13} />
          </em>
        </div>
      </div>
    </article>
  )
}

export default function Blog() {
  const [selected, setSelected] = useState(null)
  const author = selected && authorOf(selected.author)

  return (
    <section className="section blog alt" id="blog">
      <div className="container">
        <SectionHeading
          eyebrow="04 · From the lab notebook"
          title="The club journal"
          sub="Advanced science, explained by students — discoveries, deep dives and club updates."
        />

        <div className="blog-grid">
          {POSTS.map((p, i) => (
            <BlogCard key={p.id} post={p} i={i} onOpen={setSelected} />
          ))}
        </div>

        <div className="blog-cta" data-reveal>
          <Newspaper size={18} />
          <span>Want to write for the journal? Pitch an article through the contact form.</span>
          <a href="#contact" className="btn btn-ghost btn-sm">
            Pitch a story <ArrowRight size={14} />
          </a>
        </div>
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} wide label={selected?.title}>
        {selected && (
          <article className="article">
            <div className="article-cover">
              <img src={selected.cover} alt="" />
            </div>
            <div className="article-body">
              <div className="article-meta">
                <span className="blog-cat">{selected.category}</span>
                <time dateTime={selected.date}>{fmtDate(selected.date)}</time>
                <span>
                  <Clock3 size={12} /> {selected.readTime} min read
                </span>
              </div>
              <h3>{selected.title}</h3>
              <div className="blog-author standalone">
                {author && <img src={author.avatar} alt="" />}
                <span>
                  By <b>{selected.author}</b>
                </span>
              </div>
              {selected.body.map((block, idx) =>
                block.h ? <h4 key={idx}>{block.h}</h4> : <p key={idx}>{block.p}</p>,
              )}
              <div className="tag-row">
                {selected.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        )}
      </Modal>
    </section>
  )
}
