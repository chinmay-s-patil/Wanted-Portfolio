const diaryEntries = [
  {
    id: 'raphe-2025',
    organization: 'Raphe mPhibr',
    role: 'Mechanical Research Engineer',
    location: 'Bangalore, India',
    type: 'Full-time',
    dates: { start: 'Jun 2025', end: 'Sep 2025' },
    docLink: 'https://drive.google.com/file/d/1kZw5QMfmdk21punjNEhZvco_imetERFV/view?usp=sharing',
    docLabel: 'Experience Letter',
    summary: 'Led drone design and manufacturing with focus on design for additive manufacturing (DFAM). Developed multiple drone platforms from concept to production.',
    tools: ['DFAM', 'Python', 'Mechanical Design', 'Additive Manufacturing'],
    photos: [
      '/Experience/Raphe/slideshow/Raphe1.jpg',
      '/Experience/Raphe/slideshow/Raphe2.jpg',
      '/Experience/Raphe/slideshow/Raphe3.jpg',
    ],
    notes: [
      'Led end-to-end design and manufacturing of multiple drone platforms',
      'Implemented DFAM principles focusing on self-supporting structures and minimum layer height optimization',
      'Developed Python-based automation tools for data post-processing workflows',
      'Coordinated multidisciplinary teams across mechanical, electronics, and software domains'
    ],
    insight: 'Manufacturing constraints should drive design decisions from day one—DFAM isn\'t an afterthought, it\'s a design philosophy.'
  },
  {
    id: 'iisc-2025',
    organization: 'IISc Bangalore',
    role: 'Research Intern (NMCAD Lab)',
    location: 'Bangalore, India',
    type: 'Internship',
    dates: { start: 'Apr 2025', end: 'Jun 2025' },
    docLink: 'https://drive.google.com/file/d/1jQnq-WgxQFmiO5LiFaZ9WaNsqhNnt_4B/view?usp=sharing',
    docLabel: 'Offer Letter',
    summary: 'Advanced aeroacoustic simulations studying rotor-wake interactions using hybrid CFD/CAA approaches in OpenFOAM and ANSYS Fluent.',
    tools: ['OpenFOAM', 'ANSYS Fluent', 'LES', 'Aeroacoustics', 'FW-H Analogy'],
    photos: [
      '/Experience/IISc/Slideshow/IISc (1).jpg',
      '/Experience/IISc/Slideshow/IISc (2).jpg',
      '/Experience/IISc/Slideshow/IISc (3).jpg',
    ],
    notes: [
      'Simulated high-fidelity rotor-wake interactions in OpenFOAM with custom boundary conditions',
      'Conducted LES-based aeroacoustic analysis in ANSYS Fluent using LES coupled with FW-H method',
      'Integrated Ffowcs Williams–Hawkings analogy for propeller noise characterization',
      'Collaborated with leading aerospace faculty on cutting-edge research projects'
    ],
    insight: 'Hybrid CFD/CAA methods reveal acoustic physics that pure simulations miss—the coupling between flow and sound is everything.'
  },
  {
    id: 'csir-2024',
    organization: 'CSIR SERC',
    role: 'Research Intern',
    location: 'Chennai, India',
    type: 'Internship',
    dates: { start: 'Jun 2024', end: 'Jul 2024' },
    docLink: 'https://drive.google.com/file/d/1T5iPTYwHuFICf6Acwmxv6Cxb7obufis7/view?usp=sharing',
    docLabel: 'Certificate',
    summary: 'Wind engineering CFD analysis for drone propeller efficiency assessment using OpenFOAM in the Wind Engineering Laboratory.',
    tools: ['OpenFOAM', 'Wind Engineering', 'Python', 'CFD Post-Processing'],
    photos: [
      '/Experience/CSIR SERC/CSIR SERC (1).jpg',
      '/Experience/CSIR SERC/CSIR SERC (2).jpg',
      '/Experience/CSIR SERC/CSIR SERC (3).jpg',
      '/Experience/CSIR SERC/CSIR SERC (4).jpg',
      '/Experience/CSIR SERC/CSIR SERC (5).jpg',
      '/Experience/CSIR SERC/CSIR SERC (6).jpg',
      '/Experience/CSIR SERC/CSIR SERC (7).jpg',
      '/Experience/CSIR SERC/CSIR SERC (8).jpg',
      '/Experience/CSIR SERC/CSIR SERC (9).jpg',
      '/Experience/CSIR SERC/CSIR SERC (10).jpg',
      '/Experience/CSIR SERC/CSIR SERC (11).jpg',
      '/Experience/CSIR SERC/CSIR SERC (12).jpg',
      '/Experience/CSIR SERC/CSIR SERC (13).jpg',
    ],
    notes: [
      'Independently learned OpenFOAM through self-study under Keerthana Mohan and applied it to drone propeller simulations',
      'Executed CFD analysis to assess drone propeller efficiency under various wind conditions',
      'Validated simulation results against experimental measurements from wind tunnel tests',
      'Gained exposure to advanced materials characterization labs, Wind Engineering, and Seismic Testing facilities'
    ],
    insight: 'Self-learning OpenFOAM was a steep climb, but it opened the door to every CFD opportunity that followed.'
  },
  {
    id: 'vitc-2023',
    organization: 'VIT Chennai',
    role: 'Project Intern',
    location: 'Chennai, India',
    type: 'Internship',
    dates: { start: 'Nov 2023', end: 'Dec 2023' },
    docLink: 'https://drive.google.com/file/d/1Tm8V9eDOU17EbgsOcWTIaoYo0ijaAWjC/view?usp=sharing',
    docLabel: 'Certificate',
    summary: 'Fracture mechanics research combining COMSOL simulations with machine learning for crack propagation prediction.',
    tools: ['COMSOL', 'Python', 'Machine Learning', 'Neural Networks', 'Data Science'],
    photos: [
      '/Experience/VIT/VIT (1).jpg',
      '/Experience/VIT/VIT (2).jpg',
      '/Experience/VIT/VIT (3).jpg',
      '/Experience/VIT/VIT (4).jpg',
      '/Experience/VIT/VIT (5).jpg',
      '/Experience/VIT/VIT (6).jpg',
    ],
    notes: [
      'Simulated an angled crack in a plate with COMSOL Multiphysics to evaluate the J-Integral in fracture mechanics',
      'Compiled a dataset exceeding 172,000 data points to support advanced research',
      'Developed Machine Learning models and Neural Networks to predict simulation outcomes with 99.99% accuracy',
      'Automated simulation data workflows using Python scripting'
    ],
    insight: 'Large, well-structured datasets transform simulation from an art into predictive science—data quality matters more than model complexity.'
  },
  {
    id: 'appbell-2023',
    organization: 'Appbell Technologies',
    role: 'Full Stack Development Intern',
    location: 'Remote',
    type: 'Internship',
    dates: { start: 'Sep 2023', end: 'Nov 2023' },
    docLink: 'https://drive.google.com/file/d/1oBqOugw-Qolw-2qchQlQ7v6_igZGZPk9/view?usp=sharing',
    docLabel: 'Certificate',
    summary: 'Full-stack development focusing on facial recognition systems for attendance tracking and API integration with legacy systems.',
    tools: ['Python', 'API Development', 'Android', 'Facial Recognition', 'Machine Learning'],
    photos: [
      '/Experience/AppBell/AppBell (1).png',
      '/Experience/AppBell/AppBell (2).png',
      '/Experience/AppBell/AppBell (3).png',
    ],
    notes: [
      'Evaluated and enhanced facial recognition algorithms using Python to optimize attendance tracking',
      'Developed and integrated an API to embed facial recognition into existing systems',
      'Explored Android application development to improve API accessibility and user experience',
      'Learned practical challenges of deploying ML models in production environments'
    ],
    insight: 'Real-world ML is 90% data cleaning and edge case handling, 10% modeling—production deployment teaches what textbooks can\'t.'
  }
];

export default diaryEntries;