import React from 'react'

export default function TextureGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="texture-guide-overlay" onClick={onClose}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@400;600;700&display=swap');

        .texture-guide-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(10, 10, 15, 0.88);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: guideFadeIn 0.25s ease-out;
        }

        @keyframes guideFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }

        .texture-guide-panel {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 12px;
          padding: 2.2rem;
          max-width: 720px;
          width: 92%;
          max-height: 85vh;
          overflow-y: auto;
          color: #c9d1d9;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 20px 50px rgba(0,0,0,0.7);
        }

        .texture-guide-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #30363d;
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
        }

        .texture-guide-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #58a6ff;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .texture-guide-close {
          background: #21262d;
          border: 1px solid #30363d;
          color: #8b949e;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .texture-guide-close:hover {
          background: #30363d;
          color: #f0f6fc;
        }

        .texture-section {
          margin-bottom: 1.8rem;
        }

        .texture-section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #f0f6fc;
          margin-bottom: 0.6rem;
        }

        .texture-section p {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #8b949e;
          margin-bottom: 0.8rem;
        }

        .texture-code-block {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 1rem 1.2rem;
          font-family: 'Fira Code', monospace;
          font-size: 0.88rem;
          color: #79c0ff;
          overflow-x: auto;
          line-height: 1.5;
          margin-bottom: 0.8rem;
        }

        .code-keyword { color: #ff7b72; }
        .code-func { color: #d2a8ff; }
        .code-str { color: #a5d6ff; }
        .code-comment { color: #8b949e; font-style: italic; }
        .code-tag { color: #7ee787; }
        .code-attr { color: #79c0ff; }

        .texture-badge-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.6rem;
        }

        .texture-badge {
          background: rgba(56, 139, 253, 0.15);
          border: 1px solid rgba(56, 139, 253, 0.4);
          color: #58a6ff;
          padding: 0.25rem 0.6rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-family: 'Fira Code', monospace;
        }
      `}</style>

      <div className="texture-guide-panel" onClick={(e) => e.stopPropagation()}>
        <div className="texture-guide-header">
          <h2 className="texture-guide-title">
            <span>🎨</span> How to Add Textures in React Three Fiber
          </h2>
          <button className="texture-guide-close" onClick={onClose}>×</button>
        </div>

        {/* Section 1: Loading Textures using useTexture */}
        <div className="texture-section">
          <div className="texture-section-title">1. Loading Image Textures with `useTexture`</div>
          <p>Place your texture image files (`.jpg`, `.png`, `.webp`) in the <code>public/</code> folder, then load them using Drei's <code>useTexture</code> hook:</p>
          <div className="texture-code-block">
            <span className="code-keyword">import</span> &#123; useTexture &#125; <span className="code-keyword">from</span> <span className="code-str">'@react-three/drei'</span><br/><br/>
            <span className="code-keyword">function</span> <span className="code-func">TexturedBox</span>() &#123;<br/>
            &nbsp;&nbsp;<span className="code-comment">// Load single or multiple PBR maps</span><br/>
            &nbsp;&nbsp;<span className="code-keyword">const</span> colorMap = <span className="code-func">useTexture</span>(<span className="code-str">'/textures/wood_color.jpg'</span>)<br/>
            &nbsp;&nbsp;<span className="code-keyword">const</span> [roughMap, normalMap] = <span className="code-func">useTexture</span>([<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-str">'/textures/wood_roughness.jpg'</span>,<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-str">'/textures/wood_normal.jpg'</span><br/>
            &nbsp;&nbsp;])<br/><br/>
            &nbsp;&nbsp;<span className="code-keyword">return</span> (<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="code-tag">mesh</span>&gt;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="code-tag">boxGeometry</span> <span className="code-attr">args</span>=&#123;[1, 1, 1]&#125; /&gt;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="code-tag">meshStandardMaterial</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-attr">map</span>=&#123;colorMap&#125;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-attr">roughnessMap</span>=&#123;roughMap&#125;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-attr">normalMap</span>=&#123;normalMap&#125;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&gt;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="code-tag">mesh</span>&gt;<br/>
            &nbsp;&nbsp;)<br/>
            &#125;
          </div>
        </div>

        {/* Section 2: PBR Texture Maps Overview */}
        <div className="texture-section">
          <div className="texture-section-title">2. Supported PBR Texture Maps</div>
          <p>You can pass different texture map types into <code>meshStandardMaterial</code> or <code>meshPhysicalMaterial</code>:</p>
          <div className="texture-badge-list">
            <span className="texture-badge">map (Color/Albedo)</span>
            <span className="texture-badge">roughnessMap</span>
            <span className="texture-badge">metalnessMap</span>
            <span className="texture-badge">normalMap</span>
            <span className="texture-badge">aoMap (Ambient Occlusion)</span>
            <span className="texture-badge">bumpMap</span>
            <span className="texture-badge">displacementMap</span>
            <span className="texture-badge">emissiveMap</span>
          </div>
        </div>

        {/* Section 3: Texturing Imported GLTF / GLB Models */}
        <div className="texture-section">
          <div className="texture-section-title">3. Applying Textures to GLTF / GLB Models</div>
          <p>When using <code>useGLTF</code>, you can traverse the imported 3D scene graph and override materials or texture maps dynamically:</p>
          <div className="texture-code-block">
            <span className="code-keyword">const</span> &#123; scene, materials &#125; = <span className="code-func">useGLTF</span>(<span className="code-str">'/models/CENTER TABLE.glb'</span>)<br/>
            <span className="code-keyword">const</span> myTexture = <span className="code-func">useTexture</span>(<span className="code-str">'/textures/table_wood.jpg'</span>)<br/><br/>
            <span className="code-comment">// Method A: Traverse and override all meshes</span><br/>
            scene.<span className="code-func">traverse</span>((child) =&gt; &#123;<br/>
            &nbsp;&nbsp;<span className="code-keyword">if</span> (child.isMesh) &#123;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;child.material.map = myTexture<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;child.material.needsUpdate = <span className="code-keyword">true</span><br/>
            &nbsp;&nbsp;&#125;<br/>
            &#125;)<br/><br/>
            <span className="code-comment">// Method B: Override named material directly</span><br/>
            materials.TableWood.<span className="code-attr">map</span> = myTexture
          </div>
        </div>

        {/* Section 4: Procedural / Canvas Textures */}
        <div className="texture-section">
          <div className="texture-section-title">4. Creating Dynamic Canvas Textures</div>
          <p>You can create dynamic textures programmatically using an HTML5 2D Canvas and <code>THREE.CanvasTexture</code>:</p>
          <div className="texture-code-block">
            <span className="code-keyword">const</span> canvas = document.<span className="code-func">createElement</span>(<span className="code-str">'canvas'</span>)<br/>
            <span className="code-keyword">const</span> ctx = canvas.<span className="code-func">getContext</span>(<span className="code-str">'2d'</span>)<br/>
            ctx.fillStyle = <span className="code-str">'#ffaa00'</span><br/>
            ctx.<span className="code-func">fillRect</span>(0, 0, 256, 256)<br/><br/>
            <span className="code-keyword">const</span> texture = <span className="code-keyword">new</span> THREE.<span className="code-func">CanvasTexture</span>(canvas)
          </div>
        </div>
      </div>
    </div>
  )
}
