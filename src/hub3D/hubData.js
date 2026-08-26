export const hubItems = [
  // --- CENTER ZONE (Detective Desk & Wall Terminal) ---
  {
    id: 'landing',
    label: 'Landing',
    theme: 'Daily Newspaper',
    icon: '📰',
    path: '/',
    zone: 'center',
    position: [-0.45, 0.795, 0.12],
    outlineSize: [0.65, 0.1, 0.45],
    description: 'Fresh edition of the Daily News covering key investigations.'
  },
  {
    id: 'professionaldiary',
    label: 'Professional Timeline',
    theme: 'Detective Case Logbook',
    icon: '📔',
    path: '/professionaldiary',
    zone: 'center',
    position: [0.42, 0.795, 0.08],
    outlineSize: [0.48, 0.1, 0.4],
    description: 'Chronological archive of major career cases and work experience.'
  },
  {
    id: 'contactme',
    label: 'Contact Me',
    theme: 'Vintage Rotary Phone',
    icon: '☎️',
    path: '/contactme',
    zone: 'center',
    position: [0.62, 0.88, -0.22],
    outlineSize: [0.35, 0.35, 0.35],
    description: 'Direct hot-line telephone to reach out for inquiries or collaboration.'
  },
  {
    id: 'solvers',
    label: 'Solvers',
    theme: 'Sci-Fi Workstation Terminal',
    icon: '💻',
    path: '/solvers',
    zone: 'center',
    position: [-1.95, 0.85, -1.6],
    outlineSize: [1.1, 1.6, 0.9],
    description: 'Heavy floor-standing industrial sci-fi workstation running computational solvers.'
  },

  // --- LEFT ZONE (Archival & Evidence Wing) ---
  {
    id: 'education',
    label: 'Education',
    theme: 'Evidence Lockers',
    icon: '🔒',
    path: '/education',
    zone: 'left',
    position: [-3.6, 0.8, -1.8],
    outlineSize: [0.75, 1.6, 0.7],
    description: 'Academic credentials and degree records sealed in evidence lockers.'
  },
  {
    id: 'projects',
    label: 'Projects',
    theme: 'Police Filing Cabinet',
    icon: '🗄️',
    path: '/projects',
    zone: 'left',
    position: [-3.6, 0.725, 0.0],
    outlineSize: [0.75, 1.45, 0.75],
    description: 'Heavy steel filing cabinet containing categorized case project files.'
  },
  {
    id: 'openfoam',
    label: 'OpenFOAM',
    theme: 'Drive-In Movie Car',
    icon: '🚘',
    path: '/openfoam',
    zone: 'left',
    position: [-3.4, 0.32, 1.8],
    outlineSize: [1.1, 0.75, 1.4],
    description: 'Classic retro drive-in cinema car with glowing headlights.'
  },

  // --- RIGHT ZONE (Tech & Media Laboratory) ---
  {
    id: 'cad',
    label: 'CAD',
    theme: 'Industrial 3D Printer',
    icon: '🖨️',
    path: '/cad',
    zone: 'right',
    position: [3.6, 1.12, -1.8],
    outlineSize: [0.8, 0.85, 0.75],
    description: 'High-precision enclosed industrial 3D printer manufacturing CAD prototypes.'
  },
  {
    id: 'visualization',
    label: 'Visualization',
    theme: 'Vintage Retro Computer',
    icon: '🖥️',
    path: '/visualization',
    zone: 'right',
    position: [3.6, 1.08, 0.0],
    outlineSize: [0.75, 0.85, 0.7],
    description: 'Vintage IBM-style mainframe terminal with green CRT raster screen.'
  },
  {
    id: 'events',
    label: 'Events',
    theme: '35mm Film Camera Roll',
    icon: '🎞️',
    path: '/events',
    zone: 'right',
    position: [3.6, 0.94, 1.8],
    outlineSize: [0.7, 0.45, 0.65],
    description: 'Vintage 35mm film canister with unspooled camera roll photo strip.'
  },

  // --- BACK ZONE (Surveillance & Investigation Wall) ---
  {
    id: 'upcoming',
    label: 'Upcoming',
    theme: 'Radar Telemetry Scope',
    icon: '✈️',
    path: '/upcoming',
    zone: 'back',
    position: [-1.8, 1.65, 3.35],
    outlineSize: [0.75, 0.75, 0.25],
    description: 'Sweeping radar scope monitoring future developments and missions.'
  },
  {
    id: 'hub',
    label: '2D Investigation Hub',
    theme: 'Corkboard Evidence Map',
    icon: '📌',
    path: '/hub',
    zone: 'back',
    position: [1.8, 1.6, 3.35],
    outlineSize: [1.25, 0.95, 0.18],
    description: 'Detective corkboard map linking all evidence back to 2D view.'
  }
]

export const hubObjectNames = hubItems.reduce((acc, item) => {
  acc[`hub_${item.id}`] = item.path
  return acc
}, {})