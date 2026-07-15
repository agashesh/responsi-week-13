import { useEffect, useRef, useState } from "react";

const IS_PRODUCTION = import.meta.env.PROD;
const API_URL = IS_PRODUCTION ? "/api/cv" : "http://localhost:3000/api/cv";

function normalizePhotoUrl(photo) {
  if (!photo) return "";
  if (photo.startsWith("http")) return photo;
  if (photo.startsWith("/")) return photo;
  return `/${photo}`;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

/** Reveals a section with a single quiet fade/rise the first time it enters view. */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const [ref, visible] = useReveal();
  return (
    <Tag ref={ref} className={`${className} reveal${visible ? " in-view" : ""}`} {...rest}>
      {children}
    </Tag>
  );
}

function App() {
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCv() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCv(data);
      } catch {
        setError(
          "Gagal mengambil data CV. Pastikan backend berjalan di http://localhost:3000",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchCv();
  }, []);

  if (loading) {
    return (
      <div className="state-screen">
        <div className="loader" />
        <p>Memuat arsip portofolio…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-screen">
        <span className="eyebrow">Terjadi Kesalahan</span>
        <h1>Sinyal terputus</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="state-screen">
        <span className="eyebrow">Terjadi Kesalahan</span>
        <h1>Arsip kosong</h1>
        <p>Data CV tidak dapat dimuat</p>
      </div>
    );
  }

  const { profile, socials, stats, skills, experiences, education, projects } = cv;
  const year = new Date().getFullYear();

  return (
    <main className="page">
      <div className="grain" aria-hidden="true" />

      <nav className="topnav">
        <a href="#top" className="brand">
          {profile.photoText ? profile.photoText.slice(0, 2) : "LH"}
          <span>.</span>
        </a>
        <div className="nav-links">
          <a href="#profil">Profil</a>
          <a href="#kemampuan">Kemampuan</a>
          <a href="#riwayat">Riwayat</a>
          <a href="#karya">Karya</a>
          <a href="#kontak">Kontak</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <span className="side-label" aria-hidden="true">
          Portofolio — Vol. 01
        </span>

        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Professional Digital CV</span>
            <h1 className="hero-name">{profile.name}</h1>
            <h2 className="hero-role">{profile.role}</h2>
            <p className="tagline">{profile.tagline}</p>

            <div className="hero-actions">
              <a href="#karya" className="btn btn-primary">
                Lihat Karya
              </a>
              <a href={`mailto:${profile.email}`} className="btn btn-ghost">
                Hubungi Saya
              </a>
            </div>

            <dl className="quick-info">
              <div>
                <dt>Lokasi</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{profile.email}</dd>
              </div>
              <div>
                <dt>Telepon</dt>
                <dd>{profile.phone}</dd>
              </div>
            </dl>
          </div>

          <figure className="portrait">
            <div className="portrait-frame">
              {profile.photo ? (
                <img
                  src={normalizePhotoUrl(profile.photo)}
                  alt={profile.name}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : null}
              <span className="portrait-mark">{profile.photoText}</span>
            </div>
            <figcaption>
              <span>{profile.name}</span>
              <div className="social-list">
                {socials.map((social) => (
                  <a key={social.label} href={social.url} target="_blank" rel="noreferrer">
                    {social.label}
                  </a>
                ))}
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      <Reveal as="section" className="stats-strip">
        {stats.map((item, index) => (
          <div className="stat" key={item.label}>
            <span className="stat-index">{pad(index + 1)}</span>
            <strong>{item.value}</strong>
            <span className="stat-label">{item.label}</span>
          </div>
        ))}
      </Reveal>

      <Reveal as="section" className="section" id="profil">
        <div className="section-heading">
          <span className="eyebrow">About</span>
          <h2>Profil Singkat</h2>
        </div>
        <p className="pull-quote">{profile.summary}</p>
      </Reveal>

      <Reveal as="section" className="section" id="kemampuan">
        <div className="section-heading">
          <span className="eyebrow">Skills</span>
          <h2>Kemampuan Teknis</h2>
        </div>
        <div className="skills-list">
          {skills.map((skill, index) => (
            <div className="skill-row" key={skill.name}>
              <span className="skill-index">{pad(index + 1)}</span>
              <span className="skill-name">{skill.name}</span>
              <div className="skill-bar">
                <div style={{ width: `${skill.level}%` }} />
              </div>
              <span className="skill-level">{skill.level}%</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="section two-column" id="riwayat">
        <div>
          <div className="section-heading">
            <span className="eyebrow">Experience</span>
            <h2>Pengalaman</h2>
          </div>
          <div className="tracklist">
            {experiences.map((item, index) => (
              <article className="track" key={`${item.position}-${item.company}`}>
                <span className="track-index">{pad(index + 1)}</span>
                <div className="track-body">
                  <div className="track-top">
                    <h3>{item.position}</h3>
                    <span className="track-period">{item.period}</span>
                  </div>
                  <h4>{item.company}</h4>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div>
          <div className="section-heading">
            <span className="eyebrow">Education</span>
            <h2>Pendidikan</h2>
          </div>
          <div className="tracklist">
            {education.map((item, index) => (
              <article className="track" key={`${item.degree}-${item.school}`}>
                <span className="track-index">{pad(index + 1)}</span>
                <div className="track-body">
                  <div className="track-top">
                    <h3>{item.degree}</h3>
                    <span className="track-period">{item.period}</span>
                  </div>
                  <h4>{item.school}</h4>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="section" id="karya">
        <div className="section-heading">
          <span className="eyebrow">Discography</span>
          <h2>Project Pilihan</h2>
        </div>
        <div className="catalog-grid">
          {projects.map((project, index) => (
            <article className="catalog-card" key={project.title}>
              <span className="catalog-index">Vol. {pad(index + 1)}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tech-list">
                {project.tech.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="outro" id="kontak">
        <span className="eyebrow">Contact</span>
        <h2>Siap Berkolaborasi?</h2>
        <p>
          Hubungi saya untuk diskusi project, internship, freelance, atau kolaborasi
          teknologi.
        </p>
        <a href={`mailto:${profile.email}`} className="btn btn-primary">
          Kirim Email
        </a>
      </Reveal>

      <footer className="site-footer">
        <span>© {year} {profile.name}</span>
        <span>A world familiarly unknown.</span>
      </footer>
    </main>
  );
}

export default App;
