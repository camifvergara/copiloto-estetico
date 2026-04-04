import { useState, useEffect, useRef } from "react";

// ─── Intersection Observer Hook ─────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); obs.unobserve(el); }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, isVisible];
}

// ─── Animated Section Wrapper ───────────────────────────────
function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Icon Components ────────────────────────────────────────
const IconShield = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconBrain = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
    <path d="M10 22h4"/><path d="M9 9h6"/><path d="M12 9v4"/>
  </svg>
);
const IconScale = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18"/><path d="M5 8l7-5 7 5"/><path d="M3 14l4-6 4 6"/><path d="M13 14l4-6 4 6"/>
    <circle cx="7" cy="14" r="3.5" fill="none"/><circle cx="17" cy="14" r="3.5" fill="none"/>
  </svg>
);
const IconEye = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconTarget = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#02C39A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconArrowDown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M19 12l-7 7-7-7"/>
  </svg>
);

// ─── Main Component ─────────────────────────────────────────
export default function CopilotoLanding() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSubmit = () => {
    if (email.includes("@")) setSubmitted(true);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#E0EAF0", background: "#0A1929", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }
        body { background: #0A1929; }

        .nav { position:fixed; top:0; left:0; right:0; z-index:100; transition: all 0.35s ease; }
        .nav-scrolled { background: rgba(10,25,41,0.92); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(2,195,154,0.08); }
        .nav-inner { max-width:1200px; margin:0 auto; padding:18px 28px; display:flex; align-items:center; justify-content:space-between; }
        .nav-logo { font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:#fff; text-decoration:none; letter-spacing:-0.3px; }
        .nav-logo span { color:#02C39A; }
        .nav-links { display:flex; gap:32px; align-items:center; }
        .nav-link { color:#8BA3B8; font-size:14px; text-decoration:none; font-weight:500; transition:color 0.2s; cursor:pointer; }
        .nav-link:hover { color:#02C39A; }
        .nav-cta { background:linear-gradient(135deg,#028090,#02C39A); color:#fff; padding:10px 22px; border-radius:8px; font-size:13px; font-weight:600; text-decoration:none; border:none; cursor:pointer; transition:transform 0.2s, box-shadow 0.2s; }
        .nav-cta:hover { transform:translateY(-1px); box-shadow:0 4px 20px rgba(2,195,154,0.3); }
        .hamburger { display:none; background:none; border:none; cursor:pointer; padding:4px; }
        .hamburger span { display:block; width:22px; height:2px; background:#8BA3B8; margin:5px 0; transition:0.3s; }

        @media(max-width:768px) {
          .nav-links { display:none; }
          .hamburger { display:block; }
          .mobile-menu { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(10,25,41,0.98); z-index:99; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:28px; }
          .mobile-menu a { color:#E0EAF0; font-size:20px; text-decoration:none; font-weight:500; }
        }

        .section { max-width:1200px; margin:0 auto; padding:0 28px; }

        /* Hero */
        .hero { min-height:100vh; display:flex; flex-direction:column; justify-content:center; position:relative; overflow:hidden; }
        .hero-bg { position:absolute; top:0; left:0; right:0; bottom:0; background: radial-gradient(ellipse at 70% 20%, rgba(2,128,144,0.12) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(2,195,154,0.06) 0%, transparent 40%); }
        .hero-grid { position:absolute; top:0; left:0; right:0; bottom:0; background-image: linear-gradient(rgba(2,195,154,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(2,195,154,0.03) 1px, transparent 1px); background-size: 60px 60px; }
        .hero-content { position:relative; z-index:2; max-width:800px; }
        .hero-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(2,195,154,0.08); border:1px solid rgba(2,195,154,0.15); padding:6px 16px; border-radius:100px; font-size:12px; color:#02C39A; font-weight:500; margin-bottom:28px; letter-spacing:0.5px; text-transform:uppercase; }
        .hero-badge-dot { width:6px; height:6px; border-radius:50%; background:#02C39A; animation: pulse-dot 2s infinite; }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .hero h1 { font-family:'Playfair Display',serif; font-size:clamp(36px,5.5vw,64px); line-height:1.1; color:#fff; font-weight:700; margin-bottom:24px; letter-spacing:-1px; }
        .hero h1 em { font-style:italic; color:#02C39A; }
        .hero-sub { font-size:clamp(16px,2vw,20px); color:#8BA3B8; line-height:1.7; max-width:620px; margin-bottom:40px; font-weight:300; }
        .hero-actions { display:flex; gap:14px; flex-wrap:wrap; align-items:center; }
        .hero-input-wrap { display:flex; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:10px; overflow:hidden; }
        .hero-input { background:transparent; border:none; outline:none; padding:14px 18px; color:#fff; font-size:15px; width:260px; font-family:inherit; }
        .hero-input::placeholder { color:#5A7A8A; }
        .hero-btn { background:linear-gradient(135deg,#028090,#02C39A); color:#fff; padding:14px 28px; border:none; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.25s; font-family:inherit; }
        .hero-btn:hover { filter:brightness(1.1); }
        .hero-success { color:#02C39A; font-size:15px; font-weight:500; display:flex; align-items:center; gap:8px; }
        .hero-scroll { position:absolute; bottom:40px; left:50%; transform:translateX(-50%); color:#5A7A8A; animation: float 3s ease-in-out infinite; cursor:pointer; }
        @keyframes float { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }

        .hero-stats { display:flex; gap:40px; margin-top:48px; padding-top:32px; border-top:1px solid rgba(255,255,255,0.06); }
        .hero-stat-num { font-family:'Playfair Display',serif; font-size:32px; color:#02C39A; font-weight:700; }
        .hero-stat-label { font-size:12px; color:#5A7A8A; text-transform:uppercase; letter-spacing:1px; margin-top:4px; }

        /* Problem Section */
        .problem { padding:120px 0; position:relative; }
        .problem::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(2,195,154,0.15),transparent); }
        .section-label { font-size:11px; text-transform:uppercase; letter-spacing:3px; color:#028090; font-weight:600; margin-bottom:12px; }
        .section-title { font-family:'Playfair Display',serif; font-size:clamp(28px,4vw,44px); color:#fff; font-weight:700; line-height:1.2; margin-bottom:20px; letter-spacing:-0.5px; }
        .section-desc { font-size:17px; color:#6B8FA3; line-height:1.7; max-width:600px; margin-bottom:56px; font-weight:300; }

        .tensions-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(340px,1fr)); gap:20px; }
        .tension-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:14px; padding:32px; transition:all 0.3s; position:relative; overflow:hidden; }
        .tension-card:hover { border-color:rgba(2,195,154,0.2); background:rgba(2,195,154,0.03); transform:translateY(-2px); }
        .tension-num { font-family:'Playfair Display',serif; font-size:48px; color:rgba(2,195,154,0.1); font-weight:700; position:absolute; top:16px; right:24px; }
        .tension-icon { color:#028090; margin-bottom:16px; }
        .tension-title { font-size:16px; font-weight:600; color:#fff; margin-bottom:10px; }
        .tension-desc { font-size:14px; color:#6B8FA3; line-height:1.7; }

        /* Solution */
        .solution { padding:120px 0; position:relative; background:linear-gradient(180deg, transparent 0%, rgba(2,128,144,0.04) 50%, transparent 100%); }
        .solution-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
        @media(max-width:900px) { .solution-grid { grid-template-columns:1fr; gap:48px; } }
        .solution-visual { position:relative; }
        .solution-mockup { background:linear-gradient(135deg,rgba(2,128,144,0.08),rgba(2,195,154,0.05)); border:1px solid rgba(2,195,154,0.12); border-radius:20px; padding:40px; position:relative; }
        .mockup-header { display:flex; align-items:center; gap:8px; margin-bottom:28px; }
        .mockup-dot { width:10px; height:10px; border-radius:50%; }
        .mockup-bar { height:32px; border-radius:8px; margin-bottom:12px; }
        .mockup-scores { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:24px; }
        .mockup-score { background:rgba(255,255,255,0.04); border-radius:10px; padding:20px; text-align:center; }
        .mockup-score-val { font-family:'Playfair Display',serif; font-size:36px; font-weight:700; }
        .mockup-score-label { font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#6B8FA3; margin-top:6px; }
        .mockup-glow { position:absolute; width:200px; height:200px; border-radius:50%; filter:blur(80px); opacity:0.2; }

        .solution-features { list-style:none; display:flex; flex-direction:column; gap:20px; margin-top:32px; }
        .solution-feature { display:flex; gap:14px; align-items:flex-start; }
        .solution-feature-text { font-size:15px; color:#8BA3B8; line-height:1.6; }
        .solution-feature-text strong { color:#fff; font-weight:600; }

        /* How it Works */
        .how { padding:120px 0; }
        .steps { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; margin-top:60px; position:relative; }
        .steps::before { content:''; position:absolute; top:40px; left:12%; right:12%; height:1px; background:linear-gradient(90deg, rgba(2,195,154,0.3), rgba(2,128,144,0.1)); }
        @media(max-width:900px) { .steps { grid-template-columns:1fr 1fr; } .steps::before { display:none; } }
        @media(max-width:500px) { .steps { grid-template-columns:1fr; } }
        .step { text-align:center; position:relative; z-index:1; }
        .step-num { width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,#028090,#02C39A); display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:#fff; box-shadow:0 0 30px rgba(2,195,154,0.2); }
        .step-title { font-size:15px; font-weight:600; color:#fff; margin-bottom:8px; }
        .step-desc { font-size:13px; color:#6B8FA3; line-height:1.6; max-width:220px; margin:0 auto; }

        /* Validation */
        .validation { padding:120px 0; background:linear-gradient(180deg, transparent, rgba(2,128,144,0.03), transparent); }
        .val-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:24px; margin-top:48px; }
        .val-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:16px; padding:36px 28px; text-align:center; transition:all 0.3s; }
        .val-card:hover { border-color:rgba(2,195,154,0.2); transform:translateY(-3px); }
        .val-num { font-family:'Playfair Display',serif; font-size:48px; font-weight:700; background:linear-gradient(135deg,#02C39A,#028090); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1.1; }
        .val-label { font-size:14px; color:#8BA3B8; margin-top:10px; line-height:1.5; }
        .val-caption { margin-top:48px; font-size:14px; color:#5A7A8A; text-align:center; line-height:1.7; max-width:700px; margin-left:auto; margin-right:auto; font-style:italic; }

        /* Credibility */
        .credibility { padding:100px 0; }
        .cred-card { background:linear-gradient(135deg,rgba(2,128,144,0.06),rgba(2,195,154,0.03)); border:1px solid rgba(2,195,154,0.1); border-radius:20px; padding:56px; display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
        @media(max-width:768px) { .cred-card { grid-template-columns:1fr; padding:36px 28px; } }
        .cred-stats { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        .cred-stat { text-align:center; }
        .cred-stat-num { font-family:'Playfair Display',serif; font-size:36px; font-weight:700; color:#02C39A; }
        .cred-stat-label { font-size:12px; color:#6B8FA3; text-transform:uppercase; letter-spacing:1px; margin-top:6px; }

        /* CTA Final */
        .cta-final { padding:120px 0; text-align:center; position:relative; }
        .cta-final::before { content:''; position:absolute; top:50%; left:50%; width:600px; height:600px; transform:translate(-50%,-50%); border-radius:50%; background:radial-gradient(circle,rgba(2,195,154,0.06),transparent 60%); }
        .cta-final .section-title { max-width:700px; margin:0 auto 20px; }
        .cta-final .section-desc { max-width:500px; margin:0 auto 40px; text-align:center; }

        /* Footer */
        .footer { border-top:1px solid rgba(255,255,255,0.05); padding:40px 0; }
        .footer-inner { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; }
        .footer-text { font-size:13px; color:#4A6A7A; }
        .footer-links { display:flex; gap:24px; }
        .footer-link { font-size:13px; color:#5A7A8A; text-decoration:none; transition:color 0.2s; }
        .footer-link:hover { color:#02C39A; }
      `}</style>

      {/* ─── NAV ───────────────────────────────────────── */}
      <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#" className="nav-logo">Copiloto<span>360°</span></a>
          <div className="nav-links">
            <a href="#problema" className="nav-link">El problema</a>
            <a href="#solucion" className="nav-link">La solución</a>
            <a href="#como" className="nav-link">Cómo funciona</a>
            <a href="#validacion" className="nav-link">Validación</a>
            <a href="#acceso" className="nav-cta">Acceso anticipado</a>
          </div>
          <button className="hamburger" onClick={() => setMobileMenu(!mobileMenu)}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {mobileMenu && (
        <div className="mobile-menu" onClick={() => setMobileMenu(false)}>
          <a href="#problema">El problema</a>
          <a href="#solucion">La solución</a>
          <a href="#como">Cómo funciona</a>
          <a href="#validacion">Validación</a>
          <a href="#acceso" style={{color:"#02C39A"}}>Acceso anticipado</a>
        </div>
      )}

      {/* ─── HERO ──────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg"/>
        <div className="hero-grid"/>
        <div className="section hero-content">
          <FadeIn>
            <div className="hero-badge">
              <span className="hero-badge-dot"/> Próximo lanzamiento
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1>
              Antes de intervenir tu cuerpo,<br/>
              <em>analiza tu decisión.</em>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="hero-sub">
              Copiloto Estético 360° es la primera herramienta de inteligencia artificial diseñada 
              para ayudarte a evaluar si un procedimiento estético es realmente lo que necesitas. 
              No vendemos tratamientos. Mejoramos decisiones.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            {!submitted ? (
              <div className="hero-actions">
                <div className="hero-input-wrap">
                  <input
                    className="hero-input"
                    type="email"
                    placeholder="Tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                  <button className="hero-btn" onClick={handleSubmit}>
                    Quiero acceso
                  </button>
                </div>
              </div>
            ) : (
              <div className="hero-success">
                <IconCheck /> ¡Listo! Te avisaremos cuando lancemos.
              </div>
            )}
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">11</div>
                <div className="hero-stat-label">Años de investigación</div>
              </div>
              <div>
                <div className="hero-stat-num">300K+</div>
                <div className="hero-stat-label">Citas analizadas</div>
              </div>
              <div>
                <div className="hero-stat-num">97%</div>
                <div className="hero-stat-label">Intención de uso</div>
              </div>
            </div>
          </FadeIn>
        </div>
        <a href="#problema" className="hero-scroll"><IconArrowDown/></a>
      </section>

      {/* ─── PROBLEM ───────────────────────────────────── */}
      <section className="problem" id="problema">
        <div className="section">
          <FadeIn>
            <div className="section-label">El problema</div>
            <div className="section-title">
              La industria estética está diseñada para<br/>
              que <em style={{fontFamily:"'Playfair Display',serif",color:"#02C39A",fontStyle:"italic"}}>actúes rápido</em>, no para que decidas bien.
            </div>
            <div className="section-desc">
              Once años observando cómo las personas toman decisiones en medicina estética
              revelaron cinco tensiones estructurales que nadie está resolviendo.
            </div>
          </FadeIn>

          <div className="tensions-grid">
            {[
              { icon: <IconScale/>, num: "01", title: "Incentivos a la sobreintervención", desc: "El ingreso del profesional crece con cada procedimiento realizado, no con la salud o satisfacción del paciente." },
              { icon: <IconEye/>, num: "02", title: "Asimetría de información", desc: "El paciente no sabe qué necesita. El médico sí — y tiene incentivos económicos para recomendar más, no menos." },
              { icon: <IconBrain/>, num: "03", title: "Sesgos cognitivos", desc: "Efecto framing, anclaje, aversión a la pérdida, presión social. Las decisiones estéticas rara vez son racionales." },
              { icon: <IconTarget/>, num: "04", title: "Sobre-diagnóstico", desc: "Mientras más se examina, más 'imperfecciones' aparecen. El sistema crea necesidades que antes no existían." },
              { icon: <IconShield/>, num: "05", title: "Sin herramientas neutrales", desc: "Hoy toda la información depende de quien vende el servicio. No existe un árbitro independiente del paciente." },
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="tension-card">
                  <div className="tension-num">{t.num}</div>
                  <div className="tension-icon">{t.icon}</div>
                  <div className="tension-title">{t.title}</div>
                  <div className="tension-desc">{t.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOLUTION ──────────────────────────────────── */}
      <section className="solution" id="solucion">
        <div className="section">
          <div className="solution-grid">
            <div>
              <FadeIn>
                <div className="section-label">La solución</div>
                <div className="section-title">
                  Tu copiloto de decisión<br/>en medicina estética
                </div>
                <div className="section-desc">
                  No un marketplace. No un chatbot. Una arquitectura de inteligencia artificial 
                  que mejora el proceso de decisión antes de intervenir tu cuerpo.
                </div>
              </FadeIn>
              <FadeIn delay={0.15}>
                <ul className="solution-features">
                  {[
                    { title: "Análisis de riesgo personalizado", desc: "Evaluamos tu perfil, historial y motivaciones para identificar riesgos que la consulta tradicional no alcanza a cubrir." },
                    { title: "Evaluación de necesidad real", desc: "¿Realmente lo necesitas, o es un impulso? Te ayudamos a distinguir entre deseo informado y presión social." },
                    { title: "Alternativas que no conocías", desc: "Antes de decidir, ve todas las opciones — incluyendo no hacer nada." },
                    { title: "100% independiente", desc: "No vendemos procedimientos. No recibimos comisiones. Nuestra única misión es que tomes la mejor decisión posible." },
                  ].map((f, i) => (
                    <li key={i} className="solution-feature">
                      <div style={{flexShrink:0,marginTop:2}}><IconCheck/></div>
                      <div className="solution-feature-text">
                        <strong>{f.title}.</strong> {f.desc}
                      </div>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>

            <FadeIn delay={0.2}>
              <div className="solution-visual">
                <div className="solution-mockup">
                  <div className="mockup-glow" style={{top:"-40px",right:"-40px",background:"#028090"}}/>
                  <div className="mockup-glow" style={{bottom:"-40px",left:"-40px",background:"#02C39A"}}/>
                  <div className="mockup-header">
                    <div className="mockup-dot" style={{background:"#02C39A"}}/>
                    <span style={{fontSize:13,color:"#8BA3B8",fontWeight:500}}>Copiloto Estético 360°</span>
                  </div>
                  <div style={{fontSize:11,color:"#5A7A8A",textTransform:"uppercase",letterSpacing:2,marginBottom:16}}>
                    Resultado de tu análisis
                  </div>
                  <div className="mockup-scores">
                    <div className="mockup-score">
                      <div className="mockup-score-val" style={{color:"#02C39A"}}>72</div>
                      <div className="mockup-score-label">Índice de riesgo</div>
                    </div>
                    <div className="mockup-score">
                      <div className="mockup-score-val" style={{color:"#028090"}}>45</div>
                      <div className="mockup-score-label">Necesidad real</div>
                    </div>
                  </div>
                  <div style={{marginTop:24}}>
                    {["Motivación principal: presión social","Expectativas: desalineadas con realidad clínica","Recomendación: explorar alternativas"].map((t,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                        <div style={{width:4,height:4,borderRadius:2,background:i===2?"#02C39A":"#028090",flexShrink:0}}/>
                        <span style={{fontSize:12,color:"#8BA3B8"}}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────── */}
      <section className="how" id="como">
        <div className="section">
          <FadeIn>
            <div style={{textAlign:"center"}}>
              <div className="section-label">Cómo funciona</div>
              <div className="section-title">
                4 pasos hacia una decisión<br/>que no vas a lamentar
              </div>
            </div>
          </FadeIn>

          <div className="steps">
            {[
              { num: "1", title: "Cuéntanos sobre ti", desc: "Tu perfil de salud, historial estético y contexto personal." },
              { num: "2", title: "Define tu interés", desc: "¿Qué procedimiento consideras y cuál es tu motivación principal?" },
              { num: "3", title: "Análisis inteligente", desc: "Nuestro motor de IA cruza tu perfil con evidencia clínica y patrones de decisión." },
              { num: "4", title: "Tu hoja de ruta", desc: "Recibes un análisis de riesgo, necesidad real y alternativas personalizadas." },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="step">
                  <div className="step-num">{s.num}</div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VALIDATION ────────────────────────────────── */}
      <section className="validation" id="validacion">
        <div className="section">
          <FadeIn>
            <div style={{textAlign:"center"}}>
              <div className="section-label">Validación con usuarios reales</div>
              <div className="section-title">
                Los números hablan por sí solos
              </div>
              <div className="section-desc" style={{maxWidth:600,margin:"0 auto 0"}}>
                Realizamos un experimento de validación con personas que están considerando 
                procedimientos estéticos. Esto es lo que encontramos:
              </div>
            </div>
          </FadeIn>

          <div className="val-grid">
            {[
              { num: "97%", label: "usaría la herramienta para analizar su decisión" },
              { num: "100%", label: "dejó su email — confianza total en el concepto" },
              { num: "72%", label: "dedicaría 1 hora o más al análisis de su decisión" },
              { num: "59%", label: "quiere evaluar riesgos y necesidad, no comparar clínicas" },
            ].map((v, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="val-card">
                  <div className="val-num">{v.num}</div>
                  <div className="val-label">{v.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div className="val-caption">
              "El hallazgo más contraintuitivo: las personas están dispuestas a invertir
              tiempo significativo en analizar su decisión estética. La industria asume 
              que quieren rapidez. Los datos dicen lo contrario."
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── CREDIBILITY ───────────────────────────────── */}
      <section className="credibility">
        <div className="section">
          <FadeIn>
            <div className="cred-card">
              <div>
                <div className="section-label" style={{marginBottom:16}}>Respaldado por</div>
                <div className="section-title" style={{fontSize:"clamp(24px,3vw,34px)",marginBottom:16}}>
                  11 años de experiencia<br/>con Promoestética
                </div>
                <p style={{fontSize:15,color:"#8BA3B8",lineHeight:1.7}}>
                  El Copiloto Estético 360° nace de la observación directa de miles de decisiones 
                  estéticas a través de Promoestética, una de las plataformas de medicina estética 
                  más reconocidas de Colombia. No es una idea de laboratorio — es la respuesta a 
                  un problema que vimos de primera mano durante más de una década.
                </p>
              </div>
              <div className="cred-stats">
                <div className="cred-stat">
                  <div className="cred-stat-num">300K+</div>
                  <div className="cred-stat-label">Citas atendidas</div>
                </div>
                <div className="cred-stat">
                  <div className="cred-stat-num">28K</div>
                  <div className="cred-stat-label">Seguidores</div>
                </div>
                <div className="cred-stat">
                  <div className="cred-stat-num">11</div>
                  <div className="cred-stat-label">Años</div>
                </div>
                <div className="cred-stat">
                  <div className="cred-stat-num">4</div>
                  <div className="cred-stat-label">Disciplinas académicas</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── CTA FINAL ─────────────────────────────────── */}
      <section className="cta-final" id="acceso">
        <div className="section" style={{position:"relative",zIndex:2}}>
          <FadeIn>
            <div className="section-label">Acceso anticipado</div>
            <div className="section-title">
              Sé de los primeros en tomar<br/>
              <em style={{fontFamily:"'Playfair Display',serif",color:"#02C39A",fontStyle:"italic"}}>decisiones estéticas informadas</em>
            </div>
            <div className="section-desc">
              Estamos construyendo algo que no existe. Si crees que las personas 
              merecen mejores herramientas para decidir sobre su propio cuerpo, 
              únete a la lista.
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            {!submitted ? (
              <div style={{display:"flex",justifyContent:"center"}}>
                <div className="hero-input-wrap">
                  <input
                    className="hero-input"
                    type="email"
                    placeholder="Tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                  <button className="hero-btn" onClick={handleSubmit}>
                    Quiero acceso anticipado
                  </button>
                </div>
              </div>
            ) : (
              <div className="hero-success" style={{justifyContent:"center"}}>
                <IconCheck /> ¡Listo! Te avisaremos cuando lancemos.
              </div>
            )}
          </FadeIn>
          <FadeIn delay={0.25}>
            <p style={{fontSize:12,color:"#4A6A7A",marginTop:16}}>
              Sin spam. Sin compromisos. Solo acceso prioritario cuando lancemos.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────── */}
      <footer className="footer">
        <div className="section">
          <div className="footer-inner">
            <div>
              <a href="#" className="nav-logo" style={{fontSize:18}}>Copiloto<span>360°</span></a>
              <div className="footer-text" style={{marginTop:8}}>
                Democratizando el análisis de las decisiones.
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div className="footer-text">
                Un proyecto de <a href="https://promoestetica.com" style={{color:"#02C39A",textDecoration:"none"}} target="_blank" rel="noopener">Promoestética</a>
              </div>
              <div className="footer-text" style={{marginTop:4}}>
                © {new Date().getFullYear()} Copiloto Estético 360°. Bogotá, Colombia.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
