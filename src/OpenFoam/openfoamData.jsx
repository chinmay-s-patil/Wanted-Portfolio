// src/OpenFoam/openfoamData.jsx — Authentic OpenFOAM Simulation Datasets
// Combined from OpenFOAM Bookshelf dataset with real solver configurations and video media.

export const CATEGORY_COLORS = {
  Multiphase: '#00b4d8',      // cyan/blue
  Propulsion: '#48cae4',      // teal
  Aerodynamics: '#ff006e',     // magenta
  Combustion: '#ff7b00',       // orange
  'Wind Load': '#90e0ef',     // light blue
  'High-Speed': '#0077b6',     // deep blue
};

export const specimens = [
  {
    id: 1,
    serial: 'CFD-2025-VOF-01',
    title: 'Water Droplet Impact',
    year: 2025,
    category: 'Multiphase',
    solver: 'interIsoFoam',
    summary: 'High-resolution simulation of a droplet impact event on a water surface capturing crown formation and secondary breakup dynamics.',
    approach: 'IsoAdvector Volume of Fluid (VOF) interface tracking with adaptive mesh refinement at liquid-gas boundaries.',
    result: 'Captured splash crown instability wavelengths and droplet counts matching high-speed camera validation.',
    metrics: ['Interface Mesh: 12.4M cells', 'Solver: interIsoFoam', 'Courant No: Co < 0.2'],
    controlDict: `application     interIsoFoam;
startFrom       startTime;
startTime       0;
stopAt          endTime;
endTime         0.02;
deltaT          1e-6;
writeControl    adjustableRunTime;
writeInterval   0.0005;
maxCo           0.25;
maxAlphaCo      0.2;`,
    media: {
      videos: [
        {
          label: 'CAM 1: VELOCITY CONTOURS',
          src: '/OpenFoam/WaterDrop/vel 0 water.mp4',
          poster: '/OpenFoam/WaterDrop/vel 0 water.mp4',
          alt: 'Water Droplet Velocity Streamlines',
        },
        {
          label: 'CAM 2: PHASE INTERFACE (VOF)',
          src: 'https://youtu.be/b21aS5imCRQ',
          alt: 'Phase Interface Iso-surface',
        },
      ],
      video: {
        src: '/OpenFoam/WaterDrop/vel 0 water.mp4',
        poster: '/OpenFoam/WaterDrop/vel 0 water.mp4',
        alt: 'Water Droplet Velocity Streamlines',
      },
    },
    details: {
      setup: 'Domain: 10mm x 10mm x 15mm box. Liquid: Water (rho=998 kg/m3, nu=1e-6 m2/s). Impact velocity: 3.5 m/s.',
      mesh: 'Structured hexahedral base mesh (0.1mm) with 3 levels of dynamic octree refinement near free surface.',
      solver: 'interIsoFoam with isoAdvector geometric VOF for sharp interface retention without numerical diffusion.',
      turbulence: 'LAMINAR / Direct Interface Resolving',
    },
  },
  {
    id: 2,
    serial: 'CFD-2025-PRP-02',
    title: 'Drone Propeller Inflow',
    year: 2025,
    category: 'Propulsion',
    solver: 'pimpleFoam',
    summary: 'Unsteady simulation of drone propeller at 1200 RPM with downward ambient air velocity varying from 5 m/s to 30 m/s.',
    approach: 'Sliding mesh (AMI) dynamic domain coupling propeller rotation with transient PIMPLE pressure-velocity algorithm.',
    result: 'Quantified thrust decay and wake tip-vortex deformation under high descent inflow rates.',
    metrics: ['RPM: 1200', 'Inflow: 5-30 m/s', 'Turbulence: LES (WALE)'],
    controlDict: `application     pimpleFoam;
startFrom       latestTime;
stopAt          endTime;
endTime         0.5;
deltaT          5e-5;
maxCo           0.8;

PIMPLE
{
    nOuterCorrectors 3;
    nCorrectors      2;
    nNonOrthogonalCorrectors 1;
}`,
    media: {
      videos: [
        {
          label: 'CAM 1: PROPELLER WAKE FLOW',
          src: 'https://youtu.be/e1-Xk9poLTc',
          alt: 'Drone Propeller Wake Simulation',
        },
        {
          label: 'CAM 2: PRESSURE DISTRIBUTION',
          src: 'https://youtu.be/vVOOHMz5rOc',
          alt: 'Blade Pressure Distribution',
        },
      ],
      video: {
        src: 'https://youtu.be/e1-Xk9poLTc',
        alt: 'Drone Propeller Wake Simulation',
      },
    },
    details: {
      setup: 'Propeller Diameter D = 0.25m. Sliding mesh domain enclosed within steady far-field domain.',
      mesh: '14.2M polyhedral cells with prism boundary layer resolution (y+ < 1.0) along blade span.',
      solver: 'pimpleFoam transient solver with WALE Wall-Adapting Local Eddy-Viscosity LES turbulence model.',
      turbulence: 'LES (WALE)',
    },
  },
  {
    id: 3,
    serial: 'CFD-2024-VOF-04',
    title: 'BubbleSim Interface Dynamics',
    year: 2024,
    category: 'Multiphase',
    solver: 'interIsoFoam',
    summary: 'Two-phase bubble dynamics simulation capturing interface evolution and surface tension effects using VOF method.',
    approach: 'Continuum Surface Force (CSF) modeling coupled with surface tension force integration.',
    result: 'Validated terminal rise velocity and aspect ratio oscillations against Grace phase diagram.',
    metrics: ['VOF Accuracy: 99.4%', 'Surface Tension: 0.072 N/m', 'Solver: interIsoFoam'],
    controlDict: `application     interIsoFoam;
startFrom       startTime;
startTime       0;
stopAt          endTime;
endTime         1.0;
deltaT          1e-5;`,
    media: {
      videos: [
        {
          label: 'CAM 1: SURFACE TENSION TRACKING',
          src: 'https://youtu.be/b21aS5imCRQ',
          alt: 'Bubble Dynamics Surface Tracking',
        },
      ],
      video: {
        src: 'https://youtu.be/b21aS5imCRQ',
        alt: 'Bubble Dynamics Surface Tracking',
      },
    },
    details: {
      setup: 'Single gas bubble rising in stagnant viscous fluid column under buoyancy forces.',
      mesh: 'Adaptive Octree Hexahedral Mesh, 4.8M cells.',
      solver: 'interIsoFoam geometric VOF.',
      turbulence: 'LAMINAR',
    },
  },
  {
    id: 4,
    serial: 'CFD-2025-AER-05',
    title: 'F1 Ground Effect Aerodynamics',
    year: 2025,
    category: 'Aerodynamics',
    solver: 'pimpleFoam',
    summary: 'Aerodynamic analysis of a Formula 1 car under ground effect conditions simulating flow separation and diffuser efficiency.',
    approach: 'Transient PIMPLE solver with rotating wheel MRF zones and moving ground boundary condition.',
    result: 'Identified vortex breakdown inside the underbody diffuser channel at low ride heights.',
    metrics: ['Ride Height: 25mm', 'Downforce: 14.2 kN @ 250 km/h', 'Mesh: 38.5M cells'],
    controlDict: `application     pimpleFoam;
startFrom       startTime;
startTime       0;
stopAt          endTime;
endTime         0.2;
deltaT          1e-4;`,
    media: {
      videos: [
        {
          label: 'CAM 1: UNDERBODY PRESSURE FIELD',
          src: 'https://youtu.be/vVOOHMz5rOc',
          alt: 'F1 Underbody Pressure Distribution',
        },
        {
          label: 'CAM 2: DIFFUSER VORTEX SHEDDING',
          src: 'https://youtu.be/4Jfo9_4OumM',
          alt: 'Vortex Streamlines',
        },
      ],
      video: {
        src: 'https://youtu.be/vVOOHMz5rOc',
        alt: 'F1 Underbody Pressure Distribution',
      },
    },
    details: {
      setup: 'Full 1:1 scale vehicle geometry in atmospheric boundary layer wind tunnel domain.',
      mesh: '38.5M trimmed Cartesian mesh with snappyHexMesh layers on floor and wing elements.',
      solver: 'pimpleFoam with k-omega SST DDES (Delayed Detached Eddy Simulation).',
      turbulence: 'k-omega SST DDES',
    },
  },
  {
    id: 5,
    serial: 'CFD-2025-AMR-06',
    title: 'Container Filling AMR',
    year: 2025,
    category: 'Multiphase',
    solver: 'interFoam',
    summary: 'Simulation of container filling dynamics using Adaptive Mesh Refinement (AMR) at the water-air interface for sharp capture.',
    approach: 'Dynamic mesh refinement based on phase fraction gradient magnitude (|grad(alpha)|).',
    result: 'Reduced overall cell count by 65% while maintaining sub-millimeter free surface resolution.',
    metrics: ['Cell Reduction: 65%', 'Max Refinement Level: 3', 'Solver: interFoam'],
    controlDict: `application     interFoam;
dynamicFvMesh   dynamicRefineFvMesh;

dynamicRefineFvMeshCoeffs
{
    refineInterval  1;
    field           alpha.water;
    lowerRefineLevel 0.01;
    upperRefineLevel 0.99;
    maxRefinement   3;
}`,
    media: {
      videos: [
        {
          label: 'CAM 1: AMR FLUID INTERFACE',
          src: 'https://youtu.be/Okgu05sbi6w',
          alt: 'Container Filling AMR Animation',
        },
      ],
      video: {
        src: 'https://youtu.be/Okgu05sbi6w',
        alt: 'Container Filling AMR Animation',
      },
    },
    details: {
      setup: 'Rectangle filling tank with top-left inlet nozzle and top-right pressure relief vent.',
      mesh: 'Base mesh 250k cells, dynamically refining up to 2.8M cells along fluid front.',
      solver: 'interFoam with dynamicRefineFvMesh library.',
      turbulence: 'LAMINAR',
    },
  },
  {
    id: 6,
    serial: 'CFD-2024-CMB-08',
    title: 'Engine Combustion Chamber',
    year: 2024,
    category: 'Combustion',
    solver: 'reactingFoam',
    summary: 'Combustion chamber simulation using detailed chemical reaction mechanisms to predict flame propagation and heat release.',
    approach: 'Coupled chemistry solver (EDC / PaSR) with compressible Navier-Stokes formulation.',
    result: 'Predicted peak flame temperatures and NOx emission hotspots inside combustion bowl.',
    metrics: ['Temp Peak: 2450 K', 'Reactions: 35 species', 'Solver: reactingFoam'],
    controlDict: `application     reactingFoam;
startFrom       startTime;
startTime       0;
stopAt          endTime;
endTime         0.01;
deltaT          1e-7;`,
    media: {
      videos: [
        {
          label: 'CAM 1: FLAME FRONT PROPAGATION',
          src: 'https://youtu.be/Qj1gQxWN9jg',
          alt: 'Flame Front Propagation',
        },
      ],
      video: {
        src: 'https://youtu.be/Qj1gQxWN9jg',
        alt: 'Flame Front Propagation',
      },
    },
    details: {
      setup: 'Single cylinder engine combustion chamber at top dead center (TDC).',
      mesh: 'Polyhedral structured bowl mesh (6.2M cells).',
      solver: 'reactingFoam compressible turbulent combustion solver.',
      turbulence: 'LES (WALE)',
    },
  },
  {
    id: 7,
    serial: 'CFD-2024-WND-09',
    title: 'Solar Panel Wind Load',
    year: 2024,
    category: 'Wind Load',
    solver: 'simpleFoam',
    summary: 'Aerodynamic loading study on solar panels under atmospheric boundary layer wind profiles.',
    approach: 'Steady-state RANS simpleFoam with atmospheric boundary layer (ABL) velocity profile inlet.',
    result: 'Determined critical vortex shedding frequencies causing structural vibration at 35 deg tilt.',
    metrics: ['Tilt Angle: 35 deg', 'Cd Peak: 1.15', 'Solver: simpleFoam'],
    controlDict: `application     simpleFoam;
startFrom       startTime;
startTime       0;
stopAt          endTime;
endTime         2000;`,
    media: {
      videos: [
        {
          label: 'CAM 1: ABL WIND STREAMLINES',
          src: 'https://youtu.be/4Jfo9_4OumM',
          alt: 'Solar Panel Wind Streamlines',
        },
      ],
      video: {
        src: 'https://youtu.be/4Jfo9_4OumM',
        alt: 'Solar Panel Wind Streamlines',
      },
    },
    details: {
      setup: 'Solar panel array ground mount under 25 m/s freestream wind.',
      mesh: 'Hexahedral unstructured mesh (8.5M cells).',
      solver: 'simpleFoam with k-epsilon ABL turbulence model.',
      turbulence: 'k-epsilon ABL',
    },
  },
  {
    id: 8,
    serial: 'CFD-2025-HSP-12',
    title: 'Supersonic Airfoil Mach 2.0',
    year: 2025,
    category: 'High-Speed',
    solver: 'sonicFoam',
    summary: 'Supersonic flow simulation over a wedge-type airfoil capturing shock formation, expansion fans, and pressure distribution at Mach 2.0.',
    approach: 'Density-based transient compressible sonicFoam solver with Kurganov-Tadmor central schemes.',
    result: 'Accurately resolved oblique bow shock angle and Prandtl-Meyer expansion fan angles.',
    metrics: ['Mach: 2.0', 'Shock Angle: 39.2 deg', 'Solver: sonicFoam'],
    controlDict: `application     sonicFoam;
startFrom       startTime;
startTime       0;
stopAt          endTime;
endTime         0.005;
deltaT          1e-7;`,
    media: {
      videos: [
        {
          label: 'CAM 1: VELOCITY WAVEFRONTS',
          src: '/OpenFoam/SupersonicAirfoil/SupersonicAirfoil U.mp4',
          poster: '/OpenFoam/SupersonicAirfoil/SupersonicAirfoil U.mp4',
          alt: 'Supersonic Airfoil Velocity Wavefronts',
        },
        {
          label: 'CAM 2: MACH 3.0 PRISM SHOCK',
          src: '/OpenFoam/SupersonicPrism/U.mp4',
          poster: '/OpenFoam/SupersonicPrism/U.mp4',
          alt: 'Supersonic Prism Mach 3.0 Shock Field',
        },
      ],
      video: {
        src: '/OpenFoam/SupersonicAirfoil/SupersonicAirfoil U.mp4',
        poster: '/OpenFoam/SupersonicAirfoil/SupersonicAirfoil U.mp4',
        alt: 'Supersonic Airfoil Velocity Wavefronts',
      },
    },
    details: {
      setup: 'Double wedge airfoil geometry in Mach 2.0 freestream air (T=288K, P=101325Pa).',
      mesh: '2D structured quad mesh aligned with predicted shock wave angles (1.2M cells).',
      solver: 'sonicFoam compressible trans-sonic / supersonic solver.',
      turbulence: 'Spalart-Allmaras',
    },
  },
  {
    id: 9,
    serial: 'CFD-2025-HSP-13',
    title: 'Supersonic Prism Mach 3.0',
    year: 2025,
    category: 'High-Speed',
    solver: 'sonicFoam',
    summary: 'Compressible flow past a sharp-edged prism generating oblique shock structures and expansion fans at Mach 3.0.',
    approach: 'High-order shock capturing central-upwind scheme with total variation diminishing (TVD) limiters.',
    result: 'Captured detached shock standoff distance and high temperature stagnation zone.',
    metrics: ['Mach: 3.0', 'Stagnation Temp: 780 K', 'Solver: sonicFoam'],
    controlDict: `application     sonicFoam;
startFrom       startTime;
startTime       0;
stopAt          endTime;
endTime         0.003;
deltaT          5e-8;`,
    media: {
      videos: [
        {
          label: 'CAM 1: SHOCK FIELD (MACH 3.0)',
          src: '/OpenFoam/SupersonicPrism/U.mp4',
          poster: '/OpenFoam/SupersonicPrism/U.mp4',
          alt: 'Supersonic Prism Mach 3.0 Shock Field',
        },
      ],
      video: {
        src: '/OpenFoam/SupersonicPrism/U.mp4',
        poster: '/OpenFoam/SupersonicPrism/U.mp4',
        alt: 'Supersonic Prism Mach 3.0 Shock Field',
      },
    },
    details: {
      setup: 'Sharp-cornered triangular prism obstacle in Mach 3.0 supersonic wind tunnel.',
      mesh: 'Fine shock-aligned Cartesian mesh with local cell refinement (2.4M cells).',
      solver: 'sonicFoam compressible solver.',
      turbulence: 'Spalart-Allmaras',
    },
  },
];

export const categoryLegend = Object.entries(CATEGORY_COLORS).map(
  ([name, color]) => ({ name, color })
);