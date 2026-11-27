import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { FiArrowUpRight, FiPlus } from "react-icons/fi";
import resumeData from "../../utils/resumeData";
import { getScreenshotUrl } from "../../utils/screenshot";
import { AutoProjectImage } from "../../components/AutoProjectImage";
import { SectionHead } from "../parts";
import { usePointerFine } from "../../hooks/usePointerFine";

const projects = resumeData.experience[0].projects;
const EASE = [0.22, 1, 0.36, 1];

function Screenshot({ project }) {
  const [failed, setFailed] = useState(false);
  if (!project.url || failed) return <AutoProjectImage name={project.name} tech={project.tech} />;
  return <img src={getScreenshotUrl(project.url)} alt={`${project.name} preview`} loading="lazy" onError={() => setFailed(true)} />;
}

/** A screenshot card that trails the cursor while it's over the project list. */
function FloatingPreview({ project }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX + 28);
      y.set(e.clientY - 110);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="work-preview"
          style={{ x: sx, y: sy }}
          initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotate: 3 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={project.name}
              style={{ position: "absolute", inset: 0 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <Screenshot project={project} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Work() {
  const fine = usePointerFine();
  const [hovered, setHovered] = useState(null);
  const [open, setOpen] = useState(0);

  return (
    <section className="sec" id="work">
      <div className="wrap">
        <SectionHead
          eyebrow="Selected work"
          title="Six production builds,"
          accent="owned end to end."
          lead="Logistics, fintech, sports and clinic management, mostly as the sole or lead engineer. Hover a project for a peek, and click it for the details."
        />

        <div className="work-list" onPointerLeave={() => setHovered(null)}>
          {projects.map((p, i) => {
            const isOpen = open === i;
            return (
              <div key={p.name}>
                <button
                  type="button"
                  className="work-row"
                  aria-expanded={isOpen}
                  onPointerEnter={() => fine && !isOpen && setHovered(p)}
                  onPointerLeave={() => setHovered(null)}
                  onClick={() => {
                    setOpen(isOpen ? -1 : i);
                    setHovered(null);
                  }}
                >
                  <span className="mono" style={{ color: "var(--dim)", fontSize: 12 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ minWidth: 0 }}>
                    <h3 className="work-title">{p.name}</h3>
                    <span style={{ display: "block", color: "var(--muted)", fontSize: 14, marginTop: 6 }}>{p.description}</span>
                  </span>
                  <span className="work-meta">
                    {p.tech.slice(0, 3).map((t) => (
                      <span key={t} className="chip" style={{ fontSize: 12, padding: "4px 10px" }}>{t}</span>
                    ))}
                  </span>
                  <motion.span className="arrow" animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.35, ease: EASE }} style={{ display: "grid", placeItems: "center" }}>
                    <FiPlus size={20} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      style={{ overflow: "hidden", borderBottom: "1px solid var(--line)" }}
                    >
                      <div className="detail">
                        <div>
                          {p.role && <div className="k" style={{ marginBottom: 14 }}>{p.role}{p.flagship ? " · Flagship" : ""}</div>}
                          {p.problem && <p style={{ color: "var(--soft)", fontSize: 15, lineHeight: 1.65, margin: "0 0 18px" }}>{p.problem}</p>}
                          {p.metrics.map((m, mi) => (
                            <div className="metric" key={mi}>
                              <b>{String(mi + 1).padStart(2, "0")}</b>
                              <span>{m}</span>
                            </div>
                          ))}
                          {p.url && (
                            <a href={p.url} target="_blank" rel="noreferrer" className="btn btn-ghost cursor-target" data-cursor-label="open" style={{ marginTop: 22, height: 40, fontSize: 13.5 }}>
                              Visit live site <FiArrowUpRight />
                            </a>
                          )}
                        </div>
                        <div className="shot">
                          <Screenshot project={p} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
      {fine && <FloatingPreview project={hovered} />}
    </section>
  );
}
