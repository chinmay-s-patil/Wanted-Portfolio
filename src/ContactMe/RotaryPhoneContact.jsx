import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ViewportScaleStage from "../common/ViewportScaleStage";
import "./RotaryPhoneContact.css";

const CONTACTS = [
  { num: 1, label: "LinkedIn", url: "https://www.linkedin.com/in/chinmay-shashikant-patil/" },
  { num: 2, label: "GitHub", url: "https://github.com/chinmay-s-patil" },
  { num: 3, label: "Email", url: "mailto:patil.chinmay3031@gmail.com" },
  { num: 4, label: "LinkTree", url: "https://linktr.ee/chindoessims" },
  { num: 5, label: "YouTube", url: "https://www.youtube.com/@ChinDoesSims" },
];

const CONTACT_BY_NUM = Object.fromEntries(CONTACTS.map((c) => [c.num, c]));

/**
 * Angles are clockwise from 12 o'clock.
 *
 * Finger stop sits near 4–5 o'clock. Digit 0 rests *clockwise past* it
 * (under / at the bottom of the stop), so angle(0) > FINGER_STOP.
 * Dialing spins the wheel clockwise until that hole lands on FINGER_STOP
 * (just above the stop).
 */
const FINGER_STOP = 130;
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const HOLE_ANGLES = {
  1: 58,
  2: 29,
  3: 0,
  4: 331,
  5: 301,
  6: 272,
  7: 243,
  8: 213,
  9: 184,
  0: 155, // clockwise of the stop — under it at rest
};

const HOLE_RADIUS = 37;

/** Clockwise degrees so this hole lands on the finger-stop face. */
const travelToStop = (holeAngle) => (FINGER_STOP - holeAngle + 360) % 360;

const polar = (angleDeg, radiusPct) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: 50 + radiusPct * Math.cos(rad),
    y: 50 + radiusPct * Math.sin(rad),
  };
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function RotaryPhoneContact() {
  const navigate = useNavigate();
  const maskId = useId().replace(/:/g, "");
  const wheelRef = useRef(null);
  const [dialing, setDialing] = useState(false);
  const [connected, setConnected] = useState(null);
  const busy = useRef(false);

  // Drag interaction state
  const isDragging = useRef(false);
  const dragStartAngle = useRef(0);
  const currentRotation = useRef(0);
  const grabbedDigitRef = useRef(null);

  useEffect(() => {
    const root = document.getElementById("root");
    const prev = {
      bodyDisplay: document.body.style.display,
      bodyJustify: document.body.style.justifyContent,
      bodyAlign: document.body.style.alignItems,
      rootWidth: root?.style.width ?? "",
      rootMaxWidth: root?.style.maxWidth ?? "",
      rootMargin: root?.style.margin ?? "",
    };

    document.body.style.display = "block";
    document.body.style.justifyContent = "";
    document.body.style.alignItems = "";
    if (root) {
      root.style.width = "100%";
      root.style.maxWidth = "none";
      root.style.margin = "0";
    }

    return () => {
      document.body.style.display = prev.bodyDisplay;
      document.body.style.justifyContent = prev.bodyJustify;
      document.body.style.alignItems = prev.bodyAlign;
      if (root) {
        root.style.width = prev.rootWidth;
        root.style.maxWidth = prev.rootMaxWidth;
        root.style.margin = prev.rootMargin;
      }
    };
  }, []);

  const spinWheel = useCallback(async (degrees) => {
    const el = wheelRef.current;
    if (!el || degrees <= 0) return;

    el.getAnimations().forEach((anim) => anim.cancel());

    // Wind roughly tracks real dial feel: farther holes take longer
    const windMs = Math.max(280, 160 + degrees * 2.8);
    const returnMs = Math.max(420, 260 + degrees * 3.6);

    const wind = el.animate(
      [
        { transform: "rotate(0deg)" },
        { transform: `rotate(${degrees}deg)` },
      ],
      {
        duration: windMs,
        easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
      }
    );
    await wind.finished;
    el.style.transform = `rotate(${degrees}deg)`;
    await wait(120);

    const ret = el.animate(
      [
        { transform: `rotate(${degrees}deg)` },
        { transform: "rotate(0deg)" },
      ],
      {
        duration: returnMs,
        easing: "cubic-bezier(0.22, 0.8, 0.28, 1)",
      }
    );
    await ret.finished;
    el.style.transform = "rotate(0deg)";
    el.getAnimations().forEach((anim) => anim.cancel());
  }, []);

  const handleDial = async (num) => {
    const contact = CONTACT_BY_NUM[num];
    if (!contact || busy.current) return;

    busy.current = true;
    setDialing(true);
    setConnected(null);

    try {
      await spinWheel(travelToStop(HOLE_ANGLES[num]));
      setConnected(contact);
    } finally {
      setDialing(false);
      busy.current = false;
    }
  };

  const handleGlobalPointerMove = useCallback((e) => {
    if (!isDragging.current || !wheelRef.current) return;

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    let diff = angle - dragStartAngle.current;

    while (diff < -180) diff += 360;
    while (diff > 180) diff -= 360;

    // Rotary phone wheel can only turn CLOCKWISE
    const clampedRot = Math.max(0, Math.min(340, diff));
    currentRotation.current = clampedRot;

    wheelRef.current.style.transform = `rotate(${clampedRot}deg)`;
  }, []);

  const handleGlobalPointerUp = useCallback(async (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    window.removeEventListener("pointermove", handleGlobalPointerMove);
    window.removeEventListener("pointerup", handleGlobalPointerUp);
    window.removeEventListener("pointercancel", handleGlobalPointerUp);

    const finalRot = currentRotation.current;
    const grabbed = grabbedDigitRef.current;

    if (finalRot > 18) {
      busy.current = true;
      setDialing(true);

      let matchedDigit = null;

      if (grabbed !== null && CONTACT_BY_NUM[grabbed]) {
        const needed = travelToStop(HOLE_ANGLES[grabbed]);
        if (finalRot >= needed * 0.55) {
          matchedDigit = grabbed;
        }
      }

      if (matchedDigit === null) {
        let minDiff = Infinity;
        for (const d of [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]) {
          const needed = travelToStop(HOLE_ANGLES[d]);
          const diff = Math.abs(finalRot - needed);
          if (diff < minDiff) {
            minDiff = diff;
            matchedDigit = d;
          }
        }
      }

      const contact = CONTACT_BY_NUM[matchedDigit];

      // Mechanical spring return animation
      const el = wheelRef.current;
      if (el) {
        el.getAnimations().forEach((anim) => anim.cancel());
        const returnMs = Math.max(350, 200 + finalRot * 3.2);
        const ret = el.animate(
          [
            { transform: `rotate(${finalRot}deg)` },
            { transform: "rotate(0deg)" },
          ],
          {
            duration: returnMs,
            easing: "cubic-bezier(0.22, 0.8, 0.28, 1)",
          }
        );
        await ret.finished;
        el.style.transform = "rotate(0deg)";
        el.getAnimations().forEach((anim) => anim.cancel());
      }

      if (contact) {
        setConnected(contact);
      }

      setDialing(false);
      busy.current = false;
    } else {
      if (wheelRef.current) {
        wheelRef.current.style.transform = "rotate(0deg)";
        wheelRef.current.getAnimations().forEach((anim) => anim.cancel());
      }
    }
  }, [handleGlobalPointerMove]);

  // Pointer drag handlers for rotary wheel
  const handlePointerDown = (e, digit = null) => {
    if (busy.current || dialing) return;
    const wheelEl = wheelRef.current;
    if (!wheelEl) return;

    // Cancel existing animations so inline style.transform works 100%
    wheelEl.getAnimations().forEach((anim) => anim.cancel());

    const rect = wheelEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    
    isDragging.current = true;
    dragStartAngle.current = angle;
    currentRotation.current = 0;
    grabbedDigitRef.current = digit;

    window.addEventListener("pointermove", handleGlobalPointerMove);
    window.addEventListener("pointerup", handleGlobalPointerUp);
    window.addEventListener("pointercancel", handleGlobalPointerUp);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
      window.removeEventListener("pointercancel", handleGlobalPointerUp);
    };
  }, [handleGlobalPointerMove, handleGlobalPointerUp]);

  const openLink = () => {
    if (!connected) return;
    window.open(connected.url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="rotary-section" aria-label="Contact">
      {/* Back to Hub Button */}
      <button
        type="button"
        className="rotary-back-btn"
        onClick={() => navigate("/hub")}
        aria-label="Back to Office"
      >
        ← Back to Office
      </button>

      {/* SVG Grain Overlay */}
      <svg className="rotary-noise-overlay" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="rotaryGritFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#rotaryGritFilter)" />
      </svg>

      {/* Overhead Spotlight Cone */}
      <div className="rotary-spotlight" aria-hidden="true" />

      <div className="rotary-stage">
        <header className="rotary-header">
          <p className="rotary-eyebrow">CENTRAL TELECOM EXCHANGE • DIRECTORY BAY</p>
          <h1 className="rotary-title">GET IN TOUCH</h1>
          <p className="rotary-sub">Spin the rotary dial to dispatch a signal.</p>
        </header>

        <div className="phone-mount">
          <div className="wall-plate" aria-hidden="true">
            <span className="wall-rivet wall-rivet-tl" />
            <span className="wall-rivet wall-rivet-tr" />
            <span className="wall-rivet wall-rivet-bl" />
            <span className="wall-rivet wall-rivet-br" />
          </div>

          <div className="phone-unit">
            <div className="handset-assembly" aria-hidden="true">
              <div className="cradle-arm" />
              <div className="handset">
                <div className="handset-ear">
                  <div className="ear-grille" />
                </div>
                <div className="handset-neck" />
                <div className="handset-mouth">
                  <div className="mouth-grille" />
                </div>
              </div>
              <svg className="coiled-cord" viewBox="0 0 60 220" preserveAspectRatio="none">
                <path
                  d="M30 0
                     C 55 12, 5 24, 30 36
                     C 55 48, 5 60, 30 72
                     C 55 84, 5 96, 30 108
                     C 55 120, 5 132, 30 144
                     C 55 156, 5 168, 30 180
                     C 55 192, 15 204, 30 216"
                  fill="none"
                  stroke="#4a3e2e"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="phone-chassis">
              <div className="chassis-shine" aria-hidden="true" />
              
              <div className="coin-slots-header" aria-hidden="true">
                <span className="coin-instruction">INSERT COIN OR DIAL OPERATOR</span>
                <div className="coin-slots">
                  <div className="coin-slot-unit">
                    <span className="coin-val">10¢</span>
                    <span className="coin-hole" />
                  </div>
                  <div className="coin-slot-unit">
                    <span className="coin-val">25¢</span>
                    <span className="coin-hole" />
                  </div>
                  <div className="coin-slot-unit">
                    <span className="coin-val">50¢</span>
                    <span className="coin-hole" />
                  </div>
                </div>
              </div>

              <div className="dial-assembly">
                <div className="dial-bezel">
                  <div className="number-plate">
                    {DIGITS.map((d) => {
                      const { x, y } = polar(HOLE_ANGLES[d], HOLE_RADIUS);
                      const live = Boolean(CONTACT_BY_NUM[d]);
                      return (
                        <div
                          key={`label-${d}`}
                          className={`dial-label ${live ? "is-live" : "is-dead"}`}
                          style={{ left: `${x}%`, top: `${y}%` }}
                        >
                          <span className="dial-label-num">{d}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div
                    ref={wheelRef}
                    className={`finger-wheel ${dialing ? "is-dialing" : ""}`}
                    onPointerDown={(e) => handlePointerDown(e, null)}
                  >
                    <svg className="finger-wheel-disc" viewBox="0 0 100 100" aria-hidden="true">
                      <defs>
                        <mask id={maskId}>
                          <rect width="100" height="100" fill="white" />
                          {DIGITS.map((d) => {
                            const { x, y } = polar(HOLE_ANGLES[d], HOLE_RADIUS);
                            return (
                              <circle key={`mask-${d}`} cx={x} cy={y} r="7" fill="black" />
                            );
                          })}
                          <circle cx="50" cy="50" r="12" fill="black" />
                        </mask>
                      </defs>
                      <circle
                        cx="50"
                        cy="50"
                        r="49"
                        fill="#1a1a1a"
                        mask={`url(#${maskId})`}
                      />
                    </svg>

                    {DIGITS.map((d) => {
                      const { x, y } = polar(HOLE_ANGLES[d], HOLE_RADIUS);
                      const contact = CONTACT_BY_NUM[d];

                      if (!contact) {
                        return (
                          <span
                            key={d}
                            className="finger-hole is-dead"
                            style={{ left: `${x}%`, top: `${y}%` }}
                            aria-hidden="true"
                          />
                        );
                      }

                      return (
                        <button
                          key={d}
                          type="button"
                          className="finger-hole is-live"
                          style={{ left: `${x}%`, top: `${y}%` }}
                          disabled={dialing}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            handlePointerDown(e, d);
                          }}
                          onClick={() => handleDial(d)}
                          aria-label={`Dial ${d} for ${contact.label}`}
                        />
                      );
                    })}

                    <div className="dial-hub" aria-hidden="true" />
                  </div>

                  <div className="finger-stop-layer" aria-hidden="true">
                    <div
                      className="finger-stop"
                      style={{
                        // Sit slightly past the catching face, toward 0
                        left: `${polar(FINGER_STOP + 8, 44).x}%`,
                        top: `${polar(FINGER_STOP + 8, 44).y}%`,
                        ["--stop-angle"]: `${FINGER_STOP + 8}deg`,
                      }}
                    >
                      <svg className="finger-stop-svg" viewBox="0 0 40 56" preserveAspectRatio="xMidYMid meet">
                        <defs>
                          <linearGradient id="stopMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#d4af37" />
                            <stop offset="35%" stopColor="#aa8c2c" />
                            <stop offset="70%" stopColor="#77611e" />
                            <stop offset="100%" stopColor="#443711" />
                          </linearGradient>
                        </defs>
                        <rect x="14" y="0" width="14" height="11" rx="2" fill="url(#stopMetal)" />
                        <path
                          d="M17 9
                             C 14 16, 11 24, 11 32
                             C 11 40, 14 46, 20 50
                             C 24 53, 30 52, 33 47
                             L 29 44
                             C 27 47, 23 47, 21 45
                             C 17 42, 16 37, 16 32
                             C 16 26, 18 19, 22 13
                             Z"
                          fill="url(#stopMetal)"
                          stroke="#2a220a"
                          strokeWidth="0.7"
                        />
                        <path
                          d="M21 12 C 18 20, 17 28, 18 36"
                          fill="none"
                          stroke="rgba(255,235,170,0.5)"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`info-plaque ${connected ? "has-connection" : ""}`}>
                <div className="plaque-frame">
                  <span className="plaque-rivet plaque-rivet-tl" />
                  <span className="plaque-rivet plaque-rivet-tr" />
                  <span className="plaque-rivet plaque-rivet-bl" />
                  <span className="plaque-rivet plaque-rivet-br" />

                  {!connected ? (
                    <>
                      <p className="plaque-title">EXCHANGE DIRECTORY</p>
                      <ul className="plaque-list">
                        {CONTACTS.map((c) => (
                          <li key={c.num}>
                            <em>{c.num}</em>
                            <span>{c.label}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="plaque-hint">DIAL AN AMBER DIGIT TO CONNECT</p>
                    </>
                  ) : (
                    <div className="plaque-connected">
                      <p className="plaque-status">⚡ LINE ESTABLISHED ⚡</p>
                      <p className="plaque-dest">{connected.label}</p>
                      <p className="plaque-digit">STATION № {connected.num}</p>
                      <button type="button" className="plaque-connect" onClick={openLink}>
                        CONNECT TO STATION →
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="coin-return">
                <div className="return-slot" aria-hidden="true" />
                <button
                  type="button"
                  className="return-door"
                  onClick={() => setConnected(null)}
                  title="Release coin to return to directory list"
                  aria-label="Release coin to return to directory list"
                >
                  <span className="return-label">COIN RELEASE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
