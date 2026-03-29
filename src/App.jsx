import { useState, useEffect, useRef } from "react";

const DARK = {
  bg: "#0d0d0d",
  bgCard: "#141414",
  bgCardHover: "#1a1a1a",
  border: "#1f1f1f",
  text: "#f0f0f0",
  muted: "#888",
  accent: "#00f5d4",
  accentDim: "rgba(0,245,212,0.12)",
};
const LIGHT = {
  bg: "#f8f7f4",
  bgCard: "#ffffff",
  bgCardHover: "#f0efec",
  border: "#e5e3dd",
  text: "#0d1b2a",
  muted: "#5a6a7a",
  accent: "#00b89c",
  accentDim: "rgba(0,184,156,0.1)",
};

function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Counter({ target, suffix, label, theme }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useFadeIn(0.3);
  const T = theme;
  useEffect(() => {
    if (!visible) return;
    let current = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, step);
    return () => clearInterval(timer);
  }, [visible, target]);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.6s ease",
      textAlign: "center",
      padding: "1.75rem 1rem",
    }}>
      <div style={{ fontSize: "2.8rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: T.accent, lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: "0.82rem", color: T.muted, marginTop: "0.4rem", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em" }}>
        {label}
      </div>
    </div>
  );
}

function SkillChip({ label, theme }) {
  const [hovered, setHovered] = useState(false);
  const T = theme;
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-block",
        padding: "0.35rem 0.9rem",
        borderRadius: "9999px",
        fontSize: "0.8rem",
        fontFamily: "'DM Sans', sans-serif",
        border: `1px solid ${hovered ? T.accent : T.border}`,
        color: hovered ? T.accent : T.text,
        background: hovered ? T.accentDim : "transparent",
        boxShadow: hovered ? `0 0 14px ${T.accentDim}` : "none",
        transition: "all 0.22s ease",
        cursor: "default",
        margin: "0.25rem",
      }}
    >
      {label}
    </span>
  );
}

function Section({ id, children, theme, noBorder }) {
  const [ref, visible] = useFadeIn();
  const T = theme;
  return (
    <section
      id={id}
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        padding: "5rem 0",
        borderBottom: noBorder ? "none" : `1px solid ${T.border}`,
      }}
    >
      {children}
    </section>
  );
}

function SectionHeading({ children, theme, fontSize }) {
  const T = theme;
  return (
    <h2 style={{
      fontFamily: "'Syne', sans-serif",
      fontSize: fontSize || "clamp(1.8rem, 4vw, 2.4rem)",
      fontWeight: 800,
      color: T.text,
      marginBottom: "0.5rem",
      lineHeight: 1.1,
    }}>
      {children}<span style={{ color: T.accent }}>.</span>
    </h2>
  );
}

function Badge({ label, theme }) {
  const T = theme;
  return (
    <span style={{
      display: "inline-block",
      padding: "0.2rem 0.55rem",
      borderRadius: "4px",
      fontSize: "0.7rem",
      fontFamily: "monospace",
      background: T.accentDim,
      color: T.accent,
      border: `1px solid ${T.accent}33`,
      marginRight: "0.3rem",
      marginBottom: "0.3rem",
    }}>
      {label}
    </span>
  );
}

function ProjectCard({ project, theme }) {
  const [hovered, setHovered] = useState(false);
  const T = theme;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: T.bgCard,
        border: `1px solid ${hovered ? T.accent + "55" : T.border}`,
        borderRadius: "16px",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        boxShadow: hovered ? `0 16px 48px ${T.accentDim}, 0 4px 16px rgba(0,0,0,0.12)` : "0 2px 8px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Preview image */}
      {project.image && (
        <div style={{ position: "relative", overflow: "hidden", height: "185px", flexShrink: 0 }}>
          <img
            src={project.image}
            alt={project.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transition: "transform 0.5s ease",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              display: "block",
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: hovered ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.18)",
            transition: "background 0.3s ease",
          }} />
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "1.4rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem", flex: 1 }}>
        {/* Title row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: T.text, margin: 0 }}>{project.title}</h3>
            <p style={{ color: T.accent, fontSize: "0.78rem", marginTop: "0.2rem", fontWeight: 600, letterSpacing: "0.03em" }}>{project.subtitle}</p>
          </div>
        </div>

        <p style={{ color: T.muted, fontSize: "0.875rem", lineHeight: 1.75, margin: 0 }}>{project.desc}</p>

        {/* Stack badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {project.stack.map((t) => <Badge key={t} label={t} theme={T} />)}
        </div>

        {/* Buttons row */}
        <div className="project-buttons" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.45rem",
              padding: "0.5rem 1.1rem", borderRadius: "8px",
              border: `1px solid ${T.border}`, color: T.text,
              fontSize: "0.82rem", fontWeight: 500, alignSelf: "flex-start",
              transition: "border-color 0.2s, color 0.2s, background 0.2s", textDecoration: "none",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; e.currentTarget.style.background = T.accentDim; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; e.currentTarget.style.background = "transparent"; }}
          >
            ↗ View Live
          </a>
          {project.source && (
            <a
              href={project.source}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.45rem",
                padding: "0.5rem 1.1rem", borderRadius: "8px",
                border: `1px solid ${T.border}`, color: T.text,
                fontSize: "0.82rem", fontWeight: 500,
                transition: "border-color 0.2s, color 0.2s, background 0.2s", textDecoration: "none",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; e.currentTarget.style.background = T.accentDim; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; e.currentTarget.style.background = "transparent"; }}
            >
              {"</>"}  Source Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function AchievementCard({ item, theme }) {
  const [hovered, setHovered] = useState(false);
  const T = theme;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? T.bgCardHover : T.bgCard,
        border: `1px solid ${hovered ? T.accent + "55" : T.border}`,
        borderRadius: "10px",
        padding: "1.5rem",
        transition: "all 0.25s ease",
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
      }}
    >
      <span style={{ fontSize: "1.6rem", lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
      <div>
        <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(0.72rem, 3.5vw, 0.95rem)", color: T.text, marginBottom: "0.3rem" }}>{item.title}</h4>
        <p style={{ color: T.muted, fontSize: "clamp(0.65rem, 3vw, 0.82rem)", lineHeight: 1.65 }}>{item.desc}</p>
      </div>
    </div>
  );
}

function ContactCard({ item, theme }) {
  const [hovered, setHovered] = useState(false);
  const T = theme;
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", gap: "1rem", alignItems: "center",
        background: hovered ? T.bgCardHover : T.bgCard,
        border: `1px solid ${hovered ? T.accent + "66" : T.border}`,
        borderRadius: "10px", padding: "1.25rem",
        transition: "all 0.25s ease", textDecoration: "none",
        boxShadow: hovered ? `0 4px 20px ${T.accentDim}` : "none",
      }}
    >
      <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>{item.icon}</span>
      <div>
        <div style={{ fontSize: "0.68rem", color: T.accent, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.2rem" }}>{item.label}</div>
        <div style={{ fontSize: "0.85rem", color: hovered ? T.accent : T.text, fontWeight: 500, transition: "color 0.2s", wordBreak: "break-all" }}>{item.value}</div>
      </div>
    </a>
  );
}

function CVDownloadCard({ theme }) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const T = theme;

  const handleClick = () => {
    if (downloading || downloaded) return;
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }, 1200);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? T.bgCardHover : T.bgCard,
        border: `1px solid ${hovered ? T.accent + "88" : T.border}`,
        borderRadius: "16px",
        padding: "1.75rem 2rem",
        marginBottom: "2.5rem",
        transition: "all 0.3s ease",
        boxShadow: hovered ? `0 12px 48px ${T.accentDim}` : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow decoration */}
      <div style={{
        position: "absolute", right: "-40px", top: "-40px",
        width: "200px", height: "200px",
        background: `radial-gradient(circle, ${T.accentDim} 0%, transparent 70%)`,
        borderRadius: "50%", pointerEvents: "none",
        opacity: hovered ? 1 : 0.5,
        transition: "opacity 0.4s",
      }} />

      {/* File icon + info */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", position: "relative", zIndex: 1 }}>
        {/* PDF file icon */}
        <div style={{
          width: "52px", height: "62px",
          background: T.accentDim,
          border: `1.5px solid ${T.accent}55`,
          borderRadius: "8px 14px 8px 8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: "3px",
          flexShrink: 0,
          position: "relative",
          padding: "0 8px",
        }}>
          {/* folded corner */}
          <div style={{ position: "absolute", top: 0, right: 0, width: "14px", height: "14px", background: T.bg, borderBottomLeftRadius: "6px" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: "14px", height: "14px", background: T.accent + "44", borderTopRightRadius: "12px", border: `1.5px solid ${T.accent}55` }} />
          <span style={{ fontSize: "0.5rem", fontWeight: 900, color: T.accent, fontFamily: "monospace", letterSpacing: "0.1em", marginTop: "6px" }}>PDF</span>
          {[32, 22, 22].map((w, i) => (
            <div key={i} style={{ width: `${w}px`, height: "1.5px", background: T.accent + (i === 0 ? "77" : "33"), borderRadius: "1px" }} />
          ))}
        </div>

        <div>
          <div style={{ fontSize: "0.63rem", color: T.accent, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
            Curriculum Vitae
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: T.text, marginBottom: "0.2rem" }}>
            Mohamed Vasim
          </div>
          <div style={{ fontSize: "0.78rem", color: T.muted, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Software Developer
            <span style={{ display: "inline-block", width: "3px", height: "3px", borderRadius: "50%", background: T.muted }} />
            PDF
            <span style={{ display: "inline-block", width: "3px", height: "3px", borderRadius: "50%", background: T.muted }} />
            Updated 2026
          </div>
        </div>
      </div>

      {/* Download button */}
      <a
        href="/Vasimcv.pdf"
        download="MohamedVasim_CV.pdf"
        onClick={handleClick}
        style={{
          position: "relative", zIndex: 1,
          display: "inline-flex", alignItems: "center", gap: "0.6rem",
          padding: "0.85rem 2rem", borderRadius: "10px",
          background: downloaded ? "transparent" : T.accent,
          color: downloaded ? T.accent : "#0d0d0d",
          border: `1.5px solid ${T.accent}`,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700, fontSize: "0.9rem",
          transition: "all 0.3s ease", textDecoration: "none",
          boxShadow: downloaded ? "none" : `0 4px 24px ${T.accentDim}`,
          minWidth: "166px", justifyContent: "center",
          cursor: "pointer",
        }}
        onMouseEnter={e => { if (!downloading && !downloaded) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 10px 32px ${T.accentDim}`; } }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = downloaded ? "none" : `0 4px 24px ${T.accentDim}`; }}
      >
        {downloading ? (
          <>
            <span style={{
              display: "inline-block", width: "14px", height: "14px",
              border: "2px solid #0d0d0d44", borderTopColor: "#0d0d0d",
              borderRadius: "50%", animation: "spin 0.7s linear infinite",
              flexShrink: 0,
            }} />
            Downloading…
          </>
        ) : downloaded ? (
          <>
            <span style={{ fontSize: "1rem" }}>✓</span>
            Downloaded!
          </>
        ) : (
          <>
            <span style={{ animation: "dlpulse 1.4s ease-in-out infinite", display: "inline-block", fontSize: "1rem" }}>↓</span>
            Download CV
          </>
        )}
      </a>
    </div>
  );
}

function EduCard({ theme }) {
  const [hovered, setHovered] = useState(false);
  const T = theme;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: T.bgCard,
        border: `1px solid ${hovered ? T.accent + "55" : T.border}`,
        borderRadius: "16px",
        padding: "1.75rem 2rem",
        overflow: "hidden",
        position: "relative",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow: hovered ? `0 12px 40px ${T.accentDim}` : "none",
      }}
    >
      {/* Glow decoration */}
      <div style={{
        position: "absolute", right: "-40px", top: "-40px",
        width: "200px", height: "200px",
        background: `radial-gradient(circle, ${T.accentDim} 0%, transparent 70%)`,
        borderRadius: "50%", pointerEvents: "none",
        opacity: hovered ? 1 : 0.5, transition: "opacity 0.4s",
      }} />

      {/* Header row */}
      <div style={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", flexWrap: "wrap",
        gap: "1rem", position: "relative", zIndex: 1,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.5rem" }}>
            <span style={{
              fontSize: "1.4rem", lineHeight: 1,
              width: "44px", height: "44px", borderRadius: "10px",
              background: T.accentDim, border: `1px solid ${T.accent}33`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>🎓</span>
            <div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: T.text, margin: 0 }}>
                Sona College of Technology
              </h3>
              <p style={{ color: T.muted, fontSize: "0.78rem", marginTop: "0.15rem" }}>Salem, Tamil Nadu</p>
            </div>
          </div>
          <p style={{ color: T.accent, fontWeight: 600, fontSize: "0.95rem", marginLeft: "0.1rem" }}>
            B.E. Computer Science &amp; Engineering
          </p>
          <p style={{ color: T.muted, fontSize: "0.83rem", marginTop: "0.2rem", marginLeft: "0.1rem" }}>
            Honors – Full Stack Development
          </p>
        </div>

        <span style={{
          padding: "0.3rem 0.85rem", borderRadius: "99px",
          border: `1px solid ${T.border}`, color: T.muted,
          fontSize: "0.78rem", fontFamily: "monospace", whiteSpace: "nowrap", flexShrink: 0,
        }}>
          2021 – 2025
        </span>
      </div>

      {/* Stats row */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "0.75rem",
        marginTop: "1.5rem", position: "relative", zIndex: 1,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.55rem 1.1rem", background: T.accentDim,
          borderRadius: "10px", border: `1px solid ${T.accent}33`,
        }}>
          <span style={{ fontSize: "0.6rem", color: T.accent }}>◆</span>
          <span style={{ fontSize: "0.85rem", color: T.accent, fontWeight: 700 }}>CGPA: 8.1 / 10</span>
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.55rem 1.1rem", background: "transparent",
          borderRadius: "10px", border: `1px solid ${T.border}`,
        }}>
          <span style={{ fontSize: "0.82rem", lineHeight: 1 }}>🏛️</span>
          <span style={{ fontSize: "0.85rem", color: T.muted }}>Anna University Affiliated</span>
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.55rem 1.1rem", background: "transparent",
          borderRadius: "10px", border: `1px solid ${T.border}`,
        }}>
          <span style={{ fontSize: "0.82rem", lineHeight: 1 }}>⚡</span>
          <span style={{ fontSize: "0.85rem", color: T.muted }}>Full Stack Specialization</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState("");
  const [typing, setTyping] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);

  const T = dark ? DARK : LIGHT;
  const roles = ["Full-Stack Engineer", "Go Developer", "React Specialist", "Microservices Architect"];
  const navLinks = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "achievements", label: "Achievements" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => { setTimeout(() => setHeroVisible(true), 120); }, []);

  useEffect(() => {
    const role = roles[roleIndex];
    let i = typing ? 0 : role.length;
    const interval = setInterval(() => {
      if (typing) {
        i++;
        setDisplayedRole(role.slice(0, i));
        if (i >= role.length) { clearInterval(interval); setTimeout(() => setTyping(false), 2000); }
      } else {
        i--;
        setDisplayedRole(role.slice(0, i));
        if (i <= 0) { clearInterval(interval); setTyping(true); setRoleIndex((prev) => (prev + 1) % roles.length); }
      }
    }, typing ? 65 : 35);
    return () => clearInterval(interval);
  }, [roleIndex, typing]);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { threshold: 0.35 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const W = { maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #00f5d4; border-radius: 99px; }
        ::selection { background: rgba(0,245,212,0.25); }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes dlpulse { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }
        .nav-desktop { display: flex !important; }
        .nav-mobile-btn { display: none !important; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          .about-grid { grid-template-columns: 1fr !important; }
          .hero-name { font-size: clamp(2rem, 11vw, 3rem) !important; }
          .hero-role { font-size: clamp(0.95rem, 4vw, 1.15rem) !important; }
          .projects-grid { grid-template-columns: 1fr !important; }
          .project-buttons { flex-wrap: wrap !important; gap: 0.5rem !important; }
          .project-buttons a { flex: 1 1 auto !important; justify-content: center !important; }
          .mini-project-row { flex-wrap: wrap !important; gap: 0.6rem !important; }
          .mini-project-row-right { width: 100% !important; justify-content: flex-end !important; }
        }
      `}</style>

      <div style={{ background: T.bg, color: T.text, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", transition: "background 0.4s ease, color 0.4s ease" }}>

        {/* NAV */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: dark ? "rgba(13,13,13,0.88)" : "rgba(248,247,244,0.9)",
          backdropFilter: "blur(18px)",
          borderBottom: `1px solid ${T.border}`,
          transition: "background 0.4s ease",
        }}>
          <div style={{ ...W, display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
            <span
              onClick={() => scrollTo("hero")}
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.15rem", color: T.accent, cursor: "pointer" }}
            >
              MV<span style={{ color: T.text }}>.</span>
            </span>

            <div className="nav-desktop" style={{ alignItems: "center", gap: "0.15rem" }}>
              {navLinks.map((l) => (
                <button key={l.id} onClick={() => scrollTo(l.id)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "0.4rem 0.8rem", borderRadius: "6px",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem",
                  color: activeSection === l.id ? T.accent : T.muted,
                  fontWeight: activeSection === l.id ? 600 : 400,
                  transition: "color 0.2s",
                }}>
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => setDark(!dark)}
                style={{
                  marginLeft: "0.75rem", background: T.accentDim,
                  border: `1px solid ${T.border}`, borderRadius: "8px",
                  cursor: "pointer", padding: "0.4rem 0.65rem",
                  fontSize: "1rem", transition: "all 0.3s ease",
                }}
              >
                {dark ? "☀️" : "🌙"}
              </button>
            </div>

            <div className="nav-mobile-btn" style={{ alignItems: "center", gap: "0.5rem" }}>
              <button onClick={() => setDark(!dark)} style={{
                background: T.accentDim, border: `1px solid ${T.border}`,
                borderRadius: "8px", cursor: "pointer", padding: "0.35rem 0.5rem", fontSize: "0.9rem",
              }}>
                {dark ? "☀️" : "🌙"}
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "0.4rem", display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center", gap: "5px", width: "36px", height: "36px",
              }}>
                {menuOpen ? (
                  <span style={{ color: T.text, fontSize: "1.3rem", lineHeight: 1, fontWeight: 300 }}>✕</span>
                ) : (
                  <>
                    <span style={{ display: "block", width: "22px", height: "2px", background: T.text, borderRadius: "2px" }} />
                    <span style={{ display: "block", width: "22px", height: "2px", background: T.text, borderRadius: "2px" }} />
                    <span style={{ display: "block", width: "14px", height: "2px", background: T.text, borderRadius: "2px", alignSelf: "flex-start" }} />
                  </>
                )}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div style={{
              background: dark ? "rgba(13,13,13,0.97)" : "rgba(248,247,244,0.97)",
              borderTop: `1px solid ${T.border}`,
              padding: "0.75rem 1.5rem 1rem",
            }}>
              {navLinks.map((l) => (
                <button key={l.id} onClick={() => scrollTo(l.id)} style={{
                  display: "block", width: "100%", textAlign: "left",
                  background: "none", border: "none", cursor: "pointer",
                  padding: "0.8rem 0", color: activeSection === l.id ? T.accent : T.text,
                  fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 500,
                  borderBottom: `1px solid ${T.border}`,
                }}>
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* HERO */}
        <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "flex-start", padding: "0", position: "relative", overflowX: "hidden" }}>
          {/* Grid bg */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 0,
            backgroundImage: `linear-gradient(${T.accent}07 1px, transparent 1px), linear-gradient(90deg, ${T.accent}07 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }} />
          {/* Glow */}
          <div style={{
            position: "absolute", top: "15%", right: "5%",
            width: "500px", height: "500px", borderRadius: "50%",
            background: `radial-gradient(circle, ${T.accentDim} 0%, transparent 70%)`,
            filter: "blur(80px)", zIndex: 0, pointerEvents: "none",
            animation: "float 8s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", bottom: "10%", left: "-5%",
            width: "300px", height: "300px", borderRadius: "50%",
            background: `radial-gradient(circle, ${T.accentDim} 0%, transparent 70%)`,
            filter: "blur(60px)", zIndex: 0, pointerEvents: "none",
          }} />

          <div style={{ ...W, position: "relative", zIndex: 1, paddingTop: "7rem", paddingBottom: "4rem", paddingLeft: "2rem" }}>
            <div style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(48px)",
              transition: "opacity 1s ease, transform 1s ease",
            }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem",
                letterSpacing: "0.18em", color: T.accent, fontWeight: 600,
                marginBottom: "1.25rem", textTransform: "uppercase",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}>
                <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: T.accent, boxShadow: `0 0 8px ${T.accent}` }} />
                Available for opportunities
              </p>

              <h1 className="hero-name" style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(3.2rem, 10vw, 7.5rem)",
                fontWeight: 800,
                lineHeight: 0.92,
                letterSpacing: "-0.03em",
                color: T.text,
                marginBottom: "1.25rem",
              }}>
                Mohamed<br />
                <span style={{ color: T.accent, WebkitTextStroke: dark ? "0" : "0", position: "relative" }}>Vasim</span>
              </h1>

              <div className="hero-role" style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(1.1rem, 3vw, 1.55rem)",
                fontWeight: 600,
                color: T.muted,
                marginBottom: "1.75rem",
                minHeight: "2.2rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}>
                <span style={{ color: T.text }}>{displayedRole}</span>
                <span style={{ color: T.accent, animation: "blink 1s step-end infinite" }}>|</span>
              </div>

              <p style={{ maxWidth: "500px", lineHeight: 1.8, color: T.muted, fontSize: "1rem", marginBottom: "2.5rem" }}>
                Full-stack Developer specializing in <span style={{ color: T.text, fontWeight: 500 }}>Go microservices</span> &amp; <span style={{ color: T.text, fontWeight: 500 }}>React</span>. Building fast, scalable SaaS platforms that ship and perform.
              </p>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button
                  onClick={() => scrollTo("projects")}
                  style={{
                    padding: "0.85rem 2.25rem", borderRadius: "8px",
                    background: T.accent, color: "#0d0d0d",
                    border: "none", fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    boxShadow: `0 0 24px ${T.accentDim}`,
                  }}
                  onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 12px 32px ${T.accentDim}`; }}
                  onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = `0 0 24px ${T.accentDim}`; }}
                >
                  View Work
                </button>
                <button
                  onClick={() => scrollTo("contact")}
                  style={{
                    padding: "0.85rem 2.25rem", borderRadius: "8px",
                    background: "transparent", color: T.text,
                    border: `1px solid ${T.border}`, fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500, fontSize: "0.95rem", cursor: "pointer",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={e => { e.target.style.borderColor = T.accent; e.target.style.color = T.accent; }}
                  onMouseLeave={e => { e.target.style.borderColor = T.border; e.target.style.color = T.text; }}
                >
                  Get in Touch
                </button>
                <a
                  href="/Vasimcv.pdf"
                  download="MohamedVasim_CV.pdf"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.85rem 1.75rem", borderRadius: "8px",
                    background: T.accentDim, color: T.accent,
                    border: `1px solid ${T.accent}55`,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600, fontSize: "0.95rem",
                    transition: "all 0.25s ease", textDecoration: "none",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = T.accent;
                    e.currentTarget.style.color = "#0d0d0d";
                    e.currentTarget.style.borderColor = T.accent;
                    e.currentTarget.style.boxShadow = `0 8px 28px ${T.accentDim}`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = T.accentDim;
                    e.currentTarget.style.color = T.accent;
                    e.currentTarget.style.borderColor = `${T.accent}55`;
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span style={{ animation: "dlpulse 1.4s ease-in-out infinite", display: "inline-block" }}>↓</span>
                  CV
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        {/* <div style={{ background: dark ? "#080808" : "#eeecea", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
          <div style={W}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
              <Counter target={25} suffix="%" label="Faster API Response" theme={T} />
              <Counter target={30} suffix="%" label="Less Server Load" theme={T} />
              <Counter target={20} suffix="%" label="More User Engagement" theme={T} />
              <Counter target={500} suffix="+" label="Games Served" theme={T} />
            </div>
          </div>
        </div> */}

        {/* ABOUT */}
        <Section id="about" theme={T}>
          <div style={W}>
            <SectionHeading theme={T}>About</SectionHeading>
            <div style={{ height: "3px", width: "44px", background: T.accent, marginBottom: "2.5rem", borderRadius: "2px" }} />
            <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
              <div>
                <p style={{ lineHeight: 1.85, color: T.muted, fontSize: "1rem", marginBottom: "1.25rem" }}>
                  Full-stack Software Developer with <strong style={{ color: T.text }}>1.5 years of professional experience</strong> in React, Go, and Node.js. Skilled in microservices architecture, REST API design, and modern frontend development.
                </p>
                <p style={{ lineHeight: 1.85, color: T.muted, fontSize: "1rem", marginBottom: "1.25rem" }}>
                  Currently building production SaaS platforms at <strong style={{ color: T.accent }}>Decentral Code</strong>, driving measurable performance improvements and shipping features that users love.
                </p>
                <p style={{ lineHeight: 1.85, color: T.muted, fontSize: "1rem" }}>
                  Proven track record: <strong style={{ color: T.text }}>25% faster API response times</strong> and <strong style={{ color: T.text }}>30% server load reduction</strong> in production environments.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  { label: "Location", value: "India" },
                  { label: "Role", value: "Software Developer" },
                  { label: "Employer", value: "Decentral Code" },
                  { label: "Stack", value: "Go · React · Node" },
                ].map((item) => (
                  <div key={item.label} style={{
                    padding: "1.1rem 1.25rem",
                    background: T.bgCard,
                    borderRadius: "8px",
                    border: `1px solid ${T.border}`,
                  }}>
                    <div style={{ fontSize: "0.68rem", color: T.accent, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.35rem" }}>{item.label}</div>
                    <div style={{ fontSize: "0.88rem", color: T.text, fontWeight: 500 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* EXPERIENCE */}
        <Section id="experience" theme={T}>
          <div style={W}>
            <SectionHeading theme={T}>Experience</SectionHeading>
            <div style={{ height: "3px", width: "44px", background: T.accent, marginBottom: "2.5rem", borderRadius: "2px" }} />
            <div style={{ position: "relative", paddingLeft: "2rem" }}>
              <div style={{ position: "absolute", left: 0, top: "12px", bottom: 0, width: "2px", background: `linear-gradient(to bottom, ${T.accent}, transparent)` }} />
              <div style={{ position: "absolute", left: "-5px", top: "12px", width: "12px", height: "12px", borderRadius: "50%", background: T.accent, boxShadow: `0 0 14px ${T.accent}` }} />

              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: T.text }}>Software Developer</h3>
                  <p style={{ color: T.accent, fontWeight: 600, fontSize: "0.95rem", marginTop: "0.2rem" }}>Decentral Code</p>
                  <p style={{ color: T.muted, fontSize: "0.8rem", marginTop: "0.15rem" }}>Salem, Tamil Nadu</p>
                </div>
                <span style={{
                  padding: "0.3rem 0.85rem", borderRadius: "99px",
                  border: `1px solid ${T.border}`, color: T.muted,
                  fontSize: "0.78rem", fontFamily: "monospace", whiteSpace: "nowrap",
                }}>
                  Nov 2024 – Present
                </span>
              </div>

              <ul style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {[
                  "Designed microservices architecture in Go — API response time ↑25%, server load ↓30%",
                  "Built React frontend features with Zustand & Material UI — user engagement ↑20%",
                  "Integrated third-party REST APIs into production SaaS platforms",
                  "Developed micro-frontend architecture enabling independent builds from a single monorepo",
                  "Optimized UI performance via responsive design & reusable component architecture",
                ].map((point, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span style={{ color: T.accent, marginTop: "5px", fontSize: "0.55rem", flexShrink: 0 }}>◆</span>
                    <span style={{ color: T.muted, fontSize: "0.92rem", lineHeight: 1.7 }}>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* EDUCATION */}
        <Section id="education" theme={T}>
          <div style={W}>
            <SectionHeading theme={T}>Education</SectionHeading>
            <div style={{ height: "3px", width: "44px", background: T.accent, marginBottom: "2.5rem", borderRadius: "2px" }} />
            <div style={{ position: "relative", paddingLeft: "2rem" }}>
              <div style={{ position: "absolute", left: 0, top: "12px", bottom: 0, width: "2px", background: `linear-gradient(to bottom, ${T.accent}, transparent)` }} />
              <div style={{ position: "absolute", left: "-5px", top: "12px", width: "12px", height: "12px", borderRadius: "50%", background: T.accent, boxShadow: `0 0 14px ${T.accent}` }} />
              <EduCard theme={T} />
            </div>
          </div>
        </Section>

        {/* PROJECTS */}
        <Section id="projects" theme={T}>
          <div style={W}>
            <SectionHeading theme={T}>Projects</SectionHeading>
            <div style={{ height: "3px", width: "44px", background: T.accent, marginBottom: "2.5rem", borderRadius: "2px" }} />
            <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
              {[
                {
                  title: "GameZoneX",
                  subtitle: "Gaming Discovery Platform",
                  period: "Aug – Oct 2024",
                  image: "/img2.png",
                  desc: "High-performance platform serving 100+ games with advanced search & filtering. RESTful APIs via Node.js/Express. Frontend performance improved 35% through custom hooks and optimized rendering strategies.",
                  stack: ["React", "Go", "MongoDB", "Material UI"],
                  highlight: "100+ games served · 35% faster frontend",
                  live: "https://gamexzone.netlify.app/",
                  source: "https://github.com/MOHAMEDVASIM2003/gamezone/tree/main/Gamesitefront-main",
                },
                {
                  title: "My Dream Place",
                  subtitle: "Hotel & Room Booking Platform",
                  period: "Nov 2024 – Apr 2025",
                  image: "/img1.png",
                  desc: "Travel and accommodation booking platform with hotel search, room browsing by destination, Stripe-powered payments, user account management, and activities discovery. Features animated UI, interactive maps, and WhatsApp support integration.",
                  stack: ["React", "Vite", "MUI", "Node.js", "MongoDB", "Stripe"],
                  highlight: "Stripe payments · React Leaflet maps · PDF booking export",
                  live: "https://dreamingplace.netlify.app/",
                  source: "https://github.com/MOHAMEDVASIM2003/dreamplace/tree/main/Frontend%20(room)/Frontend",
                },
                {
                  title: "RaceLine",
                  subtitle: "Racing Community Platform",
                  image: "/img3.png",
                  desc: "Racing community platform where drivers can explore upcoming events, sign up for competitions, and connect with fellow enthusiasts. Built with a full authentication system, membership tiers, and community leaderboards to keep racers engaged.",
                  stack: ["React", "Node.js", "Express", "MongoDB", "JWT"],
                  highlight: "events · race categories · 3-tier memberships",
                  live: "https://raceline-hub.netlify.app/",
                  source: "https://github.com/MOHAMEDVASIM2003/racehub/tree/main/racefront",
                },
                {
                  title: "Byway",
                  subtitle: "E-Learning Platform",
                  image: "/img4.png",
                  desc: "Online course marketplace for tech, design, and data science learners. Features user authentication, Cashfree-powered payments, lesson progress tracking, and PDF certificate generation. Includes course reviews, shopping cart, wishlist, and instructor messaging system.",
                  stack: ["React", "Node.js", "Express", "MongoDB", "MUI"],
                  highlight: "courses · categories · Certificate generation · Cashfree payments",
                  live: "https://bywaylearn.netlify.app/",
                  source: "https://github.com/MOHAMEDVASIM2003/byway/tree/main/Byway-main",
                },
              ].map((project, i) => (
                <ProjectCard key={i} project={project} theme={T} />
              ))}
            </div>

            {/* MINI PROJECTS */}
            <div style={{ marginTop: "3rem" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: "1.25rem" }}>
                Mini Projects
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { title: "SummerCraft", tagline: "Summer — Built to Impress", live: "https://summercraftpro.netlify.app/", source: "https://github.com/MOHAMEDVASIM2003/gallery/tree/main/Summer-main" },
                  { title: "DashStack", tagline: "Control Everything. Miss Nothing.", live: "https://dashstack-hub.netlify.app/", source: "https://github.com/MOHAMEDVASIM2003/admindashboard/tree/main/adminDashboard-main" },
                ].map((p, i) => (
                  p.source ? (
                    <div
                      key={i}
                      className="mini-project-row"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "1rem 1.25rem",
                        background: T.bgCard,
                        border: `1px solid ${T.border}`,
                        borderRadius: "12px",
                        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent + "55"; e.currentTarget.style.boxShadow = `0 4px 16px ${T.accentDim}`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <a href={p.live} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: T.text }}>{p.title}</span>
                          <span style={{ color: T.accent, fontSize: "0.85rem", fontWeight: 700 }}>↗</span>
                        </a>
                        <span style={{ color: T.muted, fontSize: "0.82rem" }}>{p.tagline}</span>
                      </div>
                      <a
                        href={p.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mini-project-row-right"
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "0.4rem",
                          padding: "0.4rem 0.9rem", borderRadius: "8px",
                          border: `1px solid ${T.border}`, color: T.text,
                          fontSize: "0.78rem", fontWeight: 500, textDecoration: "none",
                          whiteSpace: "nowrap",
                          transition: "border-color 0.2s, color 0.2s, background 0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; e.currentTarget.style.background = T.accentDim; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; e.currentTarget.style.background = "transparent"; }}
                      >
                        {"</>"} Source Code
                      </a>
                    </div>
                  ) : (
                    <a
                      key={i}
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "1rem 1.25rem",
                        background: T.bgCard,
                        border: `1px solid ${T.border}`,
                        borderRadius: "12px",
                        textDecoration: "none",
                        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent + "55"; e.currentTarget.style.boxShadow = `0 4px 16px ${T.accentDim}`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <div>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: T.text }}>{p.title}</span>
                        <span style={{ color: T.muted, fontSize: "0.82rem", marginLeft: "0.75rem" }}>{p.tagline}</span>
                      </div>
                      <span style={{ color: T.accent, fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap" }}>View →</span>
                    </a>
                  )
                ))}
              </div>
            </div>

          </div>
        </Section>

        {/* SKILLS */}
        <Section id="skills" theme={T}>
          <div style={W}>
            <SectionHeading theme={T}>Skills</SectionHeading>
            <div style={{ height: "3px", width: "44px", background: T.accent, marginBottom: "2.5rem", borderRadius: "2px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {[
                { category: "Languages", items: ["Go", "JavaScript", "TypeScript", "HTML", "CSS", "SQL"] },
                { category: "Frameworks & Libraries", items: ["React", "Node.js", "Express", "Material UI", "Tailwind CSS", "Zustand", "React Query", "Vite"] },
                { category: "Databases", items: ["MongoDB", "MySQL"] },
                { category: "Testing", items: ["Jest", "Go Testing", "Unit Testing", "Integration Testing"] },
                { category: "Tools & Architecture", items: ["Docker", "Git", "GitHub", "REST APIs", "Agile/Scrum", "Microservices", "Micro Frontends", "GCP"] },
              ].map((group) => (
                <div key={group.category}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: "0.75rem" }}>
                    {group.category}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", margin: "-0.25rem" }}>
                    {group.items.map((item) => <SkillChip key={item} label={item} theme={T} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ACHIEVEMENTS */}
        <Section id="achievements" theme={T}>
          <div style={W}>
            <SectionHeading theme={T} fontSize="clamp(1.5rem, 4vw, 2.4rem)">Achievements</SectionHeading>
            <div style={{ height: "3px", width: "44px", background: T.accent, marginBottom: "2.5rem", borderRadius: "2px" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
              {[
                { icon: "🏆", title: "1st Prize — Coding Competition", desc: "Government College of Engineering, Salem" },
                { icon: "📜", title: "Dual Certifications", desc: "Java (Wipro TalentNext) · Software Testing (NPTEL)" },
                { icon: "👨‍💼", title: "CSE Department Chairperson", desc: "Led student events and peer mentoring programs" },
                { icon: "🌟", title: "Salesforce Student Ambassador", desc: "Represented institution in Salesforce internship program" },
              ].map((a, i) => (
                <AchievementCard key={i} item={a} theme={T} />
              ))}
            </div>
          </div>
        </Section>

        {/* CONTACT */}
        <Section id="contact" theme={T} noBorder>
          <div style={W}>
            <SectionHeading theme={T}>Contact</SectionHeading>
            <div style={{ height: "3px", width: "44px", background: T.accent, marginBottom: "1rem", borderRadius: "2px" }} />
            <p style={{ color: T.muted, marginBottom: "2.5rem", maxWidth: "420px", lineHeight: 1.7 }}>
              Open to full-time roles, freelance projects, and interesting collaborations. Let's build something great.
            </p>
            <CVDownloadCard theme={T} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {[
                { icon: "✉️", label: "Email", value: "mohamedvasim2003@gmail.com", href: "mailto:mohamedvasim2003@gmail.com" },
                { icon: "📱", label: "Phone", value: "+91-9442741448", href: "tel:+919442741448" },
                { icon: "🐙", label: "GitHub", value: "MOHAMEDVASIM2003", href: "https://github.com/MOHAMEDVASIM2003" },
                { icon: "💼", label: "LinkedIn", value: "mohamed-vasim", href: "https://linkedin.com/in/mohamed-vasim-245798224/" },
              ].map((item) => (
                <ContactCard key={item.label} item={item} theme={T} />
              ))}
            </div>
          </div>
        </Section>

        {/* FOOTER */}
        <footer style={{
          borderTop: `1px solid ${T.border}`,
          padding: "2rem 1.5rem",
          textAlign: "center",
          color: T.muted,
          fontSize: "0.83rem",
        }}>
          <span style={{ color: T.text, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>Mohamed Vasim</span>
          {" · "}Built with React
          {" · "}
          <span style={{ color: T.accent }}>© {new Date().getFullYear()}</span>
        </footer>
      </div>
    </>
  );
}
