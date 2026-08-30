/**
 * GPU Capability Detection Utility
 * Detects whether the device is running on an integrated/weak GPU (Intel HD, Mali, Adreno, SwiftShader)
 * or a dedicated GPU, providing a tailored initial DPR baseline to avoid jank at startup.
 */

export function getGpuInfo() {
  if (typeof window === 'undefined') {
    return { isWeakGpu: false, renderer: 'SSR', dpr: [1, 1.5] }
  }

  let isWeakGpu = false
  let renderer = 'Unknown'

  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || ''
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || ''
        const lowerRenderer = (renderer + ' ' + vendor).toLowerCase()

        // List of renderer strings associated with integrated or software rendering
        const weakKeywords = [
          'intel',
          'hd graphics',
          'uhd graphics',
          'iris',
          'mali',
          'adreno',
          'swiftshader',
          'basic render',
          'software',
          'llvmpipe',
          'mesa',
        ]

        // If it's an Intel GPU without 'Arc' (dedicated) or has weak keyword, flag as weak
        if (weakKeywords.some((keyword) => lowerRenderer.includes(keyword)) && !lowerRenderer.includes('arc')) {
          isWeakGpu = true
        }
      }
    }
  } catch (err) {
    // If WebGL query fails, fallback safely
  }

  // Also check hardwareConcurrency (e.g. low-core CPUs)
  if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    isWeakGpu = true
  }

  return {
    isWeakGpu,
    renderer,
    dpr: isWeakGpu ? [0.65, 1.0] : [1.0, 1.5]
  }
}

export function getInitialDprBaseline() {
  return getGpuInfo().dpr
}
