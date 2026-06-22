import { useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';

// --- Helpers ---
function makeRoundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function makeEnvMap(renderer) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0.00, '#1a1a2e');
  g.addColorStop(0.40, '#5a5a7a');
  g.addColorStop(0.49, '#ffffff');
  g.addColorStop(0.52, '#9a9ab5');
  g.addColorStop(1.00, '#0a0a16');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 256);
  const blob = (cx, cy, rr, col) => {
    const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
    rg.addColorStop(0, col);
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(cx, cy, rr, 0, Math.PI * 2);
    ctx.fill();
  };
  blob(140, 90,  90, 'rgba(255,255,255,0.85)');
  blob(400, 60,  70, 'rgba(180,200,255,0.7)');
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex).texture;
  tex.dispose();
  pmrem.dispose();
  return env;
}

function makeRoundedScreenTexture(img, maxAnisotropy) {
  const iW = img.width, iH = img.height;
  const cr = Math.round(iW * 0.09);
  const cv = document.createElement('canvas');
  cv.width = iW; cv.height = iH;
  const cx = cv.getContext('2d');
  cx.beginPath();
  cx.moveTo(cr, 0);       cx.lineTo(iW - cr, 0);
  cx.quadraticCurveTo(iW, 0,   iW, cr);
  cx.lineTo(iW, iH - cr);
  cx.quadraticCurveTo(iW, iH,  iW - cr, iH);
  cx.lineTo(cr, iH);
  cx.quadraticCurveTo(0,  iH,  0,       iH - cr);
  cx.lineTo(0, cr);
  cx.quadraticCurveTo(0,  0,   cr,      0);
  cx.closePath();
  cx.clip();
  cx.drawImage(img, 0, 0, iW, iH);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAnisotropy;
  return t;
}

export default function IPhone3D({ screenshotSrc }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const phoneRef = useRef(null);
  const rendererRef = useRef(null);
  const rafRef = useRef(0);
  const drag = useRef({ active: false, lastX: 0, lastY: 0, rotY: -0.3, rotX: 0.1, vx: 0, vy: 0 });
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || rendererRef.current) return;
    let mounted = true;

    const W = container.clientWidth;
    const H = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.environment = makeEnvMap(renderer);

    // Adjust camera to fit the phone. A higher Z or fov might be needed depending on container aspect ratio.
    const camera = new THREE.PerspectiveCamera(26, W / H, 0.1, 100);
    camera.position.set(0, 0, 18);

    const phone = new THREE.Group();
    scene.add(phone);
    phoneRef.current = phone;

    const screenW = 3.2;
    const screenH = screenW / 0.4613; // ≈ 6.94
    const bodyW = screenW + 0.16;
    const bodyH = screenH + 0.16;
    const depth = 0.40;
    const frontZ = depth / 2 + 0.08;

    const bodyGeo = new THREE.ExtrudeGeometry(makeRoundedRectShape(bodyW, bodyH, 0.46), {
      depth,
      bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08,
      bevelSegments: 10,  curveSegments: 32,
    });
    bodyGeo.center();
    phone.add(new THREE.Mesh(bodyGeo, new THREE.MeshPhysicalMaterial({
      color: 0x26262b, metalness: 1.0, roughness: 0.34,
      clearcoat: 0.4, clearcoatRoughness: 0.25, envMapIntensity: 1.3,
    })));

    const baseScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(screenW, screenH),
      new THREE.MeshBasicMaterial({ color: 0x000000 }),
    );
    baseScreen.position.z = frontZ - 0.01;
    phone.add(baseScreen);

    new THREE.TextureLoader().load(
      screenshotSrc,
      (tex) => {
        if (!mounted) { tex.dispose(); return; }
        const roundedTex = makeRoundedScreenTexture(tex.image, renderer.capabilities.getMaxAnisotropy());
        tex.dispose();
        const screen = new THREE.Mesh(
          new THREE.PlaneGeometry(screenW, screenH),
          new THREE.MeshBasicMaterial({ map: roundedTex, transparent: true, toneMapped: false }),
        );
        screen.position.z = frontZ + 0.002;
        phone.add(screen);
        if (mounted) setLoaded(true);
      },
      undefined,
      (err) => { console.error('[IPhone3D] texture error:', err); if (mounted) setLoaded(true); },
    );

    const glassMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(screenW, screenH),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff, metalness: 0, roughness: 0.06,
        transparent: true, opacity: 0.10,
        clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 2.0,
      }),
    );
    glassMesh.position.z = frontZ + 0.02;
    phone.add(glassMesh);

    const islandGeo = new THREE.ExtrudeGeometry(
      makeRoundedRectShape(0.95, 0.30, 0.15),
      { depth: 0.02, bevelEnabled: false, curveSegments: 16 },
    );
    islandGeo.center();
    const island = new THREE.Mesh(islandGeo, new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.5, metalness: 0.2 }));
    island.position.set(0, screenH / 2 - 0.30, frontZ + 0.03);
    phone.add(island);

    const btnMat = new THREE.MeshPhysicalMaterial({ color: 0x1d1d22, metalness: 1, roughness: 0.4, envMapIntensity: 1.1 });
    const sideX = bodyW / 2 + 0.04;
    const mkBtn = (w, h, x, y) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, depth * 0.55), btnMat);
      b.position.set(x, y, 0);
      phone.add(b);
    };
    mkBtn(0.10, 0.45, -sideX,  1.55); // silent switch
    mkBtn(0.10, 0.70, -sideX,  0.55); // volume up
    mkBtn(0.10, 0.70, -sideX, -0.35); // volume down
    mkBtn(0.10, 1.05,  sideX,  0.55); // power / sleep

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.DirectionalLight(0xffffff, 2.6); key.position.set(6, 9, 7); scene.add(key);
    const rim = new THREE.DirectionalLight(0x88aaff, 1.8); rim.position.set(-7, 3, -5); scene.add(rim);
    const fill = new THREE.DirectionalLight(0xffffff, 0.7); fill.position.set(-4, -5, 6); scene.add(fill);

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth, h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(container);

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const d = drag.current;

      if (!d.active) {
        d.vx *= 0.88; d.vy *= 0.88;
        d.rotY += d.vx * 0.007;
        d.rotX += d.vy * 0.007;
        // Idle animation
        d.rotY += 0.001; 
      }
      
      // Limita a rotação para não mostrar a parte de trás do mockup
      d.rotY = Math.max(-Math.PI * 0.35, Math.min(Math.PI * 0.35, d.rotY));
      d.rotX = Math.max(-Math.PI * 0.25, Math.min(Math.PI * 0.25, d.rotX));

      const mx = d.active ? 0 : mouseXRef.current * 0.45;
      const my = d.active ? 0 : -mouseYRef.current * 0.30;

      const lf = d.active ? 1.0 : 0.07;
      phone.rotation.y += ((d.rotY + mx) - phone.rotation.y) * lf;
      phone.rotation.x += ((d.rotX + my) - phone.rotation.x) * lf;
      phone.position.y = Math.sin(performance.now() * 0.0009) * 0.10;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mounted = false;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      renderer.dispose();
      rendererRef.current = null;
      phoneRef.current = null;
    };
  }, [screenshotSrc]);

  useEffect(() => {
    const onMove = (e) => {
      mouseXRef.current = (e.clientX / window.innerWidth) * 2 - 1;
      mouseYRef.current = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const onPDown = useCallback((e) => {
    drag.current.active = true;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
    drag.current.vx = 0;
    drag.current.vy = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
  }, []);

  const onPMove = useCallback((e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.lastX;
    const dy = e.clientY - drag.current.lastY;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
    drag.current.rotY += dx * 0.018;
    drag.current.rotX += dy * 0.018;
    drag.current.vx = dx;
    drag.current.vy = dy;
  }, []);

  const onPUp = useCallback(() => {
    drag.current.active = false;
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', minHeight: '400px' }}>
      <canvas
        ref={canvasRef}
        onPointerDown={onPDown}
        onPointerMove={onPMove}
        onPointerUp={onPUp}
        onPointerLeave={onPUp}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          display: 'block', zIndex: 1, cursor: 'grab', touchAction: 'none'
        }}
      />
      {!loaded && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2, pointerEvents: 'none', color: '#888', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Carregando...
        </div>
      )}
    </div>
  );
}
