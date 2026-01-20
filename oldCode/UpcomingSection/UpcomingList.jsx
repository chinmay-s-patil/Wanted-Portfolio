const upcomingProjects = [
  {
    id: 1,
    title: '6DOF Turbine Motion',
    category: 'Wind Energy',
    status: 'In Progress',
    progress: 65,
    description: 'Implementing 6DOF mesh motion method to simulate wind turbine blade rotation driven by aerodynamic forces. Working on coupling fluid forces with rigid body dynamics.',
    challenges: ['Mesh deformation stability', 'Force coupling accuracy', 'Convergence at high rotation speeds'],
    solver: 'pimpleFoam + 6DOF',
    color: '#48cae4',
    icon: '🌪️',
    estimatedCompletion: 'Feb 2025'
  },
  {
    id: 2,
    title: 'Multi-Phase Boiling Solver',
    category: 'Phase Change',
    status: 'Early Development',
    progress: 30,
    description: 'Developing a custom solver for 3-phase simulation with phase change to accurately model boiling phenomena. Implementing temperature-dependent phase transition models.',
    challenges: ['Phase interface tracking', 'Heat transfer at phase boundaries', 'Nucleation modeling'],
    solver: 'Custom multiphaseEulerFoam',
    color: '#ff006e',
    icon: '♨️',
    estimatedCompletion: 'Apr 2025'
  },
  {
    id: 3,
    title: 'Battery Thermal CHT',
    category: 'Thermal Management',
    status: 'In Progress',
    progress: 50,
    description: 'Replicating the battery cooling mechanism in OpenFOAM using chtMultiRegionFoam. Validating results against commercial CFD to create an open-source alternative.',
    challenges: ['Material property calibration', 'PCM modeling', 'Multi-region coupling'],
    solver: 'chtMultiRegionFoam',
    color: '#06ffa5',
    icon: '🔋',
    estimatedCompletion: 'Mar 2025'
  },
  {
    id: 4,
    title: 'Bubble Rise Dynamics',
    category: 'Multiphase Flow',
    status: 'Testing',
    progress: 75,
    description: 'High-fidelity simulation of bubble rise with surface tension and shape deformation. Studying terminal velocity and wake patterns for different bubble sizes.',
    challenges: ['Surface tension accuracy', 'Mesh resolution requirements', 'Shape oscillations'],
    solver: 'interIsoFoam',
    color: '#00b4d8',
    icon: '🫧',
    estimatedCompletion: 'Feb 2025'
  },
  {
    id: 5,
    title: 'Pillar Separation (Enhanced)',
    category: 'Free Surface',
    status: 'In Progress',
    progress: 40,
    description: 'Improved simulation of water flow around bridge pillars with physically accurate free surface deflection. Implementing better outlet conditions and AMR for interface resolution.',
    challenges: ['Outlet boundary stability', 'Surface ripple accuracy', 'Long-term stability'],
    solver: 'interFoam + AMR',
    color: '#0077b6',
    icon: '🌊',
    estimatedCompletion: 'Mar 2025'
  },
  {
    id: 6,
    title: 'SpoonSplash Debug',
    category: 'Multiphase Impact',
    status: 'Debugging',
    progress: 20,
    description: 'Water stream impact on spoon surface. Currently debugging timestep collapse at impact moment (t→10⁻¹⁵). Investigating contact angle and mesh refinement strategies.',
    challenges: ['Timestep stability at impact', 'Contact line modeling', 'Extreme mesh refinement'],
    solver: 'interFoam',
    color: '#ff9500',
    icon: '🥄',
    estimatedCompletion: 'TBD'
  },
  {
    id: 7,
    title: 'Water Bottle Flip',
    category: 'Sloshing',
    status: 'Planning',
    progress: 10,
    description: 'Simulating bottle flip dynamics with internal water sloshing. Coupling 6DOF motion with multiphase flow to capture realistic fluid-structure interaction during rotation.',
    challenges: ['Violent sloshing', '6DOF + VOF coupling', 'Air entrainment'],
    solver: 'interFoam + 6DOF',
    color: '#9d4edd',
    icon: '🍾',
    estimatedCompletion: 'May 2025'
  }
];

export default upcomingProjects;