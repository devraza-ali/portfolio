import React, { useEffect, useState } from "react";
import { FiArrowUp, FiArrowUpRight, FiCheck, FiCopy, FiDownload, FiGithub, FiLinkedin, FiSend } from "react-icons/fi";
import resumeData from "../../utils/resumeData";
import Magnet from "../../components/reactbits/Magnet";
import { Reveal } from "../parts";

function useContactForm() {
  const [state, setState] = useState("idle");
  const key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  const submit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);
    const name = fd.get("name");
    const email = fd.get("email");
    const message = fd.get("message");
    const type = fd.get("hiring_for");
    const subject = `[${type || "Portfolio"}] from ${name}`;
    setState("sending");

    // Without a Web3Forms key (local dev, forks) fall back to the visitor's mail app.
    if (!key) {
      const body = `Name: ${name}\nEmail: ${email}\nHiring for: ${type}\n\n${message}`;
      window.location.href = `mailto:${resumeData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setState("success");
      form.reset();
      setTimeout(() => setState("idle"), 5000);
      return;
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: key, name, email, message, subject, hiring_for: type, from_name: "Raza Ali Malik Portfolio" }),
      });
      const data = await res.json();
      setState(data.success ? "success" : "error");
      if (data.success) form.reset();
    } catch {
      setState("error");
    }
    setTimeout(() => setState("idle"), 5000);
  };

  return { state, submit };
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(resumeData.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${resumeData.email}`;
    }
  };

  return (
    <button type="button" onClick={copy} className="cursor-target" data-cursor-label={copied ? "copied!" : "copy"} style={{ all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 14, maxWidth: "100%" }}>
      <span className="display link" style={{ fontSize: "clamp(19px,2.6vw,32px)", overflowWrap: "anywhere", paddingBottom: 4 }}>
        {resumeData.email}
      </span>
      <span style={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 14, flexShrink: 0, border: "1px solid var(--line2)", color: copied ? "var(--ok)" : "var(--ink)", transition: "color .2s" }}>
        {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
      </span>
    </button>
  );
}

export function Contact() {
  const { state, submit } = useContactForm();
  const label = { idle: "Send message", sending: "Sending…", success: "Sent, talk soon", error: "Didn\u2019t send. Try email?" }[state];

  return (
    <section className="sec" id="contact">
      <div className="wrap">
        <Reveal>
          <span className="eyebrow">Contact</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="h2" style={{ fontSize: "clamp(40px,6.4vw,88px)", margin: "20px 0 28px" }}>
            Let's build
            <br />
            <span className="serif">something good.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1} style={{ marginBottom: 56 }}>
          <CopyEmail />
        </Reveal>

        <div className="contact-grid">
          <Reveal className="card" style={{ padding: "clamp(22px,3vw,36px)" }}>
            <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
                <input className="field" name="name" placeholder="Your name" required autoComplete="name" />
                <input className="field" name="email" type="email" placeholder="you@company.com" required autoComplete="email" />
              </div>
              <select className="field" name="hiring_for" defaultValue="Full-time role">
                <option>Full-time role</option>
                <option>Contract project</option>
                <option>Just saying hi</option>
              </select>
              <textarea className="field" name="message" rows={5} placeholder="What are you building?" required style={{ resize: "vertical" }} />
              <Magnet padding={40} magnetStrength={4} maxOffset={8} style={{ display: "block" }}>
                <button type="submit" className="btn btn-primary cursor-target" data-cursor-label="send" disabled={state === "sending"} style={{ width: "100%", justifyContent: "center" }}>
                  {label} {state === "idle" && <FiSend />}
                </button>
              </Magnet>
            </form>
          </Reveal>

          <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
            <Reveal delay={0.08} className="card" style={{ padding: 28 }}>
              <div className="k" style={{ marginBottom: 14 }}>Open to</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {resumeData.availability.modes.map((m) => (
                  <span key={m} className="chip"><span className="live-dot" /> {m}</span>
                ))}
              </div>
              <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.6, margin: "16px 0 0" }}>{resumeData.timezone}</p>
            </Reveal>
            <Reveal delay={0.14} className="card" style={{ padding: 28 }}>
              <div className="k" style={{ marginBottom: 14 }}>Elsewhere</div>
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  { href: resumeData.linkedinUrl, icon: <FiLinkedin />, text: "LinkedIn" },
                  { href: resumeData.githubUrl, icon: <FiGithub />, text: "GitHub" },
                  ...resumeData.resumeDownloads.map((r) => ({ href: r.file, icon: <FiDownload />, text: r.label.replace("Download ", ""), download: true })),
                ].map((l) => (
                  <a
                    key={l.text}
                    href={l.href}
                    target={l.download ? undefined : "_blank"}
                    rel="noreferrer"
                    download={l.download || undefined}
                    className="cursor-target"
                    data-cursor-label={l.download ? "download" : "open"}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--line)", color: "var(--ink)", textDecoration: "none", fontSize: 15 }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>{l.icon} {l.text}</span>
                    <FiArrowUpRight style={{ color: "var(--dim)" }} />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer style={{ position: "relative", padding: "40px 0 150px", borderTop: "1px solid var(--line)", overflow: "hidden" }}>
      <div className="wrap" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 40 }}>
        <span className="mono" style={{ color: "var(--dim)", fontSize: 12 }}>
          © {new Date().getFullYear()} {resumeData.name} · built with React, Framer Motion & React Bits
        </span>
        <a href="#top" className="btn btn-ghost cursor-target" data-cursor-label="up!" style={{ height: 42, fontSize: 13 }}>
          Back to top <FiArrowUp />
        </a>
      </div>
      <div className="footer-name" aria-hidden="true">RAZA ALI</div>
    </footer>
  );
}
