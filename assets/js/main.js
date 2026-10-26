(() => {
  "use strict";
  const S = window.SITE || {};
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const wide = () => innerWidth > 860;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const root = document.documentElement;

  /* colour of each project (glows, cursor label, case-study accents) */
  const ACCENTS = { nippo: "#ff8a3d", notme: "#6b8cff", soch: "#ffb35c", jewellery: "#ffc24d", urban: "#3ccfff", fight: "#ff4f5e", home: "#ff6fb5" };
  const accentOf = p => p.accent || ACCENTS[p.id] || "#ff3d8b";

  /* ---------- YouTube / Vimeo link -> embed ---------- */
  function embedFor(url) {
    if (!url) return null;
    const value = String(url).trim();
    const yt = id => ({ src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`, vertical: /\/shorts\//i.test(value) });
    if (/^[\w-]{11}$/.test(value)) return yt(value);
    let u;
    try { u = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`); } catch { return null; }
    const host = u.hostname.toLowerCase().replace(/^www\.|^m\./, "");
    if (host === "youtu.be") { const id = u.pathname.split("/").filter(Boolean)[0]; if (/^[\w-]{11}$/.test(id || "")) return yt(id); }
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const id = u.searchParams.get("v") || (u.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/) || [])[1];
      if (/^[\w-]{11}$/.test(id || "")) return yt(id);
    }
    if (host.endsWith("vimeo.com")) {
      const id = (u.pathname.match(/\/(?:video\/)?(\d+)/) || [])[1];
      if (id) return { src: `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`, vertical: false };
    }
    return null;
  }

  /* =====================================================================
     TEXT SPLITTING
     ===================================================================== */
  // hero name -> letters
  $$("[data-chars]").forEach((el, li) => {
    const t = el.textContent;
    el.textContent = "";
    [...t].forEach((c, i) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = c;
      s.style.transitionDelay = `${120 + li * 140 + i * 50}ms`;
      el.appendChild(s);
    });
  });
  // big titles -> masked words (keeps <em> styling)
  $$("[data-split-words]").forEach(el => {
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    let k = 0;
    const out = [];
    el.childNodes.forEach(n => {
      const isEm = n.nodeType === 1;
      n.textContent.split(/\s+/).filter(Boolean).forEach(w => {
        const inner = isEm ? `<em>${esc(w)}</em>` : esc(w);
        out.push(`<span class="sw" aria-hidden="true"><span style="transition-delay:${k++ * 90}ms">${inner}</span></span>`);
      });
    });
    el.innerHTML = out.join(" ");
  });
  // nav links -> rolling text
  $$("[data-hover-text]").forEach(a => {
    const t = esc(a.textContent);
    a.innerHTML = `<span class="roll"><span>${t}</span><span aria-hidden="true">${t}</span></span>`;
  });
  // stagger the hero fades
  $$(".hero .fade").forEach((el, i) => el.style.setProperty("--fd", i));

  /* =====================================================================
     LOADER
     ===================================================================== */
  const bar = $(".loader__bar i"), pctEl = $("[data-pct]");
  let pct = 0, fontsReady = false;
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { fontsReady = true; });
  setTimeout(() => { fontsReady = true; }, 2500);
  const finishLoad = () => {
    document.body.classList.add("is-loaded");
    document.body.classList.remove("is-loading");
    setTimeout(() => $$(".hero__name .ch").forEach(c => c.style.transitionDelay = "0ms"), 1900);
    startRotator();
  };
  const tick = () => {
    const cap = fontsReady ? 100 : 86;
    pct = Math.min(cap, pct + 4 + Math.random() * 7);
    bar.style.width = pct + "%";
    pctEl.textContent = Math.round(pct);
    if (pct < 100) setTimeout(tick, reduce ? 0 : 28);
    else setTimeout(finishLoad, reduce ? 0 : 220);
  };
  tick();

  /* =====================================================================
     SMOOTH SCROLL (desktop)
     ===================================================================== */
  let lenis = null;
  if (window.Lenis && fine && !reduce) {
    lenis = new window.Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const scrollToEl = (target) => {
    if (lenis) lenis.scrollTo(target, { offset: target === 0 ? 0 : -10, duration: 1.4 });
    else if (target === 0) scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id === "#" ) return;
    const el = id === "#top" ? 0 : $(id);
    if (el === null) return;
    e.preventDefault();
    if (document.body.classList.contains("menu-open")) setMenu(false);
    scrollToEl(el);
  });

  /* =====================================================================
     PROJECT ROWS
     ===================================================================== */
  const projects = S.projects || [];
  const wrap = $("[data-projects]");
  const count = $("[data-proj-count]");
  if (count) count.textContent = String(projects.length).padStart(2, "0");
  projects.forEach((p, i) => {
    const row = document.createElement("article");
    const vertical = !!(p.vertical || /\/shorts\//i.test(p.video || ""));
    row.className = "proj reveal" + (i === 0 ? " is-active" : "");
    row.dataset.proj = i;
    row.dataset.cursor = "View project";
    row.style.setProperty("--acc", accentOf(p));
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-label", `Open ${p.title} project overview`);
    row.innerHTML = `
      <div class="proj__head"><h3 class="proj__title"><span class="proj__num">${String(i + 1).padStart(2, "0")}</span><span class="tt">${esc(p.title)}</span></h3><span class="proj__go">View project <span aria-hidden="true">→</span></span></div>
      <div class="proj__meta">
        <div><span>Type</span><b>${esc(p.type)}</b></div>
        <div><span>For</span><b>${esc(p.for)}</b></div>
        <div><span>Role</span><b>${esc(p.role)}</b></div>
      </div>
      <div class="proj__media"><img src="${esc(p.poster)}" alt="${esc(p.title)}" loading="lazy" decoding="async" width="1600" height="900"><video muted loop playsinline preload="none" data-src="${esc(p.preview)}" hidden></video>${vertical ? '<span class="proj__tag">9:16 Social</span>' : ""}</div>`;
    wrap.appendChild(row);
  });
  const rows = $$(".proj");
  const activate = row => {
    rows.forEach(r => {
      const on = r === row;
      r.classList.toggle("is-active", on);
      const v = $("video", r), img = $("img", r);
      if (on && fine && wide() && !reduce) {
        if (!v.getAttribute("src")) v.src = v.dataset.src;
        v.play().then(() => { v.hidden = false; img.hidden = true; }).catch(() => {});
      } else if (!v.paused) v.pause();
    });
  };
  if (fine) rows.forEach(r => {
    r.addEventListener("pointerenter", () => wide() && activate(r));
    r.addEventListener("pointermove", e => {
      const b = r.getBoundingClientRect();
      r.style.setProperty("--rx", `${e.clientX - b.left}px`);
      r.style.setProperty("--ry", `${e.clientY - b.top}px`);
    });
  });
  rows.forEach(r => r.addEventListener("focus", () => wide() && activate(r)));

  /* =====================================================================
     REVEALS, SCRAMBLE, COUNTERS
     ===================================================================== */
  const GLYPHS = "!<>-_\\/[]{}—=+*^?#ABCDEFGHJKLMNOPQRSTUVWXYZ";
  function scramble(el) {
    const final = el.dataset.final || (el.dataset.final = el.textContent);
    if (reduce) return;
    let f = 0;
    const total = 22;
    const step = () => {
      el.textContent = [...final].map((c, i) => {
        if (c === " " || c === "(" || c === ")") return c;
        return i < (f / total) * final.length ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }).join("");
      if (++f <= total) requestAnimationFrame(step); else el.textContent = final;
    };
    step();
  }
  function countUp(el) {
    const to = +el.dataset.count || 0;
    if (reduce || to === 0) { el.textContent = to; return; }
    const t0 = performance.now(), d = 1400;
    const step = t => {
      const k = clamp((t - t0) / d, 0, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add("is-in");
    if (el.hasAttribute("data-scramble")) scramble(el);
    $$("[data-count]", el).forEach(countUp);
    io.unobserve(el);
  }), { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
  let ri = 0;
  $$(".reveal, .fade, [data-split-words], [data-scramble]").forEach(el => {
    if (!el.classList.contains("fade")) el.style.setProperty("--reveal-delay", `${(ri++ % 3) * 80}ms`);
    io.observe(el);
  });

  /* ---------- intro: words fill in as you scroll (*starred* words glow) ---------- */
  const intro = $("[data-words]");
  let inKey = false;
  intro.innerHTML = intro.textContent.trim().split(/\s+/).map(w => {
    const opens = w.startsWith("*"), closes = /\*[^\w]*$/.test(w) && (w.length > 1 || !opens);
    if (opens) inKey = true;
    const isKey = inKey;
    if (closes) inKey = false;
    return `<span class="w${isKey ? " key" : ""}">${esc(w.replace(/\*/g, ""))}</span>`;
  }).join(" ");
  const ws = $$(".w", intro);
  let lastN = -1;

  /* ---------- hero role rotator ---------- */
  function startRotator() {
    const track = $("[data-rotator]");
    if (!track || reduce || track.dataset.on) return;
    track.dataset.on = 1;
    const items = $$("b", track);
    track.appendChild(items[0].cloneNode(true));
    const rot = track.parentElement;
    const fit = i => { rot.style.width = `${(track.children[i] || items[0]).getBoundingClientRect().width}px`; };
    rot.style.transition = "width .8s cubic-bezier(.16,1,.3,1)";
    fit(0);
    let i = 0;
    setInterval(() => {
      i++;
      track.style.transition = "";
      track.style.transform = `translateY(${-i * 1.25}em)`;
      fit(i);
      if (i === items.length) setTimeout(() => {
        track.style.transition = "none";
        track.style.transform = "translateY(0)";
        i = 0;
      }, 820);
    }, 2300);
    addEventListener("resize", () => fit(i));
  }

  /* =====================================================================
     SHOWREEL (lazy loop)
     ===================================================================== */
  const reelFrame = $("[data-reel-frame]"), reelVid = $("[data-reel-video]");
  let reelLoaded = false;
  const loadReel = () => {
    if (reelLoaded || !reelVid) return;
    reelLoaded = true;
    $$("source", reelVid).forEach(s => { s.src = s.dataset.src; });
    reelVid.load();
  };
  const modal = $(".modal");
  if (reelVid) {
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { loadReel(); if (modal.hidden && !reduce) reelVid.play().catch(() => {}); }
      else reelVid.pause();
    }), { threshold: 0.1, rootMargin: "300px 0px" }).observe(reelVid);
    (window.requestIdleCallback || (f => setTimeout(f, 1500)))(loadReel);
  }

  /* =====================================================================
     SCROLL-DRIVEN EFFECTS
     ===================================================================== */
  const skills = $$(".skill"), skillsSec = $(".skills");
  const progress = $(".progress"), nav = $(".nav"), heroPhoto = $("[data-tilt]");
  const strip = $("[data-strip]");
  let lastY = scrollY, vel = 0, ticking = false;

  const onScroll = () => {
    const y = scrollY, vh = innerHeight;
    vel = y - lastY;
    const max = root.scrollHeight - vh;
    progress.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);
    nav.classList.toggle("is-solid", y > 30);
    nav.classList.toggle("is-hidden", vel > 0 && y > vh * 0.8 && !document.body.classList.contains("menu-open"));
    lastY = y;

    const r = intro.getBoundingClientRect();
    if (r.top < vh && r.bottom > 0) {
      const prog = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.3), 0, 1);
      const n = Math.round(prog * ws.length);
      if (n !== lastN) { ws.forEach((w, i) => w.classList.toggle("on", i < n)); lastN = n; }
    }

    let onAcc = null;
    skills.forEach(s => {
      const b = s.getBoundingClientRect();
      const on = b.top < vh * 0.62 && b.bottom > vh * 0.3;
      s.classList.toggle("is-on", on);
      if (on) onAcc = s.style.getPropertyValue("--acc");
    });
    if (onAcc) skillsSec.style.setProperty("--sk", onAcc);

    if (!reduce && wide()) {
      const fr = reelFrame.getBoundingClientRect();
      reelFrame.style.setProperty("--rp", clamp((vh - fr.top) / (vh * 0.8), 0, 1).toFixed(3));
      if (heroPhoto && y < vh * 1.3) heroPhoto.style.setProperty("--py", `${(y * 0.14).toFixed(1)}px`);
    }

    if (!wide() || !fine) {
      let best = null, bd = Infinity;
      rows.forEach(row => { const b = row.getBoundingClientRect(); const d = Math.abs(b.top + b.height / 2 - vh * 0.5); if (d < bd) { bd = d; best = row; } });
      if (best && !best.classList.contains("is-active")) rows.forEach(rw => rw.classList.toggle("is-active", rw === best));
    }
    ticking = false;
  };
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  if (lenis) lenis.on("scroll", queue); else addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  onScroll();

  /* tools strip: always drifting, speeds up with scroll velocity */
  if (strip && !reduce) {
    let x = 0, half = 0, sv = 0;
    const measure = () => { half = strip.scrollWidth / 2; };
    measure(); addEventListener("resize", measure);
    let stripOn = true;
    new IntersectionObserver(es => { stripOn = es[0].isIntersecting; if (stripOn) requestAnimationFrame(loop); }).observe(strip.parentElement);
    const loop = () => {
      if (!stripOn) return;
      sv += (Math.abs(vel) - sv) * 0.08;
      x -= 0.6 + Math.min(sv, 60) * 0.25;
      if (half && x <= -half) x += half;
      strip.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      vel *= 0.9;
      requestAnimationFrame(loop);
    };
  }

  /* =====================================================================
     POINTER EFFECTS (desktop only)
     ===================================================================== */
  if (fine && !reduce) {
    // hero letters pop when touched
    $$(".hero__name .ch").forEach(c => c.addEventListener("pointerenter", () => {
      c.classList.add("is-pop");
      setTimeout(() => c.classList.remove("is-pop"), 420);
    }));
    // hero photo 3D tilt
    if (heroPhoto) {
      heroPhoto.addEventListener("pointermove", e => {
        if (!heroPhoto.classList.contains("is-in")) return;
        const b = heroPhoto.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width - 0.5, yv = (e.clientY - b.top) / b.height - 0.5;
        heroPhoto.style.transition = "transform .5s cubic-bezier(.16,1,.3,1)";
        heroPhoto.style.transform = `perspective(1000px) rotateY(${(x * 8).toFixed(2)}deg) rotateX(${(-yv * 8).toFixed(2)}deg)`;
      });
      heroPhoto.addEventListener("pointerleave", () => { heroPhoto.style.transition = "transform 1s cubic-bezier(.16,1,.3,1)"; heroPhoto.style.transform = ""; });
    }
    // magnetic buttons
    $$(".magnetic, .reel__center").forEach(b => {
      b.addEventListener("pointermove", e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px,${((e.clientY - r.top - r.height / 2) * 0.32).toFixed(1)}px)`;
      });
      b.addEventListener("pointerleave", () => { b.style.transform = ""; });
    });
  }

  /* ---------- living cursor: arrow + comet trail + label ---------- */
  const cursor = $(".cursor"), arrow = $(".cursor__arrow"), label = $("[data-cursor-label]");
  const spot = $(".spot");
  if (fine) {
    const cv = $(".trail"), ctx = cv.getContext("2d");
    let dpr = 1;
    const size = () => { dpr = Math.min(1.5, devicePixelRatio || 1); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); addEventListener("resize", size);

    let mx = -200, my = -200, cx = -200, cy = -200, sx = innerWidth / 2, sy = innerHeight * 0.3;
    let vx = 0, vy = 0, rot = 0, still = 0, running = false;
    const pts = [];
    const MAX = 16;
    const BASE = -135;               // the arrow's natural direction (up-left)
    const wrapDeg = d => ((d + 540) % 360) - 180;

    const frame = () => {
      const dx = mx - cx, dy = my - cy;
      cx += dx * 0.35; cy += dy * 0.35;
      // smoothed velocity -> heading
      vx += (dx - vx) * 0.22; vy += (dy - vy) * 0.22;
      const v = Math.hypot(vx, vy);
      still = v < 0.6 ? still + 1 : 0;
      // gentle, purposeful tilt: only on real movement, limited to ±32° from normal
      let target = 0;
      if (v > 3.5) {
        const raw = wrapDeg(Math.atan2(vy, vx) * 180 / Math.PI - BASE);
        const want = Math.abs(raw) > 150 ? 0 : clamp(raw, -32, 32);   // moving straight "backwards" -> no flip
        target = want * clamp((v - 3.5) / 14, 0, 1);
      }
      rot += (target - rot) * (v > 3.5 ? 0.07 : 0.06);
      cursor.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`;
      arrow.style.transform = `rotate(${rot.toFixed(2)}deg)`;

      // soft spotlight follows lazily (moved, not repainted)
      sx += (mx - sx) * 0.07; sy += (my - sy) * 0.07;
      spot.style.transform = `translate3d(${sx.toFixed(1)}px,${sy.toFixed(1)}px,0)`;

      // comet trail
      if (v > 0.6) { pts.push({ x: cx, y: cy }); if (pts.length > MAX) pts.shift(); }
      else if (pts.length) pts.shift();
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      if (pts.length > 2) {
        ctx.lineCap = "round";
        const now = performance.now() / 18;
        for (let i = 1; i < pts.length; i++) {
          const k = i / pts.length;
          ctx.strokeStyle = `hsla(${(now + i * 10 + 330) % 360},95%,66%,${(k * 0.5).toFixed(3)})`;
          ctx.lineWidth = k * 4.5;
          ctx.beginPath();
          ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
          ctx.lineTo(pts[i].x, pts[i].y);
          ctx.stroke();
        }
      }
      const settled = still > 30 && Math.abs(rot) < 0.4 && !pts.length && Math.abs(mx - sx) < 0.5 && Math.abs(my - sy) < 0.5;
      if (settled) { running = false; return; }
      requestAnimationFrame(frame);
    };
    const wake = () => { if (!running) { running = true; still = 0; requestAnimationFrame(frame); } };

    addEventListener("pointermove", e => {
      mx = e.clientX; my = e.clientY;
      if (cx < -100) { cx = mx; cy = my; }
      wake();
    }, { passive: true });
    document.addEventListener("pointerover", e => {
      const t = e.target;
      const lab = t.closest("[data-cursor]");
      cursor.classList.toggle("is-hover", !!t.closest("a,button,input,select,textarea,label,.proj"));
      if (lab) {
        label.textContent = lab.dataset.cursor;
        const acc = lab.style.getPropertyValue("--acc");
        cursor.style.setProperty("--acc", acc || "#ff3d8b");
        cursor.classList.add("has-label");
      } else cursor.classList.remove("has-label");
    });
    addEventListener("pointerdown", () => cursor.classList.add("is-down"));
    addEventListener("pointerup", () => cursor.classList.remove("is-down"));
    root.addEventListener("pointerleave", () => { cursor.style.opacity = 0; });
    root.addEventListener("pointerenter", () => { cursor.style.opacity = 1; });
  }

  /* =====================================================================
     CASE-STUDY MODAL
     ===================================================================== */
  const player = $("[data-player]"), box = $(".modal__box"), content = $("[data-modal-content]");
  const countEl = $("[data-m-count]"), nextName = $("[data-m-next]");
  let lastFocus = null, current = -1, closeTimer = null;

  function fillPlayer(p) {
    const em = embedFor(p.video);
    player.classList.toggle("is-vertical", !!(p.vertical || (em && em.vertical)));
    player.innerHTML = em
      ? `<span class="yt-wait">Loading film</span><iframe src="${em.src}" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen title="${esc(p.title)}" onload="this.classList.add('is-ready')"></iframe>`
      : `<video src="${esc(p.preview)}" poster="${esc(p.poster)}" controls autoplay loop playsinline></video><span class="modal__note">Preview · full film coming soon</span>`;
  }

  function fill(p, i) {
    fillPlayer(p);
    modal.style.setProperty("--acc", i >= 0 ? accentOf(p) : "#ff3d8b");
    $("[data-m-type]").textContent = p.type || "";
    $("[data-m-title]").textContent = p.title || "";
    $("[data-m-desc]").textContent = p.desc || "";
    $("[data-m-for]").textContent = p.for || "";
    $("[data-m-role]").textContent = p.role || "";
    $("[data-m-for]").parentElement.hidden = !p.for;
    $("[data-m-role]").parentElement.hidden = !p.role;
    const production = $("[data-m-production]");
    production.replaceChildren();
    if (p.production && p.production.length) {
      const heading = document.createElement("p");
      heading.className = "modal__section-label";
      heading.textContent = "How it was made";
      const grid = document.createElement("div");
      grid.className = "modal__details";
      p.production.forEach((item, k) => {
        const card = document.createElement("article");
        card.className = "modal__detail";
        card.style.transitionDelay = `${420 + k * 80}ms`;
        const h = document.createElement("h4"); h.textContent = item.label;
        const t = document.createElement("p"); t.textContent = item.text;
        card.append(h, t);
        grid.appendChild(card);
      });
      production.append(heading, grid);
    }
    const isProj = i >= 0;
    content.hidden = !!p.noInfo;
    $$(".modal__arrow").forEach(b => b.hidden = !isProj);
    countEl.textContent = isProj ? `${String(i + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}` : "Showreel 2026";
    if (isProj) nextName.textContent = projects[(i + 1) % projects.length].title;
    modal.setAttribute("aria-label", p.noInfo ? "Showreel video" : `${p.title} project overview`);
    current = i;
  }

  function openModal(p, i = -1) {
    clearTimeout(closeTimer);
    lastFocus = document.activeElement;
    fill(p, i);
    modal.classList.remove("is-closing", "is-swap");
    modal.hidden = false;
    box.scrollTop = 0;
    if (lenis) lenis.stop();
    document.body.style.overflow = "hidden";
    reelVid && reelVid.pause();
    rows.forEach(r => { const v = $("video", r); v && !v.paused && v.pause(); });
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add("is-open")));
    $(".modal__close").focus({ preventScroll: true });
  }

  function go(step) {
    if (current < 0) return;
    const i = (current + step + projects.length) % projects.length;
    modal.classList.add("is-swap");
    player.innerHTML = "";
    setTimeout(() => {
      box.scrollTop = 0;
      fill(projects[i], i);
      requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.remove("is-swap")));
    }, reduce ? 0 : 320);
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.classList.remove("is-open");
    modal.classList.add("is-closing");
    player.innerHTML = "";
    closeTimer = setTimeout(() => {
      modal.hidden = true;
      modal.classList.remove("is-closing");
      document.body.style.overflow = "";
      if (lenis) lenis.start();
      if (reelVid && reelLoaded && !reduce) {
        const b = reelVid.getBoundingClientRect();
        if (b.bottom > 0 && b.top < innerHeight) reelVid.play().catch(() => {});
      }
      lastFocus && lastFocus.focus({ preventScroll: true });
    }, reduce ? 0 : 700);
  }

  wrap.addEventListener("click", e => { const r = e.target.closest("[data-proj]"); if (r) openModal(projects[+r.dataset.proj], +r.dataset.proj); });
  wrap.addEventListener("keydown", e => { const r = e.target.closest("[data-proj]"); if (r && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openModal(projects[+r.dataset.proj], +r.dataset.proj); } });
  const openReel = () => openModal({ title: "Showreel", noInfo: true, video: S.reel && S.reel.video, preview: S.reel && S.reel.preview, poster: S.reel && S.reel.poster });
  $$("[data-play-reel]").forEach(b => b.addEventListener("click", e => { e.stopPropagation(); openReel(); }));
  reelFrame && reelFrame.addEventListener("click", openReel);
  $$("[data-close]").forEach(b => b.addEventListener("click", closeModal));
  $$("[data-next]").forEach(b => b.addEventListener("click", () => go(1)));
  $$("[data-prev]").forEach(b => b.addEventListener("click", () => go(-1)));
  addEventListener("keydown", e => {
    if (modal.hidden) return;
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if (e.key === "Escape") closeModal();
    else if (e.key === "ArrowRight" && !typing) go(1);
    else if (e.key === "ArrowLeft" && !typing) go(-1);
  });
  let ty = null;
  box.addEventListener("touchstart", e => { ty = box.scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
  box.addEventListener("touchend", e => { if (ty !== null && e.changedTouches[0].clientY - ty > 130) closeModal(); ty = null; }, { passive: true });

  /* =====================================================================
     FORM, MENU, MISC
     ===================================================================== */
  const form = $("[data-form]"), note = $("[data-form-note]");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    if (!d.name || !d.email) { note.textContent = "Please add your name and email."; return; }
    const subject = `${d.reason} — ${d.name}`;
    const body = `${d.message || ""}\n\n— ${d.name}\n${d.email}`;
    location.href = `mailto:${S.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    note.textContent = "Your email app should open now — just press send.";
  });

  const burger = $(".nav__burger"), menu = $(".menu");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    menu.setAttribute("aria-hidden", !open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));

  $$("[data-linkedin]").forEach(a => {
    const ok = S.linkedin && !/your-profile/.test(S.linkedin);
    if (ok) a.href = S.linkedin; else a.hidden = true;
  });
  $("[data-year]").textContent = new Date().getFullYear();
})();
