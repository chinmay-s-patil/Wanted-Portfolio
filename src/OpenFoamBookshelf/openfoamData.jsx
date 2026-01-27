// src/data/openfoamData.js
export const openfoamData = {
  shelves: {
    "Aerodynamics": {
      description: "Aerodynamic simulation cases",
      books: ["propeller-aeroacoustics-2023", "airfoil-optimization-2022", "car-aero-2021"]
    },
    "Thermal": {
      description: "Thermal and heat transfer cases",
      books: ["battery-cooling-2023", "heat-exchanger-2022"]
    },
    "Acoustics": {
      description: "Acoustic simulation cases",
      books: ["fan-noise-2023", "duct-acoustics-2022"]
    }
  },
  books: [
    {
      id: "propeller-aeroacoustics-2023",
      title: "Propeller Aeroacoustics Study",
      shortTitle: "Propeller Aero",
      year: 2023,
      tags: ["OpenFOAM", "Aeroacoustics", "FVM", "LES"],
      summary: "Investigated tonal and broadband noise of small propellers using hybrid LES-RANS coupling.",
      approach: "Hybrid LES-RANS coupling with mesh refinement near blade tips",
      result: "Identified tonal source and achieved 6 dB noise reduction with geometry optimization",
      metrics: ["SPL reduction: 6 dB (tip)", "Runtime: 18h (surrogate model)", "Mesh: 8M cells"],
      media: {
        hero: "/projects/propeller/hero.webp",
        images: ["/projects/propeller/mesh.webp", "/projects/propeller/results.webp"],
        videoPoster: "/projects/propeller/video-poster.jpg",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        model3d: "/models/propeller.glb"
      },
      artifacts: [
        { type: "paper", label: "Conference Paper (PDF)", url: "/files/prop_paper.pdf" },
        { type: "repo", label: "Simulation Scripts", url: "https://github.com/yourusername/propeller-study" },
        { type: "report", label: "Full Report", url: "/files/prop_report.pdf" }
      ],
      details: {
        setup: "Used OpenFOAM-v2112 with custom aeroacoustic solver. Domain: 10D upstream, 20D downstream. Operating conditions: 3000 RPM, sea level.",
        mesh: "Hybrid mesh with 8M cells. Prism layers near blade surfaces (y+ < 1). Adaptive refinement in tip vortex region.",
        bc: "Velocity inlet, pressure outlet. Acoustic analogies: FW-H formulation.",
        solver: "pimpleFoam for flow, libAcousticPy for post-processing. Courant number < 0.5.",
        results: "Achieved 6 dB SPL reduction at blade pass frequency. Broadband noise reduced by 3 dB. Good agreement with experimental data (±2 dB)."
      }
    },
    {
      id: "battery-cooling-2023",
      title: "Battery Pack Thermal Management",
      shortTitle: "Battery Cooling",
      year: 2023,
      tags: ["OpenFOAM", "Thermal", "Conjugate Heat Transfer"],
      summary: "Optimized cooling plate design for EV battery pack thermal management.",
      approach: "Conjugate heat transfer simulation with liquid cooling",
      result: "Achieved ≤ 5°C temperature variation across pack",
      metrics: ["ΔT: 4.8°C", "Pressure drop: 2.1 kPa", "Flow rate: 12 L/min"],
      media: {
        hero: "/projects/battery/hero.webp",
        images: ["/projects/battery/temperature.webp", "/projects/battery/flow.webp"]
      },
      artifacts: [
        { type: "repo", label: "Case Files", url: "https://github.com/yourusername/battery-cooling" }
      ],
      details: {
        setup: "chtMultiRegionFoam solver. Battery cells modeled as heat sources. Coolant: 50/50 water-glycol mixture.",
        results: "Optimized channel geometry reduced max cell temperature by 12°C while maintaining low pressure drop."
      }
    },
    // Add more books here...
  ]
};