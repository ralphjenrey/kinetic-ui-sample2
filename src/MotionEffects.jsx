import { useEffect, useRef } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const motionQuery = '(min-width: 861px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

// The Kinetic UI reference patterns, adapted for React with complete teardown.
export default function MotionEffects({ revision, suspended }) {
  const cursor = useRef(null);
  const dot = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    const media = matchMedia(motionQuery);
    let dispose = () => {};
    function configure() {
      dispose();
      if (!media.matches || suspended) return;

      const root = document.documentElement;
      const ring = cursor.current;
      const point = dot.current;
      const hero = document.querySelector('.hero');
      const layers = [
        ...[...document.querySelectorAll('.architecture-node')].map((el, i) => ({ el, anchor: hero, speed: [.12, -.09, .18][i], limit: 24, hero: true })),
        ...[...document.querySelectorAll('.project-grid .project')].map((el, i) => ({ el, anchor: el.closest('.project-grid'), speed: [.045, -.04, .035][i % 3], limit: 16 })),
        ...[...document.querySelectorAll('.section-heading h2, .about-title h2')].map(el => ({ el, anchor: el.closest('section'), speed: .025, limit: 10 })),
      ];
      layers.forEach(({ el }) => el.classList.add('parallax-layer'));
      root.classList.add('wheel-easing');
      let parallaxFrame = 0, wheelFrame = 0, cursorFrame = 0;
      let targetScroll = scrollY, lastScroll = scrollY, lastTime = 0;
      let visible = false, initialized = false, hovered = null;
      let pointer = { x: 0, y: 0 };
      let follower = { x: 0, y: 0, width: 38, height: 38, radius: 999 };

      function updateLayers() {
        parallaxFrame = 0;
        if (document.hidden) return;
        // Read untransformed anchors first, then write composable translations.
        const positions = layers.map(layer => {
          const rect = layer.anchor.getBoundingClientRect();
          const distance = layer.hero ? -rect.top : innerHeight * .5 - (rect.top + rect.height * .5);
          return clamp(distance * layer.speed, -layer.limit, layer.limit);
        });
        layers.forEach(({ el }, i) => el.style.setProperty('--parallax-y', `${positions[i].toFixed(2)}px`));
      }
      function scheduleLayers() {
        if (!parallaxFrame && !document.hidden) parallaxFrame = requestAnimationFrame(updateLayers);
      }
      function stopWheel() {
        cancelAnimationFrame(wheelFrame);
        wheelFrame = 0;
        lastTime = 0;
        targetScroll = lastScroll = scrollY;
      }
      function easeWheel(time) {
        const dt = lastTime ? Math.min(time - lastTime, 40) : 16;
        lastTime = time;
        const limit = Math.max(0, root.scrollHeight - innerHeight);
        targetScroll = clamp(targetScroll, 0, limit);
        const next = scrollY + (targetScroll - scrollY) * (1 - Math.exp(-dt / 110));
        window.scrollTo({ top: Math.abs(targetScroll - next) < .5 ? targetScroll : next, behavior: 'instant' });
        lastScroll = scrollY;
        if (Math.abs(targetScroll - scrollY) > .5) wheelFrame = requestAnimationFrame(easeWheel);
        else stopWheel();
      }
      function onWheel(event) {
        if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || document.querySelector('dialog[open]')) return;
        // Let nested scroll regions and native controls handle their own gestures.
        for (let el = event.target; el instanceof Element && el !== document.body; el = el.parentElement) {
          if (el.matches('input, textarea, select, [contenteditable="true"]') || (/(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight)) return;
        }
        const delta = event.deltaY * (event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? innerHeight : 1);
        if (!delta) return;
        if (!wheelFrame) targetScroll = scrollY;
        const next = clamp(targetScroll + delta, 0, Math.max(0, root.scrollHeight - innerHeight));
        if (next === targetScroll && !wheelFrame) return;
        event.preventDefault();
        targetScroll = next;
        if (!wheelFrame) wheelFrame = requestAnimationFrame(easeWheel);
      }
      function onScroll() {
        if (wheelFrame && Math.abs(scrollY - lastScroll) > 2) stopWheel();
        scheduleLayers();
      }
      function hideCursor() {
        visible = false;
        initialized = false;
        ring.classList.remove('is-visible');
        point.classList.remove('is-visible');
        root.classList.remove('custom-pointer');
        cancelAnimationFrame(cursorFrame);
        cursorFrame = 0;
      }
      function drawCursor() {
        cursorFrame = 0;
        if (!visible) return;
        const project = hovered?.matches('.project-open');
        const bounds = hovered && !project ? hovered.getBoundingClientRect() : null;
        const width = bounds ? bounds.width + 14 : project ? 66 : 38;
        const height = bounds ? bounds.height + 12 : width;
        const x = bounds ? bounds.left + bounds.width / 2 : pointer.x;
        const y = bounds ? bounds.top + bounds.height / 2 : pointer.y;
        const radius = bounds ? parseFloat(getComputedStyle(hovered).borderRadius) + 7 : 999;
        follower.x += (x - follower.x) * .18;
        follower.y += (y - follower.y) * .18;
        follower.width += (width - follower.width) * .2;
        follower.height += (height - follower.height) * .2;
        follower.radius = radius;
        ring.style.transform = `translate3d(${follower.x - follower.width / 2}px, ${follower.y - follower.height / 2}px, 0)`;
        ring.style.width = `${follower.width}px`;
        ring.style.height = `${follower.height}px`;
        ring.style.borderRadius = `${radius}px`;
        point.style.transform = `translate3d(${pointer.x - 3}px, ${pointer.y - 3}px, 0)`;
        ring.classList.toggle('is-project', Boolean(project));
        label.current.textContent = project ? 'View' : '';
        if (Math.abs(x - follower.x) + Math.abs(y - follower.y) + Math.abs(width - follower.width) + Math.abs(height - follower.height) > .2) cursorFrame = requestAnimationFrame(drawCursor);
      }
      function moveCursor(event) {
        if (event.pointerType !== 'mouse') { hideCursor(); return; }
        pointer = { x: event.clientX, y: event.clientY };
        hovered = event.target.closest('a, button, input, textarea, select, summary');
        if (!initialized) { follower.x = pointer.x; follower.y = pointer.y; initialized = true; }
        visible = true;
        root.classList.add('custom-pointer');
        ring.classList.add('is-visible');
        point.classList.add('is-visible');
        if (!cursorFrame) cursorFrame = requestAnimationFrame(drawCursor);
      }
      function press() { stopWheel(); ring.classList.add('is-pressed'); }
      function release() { ring.classList.remove('is-pressed'); }
      function keydown() { stopWheel(); hideCursor(); }
      function resize() { stopWheel(); scheduleLayers(); }
      function visibility() { stopWheel(); hideCursor(); if (!document.hidden) scheduleLayers(); }
      const observer = new ResizeObserver(resize);
      observer.observe(document.body);
      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', resize);
      window.addEventListener('hashchange', stopWheel);
      window.addEventListener('pointermove', moveCursor);
      window.addEventListener('pointerdown', press);
      window.addEventListener('pointerup', release);
      window.addEventListener('keydown', keydown);
      window.addEventListener('blur', visibility);
      document.documentElement.addEventListener('pointerleave', hideCursor);
      document.addEventListener('visibilitychange', visibility);
      scheduleLayers();

      dispose = () => {
        stopWheel(); hideCursor(); cancelAnimationFrame(parallaxFrame);
        observer.disconnect();
        root.classList.remove('wheel-easing');
        layers.forEach(({ el }) => { el.classList.remove('parallax-layer'); el.style.removeProperty('--parallax-y'); });
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', resize);
        window.removeEventListener('hashchange', stopWheel);
        window.removeEventListener('pointermove', moveCursor);
        window.removeEventListener('pointerdown', press);
        window.removeEventListener('pointerup', release);
        window.removeEventListener('keydown', keydown);
        window.removeEventListener('blur', visibility);
        document.documentElement.removeEventListener('pointerleave', hideCursor);
        document.removeEventListener('visibilitychange', visibility);
        ring.classList.remove('is-pressed', 'is-project');
      };
    }
    configure();
    media.addEventListener('change', configure);
    return () => { dispose(); media.removeEventListener('change', configure); };
  }, [revision, suspended]);

  return <><div className="mouse-ring" ref={cursor} aria-hidden="true"><span ref={label}/></div><div className="mouse-dot" ref={dot} aria-hidden="true"/></>;
}
