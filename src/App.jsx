import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

emailjs.init({ publicKey: "bFO_9pHOXppYEZcSR" });
const SERVICE_ID = "service_d6rmtxh";
const TEMPLATE_ID = "template_7j0tpyr";

// Edit to match what you actually use
const SKILLS = [
  { name: "HTML", icon: "fa-brands fa-html5" },
  { name: "CSS", icon: "fa-brands fa-css3-alt" },
  { name: "JavaScript", icon: "fa-brands fa-js" },
  { name: "React", icon: "fa-brands fa-react" },
];
const NAV = ["home", "skills", "about", "contact"];
const ROLES = ["Full Stack Developer", "Front-end Builder", "Problem Solver"];

/* ---------- hooks ---------- */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (el.querySelectorAll(".reveal").forEach((n) => n.classList.add("in")), io.disconnect()),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function useTyped(words) {
  const [text, setText] = useState("");
  useEffect(() => {
    let w = 0, c = 0, del = false, t;
    const step = () => {
      const word = words[w];
      c += del ? -1 : 1;
      setText(word.slice(0, c));
      let delay = del ? 40 : 90;
      if (!del && c === word.length) { del = true; delay = 1600; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; delay = 300; }
      t = setTimeout(step, delay);
    };
    step();
    return () => clearTimeout(t);
  }, [words]);
  return text;
}

/* 3D tilt + glare card */
function Tilt({ children, className = "" }) {
  const ref = useRef(null);
  const move = (e) => {
    const el = ref.current, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(700px) rotateX(${(0.5 - y) * 14}deg) rotateY(${(x - 0.5) * 14}deg) scale(1.03)`;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const leave = () => (ref.current.style.transform = "");
  return (
    <div
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`group relative transition-transform duration-200 ease-out ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: "radial-gradient(240px circle at var(--mx) var(--my), rgb(236 255 132 / .18), transparent 60%)" }} />
      {children}
    </div>
  );
}

/* cursor spotlight */
function Spotlight() {
  const ref = useRef(null);
  useEffect(() => {
    const move = (e) => ref.current && (ref.current.style.background =
      `radial-gradient(500px circle at ${e.clientX}px ${e.clientY}px, rgb(160 160 232 / .13), transparent 60%)`);
    addEventListener("mousemove", move);
    return () => removeEventListener("mousemove", move);
  }, []);
  return <div ref={ref} className="pointer-events-none fixed inset-0 z-0" />;
}

const Title = ({ children }) => (
  <h2 className="reveal mb-12 text-center font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
    <span className="bg-gradient-to-r from-sand via-lilac to-lime-pop bg-clip-text text-transparent">{children}</span>
  </h2>
);

function Logo() {
  const [ok, setOk] = useState(true);
  return ok ? (
    <img src="/IMG_9172.PNG" alt="Sinan logo" className="h-10 w-auto" onError={() => setOk(false)} />
  ) : (
    <span className="grid size-10 place-items-center rounded-full bg-lime-pop font-display text-xl font-extrabold text-cocoa">S</span>
  );
}

/* ---------- sections ---------- */
function Nav({ active }) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-cocoa/70 px-4 backdrop-blur-lg sm:px-10">
      <Logo />
      <ul className="flex gap-3 text-sm font-medium sm:gap-9 sm:text-base">
        {NAV.map((id) => (
          <li key={id}>
            <a href={`#${id}`}
              className={`relative py-1 capitalize transition-colors hover:text-lime-pop after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:bg-lime-pop after:transition-transform ${
                active === id ? "text-lime-pop after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`}>
              {id}
            </a>
          </li>
        ))}
      </ul>
      <a href="/resume.png" download
        className="rounded-full bg-lime-pop px-3 py-1.5 text-xs font-bold text-cocoa transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-6px_#ecff84aa] sm:px-4 sm:text-sm">
        Resume <i className="fa-solid fa-download ml-1" />
      </a>
    </nav>
  );
}

function Hero() {
  const photo = useRef(null);
  const role = useTyped(ROLES);

  useEffect(() => {
    const el = photo.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf, tx = 0, ty = 0, cx = 0, cy = 0;
    const move = (e) => { tx = (e.clientY / innerHeight - 0.5) * -14; ty = (e.clientX / innerWidth - 0.5) * 14; };
    const tick = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      el.style.transform = `perspective(900px) rotateX(${cx}deg) rotateY(${cy}deg)`;
      raf = requestAnimationFrame(tick);
    };
    addEventListener("mousemove", move);
    raf = requestAnimationFrame(tick);
    return () => { removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section id="home" className="relative grid min-h-screen items-center gap-8 overflow-hidden px-6 pb-16 pt-28 md:grid-cols-[1.1fr_1fr] md:px-[7vw]">
      <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-indigo-deep/70 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-lilac/20 blur-3xl" />

      <div className="relative text-center md:text-left">
        <p className="animate-rise text-xl text-sand/80" style={{ animationDelay: ".1s" }}>Hi, I'm</p>
        <h1 aria-label="Sinan" className="flex justify-center font-display text-[clamp(4.5rem,14vw,10.5rem)] font-extrabold leading-none tracking-tighter md:justify-start">
          {"SINAN".split("").map((c, i) => (
            <span key={i} aria-hidden="true" className="inline-block animate-letter bg-gradient-to-b from-sand to-lilac bg-clip-text text-transparent"
              style={{ animationDelay: `${0.25 + i * 0.08}s` }}>{c}</span>
          ))}
        </h1>
        <h2 className="mt-2 h-10 animate-rise font-display text-2xl font-bold text-lime-pop sm:text-3xl" style={{ animationDelay: "1s" }}>
          {role}<span className="animate-blink">|</span>
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] animate-rise text-lg text-sand/75 md:mx-0" style={{ animationDelay: "1.15s" }}>
          I build responsive, easy-to-use websites and apps, front end to back end, and keep learning the tools that make them faster and cleaner.
        </p>
        <div className="mt-8 flex animate-rise items-center justify-center gap-4 md:justify-start" style={{ animationDelay: "1.3s" }}>
          <a href="#contact" className="rounded-full bg-lime-pop px-7 py-3.5 font-semibold text-cocoa transition hover:-translate-y-1 hover:shadow-[0_12px_30px_-8px_#ecff84aa]">
            Work with me
          </a>
          {[["https://www.instagram.com/sinhhh_", "fa-instagram", "Instagram"], ["https://wa.me/917902236561", "fa-whatsapp", "WhatsApp"]].map(([href, ic, label]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
              className="grid size-12 place-items-center rounded-full border border-white/20 bg-white/5 text-2xl transition hover:-translate-y-1 hover:-rotate-6 hover:border-lime-pop hover:text-lime-pop">
              <i className={`fa-brands ${ic}`} />
            </a>
          ))}
        </div>
      </div>

      <div className="relative mx-auto grid w-full max-w-[460px] place-items-center max-md:order-first max-md:max-w-[300px]">
        <div className="absolute aspect-square w-[108%] animate-morph bg-[conic-gradient(from_0deg,#22264f,#a0a0e8,#ecff84,#22264f)] opacity-70 blur-sm" style={{ borderRadius: "42% 58% 55% 45% / 50% 45% 55% 50%" }} />
        <div ref={photo} className="relative w-[88%] animate-float">
          <div className="aspect-[4/5] animate-[morph_9s_ease-in-out_infinite] overflow-hidden border-4 border-lime-pop/80 shadow-[0_28px_50px_rgba(0,0,0,.5)]" style={{ borderRadius: "42% 58% 55% 45% / 50% 45% 55% 50%" }}>
            <img src="/hero.jpg" alt="Sinan" className="h-full w-full scale-[1.7] object-cover origin-[56%_32%] object-[50%_28%]" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const ref = useReveal();
  const loop = [...SKILLS, ...SKILLS, ...SKILLS, ...SKILLS];
  return (
    <section id="skills" ref={ref} className="relative z-10 overflow-hidden bg-sand px-6 py-24 text-cocoa">
      <h2 className="reveal mb-12 text-center font-display text-5xl font-extrabold tracking-tight sm:text-6xl">My skills</h2>
      <div aria-hidden="true" className="group mb-14 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-6 group-hover:[animation-play-state:paused]">
          {loop.map((s, i) => (
            <span key={i} className="flex items-center gap-3 px-4 font-display text-4xl font-bold text-transparent [-webkit-text-stroke:1.5px_#3f2929] sm:text-5xl">
              <i className={`${s.icon} text-indigo-deep [-webkit-text-stroke:0]`} />{s.name}
            </span>
          ))}
        </div>
      </div>
      <ul className="mx-auto grid max-w-3xl grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-5">
        {SKILLS.map((s, i) => (
          <li key={s.name} className="reveal" style={{ transitionDelay: `${i * 90}ms` }}>
            <Tilt className="flex flex-col items-center gap-3 rounded-3xl bg-cocoa px-5 py-9 text-sand shadow-xl">
              <i className={`${s.icon} text-5xl text-lime-pop transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-125`} />
              <span className="font-display text-xl font-semibold">{s.name}</span>
            </Tilt>
          </li>
        ))}
      </ul>
    </section>
  );
}

function About() {
  const ref = useReveal();
  const panel = "reveal rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur";
  return (
    <section id="about" ref={ref} className="relative z-10 px-6 py-24">
      <Title>About me</Title>
      <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-[1.2fr_1fr] md:grid-rows-2">
        <Tilt className={`${panel} md:row-span-2`}>
          <h3 className="mb-3 font-display text-2xl font-bold text-lime-pop">About</h3>
          <p className="text-sand/70">
            I'm a full stack developer who enjoys building modern, responsive, user-friendly web applications, from the first idea to deployment. I care about clean, maintainable code and interfaces that feel good to use. I keep exploring new technologies and turning ideas into working projects.
          </p>
        </Tilt>
        <Tilt className={panel}>
          <h3 className="mb-3 font-display text-2xl font-bold text-lime-pop">Experience</h3>
          <p className="text-sand/70">Hands-on experience designing and building responsive web applications: user-friendly interfaces, server-side functionality and databases.</p>
        </Tilt>
        <Tilt className={panel}>
          <h3 className="mb-3 font-display text-2xl font-bold text-lime-pop">Education</h3>
          <p className="font-semibold">Afzalul Ulama Preliminary (BA Arabic pre-degree)</p>
          <p className="mt-1 text-sm text-sand/70"><i className="fa-solid fa-building-columns mr-1" /> Sunniya Arabic College, Mukkam<br />Calicut University, 2024–26 batch</p>
          <p className="mt-2 text-sm text-sand/70">Diploma in Graphic Designing (DGD)</p>
        </Tilt>
      </div>
    </section>
  );
}

function Contact() {
  const ref = useReveal();
  const [status, setStatus] = useState("idle");
  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget, d = new FormData(form);
    setStatus("sending");
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, { name: d.get("name"), email: d.get("email"), message: d.get("message") });
      form.reset();
      setStatus("sent");
    } catch (err) { console.error(err); setStatus("error"); }
  };
  const field = "w-full rounded-xl border-2 border-white/10 bg-cocoa/60 px-4 py-3 text-sand outline-none transition focus:border-lime-pop focus:shadow-[0_0_0_4px_#ecff8426]";
  return (
    <section id="contact" ref={ref} className="relative z-10 px-6 pb-10 pt-24">
      <Title>Get in touch</Title>
      <div className="reveal mx-auto grid max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur md:grid-cols-[1.3fr_1fr]">
        <form onSubmit={submit} className="flex flex-col gap-5 p-8">
          <label className="flex flex-col gap-2 text-sm font-semibold">Your name<input name="name" type="text" required className={field} /></label>
          <label className="flex flex-col gap-2 text-sm font-semibold">Email<input name="email" type="email" required className={field} /></label>
          <label className="flex flex-col gap-2 text-sm font-semibold">How can I help you?<textarea name="message" rows="4" required className={field} /></label>
          <button disabled={status === "sending"} className="self-start rounded-full bg-lime-pop px-7 py-3 font-semibold text-cocoa transition hover:-translate-y-1 hover:shadow-[0_12px_30px_-8px_#ecff84aa] disabled:cursor-wait disabled:opacity-60">
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
          <p role="status" className={`min-h-6 text-sm ${status === "sent" ? "text-green-400" : "text-red-400"}`}>
            {status === "sent" && "Message sent. I'll reply soon."}
            {status === "error" && "Couldn't send the message. Please try again or email me directly."}
          </p>
        </form>
        <aside className="flex flex-col justify-center gap-4 bg-indigo-deep/60 p-8">
          <h3 className="font-display text-3xl font-bold text-lime-pop">Let's connect</h3>
          <p className="text-sand/70">Have a project or an idea? Tell me about it.</p>
          {[["mailto:tpsinan61@gmail.com", "fa-envelope", "tpsinan61@gmail.com"], ["tel:+917902236561", "fa-phone", "7902236561"]].map(([href, ic, t]) => (
            <a key={t} href={href} className="flex items-center gap-3 break-all transition hover:translate-x-1.5 hover:text-lime-pop">
              <i className={`fa-solid ${ic} w-5 text-lilac`} />{t}
            </a>
          ))}
        </aside>
      </div>
      <footer className="mt-16 text-center text-sm text-sand/50">© {new Date().getFullYear()} Sinan</footer>
    </section>
  );
}

export default function App() {
  const [active, setActive] = useState("home");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach((id) => { const el = document.getElementById(id); el && io.observe(el); });
    const onScroll = () => setProgress(scrollY / (document.documentElement.scrollHeight - innerHeight));
    addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); removeEventListener("scroll", onScroll); };
  }, []);
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-lime-pop" style={{ transform: `scaleX(${progress})` }} />
      <Spotlight />
      <Nav active={active} />
      <main><Hero /><Skills /><About /><Contact /></main>
    </>
  );
}
