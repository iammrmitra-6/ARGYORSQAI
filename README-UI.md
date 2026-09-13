# ArogyaResQ AI — Flagship UI & 3D Background Architecture

This project uses **Node.js purely as a frontend build pipeline** (Vite + Three.js + TailwindCSS).
**FastAPI serves all HTML, CSS, and JS assets at `http://127.0.0.1:8000`. No Node.js server runs in production or local development.**

---

## 5-Layer Background System Architecture

The UI features a full-viewport atmospheric background stack (`position: fixed; inset: 0; z-index: 0; pointer-events: none`):

1. **Layer 1 (Base Field & Mesh Gradient)**: Deep obsidian (`#07090e`) with slow 45s GPU-accelerated mesh gradient drift containing 4 clinical color blooms (medical teal, deep indigo, faint emerald, whisper of amber).
2. **Layer 2 (WebGL 3D Clinical Data Scene — Three.js)**: 750 volumetric particles with additive blending and a rotating wireframe geometry. Features:
   - **Parallax**: Smooth exponential lerp responding to mouse position.
   - **Autonomous drift**: Continuous subtle rotation.
   - **Visibility lifecycle**: Pauses rendering loop when tab is hidden (`document.visibilitychange`).
   - **Typing latency protection**: Throttles frame generation while typing in composer.
   - **Performance auto-downgrade**: Monitors frame delta; if FPS drops below ~28fps for >100 frames, automatically fades out WebGL to save battery/GPU.
3. **Layer 3 (Texture Overlays)**: SVG fractal noise film grain (`feTurbulence`), 1px fine scanlines, radial vignette, and chromatic edge glow.
4. **Layer 4 (Depth Haze)**: Top and bottom atmospheric gradient masks allowing the content column to float naturally.
5. **Layer 5 (Foreground Light Sweep)**: Faint, slow-moving luminous sweep across the upper viewport.

---

## Graceful Degradation & Accessibility

- **JavaScript Disabled**: The app is built with semantic HTML5 forms (`action="/chat"` `method="post"`). The core loop works 100% without JS, with the background automatically displaying the high-fidelity CSS mesh gradient + noise textures.
- **`prefers-reduced-motion: reduce`**: Disables 3D WebGL animations, light sweeps, and pulsing animations, rendering a crisp static background.
- **WebGL Unavailable**: Automatically catches WebGL errors and seamlessly falls back to the CSS background layer without console errors.

---

## Build Commands

```bash
# Install dependencies (Vite + Three.js + Tailwind)
npm install

# Build production assets directly to static/css/app.css and static/js/app.js
npm run build

# Watch mode for UI development
npm run dev
```

---

## Running the Application

```powershell
uvicorn main:app --reload --port 8000
```
Open [http://127.0.0.1:8000](http://127.0.0.1:8000).
