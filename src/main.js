/**
 * ArogyaResQ AI — Flagship UI Engine
 * Layered 3D WebGL Background + Progressive Enhancement
 */
import './css/app.css';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════
// THREE.JS 3D CLINICAL DATA FIELD (LAYER 2)
// ═══════════════════════════════════════════════════════════════════════════

class ClinicalBackgroundScene {
  constructor() {
    this.container = document.querySelector('.bg-layer-webgl');
    if (!this.container) return;

    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.container.style.display = 'none';
      return;
    }

    // Check WebGL availability
    if (!this.isWebGLAvailable()) {
      console.info('WebGL not available; using CSS mesh gradient fallback.');
      this.container.style.display = 'none';
      return;
    }

    try {
      this.init();
    } catch (err) {
      console.warn('Three.js initialization failed; falling back to CSS.', err);
      if (this.container) this.container.style.display = 'none';
    }
  }

  isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  init() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 1000);
    this.camera.position.z = 70;

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio <= 1.5,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.container.appendChild(this.renderer.domElement);

    // Build Particle Constellation
    this.createClinicalParticles();

    // Mouse Parallax & Drift State
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetRotX = 0;
    this.targetRotY = 0;
    this.isTabVisible = true;
    this.isTyping = false;
    this.fpsDropCount = 0;
    this.lastFrameTime = performance.now();

    // Event Listeners
    this.bindEvents();

    // Start Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  createClinicalParticles() {
    const particleCount = 750;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const teal = new THREE.Color(0x06b6d4);
    const indigo = new THREE.Color(0x6366f1);
    const emerald = new THREE.Color(0x10b981);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Spread in 3D volume
      positions[i3] = (Math.random() - 0.5) * 160;
      positions[i3 + 1] = (Math.random() - 0.5) * 110;
      positions[i3 + 2] = (Math.random() - 0.5) * 120;

      // Subtle clinical color distribution
      const rand = Math.random();
      const col = rand < 0.5 ? teal : (rand < 0.8 ? indigo : emerald);
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material with additive blending
    const material = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    // Subtle Geometric Medical Wireframe Ring
    const ringGeom = new THREE.TorusGeometry(32, 0.4, 8, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0891b2,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    this.ring = new THREE.Mesh(ringGeom, ringMat);
    this.ring.rotation.x = Math.PI / 3;
    this.scene.add(this.ring);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });

    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / this.width) * 2 - 1;
      const normY = -(e.clientY / this.height) * 2 + 1;
      this.targetRotY = normX * 0.12;
      this.targetRotX = normY * 0.08;
    });

    document.addEventListener('visibilitychange', () => {
      this.isTabVisible = !document.hidden;
    });

    const textarea = document.getElementById('message');
    if (textarea) {
      textarea.addEventListener('focus', () => { this.isTyping = true; });
      textarea.addEventListener('blur', () => { this.isTyping = false; });
    }
  }

  animate(now) {
    requestAnimationFrame(this.animate);

    if (!this.isTabVisible) return;

    // FPS Health Monitor
    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;
    if (delta > 35) { // < ~28fps
      this.fpsDropCount++;
      if (this.fpsDropCount > 100) {
        // Auto downgrade to static background on severe frame drops
        this.container.style.opacity = '0';
        return;
      }
    }

    // Typing throttle
    if (this.isTyping && Math.random() > 0.4) return;

    // Autonomous drift + smooth parallax lerp
    this.particles.rotation.y += 0.0006;
    this.particles.rotation.x += 0.0003;
    this.ring.rotation.z += 0.0008;

    this.particles.rotation.y += (this.targetRotY - this.particles.rotation.y) * 0.03;
    this.particles.rotation.x += (this.targetRotX - this.particles.rotation.x) * 0.03;

    this.renderer.render(this.scene, this.camera);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESSIVE ENHANCEMENT (WORKS FULLY WITHOUT JS)
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Initialize 3D Scene
  new ClinicalBackgroundScene();

  // 1. Auto-scroll to latest response card
  const cards = document.querySelectorAll('.response-card');
  if (cards.length > 0) {
    const latest = cards[cards.length - 1];
    setTimeout(() => {
      latest.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }

  // 2. Inject Client Timestamps
  const now = new Date();
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const timeString = timeFormatter.format(now);

  document.querySelectorAll('.msg-time, .card-time').forEach(el => {
    if (!el.textContent.trim()) {
      el.textContent = timeString;
    }
  });

  // 3. Auto-resize Textarea & Ctrl+Enter submit
  const textarea = document.getElementById('message');
  const composer = document.querySelector('.message-form');

  if (textarea && composer) {
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 180) + 'px';
    });

    textarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        composer.requestSubmit();
      }
    });

    composer.addEventListener('submit', () => {
      const sendBtn = composer.querySelector('.send-btn');
      if (sendBtn) {
        sendBtn.classList.add('submitting');
        const label = sendBtn.querySelector('.send-label');
        if (label) label.textContent = 'Processing…';
      }
    });
  }
});
