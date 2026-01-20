const diaryEntries = [
  {
    id: 'raphe-2025',
    organization: 'Raphe mPhibr',
    role: 'Mechanical Research Engineer',
    location: 'Bangalore, India',
    type: 'Full-time',
    dates: { start: '2025-06', end: '2025-09' },
    summary: 'Led drone design and manufacturing with focus on DFAM principles.',
    tools: ['DFAM', 'Python', 'Mechanical Design'],
    photos: [
      { url: '/photos/drone-design.jpg', caption: 'Drone assembly line' },
      { url: '/photos/3d-printed-parts.jpg', caption: 'DFAM optimized parts' }
    ],
    notes: [
      'Led end-to-end drone platform design and manufacturing',
      'Implemented DFAM with self-supporting structures',
      'Optimized data post-processing workflows using Python',
      'Coordinated multidisciplinary teams on project milestones'
    ],
    insight: 'Automation in manufacturing matters as much as the design itself.'
  },
  {
    id: 'iisc-2025',
    organization: 'IISc Bangalore',
    role: 'Research Intern',
    location: 'Bangalore, India',
    type: 'Internship',
    dates: { start: '2025-04', end: '2025-06' },
    summary: 'Advanced aeroacoustic simulations for rotor-wake interactions.',
    tools: ['OpenFOAM', 'Ansys Fluent', 'LES', 'FW-H'],
    photos: [
      { url: '/photos/simulation-viz.jpg', caption: 'Rotor wake simulation' },
      { url: '/photos/acoustic-analysis.jpg', caption: 'Noise propagation analysis' }
    ],
    notes: [
      'Simulated high-fidelity rotor-wake interactions in OpenFOAM',
      'Conducted LES-based aeroacoustic analysis in Ansys Fluent',
      'Applied Ffowcs Williams–Hawkings analogy for noise prediction',
      'Collaborated with faculty on aerospace research projects'
    ],
    insight: 'Hybrid CFD/CAA approaches reveal physics that pure simulations miss.'
  },
  {
    id: 'csir-2024',
    organization: 'CSIR SERC',
    role: 'Research Intern',
    location: 'Chennai, India',
    type: 'Internship',
    dates: { start: '2024-06', end: '2024-07' },
    summary: 'Wind engineering CFD for drone propeller efficiency analysis.',
    tools: ['OpenFOAM', 'Wind Engineering', 'Python'],
    photos: [
      { url: '/photos/wind-tunnel.jpg', caption: 'Wind tunnel validation' },
      { url: '/photos/propeller-cfd.jpg', caption: 'Propeller efficiency study' }
    ],
    notes: [
      'Independently learned and applied OpenFOAM for drone simulations',
      'Ran propeller efficiency analysis in wind tunnel conditions',
      'Validated CFD results against experimental measurements',
      'Gained exposure to advanced materials characterization labs'
    ],
    insight: 'Self-learning OpenFOAM was steep, but opened countless doors.'
  },
  {
    id: 'vitc-2023',
    organization: 'VIT Chennai',
    role: 'Project Intern',
    location: 'Chennai, India',
    type: 'Internship',
    dates: { start: '2023-11', end: '2023-12' },
    summary: 'Fracture mechanics simulation with ML prediction models.',
    tools: ['COMSOL', 'Python', 'Machine Learning'],
    photos: [
      { url: '/photos/fracture-simulation.jpg', caption: 'Crack propagation analysis' },
      { url: '/photos/ml-accuracy.jpg', caption: '99.99% accuracy model results' }
    ],
    notes: [
      'Simulated angled crack propagation using J-integral method',
      'Compiled 172k+ fracture simulation data points',
      'Developed neural networks achieving 99.99% accuracy',
      'Automated simulation data processing workflows'
    ],
    insight: 'Large datasets transform simulation from art to predictive science.'
  },
  {
    id: 'appbell-2023',
    organization: 'Appbell Technologies',
    role: 'Full Stack Development Intern',
    location: 'Remote',
    type: 'Internship',
    dates: { start: '2023-09', end: '2023-11' },
    summary: 'Enhanced facial recognition systems and API development.',
    tools: ['Python', 'API Development', 'Android', 'ML'],
    photos: [
      { url: '/photos/facial-recog.jpg', caption: 'Face recognition system' },
      { url: '/photos/api-dashboard.jpg', caption: 'API performance dashboard' }
    ],
    notes: [
      'Improved facial recognition accuracy for attendance systems',
      'Developed robust API for facial recognition integration',
      'Contributed to Android app frontend enhancements',
      'Learned production deployment and real-world ML challenges'
    ],
    insight: 'Real-world ML is 90% data cleaning, 10% modeling.'
  }
];

export default diaryEntries;