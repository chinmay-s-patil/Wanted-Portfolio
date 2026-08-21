// src/education/lockers.jsx
// 2-Row School Locker Bank Data

const lockers = [
  // REAL LOCKER: M.Sc. TUM (Row 1, Pos 2)
  {
    id: 'masters',
    row: 1,
    col: 2,
    locked: false,
    label: 'M.Sc.',
    number: '042',
    color: '#1e3a8a', // Dark Vintage Navy
    degree: 'Aerospace Engineering',
    title: 'Master of Science',
    institution: 'Technical University of Munich',
    shortName: 'TUM',
    period: 'Oct 2025 – Present',
    location: 'Munich, Germany',
    description:
      'Pursuing advanced studies in aerospace engineering with specialization in computational fluid dynamics and aerodynamics. Engaging with cutting-edge research in turbulence modeling, high-performance computing, and numerical methods for complex flow simulations.',
    note: 'Moved to Germany for this. High-altitude CFD research!',
    highlights: [
      'Specialization: CFD & Aeroacoustics',
      'Research: Turbulence modeling and HPC',
      'Key courses: Compressible Flows, Advanced CFD, Numerical Methods'
    ],
    skills: ['Advanced CFD', 'Turbulence Modeling', 'HPC', 'Numerical Methods', 'Aerodynamics', 'Research'],
    images: [
      '/Education/TUM/TUM (1).jpg',
      '/Education/TUM/TUM (2).jpg',
      '/Education/TUM/TUM (3).jpg',
      '/Education/TUM/TUM (4).jpg',
      '/Education/TUM/TUM (5).jpg',
      '/Education/TUM/TUM (6).jpg',
      '/Education/TUM/TUM (7).jpg'
    ],
    documents: [
      {
        type: 'transcript',
        title: 'Academic Transcript',
        url: '/files/tum-transcript.pdf',
        size: '1.2MB'
      }
    ],
    gpa: '–',
    focus: 'CFD & Aeroacoustics'
  },

  // REAL LOCKER: B.Tech VITC (Row 2, Pos 3)
  {
    id: 'bachelors',
    row: 2,
    col: 3,
    locked: false,
    label: 'B.Tech',
    number: '021',
    color: '#854d0e', // Aged Vintage Mustard Amber
    degree: 'Mechanical Engineering',
    title: 'Bachelor of Technology',
    institution: 'VIT Chennai',
    shortName: 'VITC',
    period: 'Jun 2021 – May 2025',
    location: 'Chennai, India',
    description:
      'Completed comprehensive undergraduate program in mechanical engineering, developing strong fundamentals in thermodynamics, fluid mechanics, and computational methods. Gained hands-on experience through laboratory work, thesis research, and technical clubs.',
    note: 'Four years, one thesis, endless late-night lab runs.',
    highlights: [
      'Thesis: Optimization of Pyrolysis-Based Plastic Oil Yield',
      'Honors distinction awarded',
      'Key courses: Heat Transfer, Fluid Mechanics, Engineering Analysis'
    ],
    skills: ['Fluid Mechanics', 'CFD', 'Heat Transfer', 'Thermodynamics', 'Engineering Analysis', 'Mechanical Design'],
    images: [
      '/Education/VITC/VITC (1).jpeg',
      '/Education/VITC/VITC (2).JPG',
      '/Education/VITC/VITC (3).jpg',
      '/Education/VITC/VITC (4).jpg',
      '/Education/VITC/VITC (5).jpg',
      '/Education/VITC/VITC (6).jpg',
      '/Education/VITC/VITC (7).jpg',
      '/Education/VITC/VITC (8).jpg'
    ],
    documents: [
      {
        type: 'thesis',
        title: 'B.Tech Thesis',
        subtitle: 'Optimization of Pyrolysis-Based Plastic Oil Yield',
        url: '/files/btech-thesis.pdf',
        size: '4.5MB',
        year: '2024–2025'
      },
      {
        type: 'transcript',
        title: 'Academic Transcript',
        url: '/files/vitc-transcript.pdf',
        size: '1.8MB'
      }
    ],
    gpa: 'Honors',
    focus: 'Thermal & Fluid Systems'
  },

  // REAL LOCKER: Ph.D. TBD (Row 2, Pos 5)
  {
    id: 'phd',
    row: 2,
    col: 5,
    locked: true,
    label: 'Ph.D.',
    number: '099',
    color: '#7f1d1d', // Dark Weathered Crimson
    message: "We ain't there yet, buddy.",
    subtitle: 'A little ambition goes a long way — plans TBD.'
  }
];

// Filler lockers that complete the 2-row x 6-column hallway grid
export const FILLER_LOCKERS = [
  { id: 'f-101', number: '101', row: 1, col: 1, color: '#134e4a' }, // Dark Oxidized Teal
  { id: 'f-103', number: '103', row: 1, col: 3, color: '#854d0e' }, // Aged Amber
  { id: 'f-104', number: '104', row: 1, col: 4, color: '#7f1d1d' }, // Weathered Crimson
  { id: 'f-105', number: '105', row: 1, col: 5, color: '#1e3a8a' }, // Dark Navy
  { id: 'f-106', number: '106', row: 1, col: 6, color: '#3f6212' }, // Dark Olive
  { id: 'f-201', number: '201', row: 2, col: 1, color: '#7f1d1d' }, // Weathered Crimson
  { id: 'f-202', number: '202', row: 2, col: 2, color: '#134e4a' }, // Dark Teal
  { id: 'f-204', number: '204', row: 2, col: 4, color: '#1e3a8a' }, // Dark Navy
  { id: 'f-206', number: '206', row: 2, col: 6, color: '#7f1d1d' }, // Weathered Crimson
];

export default lockers;