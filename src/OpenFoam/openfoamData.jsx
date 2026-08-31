// src/OpenFoam/openfoamData.jsx — Authentic OpenFOAM Simulation Datasets
// Filled from old OpenfoamList.jsx dataset (superseding data) with real solver configurations and video media.

export const CATEGORY_COLORS = {
  Multiphase: '#00b4d8',            // cyan/blue
  'Multiphase Flow': '#00b4d8',
  Propulsion: '#48cae4',            // teal
  'Drone Simulation': '#48cae4',
  Aerodynamics: '#ff006e',           // magenta
  'Vehicle Aerodynamics': '#ff006e',
  Combustion: '#ff7b00',             // orange
  'Wind Load': '#90e0ef',           // light blue
  'Wind Engineering': '#90e0ef',
  'High-Speed': '#0077b6',           // deep blue
  'High-Speed Flow': '#0077b6',
};

export const specimens = [
  {
    id: 1,
    serial: 'CFD-2025-VOF-01',
    title: 'Water Droplet Impact',
    year: '2025',
    date: '05/2025',
    category: 'Multiphase Flow',
    solver: 'interIsoFoam',
    description: 'High-resolution simulation of a droplet impact event on a water surface capturing crown formation and secondary breakup dynamics.',
    summary: 'High-resolution simulation of a droplet impact event on a water surface capturing crown formation and secondary breakup dynamics.',
    specs: {
      turbulence: 'LES',
    },
    tags: ['Impact', 'VOF', 'Splash'],
    color: '#00b4d8',
    learnings: [
      'Captured crown formation',
      'Analyzed secondary breakup',
      'High-resolution interface tracking'
    ],
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
          label: 'CAM 1: VELOCITY (0 m/s)',
          src: '/OpenFoam/WaterDrop/vel 0 water.mp4',
          poster: '/OpenFoam/WaterDrop/vel 0 water.mp4',
          alt: 'Water Droplet Velocity 0',
        },
        {
          label: 'CAM 2: VELOCITY (1 m/s)',
          src: '/OpenFoam/WaterDrop/vel 1 water.mp4',
          poster: '/OpenFoam/WaterDrop/vel 1 water.mp4',
          alt: 'Water Droplet Velocity 1',
        },
        {
          label: 'CAM 3: VELOCITY (5 m/s)',
          src: '/OpenFoam/WaterDrop/vel 5 water.mp4',
          poster: '/OpenFoam/WaterDrop/vel 5 water.mp4',
          alt: 'Water Droplet Velocity 5',
        },
        {
          label: 'CAM 4: VELOCITY (10 m/s)',
          src: '/OpenFoam/WaterDrop/vel 10 water.mp4',
          poster: '/OpenFoam/WaterDrop/vel 10 water.mp4',
          alt: 'Water Droplet Velocity 10',
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
      turbulence: 'LES',
    },
  },
  {
    id: 2,
    serial: 'CFD-2025-PRP-02',
    title: 'Drone Propeller Inflow',
    year: '2025',
    date: '12/2025',
    category: 'Propulsion',
    solver: 'pimpleFoam',
    description: 'Unsteady simulation of drone propeller at 1200 RPM with downward ambient air velocity varying from 5 m/s to 30 m/s, simulating upward flight conditions and thrust response to inflow changes.',
    summary: 'Unsteady simulation of drone propeller at 1200 RPM with downward ambient air velocity varying from 5 m/s to 30 m/s, simulating upward flight conditions and thrust response to inflow changes.',
    specs: {
      turbulence: 'LES (WALE)',
      rpm: '1200',
      inflow: '5-30 m/s'
    },
    tags: ['Propeller', 'Rotation', 'Drone', 'Inflow'],
    color: '#48cae4',
    learnings: [
      'Modeled propeller rotation with sliding mesh',
      'Analyzed thrust variation with ambient inflow',
      'Captured wake deformation under flight conditions'
    ],
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
          label: 'CAM 1: PROPELLER WAKE FLOW (5 m/s)',
          src: 'https://youtu.be/e1-Xk9poLTc',
          alt: 'Drone Propeller Wake Simulation 5 m/s',
        },
        {
          label: 'CAM 2: WAKE FLOW (10 m/s)',
          src: 'https://youtu.be/ezZOBuvUGkg',
          alt: 'Drone Propeller Wake Simulation 10 m/s',
        },
        {
          label: 'CAM 3: WAKE FLOW (15 m/s)',
          src: 'https://youtu.be/KF-tlR1s5Hs',
          alt: 'Drone Propeller Wake Simulation 15 m/s',
        },
        {
          label: 'CAM 4: WAKE FLOW (20 m/s)',
          src: 'https://youtu.be/5oFPQE9LAmU',
          alt: 'Drone Propeller Wake Simulation 20 m/s',
        },
        {
          label: 'CAM 5: WAKE FLOW (30 m/s)',
          src: 'https://youtu.be/1PUsm8FgfFE',
          alt: 'Drone Propeller Wake Simulation 30 m/s',
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
    serial: 'CFD-2025-VOF-03',
    title: 'Pillar Separate (WIP)',
    year: '2025',
    date: '12/2025',
    category: 'Multiphase Flow',
    solver: 'interFoam',
    description: 'Water flow under bridge with two obstructing support pillars to analyze surface ripple formation and flow separation around supports. Work in progress focusing on free-surface deflection.',
    summary: 'Water flow under bridge with two obstructing support pillars to analyze surface ripple formation and flow separation around supports. Work in progress focusing on free-surface deflection.',
    specs: {
      turbulence: 'k-ω SST'
    },
    tags: ['Bridge', 'Pillars', 'Surface Waves', 'WIP'],
    color: '#0077b6',
    learnings: [
      'Captured flow around bridge supports',
      'Analyzed surface water separation',
      'Ongoing refinement of outlet conditions'
    ],
    approach: 'Two-phase VOF solver with k-omega SST turbulence model for free surface flow around blunt hydraulic structures.',
    result: 'Simulated initial bow wave formation and vortex shedding behind dual bridge piers.',
    metrics: ['Turbulence: k-ω SST', 'Solver: interFoam', 'State: Work in Progress'],
    controlDict: `application     interFoam;
startFrom       startTime;
startTime       0;
stopAt          endTime;
endTime         10.0;
deltaT          1e-3;
maxCo           0.5;`,
    media: {
      videos: [],
      video: {
        src: null,
        alt: 'Pillar Separation Simulation (WIP)',
      },
    },
    details: {
      setup: 'Open channel bridge section with twin rectangular support pillars.',
      mesh: 'Unstructured hexahedral mesh with surface refinement around pillar geometries.',
      solver: 'interFoam transient solver for two incompressible, isothermal, immiscible fluids.',
      turbulence: 'k-ω SST',
    },
  },
  {
    id: 4,
    serial: 'CFD-2024-VOF-04',
    title: 'BubbleSim',
    year: '2024',
    date: '01/2024',
    category: 'Multiphase Flow',
    solver: 'interIsoFoam',
    description: 'Two-phase bubble dynamics simulation capturing interface evolution and surface tension effects using the Volume of Fluid (VOF) method.',
    summary: 'Two-phase bubble dynamics simulation capturing interface evolution and surface tension effects using the Volume of Fluid (VOF) method.',
    specs: {
      turbulence: 'LAMINAR'
    },
    tags: ['VOF', 'Multiphase', 'Interface Tracking'],
    color: '#00c4b3',
    learnings: [
      'Implemented VOF method for interface tracking',
      'Optimized surface tension modeling',
      'Achieved stable bubble dynamics simulation'
    ],
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
    id: 5,
    serial: 'CFD-2025-AER-05',
    title: 'F1 Aerodynamics',
    year: '2025',
    date: '04/2024',
    category: 'Vehicle Aerodynamics',
    solver: 'pimpleFoam',
    description: 'Aerodynamic analysis of a Formula 1 car under ground effect conditions. Simulated flow separation, diffuser efficiency, and pressure distribution.',
    summary: 'Aerodynamic analysis of a Formula 1 car under ground effect conditions. Simulated flow separation, diffuser efficiency, and pressure distribution.',
    specs: {
      turbulence: 'k-ω SST'
    },
    tags: ['CFD', 'Aerodynamics', 'Motorsport'],
    color: '#ff006e',
    learnings: [
      'Modeled ground effect aerodynamics',
      'Analyzed flow separation patterns',
      'Optimized diffuser efficiency'
    ],
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
      ],
      video: {
        src: 'https://youtu.be/vVOOHMz5rOc',
        alt: 'F1 Underbody Pressure Distribution',
      },
    },
    details: {
      setup: 'Full 1:1 scale vehicle geometry in atmospheric boundary layer wind tunnel domain.',
      mesh: '38.5M trimmed Cartesian mesh with snappyHexMesh layers on floor and wing elements.',
      solver: 'pimpleFoam with k-omega SST turbulence model.',
      turbulence: 'k-ω SST',
    },
  },
  {
    id: 6,
    serial: 'CFD-2025-AMR-06',
    title: 'Container Filling AMR',
    year: '2025',
    date: '11/2025',
    category: 'Multiphase Flow',
    solver: 'interFoam',
    description: 'Simulation of container filling dynamics with upper left/right halves as inlet/outlet, walls elsewhere, using Adaptive Mesh Refinement (AMR) at the water-air interface for sharp capture.',
    summary: 'Simulation of container filling dynamics with upper left/right halves as inlet/outlet, walls elsewhere, using Adaptive Mesh Refinement (AMR) at the water-air interface for sharp capture.',
    specs: {
      turbulence: 'LAMINAR'
    },
    tags: ['Filling', 'AMR', 'VOF', 'interFoam'],
    color: '#00a896',
    learnings: [
      'Implemented dynamic AMR at free surface',
      'Stable inlet/outlet for continuous filling',
      'Improved interface resolution efficiency'
    ],
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
          alt: 'Container Filling AMR Animation 1',
        },
        {
          label: 'CAM 2: FILLING STAGE 2',
          src: 'https://youtu.be/-3tyRwD62bA',
          alt: 'Container Filling AMR Animation 2',
        },
        {
          label: 'CAM 3: FILLING STAGE 3',
          src: 'https://youtu.be/aqfHIQPvozU',
          alt: 'Container Filling AMR Animation 3',
        },
        {
          label: 'CAM 4: FILLING STAGE 4',
          src: 'https://youtu.be/JgCLHwVjAKc',
          alt: 'Container Filling AMR Animation 4',
        },
        {
          label: 'CAM 5: FILLING STAGE 5',
          src: 'https://youtu.be/RsR7A1tjaMI',
          alt: 'Container Filling AMR Animation 5',
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
    id: 7,
    serial: 'CFD-2024-PRP-07',
    title: 'Propeller Simulation',
    year: '2024',
    date: '06/2024',
    category: 'Drone Simulation',
    solver: 'pimpleFoam',
    description: 'Unsteady simulation of rotating propeller blades capturing wake interaction and thrust generation under realistic RPM conditions.',
    summary: 'Unsteady simulation of rotating propeller blades capturing wake interaction and thrust generation under realistic RPM conditions.',
    specs: {
      turbulence: 'LES (WALE)'
    },
    tags: ['LES', 'Rotation', 'Propulsion'],
    color: '#48cae4',
    learnings: [
      'Implemented sliding mesh for rotation',
      'Captured wake interaction dynamics',
      'Analyzed thrust generation'
    ],
    approach: 'Unsteady sliding mesh formulation with Wall-Adapting Local Eddy-Viscosity (WALE) subgrid model.',
    result: 'Accurately resolved tip vortex shedding frequency and instantaneous aerodynamic thrust loads.',
    metrics: ['Solver: pimpleFoam', 'Turbulence: LES (WALE)', 'Sliding Mesh: AMI'],
    controlDict: `application     pimpleFoam;
startFrom       startTime;
startTime       0;
stopAt          endTime;
endTime         0.1;
deltaT          1e-5;`,
    media: {
      videos: [
        {
          label: 'CAM 1: PROPELLER ROTATION & WAKE',
          src: 'https://youtu.be/kKAqOmWSgqs',
          alt: 'Propeller Simulation Wake',
        },
      ],
      video: {
        src: 'https://youtu.be/kKAqOmWSgqs',
        alt: 'Propeller Simulation Wake',
      },
    },
    details: {
      setup: 'Dual-blade drone propeller in cylindrical sliding mesh domain.',
      mesh: 'Polyhedral mesh with refined prism boundary layers on blade surfaces.',
      solver: 'pimpleFoam unsteady solver with AMI interface.',
      turbulence: 'LES (WALE)',
    },
  },
  {
    id: 8,
    serial: 'CFD-2024-CMB-08',
    title: 'Engine Combustion',
    year: '2024',
    date: '01/2024',
    category: 'Combustion',
    solver: 'reactingFoam',
    description: 'Simplified combustion chamber simulation using detailed reaction mechanisms to predict flame propagation and heat release.',
    summary: 'Simplified combustion chamber simulation using detailed reaction mechanisms to predict flame propagation and heat release.',
    specs: {
      turbulence: 'LES (WALE)'
    },
    tags: ['Combustion', 'CHT', 'Energy'],
    color: '#ff7b00',
    learnings: [
      'Modeled detailed reaction mechanisms',
      'Predicted flame propagation',
      'Analyzed heat release patterns'
    ],
    approach: 'Coupled chemistry solver with compressible Navier-Stokes formulation and LES turbulence.',
    result: 'Predicted peak flame temperatures and heat release rate distributions inside combustion chamber.',
    metrics: ['Temp Peak: 2450 K', 'Reactions: Detailed mechanism', 'Solver: reactingFoam'],
    controlDict: `application     reactingFoam;
startFrom       startTime;
startTime       0;
stopAt          endTime;
endTime         0.01;
deltaT          1e-7;`,
    media: {
      videos: [
        {
          label: 'CAM 1: FLAME PROPAGATION',
          src: 'https://youtu.be/Qj1gQxWN9jg',
          alt: 'Flame Front Propagation 1',
        },
        {
          label: 'CAM 2: HEAT RELEASE & SPECIES',
          src: 'https://youtu.be/BPjKMzl3rFM',
          alt: 'Flame Front Propagation 2',
        },
      ],
      video: {
        src: 'https://youtu.be/Qj1gQxWN9jg',
        alt: 'Flame Front Propagation',
      },
    },
    details: {
      setup: 'Single cylinder combustion chamber at top dead center.',
      mesh: 'Polyhedral structured bowl mesh (6.2M cells).',
      solver: 'reactingFoam compressible turbulent combustion solver.',
      turbulence: 'LES (WALE)',
    },
  },
  {
    id: 9,
    serial: 'CFD-2024-WND-09',
    title: 'Solar Panel Wind Load',
    year: '2024',
    date: '04/2025',
    category: 'Wind Engineering',
    solver: 'simpleFoam',
    description: 'Aerodynamic loading study on solar panels. RANS and transient PIMPLE simulations performed to determine optimal tilt-angle load characteristics.',
    summary: 'Aerodynamic loading study on solar panels. RANS and transient PIMPLE simulations performed to determine optimal tilt-angle load characteristics.',
    specs: {
      turbulence: 'k-ε'
    },
    tags: ['Wind Load', 'ABL', 'Transient'],
    color: '#90e0ef',
    learnings: [
      'Analyzed wind loading effects',
      'Optimized tilt angle',
      'Developed ABL profiles'
    ],
    approach: 'Steady-state RANS simpleFoam with atmospheric boundary layer (ABL) velocity profile inlet.',
    result: 'Determined critical vortex shedding frequencies causing structural vibration at optimal tilt angle.',
    metrics: ['Turbulence: k-ε', 'Solver: simpleFoam', 'ABL Profile: Implemented'],
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
          alt: 'Solar Panel Wind Streamlines 1',
        },
        {
          label: 'CAM 2: PRESSURE & VORTEX WAKE',
          src: 'https://youtu.be/vk0DZnuVfNo',
          alt: 'Solar Panel Wind Streamlines 2',
        },
      ],
      video: {
        src: 'https://youtu.be/4Jfo9_4OumM',
        alt: 'Solar Panel Wind Streamlines',
      },
    },
    details: {
      setup: 'Solar panel array ground mount under freestream wind.',
      mesh: 'Hexahedral unstructured mesh (8.5M cells).',
      solver: 'simpleFoam with k-epsilon ABL turbulence model.',
      turbulence: 'k-ε',
    },
  },
  {
    id: 10,
    serial: 'CFD-2024-MXG-10',
    title: 'Stirred Tank Mixing',
    year: '2024',
    date: '02/2024',
    category: 'Multiphase Flow',
    solver: 'twoPhaseEulerFoam',
    description: 'Multiphase mixing simulation in a stirred tank using the MRF approach to model impeller rotation. Captured gas–liquid interaction and evaluated mixing efficiency and flow patterns.',
    summary: 'Multiphase mixing simulation in a stirred tank using the MRF approach to model impeller rotation. Captured gas–liquid interaction and evaluated mixing efficiency and flow patterns.',
    specs: {
      turbulence: 'mixture k-ε'
    },
    tags: ['Mixing', 'MRF', 'Gas-Liquid'],
    color: '#00a896',
    learnings: [
      'Implemented MRF for impeller rotation',
      'Simulated gas–liquid flow behavior',
      'Analyzed mixing uniformity and turbulence characteristics'
    ],
    approach: 'Multiple Reference Frame (MRF) impeller rotation model combined with Eulerian-Eulerian two-phase solver.',
    result: 'Quantified gas hold-up and power number characteristics across varying impeller speeds.',
    metrics: ['Solver: twoPhaseEulerFoam', 'Approach: MRF', 'Turbulence: mixture k-ε'],
    controlDict: `application     twoPhaseEulerFoam;
startFrom       startTime;
startTime       0;
stopAt          endTime;
endTime         5.0;
deltaT          1e-4;`,
    media: {
      videos: [
        {
          label: 'CAM 1: GAS-LIQUID MIXING FIELD',
          src: 'https://youtu.be/KbNo_iCuDbo?si=EdVwEDOwPyTG4qcp',
          alt: 'Stirred Tank Mixing Animation',
        },
      ],
      video: {
        src: 'https://youtu.be/KbNo_iCuDbo?si=EdVwEDOwPyTG4qcp',
        alt: 'Stirred Tank Mixing Animation',
      },
    },
    details: {
      setup: 'Standard baffled stirred tank with Rushton turbine impeller.',
      mesh: 'Structured blockMesh with refined grid in impeller MRF region.',
      solver: 'twoPhaseEulerFoam multi-phase Eulerian solver.',
      turbulence: 'mixture k-ε',
    },
  },
  {
    id: 11,
    serial: 'CFD-2024-AER-11',
    title: 'FSAE Car Simulation',
    year: '2024',
    date: '12/2024',
    category: 'Vehicle Aerodynamics',
    solver: 'pimpleFoam',
    description: 'Flow simulation of a Formula SAE racecar to optimize aerodynamic balance and drag-to-lift ratio using transient PIMPLE coupling.',
    summary: 'Flow simulation of a Formula SAE racecar to optimize aerodynamic balance and drag-to-lift ratio using transient PIMPLE coupling.',
    specs: {
      turbulence: 'k-ω SST'
    },
    tags: ['FSAE', 'Transient', 'Vehicle'],
    color: '#00b4d8',
    learnings: [
      'Optimized aerodynamic balance',
      'Analyzed transient flow effects',
      'Improved drag-to-lift ratio'
    ],
    approach: 'Transient PIMPLE solver with body motion and front/rear wing vortex interaction tracking.',
    result: 'Optimized front wing endplate angle and rear wing gurney flap height for maximum cornering downforce.',
    metrics: ['Solver: pimpleFoam', 'Turbulence: k-ω SST', 'Target: Max Downforce'],
    controlDict: `application     pimpleFoam;
startFrom       startTime;
startTime       0;
stopAt          endTime;
endTime         0.3;
deltaT          1e-4;`,
    media: {
      videos: [
        {
          label: 'CAM 1: FSAE AERO FLOW FIELD 1',
          src: 'https://youtu.be/iIikI_LeR7M',
          alt: 'FSAE Car Aerodynamics 1',
        },
        {
          label: 'CAM 2: FSAE AERO FLOW FIELD 2',
          src: 'https://youtu.be/rgmIqWjOfpo',
          alt: 'FSAE Car Aerodynamics 2',
        },
      ],
      video: {
        src: 'https://youtu.be/iIikI_LeR7M',
        alt: 'FSAE Car Aerodynamics',
      },
    },
    details: {
      setup: 'Full 1:1 scale Formula SAE car model with full aerodynamic package in virtual wind tunnel.',
      mesh: '18.4M polyhedral cell mesh with fine boundary layers on aerodynamic surfaces.',
      solver: 'pimpleFoam transient incompressible solver.',
      turbulence: 'k-ω SST',
    },
  },
  {
    id: 12,
    serial: 'CFD-2025-HSP-12',
    title: 'Supersonic Airfoil',
    year: '2025',
    date: '06/2025',
    category: 'High-Speed Flow',
    solver: 'sonicFoam',
    description: 'Supersonic flow simulation over a wedge-type airfoil capturing shock formation, expansion fans, and pressure distribution at Mach 2.0.',
    summary: 'Supersonic flow simulation over a wedge-type airfoil capturing shock formation, expansion fans, and pressure distribution at Mach 2.0.',
    specs: {
      turbulence: 'Spalart–Allmaras'
    },
    tags: ['Compressible', 'Shock', 'Supersonic'],
    color: '#0077b6',
    learnings: [
      'Captured shock wave formation',
      'Analyzed expansion fans',
      'Validated supersonic flow physics'
    ],
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
          label: 'CAM 2: PRESSURE CONTOURS',
          src: '/OpenFoam/SupersonicAirfoil/SupersonicAirfoil p.mp4',
          poster: '/OpenFoam/SupersonicAirfoil/SupersonicAirfoil p.mp4',
          alt: 'Supersonic Airfoil Pressure Contours',
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
    id: 13,
    serial: 'CFD-2025-HSP-13',
    title: 'Supersonic Prism',
    year: '2025',
    date: '06/2025',
    category: 'High-Speed Flow',
    solver: 'sonicFoam',
    description: 'Compressible flow past a sharp-edged prism generating oblique shock structures and expansion fans, analyzed for Mach 3 freestream.',
    summary: 'Compressible flow past a sharp-edged prism generating oblique shock structures and expansion fans, analyzed for Mach 3 freestream.',
    specs: {
      turbulence: 'Spalart–Allmaras'
    },
    tags: ['Mach Flow', 'Shock Wave', 'Compressible'],
    color: '#023e8a',
    learnings: [
      'Modeled oblique shock structures',
      'Analyzed Mach 3 flow features',
      'Captured expansion fan dynamics'
    ],
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