// src/upcoming/upcomingData.jsx
const upcomingProjects = [
  {
    id: 'phd-research',
    title: 'PhD Research',
    shortTitle: 'PhD',
    category: 'Academic',
    description: 'Pursuing advanced research in computational fluid dynamics and aeroacoustics.',
    icon: '🎓',
    color: '#00E0FF',
    status: 'Planning',
    timeline: '2025+',
    details: 'Exploring opportunities in CFD, aeroacoustics, and machine learning applications in fluid mechanics.',
    tags: ['Research', 'CFD', 'Academia']
  },
  {
    id: 'ai-cfd-framework',
    title: 'AI-Powered CFD Framework',
    shortTitle: 'AI-CFD',
    category: 'Software',
    description: 'Machine learning framework for automated mesh generation and solver optimization.',
    icon: '🤖',
    color: '#FF3CA6',
    status: 'Concept',
    timeline: '2025',
    details: 'Developing ML models to automate meshing decisions and predict optimal solver parameters for OpenFOAM cases.',
    tags: ['AI', 'OpenFOAM', 'Automation']
  },
  {
    id: 'realtime-viz',
    title: 'Real-time Flow Visualizer',
    shortTitle: 'RT-Viz',
    category: 'Visualization',
    description: 'WebGL-based real-time CFD visualization platform with interactive controls.',
    icon: '🌊',
    color: '#FF8C3C',
    status: 'Early Dev',
    timeline: '2025',
    details: 'Browser-based tool for streaming and visualizing CFD results in real-time with GPU acceleration.',
    tags: ['WebGL', 'Visualization', 'Real-time']
  },
  {
    id: 'drone-swarm',
    title: 'Drone Swarm Aerodynamics',
    shortTitle: 'Swarm',
    category: 'Research',
    description: 'Multi-drone interaction studies using high-fidelity LES simulations.',
    icon: '🚁',
    color: '#06FFA5',
    status: 'Proposal',
    timeline: '2025-2026',
    details: 'Investigating wake interactions and formation flight efficiency in multi-drone systems.',
    tags: ['Drones', 'LES', 'Aerodynamics']
  },
  {
    id: 'quantum-cfd',
    title: 'Quantum Computing for CFD',
    shortTitle: 'Q-CFD',
    category: 'Experimental',
    description: 'Exploring quantum algorithms for solving Navier-Stokes equations.',
    icon: '⚛️',
    color: '#9D4EDD',
    status: 'Research',
    timeline: '2026+',
    details: 'Investigating potential of quantum computing to revolutionize computational fluid dynamics.',
    tags: ['Quantum', 'Future Tech', 'CFD']
  },
  {
    id: 'open-platform',
    title: 'Open Engineering Platform',
    shortTitle: 'Platform',
    category: 'Community',
    description: 'Open-source platform for sharing CFD cases, meshes, and best practices.',
    icon: '🌐',
    color: '#48CAE4',
    status: 'Vision',
    timeline: 'TBD',
    details: 'Building a community-driven platform for engineers to collaborate and share CFD knowledge.',
    tags: ['Open Source', 'Community', 'Education']
  }
];

export default upcomingProjects;